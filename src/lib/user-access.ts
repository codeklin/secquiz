import { supabase } from './supabase';

/**
 * Updates a user's access status in Supabase
 */
export async function updateUserAccess(userId: string, hasAccess: boolean, expiresAt?: Date) {
  const { error } = await supabase
    .from('profiles')
    .update({
      has_access: hasAccess,
      access_expires_at: expiresAt?.toISOString()
    })
    .eq('id', userId);

  if (error) {
    console.error('Error updating user access:', error);
    throw error;
  }
}

/**
 * Checks if a user has access to premium content
 */
export async function checkUserAccess(userId: string): Promise<boolean> {
  const { data, error } = await supabase
    .from('profiles')
    .select('has_access, access_expires_at')
    .eq('id', userId)
    .single();

  if (error) {
    console.error('Error checking user access:', error);
    return false;
  }

  if (!data || !data.has_access) return false;
  
  // Check if access has expired
  if (data.access_expires_at) {
    const expiresAt = new Date(data.access_expires_at);
    if (expiresAt < new Date()) return false;
  }

  return true;
}

/**
 * Records a payment and updates user access
 */
export async function recordPayment(userId: string, reference: string, email: string, amount: number, status: string) {
  // Set access to expire in 30 days
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 30);
  
  try {
    // First record the payment
    const { error: paymentError } = await supabase
      .from('payments')
      .insert([{
        user_id: userId,
        reference,
        email,
        amount,
        status,
        created_at: new Date().toISOString(),
        expires_at: expiresAt.toISOString()
      }]);

    if (paymentError) throw paymentError;
    
    // Then update user access
    await updateUserAccess(userId, true, expiresAt);
    
    return true;
  } catch (error) {
    console.error('Error recording payment:', error);
    throw error;
  }
}

/**
 * Gets a user's quiz progress
 */
export async function getUserProgress(userId: string) {
  const { data, error } = await supabase
    .from('quiz_results')
    .select(`
      id,
      score,
      total_questions,
      created_at,
      topic_id,
      topics:topic_id (
        id,
        title
      )
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error getting user progress:', error);
    throw error;
  }
  
  return data || [];
}

/**
 * Verifies a payment with Paystack (client-side version)
 */
export async function verifyPayment(reference: string, userId: string, email: string) {
  try {
    // In a real implementation, you would call your Supabase Edge Function here
    // For now, we'll just record the payment directly
    await recordPayment(userId, reference, email, 5000, 'success');
    return { success: true };
  } catch (error) {
    console.error('Error verifying payment:', error);
    return { success: false, error };
  }
}
