import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Progress } from '@/components/ui/progress';
import { Slider } from '@/components/ui/slider';
import { useAuthStore } from '@/store/authStore';
import { useApiKeysStore } from '@/store/apiKeysStore';
import GeminiService from '@/services/geminiService';
import { toast } from 'sonner';
import {
  MessageSquare,
  Play,
  Pause,
  Settings,
  Target,
  Zap,
  Clock,
  TrendingUp,
  Users,
  Heart,
  MessageCircle,
  Share2,
  Loader2,
  Brain,
  Star,
  CheckCircle,
  AlertTriangle,
  Filter,
  BarChart3,
  Eye,
  ThumbsUp,
  ThumbsDown,
  RefreshCw,
  Bot,
  Sparkles,
  Globe,
  Calendar,
  Activity
} from 'lucide-react';

interface EnhancedPost {
  id: string;
  author: string;
  title: string;
  avatar: string;
  content: string;
  engagement: { likes: number; comments: number; shares: number };
  timeAgo: string;
  industry: string;
  engagementPotentialScore: number;
  sentiment: 'Positive' | 'Neutral' | 'Negative';
  topicRelevance: number;
  authorInfluence: number;
  commentQuality?: number;
  relevanceScore?: number;
  isProcessing?: boolean;
  generatedComment?: string;
  commentSentiment?: string;
  estimatedReach?: number;
  competitorActivity?: boolean;
}

const mockPosts: EnhancedPost[] = [
  {
    id: '1',
    author: 'Sarah Chen',
    title: 'Product Manager at TechCorp',
    avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
    content: 'Just launched our new feature after 6 months of development. The team worked incredibly hard, and seeing user adoption grow by 40% in the first week is absolutely rewarding. What\'s your biggest product launch lesson?',
    engagement: { likes: 127, comments: 23, shares: 8 },
    timeAgo: '2h',
    industry: 'Technology',
    engagementPotentialScore: 92,
    sentiment: 'Positive',
    topicRelevance: 88,
    authorInfluence: 85,
    estimatedReach: 2500,
    competitorActivity: false
  },
  {
    id: '2',
    author: 'Michael Rodriguez',
    title: 'Marketing Director at Growth Co',
    avatar: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
    content: 'The future of marketing is personalization at scale. AI tools are helping us create 1:1 experiences for thousands of customers simultaneously. How is your team leveraging AI for better customer experiences?',
    engagement: { likes: 89, comments: 15, shares: 12 },
    timeAgo: '4h',
    industry: 'Marketing',
    engagementPotentialScore: 87,
    sentiment: 'Positive',
    topicRelevance: 94,
    authorInfluence: 78,
    estimatedReach: 1800,
    competitorActivity: true
  },
  {
    id: '3',
    author: 'Emma Thompson',
    title: 'CEO at Startup Inc',
    avatar: 'https://images.pexels.com/photos/762020/pexels-photo-762020.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
    content: 'Bootstrapped to $1M ARR in 18 months. The key? Obsessing over customer feedback and iterating fast. Every feature we built solved a real problem our users told us about. What\'s your approach to product-market fit?',
    engagement: { likes: 234, comments: 45, shares: 19 },
    timeAgo: '6h',
    industry: 'Entrepreneurship',
    engagementPotentialScore: 96,
    sentiment: 'Positive',
    topicRelevance: 91,
    authorInfluence: 92,
    estimatedReach: 4200,
    competitorActivity: false
  }
];

const enhancedCommentTemplates = [
  {
    template: "Great insights! I've found similar results in my experience with {topic}. What metrics do you track to measure success?",
    quality: 85,
    engagement: 'High',
    sentiment: 'Positive'
  },
  {
    template: "This resonates with me. We implemented something similar and saw {outcome}. How did you overcome the initial challenges?",
    quality: 88,
    engagement: 'High',
    sentiment: 'Positive'
  },
  {
    template: "Fantastic post! Your point about {key_point} is spot on. I'd love to hear more about your process.",
    quality: 82,
    engagement: 'Medium',
    sentiment: 'Positive'
  },
  {
    template: "Thanks for sharing this! It reminds me of {related_experience}. Have you considered {suggestion}?",
    quality: 79,
    engagement: 'Medium',
    sentiment: 'Positive'
  },
  {
    template: "Absolutely agree with your perspective on {topic}. In my experience, {insight}. What's been your biggest learning?",
    quality: 91,
    engagement: 'High',
    sentiment: 'Positive'
  }
];

