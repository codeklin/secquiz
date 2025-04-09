
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Shield } from "lucide-react";

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-16 bg-gray-50 dark:bg-gray-900">
      <Shield size={80} className="text-cyber-blue opacity-20" />
      <h1 className="text-6xl font-bold text-cyber-navy dark:text-white mt-6">404</h1>
      <p className="text-xl text-gray-600 dark:text-gray-400 mt-2 mb-8">Page not found</p>
      <p className="text-gray-500 dark:text-gray-500 max-w-md text-center mb-8">
        The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
      </p>
      <Button 
        className="bg-cyber-blue hover:bg-cyber-blue/90 px-8"
        onClick={() => navigate('/')}
      >
        Back to Home
      </Button>
    </div>
  );
};

export default NotFoundPage;
