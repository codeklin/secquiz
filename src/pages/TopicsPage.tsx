import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TopicCard from '@/components/TopicCard';
import { getTopics, Topic } from '@/lib/topics';
import { useAuthStore } from '@/lib/auth';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

export default function TopicsPage() {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated, isAdmin } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchTopics() {
      try {
        const { data, error } = await supabase
          .from('topics')
          .select('*')
          .order('created_at', { ascending: true });

        if (error) {
          console.error('Error fetching from Supabase:', error);
          throw error;
        }

        if (data && data.length > 0) {
          setTopics(data);
        } else {
          const fetchedTopics = await getTopics();
          setTopics(fetchedTopics);
        }
      } catch (error) {
        console.error('Error fetching topics:', error);
        const { topics } = await import('@/data/questions');
        const formattedTopics = topics.map(t => ({
          id: t.id,
          title: t.name,
          description: t.description,
          image_url: `/topics/${t.id}.jpg`
        }));
        setTopics(formattedTopics);
      } finally {
        setLoading(false);
      }
    }

    fetchTopics();
  }, []);

  if (loading) {
    return (
      <div className="container py-8">
        <h1 className="mb-8 text-3xl font-bold">Loading topics...</h1>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Available Topics</h1>
        {isAuthenticated && isAdmin && (
          <Button
            onClick={() => navigate('/admin/add-topic')}
            className="bg-cyber-blue hover:bg-cyber-blue/90"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add New Topic
          </Button>
        )}
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {topics.length > 0 ? (
          topics.map((topic) => (
            <TopicCard
              key={topic.id}
              id={topic.id}
              title={topic.title}
              description={topic.description}
              imageUrl={topic.image_url || `/topics/default.jpg`}
              showActions={true}
            />
          ))
        ) : (
          <div className="col-span-3 text-center py-8">
            <p className="text-lg text-gray-500">No topics available. Please add some topics to get started.</p>
          </div>
        )}
      </div>
    </div>
  );
}
