import { Question } from '@/types/quiz';
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { useAuthStore } from '@/stores/auth';
import { usePaymentAccess } from '@/hooks/usePaymentAccess';
import { useQuestionCounter } from '@/hooks/useQuestionCounter';
import { getQuestions } from '@/lib/topics';

export default function QuizPage() {
  const { topicId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, isAuthenticated } = useAuthStore();
  const { hasAccess, loading: accessLoading } = usePaymentAccess();
  const { questionsAnswered, incrementCounter, hasReachedLimit, QUESTION_LIMIT } = useQuestionCounter();

  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [score, setScore] = useState(0);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Get current question safely
  const currentQ = questions[currentQuestion] || { 
    question: '',
    options: [],
    correct_answer: '',
    explanation: '',
    id: ''
  };

  useEffect(() => {
    if (!topicId) return;

    async function fetchQuestions() {
      try {
        const fetchedQuestions = await getQuestions(topicId);
        console.log('Fetched questions:', fetchedQuestions); // Add this line for debugging
        
        // Validate question format
        const validQuestions = fetchedQuestions.filter(q => 
          q && 
          Array.isArray(q.options) && 
          q.options.length > 0 &&
          typeof q.question === 'string' &&
          typeof q.correct_answer === 'string'
        );

        if (validQuestions.length === 0) {
          throw new Error('No valid questions found');
        }

        setQuestions(validQuestions);
      } catch (error) {
        console.error('Error fetching questions:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Could not load quiz questions. Please try again.",
        });
        navigate('/topics');
      } finally {
        setLoading(false);
      }
    }

    fetchQuestions();
  }, [topicId, toast, navigate]);

  // Temporarily disabled payment modal
  // useEffect(() => {
  //   // Only check for payment access if the user is authenticated
  //   // This prevents the payment modal from showing for non-authenticated users
  //   if (isAuthenticated && !accessLoading && !hasAccess) {
  //     setShowPaymentModal(true);
  //   }
  // }, [accessLoading, hasAccess, isAuthenticated]);

  // Separate useEffect for checking free question limit
  useEffect(() => {
    // Check if freemium mode is enabled
    const freemiumEnabled = localStorage.getItem('freemium-enabled') !== 'false';

    // Only check the limit if freemium mode is enabled
    if (freemiumEnabled && hasReachedLimit() && !isAuthenticated) {
      setShowSignupModal(true);
    }
  }, [isAuthenticated, hasReachedLimit]);

  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswer(answer);
  };

  const handleNext = async () => {
    if (!selectedAnswer) return;

    const currentQ = questions[currentQuestion];
    const isCorrect = selectedAnswer === currentQ.correct_answer;

    if (isCorrect) {
      setScore(prev => prev + 1);
    }

    // Log the current state before incrementing
    console.log('Before increment - Questions answered:', questionsAnswered);

    // Increment the question counter for freemium model
    incrementCounter();

    // Log after incrementing to verify it worked
    console.log('After increment - Questions answered should be:', questionsAnswered + 1);

    setShowExplanation(true);

    // If this was the last question
    if (currentQuestion === questions.length - 1) {
      setSubmitting(true);
      try {
        // Only save results if user is authenticated
        if (isAuthenticated && user?.id) {
          await saveQuizResult(
            user.id,
            topicId!,
            score + (isCorrect ? 1 : 0),
            questions.length
          );
        }

        // Navigate to results after a short delay to show the explanation
        setTimeout(() => {
          navigate('/results', {
            state: {
              score: score + (isCorrect ? 1 : 0),
              total: questions.length,
              topicId
            }
          });
        }, 2000);
      } catch (error) {
        console.error('Error saving results:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Could not save quiz results. Please try again.",
        });
      } finally {
        setSubmitting(false);
      }
    } else {
      // Always move to the next question, even if the user has reached the limit
      // The signup modal will be shown via the useEffect hook if needed
      setTimeout(() => {
        setCurrentQuestion(prev => prev + 1);
        setSelectedAnswer('');
        setShowExplanation(false);

        // Check if freemium mode is enabled
        const freemiumEnabled = localStorage.getItem('freemium-enabled') !== 'false';

        // If freemium is enabled and user has reached the limit and is not authenticated, show the signup modal
        if (freemiumEnabled && hasReachedLimit() && !isAuthenticated) {
          setShowSignupModal(true);
        }
      }, 2000);
    }
  };

  // Add loading state check at the top of the component
  if (loading || accessLoading) {
    return (
      <div className="container py-8">
        <h1 className="text-2xl font-bold mb-4">Loading quiz...</h1>
      </div>
    );
  }

  // Add empty state check
  if (!questions.length) {
    return (
      <div className="container py-8">
        <h1 className="text-2xl font-bold mb-4">No questions available</h1>
        <Button onClick={() => navigate('/topics')}>Back to Topics</Button>
      </div>
    );
  }

  // Temporarily disabled payment requirement
  // For authenticated users without paid access, show payment modal
  // if (isAuthenticated && !hasAccess) {
  //   return (
  //     <>
  //       <div className="container py-8">
  //         <h1 className="text-2xl font-bold mb-4">Access Required</h1>
  //         <p>Please purchase access to continue with the quiz.</p>
  //       </div>
  //       <PaymentModal
  //         open={showPaymentModal}
  //         onClose={() => setShowPaymentModal(false)}
  //       />
  //     </>
  //   );
  // }

  // For non-authenticated users who have reached the limit, we'll show the signup modal
  // but still let them continue with the current quiz
  // The modal will be shown via the useEffect hook

  if (questions.length === 0) {
    return (
      <div className="container py-8">
        <h1 className="text-2xl font-bold mb-4">No questions found</h1>
        <p>Sorry, no questions are available for this topic yet.</p>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <h1 className="text-2xl font-bold">Question {currentQuestion + 1} of {questions.length}</h1>
          {!isAuthenticated && localStorage.getItem('freemium-enabled') !== 'false' && (
            <div className="text-sm bg-amber-100 text-amber-800 px-3 py-1 rounded-full">
              {QUESTION_LIMIT - questionsAnswered} free questions left
            </div>
          )}
        </div>
        <div className="h-2 bg-gray-200 rounded">
          <div
            className="h-full bg-cyber-blue rounded"
            style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
          />
        </div>
      </div>

      <div className="space-y-6">
        <h2 className="text-xl font-semibold">{currentQ.question}</h2>

        <div className="space-y-4">
          {currentQ.options.map((option, index) => (
            <QuizOption
              key={index}
              option={option}
              selected={selectedAnswer === option}
              correct={showExplanation ? option === currentQ.correct_answer : undefined}
              onClick={() => !showExplanation && handleAnswerSelect(option)}
            />
          ))}
        </div>

        <Button
          onClick={handleNext}
          disabled={!selectedAnswer || submitting}
          className="w-full md:w-auto"
        >
          {currentQuestion === questions.length - 1 ? 'Finish Quiz' : 'Next Question'}
        </Button>
      </div>

      {showExplanation && (
        <ExplanationModal
          question={{
            question: currentQ.question,
            explanation: currentQ.explanation,
            correct_answer: currentQ.correct_answer,
            options: currentQ.options
          }}
          isOpen={showExplanation}
          questionId={currentQ.id}
          onClose={() => setShowExplanation(false)}
          onNext={() => {
            if (currentQuestion < questions.length - 1) {
              setCurrentQuestion(prev => prev + 1);
              setSelectedAnswer('');
              setShowExplanation(false);
            } else {
              navigate('/results', {
                state: {
                  score: score,
                  total: questions.length,
                  topicId
                }
              });
            }
          }}
        />
      )}

      {/* Signup Modal for freemium model */}
      <SignupModal
        open={showSignupModal}
        onClose={() => setShowSignupModal(false)}
        questionsAnswered={questionsAnswered}
        questionLimit={QUESTION_LIMIT}
      />

      {/* Debug counter - remove in production */}
      <DebugCounter />
    </div>
  );
}
