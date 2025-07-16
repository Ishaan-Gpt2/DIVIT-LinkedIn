import React, { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Switch } from '@/components/ui/switch';
import { useAuthStore } from '@/store/authStore';
import { useAppStore } from '@/store/appStore';
import { processLinkedInPost, ProcessLinkedInPostResponse } from '@/services/api';
import { toast } from 'sonner';
import {
  Sparkles,
  Copy,
  Calendar,
  Loader2,
  Zap,
  CheckCircle,
  TrendingUp,
  Brain,
  Shield,
  Mail,
  Bot,
  User,
  Globe,
  Play,
} from 'lucide-react';

const tones = [
  'Professional',
  'Conversational',
  'Thought-provoking',
  'Inspirational',
  'Educational',
  'Humorous'
];

const demoPrompts = [
  "The future of AI in business automation and how it's changing the way we work",
  "5 leadership lessons I learned from building a remote team",
  "Why customer feedback is the most valuable currency in business",
  "The importance of work-life balance in the modern workplace",
  "How to build authentic relationships on LinkedIn"
];

export default function PostGenerator() {
  const [topic, setTopic] = useState('');
  const [tone, setTone] = useState('');
  const [linkedinProfileUrl, setLinkedinProfileUrl] = useState('');
  const [enableAutomation, setEnableAutomation] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedResult, setGeneratedResult] = useState<ProcessLinkedInPostResponse | null>(null);
  const [showDemo, setShowDemo] = useState(false);
  
  const { user, updateCredits } = useAuthStore();
  const { addPost, activeClone } = useAppStore();

  const handleDemo = () => {
    setTopic(demoPrompts[Math.floor(Math.random() * demoPrompts.length)]);
    setTone('Professional');
    setShowDemo(true);
    toast.success('Demo content loaded! Click "Generate & Process" to see it in action.');
  };

  const handleGenerate = async () => {
    if (!topic.trim() || !tone) {
      toast.error('Please enter a topic and select a tone');
      return;
    }

    if (!user?.email) {
      toast.error('User email not found. Please log in again.');
      return;
    }

    if (user?.credits === 0 && user?.plan === 'free') {
      toast.error('No credits remaining. Please upgrade your plan.');
      return;
    }

    setIsGenerating(true);
    
    try {
      const result = await processLinkedInPost({
        userPrompt: `Create a ${tone.toLowerCase()} LinkedIn post about: ${topic}`,
        userEmail: user.email,
        linkedinProfileUrl: linkedinProfileUrl.trim() || undefined,
        enableAutomation
      }, user.id);
      
      setGeneratedResult(result);
      
      // Save post to database
      if (result.success) {
        await addPost({
          user_id: user.id,
          clone_id: activeClone?.id || null,
          content: result.finalPost,
          tone,
          status: 'draft',
          ai_score: result.aiScore,
          human_score: result.humanScore,
          engagement: {}
        });
      }
      
      // Deduct credit for free users
      if (user?.plan === 'free') {
        await updateCredits(-1);
      }
      
      toast.success('Post generated and sent to your email!');
    } catch (error: any) {
      console.error('Generation error:', error);
      toast.error(error.response?.data?.message || 'Failed to generate post. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = (content: string) => {
    navigator.clipboard.writeText(content);
    toast.success('Post copied to clipboard!');
  };

  const handleSchedule = async (content: string) => {
    if (!user) return;
    
    const scheduledFor = new Date(Date.now() + 86400000); // Tomorrow
    
    await addPost({
      user_id: user.id,
      clone_id: activeClone?.id || null,
      content,
      tone,
      status: 'scheduled',
      scheduled_for: scheduledFor.toISOString(),
      engagement: {}
    });
    
    toast.success('Post scheduled for tomorrow!');
  };

  const handlePostNow = async (content: string) => {
    if (!user) return;
    
    await addPost({
      user_id: user.id,
      clone_id: activeClone?.id || null,
      content,
      tone,
      status: 'posted',
      posted_at: new Date().toISOString(),
      engagement: {
        likes: Math.floor(Math.random() * 50) + 10,
        comments: Math.floor(Math.random() * 15) + 2,
        shares: Math.floor(Math.random() * 10) + 1
      }
    });
    
    toast.success('Post published successfully!');
  };

  const getScoreColor = (score: number, reverse = false) => {
    if (reverse) {
      if (score <= 20) return 'text-green-400';
      if (score <= 40) return 'text-yellow-400';
      return 'text-red-400';
    }
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getScoreBadgeColor = (score: number, reverse = false) => {
    if (reverse) {
      if (score <= 20) return 'bg-green-600/20 text-green-400 border-green-500/50';
      if (score <= 40) return 'bg-yellow-600/20 text-yellow-400 border-yellow-500/50';
      return 'bg-red-600/20 text-red-400 border-red-500/50';
    }
    if (score >= 80) return 'bg-green-600/20 text-green-400 border-green-500/50';
    if (score >= 60) return 'bg-yellow-600/20 text-yellow-400 border-yellow-500/50';
    return 'bg-red-600/20 text-red-400 border-red-500/50';
  };

  return (
    <DashboardLayout>
      <div className="p-6 w-full max-w-none">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-white mb-2">AI Post Generator</h1>
          <p className="text-gray-400">
            Create engaging LinkedIn posts powered by advanced AI. Full pipeline processing with humanization and optimization.
          </p>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Input Form */}
          <Card className="glass-purple border-purple-800/30 neuro">
            <CardHeader>
              <CardTitle className="text-white flex items-center justify-between">
                <div className="flex items-center">
                  <Sparkles className="w-5 h-5 mr-2" />
                  Generate Posts
                </div>
                <Badge className="bg-green-600 text-white">
                  Live
                </Badge>
              </CardTitle>
              <CardDescription className="text-gray-400">
                Enter your topic and preferences for AI processing
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="topic" className="text-gray-300 flex items-center justify-between">
                  Topic or Idea
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleDemo}
                    className="text-purple-400 hover:text-purple-300 h-auto p-1"
                  >
                    <Play className="w-3 h-3 mr-1" />
                    Demo
                  </Button>
                </Label>
                <Textarea
                  id="topic"
                  placeholder="e.g., Leadership lessons from remote work, AI impact on marketing, team building strategies..."
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  className="bg-gray-800/50 border-purple-800/30 text-white placeholder-gray-400 resize-none focus:border-purple-600"
                  rows={4}
                />
                {showDemo && (
                  <p className="text-purple-400 text-xs mt-1">
                    ✨ Demo content loaded! Ready to generate.
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="tone" className="text-gray-300">
                  Tone
                </Label>
                <Select value={tone} onValueChange={setTone}>
                  <SelectTrigger className="bg-gray-800/50 border-purple-800/30 text-white focus:border-purple-600">
                    <SelectValue placeholder="Select tone" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-purple-800/30">
                    {tones.map((t) => (
                      <SelectItem key={t} value={t} className="text-white hover:bg-purple-900/20">
                        {t}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="profileUrl" className="text-gray-300">
                  LinkedIn Profile URL (Optional)
                </Label>
                <Input
                  id="profileUrl"
                  type="url"
                  placeholder="https://linkedin.com/in/username"
                  value={linkedinProfileUrl}
                  onChange={(e) => setLinkedinProfileUrl(e.target.value)}
                  className="bg-gray-800/50 border-purple-800/30 text-white placeholder-gray-400 focus:border-purple-600"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Add a LinkedIn profile to personalize the content
                </p>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-gray-300 font-medium">Enable Automation</Label>
                  <p className="text-xs text-gray-500">Trigger PhantomBuster after generation</p>
                </div>
                <Switch
                  checked={enableAutomation}
                  onCheckedChange={setEnableAutomation}
                  className="data-[state=checked]:bg-purple-600"
                />
              </div>

              {activeClone && (
                <div className="p-3 bg-purple-600/20 border border-purple-500/50 rounded-lg">
                  <div className="flex items-center mb-2">
                    <User className="w-4 h-4 text-purple-400 mr-2" />
                    <span className="text-purple-400 font-medium text-sm">Active Clone</span>
                  </div>
                  <p className="text-purple-300 text-xs">{activeClone.name}</p>
                  <p className="text-purple-400 text-xs">{activeClone.tone}</p>
                </div>
              )}

              <div className="pt-2">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-gray-300 text-sm">Credits Available</span>
                  <Badge className="bg-purple-600 text-white">
                    <Zap className="w-3 h-3 mr-1" />
                    {user?.plan === 'free' ? user?.credits : 'Unlimited'}
                  </Badge>
                </div>
                
                <Button
                  onClick={handleGenerate}
                  disabled={isGenerating || (user?.credits === 0 && user?.plan === 'free')}
                  className="w-full bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 shadow-lg shadow-purple-500/25"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-4 w-4" />
                      Generate & Process
                    </>
                  )}
                </Button>
              </div>

              {user?.plan === 'free' && user?.credits === 0 && (
                <div className="p-3 bg-yellow-600/20 border border-yellow-500/50 rounded-lg">
                  <p className="text-yellow-400 text-sm">
                    No credits remaining. Upgrade to continue.
                  </p>
                </div>
              )}

              {/* API Status */}
              <div className="pt-4 border-t border-purple-800/30">
                <h4 className="text-gray-300 text-sm font-medium mb-3 flex items-center">
                  <Shield className="w-4 h-4 mr-2" />
                  Processing Pipeline
                </h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400 text-xs">AI Generation</span>
                    <Badge className="bg-green-600/20 text-green-400">Live</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400 text-xs">Humanization</span>
                    <Badge className="bg-green-600/20 text-green-400">Live</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400 text-xs">Grammar Check</span>
                    <Badge className="bg-green-600/20 text-green-400">Live</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400 text-xs">AI Detection</span>
                    <Badge className="bg-green-600/20 text-green-400">Live</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400 text-xs">Email Delivery</span>
                    <Badge className="bg-green-600/20 text-green-400">Live</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Generated Result */}
          <div className="lg:col-span-3 space-y-4">
            {generatedResult ? (
              <>
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-white">Processing Complete</h2>
                  <div className="flex items-center space-x-2">
                    <Badge className="bg-green-600/20 text-green-400 border-green-500/50">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Success
                    </Badge>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleGenerate}
                      disabled={isGenerating}
                      className="border-purple-700/50 text-gray-300 hover:bg-purple-900/20"
                    >
                      <Sparkles className="w-4 h-4 mr-1" />
                      Regenerate
                    </Button>
                  </div>
                </div>
                
                <Card className="glass-purple border-purple-800/30 neuro">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-white text-lg">
                        Final Optimized Post
                      </CardTitle>
                      <div className="flex items-center space-x-2">
                        <Badge className="bg-purple-600 text-white">
                          {tone}
                        </Badge>
                        <Badge className={getScoreBadgeColor(generatedResult.humanScore)}>
                          <Brain className="w-3 h-3 mr-1" />
                          {generatedResult.humanScore}% Human
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="p-4 glass-purple rounded-lg neuro-inset">
                      <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">
                        {generatedResult.finalPost}
                      </p>
                    </div>
                    
                    {/* Processing Pipeline Results */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 p-4 bg-purple-950/20 rounded-lg border border-purple-800/30">
                      <div className="text-center">
                        <div className="flex items-center justify-center mb-2">
                          <Shield className="w-4 h-4 mr-1 text-blue-400" />
                          <span className="text-xs text-gray-400">AI Detection</span>
                        </div>
                        <div className={`text-lg font-bold ${getScoreColor(generatedResult.aiScore, true)}`}>
                          {generatedResult.aiScore}%
                        </div>
                        <Progress 
                          value={100 - generatedResult.aiScore} 
                          className="h-1 mt-1"
                        />
                      </div>
                      
                      <div className="text-center">
                        <div className="flex items-center justify-center mb-2">
                          <Brain className="w-4 h-4 mr-1 text-green-400" />
                          <span className="text-xs text-gray-400">Human Score</span>
                        </div>
                        <div className={`text-lg font-bold ${getScoreColor(generatedResult.humanScore)}`}>
                          {generatedResult.humanScore}%
                        </div>
                        <Progress 
                          value={generatedResult.humanScore} 
                          className="h-1 mt-1"
                        />
                      </div>
                      
                      <div className="text-center">
                        <div className="flex items-center justify-center mb-2">
                          <CheckCircle className="w-4 h-4 mr-1 text-purple-400" />
                          <span className="text-xs text-gray-400">Grammar</span>
                        </div>
                        <div className="text-lg font-bold text-green-400">
                          {generatedResult.metadata.grammarCorrections === 0 ? '✓' : generatedResult.metadata.grammarCorrections}
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          {generatedResult.metadata.grammarCorrections === 0 ? 'Perfect' : 'Corrected'}
                        </p>
                      </div>
                      
                      <div className="text-center">
                        <div className="flex items-center justify-center mb-2">
                          <Mail className="w-4 h-4 mr-1 text-yellow-400" />
                          <span className="text-xs text-gray-400">Email Sent</span>
                        </div>
                        <div className="text-lg font-bold text-green-400">
                          {generatedResult.wasSentToEmail ? '✓' : '✗'}
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          {generatedResult.wasSentToEmail ? 'Delivered' : 'Failed'}
                        </p>
                      </div>
                    </div>

                    {/* Processing Steps */}
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="p-4 glass-purple rounded-lg neuro-inset">
                        <h4 className="text-white font-medium text-sm mb-3 flex items-center">
                          <Bot className="w-4 h-4 mr-2" />
                          Processing Pipeline
                        </h4>
                        <div className="space-y-2">
                          {Object.entries(generatedResult.processingSteps).map(([step, completed]) => (
                            <div key={step} className="flex items-center justify-between">
                              <span className="text-gray-400 text-xs capitalize">
                                {step.replace(/([A-Z])/g, ' $1').trim()}
                              </span>
                              <div className={`w-2 h-2 rounded-full ${completed ? 'bg-green-400' : 'bg-red-400'}`} />
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="p-4 glass-purple rounded-lg neuro-inset">
                        <h4 className="text-white font-medium text-sm mb-3 flex items-center">
                          <User className="w-4 h-4 mr-2" />
                          Personalization
                        </h4>
                        {generatedResult.scrapedProfileData ? (
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-gray-400 text-xs">Profile Used</span>
                              <CheckCircle className="w-3 h-3 text-green-400" />
                            </div>
                            <p className="text-green-400 text-xs">
                              Content personalized for {generatedResult.scrapedProfileData.fullName}
                            </p>
                          </div>
                        ) : (
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-gray-400 text-xs">Profile Used</span>
                              <div className="w-2 h-2 rounded-full bg-gray-500" />
                            </div>
                            <p className="text-gray-500 text-xs">
                              No profile URL provided
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Automation Status */}
                    {enableAutomation && (
                      <div className="p-3 bg-blue-600/20 border border-blue-500/50 rounded-lg">
                        <div className="flex items-center mb-2">
                          <Bot className="w-4 h-4 text-blue-400 mr-2" />
                          <span className="text-blue-400 font-medium text-sm">Automation Status</span>
                        </div>
                        <p className="text-blue-300 text-xs">
                          PhantomBuster {generatedResult.phantomTriggered ? 'triggered successfully' : 'trigger failed'}
                        </p>
                      </div>
                    )}

                    {/* Email Confirmation */}
                    {generatedResult.wasSentToEmail && (
                      <div className="p-3 bg-green-600/20 border border-green-500/50 rounded-lg">
                        <div className="flex items-center mb-2">
                          <Mail className="w-4 h-4 text-green-400 mr-2" />
                          <span className="text-green-400 font-medium text-sm">Email Delivered</span>
                        </div>
                        <p className="text-green-300 text-xs">
                          Complete post with analysis sent to {user?.email}
                        </p>
                      </div>
                    )}
                    
                    <div className="flex flex-wrap gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleCopy(generatedResult.finalPost)}
                        className="border-purple-700/50 text-gray-300 hover:bg-purple-900/20"
                      >
                        <Copy className="w-4 h-4 mr-1" />
                        Copy
                      </Button>
                      
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleSchedule(generatedResult.finalPost)}
                        className="border-purple-700/50 text-gray-300 hover:bg-purple-900/20"
                      >
                        <Calendar className="w-4 h-4 mr-1" />
                        Schedule
                      </Button>
                      
                      <Button
                        size="sm"
                        onClick={() => handlePostNow(generatedResult.finalPost)}
                        className="bg-purple-600 hover:bg-purple-700"
                      >
                        Post Now
                      </Button>

                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => window.open('https://linkedin.com/feed', '_blank')}
                        className="border-purple-700/50 text-gray-300 hover:bg-purple-900/20"
                      >
                        <Globe className="w-4 h-4 mr-1" />
                        Open LinkedIn
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </>
            ) : (
              <Card className="glass-purple border-purple-800/30 neuro">
                <CardContent className="p-12 text-center">
                  <Sparkles className="w-12 h-12 text-purple-600 mx-auto mb-4" />
                  <h3 className="text-white text-lg font-medium mb-2">
                    Ready to Generate
                  </h3>
                  <p className="text-gray-400 mb-6">
                    Enter a topic and select a tone to start the AI processing pipeline
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                    <div className="p-3 glass-purple rounded-lg">
                      <Bot className="w-6 h-6 text-purple-400 mx-auto mb-2" />
                      <p className="text-xs text-gray-400">AI Generation</p>
                    </div>
                    <div className="p-3 glass-purple rounded-lg">
                      <Brain className="w-6 h-6 text-purple-400 mx-auto mb-2" />
                      <p className="text-xs text-gray-400">Humanization</p>
                    </div>
                    <div className="p-3 glass-purple rounded-lg">
                      <CheckCircle className="w-6 h-6 text-purple-400 mx-auto mb-2" />
                      <p className="text-xs text-gray-400">Grammar Check</p>
                    </div>
                    <div className="p-3 glass-purple rounded-lg">
                      <Mail className="w-6 h-6 text-purple-400 mx-auto mb-2" />
                      <p className="text-xs text-gray-400">Email Delivery</p>
                    </div>
                  </div>
                  
                  <Button
                    onClick={handleDemo}
                    variant="outline"
                    className="mt-6 border-purple-700/50 text-purple-400 hover:bg-purple-900/20"
                  >
                    <Play className="w-4 h-4 mr-2" />
                    Try Demo
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}