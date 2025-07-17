import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  CreditCard, 
  Smartphone, 
  Shield, 
  CheckCircle, 
  ArrowLeft,
  Lock,
  Zap,
  Crown,
  Star
} from 'lucide-react';
import { toast } from 'sonner';

interface PaymentFlowProps {
  plan: {
    name: string;
    price: string;
    period: string;
    features: string[];
  };
  onClose: () => void;
  onSuccess: () => void;
}

type PaymentStep = 'method' | 'card' | 'upi' | 'processing' | 'success';

export function PaymentFlow({ plan, onClose, onSuccess }: PaymentFlowProps) {
  const [currentStep, setCurrentStep] = useState<PaymentStep>('method');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'upi' | null>(null);
  const [progress, setProgress] = useState(0);
  const [formData, setFormData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: '',
    upiId: ''
  });

  const handleMethodSelect = (method: 'card' | 'upi') => {
    setPaymentMethod(method);
    setCurrentStep(method);
  };

  const handleCardPayment = async () => {
    if (!formData.cardNumber || !formData.expiryDate || !formData.cvv || !formData.cardholderName) {
      toast.error('Please fill in all card details');
      return;
    }

    setCurrentStep('processing');
    setProgress(0);

    // Simulate realistic payment processing
    const steps = [
      { progress: 20, message: 'Validating card details...' },
      { progress: 40, message: 'Contacting bank...' },
      { progress: 60, message: 'Processing payment...' },
      { progress: 80, message: 'Confirming transaction...' },
      { progress: 100, message: 'Payment successful!' }
    ];

    for (const step of steps) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setProgress(step.progress);
      toast.info(step.message);
    }

    setCurrentStep('success');
    setTimeout(() => {
      onSuccess();
      toast.success(`Successfully upgraded to ${plan.name} plan!`);
    }, 2000);
  };

  const handleUpiPayment = async () => {
    if (!formData.upiId) {
      toast.error('Please enter your UPI ID');
      return;
    }

    setCurrentStep('processing');
    setProgress(0);

    // Simulate UPI payment flow
    const steps = [
      { progress: 25, message: 'Validating UPI ID...' },
      { progress: 50, message: 'Sending payment request...' },
      { progress: 75, message: 'Waiting for approval...' },
      { progress: 100, message: 'Payment approved!' }
    ];

    for (const step of steps) {
      await new Promise(resolve => setTimeout(resolve, 1200));
      setProgress(step.progress);
      toast.info(step.message);
    }

    setCurrentStep('success');
    setTimeout(() => {
      onSuccess();
      toast.success(`Successfully upgraded to ${plan.name} plan!`);
    }, 2000);
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="w-full max-w-md"
      >
        <Card className="bg-gray-900 border-purple-800/30 shadow-2xl">
          <CardHeader className="text-center">
            <div className="flex items-center justify-between mb-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={currentStep === 'method' ? onClose : () => setCurrentStep('method')}
                className="text-gray-400 hover:text-white"
              >
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <Badge className="bg-purple-600 text-white">
                {plan.name === 'creator' && <Zap className="w-3 h-3 mr-1" />}
                {plan.name === 'ghostwriter' && <Crown className="w-3 h-3 mr-1" />}
                {plan.name === 'agency' && <Star className="w-3 h-3 mr-1" />}
                {plan.name.toUpperCase()}
              </Badge>
            </div>
            <CardTitle className="text-white">
              {currentStep === 'method' && 'Choose Payment Method'}
              {currentStep === 'card' && 'Card Details'}
              {currentStep === 'upi' && 'UPI Payment'}
              {currentStep === 'processing' && 'Processing Payment'}
              {currentStep === 'success' && 'Payment Successful!'}
            </CardTitle>
            <div className="text-center">
              <span className="text-2xl font-bold text-purple-400">{plan.price}</span>
              <span className="text-gray-400">/{plan.period}</span>
            </div>
          </CardHeader>

          <CardContent>
            <AnimatePresence mode="wait">
              {currentStep === 'method' && (
                <motion.div
                  key="method"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  <Button
                    onClick={() => handleMethodSelect('card')}
                    className="w-full h-16 bg-gray-800 hover:bg-gray-700 border border-gray-700 justify-start"
                  >
                    <CreditCard className="w-6 h-6 mr-4 text-purple-400" />
                    <div className="text-left">
                      <div className="text-white font-medium">Credit/Debit Card</div>
                      <div className="text-gray-400 text-sm">Visa, Mastercard, Amex</div>
                    </div>
                  </Button>

                  <Button
                    onClick={() => handleMethodSelect('upi')}
                    className="w-full h-16 bg-gray-800 hover:bg-gray-700 border border-gray-700 justify-start"
                  >
                    <Smartphone className="w-6 h-6 mr-4 text-purple-400" />
                    <div className="text-left">
                      <div className="text-white font-medium">UPI Payment</div>
                      <div className="text-gray-400 text-sm">PhonePe, GPay, Paytm</div>
                    </div>
                  </Button>

                  <div className="flex items-center justify-center space-x-2 text-gray-400 text-sm mt-6">
                    <Shield className="w-4 h-4" />
                    <span>Secured by 256-bit SSL encryption</span>
                  </div>
                </motion.div>
              )}

              {currentStep === 'card' && (
                <motion.div
                  key="card"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  <div>
                    <Label className="text-gray-300">Cardholder Name</Label>
                    <Input
                      placeholder="John Doe"
                      value={formData.cardholderName}
                      onChange={(e) => setFormData({...formData, cardholderName: e.target.value})}
                      className="bg-gray-800 border-gray-700 text-white"
                    />
                  </div>

                  <div>
                    <Label className="text-gray-300">Card Number</Label>
                    <Input
                      placeholder="1234 5678 9012 3456"
                      value={formData.cardNumber}
                      onChange={(e) => setFormData({...formData, cardNumber: formatCardNumber(e.target.value)})}
                      maxLength={19}
                      className="bg-gray-800 border-gray-700 text-white"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-gray-300">Expiry Date</Label>
                      <Input
                        placeholder="MM/YY"
                        value={formData.expiryDate}
                        onChange={(e) => setFormData({...formData, expiryDate: formatExpiryDate(e.target.value)})}
                        maxLength={5}
                        className="bg-gray-800 border-gray-700 text-white"
                      />
                    </div>
                    <div>
                      <Label className="text-gray-300">CVV</Label>
                      <Input
                        placeholder="123"
                        value={formData.cvv}
                        onChange={(e) => setFormData({...formData, cvv: e.target.value.replace(/\D/g, '')})}
                        maxLength={4}
                        className="bg-gray-800 border-gray-700 text-white"
                      />
                    </div>
                  </div>

                  <Button
                    onClick={handleCardPayment}
                    className="w-full bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900"
                  >
                    <Lock className="w-4 h-4 mr-2" />
                    Pay {plan.price}
                  </Button>
                </motion.div>
              )}

              {currentStep === 'upi' && (
                <motion.div
                  key="upi"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  <div>
                    <Label className="text-gray-300">UPI ID</Label>
                    <Input
                      placeholder="yourname@paytm"
                      value={formData.upiId}
                      onChange={(e) => setFormData({...formData, upiId: e.target.value})}
                      className="bg-gray-800 border-gray-700 text-white"
                    />
                  </div>

                  <div className="p-4 bg-blue-600/20 border border-blue-500/50 rounded-lg">
                    <p className="text-blue-300 text-sm">
                      You'll receive a payment request on your UPI app. Please approve it to complete the transaction.
                    </p>
                  </div>

                  <Button
                    onClick={handleUpiPayment}
                    className="w-full bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900"
                  >
                    <Smartphone className="w-4 h-4 mr-2" />
                    Send UPI Request
                  </Button>
                </motion.div>
              )}

              {currentStep === 'processing' && (
                <motion.div
                  key="processing"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center space-y-6"
                >
                  <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    >
                      <Lock className="w-8 h-8 text-white" />
                    </motion.div>
                  </div>
                  
                  <div>
                    <h3 className="text-white font-medium mb-2">Processing your payment...</h3>
                    <p className="text-gray-400 text-sm">Please don't close this window</p>
                  </div>

                  <div className="space-y-2">
                    <Progress value={progress} className="h-2" />
                    <p className="text-purple-400 text-sm">{progress}% complete</p>
                  </div>
                </motion.div>
              )}

              {currentStep === 'success' && (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center space-y-6"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                    className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto"
                  >
                    <CheckCircle className="w-8 h-8 text-white" />
                  </motion.div>
                  
                  <div>
                    <h3 className="text-white font-medium mb-2">Payment Successful!</h3>
                    <p className="text-gray-400 text-sm">Welcome to {plan.name} plan</p>
                  </div>

                  <div className="p-4 bg-green-600/20 border border-green-500/50 rounded-lg">
                    <p className="text-green-300 text-sm">
                      Your account has been upgraded and you now have access to all {plan.name} features!
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}