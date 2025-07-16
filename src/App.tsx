import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import { useAppStore } from './store/appStore';
import { Toaster } from '@/components/ui/sonner';
import ErrorBoundary from '@/components/ui/error-boundary';
import OnboardingTour from '@/components/ui/onboarding-tour';
import { ChatbotProvider } from '@/components/layout/ChatbotProvider';
import { SplashCursor } from '@/components/ui/splash-cursor';

// Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/auth/LoginPage';
import SignupPage from './pages/auth/SignupPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import Dashboard from './pages/dashboard/Dashboard';
import PostGenerator from './pages/dashboard/PostGenerator';
import CloneBuilder from './pages/dashboard/CloneBuilder';
import AutoCommenter from './pages/dashboard/AutoCommenter';
import ConnectEngine from './pages/dashboard/ConnectEngine';
import Analytics from './pages/dashboard/Analytics';
import Pricing from './pages/dashboard/Pricing';
import Settings from './pages/dashboard/Settings';
import TestingEnvironment from './pages/dashboard/TestingEnvironment';
import RoadmapPage from './pages/dashboard/RoadmapPage';

// Protected Route Component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading, user } = useAuthStore();
  const { loadUserData } = useAppStore();
  
  useEffect(() => {
    if (isAuthenticated && user && !isLoading) {
      loadUserData(user.id);
    }
  }, [isAuthenticated, user, isLoading, loadUserData]);
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="loader"></div>
      </div>
    );
  }
  
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

// Public Route Component (redirects to dashboard if authenticated)
const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuthStore();
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="loader"></div>
      </div>
    );
  }
  
  return !isAuthenticated ? <>{children}</> : <Navigate to="/dashboard" />;
};

function App() {
  const { initializeAuth, isAuthenticated } = useAuthStore();
  const { clearData } = useAppStore();
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  // Clear app data when user logs out
  useEffect(() => {
    const unsubscribe = useAuthStore.subscribe((state) => {
      if (!state.isAuthenticated) {
        clearData();
      }
    });

    return unsubscribe;
  }, [clearData]);

  // Show onboarding for new users
  useEffect(() => {
    if (isAuthenticated) {
      const hasSeenOnboarding = localStorage.getItem('divit-onboarding-completed');
      if (!hasSeenOnboarding && import.meta.env.VITE_ENABLE_ONBOARDING === 'true') {
        setShowOnboarding(true);
      }
    }
  }, [isAuthenticated]);

  const handleOnboardingComplete = () => {
    localStorage.setItem('divit-onboarding-completed', 'true');
    setShowOnboarding(false);
  };

  return (
    <ErrorBoundary showDetails={import.meta.env.DEV}>
      <Router>
        <ChatbotProvider>
          <div className="min-h-screen bg-black text-white w-full">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
              <Route path="/signup" element={<PublicRoute><SignupPage /></PublicRoute>} />
              <Route path="/forgot-password" element={<PublicRoute><ForgotPasswordPage /></PublicRoute>} />
              
              {/* Protected Routes */}
              <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/post-generator" element={<ProtectedRoute><PostGenerator /></ProtectedRoute>} />
              <Route path="/clone-builder" element={<ProtectedRoute><CloneBuilder /></ProtectedRoute>} />
              <Route path="/auto-commenter" element={<ProtectedRoute><AutoCommenter /></ProtectedRoute>} />
              <Route path="/connect-engine" element={<ProtectedRoute><ConnectEngine /></ProtectedRoute>} />
              <Route path="/analytics" element={<ProtectedRoute><Analytics /></ProtectedRoute>} />
              <Route path="/testing-environment" element={<ProtectedRoute><TestingEnvironment /></ProtectedRoute>} />
              <Route path="/pricing" element={<ProtectedRoute><Pricing /></ProtectedRoute>} />
              <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
              <Route path="/roadmap" element={<ProtectedRoute><RoadmapPage /></ProtectedRoute>} />
            </Routes>
            
            <Toaster theme="dark" />
            
            {/* Onboarding Tour */}
            <OnboardingTour
              isOpen={showOnboarding}
              onClose={() => setShowOnboarding(false)}
              onComplete={handleOnboardingComplete}
            />
          </div>
        </ChatbotProvider>
      </Router>
    </ErrorBoundary>
  );
}

export default App;