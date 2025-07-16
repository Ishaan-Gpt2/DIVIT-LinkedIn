/*
  # Chaitra LinkedIn Automation Platform Database Schema

  1. New Tables
    - `profiles` - User profiles extending auth.users
    - `ai_clones` - AI writing clones for users
    - `linkedin_posts` - Generated and scheduled LinkedIn posts
    - `connections` - LinkedIn connections and prospects
    - `automation_runs` - Track automation executions
    - `api_usage` - Track API usage and credits
    - `user_settings` - User preferences and settings

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own data
    - Create functions for user management and credit tracking

  3. Features
    - Automatic profile creation on user signup
    - Credit tracking and management
    - API usage monitoring
    - Default AI clone creation
*/

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Check if profiles table exists and get its structure
DO $$ 
DECLARE
    table_exists boolean;
    has_email_col boolean;
    has_name_col boolean;
BEGIN
    -- Check if profiles table exists
    SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'profiles'
    ) INTO table_exists;
    
    IF table_exists THEN
        -- Check for email column
        SELECT EXISTS (
            SELECT FROM information_schema.columns 
            WHERE table_schema = 'public' 
            AND table_name = 'profiles' 
            AND column_name = 'email'
        ) INTO has_email_col;
        
        -- Check for name column
        SELECT EXISTS (
            SELECT FROM information_schema.columns 
            WHERE table_schema = 'public' 
            AND table_name = 'profiles' 
            AND column_name = 'name'
        ) INTO has_name_col;
        
        -- Add missing columns if they don't exist
        IF NOT has_email_col THEN
            ALTER TABLE profiles ADD COLUMN email text;
        END IF;
        
        IF NOT has_name_col THEN
            ALTER TABLE profiles ADD COLUMN name text;
        END IF;
        
        -- Add other missing columns if they don't exist
        IF NOT EXISTS (
            SELECT FROM information_schema.columns 
            WHERE table_schema = 'public' 
            AND table_name = 'profiles' 
            AND column_name = 'plan'
        ) THEN
            ALTER TABLE profiles ADD COLUMN plan text DEFAULT 'free' CHECK (plan IN ('free', 'creator', 'ghostwriter', 'agency'));
        END IF;
        
        IF NOT EXISTS (
            SELECT FROM information_schema.columns 
            WHERE table_schema = 'public' 
            AND table_name = 'profiles' 
            AND column_name = 'credits'
        ) THEN
            ALTER TABLE profiles ADD COLUMN credits integer DEFAULT 5;
        END IF;
        
        IF NOT EXISTS (
            SELECT FROM information_schema.columns 
            WHERE table_schema = 'public' 
            AND table_name = 'profiles' 
            AND column_name = 'avatar_url'
        ) THEN
            ALTER TABLE profiles ADD COLUMN avatar_url text;
        END IF;
        
        IF NOT EXISTS (
            SELECT FROM information_schema.columns 
            WHERE table_schema = 'public' 
            AND table_name = 'profiles' 
            AND column_name = 'linkedin_profile_url'
        ) THEN
            ALTER TABLE profiles ADD COLUMN linkedin_profile_url text;
        END IF;
        
        IF NOT EXISTS (
            SELECT FROM information_schema.columns 
            WHERE table_schema = 'public' 
            AND table_name = 'profiles' 
            AND column_name = 'bio'
        ) THEN
            ALTER TABLE profiles ADD COLUMN bio text;
        END IF;
        
        IF NOT EXISTS (
            SELECT FROM information_schema.columns 
            WHERE table_schema = 'public' 
            AND table_name = 'profiles' 
            AND column_name = 'timezone'
        ) THEN
            ALTER TABLE profiles ADD COLUMN timezone text DEFAULT 'UTC';
        END IF;
        
        -- Update constraints
        BEGIN
            ALTER TABLE profiles ADD CONSTRAINT profiles_email_unique UNIQUE (email);
        EXCEPTION
            WHEN duplicate_object THEN
                -- Constraint already exists, ignore
                NULL;
        END;
        
        -- Update email column to be NOT NULL if it's currently NULL
        UPDATE profiles SET email = (
            SELECT email FROM auth.users WHERE auth.users.id = profiles.id
        ) WHERE email IS NULL;
        
        -- Update name column if it's currently NULL
        UPDATE profiles SET name = COALESCE(
            (SELECT raw_user_meta_data->>'name' FROM auth.users WHERE auth.users.id = profiles.id),
            split_part((SELECT email FROM auth.users WHERE auth.users.id = profiles.id), '@', 1)
        ) WHERE name IS NULL;
        
    ELSE
        -- Create profiles table from scratch
        CREATE TABLE profiles (
            id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
            email text UNIQUE NOT NULL,
            name text NOT NULL,
            plan text DEFAULT 'free' CHECK (plan IN ('free', 'creator', 'ghostwriter', 'agency')),
            credits integer DEFAULT 5,
            avatar_url text,
            linkedin_profile_url text,
            bio text,
            timezone text DEFAULT 'UTC',
            created_at timestamptz DEFAULT now(),
            updated_at timestamptz DEFAULT now()
        );
    END IF;
