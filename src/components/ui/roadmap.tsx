import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { GlowingEffect } from '@/components/ui/glowing-effect';
import {
  Calendar,
  Check,
  Clock,
  Code,
  Cog,
  Globe,
  Layers,
  Rocket,
  Smartphone,
  Sparkles,
  Users,
  Zap
} from 'lucide-react';

interface TimelineItem {
  title: string;
  description: string;
  date: string;
  status: 'completed' | 'in-progress' | 'planned';
  icon: React.ElementType;
  features?: string[];
}

const timelineItems: TimelineItem[] = [
  {
    title: 'Q1 2025 - Foundation',
    description: 'Core platform features and AI integration',
    date: 'January - March 2025',
    status: 'completed',
    icon: Layers,
    features: [
      'AI Post Generator with humanization',
      'Basic LinkedIn automation',
      'User authentication and profiles',
      'Credits system implementation'
    ]
  },
  {
    title: 'Q2 2025 - Growth',
    description: 'Enhanced engagement and analytics',
    date: 'April - June 2025',
    status: 'in-progress',
    icon: Zap,
    features: [
      'Advanced analytics dashboard',
      'Content calendar and scheduling',
      'AI Clone builder improvements',
      'Connection engine enhancements'
    ]
  },
  {
    title: 'Q3 2025 - Expansion',
    description: 'Multi-platform support and team features',
    date: 'July - September 2025',
    status: 'planned',
    icon: Globe,
    features: [
      'Twitter/X integration',
      'Facebook and Instagram support',
      'Team collaboration features',
      'Advanced content templates'
    ]
  },
  {
    title: 'Q4 2025 - Enterprise',
    description: 'Enterprise features and advanced customization',
    date: 'October - December 2025',
    status: 'planned',
    icon: Cog,
    features: [
      'Enterprise SSO integration',
      'Advanced permissions and roles',
      'Custom branding options',
      'Advanced reporting and exports'
    ]
  },
  {
    title: '2026 - Innovation',
    description: 'Next-generation features and expansion',
    date: '2026',
    status: 'planned',
    icon: Sparkles,
    features: [
      'Mobile apps for iOS and Android',
      'AI-powered content strategy recommendations',
      'Advanced audience targeting',
      'Integration marketplace'
    ]
  }
];

