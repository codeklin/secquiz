// Follow this setup guide to integrate the Deno runtime into your application:
// https://deno.com/deploy/docs/supabase-functions

import { serve } from "https://deno.land/std@0.208.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.7";

// Define types for request
interface PaymentRequest {
  reference: string;
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }
  
  try {
    console.log('Received payment verification request');
    const { reference } = await req.json() as PaymentRequest;
    console.log(`Processing payment reference: ${reference}`);

    // Create Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
    if (!supabaseUrl || !supabaseKey) {
      console.error('Missing Supabase credentials');
      throw new Error('Server configuration error');
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Verify payment with Paystack API
    const paystackSecretKey = Deno.env.get('PAYSTACK_SECRET_KEY') || '';
    if (!paystackSecretKey) {
      console.error('Missing Paystack secret key');
      throw new Error('Server configuration error');
    }

    console.log('Verifying payment with Paystack API');
    const response = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
      headers: {
        Authorization: `Bearer ${paystackSecretKey}`
      }
    });

    if (!response.ok) {
      console.error(`Paystack API error: ${response.status} ${response.statusText}`);
      throw new Error(`Payment verification failed: ${response.statusText}`);
    }

    const paymentData = await response.json();
    console.log('Paystack response received:', JSON.stringify(paymentData, null, 2));

    if (!paymentData.status) {
      console.error('Invalid Paystack response:', paymentData);
      throw new Error('Invalid payment response from Paystack');
    }

    if (paymentData.status && paymentData.data.status === 'success') {
      console.log('Payment successful, processing user data');
      // Find user by email
      console.log(`Looking up user with email: ${paymentData.data.customer.email}`);
      const { data: users, error: userError } = await supabase.auth
        .admin
        .listUsers();

      if (userError) {
        console.error('Error finding user:', userError);
        throw new Error(`User lookup failed: ${userError.message}`);
      }

      const user = users.users.find(u => u.email === paymentData.data.customer.email);

      if (!user) {
        console.error('User not found for email:', paymentData.data.customer.email);
        throw new Error('User not found');
      }

      // Get the user ID using the correct property
      const userId = user.id;

      console.log(`Found user with ID: ${userId}`);

      // Record payment
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 30); // 30 days from now

      console.log('Recording payment in database');
      const { error: paymentError } = await supabase
        .from('payments')
        .insert([{
          user_id: userId,
          reference: reference,
          email: paymentData.data.customer.email,
          amount: paymentData.data.amount / 100, // Convert from kobo to NGN
          status: paymentData.data.status,
          expires_at: expiresAt.toISOString()
        }]);

      if (paymentError) {
        console.error('Error recording payment:', paymentError);
        throw paymentError;
      }

      console.log('Payment recorded successfully');

      // Update user access
      console.log(`Updating access for user: ${userId}`);
      const { error: accessError } = await supabase
        .from('profiles')
        .update({
          has_access: true,
          access_expires_at: expiresAt.toISOString()
        })
        .eq('id', userId);

      if (accessError) {
        console.error('Error updating user access:', accessError);
        throw accessError;
      }

      console.log('User access updated successfully');
    }

    // Add a success message to the response
    const responseData = {
      ...paymentData,
      message: paymentData.data.status === 'success'
        ? 'Payment processed successfully'
        : 'Payment verification completed'
    };

    console.log('Sending response:', JSON.stringify(responseData, null, 2));
    return new Response(
      JSON.stringify(responseData),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    );
  } catch (error: Error | unknown) {
    console.error('Error processing payment:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    const errorStack = error instanceof Error ? error.stack : 'No stack trace available';
    
    return new Response(
      JSON.stringify({
        error: errorMessage,
        details: errorStack
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400
      }
    );
  }
});




