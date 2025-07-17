import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuthStore } from '@/store/authStore';
import { Bot, Loader2, Copy, Check } from 'lucide-react';
import { toast } from 'sonner';
import { SplashCursor } from '@/components/ui/splash-cursor';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const navigate = useNavigate();
  const login = useAuthStore(state => state.login);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginForm) => {
    setIsLoading(true);
    try {
      const success = await login(data.email, data.password);
      if (success) {
        toast.success('Welcome back!');
        navigate('/dashboard');
      } else {
        toast.error('Invalid credentials. Please try the demo credentials below.');
      }
    } catch (error) {
      toast.error('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
    toast.success(`${field} copied to clipboard!`);
  };

  const fillDemoCredentials = () => {
    setValue('email', 'demo@divit.ai');
    setValue('password', 'demo123');
    toast.success('Demo credentials filled!');
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4 w-full">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-950/20 via-black to-purple-950/20" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-900/10 via-transparent to-transparent" />
      
      <motion.div 
        className="w-full max-w-md relative z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Logo */}
        <motion.div 
          className="flex items-center justify-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-purple-800 rounded-lg flex items-center justify-center shadow-xl shadow-purple-500/25">
            <Bot className="w-7 h-7 text-white" />
          </div>
          <span className="ml-3 text-2xl font-bold bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">
            DIVIT.AI
          </span>
        </motion.div>

        <Card className="bg-gradient-to-br from-gray-900/80 via-purple-950/20 to-gray-900/80 border-purple-800/30 backdrop-blur-xl shadow-2xl shadow-purple-500/10">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-white">Welcome back</CardTitle>
            <CardDescription className="text-gray-400">
              Sign in to your DIVIT.AI account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <Label htmlFor="email" className="text-gray-300">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  className="bg-gray-800/50 border-purple-800/30 text-white placeholder-gray-400 focus:border-purple-600 backdrop-blur-sm transition-all duration-300"
                  {...register('email')}
                />
                {errors.email && (
                  <p className="text-red-400 text-sm mt-1">{errors.email.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="password" className="text-gray-300">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  className="bg-gray-800/50 border-purple-800/30 text-white placeholder-gray-400 focus:border-purple-600 backdrop-blur-sm transition-all duration-300"
                  {...register('password')}
                />
                {errors.password && (
                  <p className="text-red-400 text-sm mt-1">{errors.password.message}</p>
                )}
              </div>

              <div className="flex items-center justify-between">
                <Link
                  to="/forgot-password"
                  className="text-sm text-purple-400 hover:text-purple-300 transition-colors duration-300"
                >
                  Forgot password?
                </Link>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 transition-all duration-300 transform hover:scale-105"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  'Sign in'
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-400">
                Don't have an account?{' '}
                <Link to="/signup" className="text-purple-400 hover:text-purple-300 transition-colors duration-300">
                  Sign up
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Enhanced Demo Credentials */}
        <motion.div 
          className="mt-6 p-6 bg-gradient-to-br from-purple-900/30 via-purple-800/20 to-purple-900/30 rounded-xl border border-purple-700/30 backdrop-blur-sm shadow-xl shadow-purple-500/10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-purple-300">Demo Access</h3>
            <Button
              onClick={fillDemoCredentials}
              size="sm"
              className="bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/30"
            >
              Auto Fill
            </Button>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-800/30 rounded-lg border border-purple-800/20">
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wide">Email</p>
                <p className="text-white font-mono text-sm">demo@divit.ai</p>
              </div>
              <Button
                onClick={() => copyToClipboard('demo@divit.ai', 'Email')}
                size="sm"
                variant="ghost"
                className="text-purple-400 hover:text-purple-300 hover:bg-purple-900/20"
              >
                {copiedField === 'Email' ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </Button>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-gray-800/30 rounded-lg border border-purple-800/20">
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wide">Password</p>
                <p className="text-white font-mono text-sm">demo123</p>
              </div>
              <Button
                onClick={() => copyToClipboard('demo123', 'Password')}
                size="sm"
                variant="ghost"
                className="text-purple-400 hover:text-purple-300 hover:bg-purple-900/20"
              >
                {copiedField === 'Password' ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </Button>
            </div>
          </div>
          
          <div className="mt-4 p-3 bg-blue-600/10 border border-blue-500/20 rounded-lg">
            <p className="text-blue-300 text-xs leading-relaxed">
              <strong>Demo Features:</strong> Full access to all DIVIT.AI features including AI post generation, 
              clone builder, auto commenter, connection engine, and analytics dashboard.
            </p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}