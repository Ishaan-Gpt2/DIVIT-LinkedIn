import { create } from 'zustand';
import { 
  getUserClones, 
  createClone, 
  getUserPosts, 
  createPost, 
  getUserConnections, 
  createConnection,
  getUserSettings,
  updateUserSettings
} from '@/lib/supabase';
import type { Database } from '@/lib/supabase';

export type Clone = Database['public']['Tables']['ai_clones']['Row'];
export type Post = Database['public']['Tables']['linkedin_posts']['Row'];
export type Connection = Database['public']['Tables']['connections']['Row'];
export type UserSettings = Database['public']['Tables']['user_settings']['Row'];

interface AppState {
  clones: Clone[];
  posts: Post[];
  connections: Connection[];
  settings: UserSettings | null;
  activeClone: Clone | null;
  isLoading: boolean;
  
  // Actions
  loadUserData: (userId: string) => Promise<void>;
  addClone: (cloneData: Omit<Clone, 'id' | 'created_at' | 'updated_at'>) => Promise<Clone | null>;
  setActiveClone: (clone: Clone) => void;
  addPost: (postData: Omit<Post, 'id' | 'created_at' | 'updated_at'>) => Promise<Post | null>;
  updatePost: (id: string, updates: Partial<Post>) => void;
  addConnection: (connectionData: Omit<Connection, 'id' | 'created_at' | 'sent_at'>) => Promise<Connection | null>;
  updateConnection: (id: string, status: Connection['status']) => void;
  updateSettings: (userId: string, settingsUpdate: Partial<UserSettings>) => Promise<void>;
  clearData: () => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  clones: [],
  posts: [],
  connections: [],
  settings: null,
  activeClone: null,
  isLoading: false,

  loadUserData: async (userId: string) => {
    set({ isLoading: true });
    
    try {
      // Load all user data in parallel
      const [clonesResult, postsResult, connectionsResult, settingsResult] = await Promise.all([
        getUserClones(userId),
        getUserPosts(userId),
        getUserConnections(userId),
        getUserSettings(userId)
      ]);

      const clones = clonesResult.data || [];
      const posts = postsResult.data || [];
      const connections = connectionsResult.data || [];
      const settings = settingsResult.data;

      // Find active clone
      const activeClone = clones.find(clone => clone.is_active) || clones[0] || null;

      set({ 
        clones, 
        posts, 
        connections, 
        settings,
        activeClone,
        isLoading: false 
      });
    } catch (error) {
      console.error('Error loading user data:', error);
      set({ isLoading: false });
    }
  },

  addClone: async (cloneData) => {
    try {
      const { data, error } = await createClone(cloneData);
      
      if (data && !error) {
        set(state => ({ clones: [...state.clones, data] }));
        return data;
      } else {
        console.error('Failed to create clone:', error);
        return null;
      }
    } catch (error) {
      console.error('Error creating clone:', error);
      return null;
    }
  },

  setActiveClone: (clone) => {
    set({ activeClone: clone });
  },

  addPost: async (postData) => {
    try {
      const { data, error } = await createPost(postData);
      
      if (data && !error) {
        set(state => ({ posts: [data, ...state.posts] }));
        return data;
      } else {
        console.error('Failed to create post:', error);
        return null;
      }
    } catch (error) {
      console.error('Error creating post:', error);
      return null;
    }
  },

  updatePost: (id, updates) => {
    set(state => ({
      posts: state.posts.map(post => 
        post.id === id ? { ...post, ...updates } : post
      )
    }));
  },

  addConnection: async (connectionData) => {
    try {
      const { data, error } = await createConnection(connectionData);
      
      if (data && !error) {
        set(state => ({ connections: [data, ...state.connections] }));
        return data;
      } else {
        console.error('Failed to create connection:', error);
        return null;
      }
    } catch (error) {
      console.error('Error creating connection:', error);
      return null;
    }
  },

  updateConnection: (id, status) => {
    set(state => ({
      connections: state.connections.map(conn => 
        conn.id === id ? { ...conn, status } : conn
      )
    }));
  },

  updateSettings: async (userId: string, settingsUpdate: Partial<UserSettings>) => {
    try {
      const { data, error } = await updateUserSettings(userId, settingsUpdate);
      
      if (data && !error) {
        set({ settings: data });
      } else {
        console.error('Failed to update settings:', error);
      }
    } catch (error) {
      console.error('Error updating settings:', error);
    }
  },

  clearData: () => {
    set({
      clones: [],
      posts: [],
      connections: [],
      settings: null,
      activeClone: null,
      isLoading: false
    });
  }
}));