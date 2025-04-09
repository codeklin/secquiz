import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Shield, Database } from 'lucide-react';

export default function AddAdminColumn() {
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);
  const [tableInfo, setTableInfo] = useState<any>(null);
  const [hasAdminColumn, setHasAdminColumn] = useState<boolean | null>(null);

  useEffect(() => {
    async function checkTableStructure() {
      try {
        setChecking(true);

        // First, let's check the structure of the profiles table
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .limit(1);

        if (error) throw error;

        const columns = data && data.length > 0 ? Object.keys(data[0]) : [];
        console.log('Profiles table columns:', columns);

        setTableInfo({
          columns,
          sample: data && data.length > 0 ? data[0] : null
        });

        setHasAdminColumn(columns.includes('is_admin'));
      } catch (error: any) {
        console.error('Error checking table structure:', error);
        setResult({
          success: false,
          message: `Error checking table structure: ${error.message || 'Unknown error occurred'}`
        });
      } finally {
        setChecking(false);
      }
    }

    checkTableStructure();
  }, []);

  const addAdminColumn = async () => {
    try {
      setLoading(true);
      setResult(null);

      // Try to add the is_admin column using SQL
      const { error } = await supabase.rpc(
        'execute_sql',
        { query: 'ALTER TABLE profiles ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT FALSE;' }
      );

      if (error) {
        // If the RPC method fails, try a different approach
        if (error.message.includes('function execute_sql') || error.message.includes('does not exist')) {
          // The execute_sql function doesn't exist, let's try a different approach
          setResult({
            success: false,
            message: `Cannot add column automatically. Please add the column manually in the Supabase dashboard:
            1. Go to your Supabase project
            2. Click on "Table Editor"
            3. Select the "profiles" table
            4. Click "Add Column"
            5. Name it "is_admin", type "boolean", with default value "false"`
          });
          return;
        }
        throw error;
      }

      setHasAdminColumn(true);
      setResult({
        success: true,
        message: 'Successfully added is_admin column to the profiles table!'
      });

      // Refresh the page after a short delay
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (error: any) {
      console.error('Error adding admin column:', error);
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
      <h1 className="text-3xl font-bold mb-6">Add Admin Column</h1>

      <div className="mb-8">
        <p className="text-gray-600 mb-4">
          This tool will add an <code>is_admin</code> column to your profiles table, which is required for admin access control.
        </p>

        {checking ? (
          <p>Checking table structure...</p>
        ) : hasAdminColumn ? (
          <Alert className="mb-4 bg-green-50 border-green-200">
            <Shield className="text-green-500" />
            <AlertTitle className="text-green-800">Column Already Exists</AlertTitle>
            <AlertDescription className="text-green-700">
              The <code>is_admin</code> column already exists in your profiles table.
            </AlertDescription>
          </Alert>
        ) : (
          <Alert className="mb-4 bg-yellow-50 border-yellow-200">
            <Database className="text-yellow-500" />
            <AlertTitle className="text-yellow-800">Column Missing</AlertTitle>
            <AlertDescription className="text-yellow-700">
              The <code>is_admin</code> column does not exist in your profiles table. Click the button below to add it.
            </AlertDescription>
          </Alert>
        )}

        <Button
          onClick={addAdminColumn}
          disabled={loading || checking || hasAdminColumn}
          className="bg-cyber-blue hover:bg-cyber-blue/90"
        >
          {loading ? 'Adding Column...' : hasAdminColumn ? 'Column Already Added' : 'Add is_admin Column'}
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

      {tableInfo && (
        <div className="mt-8 border rounded-lg p-6 bg-gray-50">
          <h2 className="text-xl font-semibold mb-4">Table Information</h2>

          <div className="mb-4">
            <h3 className="text-lg font-medium mb-2">Columns</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
              {tableInfo.columns.map((column: string) => (
                <div
                  key={column}
                  className={`p-2 rounded ${column === 'is_admin' ? 'bg-green-100 border border-green-300' : 'bg-gray-100'}`}
                >
                  {column}
                </div>
              ))}
            </div>
          </div>

          {tableInfo.sample && (
            <div>
              <h3 className="text-lg font-medium mb-2">Sample Row</h3>
              <pre className="bg-gray-100 p-4 rounded overflow-auto max-h-60 text-xs">
                {JSON.stringify(tableInfo.sample, null, 2)}
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
