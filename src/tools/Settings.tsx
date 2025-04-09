import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/lib/auth';
import { useQuestionCounter } from '@/hooks/useQuestionCounter';
import { getAllSettings, updateSetting } from '@/lib/settings';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, Save, RefreshCw, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function Settings() {
  const { toast } = useToast();
  const { user } = useAuthStore();
  const { resetCounter, QUESTION_LIMIT, setQuestionLimit } = useQuestionCounter();

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // App settings
  const [freemiumLimit, setFreemiumLimit] = useState(QUESTION_LIMIT);
  const [enableFreemium, setEnableFreemium] = useState(true);

  // Stats
  const [stats, setStats] = useState({
    totalTopics: 0,
    totalQuestions: 0,
    totalUsers: 0,
    totalQuizzes: 0
  });

  // Load saved settings on component mount
  useEffect(() => {
    async function loadSettings() {
      try {
        setLoading(true);
        const settings = await getAllSettings();

        // Find the free questions limit setting
        const freeQuestionsLimit = settings.find(s => s.setting_key === 'free_questions_limit');
        if (freeQuestionsLimit && freeQuestionsLimit.setting_value) {
          setFreemiumLimit(parseInt(freeQuestionsLimit.setting_value.toString(), 10));
        }

        // Find the payment settings
        const paymentSettings = settings.find(s => s.setting_key === 'payment_settings');
        if (paymentSettings && paymentSettings.setting_value) {
          // You can add more payment settings here if needed
        }

        // Find the app settings
        const appSettings = settings.find(s => s.setting_key === 'app_settings');
        if (appSettings && appSettings.setting_value && appSettings.setting_value.freemium_enabled !== undefined) {
          setEnableFreemium(appSettings.setting_value.freemium_enabled);
        } else {
          // Fallback to localStorage if not in database
          const savedFreemiumEnabled = localStorage.getItem('freemium-enabled');
          if (savedFreemiumEnabled !== null) {
            setEnableFreemium(savedFreemiumEnabled === 'true');
          }
        }

        // Load stats
        await loadStats();
      } catch (error) {
        console.error('Error loading settings:', error);
        setError('Failed to load settings. Please try again.');
      } finally {
        setLoading(false);
      }
    }

    loadSettings();
  }, []);

  // Fetch stats on component mount
  useEffect(() => {
    async function fetchStats() {
      try {
        // Get total topics
        const { count: topicsCount, error: topicsError } = await supabase
          .from('topics')
          .select('*', { count: 'exact', head: true });

        if (topicsError) throw topicsError;

        // Get total questions
        const { count: questionsCount, error: questionsError } = await supabase
          .from('questions')
          .select('*', { count: 'exact', head: true });

        if (questionsError) throw questionsError;

        // Get total users (if admin)
        const { count: usersCount, error: usersError } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true });

        if (usersError) throw usersError;

        // Get total quizzes
        const { count: quizzesCount, error: quizzesError } = await supabase
          .from('quiz_results')
          .select('*', { count: 'exact', head: true });

        if (quizzesError) throw quizzesError;

        setStats({
          totalTopics: topicsCount || 0,
          totalQuestions: questionsCount || 0,
          totalUsers: usersCount || 0,
          totalQuizzes: quizzesCount || 0
        });

      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    }

    fetchStats();
  }, []);

  const loadStats = async () => {
    try {
      // Get total topics
      const { count: topicsCount, error: topicsError } = await supabase
        .from('topics')
        .select('*', { count: 'exact', head: true });

      if (topicsError) throw topicsError;

      // Get total questions
      const { count: questionsCount, error: questionsError } = await supabase
        .from('questions')
        .select('*', { count: 'exact', head: true });

      if (questionsError) throw questionsError;

      // Get total users
      const { count: usersCount, error: usersError } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      if (usersError) throw usersError;

      // Get total quizzes
      const { count: quizzesCount, error: quizzesError } = await supabase
        .from('quiz_results')
        .select('*', { count: 'exact', head: true });

      if (quizzesError) throw quizzesError;

      setStats({
        totalTopics: topicsCount || 0,
        totalQuestions: questionsCount || 0,
        totalUsers: usersCount || 0,
        totalQuizzes: quizzesCount || 0
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const handleSaveSettings = async () => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      if (!user?.id) {
        throw new Error('User not authenticated');
      }

      // Update the free questions limit setting
      await updateSetting('free_questions_limit', freemiumLimit, user.id);

      // Update the app settings
      const { data: appSettings } = await supabase
        .from('settings')
        .select('setting_value')
        .eq('setting_key', 'app_settings')
        .single();

      const updatedAppSettings = {
        ...((appSettings?.setting_value as any) || {}),
        freemium_enabled: enableFreemium
      };

      await updateSetting('app_settings', updatedAppSettings, user.id);

      // Update the freemium limit in the store
      if (freemiumLimit !== QUESTION_LIMIT) {
        setQuestionLimit(freemiumLimit);
      }

      // Also save to localStorage for backward compatibility
      localStorage.setItem('freemium-enabled', enableFreemium.toString());

      // Show success message
      setSuccess(true);
      toast({
        title: 'Settings saved',
        description: 'Your settings have been updated successfully.',
      });

    } catch (err: any) {
      console.error('Error saving settings:', err);
      setError(err.message || 'An error occurred while saving settings');
      toast({
        variant: 'destructive',
        title: 'Error',
        description: err.message || 'An error occurred while saving settings',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResetFreemiumCounter = () => {
    resetCounter();
    toast({
      title: 'Counter reset',
      description: 'The freemium question counter has been reset to 0.',
    });
  };

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-2">Settings</h1>
      <p className="text-gray-500 mb-8">Configure your SecQuiz application</p>

      <Tabs defaultValue="general">
        <TabsList className="mb-4">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="freemium">Freemium</TabsTrigger>
          <TabsTrigger value="stats">Statistics</TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>
                Configure general application settings
              </CardDescription>
            </CardHeader>
            <CardContent>
              {success && (
                <Alert className="mb-6 bg-green-50 text-green-800 border-green-200">
                  <Save className="h-4 w-4 text-green-600" />
                  <AlertTitle>Settings saved!</AlertTitle>
                  <AlertDescription>
                    Your settings have been updated successfully.
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

              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="app-name">Application Name</Label>
                  <Input
                    id="app-name"
                    value="SecQuiz"
                    disabled
                    className="max-w-md"
                  />
                  <p className="text-sm text-gray-500">
                    The name of your application (cannot be changed)
                  </p>
                </div>

                <div className="flex items-center justify-between border-t pt-4">
                  <Button
                    onClick={handleSaveSettings}
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Save Settings
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="freemium">
          <Card>
            <CardHeader>
              <CardTitle>Freemium Settings</CardTitle>
              <CardDescription>
                Configure freemium model settings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="enable-freemium" className="block mb-1">Enable Freemium Model</Label>
                    <p className="text-sm text-gray-500">
                      Allow users to take a limited number of questions before signing up
                    </p>
                  </div>
                  <Switch
                    id="enable-freemium"
                    checked={enableFreemium}
                    onCheckedChange={setEnableFreemium}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="freemium-limit">Question Limit</Label>
                  <Input
                    id="freemium-limit"
                    type="number"
                    min="1"
                    max="50"
                    value={freemiumLimit}
                    onChange={(e) => setFreemiumLimit(parseInt(e.target.value) || 10)}
                    disabled={!enableFreemium}
                    className="max-w-md"
                  />
                  <p className="text-sm text-gray-500">
                    Number of questions users can take before being required to sign up
                  </p>
                </div>

                <div className="space-y-2 border-t pt-4">
                  <Label>Reset Freemium Counter</Label>
                  <div className="flex items-center gap-4">
                    <Button
                      variant="outline"
                      onClick={handleResetFreemiumCounter}
                    >
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Reset Counter
                    </Button>
                    <p className="text-sm text-gray-500">
                      Reset the freemium question counter for testing purposes
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between border-t pt-4">
                  <Button
                    onClick={handleSaveSettings}
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Save Settings
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="stats">
          <Card>
            <CardHeader>
              <CardTitle>Application Statistics</CardTitle>
              <CardDescription>
                View statistics about your SecQuiz application
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-sm font-medium text-gray-500">Total Topics</h3>
                  <p className="text-2xl font-bold">{stats.totalTopics}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-sm font-medium text-gray-500">Total Questions</h3>
                  <p className="text-2xl font-bold">{stats.totalQuestions}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-sm font-medium text-gray-500">Total Users</h3>
                  <p className="text-2xl font-bold">{stats.totalUsers}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-sm font-medium text-gray-500">Total Quizzes Taken</h3>
                  <p className="text-2xl font-bold">{stats.totalQuizzes}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