END $$;

-- AI Clones table
CREATE TABLE IF NOT EXISTS ai_clones (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  description text,
  tone text NOT NULL,
  personality jsonb DEFAULT '[]'::jsonb,
  sample_posts jsonb DEFAULT '[]'::jsonb,
  is_active boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- LinkedIn Posts table
CREATE TABLE IF NOT EXISTS linkedin_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  clone_id uuid REFERENCES ai_clones(id) ON DELETE SET NULL,
  content text NOT NULL,
  tone text,
  status text DEFAULT 'draft' CHECK (status IN ('draft', 'scheduled', 'posted', 'failed')),
  scheduled_for timestamptz,
  posted_at timestamptz,
  engagement jsonb DEFAULT '{}'::jsonb,
  ai_score integer,
  human_score integer,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Connections table
CREATE TABLE IF NOT EXISTS connections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  title text,
  company text,
  industry text,
  country text,
  avatar_url text,
  linkedin_url text,
  email text,
  phone text,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'connected', 'declined')),
  match_score integer,
  response_rate integer,
  mutual_connections integer DEFAULT 0,
  notes text,
  sent_at timestamptz DEFAULT now(),
  connected_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Automation Runs table
CREATE TABLE IF NOT EXISTS automation_runs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  type text NOT NULL CHECK (type IN ('post_generation', 'auto_comment', 'connection_search', 'profile_scraping')),
  status text DEFAULT 'running' CHECK (status IN ('running', 'completed', 'failed')),
  input_data jsonb DEFAULT '{}'::jsonb,
  output_data jsonb DEFAULT '{}'::jsonb,
  credits_used integer DEFAULT 0,
  error_message text,
  started_at timestamptz DEFAULT now(),
  completed_at timestamptz
);

-- API Usage table
CREATE TABLE IF NOT EXISTS api_usage (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  service text NOT NULL,
  endpoint text,
  credits_used integer DEFAULT 1,
  success boolean DEFAULT true,
  response_time_ms integer,
  created_at timestamptz DEFAULT now()
);

-- User Settings table
CREATE TABLE IF NOT EXISTS user_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  notifications jsonb DEFAULT '{"email": true, "push": true, "marketing": false}'::jsonb,
  privacy jsonb DEFAULT '{"profile_visible": true, "activity_visible": false, "analytics_sharing": true}'::jsonb,
  automation jsonb DEFAULT '{"daily_limit": 20, "auto_connect": false, "personalize_messages": true}'::jsonb,
  api_keys jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id)
);

-- Enable Row Level Security
DO $$ 
BEGIN
    -- Enable RLS on all tables
    ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
    ALTER TABLE ai_clones ENABLE ROW LEVEL SECURITY;
    ALTER TABLE linkedin_posts ENABLE ROW LEVEL SECURITY;
    ALTER TABLE connections ENABLE ROW LEVEL SECURITY;
    ALTER TABLE automation_runs ENABLE ROW LEVEL SECURITY;
    ALTER TABLE api_usage ENABLE ROW LEVEL SECURITY;
    ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;
EXCEPTION
    WHEN OTHERS THEN
        -- Some tables might already have RLS enabled, continue
        NULL;
END $$;

-- Drop existing policies if they exist, then create new ones
DO $$ 
BEGIN
  -- Profiles policies
  DROP POLICY IF EXISTS "Users can read own profile" ON profiles;
  DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
  DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
  
  CREATE POLICY "Users can read own profile"
    ON profiles
    FOR SELECT
    TO authenticated
    USING (auth.uid() = id);

  CREATE POLICY "Users can update own profile"
    ON profiles
    FOR UPDATE
    TO authenticated
    USING (auth.uid() = id);

  CREATE POLICY "Users can insert own profile"
    ON profiles
    FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = id);
EXCEPTION
    WHEN OTHERS THEN
        -- Policy creation failed, continue
        NULL;
END $$;

DO $$ 
BEGIN
  -- AI Clones policies
  DROP POLICY IF EXISTS "Users can manage own clones" ON ai_clones;
  
  CREATE POLICY "Users can manage own clones"
    ON ai_clones
    FOR ALL
    TO authenticated
    USING (auth.uid() = user_id);
EXCEPTION
    WHEN OTHERS THEN
        NULL;
END $$;

DO $$ 
BEGIN
  -- LinkedIn Posts policies
  DROP POLICY IF EXISTS "Users can manage own posts" ON linkedin_posts;
  
  CREATE POLICY "Users can manage own posts"
    ON linkedin_posts
    FOR ALL
    TO authenticated
    USING (auth.uid() = user_id);
EXCEPTION
    WHEN OTHERS THEN
        NULL;
END $$;

