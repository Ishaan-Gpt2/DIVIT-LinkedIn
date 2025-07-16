import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowRight, 
  ArrowLeft, 
  X, 
  Play, 
  CheckCircle,
  Sparkles,
  Users,
  MessageSquare,
  Link2,
  BarChart3,
  Settings
} from 'lucide-react';

interface TourStep {
  id: string;
  title: string;
  description: string;
  target: string;
  icon: React.ComponentType<any>;
  action?: () => void;
  actionText?: string;
}

const TOUR_STEPS: TourStep[] = [
  {
    id: 'welcome',
    title: 'Welcome to Chaitra!',
    description: 'Your AI-powered LinkedIn automation platform. Let\'s take a quick tour to get you started.',
    target: 'body',
    icon: Sparkles
  },
  {
    id: 'post-generator',
    title: 'AI Post Generator',
    description: 'Create engaging LinkedIn posts with AI that matches your writing style and tone.',
    target: '[href="/post-generator"]',
    icon: Sparkles,
    actionText: 'Try Demo'
  },
  {
    id: 'clone-builder',
    title: 'Clone Builder',
    description: 'Build AI clones that replicate your unique writing style and personality.',
    target: '[href="/clone-builder"]',
    icon: Users,
    actionText: 'Create Clone'
  },
  {
    id: 'auto-commenter',
    title: 'Auto Commenter',
    description: 'Automatically engage with relevant posts using intelligent, contextual comments.',
    target: '[href="/auto-commenter"]',
    icon: MessageSquare,
    actionText: 'See Demo'
  },
  {
    id: 'connect-engine',
    title: 'Connection Engine',
    description: 'Find and connect with your ideal prospects using advanced AI targeting.',
    target: '[href="/connect-engine"]',
    icon: Link2,
    actionText: 'Find Prospects'
  },
  {
    id: 'analytics',
    title: 'Analytics Dashboard',
    description: 'Track your LinkedIn performance and optimize your content strategy.',
    target: '[href="/analytics"]',
    icon: BarChart3,
    actionText: 'View Analytics'
  },
  {
    id: 'settings',
    title: 'Settings & API Keys',
    description: 'Configure your API keys and preferences. Use demo mode to test features without real API calls.',
    target: '[href="/settings"]',
    icon: Settings,
    actionText: 'Configure'
  }
];

interface OnboardingTourProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
}

export function OnboardingTour({ isOpen, onClose, onComplete }: OnboardingTourProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [targetElement, setTargetElement] = useState<HTMLElement | null>(null);

  useEffect(() => {
    if (isOpen && TOUR_STEPS[currentStep]) {
      const target = document.querySelector(TOUR_STEPS[currentStep].target) as HTMLElement;
      setTargetElement(target);
      
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'center' });
        target.style.position = 'relative';
        target.style.zIndex = '1001';
      }
    }
  }, [currentStep, isOpen]);

  const nextStep = () => {
    if (currentStep < TOUR_STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    onComplete();
    onClose();
  };

  const handleSkip = () => {
    onClose();
  };

  if (!isOpen) return null;

  const step = TOUR_STEPS[currentStep];
  const Icon = step.icon;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          onClick={handleSkip}
        />

        {/* Tour Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ duration: 0.3 }}
          className="relative z-10 max-w-md w-full mx-4"
        >
          <Card className="bg-gray-900/95 border-purple-800/30 backdrop-blur-xl shadow-2xl shadow-purple-500/20">
            <CardContent className="p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-purple-800 rounded-lg flex items-center justify-center">
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold">{step.title}</h3>
                    <Badge className="bg-purple-600/20 text-purple-400 border-purple-500/50 text-xs">
                      {currentStep + 1} of {TOUR_STEPS.length}
                    </Badge>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleSkip}
                  className="text-gray-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              {/* Content */}
              <div className="mb-6">
                <p className="text-gray-300 leading-relaxed">{step.description}</p>
              </div>

              {/* Progress */}
              <div className="mb-6">
                <div className="flex justify-between text-xs text-gray-400 mb-2">
                  <span>Progress</span>
                  <span>{Math.round(((currentStep + 1) / TOUR_STEPS.length) * 100)}%</span>
                </div>
                <div className="w-full bg-gray-800 rounded-full h-2">
                  <motion.div
                    className="bg-gradient-to-r from-purple-600 to-purple-800 h-2 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${((currentStep + 1) / TOUR_STEPS.length) * 100}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between">
                <div className="flex space-x-2">
                  {currentStep > 0 && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={prevStep}
                      className="border-gray-700 text-gray-300 hover:bg-gray-800"
                    >
                      <ArrowLeft className="w-4 h-4 mr-1" />
                      Back
                    </Button>
                  )}
                  
                  {step.actionText && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={step.action}
                      className="border-purple-700/50 text-purple-400 hover:bg-purple-900/20"
                    >
                      <Play className="w-4 h-4 mr-1" />
                      {step.actionText}
                    </Button>
                  )}
                </div>

                <div className="flex space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleSkip}
                    className="text-gray-400 hover:text-white"
                  >
                    Skip Tour
                  </Button>
                  
                  <Button
                    onClick={nextStep}
                    size="sm"
                    className="bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900"
                  >
                    {currentStep === TOUR_STEPS.length - 1 ? (
                      <>
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Complete
                      </>
                    ) : (
                      <>
                        Next
                        <ArrowRight className="w-4 h-4 ml-1" />
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

export default OnboardingTour;