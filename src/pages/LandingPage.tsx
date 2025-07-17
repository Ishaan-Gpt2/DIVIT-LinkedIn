import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Spotlight } from '@/components/ui/spotlight';
import { GlowingEffect } from '@/components/ui/glowing-effect';
import { SplineScene } from '@/components/ui/splite';
import { BackgroundPaths } from '@/components/ui/background-paths';
import { SplashCursor } from '@/components/ui/splash-cursor';
import {
  EnhancedFeatures,
  EnhancedPricing,
  EnhancedTestimonials,
  EnhancedCta,
  EnhancedStats
} from '@/components/ui/enhanced-features';
import {
  Bot,
  Zap,
  Users,
  MessageSquare,
  Link2,
  BarChart3,
  Star,
  Check,
  ArrowRight,
  Play,
  Sparkles,
  Brain,
  Target,
  Shield,
  Rocket,
  TrendingUp,
  Globe,
  Clock,
  Calendar
} from 'lucide-react';

const features = [
  {
    icon: Zap,
    title: 'AI Post Generation',
    description: 'Create engaging LinkedIn posts in seconds with AI that understands your voice and industry trends',
    gradient: 'from-purple-500 to-purple-700'
  },
  {
    icon: Users,
    title: 'Clone Builder',
    description: 'Build AI clones that replicate your writing style and personality perfectly for authentic content',
    gradient: 'from-purple-600 to-purple-800'
  },
  {
    icon: MessageSquare,
    title: 'Auto Commenter',
    description: 'Automatically engage with relevant posts using intelligent, contextual comments that drive connections',
    gradient: 'from-purple-700 to-purple-900'
  },
  {
    icon: Link2,
    title: 'Connection Engine',
    description: 'Find and connect with your ideal prospects using advanced targeting filters and AI-powered outreach',
    gradient: 'from-purple-500 to-purple-800'
  },
  {
    icon: BarChart3,
    title: 'Analytics Dashboard',
    description: 'Track performance, optimize content, and measure your LinkedIn growth with detailed insights',
    gradient: 'from-purple-600 to-purple-900'
  },
  {
    icon: Bot,
    title: 'Human-like AI',
    description: 'Our AI humanizer ensures your content passes all AI detection tools while maintaining authenticity',
    gradient: 'from-purple-800 to-purple-950'
  }
];

const testimonials = [
  {
    name: 'Sarah Chen',
    role: 'Marketing Director',
    company: 'TechCorp',
    avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
    content: 'DIVIT.AI helped me grow my LinkedIn following by 300% in just 2 months. The AI clone feature is incredible - it writes exactly like me!',
    rating: 5
  },
  {
    name: 'Michael Rodriguez',
    role: 'Sales Manager',
    company: 'Growth Co',
    avatar: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
    content: 'As a busy sales executive, I never had time to maintain a consistent LinkedIn presence. DIVIT.AI changed everything. The connection engine helped me find perfect prospects, and the automated engagement keeps my network growing even when I\'m focused on closing deals.',
    rating: 5
  },
  {
    name: 'Emma Thompson',
    role: 'Entrepreneur',
    company: 'Startup Inc',
    avatar: 'https://images.pexels.com/photos/762020/pexels-photo-762020.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
    content: 'The ROI on DIVIT.AI is incredible. I\'ve generated over $50K in new business directly from LinkedIn connections made through the platform. The AI-written posts consistently outperform my manually written content, saving me hours each week.',
    rating: 5
  }
];

