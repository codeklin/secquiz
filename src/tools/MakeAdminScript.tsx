import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Shield, Check } from 'lucide-react';

export default function MakeAdminScript() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);
  const [userExists, setUserExists] = useState<boolean | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  const targetEmail = "gigsdev007@gmail.com";

  useEffect(() => {
    async function checkTableStructure() {
      try {
        setLoading(true);

        // First, let's check the structure of the profiles table
        const { data: tableInfo, error: tableError } = await supabase
          .from('profiles')
          .select('*')
          .limit(1);

        if (tableError) throw tableError;

        // Log the structure to help debug
        console.log('Profiles table structure:', tableInfo && tableInfo.length > 0 ? Object.keys(tableInfo[0]) : 'No data');

        // Now check if the user exists
        // We'll use user_id instead of email if that's what the table has
        const { data: users, error: usersError } = await supabase
          .from('profiles')
          .select('*');

        if (usersError) throw usersError;

        console.log('Users found:', users?.length);

        // Check if any user has the target email
        const userWithEmail = users?.find(user =>
          user.email === targetEmail ||
          user.user_id === targetEmail ||
          user.id === targetEmail
        );

        if (userWithEmail) {
          setUserExists(true);
          setIsAdmin(userWithEmail.is_admin || false);
          setUserEmail(userWithEmail.email || userWithEmail.user_id || userWithEmail.id);
        } else {
          setUserExists(false);
        }
      } catch (error: any) {
        console.error('Error checking table structure:', error);
        setResult({
          success: false,
          message: `Error: ${error.message || 'Unknown error occurred'}`
        });
      } finally {
        setLoading(false);
      }
    }

    checkTableStructure();
  }, []);

  const makeAdmin = async () => {
    try {
      setLoading(true);
      setResult(null);

      // First, let's get the table structure again to determine column names
      const { data: tableInfo, error: tableError } = await supabase
        .from('profiles')
        .select('*')
        .limit(1);

      if (tableError) throw tableError;

      const columns = tableInfo && tableInfo.length > 0 ? Object.keys(tableInfo[0]) : [];
      console.log('Available columns:', columns);

      if (!userExists) {
        // User doesn't exist, let's create a new profile
        // First, check if we have the right columns
        if (!columns.includes('is_admin')) {
          // Need to add is_admin column
          setResult({
            success: false,
            message: `The profiles table doesn't have an is_admin column. Please add this column first.`
          });
          return;
        }

        // Prepare the data based on available columns
        const userData: any = { is_admin: true };

        // Add other required fields based on available columns
        if (columns.includes('email')) userData.email = targetEmail;
        if (columns.includes('user_id')) userData.user_id = targetEmail;
        if (columns.includes('display_name')) userData.display_name = 'Admin User';
        if (columns.includes('name')) userData.name = 'Admin User';

        // Insert the new profile
        const { data, error } = await supabase
          .from('profiles')
          .insert([userData])
          .select();

        if (error) {
          if (error.message.includes('violates foreign key constraint')) {
            setResult({
              success: false,
              message: `Cannot create profile directly. The email ${targetEmail} needs to sign up first through the authentication system.`
            });
            return;
          }
          throw error;
        }

        setUserExists(true);
        setIsAdmin(true);
        setResult({
          success: true,
          message: `Successfully created a new profile for ${targetEmail} with admin privileges!`
        });
      } else {
        // User exists, update to make admin
        if (isAdmin) {
          setResult({
            success: true,
            message: `User ${targetEmail} is already an admin.`
          });
          return;
        }

        // Determine which column to use for the where clause
        let whereColumn = 'id';
        if (columns.includes('email')) whereColumn = 'email';
        else if (columns.includes('user_id')) whereColumn = 'user_id';

        // Update the user to be an admin
        const { error } = await supabase
          .from('profiles')
          .update({ is_admin: true })
          .eq(whereColumn, userEmail || targetEmail);

        if (error) throw error;

        setIsAdmin(true);
        setResult({
          success: true,
          message: `Successfully made ${targetEmail} an admin!`
        });
      }
    } catch (error: any) {
      console.error('Error making admin:', error);
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
      <h1 className="text-3xl font-bold mb-6">Make Admin Script</h1>

      <div className="mb-8">
        <p className="text-gray-600 mb-4">
          This tool will make the email address <strong>{targetEmail}</strong> an admin.
        </p>

        {userExists === null ? (
          <p>Checking if user exists...</p>
        ) : userExists ? (
          <Alert className="mb-4 bg-blue-50 border-blue-200">
            <Shield className="text-blue-500" />
            <AlertTitle className="text-blue-800">User Found</AlertTitle>
            <AlertDescription className="text-blue-700">
              User with email {userEmail} exists in the database.
              {isAdmin ? (
                <div className="mt-2 flex items-center text-green-600">
                  <Check className="mr-2 h-4 w-4" />
                  This user is already an admin.
                </div>
              ) : (
                <div className="mt-2">This user is not an admin yet.</div>
              )}
            </AlertDescription>
          </Alert>
        ) : (
          <Alert className="mb-4 bg-yellow-50 border-yellow-200">
            <Shield className="text-yellow-500" />
            <AlertTitle className="text-yellow-800">User Not Found</AlertTitle>
            <AlertDescription className="text-yellow-700">
              No user with email {targetEmail} exists in the database.
              The user needs to sign up first before they can be made an admin.
            </AlertDescription>
          </Alert>
        )}

        <Button
          onClick={makeAdmin}
          disabled={loading || !userExists || isAdmin}
          className="bg-cyber-blue hover:bg-cyber-blue/90"
        >
          {loading ? 'Processing...' : isAdmin ? 'Already Admin' : 'Make Admin'}
        </Button>
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
    </div>
  );
}
