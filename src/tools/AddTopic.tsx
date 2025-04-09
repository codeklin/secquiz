import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, Upload, Check, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function AddTopic() {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedImageUrl, setSelectedImageUrl] = useState('/topics/default.jpg');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Predefined image options
  const imageOptions = [
    { url: '/topics/default.jpg', label: 'Default' },
    { url: '/topics/network.jpg', label: 'Network' },
    { url: '/topics/security.jpg', label: 'Security' },
    { url: '/topics/cloud.jpg', label: 'Cloud' },
    { url: '/topics/ethical-hacking.jpg', label: 'Ethical Hacking' },
    { url: '/topics/cissp.jpg', label: 'CISSP' },
    { url: '/topics/security-plus.jpg', label: 'Security+' },
    { url: '/topics/cpn.jpg', label: 'CPN' }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      // Validate inputs
      if (!title.trim()) {
        throw new Error('Title is required');
      }

      if (!description.trim()) {
        throw new Error('Description is required');
      }

      // Use the selected image URL
      const imagePath = selectedImageUrl;

      // Insert new topic
      const { data, error: insertError } = await supabase
        .from('topics')
        .insert([
          {
            title,
            description,
            image_url: imagePath
          }
        ])
        .select();

      if (insertError) {
        throw new Error(`Error creating topic: ${insertError.message}`);
      }

      // Success!
      setSuccess(true);
      toast({
        title: 'Topic created successfully',
        description: `"${title}" has been added to your topics.`,
      });

      // Reset form
      setTitle('');
      setDescription('');
      setSelectedImageUrl('/topics/default.jpg');

      // Redirect to add questions for this topic
      if (data && data[0]) {
        setTimeout(() => {
          navigate(`/admin/import-questions?topic=${data[0].id}`);
        }, 2000);
      }

    } catch (err: any) {
      console.error('Error adding topic:', err);
      setError(err.message || 'An error occurred while creating the topic');
      toast({
        variant: 'destructive',
        title: 'Error',
        description: err.message || 'An error occurred while creating the topic',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Add New Topic</CardTitle>
          <CardDescription>
            Create a new quiz topic for your cybersecurity quizzes
          </CardDescription>
        </CardHeader>
        <CardContent>
          {success && (
            <Alert className="mb-6 bg-green-50 text-green-800 border-green-200">
              <Check className="h-4 w-4 text-green-600" />
              <AlertTitle>Topic created successfully!</AlertTitle>
              <AlertDescription>
                Redirecting you to add questions for this topic...
              </AlertDescription>
            </Alert>
          )}

          {error && (
            <Alert className="mb-6" variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Topic Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Network Security"
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe what this topic covers..."
                rows={4}
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label>Select Topic Image</Label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-2">
                {imageOptions.map((option) => (
                  <div
                    key={option.url}
                    className={`
                      border rounded-md p-2 cursor-pointer transition-all
                      ${selectedImageUrl === option.url ? 'ring-2 ring-blue-500' : 'hover:bg-gray-50'}
                    `}
                    onClick={() => setSelectedImageUrl(option.url)}
                  >
                    <div className="aspect-video bg-gray-100 rounded overflow-hidden mb-2">
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        {option.label}
                      </div>
                    </div>
                    <p className="text-xs text-center">{option.label}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4">
              <Button
                type="submit"
                className="w-full"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating Topic...
                  </>
                ) : (
                  'Create Topic'
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
