import React from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ProductRoadmap } from '@/components/ui/roadmap';
import { useAuthStore } from '@/store/authStore';
import { toast } from 'sonner';
import {
  Calendar,
  MessageSquare,
  ThumbsUp,
  ThumbsDown,
  Rocket,
  Lightbulb,
  Sparkles
} from 'lucide-react';

export default function RoadmapPage() {
  const { user } = useAuthStore();

  const handleFeatureVote = (featureId: string, voteType: 'up' | 'down') => {
    toast.success(`You ${voteType === 'up' ? 'upvoted' : 'downvoted'} this feature!`);
  };

  const handleFeatureSuggestion = () => {
    toast.success('Thank you for your suggestion! Our team will review it.');
  };

  return (
    <DashboardLayout>
      <div className="p-6 max-w-7xl">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white mb-2">Product Roadmap</h1>
          <p className="text-gray-400">
            See what's coming next and help shape the future of Chaitra
          </p>
        </div>

        {/* Introduction Card */}
        <Card className="glass-purple border-purple-800/30 neuro mb-8">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Rocket className="w-5 h-5 mr-2" />
              Our Vision for Chaitra
            </CardTitle>
            <CardDescription className="text-gray-400">
              We're building the most powerful LinkedIn automation platform to help professionals grow their presence
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-gray-300 mb-6">
              Our product roadmap is guided by our mission to help professionals save time while growing their LinkedIn presence. 
              We're constantly adding new features and improvements based on user feedback and industry trends.
            </p>
            
            <div className="flex flex-wrap gap-4">
              <Button
                onClick={() => window.open('https://feedback.chaitra.ai', '_blank')}
                className="bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900"
              >
                <Lightbulb className="mr-2 h-4 w-4" />
                Submit Feature Request
              </Button>
              
              <Button
                variant="outline"
                onClick={() => window.open('https://discord.gg/chaitra', '_blank')}
                className="border-purple-700/50 text-gray-300 hover:bg-purple-900/20"
              >
                Join Our Community
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Roadmap Timeline */}
        <ProductRoadmap />

        {/* Feature Requests */}
        <div className="mt-12">
          <h2 className="text-xl font-semibold text-white mb-6">Top Feature Requests</h2>
          
          <div className="space-y-4">
            {[
              { 
                id: 'feature-1',
                title: 'Multi-Platform Support',
                description: 'Extend Chaitra to support Twitter, Facebook, and Instagram',
                votes: 127,
                status: 'planned',
                eta: 'Q3 2025'
              },
              { 
                id: 'feature-2',
                title: 'Advanced Analytics Dashboard',
                description: 'More detailed analytics with custom reporting options',
                votes: 98,
                status: 'in-progress',
                eta: 'Q2 2025'
              },
              { 
                id: 'feature-3',
                title: 'Team Collaboration',
                description: 'Allow multiple team members to collaborate on content',
                votes: 86,
                status: 'planned',
                eta: 'Q4 2025'
              },
              { 
                id: 'feature-4',
                title: 'Content Calendar',
                description: 'Visual calendar for planning and scheduling posts',
                votes: 72,
                status: 'in-progress',
                eta: 'Q2 2025'
              },
              { 
                id: 'feature-5',
                title: 'Mobile App',
                description: 'Native mobile app for iOS and Android',
                votes: 65,
                status: 'considering',
                eta: 'TBD'
              }
            ].map((feature) => (
              <Card key={feature.id} className="bg-gray-900/50 border-gray-800">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center mb-2">
                        <h3 className="text-white font-medium">{feature.title}</h3>
                        <Badge className={`ml-3 ${
                          feature.status === 'in-progress' ? 'bg-purple-600/20 text-purple-400 border-purple-500/50' :
                          feature.status === 'planned' ? 'bg-blue-600/20 text-blue-400 border-blue-500/50' :
                          'bg-yellow-600/20 text-yellow-400 border-yellow-500/50'
                        }`}>
                          {feature.status === 'in-progress' ? 'In Progress' :
                           feature.status === 'planned' ? 'Planned' :
                           'Considering'}
                        </Badge>
                      </div>
                      <p className="text-gray-400 text-sm mb-3">{feature.description}</p>
                      
                      {feature.status !== 'considering' && (
                        <div className="flex items-center text-gray-500 text-xs">
                          <Calendar className="w-3 h-3 mr-1" />
                          Estimated: {feature.eta}
                        </div>
                      )}
                    </div>
                    
                    <div className="flex flex-col items-center space-y-2 ml-4">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleFeatureVote(feature.id, 'up')}
                        className="h-8 w-8 p-0 text-gray-400 hover:text-green-400 hover:bg-green-900/20"
                      >
                        <ThumbsUp className="h-4 w-4" />
                      </Button>
                      <span className="text-white font-medium">{feature.votes}</span>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleFeatureVote(feature.id, 'down')}
                        className="h-8 w-8 p-0 text-gray-400 hover:text-red-400 hover:bg-red-900/20"
                      >
                        <ThumbsDown className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Suggest Feature */}
        <Card className="glass-purple border-purple-800/30 neuro mt-8">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Sparkles className="w-5 h-5 mr-2" />
              Suggest a Feature
            </CardTitle>
            <CardDescription className="text-gray-400">
              Have an idea that would make Chaitra better? We'd love to hear it!
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label htmlFor="feature-title" className="block text-gray-300 mb-2">
                  Feature Title
                </label>
                <input
                  id="feature-title"
                  type="text"
                  placeholder="Enter a concise title for your feature idea"
                  className="w-full bg-gray-800/50 border-purple-800/30 text-white placeholder-gray-400 rounded-md p-2"
                />
              </div>
              
              <div>
                <label htmlFor="feature-description" className="block text-gray-300 mb-2">
                  Description
                </label>
                <textarea
                  id="feature-description"
                  placeholder="Describe your feature idea in detail. What problem does it solve?"
                  className="w-full bg-gray-800/50 border-purple-800/30 text-white placeholder-gray-400 rounded-md p-2 h-32"
                ></textarea>
              </div>
              
              <div>
                <label htmlFor="feature-use-case" className="block text-gray-300 mb-2">
                  Use Case
                </label>
                <textarea
                  id="feature-use-case"
                  placeholder="How would you use this feature? Provide a specific example."
                  className="w-full bg-gray-800/50 border-purple-800/30 text-white placeholder-gray-400 rounded-md p-2 h-20"
                ></textarea>
              </div>
              
              <Button
                onClick={handleFeatureSuggestion}
                className="bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900"
              >
                <Lightbulb className="mr-2 h-4 w-4" />
                Submit Feature Idea
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}