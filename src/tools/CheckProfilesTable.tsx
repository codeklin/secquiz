import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Shield } from 'lucide-react';

export default function CheckProfilesTable() {
  const [tableInfo, setTableInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTableInfo() {
      try {
        // Get table structure
        const { data: tableData, error: tableError } = await supabase
          .from('profiles')
          .select('*')
          .limit(1);

        if (tableError) throw tableError;

        // Get a sample profile
        const { data: sampleProfile, error: sampleError } = await supabase
          .from('profiles')
          .select('*')
          .limit(1)
          .single();

        if (sampleError && sampleError.code !== 'PGRST116') {
          // PGRST116 is "No rows returned" which is fine
          throw sampleError;
        }

        setTableInfo({
          columns: tableData ? Object.keys(tableData[0] || {}) : [],
          sampleProfile: sampleProfile || null
        });
      } catch (err: any) {
        console.error('Error fetching table info:', err);
        setError(err.message || 'An error occurred');
      } finally {
        setLoading(false);
      }
    }

    fetchTableInfo();
  }, []);

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-6">Profiles Table Information</h1>
      
      {loading ? (
        <p>Loading table information...</p>
      ) : error ? (
        <Alert className="bg-red-50 border-red-200">
          <Shield className="text-red-500" />
          <AlertTitle className="text-red-800">Error</AlertTitle>
          <AlertDescription className="text-red-700">{error}</AlertDescription>
        </Alert>
      ) : (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Table Columns</h2>
            <div className="grid grid-cols-3 gap-4">
              {tableInfo?.columns.map((column: string) => (
                <div key={column} className="bg-gray-100 p-3 rounded">
                  {column}
                </div>
              ))}
            </div>
          </div>
          
          {tableInfo?.sampleProfile && (
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4">Sample Profile</h2>
              <pre className="bg-gray-100 p-4 rounded overflow-auto max-h-96">
                {JSON.stringify(tableInfo.sampleProfile, null, 2)}
              </pre>
            </div>
          )}
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Recommended Changes</h2>
            <p className="mb-4">
              To implement admin access control, we need to add an <code>is_admin</code> boolean column to the profiles table.
            </p>
            <Button 
              onClick={async () => {
                try {
                  setLoading(true);
                  // Check if column already exists
                  if (tableInfo?.columns.includes('is_admin')) {
                    setError('The is_admin column already exists in the profiles table.');
                    return;
                  }
                  
                  // Add the column using SQL
                  const { error: alterError } = await supabase.rpc(
                    'execute_sql',
                    { 
                      query: 'ALTER TABLE profiles ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT FALSE;' 
                    }
                  );
                  
                  if (alterError) throw alterError;
                  
                  // Refresh the page to show the updated table
                  window.location.reload();
                } catch (err: any) {
                  console.error('Error adding column:', err);
                  setError(err.message || 'Failed to add is_admin column');
                } finally {
                  setLoading(false);
                }
              }}
              className="bg-cyber-blue hover:bg-cyber-blue/90"
            >
              Add is_admin Column
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
