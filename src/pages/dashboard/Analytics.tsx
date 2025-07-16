import React from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useAppStore } from '@/store/appStore';
import { useAuthStore } from '@/store/authStore';
import {
  BarChart3,
  TrendingUp,
  Users,
  MessageSquare,
  Eye,
  Heart,
  Share,
  Calendar,
  Clock,
  Target
} from 'lucide-react';

export default function Analytics() {
  const { posts, connections } = useAppStore();
  const { user } = useAuthStore();

  // Calculate analytics from real data
  const totalPosts = posts.length;
  const totalConnections = connections.filter(c => c.status === 'connected').length;
  const totalEngagement = posts.reduce((sum, post) => {
    const engagement = post.engagement as any;
    return sum + (engagement?.likes || 0) + (engagement?.comments || 0) + (engagement?.shares || 0);
  }, 0);

  const avgEngagementRate = totalPosts > 0 ? (totalEngagement / totalPosts).toFixed(1) : '0';
  const profileViews = 1247; // Mock data
  const impressions = 15680; // Mock data

  const engagementStats = [
    {
      title: 'Total Likes',
      value: posts.reduce((sum, post) => sum + ((post.engagement as any)?.likes || 0), 0),
      icon: Heart,
      color: 'text-red-400',
      change: '+12%'
    },
    {
      title: 'Total Comments',
      value: posts.reduce((sum, post) => sum + ((post.engagement as any)?.comments || 0), 0),
      icon: MessageSquare,
      color: 'text-blue-400',
      change: '+8%'
    },
    {
      title: 'Total Shares',
      value: posts.reduce((sum, post) => sum + ((post.engagement as any)?.shares || 0), 0),
      icon: Share,
      color: 'text-green-400',
      change: '+15%'
    },
    {
      title: 'Profile Views',
      value: profileViews,
      icon: Eye,
      color: 'text-purple-400',
      change: '+23%'
    }
  ];

  const topPosts = posts
    .filter(post => post.engagement && Object.keys(post.engagement).length > 0)
    .sort((a, b) => {
      const aTotal = ((a.engagement as any)?.likes || 0) + ((a.engagement as any)?.comments || 0) + ((a.engagement as any)?.shares || 0);
      const bTotal = ((b.engagement as any)?.likes || 0) + ((b.engagement as any)?.comments || 0) + ((b.engagement as any)?.shares || 0);
      return bTotal - aTotal;
    })
    .slice(0, 3);

  const recentConnections = connections
    .filter(c => c.status === 'connected')
    .sort((a, b) => new Date(b.sent_at).getTime() - new Date(a.sent_at).getTime())
    .slice(0, 5);

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
          <div>
            <h1 className="text-2xl font-bold text-white mb-2">Analytics Dashboard</h1>
            <p className="text-gray-400">
              Track your LinkedIn performance and optimize your content strategy
            </p>
          </div>
          <div className="mt-4 sm:mt-0 flex items-center space-x-2">
            <Badge className="bg-purple-600 text-white">
              <Calendar className="w-3 h-3 mr-1" />
              Last 30 days
            </Badge>
          </div>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-gray-900/50 border-gray-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm font-medium">Total Posts</p>
                  <p className="text-2xl font-bold text-white mt-1">{totalPosts}</p>
                </div>
                <BarChart3 className="w-8 h-8 text-blue-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900/50 border-gray-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm font-medium">Connections</p>
                  <p className="text-2xl font-bold text-white mt-1">{totalConnections}</p>
                </div>
                <Users className="w-8 h-8 text-green-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900/50 border-gray-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm font-medium">Avg Engagement</p>
                  <p className="text-2xl font-bold text-white mt-1">{avgEngagementRate}</p>
                </div>
                <TrendingUp className="w-8 h-8 text-purple-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900/50 border-gray-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm font-medium">Impressions</p>
                  <p className="text-2xl font-bold text-white mt-1">{impressions.toLocaleString()}</p>
                </div>
                <Eye className="w-8 h-8 text-yellow-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Engagement Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {engagementStats.map((stat, index) => (
            <Card key={index} className="bg-gray-900/50 border-gray-800">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <stat.icon className={`w-5 h-5 ${stat.color}`} />
                  <Badge className="bg-green-600/20 text-green-400 border-green-500/50 text-xs">
                    {stat.change}
                  </Badge>
                </div>
                <p className="text-gray-400 text-sm font-medium">{stat.title}</p>
                <p className="text-xl font-bold text-white mt-1">{stat.value}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Top Performing Posts */}
          <Card className="bg-gray-900/50 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <TrendingUp className="w-5 h-5 mr-2" />
                Top Performing Posts
              </CardTitle>
              <CardDescription className="text-gray-400">
                Your most engaging content this month
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {topPosts.map((post, index) => (
                <div key={post.id} className="p-4 bg-gray-800/50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <Badge className="bg-purple-600 text-white text-xs">
                      #{index + 1}
                    </Badge>
                    <span className="text-gray-400 text-xs">
                      {new Date(post.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-gray-300 text-sm line-clamp-2 mb-3">
                    {post.content}
                  </p>
                  <div className="flex items-center space-x-4 text-xs text-gray-400">
                    <span className="flex items-center">
                      <Heart className="w-3 h-3 mr-1 text-red-400" />
                      {(post.engagement as any)?.likes || 0}
                    </span>
                    <span className="flex items-center">
                      <MessageSquare className="w-3 h-3 mr-1 text-blue-400" />
                      {(post.engagement as any)?.comments || 0}
                    </span>
                    <span className="flex items-center">
                      <Share className="w-3 h-3 mr-1 text-green-400" />
                      {(post.engagement as any)?.shares || 0}
                    </span>
                  </div>
                </div>
              ))}
              {topPosts.length === 0 && (
                <div className="text-center py-8">
                  <BarChart3 className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-400">No posts with engagement data yet</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Connections */}
          <Card className="bg-gray-900/50 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Users className="w-5 h-5 mr-2" />
                Recent Connections
              </CardTitle>
              <CardDescription className="text-gray-400">
                Your latest successful connections
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentConnections.map((connection) => (
                <div key={connection.id} className="flex items-center space-x-3 p-3 bg-gray-800/50 rounded-lg">
                  <img
                    src={connection.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(connection.name)}&background=8b5cf6&color=fff`}
                    alt={connection.name}
                    className="w-10 h-10 rounded-full"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-medium truncate">
                      {connection.name}
                    </p>
                    <p className="text-gray-400 text-xs truncate">
                      {connection.title} {connection.company && `at ${connection.company}`}
                    </p>
                  </div>
                  <div className="text-right">
                    <Badge className="bg-green-600 text-white text-xs">
                      Connected
                    </Badge>
                    <p className="text-gray-400 text-xs mt-1">
                      {new Date(connection.sent_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
              {recentConnections.length === 0 && (
                <div className="text-center py-8">
                  <Users className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-400">No connections yet</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Insights & Recommendations */}
        <div className="grid lg:grid-cols-2 gap-6">
          <Card className="bg-gray-900/50 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Target className="w-5 h-5 mr-2" />
                Performance Insights
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-blue-600/20 border border-blue-500/50 rounded-lg">
                <div className="flex items-center mb-2">
                  <Clock className="w-4 h-4 text-blue-400 mr-2" />
                  <span className="text-blue-400 font-medium text-sm">Best Posting Time</span>
                </div>
                <p className="text-white font-semibold">9:00 AM</p>
                <p className="text-gray-400 text-xs mt-1">
                  Your posts get 40% more engagement at this time
                </p>
              </div>

              <div className="p-4 bg-green-600/20 border border-green-500/50 rounded-lg">
                <div className="flex items-center mb-2">
                  <Calendar className="w-4 h-4 text-green-400 mr-2" />
                  <span className="text-green-400 font-medium text-sm">Top Performing Day</span>
                </div>
                <p className="text-white font-semibold">Tuesday</p>
                <p className="text-gray-400 text-xs mt-1">
                  Schedule more posts on this day for better reach
                </p>
              </div>

              <div className="p-4 bg-purple-600/20 border border-purple-500/50 rounded-lg">
                <div className="flex items-center mb-2">
                  <TrendingUp className="w-4 h-4 text-purple-400 mr-2" />
                  <span className="text-purple-400 font-medium text-sm">Growth Trend</span>
                </div>
                <p className="text-white font-semibold">+18% this month</p>
                <p className="text-gray-400 text-xs mt-1">
                  Your engagement is trending upward
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900/50 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white">Quick Actions</CardTitle>
              <CardDescription className="text-gray-400">
                Optimize your LinkedIn strategy
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full justify-start bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                <BarChart3 className="w-4 h-4 mr-2" />
                Generate Performance Report
              </Button>
              <Button variant="outline" className="w-full justify-start border-gray-700 text-gray-300 hover:bg-gray-800">
                <Calendar className="w-4 h-4 mr-2" />
                Schedule Optimal Posts
              </Button>
              <Button variant="outline" className="w-full justify-start border-gray-700 text-gray-300 hover:bg-gray-800">
                <Target className="w-4 h-4 mr-2" />
                Find Similar Prospects
              </Button>
              <Button variant="outline" className="w-full justify-start border-gray-700 text-gray-300 hover:bg-gray-800">
                <TrendingUp className="w-4 h-4 mr-2" />
                Analyze Competitors
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}