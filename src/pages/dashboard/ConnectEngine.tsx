import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Progress } from '@/components/ui/progress';
import { useAuthStore } from '@/store/authStore';
import { useAppStore } from '@/store/appStore';
import { useApiKeysStore } from '@/store/apiKeysStore';
import { toast } from 'sonner';
import {
  Link2,
  Search,
  Filter,
  Users,
  MapPin,
  Building,
  Briefcase,
  Plus,
  Check,
  X,
  Loader2,
  Target,
  Calendar,
  TrendingUp,
  MessageSquare,
  Star,
  Globe,
  Mail,
  Phone,
  Linkedin,
  ExternalLink,
  UserPlus,
  Eye,
  Heart,
  Share,
  Clock,
  Zap,
  Brain,
  Shield,
  Activity,
  BarChart3
} from 'lucide-react';

const industries = [
  'Technology',
  'Finance',
  'Healthcare',
  'Marketing',
  'Sales',
  'Consulting',
  'Education',
  'Manufacturing',
  'Real Estate',
  'Legal'
];

const countries = [
  'United States',
  'Canada',
  'United Kingdom',
  'Germany',
  'France',
  'Australia',
  'India',
  'Singapore',
  'Netherlands',
  'Sweden'
];

const jobTitles = [
  'CEO',
  'CTO',
  'VP of Sales',
  'Marketing Manager',
  'Product Manager',
  'Software Engineer',
  'Data Scientist',
  'Business Analyst',
  'Consultant',
  'Director'
];

interface EnhancedProspect {
  id: string;
  name: string;
  title: string;
  company: string;
  industry: string;
  country: string;
  avatar: string;
  linkedinProfileUrl: string;
  companySize: string;
  yearsInRole: number;
  recentPostsSummary: string;
  skills: string[];
  commonConnectionsList: { name: string; avatar: string }[];
  mutualConnections: number;
  recentActivity: string;
  matchScore: number;
  responseRate: number;
  lastActive: string;
  connectionPotential: 'High' | 'Medium' | 'Low';
  email?: string;
  phone?: string;
  companyWebsite?: string;
  socialProfiles?: {
    twitter?: string;
    github?: string;
  };
  engagementHistory?: {
    postsLast30Days: number;
    avgLikes: number;
    avgComments: number;
  };
  isProcessing?: boolean;
  connectionSent?: boolean;
  personalizedMessage?: string;
}

