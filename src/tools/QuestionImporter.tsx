import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BasicSelect } from '@/components/ui/basic-select';
import { useToast } from '@/components/ui/use-toast';

interface Topic {
  id: string;
  title: string;
}

export default function QuestionImporter() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const topicIdFromUrl = queryParams.get('topic');

  const [topics, setTopics] = useState<Topic[]>([]);
  const [selectedTopic, setSelectedTopic] = useState<string>(topicIdFromUrl || '');
  const [questionsText, setQuestionsText] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [topicsLoading, setTopicsLoading] = useState<boolean>(true);
  const { toast } = useToast();

  // Fetch topics on component mount
  useEffect(() => {
    async function fetchTopics() {
      try {
        const { data, error } = await supabase
          .from('topics')
          .select('id, title')
          .order('title', { ascending: true });

        if (error) throw error;
        setTopics(data || []);
      } catch (error) {
        console.error('Error fetching topics:', error);
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Could not load topics. Please try again.',
        });
      } finally {
        setTopicsLoading(false);
      }
    }

    fetchTopics();
  });

  const handleImport = async () => {
    if (!selectedTopic) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Please select a topic.',
      });
      return;
    }

    if (!questionsText.trim()) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Please enter questions to import.',
      });
      return;
    }

    setLoading(true);

    try {
      // Parse the questions
      const questions = parseQuestions(questionsText);

      if (questions.length === 0) {
        throw new Error('No valid questions found. Please check the format.');
      }

      // Prepare questions for insertion
      const questionsToInsert = questions.map(q => ({
        topic_id: selectedTopic,
        question: q.question,
        options: JSON.stringify(q.options),
        correct_answer: q.correct_answer,
        explanation: q.explanation || '',
      }));

      // Insert questions into the database
      const { error } = await supabase
        .from('questions')
        .insert(questionsToInsert);

      if (error) throw error;

      toast({
        title: 'Success',
        description: `Imported ${questions.length} questions successfully.`,
      });

      // Clear the textarea
      setQuestionsText('');
    } catch (error: any) {
      console.error('Error importing questions:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message || 'Could not import questions. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  // Parse questions from text
  const parseQuestions = (text: string) => {
    const questions = [];
    const lines = text.split('\n');

    let currentQuestion: any = null;
    let parsingOptions = false;
    let optionIndex = 0;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();

      if (!line) continue; // Skip empty lines

      // New question starts with Q: or Question:
      if (line.match(/^(Q|Question):/i)) {
        // Save previous question if exists
        if (currentQuestion) {
          questions.push(currentQuestion);
        }

        // Start new question
        currentQuestion = {
          question: line.replace(/^(Q|Question):\s*/i, ''),
          options: [],
          correct_answer: '',
          explanation: '',
        };
        parsingOptions = true;
        optionIndex = 0;
        continue;
      }

      // Parse options (A, B, C, D)
      if (parsingOptions && line.match(/^[A-D][\s).:]/)) {
        const option = line.replace(/^[A-D][\s).:]/, '').trim();
        currentQuestion.options.push(option);

        // Check if this is the correct answer (marked with *)
        if (line.includes('*')) {
          currentQuestion.correct_answer = option;
        }
        continue;
      }

      // Parse correct answer if specified separately
      if (line.match(/^(Answer|Correct):/i)) {
        const answerLetter = line.replace(/^(Answer|Correct):\s*/i, '').trim();
        if (answerLetter.match(/^[A-D]$/i) && currentQuestion.options[answerLetter.charCodeAt(0) - 65]) {
          currentQuestion.correct_answer = currentQuestion.options[answerLetter.charCodeAt(0) - 65];
        } else {
          currentQuestion.correct_answer = line.replace(/^(Answer|Correct):\s*/i, '').trim();
        }
        parsingOptions = false;
        continue;
      }

      // Parse explanation
      if (line.match(/^(Explanation|E):/i)) {
        currentQuestion.explanation = line.replace(/^(Explanation|E):\s*/i, '').trim();
        parsingOptions = false;
        continue;
      }

      // If we're not parsing options and not at a new question, append to explanation
      if (!parsingOptions && currentQuestion) {
        currentQuestion.explanation += ' ' + line;
      }
    }

    // Add the last question
    if (currentQuestion) {
      questions.push(currentQuestion);
    }

    return questions;
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Question Importer</CardTitle>
        <CardDescription>
          Bulk import questions for your cybersecurity quizzes
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Select Topic</label>
            <BasicSelect
              options={topics.map(topic => ({ value: topic.id, label: topic.title }))}
              value={selectedTopic}
              onChange={setSelectedTopic}
              disabled={topicsLoading}
              placeholder="Select a topic"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Enter Questions (Format: Q: [question] A: [option1] B: [option2] C: [option3] D: [option4] Answer: [A/B/C/D] Explanation: [explanation])
            </label>
            <Textarea
              value={questionsText}
              onChange={(e) => setQuestionsText(e.target.value)}
              placeholder="Q: What is a firewall?
A: A security guard at a building
B: A software/hardware that monitors network traffic*
C: A type of computer virus
D: A backup system
Explanation: A firewall is a network security device that monitors and filters incoming and outgoing network traffic based on predetermined security rules."
              className="min-h-[300px]"
            />
          </div>

          <Button
            onClick={handleImport}
            disabled={loading || !selectedTopic || !questionsText.trim()}
            className="w-full"
          >
            {loading ? 'Importing...' : 'Import Questions'}
          </Button>

          <div className="text-sm text-gray-500 mt-4">
            <h3 className="font-medium">Format Instructions:</h3>
            <ul className="list-disc pl-5 space-y-1 mt-2">
              <li>Start each question with "Q:" or "Question:"</li>
              <li>List options as A, B, C, D</li>
              <li>Mark the correct answer with an asterisk (*) or specify with "Answer:" or "Correct:"</li>
              <li>Add explanations with "Explanation:" or "E:"</li>
              <li>Separate questions with blank lines</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
