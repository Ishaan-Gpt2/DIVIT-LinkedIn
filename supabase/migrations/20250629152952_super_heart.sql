/*
  # Create verified_api_keys table for storing validated API keys

  1. New Tables
    - `verified_api_keys`
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

-- Create verified_api_keys table
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

-- Add foreign key constraint
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'verified_api_keys_user_id_fkey'
  ) THEN
    ALTER TABLE verified_api_keys ADD CONSTRAINT verified_api_keys_user_id_fkey 
    FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE;
  END IF;
END $$;

-- Add unique constraint on user_id + service
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'verified_api_keys_user_service_unique'
  ) THEN
    ALTER TABLE verified_api_keys ADD CONSTRAINT verified_api_keys_user_service_unique 
    UNIQUE (user_id, service);
  END IF;
END $$;

-- Enable Row Level Security
ALTER TABLE verified_api_keys ENABLE ROW LEVEL SECURITY;

-- Create RLS policy for verified_api_keys
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'verified_api_keys' AND policyname = 'Users can manage own API keys'
  ) THEN
    CREATE POLICY "Users can manage own API keys"
      ON verified_api_keys
      FOR ALL
      TO authenticated
      USING (auth.uid() = user_id);
  END IF;
END $$;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_verified_api_keys_user_id ON verified_api_keys(user_id);
CREATE INDEX IF NOT EXISTS idx_verified_api_keys_service ON verified_api_keys(user_id, service);
CREATE INDEX IF NOT EXISTS idx_verified_api_keys_status ON verified_api_keys(user_id, status);

-- Create trigger for updating updated_at column
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.triggers 
    WHERE trigger_name = 'update_verified_api_keys_updated_at'
  ) THEN
    CREATE TRIGGER update_verified_api_keys_updated_at
      BEFORE UPDATE ON verified_api_keys
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;