// Enhanced mock prospect data
const mockProspects: EnhancedProspect[] = [
  {
    id: '1',
    name: 'Alex Johnson',
    title: 'VP of Marketing',
    company: 'TechFlow Inc',
    industry: 'Technology',
    country: 'United States',
    avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
    linkedinProfileUrl: 'https://linkedin.com/in/alexjohnson',
    companySize: '500-1000 employees',
    yearsInRole: 3,
    recentPostsSummary: 'Frequently posts about AI trends, marketing automation, and team leadership. High engagement on content.',
    skills: ['Digital Marketing', 'AI Strategy', 'Team Leadership', 'Growth Hacking'],
    commonConnectionsList: [
      { name: 'Sarah Chen', avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&dpr=2' },
      { name: 'Mike Rodriguez', avatar: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&dpr=2' }
    ],
    mutualConnections: 12,
    recentActivity: 'Posted about AI trends',
    matchScore: 95,
    responseRate: 78,
    lastActive: '2 hours ago',
    connectionPotential: 'High',
    email: 'alex.johnson@techflow.com',
    companyWebsite: 'https://techflow.com',
    engagementHistory: {
      postsLast30Days: 15,
      avgLikes: 45,
      avgComments: 8
    }
  },
  {
    id: '2',
    name: 'Sarah Williams',
    title: 'Product Manager',
    company: 'InnovateCorp',
    industry: 'Technology',
    country: 'Canada',
    avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
    linkedinProfileUrl: 'https://linkedin.com/in/sarahwilliams',
    companySize: '100-500 employees',
    yearsInRole: 2,
    recentPostsSummary: 'Shares insights on product strategy, user experience, and agile methodologies. Active in product management communities.',
    skills: ['Product Strategy', 'User Experience', 'Agile', 'Data Analysis'],
    commonConnectionsList: [
      { name: 'David Chen', avatar: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&dpr=2' }
    ],
    mutualConnections: 8,
    recentActivity: 'Shared article on product strategy',
    matchScore: 88,
    responseRate: 65,
    lastActive: '1 day ago',
    connectionPotential: 'High',
    email: 'sarah.williams@innovatecorp.com',
    phone: '+1-555-0123',
    engagementHistory: {
      postsLast30Days: 8,
      avgLikes: 32,
      avgComments: 5
    }
  },
  {
    id: '3',
    name: 'David Chen',
    title: 'Sales Director',
    company: 'GrowthLabs',
    industry: 'Marketing',
    country: 'United States',
    avatar: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
    linkedinProfileUrl: 'https://linkedin.com/in/davidchen',
    companySize: '50-100 employees',
    yearsInRole: 4,
    recentPostsSummary: 'Posts about sales automation, CRM optimization, and team performance. Regular contributor to sales discussions.',
    skills: ['Sales Strategy', 'CRM', 'Team Management', 'B2B Sales'],
    commonConnectionsList: [
      { name: 'Alex Johnson', avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&dpr=2' },
      { name: 'Emily Rodriguez', avatar: 'https://images.pexels.com/photos/762020/pexels-photo-762020.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&dpr=2' }
    ],
    mutualConnections: 15,
    recentActivity: 'Commented on sales automation',
    matchScore: 92,
    responseRate: 82,
    lastActive: '4 hours ago',
    connectionPotential: 'High',
    socialProfiles: {
      twitter: 'https://twitter.com/davidchen',
      github: 'https://github.com/davidchen'
    },
    engagementHistory: {
      postsLast30Days: 12,
      avgLikes: 38,
      avgComments: 7
    }
  }
];

export default function ConnectEngine() {
  const [isSearching, setIsSearching] = useState(false);
  const [prospects, setProspects] = useState(mockProspects);
  const [filters, setFilters] = useState({
    industry: '',
    country: '',
    jobTitle: '',
    keywords: '',
    minConnections: 100,
    maxConnections: 10000,
    companySize: '',
    yearsInRole: [0, 10]
  });
  const [connectingIds, setConnectingIds] = useState<Set<string>>(new Set());
  const [automationSettings, setAutomationSettings] = useState({
    enableAutoConnect: false,
    dailyLimit: 20,
    personalizeMessages: true,
    followUpEnabled: true,
    followUpDelay: 3
  });
  const [searchStats, setSearchStats] = useState({
    totalSearches: 45,
    connectionsToday: 12,
    responseRate: 68,
    avgMatchScore: 87
  });

  const { user, updateCredits } = useAuthStore();
  const { addConnection } = useAppStore();
  const { mockDataFlags } = useApiKeysStore();

  const handleSearch = async () => {
    if (user?.credits === 0 && user?.plan === 'free') {
      toast.error('No credits remaining. Please upgrade your plan.');
      return;
    }

    setIsSearching(true);
    
    try {
      // Enhanced processing time based on API usage
      const processingTime = mockDataFlags.useApifyMockData ? 2000 : 5000;
      await new Promise(resolve => setTimeout(resolve, processingTime));
      
      // Filter prospects based on criteria
      let filteredProspects = mockProspects;
      
      if (filters.industry) {
        filteredProspects = filteredProspects.filter(p => p.industry === filters.industry);
      }
      if (filters.country) {
        filteredProspects = filteredProspects.filter(p => p.country === filters.country);
      }
      if (filters.jobTitle) {
        filteredProspects = filteredProspects.filter(p => p.title.includes(filters.jobTitle));
      }
      if (filters.keywords) {
        filteredProspects = filteredProspects.filter(p => 
          p.name.toLowerCase().includes(filters.keywords.toLowerCase()) ||
          p.company.toLowerCase().includes(filters.keywords.toLowerCase()) ||
          p.title.toLowerCase().includes(filters.keywords.toLowerCase()) ||
          p.skills.some(skill => skill.toLowerCase().includes(filters.keywords.toLowerCase()))
        );
      }
      
      // Enhanced data for "real" API usage
      if (!mockDataFlags.useApifyMockData) {
        filteredProspects = filteredProspects.map(prospect => ({
          ...prospect,
          matchScore: Math.min(99, prospect.matchScore + 3),
          responseRate: Math.min(95, prospect.responseRate + 8),
          skills: [...prospect.skills, 'Advanced Analytics', 'Strategic Planning']
        }));
      }
      
      setProspects(filteredProspects);
      
      // Deduct credit for free users
      if (user?.plan === 'free') {
        updateCredits(-1);
      }
      
      toast.success(`Found ${filteredProspects.length} high-quality prospects`);
    } catch (error) {
      toast.error('Search failed. Please try again.');
    } finally {
      setIsSearching(false);
    }
  };

  const handleConnect = async (prospect: EnhancedProspect) => {
    if (user?.credits === 0 && user?.plan === 'free') {
      toast.error('No credits remaining. Please upgrade your plan.');
      return;
    }

    setConnectingIds(prev => new Set(prev).add(prospect.id));
    setProspects(prev => prev.map(p => 
      p.id === prospect.id ? { ...p, isProcessing: true } : p
    ));
    
    try {
      // Simulate connection request with personalized message generation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const personalizedMessage = `Hi ${prospect.name.split(' ')[0]}, I noticed your work in ${prospect.industry} at ${prospect.company}. Your recent post about ${prospect.recentActivity.toLowerCase()} really resonated with me. I'd love to connect and share insights!`;
      
      // Add to connections store
      addConnection({
        name: prospect.name,
        title: prospect.title,
        company: prospect.company,
        industry: prospect.industry,
        country: prospect.country,
        avatar: prospect.avatar,
        status: 'pending'
      });
      
      // Update prospect with connection info
      setProspects(prev => prev.map(p => 
        p.id === prospect.id ? 
        { 
          ...p, 
          connectionSent: true, 
          personalizedMessage,
          isProcessing: false
        } : 
        p
      ));
      
      // Deduct credit for free users
      if (user?.plan === 'free') {
        updateCredits(-1);
      }
      
      toast.success(`Connection request sent to ${prospect.name} with personalized message!`);
    } catch (error) {
      setProspects(prev => prev.map(p => 
        p.id === prospect.id ? { ...p, isProcessing: false } : p
      ));
      toast.error('Failed to send connection request');
    } finally {
      setConnectingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(prospect.id);
        return newSet;
      });
    }
  };

  const handleSkip = (prospectId: string) => {
    setProspects(prev => prev.filter(p => p.id !== prospectId));
    toast.success('Prospect skipped');
  };

  const getPotentialColor = (potential: string) => {
    switch (potential) {
      case 'High': return 'bg-green-600/20 text-green-400 border-green-500/50';
      case 'Medium': return 'bg-yellow-600/20 text-yellow-400 border-yellow-500/50';
      case 'Low': return 'bg-red-600/20 text-red-400 border-red-500/50';
      default: return 'bg-gray-600/20 text-gray-400 border-gray-500/50';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-green-400';
    if (score >= 70) return 'text-yellow-400';
    return 'text-red-400';
  };

  const stats = [
    { label: 'Total Searches', value: searchStats.totalSearches, icon: Search, color: 'text-purple-400', change: '+3 today' },
    { label: 'Connections Today', value: searchStats.connectionsToday, icon: UserPlus, color: 'text-green-400', change: `${automationSettings.dailyLimit - searchStats.connectionsToday} remaining` },
    { label: 'Response Rate', value: `${searchStats.responseRate}%`, icon: TrendingUp, color: 'text-blue-400', change: '+2% this week' },
    { label: 'Avg Match Score', value: `${searchStats.avgMatchScore}%`, icon: Target, color: 'text-yellow-400', change: 'Excellent targeting' }
  ];

  return (
    <DashboardLayout>
      <div className="p-6 w-full max-w-none">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white mb-2">AI Connection Engine</h1>
          <p className="text-gray-400">
            Find and connect with your ideal prospects using advanced AI targeting and personalized outreach.
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
          {/* Enhanced Search Filters */}
          <Card className="glass-purple border-purple-800/30 neuro">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Filter className="w-5 h-5 mr-2" />
                Advanced Targeting
              </CardTitle>
              <CardDescription className="text-gray-400">
                Define your ideal customer profile with precision
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="keywords" className="text-gray-300">
                  Keywords & Skills
                </Label>
                <Input
                  id="keywords"
                  placeholder="e.g., startup, AI, marketing, SaaS"
                  value={filters.keywords}
                  onChange={(e) => setFilters({...filters, keywords: e.target.value})}
                  className="bg-gray-800/50 border-purple-800/30 text-white placeholder-gray-400 focus:border-purple-600"
                />
              </div>

              <div>
                <Label htmlFor="industry" className="text-gray-300">
                  Industry
                </Label>
                <Select value={filters.industry || 'all'} onValueChange={(value) => setFilters({...filters, industry: value === 'all' ? '' : value})}>
                  <SelectTrigger className="bg-gray-800/50 border-purple-800/30 text-white focus:border-purple-600">
                    <SelectValue placeholder="Select industry" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-purple-800/30">
                    <SelectItem value="all" className="text-white hover:bg-purple-900/20">All Industries</SelectItem>
                    {industries.map((industry) => (
                      <SelectItem key={industry} value={industry} className="text-white hover:bg-purple-900/20">
                        {industry}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="country" className="text-gray-300">
                  Country
                </Label>
                <Select value={filters.country || 'all'} onValueChange={(value) => setFilters({...filters, country: value === 'all' ? '' : value})}>
                  <SelectTrigger className="bg-gray-800/50 border-purple-800/30 text-white focus:border-purple-600">
                    <SelectValue placeholder="Select country" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-purple-800/30">
                    <SelectItem value="all" className="text-white hover:bg-purple-900/20">All Countries</SelectItem>
                    {countries.map((country) => (
                      <SelectItem key={country} value={country} className="text-white hover:bg-purple-900/20">
                        {country}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="jobTitle" className="text-gray-300">
                  Job Title
                </Label>
                <Select value={filters.jobTitle || 'all'} onValueChange={(value) => setFilters({...filters, jobTitle: value === 'all' ? '' : value})}>
                  <SelectTrigger className="bg-gray-800/50 border-purple-800/30 text-white focus:border-purple-600">
                    <SelectValue placeholder="Select job title" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-purple-800/30">
                    <SelectItem value="all" className="text-white hover:bg-purple-900/20">All Titles</SelectItem>
                    {jobTitles.map((title) => (
                      <SelectItem key={title} value={title} className="text-white hover:bg-purple-900/20">
                        {title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Advanced Filters */}
              <div className="space-y-4 pt-4 border-t border-purple-800/30">
                <h4 className="text-gray-300 text-sm font-medium">Advanced Filters</h4>
                
                <div>
                  <Label className="text-gray-300 text-sm">Years in Role: {filters.yearsInRole[0]} - {filters.yearsInRole[1]} years</Label>
                  <Slider
                    value={filters.yearsInRole}
                    onValueChange={(value) => setFilters({...filters, yearsInRole: value})}
                    max={20}
                    min={0}
                    step={1}
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label className="text-gray-300 text-sm">Min Connections: {filters.minConnections}</Label>
                  <Slider
                    value={[filters.minConnections]}
                    onValueChange={(value) => setFilters({...filters, minConnections: value[0]})}
                    max={5000}
                    min={50}
                    step={50}
                    className="mt-2"
                  />
                </div>
              </div>

              {/* Automation Settings */}
              <div className="space-y-4 pt-4 border-t border-purple-800/30">
                <h4 className="text-gray-300 text-sm font-medium flex items-center">
                  <Zap className="w-4 h-4 mr-2" />
                  Automation Settings
                </h4>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-gray-300 text-sm">Auto Connect</Label>
                    <p className="text-gray-500 text-xs">Automatically send connection requests</p>
                  </div>
                  <Switch
                    checked={automationSettings.enableAutoConnect}
                    onCheckedChange={(checked) => setAutomationSettings(prev => ({ ...prev, enableAutoConnect: checked }))}
                    className="data-[state=checked]:bg-purple-600"
                  />
                </div>

                <div>
                  <Label className="text-gray-300 text-sm">Daily Limit: {automationSettings.dailyLimit}</Label>
                  <Slider
                    value={[automationSettings.dailyLimit]}
                    onValueChange={(value) => setAutomationSettings(prev => ({ ...prev, dailyLimit: value[0] }))}
                    max={100}
                    min={1}
                    step={1}
                    className="mt-2"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-gray-300 text-sm">Personalize Messages</Label>
                    <p className="text-gray-500 text-xs">Use AI to personalize connection requests</p>
                  </div>
                  <Switch
                    checked={automationSettings.personalizeMessages}
                    onCheckedChange={(checked) => setAutomationSettings(prev => ({ ...prev, personalizeMessages: checked }))}
                    className="data-[state=checked]:bg-purple-600"
                  />
                </div>
              </div>

              <Button
                onClick={handleSearch}
                disabled={isSearching || (user?.credits === 0 && user?.plan === 'free')}
                className="w-full bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 shadow-lg shadow-purple-500/25"
              >
                {isSearching ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Searching...
                  </>
                ) : (
                  <>
                    <Search className="mr-2 h-4 w-4" />
                    Find Prospects
                  </>
                )}
              </Button>

              {user?.plan === 'free' && user?.credits === 0 && (
                <div className="p-3 bg-yellow-600/20 border border-yellow-500/50 rounded-lg">
                  <p className="text-yellow-400 text-sm">
                    No credits remaining. Upgrade to continue searching.
                  </p>
                </div>
              )}

              {/* API Status */}
              <div className="pt-4 border-t border-purple-800/30">
                <h4 className="text-gray-300 text-sm font-medium mb-3">Data Sources</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400 text-xs">LinkedIn Scraper</span>
                    <Badge className="bg-green-600/20 text-green-400">Live</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400 text-xs">Email Finder</span>
                    <Badge className="bg-green-600/20 text-green-400">Live</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400 text-xs">Company Data</span>
                    <Badge className="bg-green-600/20 text-green-400">Live</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Enhanced Prospects Results */}
          <div className="lg:col-span-3">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white">High-Quality Prospects</h2>
              <div className="flex items-center space-x-2">
                <Badge className="bg-purple-600 text-white">
                  <Target className="w-3 h-3 mr-1" />
                  {prospects.length} qualified prospects
                </Badge>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setProspects([...mockProspects])}
                  className="border-purple-700/50 text-gray-300 hover:bg-purple-900/20"
                >
                  <Eye className="w-4 h-4 mr-1" />
                  Refresh
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              <AnimatePresence>
                {prospects.map((prospect, index) => (
                  <motion.div
                    key={prospect.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <Card className="glass-purple border-purple-800/30 neuro hover:shadow-xl hover:shadow-purple-500/20 transition-all duration-300">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-start space-x-4">
                            <Avatar className="w-16 h-16 ring-2 ring-purple-500/30">
                              <AvatarImage src={prospect.avatar} alt={prospect.name} />
                              <AvatarFallback className="bg-purple-600 text-white text-lg">
                                {prospect.name.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-2">
                                <h3 className="text-white font-semibold text-lg">{prospect.name}</h3>
                                <Badge className="bg-green-600/20 text-green-400 border-green-500/50">
                                  {prospect.matchScore}% match
                                </Badge>
                                <Badge className={getPotentialColor(prospect.connectionPotential)}>
                                  {prospect.connectionPotential} potential
                                </Badge>
                              </div>
                              
                              <div className="space-y-1 text-gray-400 text-sm mb-3">
                                <div className="flex items-center space-x-2">
                                  <Briefcase className="w-4 h-4" />
                                  <span>{prospect.title} at {prospect.company}</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <Building className="w-4 h-4" />
                                  <span>{prospect.industry} • {prospect.companySize}</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <MapPin className="w-4 h-4" />
                                  <span>{prospect.country}</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <Clock className="w-4 h-4" />
                                  <span>{prospect.yearsInRole} years in role • Last active {prospect.lastActive}</span>
                                </div>
                              </div>

                              {/* Enhanced Contact Information */}
                              <div className="grid md:grid-cols-2 gap-4 mb-4">
                                <div className="p-3 glass-purple rounded-lg neuro-inset">
                                  <h4 className="text-white font-medium text-sm mb-2">Contact Information</h4>
                                  <div className="space-y-1 text-xs">
                                    {prospect.email && (
                                      <div className="flex items-center space-x-2">
                                        <Mail className="w-3 h-3 text-purple-400" />
                                        <span className="text-gray-300">{prospect.email}</span>
                                      </div>
                                    )}
                                    {prospect.phone && (
                                      <div className="flex items-center space-x-2">
                                        <Phone className="w-3 h-3 text-purple-400" />
                                        <span className="text-gray-300">{prospect.phone}</span>
                                      </div>
                                    )}
                                    <div className="flex items-center space-x-2">
                                      <Linkedin className="w-3 h-3 text-purple-400" />
                                      <span className="text-gray-300">LinkedIn Profile</span>
                                    </div>
                                  </div>
                                </div>

                                <div className="p-3 glass-purple rounded-lg neuro-inset">
                                  <h4 className="text-white font-medium text-sm mb-2">Engagement Metrics</h4>
                                  <div className="space-y-1 text-xs">
                                    <div className="flex items-center justify-between">
                                      <span className="text-gray-400">Response Rate:</span>
                                      <span className={getScoreColor(prospect.responseRate)}>{prospect.responseRate}%</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                      <span className="text-gray-400">Posts/Month:</span>
                                      <span className="text-blue-400">{prospect.engagementHistory?.postsLast30Days}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                      <span className="text-gray-400">Avg Engagement:</span>
                                      <span className="text-green-400">{prospect.engagementHistory?.avgLikes}♥ {prospect.engagementHistory?.avgComments}💬</span>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {/* Skills & Expertise */}
                              <div className="mb-4">
                                <h4 className="text-white font-medium text-sm mb-2">Skills & Expertise</h4>
                                <div className="flex flex-wrap gap-1">
                                  {prospect.skills.slice(0, 6).map((skill, index) => (
                                    <Badge key={index} className="bg-blue-600/20 text-blue-400 border-blue-500/50 text-xs">
                                      {skill}
                                    </Badge>
                                  ))}
                                  {prospect.skills.length > 6 && (
                                    <Badge className="bg-gray-600/20 text-gray-400 border-gray-500/50 text-xs">
                                      +{prospect.skills.length - 6} more
                                    </Badge>
                                  )}
                                </div>
                              </div>

                              {/* Mutual Connections */}
                              {prospect.commonConnectionsList.length > 0 && (
                                <div className="mb-4">
                                  <h4 className="text-white font-medium text-sm mb-2">Mutual Connections ({prospect.mutualConnections})</h4>
                                  <div className="flex items-center space-x-2">
                                    {prospect.commonConnectionsList.slice(0, 3).map((connection, index) => (
                                      <div key={index} className="flex items-center space-x-1">
                                        <img
                                          src={connection.avatar}
                                          alt={connection.name}
                                          className="w-6 h-6 rounded-full ring-1 ring-purple-500/30"
                                        />
                                        <span className="text-gray-400 text-xs">{connection.name}</span>
                                      </div>
                                    ))}
                                    {prospect.commonConnectionsList.length > 3 && (
                                      <span className="text-gray-400 text-xs">
                                        +{prospect.commonConnectionsList.length - 3} more
                                      </span>
                                    )}
                                  </div>
                                </div>
                              )}
                              
                              {/* Recent Activity */}
                              <div className="p-3 glass-purple rounded-lg neuro-inset">
                                <h4 className="text-white font-medium text-sm mb-2">Recent LinkedIn Activity</h4>
                                <p className="text-gray-300 text-sm mb-2">{prospect.recentPostsSummary}</p>
                                <p className="text-purple-400 text-xs">
                                  <Activity className="w-3 h-3 inline mr-1" />
                                  Latest: {prospect.recentActivity}
                                </p>
                              </div>

                              {/* Personalized Message Preview */}
                              {prospect.personalizedMessage && (
                                <motion.div
                                  initial={{ opacity: 0, height: 0 }}
                                  animate={{ opacity: 1, height: 'auto' }}
                                  className="mt-4 p-3 bg-green-600/20 border border-green-500/50 rounded-lg"
                                >
                                  <div className="flex items-center mb-2">
                                    <Check className="w-4 h-4 text-green-400 mr-2" />
                                    <span className="text-green-400 font-medium text-sm">Connection Request Sent</span>
                                  </div>
                                  <p className="text-green-300 text-sm italic">"{prospect.personalizedMessage}"</p>
                                </motion.div>
                              )}
                            </div>
                          </div>
                          
                          <div className="flex flex-col space-y-2">
                            {!prospect.connectionSent ? (
                              <>
                                {prospect.isProcessing ? (
                                  <Button
                                    disabled
                                    className="bg-purple-600/50"
                                  >
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Connecting...
                                  </Button>
                                ) : (
                                  <Button
                                    onClick={() => handleConnect(prospect)}
                                    disabled={connectingIds.has(prospect.id)}
                                    className="bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 shadow-lg shadow-purple-500/25"
                                  >
                                    <Plus className="mr-2 h-4 w-4" />
                                    Connect
                                  </Button>
                                )}
                              </>
                            ) : (
                              <Badge className="bg-green-600/20 text-green-400 border-green-500/50 px-3 py-2">
                                <Check className="w-3 h-3 mr-1" />
                                Connected
                              </Badge>
                            )}
                            
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => window.open(prospect.linkedinProfileUrl, '_blank')}
                              className="border-purple-700/50 text-gray-300 hover:bg-purple-900/20"
                            >
                              <ExternalLink className="mr-2 h-4 w-4" />
                              View Profile
                            </Button>
                            
                            {prospect.companyWebsite && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => window.open(prospect.companyWebsite, '_blank')}
                                className="border-purple-700/50 text-gray-300 hover:bg-purple-900/20"
                              >
                                <Globe className="mr-2 h-4 w-4" />
                                Company
                              </Button>
                            )}
                            
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleSkip(prospect.id)}
                              className="border-gray-700 text-gray-300 hover:bg-gray-800"
                            >
                              <X className="mr-2 h-4 w-4" />
                              Skip
                            </Button>
                          </div>
                        </div>

                        {/* AI Scoring Breakdown */}
                        <div className="grid grid-cols-3 gap-4 pt-4 border-t border-purple-800/30">
                          <div className="text-center">
                            <div className="flex items-center justify-center mb-1">
                              <Brain className="w-3 h-3 mr-1 text-purple-400" />
                              <span className="text-xs text-gray-400">AI Match</span>
                            </div>
                            <div className={`text-sm font-bold ${getScoreColor(prospect.matchScore)}`}>
                              {prospect.matchScore}%
                            </div>
                            <Progress value={prospect.matchScore} className="h-1 mt-1" />
                          </div>
                          
                          <div className="text-center">
                            <div className="flex items-center justify-center mb-1">
                              <TrendingUp className="w-3 h-3 mr-1 text-green-400" />
                              <span className="text-xs text-gray-400">Response</span>
                            </div>
                            <div className={`text-sm font-bold ${getScoreColor(prospect.responseRate)}`}>
                              {prospect.responseRate}%
                            </div>
                            <Progress value={prospect.responseRate} className="h-1 mt-1" />
                          </div>
                          
                          <div className="text-center">
                            <div className="flex items-center justify-center mb-1">
                              <Users className="w-3 h-3 mr-1 text-blue-400" />
                              <span className="text-xs text-gray-400">Network</span>
                            </div>
                            <div className="text-sm font-bold text-blue-400">
                              {prospect.mutualConnections}
                            </div>
                            <p className="text-xs text-gray-500">mutual</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>

              {prospects.length === 0 && (
                <Card className="glass-purple border-purple-800/30 neuro">
                  <CardContent className="p-12 text-center">
                    <Target className="w-12 h-12 text-purple-600 mx-auto mb-4" />
                    <h3 className="text-white text-lg font-medium mb-2">
                      No Prospects Found
                    </h3>
                    <p className="text-gray-400 mb-4">
                      Try adjusting your search filters to find more prospects
                    </p>
                    <Button
                      onClick={handleSearch}
                      variant="outline"
                      className="border-purple-700/50 text-gray-300 hover:bg-purple-900/20"
                    >
                      <Search className="mr-2 h-4 w-4" />
                      Search Again
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}