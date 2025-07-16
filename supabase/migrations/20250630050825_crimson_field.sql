/*
  # Create or update verified_api_keys table for storing validated API keys

  1. Table Structure
    - `id` (uuid, primary key)
    - `user_id` (uuid, foreign key to profiles)
    - `service` (text, service name)
    - `api_key` (text, encrypted API key)
    - `status` (text, verification status)
    - `tested_at` (timestamptz, last test timestamp)
    - `extra_params` (jsonb, additional parameters)
    - `created_at` (timestamptz)
    - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on `verified_api_keys` table
    - Add policy for authenticated users to manage their own keys

  3. Indexes
    - Index on user_id and service for efficient queries
    - Unique constraint on user_id + service combination
*/

-- Create verified_api_keys table if it doesn't exist
CREATE TABLE IF NOT EXISTS verified_api_keys (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  service text NOT NULL,
  api_key text NOT NULL,
  status text DEFAULT 'verified' CHECK (status IN ('verified', 'expired', 'invalid')),
  tested_at timestamptz DEFAULT now(),
  extra_params jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Add foreign key constraint if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'verified_api_keys_user_id_fkey'
    AND table_name = 'verified_api_keys'
  ) THEN
    ALTER TABLE verified_api_keys ADD CONSTRAINT verified_api_keys_user_id_fkey 
    FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE;
  END IF;
END $$;

-- Add unique constraint if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'verified_api_keys_user_service_unique'
    AND table_name = 'verified_api_keys'
  ) THEN
    ALTER TABLE verified_api_keys ADD CONSTRAINT verified_api_keys_user_service_unique 
    UNIQUE (user_id, service);
  END IF;
END $$;

-- Enable Row Level Security
ALTER TABLE verified_api_keys ENABLE ROW LEVEL SECURITY;

-- Create RLS policy if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'verified_api_keys' 
    AND policyname = 'Users can manage own API keys'
  ) THEN
    CREATE POLICY "Users can manage own API keys"
      ON verified_api_keys
      FOR ALL
      TO authenticated
      USING (auth.uid() = user_id);
  END IF;
END $$;

-- Create indexes if they don't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes 
    WHERE indexname = 'idx_verified_api_keys_user_id'
  ) THEN
    CREATE INDEX idx_verified_api_keys_user_id ON verified_api_keys(user_id);
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes 
    WHERE indexname = 'idx_verified_api_keys_service'
  ) THEN
    CREATE INDEX idx_verified_api_keys_service ON verified_api_keys(user_id, service);
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes 
    WHERE indexname = 'idx_verified_api_keys_status'
  ) THEN
    CREATE INDEX idx_verified_api_keys_status ON verified_api_keys(user_id, status);
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes 
    WHERE indexname = 'verified_api_keys_user_service_unique'
  ) THEN
    CREATE UNIQUE INDEX verified_api_keys_user_service_unique ON verified_api_keys(user_id, service);
  END IF;
END $$;

-- Create trigger function if it doesn't exist
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.triggers 
    WHERE trigger_name = 'update_verified_api_keys_updated_at'
    AND event_object_table = 'verified_api_keys'
  ) THEN
    CREATE TRIGGER update_verified_api_keys_updated_at
      BEFORE UPDATE ON verified_api_keys
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;