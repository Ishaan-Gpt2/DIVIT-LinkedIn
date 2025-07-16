import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Video, MessageSquare, Users, Bot, Play } from 'lucide-react';

export function TavusSection() {
  return (
    <section className="py-24 w-full hero-section">
      <div className="w-full px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <Badge className="mb-6 bg-purple-600/20 text-purple-400 border-purple-500/50 backdrop-blur-sm">
            <Video className="w-4 h-4 mr-1" />
            AI Video Support
          </Badge>
          
          <h2 className="text-3xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent font-['Satoshi-Black']">
            Meet Your AI Video Assistant
          </h2>
          <p className="text-xl text-gray-300 font-['Satoshi-Medium'] max-w-3xl mx-auto">
            Get personalized support from our AI video agent who can answer your questions, 
            demonstrate features, and guide you through DIVIT.AI
          </p>
        </motion.div>
        
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Video Demo */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="aspect-video bg-gradient-to-br from-purple-900/30 to-black rounded-2xl overflow-hidden border border-purple-800/30 shadow-2xl shadow-purple-500/10">
              <video 
                className="w-full h-full object-cover"
                poster="https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                controls
              >
                <source src="https://assets.mixkit.co/videos/preview/mixkit-business-woman-giving-a-presentation-in-an-office-42918-large.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
              
              <div className="absolute inset-0 flex items-center justify-center">
                <Button 
                  size="lg" 
                  className="rounded-full w-16 h-16 bg-purple-600/80 hover:bg-purple-700 text-white shadow-lg"
                  onClick={(e) => {
                    e.currentTarget.parentElement?.querySelector('video')?.play();
                    e.currentTarget.style.display = 'none';
                  }}
                >
                  <Play className="h-8 w-8" />
                </Button>
              </div>
            </div>
            
            <div className="absolute -bottom-6 -right-6 bg-gradient-to-br from-purple-600 to-purple-800 rounded-2xl p-4 shadow-xl">
              <div className="flex items-center space-x-2">
                <Bot className="h-6 w-6 text-white" />
                <span className="text-white font-medium">AI-Powered Responses</span>
              </div>
            </div>
          </motion.div>
          
          {/* Features */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <h3 className="text-2xl font-bold text-white">Interactive Video Support</h3>
            <p className="text-gray-300 leading-relaxed">
              Our AI video agent combines the power of conversational AI with personalized video responses, 
              creating an engaging support experience that feels like talking to a real person.
            </p>
            
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: MessageSquare, title: "Natural Conversations", desc: "Chat naturally with our AI that understands context and nuance" },
                { icon: Video, title: "Video Responses", desc: "Get personalized video explanations for complex questions" },
                { icon: Users, title: "24/7 Availability", desc: "Get help anytime, day or night, without waiting" },
                { icon: Bot, title: "Personalized Help", desc: "Assistance tailored to your specific needs and questions" }
              ].map((feature, index) => (
                <Card key={index} className="bg-gray-900/50 border-purple-800/30 hover:border-purple-500/50 transition-all duration-300">
                  <CardContent className="p-4">
                    <feature.icon className="h-6 w-6 text-purple-400 mb-2" />
                    <h4 className="text-white font-medium text-sm">{feature.title}</h4>
                    <p className="text-gray-400 text-xs mt-1">{feature.desc}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <Button 
              className="bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 text-white shadow-lg shadow-purple-500/25"
              onClick={() => {
                // Dispatch custom event to open chatbot
                window.dispatchEvent(new CustomEvent('chatbot:ask', { 
                  detail: { message: "Can you show me a demo of DIVIT.AI features?" } 
                }));
              }}
            >
              <MessageSquare className="mr-2 h-4 w-4" />
              Chat with AI Assistant
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}