const plans = [
  {
    name: 'Free',
    price: '$0',
    period: 'forever',
    description: '5 credits/month',
    features: ['Basic post generation', 'Limited connections (10/month)', 'Basic analytics', 'Email support'],
    popular: false,
    buttonText: 'Start Free',
    buttonVariant: 'outline'
  },
  {
    name: 'Creator',
    price: '$29',
    period: 'month',
    description: '100 credits/month',
    features: ['Advanced AI posts', 'Unlimited connections', 'Clone builder', 'Auto commenter', 'Full analytics', 'Priority support'],
    popular: true,
    buttonText: 'Get Started',
    buttonVariant: 'default'
  },
  {
    name: 'Ghostwriter',
    price: '$79',
    period: 'month',
    description: 'Unlimited credits',
    features: ['Everything in Creator', 'Advanced humanizer', 'Custom clones', 'White-label options', 'API access', 'Dedicated support'],
    popular: false,
    buttonText: 'Upgrade',
    buttonVariant: 'default'
  },
  {
    name: 'Agency',
    price: '$199',
    period: 'month',
    description: 'Unlimited credits',
    features: ['Everything in Ghostwriter', 'Multi-account management', 'Team collaboration', 'Advanced reporting', 'Custom integrations', 'Account manager'],
    popular: false,
    buttonText: 'Contact Sales',
    buttonVariant: 'default'
  }
];

const enhancedFeatures = [
  {
    title: 'AI-Powered Content Generation',
    description: 'Create engaging, human-like LinkedIn posts that reflect your unique voice and style using advanced AI models',
    icon: Brain,
    color: 'bg-gradient-to-r from-purple-600 to-purple-800'
  },
  {
    title: 'Personalized AI Clones',
    description: 'Build custom AI clones that learn your writing style, tone, and personality for truly authentic content',
    icon: Bot,
    color: 'bg-gradient-to-r from-purple-700 to-purple-900'
  },
  {
    title: 'Intelligent Engagement',
    description: 'Automatically engage with relevant content using smart comments that drive meaningful connections',
    icon: MessageSquare,
    color: 'bg-gradient-to-r from-purple-600 to-purple-800'
  },
  {
    title: 'Advanced Analytics',
    description: 'Track performance metrics, engagement rates, and growth trends with comprehensive analytics',
    icon: BarChart3,
    color: 'bg-gradient-to-r from-purple-600 to-purple-800'
  },
  {
    title: 'Smart Connection Engine',
    description: 'Find and connect with ideal prospects using AI-powered targeting and personalized outreach',
    icon: Users,
    color: 'bg-gradient-to-r from-purple-600 to-purple-800'
  },
  {
    title: 'AI Humanization',
    description: 'Ensure your content passes all AI detection tools while maintaining your authentic voice',
    icon: Shield,
    color: 'bg-gradient-to-r from-purple-600 to-purple-800'
  },
  {
    title: 'Multi-Platform Support',
    description: 'Expand your reach beyond LinkedIn to Twitter, Facebook, and Instagram with unified content strategy',
    icon: Globe,
    color: 'bg-gradient-to-r from-purple-600 to-purple-800',
    comingSoon: true
  },
  {
    title: 'Team Collaboration',
    description: 'Collaborate with team members on content creation, approval workflows, and performance tracking',
    icon: Users,
    color: 'bg-gradient-to-r from-purple-600 to-purple-800',
    comingSoon: true
  }
];