export function ProductRoadmap() {
  return (
    <div className="relative">
      {/* Vertical line */}
      <div className="absolute left-[15px] md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-purple-600 via-purple-400 to-purple-800 transform md:-translate-x-1/2" />
      
      <div className="space-y-12">
        {timelineItems.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            viewport={{ once: true }}
            className={`relative flex flex-col md:flex-row ${index % 2 === 0 ? 'md:flex-row-reverse' : ''}`}
          >
            {/* Center icon */}
            <div className="absolute left-0 md:left-1/2 transform md:-translate-x-1/2 flex items-center justify-center z-10">
              <GlowingEffect intensity="high">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  item.status === 'completed' ? 'bg-green-600' :
                  item.status === 'in-progress' ? 'bg-purple-600' :
                  'bg-blue-600'
                }`}>
                  {item.status === 'completed' ? (
                    <Check className="w-4 h-4 text-white" />
                  ) : (
                    <Clock className="w-4 h-4 text-white" />
                  )}
                </div>
              </GlowingEffect>
            </div>
            
            {/* Content */}
            <div className={`ml-12 md:ml-0 md:w-1/2 ${index % 2 === 0 ? 'md:pr-12' : 'md:pl-12'}`}>
              <GlowingEffect intensity="medium">
                <Card className={`glass-purple border-purple-800/30 neuro ${
                  item.status === 'completed' ? 'bg-green-900/10' :
                  item.status === 'in-progress' ? 'bg-purple-900/10' :
                  'bg-blue-900/10'
                }`}>
                  <CardContent className="p-6">
                    <div className="flex items-center mb-4">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center mr-4 ${
                        item.status === 'completed' ? 'bg-green-600' :
                        item.status === 'in-progress' ? 'bg-purple-600' :
                        'bg-blue-600'
                      }`}>
                        <item.icon className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="text-white font-semibold text-lg">{item.title}</h3>
                        <div className="flex items-center mt-1">
                          <Calendar className="w-3 h-3 text-gray-400 mr-1" />
                          <span className="text-gray-400 text-xs">{item.date}</span>
                          <Badge className={`ml-2 text-xs ${
                            item.status === 'completed' ? 'bg-green-600/20 text-green-400 border-green-500/50' :
                            item.status === 'in-progress' ? 'bg-purple-600/20 text-purple-400 border-purple-500/50' :
                            'bg-blue-600/20 text-blue-400 border-blue-500/50'
                          }`}>
                            {item.status === 'completed' ? 'Completed' :
                             item.status === 'in-progress' ? 'In Progress' :
                             'Planned'}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    
                    <p className="text-gray-300 mb-4">{item.description}</p>
                    
                    {item.features && (
                      <ul className="space-y-2">
                        {item.features.map((feature, featureIndex) => (
                          <li key={featureIndex} className="flex items-start">
                            <div className={`w-4 h-4 rounded-full flex-shrink-0 mt-1 mr-2 ${
                              item.status === 'completed' ? 'bg-green-600' :
                              item.status === 'in-progress' ? 'bg-purple-600' :
                              'bg-blue-600'
                            }`} />
                            <span className="text-gray-300 text-sm">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </CardContent>
                </Card>
              </GlowingEffect>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export function RoadmapTimeline() {
  return (
    <div className="space-y-8">
      {timelineItems.map((item, index) => (
        <div key={index} className="relative pl-10">
          {/* Vertical line */}
          {index < timelineItems.length - 1 && (
            <div className="absolute left-4 top-8 bottom-0 w-0.5 bg-gradient-to-b from-purple-600 to-purple-800" />
          )}
          
          {/* Icon */}
          <div className="absolute left-0 top-0 w-8 h-8 rounded-full bg-gradient-to-r from-purple-600 to-purple-800 flex items-center justify-center">
            <item.icon className="w-4 h-4 text-white" />
          </div>
          
          <div>
            <div className="flex items-center mb-2">
              <h3 className="text-white font-semibold">{item.title}</h3>
              <Badge className={`ml-2 ${
                item.status === 'completed' ? 'bg-green-600' :
                item.status === 'in-progress' ? 'bg-purple-600' :
                'bg-blue-600'
              } text-white`}>
                {item.status === 'completed' ? 'Completed' :
                 item.status === 'in-progress' ? 'In Progress' :
                 'Planned'}
              </Badge>
            </div>
            <p className="text-gray-400 text-sm mb-2">{item.date}</p>
            <p className="text-gray-300">{item.description}</p>
            
            {item.features && (
              <ul className="mt-2 space-y-1">
                {item.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="text-gray-400 text-sm flex items-center">
                    <Check className="w-3 h-3 text-purple-400 mr-2" />
                    {feature}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

export function FeatureRoadmap() {
  const features = [
    {
      title: 'Multi-Platform Support',
      description: 'Extend Chaitra to support Twitter, Facebook, and Instagram',
      status: 'planned',
      eta: 'Q3 2025',
      icon: Globe
    },
    {
      title: 'Advanced Analytics Dashboard',
      description: 'More detailed analytics with custom reporting options',
      status: 'in-progress',
      eta: 'Q2 2025',
      icon: Rocket
    },
    {
      title: 'Team Collaboration',
      description: 'Allow multiple team members to collaborate on content',
      status: 'planned',
      eta: 'Q4 2025',
      icon: Users
    },
    {
      title: 'Content Calendar',
      description: 'Visual calendar for planning and scheduling posts',
      status: 'in-progress',
      eta: 'Q2 2025',
      icon: Calendar
    },
    {
      title: 'Mobile App',
      description: 'Native mobile app for iOS and Android',
      status: 'planned',
      eta: '2026',
      icon: Smartphone
    },
    {
      title: 'API Access',
      description: 'Public API for custom integrations',
      status: 'planned',
      eta: 'Q4 2025',
      icon: Code
    }
  ];

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {features.map((feature, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: index * 0.1 }}
          viewport={{ once: true }}
        >
          <Card className={`bg-gray-900/50 border-gray-800 ${
            feature.status === 'in-progress' ? 'border-l-4 border-l-purple-600' : ''
          }`}>
            <CardContent className="p-6">
              <div className="flex items-center mb-4">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center mr-4 ${
                  feature.status === 'completed' ? 'bg-green-600' :
                  feature.status === 'in-progress' ? 'bg-purple-600' :
                  'bg-blue-600'
                }`}>
                  <feature.icon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-semibold">{feature.title}</h3>
                  <div className="flex items-center mt-1">
                    <Calendar className="w-3 h-3 text-gray-400 mr-1" />
                    <span className="text-gray-400 text-xs">{feature.eta}</span>
                    <Badge className={`ml-2 text-xs ${
                      feature.status === 'completed' ? 'bg-green-600/20 text-green-400 border-green-500/50' :
                      feature.status === 'in-progress' ? 'bg-purple-600/20 text-purple-400 border-purple-500/50' :
                      'bg-blue-600/20 text-blue-400 border-blue-500/50'
                    }`}>
                      {feature.status === 'completed' ? 'Completed' :
                       feature.status === 'in-progress' ? 'In Progress' :
                       'Planned'}
                    </Badge>
                  </div>
                </div>
              </div>
              
              <p className="text-gray-300 text-sm">{feature.description}</p>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}