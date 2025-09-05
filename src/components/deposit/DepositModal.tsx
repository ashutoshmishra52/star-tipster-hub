import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { useStore } from '@/stores/useStore';
import { CreditCard, Smartphone, Wallet, Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface DepositModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const paymentMethods = [
  { id: 'upi', name: 'UPI', icon: Smartphone, description: 'Pay via UPI ID or QR code' },
  { id: 'card', name: 'Card', icon: CreditCard, description: 'Credit/Debit card payment' },
  { id: 'wallet', name: 'Wallet', icon: Wallet, description: 'Pay via digital wallet' }
];

const quickAmounts = [100, 250, 500, 1000, 2500, 5000];

export function DepositModal({ isOpen, onClose }: DepositModalProps) {
  const { depositFunds } = useStore();
  const [amount, setAmount] = useState('');
  const [selectedMethod, setSelectedMethod] = useState('upi');
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const handleDeposit = async () => {
    const depositAmount = parseFloat(amount);
    
    if (!depositAmount || depositAmount < 10) {
      toast({
        title: "Invalid Amount",
        description: "Minimum deposit amount is ₹10",
        variant: "destructive"
      });
      return;
    }

    if (depositAmount > 50000) {
      toast({
        title: "Amount Too High",
        description: "Maximum deposit amount is ₹50,000",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);

    // Simulate payment processing
    setTimeout(() => {
      depositFunds(depositAmount);
      toast({
        title: "Deposit Successful!",
        description: `₹${depositAmount} has been added to your wallet`,
      });
      setAmount('');
      setIsProcessing(false);
      onClose();
    }, 2000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5 text-green-success" />
            Add Funds to Wallet
          </DialogTitle>
          <DialogDescription>
            Choose your preferred payment method and amount
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Quick Amount Selection */}
          <div className="space-y-3">
            <Label>Quick Amount Selection</Label>
            <div className="grid grid-cols-3 gap-2">
              {quickAmounts.map((quickAmount) => (
                <Button
                  key={quickAmount}
                  variant="outline"
                  size="sm"
                  onClick={() => setAmount(quickAmount.toString())}
                  className="text-sm"
                >
                  ₹{quickAmount}
                </Button>
              ))}
            </div>
          </div>

          {/* Custom Amount */}
          <div className="space-y-2">
            <Label htmlFor="amount">Custom Amount</Label>
            <Input
              id="amount"
              type="number"
              placeholder="Enter amount (Min: ₹10)"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              min="10"
              max="50000"
            />
            <div className="text-xs text-muted-foreground">
              Minimum: ₹10 • Maximum: ₹50,000
            </div>
          </div>

          {/* Payment Methods */}
          <div className="space-y-3">
            <Label>Payment Method</Label>
            <div className="space-y-2">
              {paymentMethods.map((method) => {
                const IconComponent = method.icon;
                return (
                  <Card
                    key={method.id}
                    className={`cursor-pointer transition-all ${
                      selectedMethod === method.id 
                        ? 'ring-2 ring-primary bg-primary/5' 
                        : 'hover:bg-accent/50'
                    }`}
                    onClick={() => setSelectedMethod(method.id)}
                  >
                    <CardContent className="p-3">
                      <div className="flex items-center gap-3">
                        <IconComponent className="h-5 w-5 text-primary" />
                        <div>
                          <div className="font-medium text-sm">{method.name}</div>
                          <div className="text-xs text-muted-foreground">
                            {method.description}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Deposit Button */}
          <Button 
            onClick={handleDeposit}
            disabled={!amount || isProcessing}
            className="w-full gradient-success"
          >
            {isProcessing ? 'Processing...' : `Deposit ₹${amount || '0'}`}
          </Button>

          {/* Security Note */}
          <div className="text-xs text-muted-foreground bg-accent/10 p-3 rounded-lg">
            🔒 All transactions are secure and encrypted. Your payment information is safe with us.
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}