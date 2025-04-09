import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/lib/auth';
import { getUserProgress } from '@/lib/user-access';
import { getUserTopicProgress } from '@/lib/progress';
import { supabase } from '@/lib/supabase';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Award, BarChart, BookOpen, Calendar, MessageSquare } from 'lucide-react';
import UserFeedbackList from '@/components/UserFeedbackList';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';

interface QuizResult {
  id: string;
  topic_id: string;
  score: number;
  total_questions: number;
  completed_at: string;
  topics: {
    title: string;
  };
}

interface TopicProgress {
  topicId: string;
  topicTitle: string;
  attempts: number;
  bestScore: number;
  lastAttempt: string;
  averageScore: number;
  totalQuestions: number;
}

interface ProgressStats {
  totalQuizzes: number;
  averageScore: number;
  topicsAttempted: number;
  bestTopic: string | null;
  recentActivity: QuizResult[];
}

export default function ProgressPage() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [quizResults, setQuizResults] = useState<QuizResult[]>([]);
  const [topicProgress, setTopicProgress] = useState<TopicProgress[]>([]);
  const [stats, setStats] = useState<ProgressStats>({
    totalQuizzes: 0,
    averageScore: 0,
    topicsAttempted: 0,
    bestTopic: null,
    recentActivity: [],
  });

  // State for error handling
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchQuizResults() {
      if (!user?.id) {
        console.log('No user ID available');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        console.log('Fetching quiz results for user:', user.id);

        // Fetch both quiz results and topic progress
        const [quizResultsData, topicProgressData] = await Promise.all([
          getUserProgress(user.id),
          getUserTopicProgress(user.id)
        ]);

        // Map the quiz results data to match our expected format
        const formattedData = quizResultsData.map(item => ({
          ...item,
          completed_at: item.created_at
        }));

        console.log('Quiz results fetched:', formattedData?.length || 0, 'results');
        console.log('Topic progress fetched:', topicProgressData?.length || 0, 'topics');

        setQuizResults(formattedData || []);

        // If no results, we can stop here
        if ((!formattedData || formattedData.length === 0) &&
            (!topicProgressData || topicProgressData.length === 0)) {
          setLoading(false);
          return;
        }

        // Process data for topic progress
        const topicsMap = new Map<string, TopicProgress>();

        // First, add data from the user_progress table
        for (const progress of topicProgressData) {
          const { data: topicData } = await supabase
            .from('topics')
            .select('title')
            .eq('id', progress.topic_id)
            .single();

          if (topicData) {
            topicsMap.set(progress.topic_id, {
              topicId: progress.topic_id,
              topicTitle: topicData.title,
              attempts: progress.questions_attempted,
              bestScore: progress.completion_percentage,
              lastAttempt: progress.last_activity,
              averageScore: progress.completion_percentage,
              totalQuestions: progress.questions_attempted
            });
          }
        }

        // Then, add data from quiz results (which might override some of the above)

        formattedData.forEach(result => {
          if (!result.topics || !result.topics.title) {
            console.warn('Missing topic title for result:', result);
            return; // Skip this result
          }

          const topicId = result.topic_id;
          const topicTitle = result.topics.title;
          const score = result.score;
          const totalQuestions = result.total_questions;
          const scorePercentage = (score / totalQuestions) * 100;

          if (!topicsMap.has(topicId)) {
            topicsMap.set(topicId, {
              topicId,
              topicTitle,
              attempts: 1,
              bestScore: scorePercentage,
              lastAttempt: result.completed_at,
              averageScore: scorePercentage,
              totalQuestions,
            });
          } else {
            const existing = topicsMap.get(topicId)!;
            const newAverage = ((existing.averageScore * existing.attempts) + scorePercentage) / (existing.attempts + 1);

            topicsMap.set(topicId, {
              ...existing,
              attempts: existing.attempts + 1,
              bestScore: Math.max(existing.bestScore, scorePercentage),
              lastAttempt: result.completed_at,
              averageScore: newAverage,
            });
          }
        });

        const progressValues = Array.from(topicsMap.values());
        console.log('Topic progress calculated:', progressValues.length, 'topics');
        setTopicProgress(progressValues);

        // Calculate overall stats
        if (formattedData.length > 0 || topicProgressData.length > 0) {
          const totalQuizzes = formattedData.length;
          const totalScore = formattedData.reduce((sum, result) =>
            sum + (result.score / result.total_questions) * 100, 0);
          const averageScore = totalScore / totalQuizzes;
          const topicsAttempted = new Set(formattedData.map(result => result.topic_id)).size;

          // Find best topic
          let bestTopic = null;
          let bestScore = 0;

          topicsMap.forEach((progress) => {
            if (progress.bestScore > bestScore) {
              bestScore = progress.bestScore;
              bestTopic = progress.topicTitle;
            }
          });

          const statsData = {
            totalQuizzes,
            averageScore,
            topicsAttempted,
            bestTopic,
            recentActivity: formattedData.slice(0, 5),
          };

          console.log('Stats calculated:', statsData);
          setStats(statsData);
        }
      } catch (error: any) {
        console.error('Error in progress page:', error);
        setError(error?.message || 'An unexpected error occurred');
      } finally {
        setLoading(false);
      }
    }

    fetchQuizResults();
  }, [user?.id]);

  if (loading) {
    return (
      <div className="container py-8">
        <h1 className="text-3xl font-bold mb-4">Loading your progress...</h1>
        <div className="h-2 w-full bg-gray-200 rounded overflow-hidden">
          <div className="h-full bg-cyber-blue animate-pulse" style={{ width: '60%' }} />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-8">
        <h1 className="text-3xl font-bold mb-4">Error Loading Progress</h1>
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
        <p className="mb-4">Try refreshing the page or taking a quiz to generate progress data.</p>
      </div>
    );
  }

  if (quizResults.length === 0) {
    return (
      <div className="container py-8">
        <h1 className="text-3xl font-bold mb-4">Your Progress</h1>
        <p className="text-lg mb-8">You haven't taken any quizzes yet. Start learning to track your progress!</p>

        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center justify-center py-12">
              <BookOpen className="h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-xl font-medium mb-2">No quiz data yet</h3>
              <p className="text-gray-500 text-center max-w-md mb-6">
                Complete quizzes to see your progress and performance statistics here.
              </p>
              <Button
                onClick={() => navigate('/topics')}
                className="bg-cyber-blue hover:bg-cyber-blue/90"
              >
                Browse Topics
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8">Your Progress</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Total Quizzes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <BookOpen className="h-5 w-5 text-cyber-blue mr-2" />
              <span className="text-2xl font-bold">{stats.totalQuizzes}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Average Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <BarChart className="h-5 w-5 text-cyber-blue mr-2" />
              <span className="text-2xl font-bold">{stats.averageScore.toFixed(1)}%</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Topics Attempted</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <BookOpen className="h-5 w-5 text-cyber-blue mr-2" />
              <span className="text-2xl font-bold">{stats.topicsAttempted}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Best Topic</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Award className="h-5 w-5 text-cyber-blue mr-2" />
              <span className="text-lg font-bold truncate">{stats.bestTopic || 'N/A'}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="topics" className="mb-8">
        <TabsList className="mb-4">
          <TabsTrigger value="topics">Topic Progress</TabsTrigger>
          <TabsTrigger value="recent">Recent Activity</TabsTrigger>
          <TabsTrigger value="feedback">Feedback</TabsTrigger>
        </TabsList>

        <TabsContent value="topics">
          <div className="grid gap-6">
            {topicProgress.map((topic) => (
              <Card key={topic.topicId}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center">
                    <CardTitle>{topic.topicTitle}</CardTitle>
                    <span className="text-sm text-gray-500">{topic.attempts} attempt{topic.attempts !== 1 ? 's' : ''}</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">Best Score</span>
                        <span className="text-sm font-medium">{topic.bestScore.toFixed(1)}%</span>
                      </div>
                      <Progress value={topic.bestScore} className="h-2" />
                    </div>

                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">Average Score</span>
                        <span className="text-sm font-medium">{topic.averageScore.toFixed(1)}%</span>
                      </div>
                      <Progress value={topic.averageScore} className="h-2" />
                    </div>

                    <div className="text-sm text-gray-500">
                      Last attempt: {format(new Date(topic.lastAttempt), 'MMM d, yyyy')}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="recent">
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-6">
                {stats.recentActivity.map((result) => (
                  <div key={result.id} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                    <div>
                      <h3 className="font-medium">{result.topics.title}</h3>
                      <p className="text-sm text-gray-500">
                        {format(new Date(result.completed_at), 'MMM d, yyyy - h:mm a')}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{((result.score / result.total_questions) * 100).toFixed(1)}%</p>
                      <p className="text-sm text-gray-500">{result.score}/{result.total_questions} correct</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="feedback">
          <UserFeedbackList />
        </TabsContent>
      </Tabs>
    </div>
  );
}
