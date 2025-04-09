import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/lib/auth';

interface Topic {
  id: string;
  title: string;
}

export default function ResultsPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [topic, setTopic] = useState<Topic | null>(null);

  const score = location.state?.score ?? 0;
  const total = location.state?.total ?? 0;
  const topicId = location.state?.topicId;
  const percentage = Math.round((score / total) * 100);

  useEffect(() => {
    // Redirect if no score data
    if (!location.state?.score) {
      navigate('/topics');
      return;
    }

    // Fetch topic details
    async function fetchTopic() {
      if (!topicId) return;

      try {
        const { data, error } = await supabase
          .from('topics')
          .select('id, title')
          .eq('id', topicId)
          .single();

        if (error) throw error;
        setTopic(data);
      } catch (error) {
        console.error('Error fetching topic:', error);
      }
    }

    fetchTopic();
  }, [location.state?.score, navigate, topicId]);

  return (
    <div className="container max-w-2xl py-8">
      <div className="rounded-lg border bg-card p-8 text-card-foreground shadow">
        <h1 className="text-3xl font-bold mb-6">Quiz Results</h1>

        {topic && (
          <p className="text-lg mb-4">
            Topic: {topic.title}
          </p>
        )}

        <div className="space-y-6">
          <div className="text-center">
            <p className="text-5xl font-bold text-cyber-blue mb-2">{percentage}%</p>
            <p className="text-xl">
              You scored {score} out of {total} questions correctly
            </p>
          </div>

          <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-cyber-blue"
              style={{ width: `${percentage}%` }}
            />
          </div>

          <div className="pt-6 space-x-4 flex flex-wrap justify-center gap-2">
            <Button
              variant="outline"
              onClick={() => navigate('/topics')}
            >
              Back to Topics
            </Button>
            <Button
              onClick={() => navigate(`/quiz/${topicId}`)}
            >
              Try Again
            </Button>
            <Button
              variant="secondary"
              onClick={() => navigate('/progress')}
            >
              View Progress
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
