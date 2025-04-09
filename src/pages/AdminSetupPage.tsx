import { Shield, Database, UserPlus, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function AdminSetupPage() {
  const navigate = useNavigate();

  const setupSteps = [
    {
      title: "Step 1: Create Admin User",
      description: "Create a new user account with your email address",
      icon: <UserPlus className="h-8 w-8 text-blue-500" />,
      path: "/create-admin-user",
      buttonText: "Create User"
    },
    {
      title: "Step 2: Add Admin Column",
      description: "Add the is_admin column to your profiles table",
      icon: <Database className="h-8 w-8 text-green-500" />,
      path: "/add-admin-column",
      buttonText: "Add Column"
    },
    {
      title: "Step 3: Make User Admin",
      description: "Grant admin privileges to your user account",
      icon: <Shield className="h-8 w-8 text-purple-500" />,
      path: "/make-admin",
      buttonText: "Make Admin"
    },
    {
      title: "Step 4: Go to Admin Dashboard",
      description: "Access the admin dashboard with your new privileges",
      icon: <Settings className="h-8 w-8 text-gray-500" />,
      path: "/admin",
      buttonText: "Go to Dashboard"
    }
  ];

  return (
    <div className="container py-12">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Admin Setup</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Follow these steps to set up admin access for your SecQuiz application.
            This will allow you to manage topics, questions, and user permissions.
          </p>
        </div>

        <div className="grid gap-8">
          {setupSteps.map((step, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-gray-100 rounded-full">
                    {step.icon}
                  </div>
                  <div className="flex-1">
                    <h2 className="text-xl font-bold mb-2">{step.title}</h2>
                    <p className="text-gray-600 mb-4">{step.description}</p>
                    <Button 
                      onClick={() => navigate(step.path)}
                      className="bg-cyber-blue hover:bg-cyber-blue/90"
                    >
                      {step.buttonText}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <h2 className="text-xl font-bold mb-2 text-yellow-800">Important Notes</h2>
          <ul className="list-disc pl-5 space-y-2 text-yellow-700">
            <li>You must complete all steps in order for admin access to work properly.</li>
            <li>After creating your user account, you'll need to verify your email address.</li>
            <li>The admin column only needs to be added once to your database.</li>
            <li>Only users with admin privileges can access the admin dashboard.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