const stats = [
  {
    value: '10,000+',
    label: 'Active Users',
    icon: Users,
    color: 'bg-gradient-to-r from-purple-600 to-purple-800'
  },
  {
    value: '1.5M+',
    label: 'Posts Generated',
    icon: MessageSquare,
    color: 'bg-gradient-to-r from-purple-600 to-purple-800'
  },
  {
    value: '85%',
    label: 'Avg. Engagement Increase',
    icon: TrendingUp,
    color: 'bg-gradient-to-r from-purple-600 to-purple-800'
  },
  {
    value: '95%',
    label: 'Customer Satisfaction',
    icon: Star,
    color: 'bg-gradient-to-r from-purple-600 to-purple-800'
  }
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-black text-white w-full overflow-x-hidden font-['Satoshi']">
      {/* Splash Cursor Effect */}
      <SplashCursor 
        BACK_COLOR={{ r: 0.3, g: 0, b: 0.5 }}
        COLOR_UPDATE_SPEED={5}
        SPLAT_RADIUS={0.3}
        SPLAT_FORCE={8000}
      />
      
      {/* Transparent Glassy Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 p-4">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl px-6 py-3 shadow-2xl shadow-purple-500/5">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <GlowingEffect intensity="high">
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-purple-800 rounded-lg flex items-center justify-center">
                    <Bot className="w-6 h-6 text-white" />
                  </div>
                </GlowingEffect>
                <span className="ml-2 text-xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent font-['Satoshi-Black']">
                  DIVIT.AI
                </span>
              </div>
              <div className="flex items-center space-x-4">
                <Link to="/login">
                  <Button variant="ghost" className="text-white/80 hover:text-white hover:bg-white/10 transition-all duration-300 backdrop-blur-sm">
                    Login
                  </Button>
                </Link>
                <Link to="/signup">
                  <GlowingEffect intensity="high">
                    <Button className="bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 text-white transition-all duration-300 shadow-lg shadow-purple-500/25 backdrop-blur-sm">
                      Start Free Trial
                    </Button>
                  </GlowingEffect>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Enhanced Hero Section with Spline */}
      <section className="relative overflow-hidden w-full min-h-screen flex items-center pt-20">
        {/* Background Paths Effect */}
        <div className="absolute inset-0 pointer-events-none">
          <BackgroundPaths />
        </div>
        
        <Spotlight className="-top-40 left-0 md:left-60 md:-top-20" fill="purple" />
        <div className="absolute inset-0 bg-gradient-to-br from-purple-950/20 via-black to-purple-950/20" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-900/10 via-transparent to-transparent" />
        
        <div className="relative w-full px-4 sm:px-6 lg:px-8 py-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center max-w-7xl mx-auto">
            <motion.div 
              className="text-left pl-0"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <Badge className="mb-6 bg-purple-600/20 text-purple-400 border-purple-500/50 backdrop-blur-sm">
                <Sparkles className="w-4 h-4 mr-1" />
                Fully Autonomous LinkedIn Growth
              </Badge>
              
              <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight font-['Satoshi-Black']">
                <span className="bg-clip-text text-transparent bg-gradient-to-b from-white via-purple-100 to-purple-300">
                  Your Digital
                </span>
                <br />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-purple-500 to-purple-600">
                  AI Twin
                </span>
              </h1>
              
              <p className="text-xl text-gray-300 mb-8 leading-relaxed max-w-2xl font-['Satoshi-Medium']">
                <span className="text-purple-400 font-semibold">Powered by You.</span> 
                <span className="text-white font-semibold"> Multiplied by AI.</span>
                <br />
                Create a perfect digital replica that writes, comments, and connects 
                exactly like you—while you focus on what matters most.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-start mb-12">
                <Link to="/signup">
                  <GlowingEffect intensity="high">
                    <Button size="lg" className="bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 px-8 py-4 text-lg transition-all duration-300 transform hover:scale-105 shadow-xl shadow-purple-500/25 font-['Satoshi-Bold']">
                      Start Free Trial
                      <ArrowRight className="ml-2 w-5 h-5" />
                    </Button>
                  </GlowingEffect>
                </Link>
                <Button size="lg" variant="outline" className="border-purple-700/50 text-gray-300 hover:bg-purple-900/20 hover:border-purple-600 backdrop-blur-sm transition-all duration-300 px-8 py-4 text-lg font-['Satoshi-Medium']">
                  <Play className="mr-2 w-5 h-5" />
                  Watch Demo
                </Button>
              </div>

              {/* Trust Indicators */}
              <div className="flex flex-wrap items-center gap-6 text-sm text-gray-400 font-['Satoshi']">
                <div className="flex items-center">
                  <Shield className="w-4 h-4 mr-2 text-purple-400" />
                  100% Safe & Compliant
                </div>
                <div className="flex items-center">
                  <Users className="w-4 h-4 mr-2 text-purple-400" />
                  10,000+ Active Users
                </div>
                <div className="flex items-center">
                  <Star className="w-4 h-4 mr-2 text-purple-400 fill-current" />
                  4.9/5 Rating
                </div>
              </div>
            </motion.div>
            
            {/* Spline 3D Model */}
            <motion.div 
              className="relative h-[500px] lg:h-[700px] flex items-center justify-center"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="w-full h-full relative">
                <SplineScene 
                  scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
                  className="w-full h-full"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Enhanced Stats Section */}
      <EnhancedStats 
        title="Trusted by Thousands of Professionals"
        description="Join the growing community of professionals who are transforming their LinkedIn presence"
        stats={stats}
      />

      {/* Enhanced Features Section */}
      <EnhancedFeatures
        title="Enterprise-Grade Features"
        description="Powerful tools designed to maximize your LinkedIn presence and drive meaningful engagement"
        features={enhancedFeatures}
      />

      {/* How It Works */}
      <section className="py-24 bg-gradient-to-b from-purple-950/10 to-transparent w-full">
        <div className="w-full px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent font-['Satoshi-Black']">How DIVIT.AI Works</h2>
            <p className="text-xl text-gray-300 font-['Satoshi-Medium']">
              Three simple steps to automate your LinkedIn presence
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: Users, title: "1. Clone", desc: "Upload your best posts and let our AI learn your unique writing style, tone, and personality.", gradient: "from-purple-600 to-purple-800" },
              { icon: Zap, title: "2. Generate", desc: "Generate unlimited LinkedIn posts that sound exactly like you, optimized for maximum engagement.", gradient: "from-purple-600 to-purple-800" },
              { icon: BarChart3, title: "3. Automate", desc: "Set it and forget it. DIVIT.AI will post, comment, and connect on autopilot while you focus on your business.", gradient: "from-purple-600 to-purple-800" }
            ].map((step, index) => (
              <motion.div 
                key={index} 
                className="text-center group"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
              >
                <GlowingEffect intensity="high">
                  <Card className="bg-black/50 border border-purple-500/30 shadow-xl shadow-purple-500/10 hover:shadow-purple-500/20 transition-all duration-300 overflow-hidden group-hover:border-purple-500/50">
                    <CardContent className="p-8">
                      <div className={`w-20 h-20 bg-gradient-to-r ${step.gradient} rounded-full flex items-center justify-center mx-auto mb-6 transition-all duration-300 shadow-xl shadow-purple-500/25`}>
                        <step.icon className="w-10 h-10 text-white" />
                      </div>
                      <h3 className="text-xl font-semibold mb-4 text-white font-['Satoshi-Bold']">{step.title}</h3>
                      <p className="text-gray-300 leading-relaxed font-['Satoshi']">
                        {step.desc}
                      </p>
                    </CardContent>
                  </Card>
                </GlowingEffect>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Testimonials */}
      <EnhancedTestimonials
        title="What Our Users Say"
        description="Hear from professionals who have transformed their LinkedIn presence with DIVIT.AI"
        testimonials={[
          {
            content: "DIVIT.AI has completely transformed my LinkedIn strategy. I've seen a 300% increase in engagement and have connected with high-quality leads that converted into clients. The AI clone writes exactly like me - my audience can't tell the difference!",
            author: "Sarah Chen",
            role: "Marketing Director",
            company: "TechCorp",
            avatar: "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2",
            rating: 5
          },
          {
            content: "As a busy sales executive, I never had time to maintain a consistent LinkedIn presence. DIVIT.AI changed everything. The connection engine helped me find perfect prospects, and the automated engagement keeps my network growing even when I'm focused on closing deals.",
            author: "Michael Rodriguez",
            role: "Sales Manager",
            company: "Growth Co",
            avatar: "https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2",
            rating: 5
          },
          {
            content: "The ROI on DIVIT.AI is incredible. I've generated over $50K in new business directly from LinkedIn connections made through the platform. The AI-written posts consistently outperform my manually written content, saving me hours each week.",
            author: "Emma Thompson",
            role: "Entrepreneur",
            company: "Startup Inc",
            avatar: "https://images.pexels.com/photos/762020/pexels-photo-762020.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2",
            rating: 5
          }
        ]}
      />

      {/* Enhanced Pricing */}
      <EnhancedPricing
        title="Simple, Transparent Pricing"
        description="Choose the plan that fits your LinkedIn growth goals"
        plans={[
          {
            name: "Free",
            price: "$0",
            period: "forever",
            description: "5 credits/month",
            features: [
              "Basic post generation",
              "Limited connections (10/month)",
              "Basic analytics",
              "Email support"
            ],
            buttonText: "Start Free",
            buttonVariant: "outline"
          },
          {
            name: "Creator",
            price: "$29",
            period: "month",
            description: "100 credits/month",
            features: [
              "Advanced AI posts",
              "Unlimited connections",
              "Clone builder",
              "Auto commenter",
              "Full analytics",
              "Priority support"
            ],
            popular: true,
            buttonText: "Get Started"
          },
          {
            name: "Ghostwriter",
            price: "$79",
            period: "month",
            description: "Unlimited credits",
            features: [
              "Everything in Creator",
              "Advanced humanizer",
              "Custom clones",
              "White-label options",
              "API access",
              "Dedicated support"
            ],
            buttonText: "Upgrade"
          },
          {
            name: "Agency",
            price: "$199",
            period: "month",
            description: "Unlimited credits",
            features: [
              "Everything in Ghostwriter",
              "Multi-account management",
              "Team collaboration",
              "Advanced reporting",
              "Custom integrations",
              "Account manager"
            ],
            buttonText: "Contact Sales"
          }
        ]}
      />

      {/* Enhanced CTA */}
      <EnhancedCta
        title="Ready to Transform Your LinkedIn Presence?"
        description="Join thousands of professionals who are growing their network and influence with DIVIT.AI's AI-powered automation."
        primaryButtonText="Start Free Trial"
        secondaryButtonText="Schedule Demo"
      />

      {/* Newsletter */}
      <section className="py-24 bg-gradient-to-b from-purple-950/10 to-transparent w-full">
        <div className="w-full px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
          <motion.div 
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent font-['Satoshi-Black']">Stay Updated</h2>
            <p className="text-xl text-gray-300 mb-8 font-['Satoshi-Medium']">
              Get the latest LinkedIn growth tips and DIVIT.AI updates delivered to your inbox
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <Input 
                type="email" 
                placeholder="Enter your email" 
                className="bg-gray-900/50 border-purple-800/30 text-white placeholder-gray-400 focus:border-purple-600 transition-all duration-300 backdrop-blur-sm"
              />
              <GlowingEffect intensity="high">
                <Button className="bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 transition-all duration-300 font-['Satoshi-Bold']">
                  Subscribe
                </Button>
              </GlowingEffect>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-purple-800/30 py-12 w-full bg-gradient-to-b from-transparent to-purple-950/10">
        <div className="w-full px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="col-span-2">
              <div className="flex items-center mb-4">
                <GlowingEffect intensity="medium">
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-purple-800 rounded-lg flex items-center justify-center">
                    <Bot className="w-6 h-6 text-white" />
                  </div>
                </GlowingEffect>
                <span className="ml-2 text-xl font-bold bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent font-['Satoshi-Black']">
                  DIVIT.AI
                </span>
              </div>
              <p className="text-gray-400 mb-4 leading-relaxed font-['Satoshi']">
                Fully Autonomous LinkedIn Growth. Powered by You. Multiplied by AI.
              </p>
            </div>
            
            <div>
              <h3 className="text-white font-semibold mb-4 font-['Satoshi-Bold']">Product</h3>
              <ul className="space-y-2 text-gray-400 font-['Satoshi']">
                <li><Link to="/" className="hover:text-purple-400 transition-colors duration-300">Features</Link></li>
                <li><Link to="/" className="hover:text-purple-400 transition-colors duration-300">Pricing</Link></li>
                <li><Link to="/" className="hover:text-purple-400 transition-colors duration-300">Demo</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-white font-semibold mb-4 font-['Satoshi-Bold']">Company</h3>
              <ul className="space-y-2 text-gray-400 font-['Satoshi']">
                <li><Link to="/" className="hover:text-purple-400 transition-colors duration-300">About</Link></li>
                <li><Link to="/" className="hover:text-purple-400 transition-colors duration-300">Blog</Link></li>
                <li><Link to="/" className="hover:text-purple-400 transition-colors duration-300">Contact</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-purple-800/30 mt-8 pt-8 text-center text-gray-400 font-['Satoshi']">
            <p>&copy; 2025 DIVIT.AI. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}