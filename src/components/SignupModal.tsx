import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface SignupModalProps {
  open: boolean;
  onClose: () => void;
  questionsAnswered: number;
  questionLimit: number;
}

export default function SignupModal({ open, onClose, questionsAnswered, questionLimit }: SignupModalProps) {
  const navigate = useNavigate();

  const handleSignup = () => {
    navigate('/signin');
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Free Trial Limit Reached</DialogTitle>
          <DialogDescription>
            You've answered {questionsAnswered} out of {questionLimit} free questions
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="rounded-lg border p-4">
            <h3 className="font-semibold mb-2">Sign up to continue:</h3>
            <ul className="space-y-2">
              <li>✓ Track your progress</li>
              <li>✓ Save your quiz results</li>
              <li>✓ Access all quiz topics</li>
              <li>✓ Unlock premium features</li>
            </ul>
          </div>
          <div className="flex flex-col space-y-2">
            <Button 
              className="w-full bg-cyber-blue hover:bg-cyber-blue/90"
              onClick={handleSignup}
            >
              Sign Up / Login
            </Button>
            <Button 
              variant="outline"
              className="w-full"
              onClick={onClose}
            >
              Continue with current quiz
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
