import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Database, FileSpreadsheet, Plus, Settings, Loader2, Shield, Users } from 'lucide-react';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalTopics: 0,
    totalQuestions: 0,
    totalUsers: 0,
    totalAdmins: 0
  });

  // Fetch stats on component mount
  useEffect(() => {
    async function fetchStats() {
      try {
        setLoading(true);

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

        // Get total admins
        const { count: adminsCount, error: adminsError } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true })
          .eq('is_admin', true);

        if (adminsError) throw adminsError;

        setStats({
          totalTopics: topicsCount || 0,
          totalQuestions: questionsCount || 0,
          totalUsers: usersCount || 0,
          totalAdmins: adminsCount || 0
        });

      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

  const adminTools = [
    {
      title: 'Question Importer',
      description: 'Import questions using a text-based format',
      icon: <Database className="h-8 w-8 text-blue-500" />,
      path: '/admin/import-questions',
    },
    {
      title: 'CSV Importer',
      description: 'Import questions from CSV files',
      icon: <FileSpreadsheet className="h-8 w-8 text-green-500" />,
      path: '/admin/csv-import',
    },
    {
      title: 'Add New Topic',
      description: 'Create a new quiz topic',
      icon: <Plus className="h-8 w-8 text-purple-500" />,
      path: '/admin/add-topic',
    },
    {
      title: 'Manage Admins',
      description: 'Add or remove administrator privileges',
      icon: <Shield className="h-8 w-8 text-red-500" />,
      path: '/admin/manage-admins',
    },
    {
      title: 'Check Profiles',
      description: 'View and manage user profiles',
      icon: <Users className="h-8 w-8 text-amber-500" />,
      path: '/admin/check-profiles',
    },
    {
      title: 'Settings',
      description: 'Configure application settings',
      icon: <Settings className="h-8 w-8 text-gray-500" />,
      path: '/admin/settings',
    },
  ];

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
      <p className="text-gray-500 mb-8">Manage your SecQuiz application</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {adminTools.map((tool) => (
          <Card key={tool.path} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2">
                {tool.icon}
                <span>{tool.title}</span>
              </CardTitle>
              <CardDescription>{tool.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => navigate(tool.path)}
              >
                Open Tool
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-12">
        <h2 className="text-xl font-bold mb-4">Quick Stats</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Total Topics</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center">
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  <span>Loading...</span>
                </div>
              ) : (
                <p className="text-2xl font-bold">{stats.totalTopics}</p>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Total Questions</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center">
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  <span>Loading...</span>
                </div>
              ) : (
                <p className="text-2xl font-bold">{stats.totalQuestions}</p>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Total Users</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center">
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  <span>Loading...</span>
                </div>
              ) : (
                <p className="text-2xl font-bold">{stats.totalUsers}</p>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Admin Users</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center">
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  <span>Loading...</span>
                </div>
              ) : (
                <p className="text-2xl font-bold">{stats.totalAdmins}</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
