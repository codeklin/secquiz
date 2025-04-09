import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { useAuthStore } from '@/lib/auth';
import { submitFeedback } from '@/lib/feedback';
import { ThumbsUp, ThumbsDown, Flag, Loader2 } from 'lucide-react';

interface QuestionFeedbackProps {
  questionId: string;
  onClose?: () => void;
}

export default function QuestionFeedback({ questionId, onClose }: QuestionFeedbackProps) {
  const { toast } = useToast();
  const { user, isAuthenticated } = useAuthStore();
  const [feedbackType, setFeedbackType] = useState<string>('helpful');
  const [feedbackText, setFeedbackText] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [submitted, setSubmitted] = useState<boolean>(false);

  const handleSubmit = async () => {
    if (!isAuthenticated || !user?.id) {
      toast({
        variant: 'destructive',
        title: 'Authentication Required',
        description: 'You must be logged in to submit feedback.',
      });
      return;
    }

    setLoading(true);
    try {
      await submitFeedback(
        user.id,
        questionId,
        feedbackType,
        feedbackText
      );
      
      setSubmitted(true);
      toast({
        title: 'Feedback Submitted',
        description: 'Thank you for your feedback!',
      });
      
      if (onClose) {
        setTimeout(onClose, 1500);
      }
    } catch (error) {
      console.error('Error submitting feedback:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to submit feedback. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="p-4 bg-green-50 rounded-lg text-center">
        <ThumbsUp className="h-8 w-8 text-green-500 mx-auto mb-2" />
        <h3 className="text-lg font-medium text-green-800">Thank You!</h3>
        <p className="text-green-600">Your feedback has been submitted.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Question Feedback</h3>
      
      <div>
        <RadioGroup
          value={feedbackType}
          onValueChange={setFeedbackType}
          className="flex flex-col space-y-2"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="helpful" id="helpful" />
            <Label htmlFor="helpful" className="flex items-center">
              <ThumbsUp className="h-4 w-4 mr-2" />
              This question was helpful
            </Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="confusing" id="confusing" />
            <Label htmlFor="confusing" className="flex items-center">
              <ThumbsDown className="h-4 w-4 mr-2" />
              This question was confusing
            </Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="incorrect" id="incorrect" />
            <Label htmlFor="incorrect" className="flex items-center">
              <Flag className="h-4 w-4 mr-2" />
              This question or answer is incorrect
            </Label>
          </div>
        </RadioGroup>
      </div>
      
      <div>
        <Label htmlFor="feedback-text">Additional Comments (Optional)</Label>
        <Textarea
          id="feedback-text"
          placeholder="Please provide any additional feedback..."
          value={feedbackText}
          onChange={(e) => setFeedbackText(e.target.value)}
          className="mt-1"
        />
      </div>
      
      <div className="flex justify-end space-x-2">
        {onClose && (
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
        )}
        
        <Button onClick={handleSubmit} disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Submitting...
            </>
          ) : (
            'Submit Feedback'
          )}
        </Button>
      </div>
    </div>
  );
}
