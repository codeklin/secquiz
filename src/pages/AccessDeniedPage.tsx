import { Shield, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function AccessDeniedPage() {
  const navigate = useNavigate();

  return (
    <div className="container py-16 flex flex-col items-center justify-center min-h-[70vh]">
      <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-6">
        <Shield className="h-10 w-10 text-red-500" />
      </div>
      
      <h1 className="text-3xl font-bold mb-4 text-center">Access Denied</h1>
      
      <p className="text-lg text-gray-600 mb-8 text-center max-w-md">
        You don't have permission to access this area. 
        This section is restricted to administrators only.
      </p>
      
      <div className="flex flex-col sm:flex-row gap-4">
        <Button 
          onClick={() => navigate('/')}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Return to Home
        </Button>
        
        <Button 
          variant="outline"
          onClick={() => navigate('/topics')}
        >
          Browse Topics
        </Button>
      </div>
    </div>
  );
}
