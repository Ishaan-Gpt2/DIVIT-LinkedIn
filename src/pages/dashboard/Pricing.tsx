import React from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuthStore } from '@/store/authStore';
import { toast } from 'sonner';
import {
  Check,
  Crown,
  Zap,
  Star,
  ArrowRight,
  CreditCard
} from 'lucide-react';

const plans = [
  {
    id: 'free',
    name: 'Free',
    price: '$0',
    period: 'forever',
    credits: '5 credits/month',
    features: [
      'Basic post generation',
      'Limited connections (10/month)',
      'Basic analytics',
      'Email support'
    ],
    popular: false,
    current: false
  },
  {
    id: 'creator',
    name: 'Creator',
    price: '$29',
    period: 'month',
    credits: '100 credits/month',
    features: [
      'Advanced AI posts',
      'Unlimited connections',
      'Clone builder',
      'Auto commenter',
      'Full analytics',
      'Priority support'
    ],
    popular: true,
    current: false
  },
  {
    id: 'ghostwriter',
    name: 'Ghostwriter',
    price: '$79',
    period: 'month',
    credits: 'Unlimited credits',
    features: [
      'Everything in Creator',
      'Advanced humanizer',
      'Custom clones',
      'White-label options',
      'API access',
      'Dedicated support'
    ],
    popular: false,
    current: false
  },
  {
    id: 'agency',
    name: 'Agency',
    price: '$199',
    period: 'month',
    credits: 'Unlimited credits',
    features: [
      'Everything in Ghostwriter',
      'Multi-account management',
      'Team collaboration',
      'Advanced reporting',
      'Custom integrations',
      'Account manager'
    ],
    popular: false,
    current: false
  }
];

