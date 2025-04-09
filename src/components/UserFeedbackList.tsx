import { useState, useEffect } from 'react';
import { getUserFeedback } from '@/lib/feedback';
import { useAuthStore } from '@/lib/auth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, ThumbsUp, ThumbsDown, Flag, Loader2 } from 'lucide-react';
import { format } from 'date-fns';

export default function UserFeedbackList() {
  const { user } = useAuthStore();
  const [feedback, setFeedback] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadFeedback() {
      if (!user?.id) return;
      
      try {
        setLoading(true);
        const feedbackData = await getUserFeedback(user.id);
        setFeedback(feedbackData);
      } catch (err: any) {
        console.error('Error loading feedback:', err);
        setError(err.message || 'Failed to load feedback');
      } finally {
        setLoading(false);
      }
    }
    
    loadFeedback();
  }, [user?.id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-cyber-blue" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">
        <p>Error: {error}</p>
      </div>
    );
  }

  if (feedback.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col items-center justify-center py-8">
            <MessageSquare className="h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-xl font-medium mb-2">No feedback yet</h3>
            <p className="text-gray-500 text-center max-w-md">
              You haven't provided any feedback on questions yet. Your feedback helps us improve our content.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const getFeedbackIcon = (type: string) => {
    switch (type) {
      case 'helpful':
        return <ThumbsUp className="h-4 w-4 text-green-500" />;
      case 'confusing':
        return <ThumbsDown className="h-4 w-4 text-amber-500" />;
      case 'incorrect':
        return <Flag className="h-4 w-4 text-red-500" />;
      default:
        return <MessageSquare className="h-4 w-4 text-blue-500" />;
    }
  };

  const getFeedbackLabel = (type: string) => {
    switch (type) {
      case 'helpful':
        return 'Helpful';
      case 'confusing':
        return 'Confusing';
      case 'incorrect':
        return 'Incorrect';
      default:
        return 'Feedback';
    }
  };

  const getBadgeVariant = (type: string) => {
    switch (type) {
      case 'helpful':
        return 'outline';
      case 'confusing':
        return 'secondary';
      case 'incorrect':
        return 'destructive';
      default:
        return 'default';
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold mb-4">Your Feedback</h2>
      
      {feedback.map((item) => (
        <Card key={item.id} className="overflow-hidden">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-base">
                  {item.questions?.question ? (
                    <span className="line-clamp-2">{item.questions.question}</span>
                  ) : (
                    <span className="text-gray-500 italic">Question no longer available</span>
                  )}
                </CardTitle>
                <p className="text-xs text-gray-500 mt-1">
                  {format(new Date(item.created_at), 'MMM d, yyyy - h:mm a')}
                </p>
              </div>
              <Badge variant={getBadgeVariant(item.feedback_type)} className="flex items-center gap-1">
                {getFeedbackIcon(item.feedback_type)}
                <span>{getFeedbackLabel(item.feedback_type)}</span>
              </Badge>
            </div>
          </CardHeader>
          
          {item.feedback_text && (
            <CardContent className="pt-2">
              <p className="text-sm text-gray-700">{item.feedback_text}</p>
            </CardContent>
          )}
        </Card>
      ))}
    </div>
  );
}