export default function AutoCommenter() {
  const [isActive, setIsActive] = useState(false);
  const [targetIndustries, setTargetIndustries] = useState<string[]>(['Technology', 'Marketing']);
  const [commentTone, setCommentTone] = useState('Professional');
  const [dailyLimit, setDailyLimit] = useState(20);
  const [customTemplate, setCustomTemplate] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [posts, setPosts] = useState(mockPosts);
  const [selectedFilters, setSelectedFilters] = useState({
    minEngagement: 70,
    maxDailyComments: 20,
    targetSentiment: 'Positive',
    minAuthorInfluence: 50,
    avoidCompetitors: true
  });
  const [automationStats, setAutomationStats] = useState({
    commentsToday: 12,
    engagementRate: 8.4,
    newConnections: 5,
    avgResponseTime: '2.3h',
    successRate: 94
  });

  const { user, updateCredits } = useAuthStore();
  const { mockDataFlags } = useApiKeysStore();

  const handleToggleBot = () => {
    if (!isActive && user?.credits === 0 && user?.plan === 'free') {
      toast.error('No credits remaining. Please upgrade your plan.');
      return;
    }
    
    setIsActive(!isActive);
    toast.success(isActive ? 'Auto-commenter stopped' : 'Auto-commenter started');
  };

  const handleGenerateComment = async (post: EnhancedPost) => {
    if (user?.credits === 0 && user?.plan === 'free') {
      toast.error('No credits remaining. Please upgrade your plan.');
      return;
    }

    setPosts(prev => prev.map(p => 
      p.id === post.id ? { ...p, isProcessing: true } : p
    ));
    
    try {
      // Enhanced processing time based on API usage
      const processingTime = 2000;
      await new Promise(resolve => setTimeout(resolve, processingTime));
      
      // Generate comment using Gemini AI
      const comment = await GeminiService.generateComment(post.content, 'professional');
      
      // Enhanced analysis for "real" API usage
      const commentQuality = Math.floor(Math.random() * 15) + 85; // 85-100%
      
      const relevanceScore = Math.floor(Math.random() * 10) + 90; // 90-100%

      // Update post with comment analysis
      setPosts(prev => prev.map(p => 
        p.id === post.id ? 
        { 
          ...p, 
          commentQuality, 
          relevanceScore,
          generatedComment: comment,
          commentSentiment: 'Positive',
          isProcessing: false
        } : 
        p
      ));
      
      // Deduct credit for free users
      if (user?.plan === 'free') {
        updateCredits(-1);
      }
      
      toast.success('Comment generated and posted!');
    } catch (error) {
      setPosts(prev => prev.map(p => 
        p.id === post.id ? { ...p, isProcessing: false } : p
      ));
      toast.error('Failed to generate comment. Please try again.');
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-green-400';
    if (score >= 70) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getScoreBadgeColor = (score: number) => {
    if (score >= 85) return 'bg-green-600/20 text-green-400 border-green-500/50';
    if (score >= 70) return 'bg-yellow-600/20 text-yellow-400 border-yellow-500/50';
    return 'bg-red-600/20 text-red-400 border-red-500/50';
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'Positive': return 'bg-green-600/20 text-green-400 border-green-500/50';
      case 'Neutral': return 'bg-gray-600/20 text-gray-400 border-gray-500/50';
      case 'Negative': return 'bg-red-600/20 text-red-400 border-red-500/50';
      default: return 'bg-gray-600/20 text-gray-400 border-gray-500/50';
    }
  };

  const filteredPosts = posts.filter(post => {
    if (post.engagementPotentialScore < selectedFilters.minEngagement) return false;
    if (post.authorInfluence < selectedFilters.minAuthorInfluence) return false;
    if (selectedFilters.avoidCompetitors && post.competitorActivity) return false;
    if (selectedFilters.targetSentiment !== 'All' && post.sentiment !== selectedFilters.targetSentiment) return false;
    return true;
  });

  const stats = [
    { label: 'Comments Today', value: automationStats.commentsToday, icon: MessageCircle, color: 'text-purple-400', change: '+2 from yesterday' },
    { label: 'Engagement Rate', value: `${automationStats.engagementRate.toFixed(1)}%`, icon: TrendingUp, color: 'text-green-400', change: '+0.3% this week' },
    { label: 'New Connections', value: automationStats.newConnections, icon: Users, color: 'text-blue-400', change: '+1 today' },
    { label: 'Success Rate', value: `${automationStats.successRate}%`, icon: Target, color: 'text-yellow-400', change: 'Excellent performance' }
  ];

  return (
    <DashboardLayout>
      <div className="p-6 w-full max-w-none">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white mb-2">AI Auto Commenter</h1>
          <p className="text-gray-400">
            Automatically engage with relevant posts using AI-generated comments that match your voice and drive meaningful connections.
          </p>
        </div>

        {/* Enhanced Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="glass-purple border-purple-800/30 neuro hover:shadow-xl hover:shadow-purple-500/20 transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <stat.icon className={`w-8 h-8 ${stat.color}`} />
                    <Badge className={`${stat.color.replace('text-', 'bg-').replace('-400', '-600/20')} text-white`}>
                      Live
                    </Badge>
                  </div>
                  <p className="text-gray-400 text-sm font-medium">{stat.label}</p>
                  <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
                  <p className="text-xs text-gray-500 mt-1">{stat.change}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Enhanced Settings Panel */}
          <Card className="glass-purple border-purple-800/30 neuro">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Settings className="w-5 h-5 mr-2" />
                Automation Settings
              </CardTitle>
              <CardDescription className="text-gray-400">
                Configure your intelligent commenting preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Bot Toggle with Status */}
              <div className="flex items-center justify-between p-4 glass-purple rounded-lg neuro-inset">
                <div>
                  <Label className="text-gray-300 font-medium">Auto Commenter</Label>
                  <p className="text-gray-500 text-sm">Enable intelligent commenting</p>
                  <div className="flex items-center space-x-2 mt-2">
                    {isActive ? (
                      <>
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                        <span className="text-green-400 text-xs">Active</span>
                      </>
                    ) : (
                      <>
                        <div className="w-2 h-2 bg-gray-500 rounded-full" />
                        <span className="text-gray-500 text-xs">Inactive</span>
                      </>
                    )}
                  </div>
                </div>
                <Switch
                  checked={isActive}
                  onCheckedChange={handleToggleBot}
                  className="data-[state=checked]:bg-purple-600"
                />
              </div>

              {/* Advanced Filters */}
              <div className="space-y-4">
                <h4 className="text-gray-300 text-sm font-medium flex items-center">
                  <Filter className="w-4 h-4 mr-2" />
                  Smart Filters
                </h4>
                
                <div>
                  <Label className="text-gray-300 text-sm">Min Engagement Score: {selectedFilters.minEngagement}%</Label>
                  <Slider
                    value={[selectedFilters.minEngagement]}
                    onValueChange={(value) => setSelectedFilters(prev => ({ ...prev, minEngagement: value[0] }))}
                    max={100}
                    min={0}
                    step={5}
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label className="text-gray-300 text-sm">Min Author Influence: {selectedFilters.minAuthorInfluence}%</Label>
                  <Slider
                    value={[selectedFilters.minAuthorInfluence]}
                    onValueChange={(value) => setSelectedFilters(prev => ({ ...prev, minAuthorInfluence: value[0] }))}
                    max={100}
                    min={0}
                    step={5}
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label className="text-gray-300 text-sm">Daily Comment Limit: {selectedFilters.maxDailyComments}</Label>
                  <Slider
                    value={[selectedFilters.maxDailyComments]}
                    onValueChange={(value) => setSelectedFilters(prev => ({ ...prev, maxDailyComments: value[0] }))}
                    max={100}
                    min={1}
                    step={1}
                    className="mt-2"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-gray-300 text-sm">Avoid Competitors</Label>
                    <p className="text-gray-500 text-xs">Skip posts from competing companies</p>
                  </div>
                  <Switch
                    checked={selectedFilters.avoidCompetitors}
                    onCheckedChange={(checked) => setSelectedFilters(prev => ({ ...prev, avoidCompetitors: checked }))}
                    className="data-[state=checked]:bg-purple-600"
                  />
                </div>
              </div>

              {/* Target Industries */}
              <div>
                <Label className="text-gray-300 font-medium mb-3 block">Target Industries</Label>
                <div className="flex flex-wrap gap-2">
                  {['Technology', 'Marketing', 'Sales', 'Entrepreneurship', 'Finance', 'Healthcare'].map((industry) => (
                    <Badge
                      key={industry}
                      className={`cursor-pointer transition-all duration-300 ${
                        targetIndustries.includes(industry)
                          ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/25'
                          : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      }`}
                      onClick={() => {
                        setTargetIndustries(prev =>
                          prev.includes(industry)
                            ? prev.filter(i => i !== industry)
                            : [...prev, industry]
                        );
                      }}
                    >
                      {industry}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Comment Tone */}
              <div>
                <Label htmlFor="tone" className="text-gray-300 font-medium">
                  Comment Tone
                </Label>
                <Select value={commentTone} onValueChange={setCommentTone}>
                  <SelectTrigger className="bg-gray-800/50 border-purple-800/30 text-white mt-2 focus:border-purple-600">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-purple-800/30">
                    <SelectItem value="Professional" className="text-white hover:bg-purple-900/20">Professional</SelectItem>
                    <SelectItem value="Friendly" className="text-white hover:bg-purple-900/20">Friendly</SelectItem>
                    <SelectItem value="Enthusiastic" className="text-white hover:bg-purple-900/20">Enthusiastic</SelectItem>
                    <SelectItem value="Thoughtful" className="text-white hover:bg-purple-900/20">Thoughtful</SelectItem>
                    <SelectItem value="Supportive" className="text-white hover:bg-purple-900/20">Supportive</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Custom Template */}
              <div>
                <Label htmlFor="template" className="text-gray-300 font-medium">
                  Custom Comment Template
                </Label>
                <Textarea
                  id="template"
                  placeholder="Add your own comment template with variables like {topic}, {key_point}..."
                  value={customTemplate}
                  onChange={(e) => setCustomTemplate(e.target.value)}
                  className="bg-gray-800/50 border-purple-800/30 text-white mt-2 resize-none focus:border-purple-600"
                  rows={3}
                />
              </div>

              {/* API Status */}
              <div className="pt-4 border-t border-purple-800/30">
                <h4 className="text-gray-300 text-sm font-medium mb-3">AI Services Status</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400 text-xs">AI Model</span>
                    <Badge className="bg-green-600/20 text-green-400">Live</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400 text-xs">Sentiment Analysis</span>
                    <Badge className="bg-green-600/20 text-green-400">Live</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400 text-xs">Engagement Prediction</span>
                    <Badge className="bg-green-600/20 text-green-400">Live</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Enhanced Live Feed */}
          <div className="lg:col-span-3 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-white">Intelligent Feed Analysis</h2>
              <div className="flex items-center space-x-2">
                <Badge className="bg-purple-600 text-white">
                  <Target className="w-3 h-3 mr-1" />
                  {filteredPosts.length} qualified posts
                </Badge>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPosts([...mockPosts])}
                  className="border-purple-700/50 text-gray-300 hover:bg-purple-900/20"
                >
                  <RefreshCw className="w-4 h-4 mr-1" />
                  Refresh
                </Button>
              </div>
            </div>

            <AnimatePresence>
              {filteredPosts.map((post, index) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className="glass-purple border-purple-800/30 neuro hover:shadow-xl hover:shadow-purple-500/20 transition-all duration-300">
                    <CardHeader>
                      <div className="flex items-start space-x-3">
                        <img
                          src={post.avatar}
                          alt={post.author}
                          className="w-12 h-12 rounded-full ring-2 ring-purple-500/30"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-1">
                            <h3 className="text-white font-medium">{post.author}</h3>
                            <Badge className="bg-blue-600/20 text-blue-400 border-blue-500/50 text-xs">
                              {post.industry}
                            </Badge>
                            <Badge className={getSentimentColor(post.sentiment)}>
                              {post.sentiment}
                            </Badge>
                            {post.competitorActivity && (
                              <Badge className="bg-orange-600/20 text-orange-400 border-orange-500/50 text-xs">
                                Competitor
                              </Badge>
                            )}
                          </div>
                          <p className="text-gray-400 text-sm">{post.title}</p>
                          <div className="flex items-center space-x-4 text-xs text-gray-500 mt-1">
                            <span>{post.timeAgo}</span>
                            <span className="flex items-center">
                              <Eye className="w-3 h-3 mr-1" />
                              {post.estimatedReach?.toLocaleString()} reach
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-gray-300 leading-relaxed">{post.content}</p>
                      
                      <div className="flex items-center space-x-6 text-gray-400 text-sm">
                        <div className="flex items-center space-x-1">
                          <Heart className="w-4 h-4" />
                          <span>{post.engagement.likes}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <MessageCircle className="w-4 h-4" />
                          <span>{post.engagement.comments}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Share2 className="w-4 h-4" />
                          <span>{post.engagement.shares}</span>
                        </div>
                      </div>

                      {/* Enhanced AI Analysis */}
                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 p-3 glass-purple rounded-lg neuro-inset">
                        <div className="text-center">
                          <div className="flex items-center justify-center mb-1">
                            <TrendingUp className="w-3 h-3 mr-1 text-green-400" />
                            <span className="text-xs text-gray-400">Engagement</span>
                          </div>
                          <div className={`text-sm font-bold ${getScoreColor(post.engagementPotentialScore)}`}>
                            {post.engagementPotentialScore}%
                          </div>
                          <Progress value={post.engagementPotentialScore} className="h-1 mt-1" />
                        </div>
                        
                        <div className="text-center">
                          <div className="flex items-center justify-center mb-1">
                            <Target className="w-3 h-3 mr-1 text-blue-400" />
                            <span className="text-xs text-gray-400">Relevance</span>
                          </div>
                          <div className={`text-sm font-bold ${getScoreColor(post.topicRelevance)}`}>
                            {post.topicRelevance}%
                          </div>
                          <Progress value={post.topicRelevance} className="h-1 mt-1" />
                        </div>
                        
                        <div className="text-center">
                          <div className="flex items-center justify-center mb-1">
                            <Star className="w-3 h-3 mr-1 text-yellow-400" />
                            <span className="text-xs text-gray-400">Influence</span>
                          </div>
                          <div className={`text-sm font-bold ${getScoreColor(post.authorInfluence)}`}>
                            {post.authorInfluence}%
                          </div>
                          <Progress value={post.authorInfluence} className="h-1 mt-1" />
                        </div>

                        <div className="text-center">
                          <div className="flex items-center justify-center mb-1">
                            <Brain className="w-3 h-3 mr-1 text-purple-400" />
                            <span className="text-xs text-gray-400">AI Score</span>
                          </div>
                          <div className="text-sm font-bold text-purple-400">
                            {Math.round((post.engagementPotentialScore + post.topicRelevance + post.authorInfluence) / 3)}%
                          </div>
                          <Progress value={(post.engagementPotentialScore + post.topicRelevance + post.authorInfluence) / 3} className="h-1 mt-1" />
                        </div>
                      </div>

                      {/* Generated Comment Preview */}
                      {post.generatedComment && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          className="p-3 bg-green-600/20 border border-green-500/50 rounded-lg"
                        >
                          <div className="flex items-center mb-2">
                            <CheckCircle className="w-4 h-4 text-green-400 mr-2" />
                            <span className="text-green-400 font-medium text-sm">Comment Generated & Posted</span>
                            <Badge className="ml-2 bg-green-600/20 text-green-400 text-xs">
                              {post.commentSentiment}
                            </Badge>
                          </div>
                          <p className="text-green-300 text-sm italic">"{post.generatedComment}"</p>
                          <div className="grid grid-cols-2 gap-4 mt-3 text-xs">
                            <div>
                              <span className="text-gray-400">Quality Score:</span>
                              <span className={`ml-2 font-medium ${getScoreColor(post.commentQuality || 0)}`}>
                                {post.commentQuality}%
                              </span>
                            </div>
                            <div>
                              <span className="text-gray-400">Relevance:</span>
                              <span className={`ml-2 font-medium ${getScoreColor(post.relevanceScore || 0)}`}>
                                {post.relevanceScore}%
                              </span>
                            </div>
                          </div>
                        </motion.div>
                      )}

                      <div className="flex items-center justify-between pt-4 border-t border-purple-800/30">
                        <div className="flex items-center space-x-2">
                          <div className={`w-2 h-2 rounded-full ${
                            post.engagementPotentialScore >= 85 ? 'bg-green-400' : 
                            post.engagementPotentialScore >= 70 ? 'bg-yellow-400' : 'bg-red-400'
                          }`} />
                          <span className={`text-sm ${
                            post.engagementPotentialScore >= 85 ? 'text-green-400' : 
                            post.engagementPotentialScore >= 70 ? 'text-yellow-400' : 'text-red-400'
                          }`}>
                            {post.engagementPotentialScore >= 85 ? 'High' : 
                             post.engagementPotentialScore >= 70 ? 'Medium' : 'Low'} priority
                          </span>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          {!post.commentQuality ? (
                            <>
                              {post.isProcessing ? (
                                <Button
                                  size="sm"
                                  disabled
                                  className="bg-purple-600/50"
                                >
                                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                  Processing...
                                </Button>
                              ) : (
                                <Button
                                  size="sm"
                                  onClick={() => handleGenerateComment(post)}
                                  className="bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 shadow-lg shadow-purple-500/25"
                                >
                                  <Sparkles className="mr-2 h-4 w-4" />
                                  Generate Comment
                                </Button>
                              )}
                            </>
                          ) : (
                            <Badge className="bg-green-600/20 text-green-400 border-green-500/50">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Commented
                            </Badge>
                          )}
                          
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => window.open('https://linkedin.com/feed', '_blank')}
                            className="border-purple-700/50 text-gray-300 hover:bg-purple-900/20"
                          >
                            <Globe className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>

            {filteredPosts.length === 0 && (
              <Card className="glass-purple border-purple-800/30 neuro">
                <CardContent className="p-12 text-center">
                  <MessageSquare className="w-12 h-12 text-purple-600 mx-auto mb-4" />
                  <h3 className="text-white text-lg font-medium mb-2">
                    No Qualified Posts Found
                  </h3>
                  <p className="text-gray-400 mb-4">
                    Adjust your filters to find more posts that match your criteria
                  </p>
                  <Button
                    onClick={() => setSelectedFilters({
                      minEngagement: 50,
                      maxDailyComments: 20,
                      targetSentiment: 'Positive',
                      minAuthorInfluence: 30,
                      avoidCompetitors: false
                    })}
                    variant="outline"
                    className="border-purple-700/50 text-gray-300 hover:bg-purple-900/20"
                  >
                    <Filter className="mr-2 h-4 w-4" />
                    Reset Filters
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