export default function Pricing() {
  const { user, upgradePlan } = useAuthStore();

  const handleUpgrade = (planId: string) => {
    if (planId === 'free') {
      toast.info('You are already on the free plan');
      return;
    }

    // Simulate payment process
    toast.success(`Upgraded to ${planId} plan! (Demo)`);
    upgradePlan(planId as any);
  };

  const getCurrentPlan = () => {
    return plans.map(plan => ({
      ...plan,
      current: plan.id === user?.plan
    }));
  };

  const currentPlans = getCurrentPlan();

  return (
    <DashboardLayout>
      <div className="p-6 max-w-7xl">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white mb-2">Pricing Plans</h1>
          <p className="text-gray-400">
            Choose the perfect plan for your LinkedIn automation needs
          </p>
        </div>

        {/* Current Plan Status */}
        <Card className="bg-gray-900/50 border-gray-800 mb-8">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Crown className="w-5 h-5 mr-2 text-purple-400" />
              Current Plan
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold text-white capitalize">
                  {user?.plan} Plan
                </h3>
                <p className="text-gray-400">
                  {user?.plan === 'free' ? `${user?.credits} credits remaining` : 'Unlimited credits'}
                </p>
              </div>
              <Badge className={`${
                user?.plan === 'free' ? 'bg-gray-600' : 
                user?.plan === 'creator' ? 'bg-blue-600' :
                user?.plan === 'ghostwriter' ? 'bg-purple-600' : 'bg-yellow-600'
              } text-white`}>
                <Zap className="w-3 h-3 mr-1" />
                {user?.plan?.toUpperCase()}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {currentPlans.map((plan) => (
            <Card 
              key={plan.id} 
              className={`relative bg-gray-900/50 border-gray-800 ${
                plan.popular ? 'border-purple-500 ring-1 ring-purple-500' : ''
              } ${plan.current ? 'ring-2 ring-green-500' : ''}`}
            >
              {plan.popular && (
                <Badge className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-purple-600">
                  Most Popular
                </Badge>
              )}
              {plan.current && (
                <Badge className="absolute -top-2 right-4 bg-green-600">
                  Current Plan
                </Badge>
              )}
              
              <CardHeader>
                <CardTitle className="text-white">{plan.name}</CardTitle>
                <div className="flex items-baseline">
                  <span className="text-3xl font-bold text-white">{plan.price}</span>
                  <span className="text-gray-400 ml-1">/{plan.period}</span>
                </div>
                <CardDescription className="text-purple-400 font-medium">
                  {plan.credits}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <ul className="space-y-2">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center space-x-2">
                      <Check className="w-4 h-4 text-green-400 flex-shrink-0" />
                      <span className="text-gray-300 text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <Button 
                  onClick={() => handleUpgrade(plan.id)}
                  disabled={plan.current}
                  className={`w-full ${
                    plan.current 
                      ? 'bg-gray-700 cursor-not-allowed' 
                      : plan.popular 
                        ? 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700' 
                        : 'bg-gray-800 hover:bg-gray-700'
                  }`}
                >
                  {plan.current ? (
                    'Current Plan'
                  ) : (
                    <>
                      {plan.id === 'free' ? 'Downgrade' : 'Upgrade'}
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Features Comparison */}
        <Card className="bg-gray-900/50 border-gray-800 mb-8">
          <CardHeader>
            <CardTitle className="text-white">Feature Comparison</CardTitle>
            <CardDescription className="text-gray-400">
              Compare all features across different plans
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="text-left py-3 text-gray-300">Feature</th>
                    <th className="text-center py-3 text-gray-300">Free</th>
                    <th className="text-center py-3 text-gray-300">Creator</th>
                    <th className="text-center py-3 text-gray-300">Ghostwriter</th>
                    <th className="text-center py-3 text-gray-300">Agency</th>
                  </tr>
                </thead>
                <tbody className="text-gray-400">
                  <tr className="border-b border-gray-800">
                    <td className="py-3">Monthly Credits</td>
                    <td className="text-center py-3">5</td>
                    <td className="text-center py-3">100</td>
                    <td className="text-center py-3">Unlimited</td>
                    <td className="text-center py-3">Unlimited</td>
                  </tr>
                  <tr className="border-b border-gray-800">
                    <td className="py-3">AI Post Generation</td>
                    <td className="text-center py-3"><Check className="w-4 h-4 text-green-400 mx-auto" /></td>
                    <td className="text-center py-3"><Check className="w-4 h-4 text-green-400 mx-auto" /></td>
                    <td className="text-center py-3"><Check className="w-4 h-4 text-green-400 mx-auto" /></td>
                    <td className="text-center py-3"><Check className="w-4 h-4 text-green-400 mx-auto" /></td>
                  </tr>
                  <tr className="border-b border-gray-800">
                    <td className="py-3">Clone Builder</td>
                    <td className="text-center py-3">-</td>
                    <td className="text-center py-3"><Check className="w-4 h-4 text-green-400 mx-auto" /></td>
                    <td className="text-center py-3"><Check className="w-4 h-4 text-green-400 mx-auto" /></td>
                    <td className="text-center py-3"><Check className="w-4 h-4 text-green-400 mx-auto" /></td>
                  </tr>
                  <tr className="border-b border-gray-800">
                    <td className="py-3">Auto Commenter</td>
                    <td className="text-center py-3">-</td>
                    <td className="text-center py-3"><Check className="w-4 h-4 text-green-400 mx-auto" /></td>
                    <td className="text-center py-3"><Check className="w-4 h-4 text-green-400 mx-auto" /></td>
                    <td className="text-center py-3"><Check className="w-4 h-4 text-green-400 mx-auto" /></td>
                  </tr>
                  <tr className="border-b border-gray-800">
                    <td className="py-3">Advanced Analytics</td>
                    <td className="text-center py-3">Basic</td>
                    <td className="text-center py-3"><Check className="w-4 h-4 text-green-400 mx-auto" /></td>
                    <td className="text-center py-3"><Check className="w-4 h-4 text-green-400 mx-auto" /></td>
                    <td className="text-center py-3"><Check className="w-4 h-4 text-green-400 mx-auto" /></td>
                  </tr>
                  <tr className="border-b border-gray-800">
                    <td className="py-3">API Access</td>
                    <td className="text-center py-3">-</td>
                    <td className="text-center py-3">-</td>
                    <td className="text-center py-3"><Check className="w-4 h-4 text-green-400 mx-auto" /></td>
                    <td className="text-center py-3"><Check className="w-4 h-4 text-green-400 mx-auto" /></td>
                  </tr>
                  <tr>
                    <td className="py-3">Team Management</td>
                    <td className="text-center py-3">-</td>
                    <td className="text-center py-3">-</td>
                    <td className="text-center py-3">-</td>
                    <td className="text-center py-3"><Check className="w-4 h-4 text-green-400 mx-auto" /></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* FAQ Section */}
        <Card className="bg-gray-900/50 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white">Frequently Asked Questions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h4 className="text-white font-medium mb-2">What are credits?</h4>
              <p className="text-gray-400 text-sm">
                Credits are used for AI-powered actions like generating posts, creating comments, and finding connections. Each action typically costs 1 credit.
              </p>
            </div>
            
            <div>
              <h4 className="text-white font-medium mb-2">Can I change plans anytime?</h4>
              <p className="text-gray-400 text-sm">
                Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately, and we'll prorate any billing differences.
              </p>
            </div>
            
            <div>
              <h4 className="text-white font-medium mb-2">Is there a free trial?</h4>
              <p className="text-gray-400 text-sm">
                Yes! All new users start with our Free plan which includes 5 credits per month. You can upgrade anytime to unlock more features.
              </p>
            </div>
            
            <div>
              <h4 className="text-white font-medium mb-2">What happens to unused credits?</h4>
              <p className="text-gray-400 text-sm">
                Unused credits roll over to the next month for paid plans. Free plan credits reset monthly and don't roll over.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}