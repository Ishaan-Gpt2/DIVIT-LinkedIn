import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://xnylrvasulkxwbjzzzpd.supabase.co';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 60000, // 60 second timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for auth tokens
api.interceptors.request.use(
  (config) => {
    // Get auth token from localStorage
    const token = localStorage.getItem('supabase.auth.token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Add timestamp for tracking
    config.metadata = { startTime: Date.now() };
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  async (response) => {
    return response;
  },
  async (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// Tavus Chat API
export interface TavusChatRequest {
  userMessage: string;
}

export interface TavusChatResponse {
  success: boolean;
  response: string;
  videoUrl?: string;
  fallbackResponse?: string;
}

export const sendTavusMessage = async (data: TavusChatRequest): Promise<TavusChatResponse> => {
  try {
    // In a real implementation, this would call your Supabase Edge Function
    // For demo purposes, we'll simulate the response
    const response = await simulateTavusResponse(data.userMessage);
    return response;
  } catch (error) {
    console.error('Tavus chat error:', error);
    throw error;
  }
};

// Simulate Tavus API response for demo purposes
const simulateTavusResponse = async (userMessage: string): Promise<TavusChatResponse> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // For demo purposes, return predefined responses based on keywords
  const lowerCaseMessage = userMessage.toLowerCase();
  
  if (lowerCaseMessage.includes('pricing') || lowerCaseMessage.includes('cost') || lowerCaseMessage.includes('plan')) {
    return {
      success: true,
      response: "We offer several pricing plans to fit your needs. Our Free plan includes 5 credits/month, while our Creator plan at $29/month includes 100 credits and all core features. For unlimited usage, check out our Ghostwriter plan at $79/month or Agency plan at $199/month.",
      videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-business-woman-giving-a-presentation-in-an-office-42918-large.mp4"
    };
  } else if (lowerCaseMessage.includes('demo') || lowerCaseMessage.includes('try') || lowerCaseMessage.includes('test')) {
    return {
      success: true,
      response: "I'd be happy to show you a demo of DIVIT.AI! Our platform offers AI-powered LinkedIn automation with features like post generation, clone building, auto commenting, and connection engine. Would you like me to walk you through a specific feature?",
      videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-man-working-on-his-laptop-308-large.mp4"
    };
  } else if (lowerCaseMessage.includes('feature') || lowerCaseMessage.includes('what') || lowerCaseMessage.includes('how')) {
    return {
      success: true,
      response: "DIVIT.AI offers several powerful features: AI Post Generation creates engaging LinkedIn content, Clone Builder replicates your writing style, Auto Commenter engages with relevant posts, and Connection Engine helps you find and connect with ideal prospects. Which feature would you like to learn more about?",
    };
  } else {
    return {
      success: true,
      response: "Thanks for reaching out! I'm here to help with any questions about DIVIT.AI. Our platform helps you automate your LinkedIn presence with AI-powered tools. Is there something specific you'd like to know about our features, pricing, or how to get started?",
    };
  }
};

// LinkedIn Post Processing
export interface ProcessLinkedInPostRequest {
  userPrompt: string;
  userEmail: string;
  linkedinProfileUrl?: string;
  enableAutomation?: boolean;
}

export interface ProcessLinkedInPostResponse {
  success: boolean;
  finalPost: string;
  aiScore: number;
  humanScore: number;
  wasSentToEmail: boolean;
  phantomTriggered: boolean;
  scrapedProfileData?: any;
  processingSteps: {
    profileScraping: boolean;
    aiGeneration: boolean;
    humanization: boolean;
    grammarCheck: boolean;
    aiDetection: boolean;
    emailDelivery: boolean;
    automation: boolean;
  };
  metadata: {
    originalPrompt: string;
    enrichedPrompt: boolean;
    grammarCorrections: number;
    processingTime: number;
  };
}

export const processLinkedInPost = async (
  data: ProcessLinkedInPostRequest,
  userId?: string
): Promise<ProcessLinkedInPostResponse> => {
  try {
    const response = await api.post('/process-linkedin-post', {
      ...data,
      userId
    });
    return response.data.data;
  } catch (error) {
    console.error('LinkedIn post processing error:', error);
    throw error;
  }
};

// Content Upload
export interface UploadContentRequest {
  fileUrl: string;
  description: string;
  platforms: string[];
  userId: string;
}

export interface UploadContentResponse {
  success: boolean;
  uploadId: string;
  platforms: string[];
  fileUrl: string;
  description: string;
  userId: string;
  status: string;
  platformResults: Record<string, any>;
  service: string;
  uploadedAt: string;
}

export const uploadContent = async (
  data: UploadContentRequest,
  userId?: string
): Promise<UploadContentResponse> => {
  try {
    const response = await api.post('/upload-content', {
      ...data,
      userId: userId || data.userId
    });
    return response.data.data;
  } catch (error) {
    console.error('Content upload error:', error);
    throw error;
  }
};

// Profile Scraping
export interface ScrapeProfileRequest {
  profileUrl: string;
}

export interface ScrapeProfileResponse {
  fullName: string;
  headline: string;
  about: string;
  location: string;
  industry: string;
  connections: number;
  experience: any[];
  education: any[];
  skills: string[];
}

export const scrapeProfile = async (
  data: ScrapeProfileRequest,
  userId?: string
): Promise<ScrapeProfileResponse> => {
  try {
    const response = await api.post('/scrape-profile', {
      ...data,
      userId
    });
    return response.data;
  } catch (error) {
    console.error('Profile scraping error:', error);
    throw error;
  }
};

// AI Content Generation
export interface GenerateContentRequest {
  prompt: string;
  tone?: string;
  style?: string;
}

export interface GenerateContentResponse {
  content: string;
  model: string;
  tokens: number;
  tone: string;
  style: string;
}

export const generateContent = async (
  data: GenerateContentRequest,
  userId?: string
): Promise<GenerateContentResponse> => {
  try {
    const response = await api.post('/generate-content', {
      ...data,
      userId
    });
    return response.data;
  } catch (error) {
    console.error('Content generation error:', error);
    throw error;
  }
};

// Health Check
export const healthCheck = async (): Promise<{ status: string; message: string }> => {
  try {
    const response = await api.get('/health');
    return response.data;
  } catch (error) {
    console.error('Health check error:', error);
    throw error;
  }
};

// API Status Check
export const getApiStatus = async (): Promise<any> => {
  try {
    const response = await api.get('/status');
    return response.data;
  } catch (error) {
    console.error('API status check error:', error);
    throw error;
  }
};

// API Key Testing
export interface TestApiKeyRequest {
  service: string;
  apiKey: string;
  userId?: string;
  [key: string]: any;
}

export interface TestApiKeyResponse {
  service: string;
  valid: boolean;
  saved: boolean;
  data?: any;
  message: string;
}

export const testApiKey = async (data: TestApiKeyRequest): Promise<TestApiKeyResponse> => {
  try {
    const response = await api.post('/test-api-key', data);
    return response.data;
  } catch (error) {
    console.error('API key test error:', error);
    throw error;
  }
};

// Validate All Keys
export interface ValidateAllKeysRequest {
  userId: string;
  keys: Record<string, any>;
}

export interface ValidateAllKeysResponse {
  success: boolean;
  verified: string[];
  failed: Array<{ service: string; error: string; suggestion?: string }>;
  results: any[];
  storedInSupabase: boolean;
}

export const validateAllKeys = async (data: ValidateAllKeysRequest): Promise<ValidateAllKeysResponse> => {
  try {
    const response = await api.post('/validate-all-keys', data);
    return response.data;
  } catch (error) {
    console.error('Validate all keys error:', error);
    throw error;
  }
};

// User Authentication
export interface AuthRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: {
    id: string;
    email: string;
    name?: string;
  };
  session: {
    access_token: string;
    refresh_token: string;
  };
}

export const login = async (data: AuthRequest): Promise<AuthResponse> => {
  try {
    const response = await api.post('/auth/login', data);
    return response.data;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

export const signup = async (data: AuthRequest & { name: string }): Promise<AuthResponse> => {
  try {
    const response = await api.post('/auth/signup', data);
    return response.data;
  } catch (error) {
    console.error('Signup error:', error);
    throw error;
  }
};

export const logout = async (): Promise<void> => {
  try {
    await api.post('/auth/logout');
  } catch (error) {
    console.error('Logout error:', error);
    throw error;
  }
};

// User Profile
export interface UserProfile {
  id: string;
  email: string;
  name: string;
  plan: string;
  credits: number;
  avatar_url?: string;
  linkedin_profile_url?: string;
  bio?: string;
  timezone?: string;
  created_at: string;
  updated_at: string;
}

export const getUserProfile = async (userId: string): Promise<UserProfile> => {
  try {
    const response = await api.get(`/user/profile/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Get user profile error:', error);
    throw error;
  }
};

export const updateUserProfile = async (userId: string, data: Partial<UserProfile>): Promise<UserProfile> => {
  try {
    const response = await api.put(`/user/profile/${userId}`, data);
    return response.data;
  } catch (error) {
    console.error('Update user profile error:', error);
    throw error;
  }
};

// Credit Management
export interface CreditResponse {
  credits: number;
  plan: string;
  unlimited: boolean;
}

export const getUserCredits = async (userId: string): Promise<CreditResponse> => {
  try {
    const response = await api.get(`/credits/get?userId=${userId}`);
    return response.data.data;
  } catch (error) {
    console.error('Get credits error:', error);
    throw error;
  }
};

export const useCredits = async (userId: string, amount: number): Promise<boolean> => {
  try {
    const response = await api.post('/credits/use', { userId, amount });
    return response.data.status === 'success';
  } catch (error) {
    console.error('Use credits error:', error);
    return false;
  }
};

export default api;