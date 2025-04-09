import { useEffect, useState } from 'react';
import { usePaystackPayment } from 'react-paystack';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { useAuthStore } from '@/lib/auth';
import { recordPayment } from '@/lib/user-access';
import { CheckCircle } from 'lucide-react';

interface PaymentModalProps {
  open: boolean;
  onClose: () => void;
}

const PAYSTACK_PUBLIC_KEY = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY;
const PRICE = 5000; // ₦5,000 in kobo

export default function PaymentModal({ open, onClose }: PaymentModalProps) {
  const { user } = useAuthStore();
  const { toast } = useToast();

  const config = {
    reference: new Date().getTime().toString(),
    email: user?.email || '',
    amount: PRICE,
    publicKey: PAYSTACK_PUBLIC_KEY,
  };

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const onSuccess = async (reference: any) => {
    try {
      setLoading(true);

      if (!user?.id) {
        throw new Error('User not authenticated');
      }

      // Record payment and update user access
      await recordPayment(
        user.id,
        reference.reference,
        user.email,
        PRICE / 100, // Convert from kobo to naira
        'success'
      );

      setSuccess(true);
      toast({
        title: "Payment Successful",
        description: "You now have access to all quizzes for 30 days!",
      });

      // Close the modal after 3 seconds of showing success
      setTimeout(() => {
        onClose();
        setSuccess(false);
      }, 3000);

    } catch (error) {
      console.error('Error recording payment:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not verify payment. Please contact support.",
      });
    } finally {
      setLoading(false);
    }
  };

  const onClose2 = () => {
    toast({
      variant: "destructive",
      title: "Payment Cancelled",
      description: "Your payment was not completed.",
    });
    onClose();
  };

  const initializePayment = usePaystackPayment(config);

  useEffect(() => {
    if (!user?.email && open) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please sign in to make a payment.",
      });
      onClose();
    }
  }, [user?.email, open, toast, onClose]);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Get Full Access</DialogTitle>
          <DialogDescription>
            Access all quizzes and track your progress for just ₦5,000
          </DialogDescription>
        </DialogHeader>
        {success ? (
          <div className="py-6 flex flex-col items-center justify-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Payment Successful!</h3>
            <p className="text-center text-gray-600">
              You now have full access to all quizzes for 30 days.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="rounded-lg border p-4">
              <h3 className="font-semibold mb-2">What you get:</h3>
              <ul className="space-y-2">
                <li>✓ Access to all quiz topics</li>
                <li>✓ Detailed explanations</li>
                <li>✓ Progress tracking</li>
                <li>✓ 30 days access</li>
              </ul>
            </div>
            <Button
              className="w-full"
              onClick={() => initializePayment(onSuccess, onClose2)}
              disabled={loading}
            >
              {loading ? 'Processing...' : 'Pay ₦5,000'}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}