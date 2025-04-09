import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Shield, UserPlus } from 'lucide-react';

export default function CreateAdminUser() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);
  const [email, setEmail] = useState('gigsdev007@gmail.com');
  const [password, setPassword] = useState('');
  
  const createUser = async () => {
    try {
      setLoading(true);
      setResult(null);
      
      if (!email || !password) {
        setResult({
          success: false,
          message: 'Please provide both email and password'
        });
        return;
      }
      
      // Create the user in the auth system
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: 'Admin User',
            is_admin: true
          }
        }
      });
      
      if (error) throw error;
      
      setResult({
        success: true,
        message: `Successfully created user ${email}! Please check your email for the confirmation link.`
      });
    } catch (error: any) {
      console.error('Error creating user:', error);
      setResult({
        success: false,
        message: `Error: ${error.message || 'Unknown error occurred'}`
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-6">Create Admin User</h1>
      
      <div className="mb-8 max-w-md">
        <p className="text-gray-600 mb-4">
          This tool will create a new user in the authentication system and mark them as an admin.
          The user will receive a confirmation email to verify their account.
        </p>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@example.com"
              className="w-full"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full"
            />
            <p className="text-xs text-gray-500 mt-1">
              Password must be at least 6 characters long
            </p>
          </div>
          
          <Button 
            onClick={createUser} 
            disabled={loading || !email || !password}
            className="bg-cyber-blue hover:bg-cyber-blue/90 w-full"
          >
            {loading ? 'Creating...' : 'Create Admin User'}
            <UserPlus className="ml-2 h-4 w-4" />
          </Button>
        </div>
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
      
      <div className="mt-8 border rounded-lg p-6 bg-gray-50">
        <h2 className="text-xl font-semibold mb-4">Next Steps</h2>
        <ol className="list-decimal pl-5 space-y-2">
          <li>After creating the user, check your email for a confirmation link</li>
          <li>Click the confirmation link to verify your account</li>
          <li>Sign in with your new credentials</li>
          <li>Visit the <a href="/add-admin-column" className="text-blue-600 hover:underline">Add Admin Column</a> page to ensure the is_admin column exists</li>
          <li>Visit the <a href="/make-admin" className="text-blue-600 hover:underline">Make Admin</a> page to grant admin privileges to your account</li>
        </ol>
      </div>
    </div>
  );
}
