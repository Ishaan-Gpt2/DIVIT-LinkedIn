import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://xnylrvasulkxwbjzzzpd.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhueWxydmFzdWxreHdianp6enBkIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODk3NTI2MDcsImV4cCI6MjAwNTMyODYwN30.ZPiUEMGBFWjWjHyWYQQl-g1CuX9GwD1ZqXZCRQ4dXoE'

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})

// Database types
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          name: string
          plan: 'free' | 'creator' | 'ghostwriter' | 'agency'
          credits: number
          avatar_url: string | null
          linkedin_profile_url: string | null
          bio: string | null
          timezone: string
          created_at: string
          updated_at: string
          username: string | null
          full_name: string | null
        }
        Insert: {
          id: string
          email: string
          name: string
          plan?: 'free' | 'creator' | 'ghostwriter' | 'agency'
          credits?: number
          avatar_url?: string | null
          linkedin_profile_url?: string | null
          bio?: string | null
          timezone?: string
          username?: string | null
          full_name?: string | null
        }
        Update: {
          email?: string
          name?: string
          plan?: 'free' | 'creator' | 'ghostwriter' | 'agency'
          credits?: number
          avatar_url?: string | null
          linkedin_profile_url?: string | null
          bio?: string | null
          timezone?: string
          updated_at?: string
          username?: string | null
          full_name?: string | null
        }
      }
      ai_clones: {
        Row: {
          id: string
          user_id: string
          name: string
          description: string | null
          tone: string
          personality: string[]
          sample_posts: string[]
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          user_id: string
          name: string
          description?: string | null
          tone: string
          personality?: string[]
          sample_posts?: string[]
          is_active?: boolean
        }
        Update: {
          name?: string
          description?: string | null
          tone?: string
          personality?: string[]
          sample_posts?: string[]
          is_active?: boolean
          updated_at?: string
        }
      }
      linkedin_posts: {
        Row: {
          id: string
          user_id: string
          clone_id: string | null
          content: string
          tone: string | null
          status: 'draft' | 'scheduled' | 'posted' | 'failed'
          scheduled_for: string | null
          posted_at: string | null
          engagement: Record<string, any>
          ai_score: number | null
          human_score: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          user_id: string
          clone_id?: string | null
          content: string
          tone?: string | null
          status?: 'draft' | 'scheduled' | 'posted' | 'failed'
          scheduled_for?: string | null
          posted_at?: string | null
          engagement?: Record<string, any>
          ai_score?: number | null
          human_score?: number | null
        }
        Update: {
          clone_id?: string | null
          content?: string
          tone?: string | null
          status?: 'draft' | 'scheduled' | 'posted' | 'failed'
          scheduled_for?: string | null
          posted_at?: string | null
          engagement?: Record<string, any>
          ai_score?: number | null
          human_score?: number | null
          updated_at?: string
        }
      }
      connections: {
        Row: {
          id: string
          user_id: string
          name: string
          title: string | null
          company: string | null
          industry: string | null
          country: string | null
          avatar_url: string | null
          linkedin_url: string | null
          email: string | null
          phone: string | null
          status: 'pending' | 'connected' | 'declined'
          match_score: number | null
          response_rate: number | null
          mutual_connections: number
          notes: string | null
          sent_at: string
          connected_at: string | null
          created_at: string
        }
        Insert: {
          user_id: string
          name: string
          title?: string | null
          company?: string | null
          industry?: string | null
          country?: string | null
          avatar_url?: string | null
          linkedin_url?: string | null
          email?: string | null
          phone?: string | null
          status?: 'pending' | 'connected' | 'declined'
          match_score?: number | null
          response_rate?: number | null
          mutual_connections?: number
          notes?: string | null
          sent_at?: string
          connected_at?: string | null
        }
        Update: {
          name?: string
          title?: string | null
          company?: string | null
          industry?: string | null
          country?: string | null
          avatar_url?: string | null
          linkedin_url?: string | null
          email?: string | null
          phone?: string | null
          status?: 'pending' | 'connected' | 'declined'
          match_score?: number | null
          response_rate?: number | null
          mutual_connections?: number
          notes?: string | null
          connected_at?: string | null
        }
      }
      automation_runs: {
        Row: {
          id: string
          user_id: string
          type: 'post_generation' | 'auto_comment' | 'connection_search' | 'profile_scraping'
          status: 'running' | 'completed' | 'failed'
          input_data: Record<string, any>
          output_data: Record<string, any>
          credits_used: number
          error_message: string | null
          started_at: string
          completed_at: string | null
        }
        Insert: {
          user_id: string
          type: 'post_generation' | 'auto_comment' | 'connection_search' | 'profile_scraping'
          status?: 'running' | 'completed' | 'failed'
          input_data?: Record<string, any>
          output_data?: Record<string, any>
          credits_used?: number
          error_message?: string | null
          started_at?: string
          completed_at?: string | null
        }
        Update: {
          status?: 'running' | 'completed' | 'failed'
          output_data?: Record<string, any>
          credits_used?: number
          error_message?: string | null
          completed_at?: string | null
        }
      }
      user_settings: {
        Row: {
          id: string
          user_id: string
          notifications: Record<string, any>
          privacy: Record<string, any>
          automation: Record<string, any>
          api_keys: Record<string, any>
          created_at: string
          updated_at: string
        }
        Insert: {
          user_id: string
          notifications?: Record<string, any>
          privacy?: Record<string, any>
          automation?: Record<string, any>
          api_keys?: Record<string, any>
        }
        Update: {
          notifications?: Record<string, any>
          privacy?: Record<string, any>
          automation?: Record<string, any>
          api_keys?: Record<string, any>
          updated_at?: string
        }
      }
      verified_api_keys: {
        Row: {
          id: string
          user_id: string
          service: string
          api_key: string
          status: 'verified' | 'expired' | 'invalid'
          tested_at: string
          extra_params: Record<string, any>
          created_at: string
          updated_at: string
        }
        Insert: {
          user_id: string
          service: string
          api_key: string
          status?: 'verified' | 'expired' | 'invalid'
          tested_at?: string
          extra_params?: Record<string, any>
        }
        Update: {
          service?: string
          api_key?: string
          status?: 'verified' | 'expired' | 'invalid'
          tested_at?: string
          extra_params?: Record<string, any>
          updated_at?: string
        }
      }
      api_usage: {
        Row: {
          id: string
          user_id: string
          service: string
          endpoint: string | null
          credits_used: number
          success: boolean
          response_time_ms: number | null
          created_at: string
        }
        Insert: {
          user_id: string
          service: string
          endpoint?: string | null
          credits_used?: number
          success?: boolean
          response_time_ms?: number | null
        }
        Update: {
          service?: string
          endpoint?: string | null
          credits_used?: number
          success?: boolean
          response_time_ms?: number | null
        }
      }
    }
  }
}

