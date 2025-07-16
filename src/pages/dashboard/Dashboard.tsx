import React from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuthStore } from '@/store/authStore';
import { useAppStore } from '@/store/appStore';
import {
  FileText,
  Users,
  MessageSquare,
  Link2,
  BarChart3,
  Zap,
  TrendingUp,
  Calendar,
  Target
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const { user } = useAuthStore();
  const { posts, connections } = useAppStore();

  const stats = [
    {
      title: 'Posts Generated',
      value: posts.length,
      icon: FileText,
      color: 'text-purple-400'
    },
    {
      title: 'Connections',
      value: connections.filter(c => c.status === 'connected').length,
      icon: Users,
      color: 'text-purple-500'
    },
    {
      title: 'Engagement Rate',
      value: '12.4%',
      icon: TrendingUp,
      color: 'text-purple-600'
    },
    {
      title: 'Credits Used',
      value: user?.plan === 'free' ? 5 - (user?.credits || 0) : 'Unlimited',
      icon: Zap,
      color: 'text-purple-700'
    }
  ];

  const quickActions = [
    {
      title: 'Generate Post',
      description: 'Create AI-powered LinkedIn posts',
      icon: FileText,
      href: '/post-generator',
      color: 'bg-purple-600'
    },
    {
      title: 'Build Clone',
      description: 'Create your AI writing persona',
      icon: Users,
      href: '/clone-builder',
      color: 'bg-purple-700'
    },
    {
      title: 'Auto Comment',
      description: 'Engage with relevant posts',
      icon: MessageSquare,
      href: '/auto-commenter',
      color: 'bg-purple-800'
    },
    {
      title: 'Find Connections',
      description: 'Connect with prospects',
      icon: Link2,
      href: '/connect-engine',
      color: 'bg-purple-900'
    }
  ];

  const recentPosts = posts.slice(0, 3);
  const recentConnections = connections.slice(0, 3);

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6 w-full">
        {/* Welcome Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center w-full">
          <div>
            <h1 className="text-2xl font-bold text-white">
              Welcome back, {user?.name}!
            </h1>
            <p className="text-gray-400 mt-1">
              Here's what's happening with your LinkedIn automation
            </p>
          </div>
          <div className="mt-4 sm:mt-0">
            <Badge className={`${user?.plan === 'free' ? 'bg-gray-600' : 'bg-purple-600'} text-white`}>
              {user?.plan?.toUpperCase()} Plan
            </Badge>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
          {stats.map((stat, index) => (
            <Card key={index} className="glass-purple border-purple-800/30 neuro hover:shadow-xl hover:shadow-purple-500/20 transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm font-medium">{stat.title}</p>
                    <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
                  </div>
                  <stat.icon className={`w-8 h-8 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="w-full">
          <h2 className="text-xl font-semibold text-white mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
            {quickActions.map((action, index) => (
              <Link key={index} to={action.href} className="w-full">
                <Card className="glass-purple border-purple-800/30 hover:border-purple-500/50 transition-all duration-300 cursor-pointer neuro hover:shadow-xl hover:shadow-purple-500/20 transform hover:scale-105 h-full">
                  <CardContent className="p-6">
                    <div className={`w-12 h-12 ${action.color} rounded-lg flex items-center justify-center mb-4 shadow-lg shadow-purple-500/25`}>
                      <action.icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-white font-semibold mb-2">{action.title}</h3>
                    <p className="text-gray-400 text-sm">{action.description}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="grid lg:grid-cols-2 gap-6 w-full">
          {/* Recent Posts */}
          <Card className="glass-purple border-purple-800/30 neuro">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <FileText className="w-5 h-5 mr-2" />
                Recent Posts
              </CardTitle>
              <CardDescription className="text-gray-400">
                Your latest generated content
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentPosts.map((post) => (
                <div key={post.id} className="p-4 glass-purple rounded-lg neuro-inset">
                  <div className="flex items-center justify-between mb-2">
                    <Badge className={`${post.status === 'posted' ? 'bg-purple-600' : 'bg-purple-700'} text-white text-xs`}>
                      {post.status}
                    </Badge>
                    <span className="text-gray-400 text-xs">
                      {new Date(post.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-gray-300 text-sm line-clamp-2">
                    {post.content}
                  </p>
                  {post.engagement && Object.keys(post.engagement).length > 0 && (
                    <div className="flex items-center space-x-4 mt-3 text-xs text-gray-400">
                      <span>{(post.engagement as any).likes || 0} likes</span>
                      <span>{(post.engagement as any).comments || 0} comments</span>
                      <span>{(post.engagement as any).shares || 0} shares</span>
                    </div>
                  )}
                </div>
              ))}
              {recentPosts.length === 0 && (
                <div className="text-center py-8">
                  <FileText className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-400">No posts generated yet</p>
                </div>
              )}
              <Link to="/post-generator" className="w-full">
                <Button variant="outline" className="w-full border-purple-700/50 text-gray-300 hover:bg-purple-900/20 glass-purple">
                  Generate New Post
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Recent Connections */}
          <Card className="glass-purple border-purple-800/30 neuro">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Users className="w-5 h-5 mr-2" />
                Recent Connections
              </CardTitle>
              <CardDescription className="text-gray-400">
                Your latest networking activity
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentConnections.map((connection) => (
                <div key={connection.id} className="flex items-center space-x-3 p-3 glass-purple rounded-lg neuro-inset">
                  <img
                    src={connection.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(connection.name)}&background=8b5cf6&color=fff`}
                    alt={connection.name}
                    className="w-10 h-10 rounded-full ring-2 ring-purple-500/30"
                    loading="lazy"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-medium truncate">
                      {connection.name}
                    </p>
                    <p className="text-gray-400 text-xs truncate">
                      {connection.title} {connection.company && `at ${connection.company}`}
                    </p>
                  </div>
                  <Badge className={`${connection.status === 'connected' ? 'bg-purple-600' : 'bg-purple-700'} text-white text-xs`}>
                    {connection.status}
                  </Badge>
                </div>
              ))}
              {recentConnections.length === 0 && (
                <div className="text-center py-8">
                  <Users className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-400">No connections yet</p>
                </div>
              )}
              <Link to="/connect-engine" className="w-full">
                <Button variant="outline" className="w-full border-purple-700/50 text-gray-300 hover:bg-purple-900/20 glass-purple">
                  Find More Connections
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}