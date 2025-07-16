/*
  # Create user_settings table

  1. New Tables
    - `user_settings`
      - `id` (uuid, primary key, auto-generated)
      - `user_id` (uuid, foreign key to profiles.id)
      - `notifications` (jsonb, default settings for push, email, marketing)
      - `privacy` (jsonb, default settings for profile visibility, activity, analytics)
      - `automation` (jsonb, default settings for daily limit, auto connect, personalization)
      - `api_keys` (jsonb, storage for user API keys)
      - `created_at` (timestamp with timezone)
      - `updated_at` (timestamp with timezone)

  2. Security
    - Enable RLS on `user_settings` table
    - Add policy for authenticated users to manage their own settings

  3. Indexes
    - Unique index on user_id for faster lookups
    - Index on user_id for general queries

  4. Triggers
    - Update trigger for updated_at column
*/

-- Create the user_settings table
CREATE TABLE IF NOT EXISTS public.user_settings (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL,
    notifications jsonb DEFAULT '{"push": true, "email": true, "marketing": false}'::jsonb,
    privacy jsonb DEFAULT '{"profile_visible": true, "activity_visible": false, "analytics_sharing": true}'::jsonb,
    automation jsonb DEFAULT '{"daily_limit": 20, "auto_connect": false, "personalize_messages": true}'::jsonb,
    api_keys jsonb DEFAULT '{}'::jsonb,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Add foreign key constraint
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'user_settings_user_id_fkey'
    ) THEN
        ALTER TABLE public.user_settings 
        ADD CONSTRAINT user_settings_user_id_fkey 
        FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;
    END IF;
END $$;

-- Add unique constraint on user_id
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'user_settings_user_id_key'
    ) THEN
        ALTER TABLE public.user_settings 
        ADD CONSTRAINT user_settings_user_id_key UNIQUE (user_id);
    END IF;
END $$;

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_user_settings_user_id ON public.user_settings (user_id);
CREATE UNIQUE INDEX IF NOT EXISTS user_settings_user_id_key ON public.user_settings (user_id);

-- Enable Row Level Security
ALTER TABLE public.user_settings ENABLE ROW LEVEL SECURITY;

-- Create RLS policy for authenticated users to manage their own settings
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'user_settings' AND policyname = 'Users can manage own settings'
    ) THEN
        CREATE POLICY "Users can manage own settings" ON public.user_settings
        FOR ALL
        TO authenticated
        USING (auth.uid() = user_id);
    END IF;
END $$;

-- Create or replace the update_updated_at_column function if it doesn't exist
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updating updated_at column
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.triggers 
        WHERE trigger_name = 'update_user_settings_updated_at'
    ) THEN
        CREATE TRIGGER update_user_settings_updated_at
        BEFORE UPDATE ON public.user_settings
        FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    END IF;
END $$;