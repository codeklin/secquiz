import { Routes as RouterRoutes, Route, Outlet } from 'react-router-dom';
import { useAuthStore } from '@/lib/auth';
import { Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import SignInPage from './pages/SignInPage';
import TopicsPage from './pages/TopicsPage';
import QuizPage from './pages/QuizPage';
import ResultsPage from './pages/ResultsPage';
import ProgressPage from './pages/ProgressPage';
import NotFoundPage from './pages/NotFoundPage';
import AccessDeniedPage from './pages/AccessDeniedPage';
import AdminDashboard from './pages/AdminDashboard';
import AdminSetupPage from './pages/AdminSetupPage';
import QuestionImporter from './tools/QuestionImporter';
import CSVImporter from './tools/CSVImporter';
import AddTopic from './tools/AddTopic';
import Settings from './tools/Settings';
import EditTopic from './tools/EditTopic';

const PrivateRoute = () => {
  const { isAuthenticated } = useAuthStore();
  return isAuthenticated ? <Outlet /> : <Navigate to="/signin" />;
};

const AdminRoute = () => {
  const { isAuthenticated, isAdmin } = useAuthStore();
  if (!isAuthenticated) return <Navigate to="/signin" />;
  if (!isAdmin) return <Navigate to="/access-denied" />;
  return <Outlet />;
};

export default function Routes() {
  return (
    <RouterRoutes>
      {/* Public Routes */}
      <Route path="/" element={<HomePage />} />
      <Route path="/signin" element={<SignInPage />} />
      <Route path="/access-denied" element={<AccessDeniedPage />} />
      <Route path="*" element={<NotFoundPage />} />

      {/* Protected Routes */}
      <Route element={<PrivateRoute />}>
        <Route path="/topics" element={<TopicsPage />} />
        <Route path="/quiz/:topicId" element={<QuizPage />} />
        <Route path="/results" element={<ResultsPage />} />
        <Route path="/progress" element={<ProgressPage />} />
      </Route>

      {/* Admin Routes */}
      <Route element={<AdminRoute />}>
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/setup" element={<AdminSetupPage />} />
        <Route path="/admin/import-questions" element={<QuestionImporter />} />
        <Route path="/admin/csv-import" element={<CSVImporter />} />
        <Route path="/admin/add-topic" element={<AddTopic />} />
        <Route path="/admin/settings" element={<Settings />} />
        <Route path="/admin/edit-topic/:topicId" element={<EditTopic />} />
      </Route>
    </RouterRoutes>
  );
}
