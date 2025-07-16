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
DECLARE
  constraint_exists boolean;
BEGIN
  SELECT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'verified_api_keys_user_id_fkey'
    AND table_name = 'verified_api_keys'
  ) INTO constraint_exists;
  
  IF NOT constraint_exists THEN
    ALTER TABLE verified_api_keys ADD CONSTRAINT verified_api_keys_user_id_fkey 
    FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE;
  END IF;
END $$;

-- Add unique constraint if it doesn't exist
DO $$
DECLARE
  constraint_exists boolean;
BEGIN
  SELECT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'verified_api_keys_user_service_unique'
    AND table_name = 'verified_api_keys'
  ) INTO constraint_exists;
  
  IF NOT constraint_exists THEN
    ALTER TABLE verified_api_keys ADD CONSTRAINT verified_api_keys_user_service_unique 
    UNIQUE (user_id, service);
  END IF;
END $$;

-- Enable Row Level Security
ALTER TABLE verified_api_keys ENABLE ROW LEVEL SECURITY;

-- Create RLS policy if it doesn't exist
DO $$
DECLARE
  policy_exists boolean;
BEGIN
  SELECT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'verified_api_keys' 
    AND policyname = 'Users can manage own API keys'
  ) INTO policy_exists;
  
  IF NOT policy_exists THEN
    CREATE POLICY "Users can manage own API keys"
      ON verified_api_keys
      FOR ALL
      TO authenticated
      USING (auth.uid() = user_id);
  END IF;
END $$;

-- Create indexes if they don't exist
DO $$
DECLARE
  idx_user_id_exists boolean;
  idx_service_exists boolean;
  idx_status_exists boolean;
  idx_unique_exists boolean;
BEGIN
  SELECT EXISTS (
    SELECT 1 FROM pg_indexes 
    WHERE indexname = 'idx_verified_api_keys_user_id'
  ) INTO idx_user_id_exists;
  
  SELECT EXISTS (
    SELECT 1 FROM pg_indexes 
    WHERE indexname = 'idx_verified_api_keys_service'
  ) INTO idx_service_exists;
  
  SELECT EXISTS (
    SELECT 1 FROM pg_indexes 
    WHERE indexname = 'idx_verified_api_keys_status'
  ) INTO idx_status_exists;
  
  SELECT EXISTS (
    SELECT 1 FROM pg_indexes 
    WHERE indexname = 'verified_api_keys_user_service_unique'
  ) INTO idx_unique_exists;
  
  IF NOT idx_user_id_exists THEN
    CREATE INDEX idx_verified_api_keys_user_id ON verified_api_keys(user_id);
  END IF;
  
  IF NOT idx_service_exists THEN
    CREATE INDEX idx_verified_api_keys_service ON verified_api_keys(user_id, service);
  END IF;
  
  IF NOT idx_status_exists THEN
    CREATE INDEX idx_verified_api_keys_status ON verified_api_keys(user_id, status);
  END IF;
  
  IF NOT idx_unique_exists THEN
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
DECLARE
  trigger_exists boolean;
BEGIN
  SELECT EXISTS (
    SELECT 1 FROM information_schema.triggers 
    WHERE trigger_name = 'update_verified_api_keys_updated_at'
    AND event_object_table = 'verified_api_keys'
  ) INTO trigger_exists;
  
  IF NOT trigger_exists THEN
    CREATE TRIGGER update_verified_api_keys_updated_at
      BEFORE UPDATE ON verified_api_keys
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;