// Mock data for demo mode
const mockData = {
  profiles: [],
  ai_clones: [],
  linkedin_posts: [],
  connections: [],
  user_settings: []
};

// Demo credentials
const DEMO_EMAIL = 'demo@divit.ai';
const DEMO_PASSWORD = 'demo123';

// Auth helper functions
export const signUp = async (email: string, password: string, metadata?: any) => {
  // Check for demo credentials first
  if (email === DEMO_EMAIL && password === DEMO_PASSWORD) {
    return { 
      data: { 
        user: { 
          id: 'demo-user-id', 
          email: DEMO_EMAIL, 
          user_metadata: metadata || {}
        } 
      }, 
      error: null 
    };
  }

  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata
      }
    });
    return { data, error };
  } catch (error) {
    console.error('Signup error:', error);
    return { 
      data: null, 
      error: error 
    };
  }
};

export const signIn = async (email: string, password: string) => {
  // Check for demo credentials first
  if (email === DEMO_EMAIL && password === DEMO_PASSWORD) {
    return { 
      data: { 
        user: { 
          id: 'demo-user-id', 
          email: DEMO_EMAIL 
        } 
      }, 
      error: null 
    };
  }

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    return { data, error };
  } catch (error) {
    console.error('Sign in error:', error);
    return { 
      data: null, 
      error: error 
    };
  }
};

export const signOut = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    return { error };
  } catch (error) {
    console.error('Sign out error:', error);
    return { error: null };
  }
};

export const getCurrentUser = async () => {
  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    return { user, error };
  } catch (error) {
    console.error('Get current user error:', error);
    // Return mock data for demo mode
    return { 
      user: { 
        id: 'demo-user-id', 
        email: 'demo@divit.ai' 
      }, 
      error: null 
    };
  }
};

