import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { GlowingEffect } from '@/components/ui/glowing-effect';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, Check, Crown, Zap } from 'lucide-react';

interface EnhancedFeaturesProps {
  title: string;
  description: string;
  features: Array<{
    title: string;
    description: string;
    icon: React.ElementType;
    color: string;
    comingSoon?: boolean;
  }>;
}

export function EnhancedFeatures({ title, description, features }: EnhancedFeaturesProps) {
  return (
    <section className="py-24 w-full">
      <div className="w-full px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent font-['Satoshi-Black']">{title}</h2>
          <p className="text-xl text-gray-300 font-['Satoshi-Medium']">
            {description}
          </p>
        </motion.div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="h-full"
            >
              <GlowingEffect intensity="medium">
                <Card className="bg-black/50 border border-purple-500/30 shadow-xl shadow-purple-500/10 hover:shadow-purple-500/20 transition-all duration-300 h-full">
                  <CardContent className="p-6 flex flex-col h-full">
                    <div className={`w-12 h-12 ${feature.color} rounded-lg flex items-center justify-center mb-4 shadow-lg shadow-purple-500/25`}>
                      <feature.icon className="w-6 h-6 text-white" />
                    </div>
                    
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-semibold text-white font-['Satoshi-Bold']">{feature.title}</h3>
                      {feature.comingSoon && (
                        <Badge className="bg-blue-600/20 text-blue-400 border-blue-500/50">
                          Coming Soon
                        </Badge>
                      )}
                    </div>
                    
                    <p className="text-gray-300 text-sm leading-relaxed mb-4 flex-grow font-['Satoshi']">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </GlowingEffect>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

interface EnhancedPricingProps {
  title: string;
  description: string;
  plans: Array<{
    name: string;
    price: string;
    period: string;
    description: string;
    features: string[];
    popular?: boolean;
    buttonText: string;
    buttonVariant?: 'default' | 'outline';
  }>;
}

export function EnhancedPricing({ title, description, plans }: EnhancedPricingProps) {
  return (
    <section className="py-24 bg-gradient-to-b from-purple-950/10 to-transparent w-full">
      <div className="w-full px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent font-['Satoshi-Black']">{title}</h2>
          <p className="text-xl text-gray-300 font-['Satoshi-Medium']">
            {description}
          </p>
        </motion.div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {plans.map((plan, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="relative"
            >
              <GlowingEffect intensity={plan.popular ? "high" : "low"}>
                <Card className={`bg-black/50 border ${plan.popular ? 'border-purple-500/50' : 'border-purple-500/30'} shadow-xl ${plan.popular ? 'shadow-purple-500/20' : 'shadow-purple-500/10'} transition-all duration-300 h-full`}>
                  {plan.popular && (
                    <div className="absolute -top-4 left-0 right-0 flex justify-center">
                      <Badge className="bg-gradient-to-r from-purple-600 to-purple-800 text-white px-4 py-1 shadow-lg shadow-purple-500/25">
                        <Crown className="w-3 h-3 mr-1" />
                        Most Popular
                      </Badge>
                    </div>
                  )}
                  
                  <CardContent className="p-6 pt-8">
                    <div className="text-center mb-6">
                      <h3 className="text-xl font-bold text-white mb-2 font-['Satoshi-Bold']">{plan.name}</h3>
                      <div className="flex items-center justify-center">
                        <span className="text-3xl font-bold text-white font-['Satoshi-Black']">{plan.price}</span>
                        <span className="text-gray-400 ml-1">/{plan.period}</span>
                      </div>
                      <p className="text-purple-400 text-sm mt-1 font-['Satoshi-Medium']">{plan.description}</p>
                    </div>
                    
                    <div className="space-y-3 mb-6">
                      {plan.features.map((feature, idx) => (
                        <div key={idx} className="flex items-start">
                          <div className="flex-shrink-0 mt-1">
                            <Check className="w-4 h-4 text-green-400" />
                          </div>
                          <p className="ml-3 text-gray-300 text-sm font-['Satoshi']">{feature}</p>
                        </div>
                      ))}
                    </div>
                    
                    <Link to="/signup" className="block w-full">
                      <Button 
                        className={`w-full ${plan.buttonVariant === 'outline' 
                          ? 'border-purple-700/50 text-gray-300 hover:bg-purple-900/20 hover:border-purple-600' 
                          : 'bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 shadow-lg shadow-purple-500/25'}`}
                      >
                        {plan.buttonText}
                        <ArrowRight className="ml-2 w-4 h-4" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </GlowingEffect>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

interface EnhancedTestimonialsProps {
  title: string;
  description: string;
  testimonials: Array<{
    content: string;
    author: string;
    role: string;
    company: string;
    avatar: string;
    rating: number;
  }>;
}

export function EnhancedTestimonials({ title, description, testimonials }: EnhancedTestimonialsProps) {
  return (
    <section className="py-24 w-full">
      <div className="w-full px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent font-['Satoshi-Black']">{title}</h2>
          <p className="text-xl text-gray-300 font-['Satoshi-Medium']">
            {description}
          </p>
        </motion.div>
        
        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <GlowingEffect intensity="medium">
                <Card className="bg-black/50 border border-purple-500/30 shadow-xl shadow-purple-500/10 hover:shadow-purple-500/20 transition-all duration-300 h-full">
                  <CardContent className="p-6">
                    <div className="flex items-center mb-4">
                      <div className="flex space-x-1">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                        ))}
                      </div>
                    </div>
                    
                    <p className="text-gray-300 text-sm leading-relaxed mb-6 font-['Satoshi'] italic">
                      "{testimonial.content}"
                    </p>
                    
                    <div className="flex items-center">
                      <img 
                        src={testimonial.avatar} 
                        alt={testimonial.author} 
                        className="w-12 h-12 rounded-full object-cover mr-4 ring-2 ring-purple-500/30"
                      />
                      <div>
                        <h4 className="text-white font-medium font-['Satoshi-Bold']">{testimonial.author}</h4>
                        <p className="text-gray-400 text-sm font-['Satoshi']">{testimonial.role}, {testimonial.company}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </GlowingEffect>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

interface EnhancedCtaProps {
  title: string;
  description: string;
  primaryButtonText: string;
  secondaryButtonText: string;
}

export function EnhancedCta({ title, description, primaryButtonText, secondaryButtonText }: EnhancedCtaProps) {
  return (
    <section className="py-24 w-full">
      <div className="w-full px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <GlowingEffect intensity="high">
            <Card className="bg-gradient-to-br from-purple-900/30 via-purple-800/20 to-purple-900/30 border border-purple-500/30 shadow-2xl shadow-purple-500/20 overflow-hidden">
              <CardContent className="p-12 text-center">
                <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white font-['Satoshi-Black']">{title}</h2>
                <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto font-['Satoshi-Medium']">
                  {description}
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link to="/signup">
                    <Button size="lg" className="bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 px-8 py-6 text-lg transition-all duration-300 transform hover:scale-105 shadow-xl shadow-purple-500/25 font-['Satoshi-Bold']">
                      {primaryButtonText}
                      <ArrowRight className="ml-2 w-5 h-5" />
                    </Button>
                  </Link>
                  <Button size="lg" variant="outline" className="border-purple-700/50 text-gray-300 hover:bg-purple-900/20 hover:border-purple-600 px-8 py-6 text-lg font-['Satoshi-Medium']">
                    {secondaryButtonText}
                  </Button>
                </div>
                
                <div className="mt-8 flex items-center justify-center space-x-6 text-sm text-gray-400 font-['Satoshi']">
                  <div className="flex items-center">
                    <Zap className="w-4 h-4 mr-2 text-purple-400" />
                    No credit card required
                  </div>
                  <div className="flex items-center">
                    <Check className="w-4 h-4 mr-2 text-purple-400" />
                    Free 5 credits to start
                  </div>
                </div>
              </CardContent>
            </Card>
          </GlowingEffect>
        </motion.div>
      </div>
    </section>
  );
}

interface EnhancedStatsProps {
  title: string;
  description: string;
  stats: Array<{
    value: string;
    label: string;
    icon: React.ElementType;
    color: string;
  }>;
}

export function EnhancedStats({ title, description, stats }: EnhancedStatsProps) {
  return (
    <section className="py-24 bg-gradient-to-b from-transparent to-purple-950/10 w-full">
      <div className="w-full px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent font-['Satoshi-Black']">{title}</h2>
          <p className="text-xl text-gray-300 font-['Satoshi-Medium']">
            {description}
          </p>
        </motion.div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <GlowingEffect intensity="medium">
                <Card className="bg-black/50 border border-purple-500/30 shadow-xl shadow-purple-500/10 hover:shadow-purple-500/20 transition-all duration-300">
                  <CardContent className="p-6 text-center">
                    <div className={`w-16 h-16 ${stat.color} rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-purple-500/25`}>
                      <stat.icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-3xl font-bold text-white mb-2 font-['Satoshi-Black']">{stat.value}</h3>
                    <p className="text-gray-400 font-['Satoshi-Medium']">{stat.label}</p>
                  </CardContent>
                </Card>
              </GlowingEffect>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}