import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Shield, ArrowLeft, Trash2 } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface Topic {
  id: string;
  title: string;
  description: string;
  image_url: string;
}

export default function EditTopic() {
  const { topicId } = useParams();
  const navigate = useNavigate();
  const [topic, setTopic] = useState<Topic | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  useEffect(() => {
    async function fetchTopic() {
      if (!topicId) return;

      try {
        const { data, error } = await supabase
          .from('topics')
          .select('*')
          .eq('id', topicId)
          .single();

        if (error) throw error;

        if (data) {
          setTopic(data);
          setTitle(data.title);
          setDescription(data.description);
          setImageUrl(data.image_url);
        }
      } catch (error: any) {
        console.error('Error fetching topic:', error);
        setResult({
          success: false,
          message: `Error fetching topic: ${error.message}`
        });
      } finally {
        setLoading(false);
      }
    }

    fetchTopic();
  }, [topicId]);

  const handleSave = async () => {
    if (!topicId) return;

    setSaving(true);
    setResult(null);

    try {
      const { error } = await supabase
        .from('topics')
        .update({
          title,
          description,
          image_url: imageUrl,
          updated_at: new Date().toISOString()
        })
        .eq('id', topicId);

      if (error) throw error;

      setResult({
        success: true,
        message: 'Topic updated successfully!'
      });

      // Update local state
      setTopic({
        id: topicId,
        title,
        description,
        image_url: imageUrl
      });
    } catch (error: any) {
      console.error('Error updating topic:', error);
      setResult({
        success: false,
        message: `Error updating topic: ${error.message}`
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!topicId) return;

    setSaving(true);
    setResult(null);

    try {
      // First check if there are any questions associated with this topic
      const { data: questions, error: questionsError } = await supabase
        .from('questions')
        .select('id')
        .eq('topic_id', topicId);

      if (questionsError) throw questionsError;

      // If there are questions, delete them first
      if (questions && questions.length > 0) {
        const { error: deleteQuestionsError } = await supabase
          .from('questions')
          .delete()
          .eq('topic_id', topicId);

        if (deleteQuestionsError) throw deleteQuestionsError;
      }

      // Now delete the topic
      const { error } = await supabase
        .from('topics')
        .delete()
        .eq('id', topicId);

      if (error) throw error;

      setResult({
        success: true,
        message: 'Topic deleted successfully!'
      });

      // Navigate back to topics page after a short delay
      setTimeout(() => {
        navigate('/topics');
      }, 1500);
    } catch (error: any) {
      console.error('Error deleting topic:', error);
      setResult({
        success: false,
        message: `Error deleting topic: ${error.message}`
      });
    } finally {
      setSaving(false);
      setDeleteDialogOpen(false);
    }
  };

  if (loading) {
    return (
      <div className="container py-8">
        <h1 className="text-2xl font-bold mb-4">Loading topic...</h1>
      </div>
    );
  }

  if (!topic) {
    return (
      <div className="container py-8">
        <h1 className="text-2xl font-bold mb-4">Topic not found</h1>
        <Button onClick={() => navigate('/topics')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Topics
        </Button>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Edit Topic</h1>
        <Button variant="outline" onClick={() => navigate('/topics')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Topics
        </Button>
      </div>

      <div className="space-y-6 max-w-2xl">
        <div>
          <label className="block text-sm font-medium mb-2">Title</label>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Topic title"
            className="w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Description</label>
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Topic description"
            className="w-full min-h-[150px]"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Image URL</label>
          <Input
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="/topics/your-image.jpg"
            className="w-full"
          />
        </div>

        {result && (
          <Alert className={result.success ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"}>
            <Shield className={result.success ? "text-green-500" : "text-red-500"} />
            <AlertTitle className={result.success ? "text-green-800" : "text-red-800"}>
              {result.success ? 'Success!' : 'Error!'}
            </AlertTitle>
            <AlertDescription className={result.success ? "text-green-700" : "text-red-700"}>
              {result.message}
            </AlertDescription>
          </Alert>
        )}

        <div className="flex justify-between pt-4">
          <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" disabled={saving}>
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Topic
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently delete the topic "{topic.title}" and all associated questions.
                  This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete} className="bg-red-500 hover:bg-red-600">
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          <Button onClick={handleSave} disabled={saving} className="bg-cyber-blue hover:bg-cyber-blue/90">
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>
    </div>
  );
}