export const resetPassword = async (email: string) => {
  try {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`
    });
    return { data, error };
  } catch (error) {
    console.error('Reset password error:', error);
    return { data: {}, error: null };
  }
};

// Database helper functions
export const getProfile = async (userId: string) => {
  try {
    // For demo user, return mock data
    if (userId === 'demo-user-id') {
      return { 
        data: {
          id: 'demo-user-id',
          email: 'demo@divit.ai',
          name: 'Demo User',
          plan: 'creator',
          credits: 100,
          avatar_url: null,
          linkedin_profile_url: null,
          bio: null,
          timezone: 'UTC',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          username: null,
          full_name: null
        }, 
        error: null 
      };
    }
    
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    return { data, error };
  } catch (error) {
    console.error('Get profile error:', error);
    // Return mock data for demo mode
    return { 
      data: {
        id: userId,
        email: 'demo@divit.ai',
        name: 'Demo User',
        plan: 'creator',
        credits: 100,
        avatar_url: null,
        linkedin_profile_url: null,
        bio: null,
        timezone: 'UTC',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        username: null,
        full_name: null
      }, 
      error: null 
    };
  }
};

export const updateProfile = async (userId: string, updates: Database['public']['Tables']['profiles']['Update']) => {
  try {
    // For demo user, return mock data
    if (userId === 'demo-user-id') {
      return { 
        data: {
          id: 'demo-user-id',
          email: 'demo@divit.ai',
          name: 'Demo User',
          ...updates,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }, 
        error: null 
      };
    }
    
    const { data, error } = await supabase
      .from('profiles')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', userId)
      .select()
      .single();
    return { data, error };
  } catch (error) {
    console.error('Update profile error:', error);
    // Return mock data for demo mode
    return { 
      data: {
        id: userId,
        email: 'demo@divit.ai',
        name: 'Demo User',
        ...updates,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }, 
      error: null 
    };
  }
};

export const getUserClones = async (userId: string) => {
  try {
    // For demo user, return mock data
    if (userId === 'demo-user-id') {
      return { 
        data: [
          {
            id: 'demo-clone-1',
            user_id: 'demo-user-id',
            name: 'Professional Clone',
            description: 'A professional writing style for LinkedIn',
            tone: 'Professional and engaging',
            personality: ['Knowledgeable', 'Helpful', 'Industry-focused'],
            sample_posts: ['Sample professional post for testing'],
            is_active: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          },
          {
            id: 'demo-clone-2',
            user_id: 'demo-user-id',
            name: 'Casual Clone',
            description: 'A more casual and conversational style',
            tone: 'Casual and friendly',
            personality: ['Approachable', 'Conversational', 'Relatable'],
            sample_posts: ['Sample casual post for testing'],
            is_active: false,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
        ], 
        error: null 
      };
    }
    
    const { data, error } = await supabase
      .from('ai_clones')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    return { data, error };
  } catch (error) {
    console.error('Get user clones error:', error);
    // Return mock data for demo mode
    return { 
      data: [
        {
          id: 'demo-clone-1',
          user_id: userId,
          name: 'Professional Clone',
          description: 'A professional writing style for LinkedIn',
          tone: 'Professional and engaging',
          personality: ['Knowledgeable', 'Helpful', 'Industry-focused'],
          sample_posts: ['Sample professional post for testing'],
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ], 
      error: null 
    };
  }
};

export const createClone = async (cloneData: Database['public']['Tables']['ai_clones']['Insert']) => {
  try {
    // For demo user, return mock data
    if (cloneData.user_id === 'demo-user-id') {
      return { 
        data: {
          id: `demo-clone-${Date.now()}`,
          ...cloneData,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }, 
        error: null 
      };
    }
    
    const { data, error } = await supabase
      .from('ai_clones')
      .insert(cloneData)
      .select()
      .single();
    return { data, error };
  } catch (error) {
    console.error('Create clone error:', error);
    // Return mock data for demo mode
    return { 
      data: {
        id: `demo-clone-${Date.now()}`,
        ...cloneData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }, 
      error: null 
    };
  }
};

export const getUserPosts = async (userId: string) => {
  try {
    // For demo user, return mock data
    if (userId === 'demo-user-id') {
      return { 
        data: [
          {
            id: 'demo-post-1',
            user_id: 'demo-user-id',
            clone_id: 'demo-clone-1',
            content: 'This is a sample LinkedIn post generated by the AI clone.',
            tone: 'professional',
            status: 'posted',
            scheduled_for: null,
            posted_at: new Date().toISOString(),
            engagement: { likes: 45, comments: 12, shares: 5 },
            ai_score: 15,
            human_score: 85,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          },
          {
            id: 'demo-post-2',
            user_id: 'demo-user-id',
            clone_id: 'demo-clone-1',
            content: 'Another sample LinkedIn post for demonstration purposes.',
            tone: 'conversational',
            status: 'draft',
            scheduled_for: null,
            posted_at: null,
            engagement: {},
            ai_score: 20,
            human_score: 80,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
        ], 
        error: null 
      };
    }
    
    const { data, error } = await supabase
      .from('linkedin_posts')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    return { data, error };
  } catch (error) {
    console.error('Get user posts error:', error);
    // Return mock data for demo mode
    return { 
      data: [
        {
          id: 'demo-post-1',
          user_id: userId,
          clone_id: null,
          content: 'This is a sample LinkedIn post generated by the AI clone.',
          tone: 'professional',
          status: 'posted',
          scheduled_for: null,
          posted_at: new Date().toISOString(),
          engagement: { likes: 45, comments: 12, shares: 5 },
          ai_score: 15,
          human_score: 85,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ], 
      error: null 
    };
  }
};

export const createPost = async (postData: Database['public']['Tables']['linkedin_posts']['Insert']) => {
  try {
    // For demo user, return mock data
    if (postData.user_id === 'demo-user-id') {
      return { 
        data: {
          id: `demo-post-${Date.now()}`,
          ...postData,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }, 
        error: null 
      };
    }
    
    const { data, error } = await supabase
      .from('linkedin_posts')
      .insert(postData)
      .select()
      .single();
    return { data, error };
  } catch (error) {
    console.error('Create post error:', error);
    // Return mock data for demo mode
    return { 
      data: {
        id: `demo-post-${Date.now()}`,
        ...postData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }, 
      error: null 
    };
  }
};

export const getUserConnections = async (userId: string) => {
  try {
    // For demo user, return mock data
    if (userId === 'demo-user-id') {
      return { 
        data: [
          {
            id: 'demo-connection-1',
            user_id: 'demo-user-id',
            name: 'John Demo',
            title: 'Senior Developer',
            company: 'Tech Corp',
            industry: 'Technology',
            country: 'United States',
            avatar_url: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
            linkedin_url: 'https://linkedin.com/in/johndemo',
            email: 'john@demo.com',
            phone: null,
            status: 'connected',
            match_score: 92,
            response_rate: 85,
            mutual_connections: 5,
            notes: 'Great potential connection for tech discussions',
            sent_at: new Date().toISOString(),
            connected_at: new Date().toISOString(),
            created_at: new Date().toISOString()
          },
          {
            id: 'demo-connection-2',
            user_id: 'demo-user-id',
            name: 'Sarah Smith',
            title: 'Marketing Manager',
            company: 'Growth Co',
            industry: 'Marketing',
            country: 'Canada',
            avatar_url: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
            linkedin_url: 'https://linkedin.com/in/sarahsmith',
            email: 'sarah@growthco.com',
            phone: null,
            status: 'pending',
            match_score: 88,
            response_rate: null,
            mutual_connections: 3,
            notes: null,
            sent_at: new Date().toISOString(),
            connected_at: null,
            created_at: new Date().toISOString()
          }
        ], 
        error: null 
      };
    }
    
    const { data, error } = await supabase
      .from('connections')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    return { data, error };
  } catch (error) {
    console.error('Get user connections error:', error);
    // Return mock data for demo mode
    return { 
      data: [
        {
          id: 'demo-connection-1',
          user_id: userId,
          name: 'John Demo',
          title: 'Senior Developer',
          company: 'Tech Corp',
          industry: 'Technology',
          country: 'United States',
          avatar_url: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
          linkedin_url: 'https://linkedin.com/in/johndemo',
          email: 'john@demo.com',
          phone: null,
          status: 'connected',
          match_score: 92,
          response_rate: 85,
          mutual_connections: 5,
          notes: 'Great potential connection for tech discussions',
          sent_at: new Date().toISOString(),
          connected_at: new Date().toISOString(),
          created_at: new Date().toISOString()
        }
      ], 
      error: null 
    };
  }
};

export const createConnection = async (connectionData: Database['public']['Tables']['connections']['Insert']) => {
  try {
    // For demo user, return mock data
    if (connectionData.user_id === 'demo-user-id') {
      return { 
        data: {
          id: `demo-connection-${Date.now()}`,
          ...connectionData,
          sent_at: connectionData.sent_at || new Date().toISOString(),
          created_at: new Date().toISOString()
        }, 
        error: null 
      };
    }
    
    const { data, error } = await supabase
      .from('connections')
      .insert(connectionData)
      .select()
      .single();
    return { data, error };
  } catch (error) {
    console.error('Create connection error:', error);
    // Return mock data for demo mode
    return { 
      data: {
        id: `demo-connection-${Date.now()}`,
        ...connectionData,
        sent_at: connectionData.sent_at || new Date().toISOString(),
        created_at: new Date().toISOString()
      }, 
      error: null 
    };
  }
};

export const getUserSettings = async (userId: string) => {
  try {
    // For demo user, return mock data
    if (userId === 'demo-user-id') {
      return { 
        data: {
          id: 'demo-settings-id',
          user_id: 'demo-user-id',
          notifications: { push: true, email: true, marketing: false },
          privacy: { profile_visible: true, activity_visible: false, analytics_sharing: true },
          automation: { daily_limit: 20, auto_connect: false, personalize_messages: true },
          api_keys: {},
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }, 
        error: null 
      };
    }
    
    const { data, error } = await supabase
      .from('user_settings')
      .select('*')
      .eq('user_id', userId)
      .single();
    return { data, error };
  } catch (error) {
    console.error('Get user settings error:', error);
    // Return mock data for demo mode
    return { 
      data: {
        id: 'demo-settings-id',
        user_id: userId,
        notifications: { push: true, email: true, marketing: false },
        privacy: { profile_visible: true, activity_visible: false, analytics_sharing: true },
        automation: { daily_limit: 20, auto_connect: false, personalize_messages: true },
        api_keys: {},
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }, 
      error: null 
    };
  }
};

export const updateUserSettings = async (userId: string, settings: Database['public']['Tables']['user_settings']['Update']) => {
  try {
    // For demo user, return mock data
    if (userId === 'demo-user-id') {
      return { 
        data: {
          id: 'demo-settings-id',
          user_id: 'demo-user-id',
          notifications: settings.notifications || { push: true, email: true, marketing: false },
          privacy: settings.privacy || { profile_visible: true, activity_visible: false, analytics_sharing: true },
          automation: settings.automation || { daily_limit: 20, auto_connect: false, personalize_messages: true },
          api_keys: settings.api_keys || {},
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }, 
        error: null 
      };
    }
    
    const { data, error } = await supabase
      .from('user_settings')
      .update({ ...settings, updated_at: new Date().toISOString() })
      .eq('user_id', userId)
      .select()
      .single();
    return { data, error };
  } catch (error) {
    console.error('Update user settings error:', error);
    // Return mock data for demo mode
    return { 
      data: {
        id: 'demo-settings-id',
        user_id: userId,
        notifications: settings.notifications || { push: true, email: true, marketing: false },
        privacy: settings.privacy || { profile_visible: true, activity_visible: false, analytics_sharing: true },
        automation: settings.automation || { daily_limit: 20, auto_connect: false, personalize_messages: true },
        api_keys: settings.api_keys || {},
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }, 
      error: null 
    };
  }
};

export const trackApiUsage = async (
  userId: string,
  service: string,
  endpoint?: string,
  creditsUsed: number = 1,
  success: boolean = true,
  responseTime?: number
) => {
  try {
    // For demo user, just return success
    if (userId === 'demo-user-id') {
      return { error: null };
    }
    
    const { error } = await supabase.rpc('track_api_usage', {
      user_id: userId,
      service_name: service,
      endpoint_name: endpoint,
      credits_cost: creditsUsed,
      was_successful: success,
      response_time: responseTime
    });
    return { error };
  } catch (error) {
    console.error('Track API usage error:', error);
    return { error: null };
  }
};

export const updateUserCredits = async (userId: string, creditChange: number) => {
  try {
    // For demo user, just return success
    if (userId === 'demo-user-id') {
      return { data: { credits: 100 + creditChange }, error: null };
    }
    
    const { data, error } = await supabase.rpc('update_user_credits', {
      user_id: userId,
      credit_change: creditChange
    });
    return { data, error };
  } catch (error) {
    console.error('Update user credits error:', error);
    return { data: { credits: 100 + creditChange }, error: null };
  }
};