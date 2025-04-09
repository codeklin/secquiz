import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Shield, Search, Check, X, UserPlus } from 'lucide-react';
import { UserAvatar } from '@/components/UserAvatar';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useAuthStore } from '@/lib/auth';

interface User {
  id: string;
  email: string;
  name?: string;
  is_admin: boolean;
  created_at: string;
}

export default function ManageAdmins() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [addUserEmail, setAddUserEmail] = useState('');
  const [addUserDialogOpen, setAddUserDialogOpen] = useState(false);
  const [addUserResult, setAddUserResult] = useState<{ success: boolean; message: string } | null>(null);
  const [addUserLoading, setAddUserLoading] = useState(false);
  const { user: currentUser } = useAuthStore();

  useEffect(() => {
    fetchUsers();
  }, []);

  async function fetchUsers() {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('profiles')
        .select('id, email, name, is_admin, created_at')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      setUsers(data || []);
    } catch (err: any) {
      console.error('Error fetching users:', err);
      setError(err.message || 'Failed to load users');
    } finally {
      setLoading(false);
    }
  }

  async function toggleAdminStatus(userId: string, currentStatus: boolean) {
    try {
      // Don't allow removing admin status from yourself
      if (userId === currentUser?.id && currentStatus === true) {
        setError("You cannot remove your own admin privileges");
        return;
      }
      
      const { error } = await supabase
        .from('profiles')
        .update({ is_admin: !currentStatus })
        .eq('id', userId);
      
      if (error) throw error;
      
      // Update local state
      setUsers(users.map(user => 
        user.id === userId ? { ...user, is_admin: !currentStatus } : user
      ));
    } catch (err: any) {
      console.error('Error toggling admin status:', err);
      setError(err.message || 'Failed to update user');
    }
  }

  async function handleAddUser() {
    try {
      setAddUserLoading(true);
      setAddUserResult(null);
      
      if (!addUserEmail.trim()) {
        setAddUserResult({
          success: false,
          message: 'Please enter a valid email address'
        });
        return;
      }
      
      // First check if the user exists
      const { data: existingUser, error: searchError } = await supabase
        .from('profiles')
        .select('id, email, is_admin')
        .eq('email', addUserEmail.trim().toLowerCase())
        .single();
      
      if (searchError && searchError.code !== 'PGRST116') {
        // PGRST116 is "No rows returned" which is expected if user doesn't exist
        throw searchError;
      }
      
      if (existingUser) {
        if (existingUser.is_admin) {
          setAddUserResult({
            success: false,
            message: 'This user is already an admin'
          });
          return;
        }
        
        // User exists but is not an admin, make them admin
        const { error: updateError } = await supabase
          .from('profiles')
          .update({ is_admin: true })
          .eq('id', existingUser.id);
        
        if (updateError) throw updateError;
        
        setAddUserResult({
          success: true,
          message: 'User has been granted admin privileges'
        });
        
        // Update the users list
        fetchUsers();
      } else {
        setAddUserResult({
          success: false,
          message: 'User not found. They must sign up first before being granted admin privileges.'
        });
      }
    } catch (err: any) {
      console.error('Error adding admin:', err);
      setAddUserResult({
        success: false,
        message: err.message || 'Failed to add admin'
      });
    } finally {
      setAddUserLoading(false);
    }
  }

  const filteredUsers = users.filter(user => 
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (user.name && user.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-6">Manage Administrators</h1>
      
      <div className="mb-6 flex flex-col sm:flex-row gap-4 justify-between">
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search users..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <Dialog open={addUserDialogOpen} onOpenChange={setAddUserDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-cyber-blue hover:bg-cyber-blue/90">
              <UserPlus className="mr-2 h-4 w-4" />
              Add Admin
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Administrator</DialogTitle>
              <DialogDescription>
                Enter the email address of the user you want to grant admin privileges to.
                The user must already have an account in the system.
              </DialogDescription>
            </DialogHeader>
            
            <div className="py-4">
              <Input
                placeholder="user@example.com"
                value={addUserEmail}
                onChange={(e) => setAddUserEmail(e.target.value)}
                disabled={addUserLoading}
              />
              
              {addUserResult && (
                <Alert className={`mt-4 ${addUserResult.success ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"}`}>
                  <Shield className={addUserResult.success ? "text-green-500" : "text-red-500"} />
                  <AlertTitle className={addUserResult.success ? "text-green-800" : "text-red-800"}>
                    {addUserResult.success ? 'Success!' : 'Error!'}
                  </AlertTitle>
                  <AlertDescription className={addUserResult.success ? "text-green-700" : "text-red-700"}>
                    {addUserResult.message}
                  </AlertDescription>
                </Alert>
              )}
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setAddUserDialogOpen(false)}>
                Cancel
              </Button>
              <Button 
                onClick={handleAddUser} 
                disabled={addUserLoading}
                className="bg-cyber-blue hover:bg-cyber-blue/90"
              >
                {addUserLoading ? 'Processing...' : 'Add Admin'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      {error && (
        <Alert className="mb-6 bg-red-50 border-red-200">
          <Shield className="text-red-500" />
          <AlertTitle className="text-red-800">Error</AlertTitle>
          <AlertDescription className="text-red-700">{error}</AlertDescription>
        </Alert>
      )}
      
      {loading ? (
        <div className="text-center py-8">
          <p>Loading users...</p>
        </div>
      ) : (
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12"></TableHead>
                <TableHead>User</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Admin Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                    {searchTerm ? 'No users match your search' : 'No users found'}
                  </TableCell>
                </TableRow>
              ) : (
                filteredUsers.map(user => (
                  <TableRow key={user.id} className={user.id === currentUser?.id ? "bg-blue-50" : ""}>
                    <TableCell>
                      <UserAvatar name={user.name || user.email} size="sm" />
                    </TableCell>
                    <TableCell className="font-medium">
                      {user.name || 'Unnamed User'}
                      {user.id === currentUser?.id && (
                        <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                          You
                        </span>
                      )}
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      {user.is_admin ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          <Check className="mr-1 h-3 w-3" />
                          Admin
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          <X className="mr-1 h-3 w-3" />
                          Regular User
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant={user.is_admin ? "destructive" : "outline"}
                        size="sm"
                        onClick={() => toggleAdminStatus(user.id, user.is_admin)}
                        disabled={user.id === currentUser?.id && user.is_admin}
                        title={user.id === currentUser?.id && user.is_admin ? "You cannot remove your own admin privileges" : ""}
                      >
                        {user.is_admin ? 'Remove Admin' : 'Make Admin'}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