DO $$ 
BEGIN
  -- Connections policies
  DROP POLICY IF EXISTS "Users can manage own connections" ON connections;
  
  CREATE POLICY "Users can manage own connections"
    ON connections
    FOR ALL
    TO authenticated
    USING (auth.uid() = user_id);
EXCEPTION
    WHEN OTHERS THEN
        NULL;
END $$;

DO $$ 
BEGIN
  -- Automation Runs policies
  DROP POLICY IF EXISTS "Users can view own automation runs" ON automation_runs;
  DROP POLICY IF EXISTS "Users can insert own automation runs" ON automation_runs;
  
  CREATE POLICY "Users can view own automation runs"
    ON automation_runs
    FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

  CREATE POLICY "Users can insert own automation runs"
    ON automation_runs
    FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);
EXCEPTION
    WHEN OTHERS THEN
        NULL;
END $$;

DO $$ 
BEGIN
  -- API Usage policies
  DROP POLICY IF EXISTS "Users can view own API usage" ON api_usage;
  DROP POLICY IF EXISTS "Users can insert own API usage" ON api_usage;
  
  CREATE POLICY "Users can view own API usage"
    ON api_usage
    FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

  CREATE POLICY "Users can insert own API usage"
    ON api_usage
    FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);
EXCEPTION
    WHEN OTHERS THEN
        NULL;
END $$;

DO $$ 
BEGIN
  -- User Settings policies
  DROP POLICY IF EXISTS "Users can manage own settings" ON user_settings;
  
  CREATE POLICY "Users can manage own settings"
    ON user_settings
    FOR ALL
    TO authenticated
    USING (auth.uid() = user_id);
EXCEPTION
    WHEN OTHERS THEN
        NULL;
END $$;

-- Functions
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger AS $$
BEGIN
  -- Insert into profiles with proper error handling
  INSERT INTO profiles (id, email, name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1))
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    name = COALESCE(EXCLUDED.name, profiles.name);
  
  -- Insert into user_settings
  INSERT INTO user_settings (user_id)
  VALUES (NEW.id)
  ON CONFLICT (user_id) DO NOTHING;
  
  -- Create default AI clone
  INSERT INTO ai_clones (user_id, name, description, tone, personality, is_active)
  VALUES (
    NEW.id,
    'Default Professional',
    'Professional, informative, and engaging LinkedIn presence',
    'Professional yet approachable',
    '["Knowledgeable", "Helpful", "Industry-focused"]'::jsonb,
    true
  )
  ON CONFLICT DO NOTHING;
  
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log error but don't fail the user creation
    RAISE WARNING 'Error in handle_new_user: %', SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user registration (drop and recreate to avoid conflicts)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Function to update user credits
CREATE OR REPLACE FUNCTION update_user_credits(user_id uuid, credit_change integer)
RETURNS integer AS $$
DECLARE
  new_credits integer;
BEGIN
  UPDATE profiles 
  SET credits = GREATEST(0, credits + credit_change),
      updated_at = now()
  WHERE id = user_id
  RETURNING credits INTO new_credits;
  
  RETURN COALESCE(new_credits, 0);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to track API usage
CREATE OR REPLACE FUNCTION track_api_usage(
  user_id uuid,
  service_name text,
  endpoint_name text DEFAULT NULL,
  credits_cost integer DEFAULT 1,
  was_successful boolean DEFAULT true,
  response_time integer DEFAULT NULL
)
RETURNS void AS $$
BEGIN
  INSERT INTO api_usage (user_id, service, endpoint, credits_used, success, response_time_ms)
  VALUES (user_id, service_name, endpoint_name, credits_cost, was_successful, response_time);
  
  -- Deduct credits for successful API calls
  IF was_successful THEN
    PERFORM update_user_credits(user_id, -credits_cost);
  END IF;
EXCEPTION
  WHEN OTHERS THEN
    -- Log error but don't fail
    RAISE WARNING 'Error in track_api_usage: %', SQLERRM;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Indexes for performance (create only if they don't exist)
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);
CREATE INDEX IF NOT EXISTS idx_ai_clones_user_id ON ai_clones(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_clones_active ON ai_clones(user_id, is_active);
CREATE INDEX IF NOT EXISTS idx_linkedin_posts_user_id ON linkedin_posts(user_id);
CREATE INDEX IF NOT EXISTS idx_linkedin_posts_status ON linkedin_posts(user_id, status);
CREATE INDEX IF NOT EXISTS idx_connections_user_id ON connections(user_id);
CREATE INDEX IF NOT EXISTS idx_connections_status ON connections(user_id, status);
CREATE INDEX IF NOT EXISTS idx_automation_runs_user_id ON automation_runs(user_id);
CREATE INDEX IF NOT EXISTS idx_api_usage_user_id ON api_usage(user_id);
CREATE INDEX IF NOT EXISTS idx_api_usage_created_at ON api_usage(user_id, created_at);