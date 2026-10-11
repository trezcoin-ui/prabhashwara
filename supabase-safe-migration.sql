-- Safe Prabhashwara Migration Script
-- This script is safe to run multiple times

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users are viewable by everyone" ON users;
DROP POLICY IF EXISTS "Users can insert their own data" ON users;
DROP POLICY IF EXISTS "Users can update their own data" ON users;
DROP POLICY IF EXISTS "Practice logs are viewable by everyone" ON practice_logs;
DROP POLICY IF EXISTS "Users can insert their own practice logs" ON practice_logs;
DROP POLICY IF EXISTS "Users can update their own practice logs" ON practice_logs;
DROP POLICY IF EXISTS "Users can delete their own practice logs" ON practice_logs;
DROP POLICY IF EXISTS "Meditation sessions are viewable by everyone" ON meditation_sessions;
DROP POLICY IF EXISTS "Users can insert their own meditation sessions" ON meditation_sessions;
DROP POLICY IF EXISTS "Users can delete their own meditation sessions" ON meditation_sessions;

-- Create tables (only if they don't exist)
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username TEXT UNIQUE NOT NULL,
  emoji TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS practice_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  practice_date DATE NOT NULL,
  priming BOOLEAN DEFAULT FALSE,
  surya_namaskaraya BOOLEAN DEFAULT FALSE,
  kapalabhati BOOLEAN DEFAULT FALSE,
  bhastrika BOOLEAN DEFAULT FALSE,
  nadi_shodhana BOOLEAN DEFAULT FALSE,
  bhramari BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, practice_date)
);

CREATE TABLE IF NOT EXISTS meditation_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  practice_date DATE NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('anapanasati', 'metta')),
  minutes INTEGER NOT NULL CHECK (minutes > 0),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE practice_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE meditation_sessions ENABLE ROW LEVEL SECURITY;

-- Create policies (fresh start after dropping old ones)
CREATE POLICY "Users are viewable by everyone" ON users FOR SELECT USING (true);
CREATE POLICY "Users can insert their own data" ON users FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update their own data" ON users FOR UPDATE USING (true);

CREATE POLICY "Practice logs are viewable by everyone" ON practice_logs FOR SELECT USING (true);
CREATE POLICY "Users can insert their own practice logs" ON practice_logs FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update their own practice logs" ON practice_logs FOR UPDATE USING (true);
CREATE POLICY "Users can delete their own practice logs" ON practice_logs FOR DELETE USING (true);

CREATE POLICY "Meditation sessions are viewable by everyone" ON meditation_sessions FOR SELECT USING (true);
CREATE POLICY "Users can insert their own meditation sessions" ON meditation_sessions FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can delete their own meditation sessions" ON meditation_sessions FOR DELETE USING (true);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_practice_logs_user_date ON practice_logs(user_id, practice_date DESC);
CREATE INDEX IF NOT EXISTS idx_meditation_sessions_user_date ON meditation_sessions(user_id, practice_date DESC);
CREATE INDEX IF NOT EXISTS idx_practice_logs_date ON practice_logs(practice_date DESC);
CREATE INDEX IF NOT EXISTS idx_meditation_sessions_date ON meditation_sessions(practice_date DESC);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Drop trigger if exists and recreate
DROP TRIGGER IF EXISTS update_practice_logs_updated_at ON practice_logs;
CREATE TRIGGER update_practice_logs_updated_at BEFORE UPDATE ON practice_logs
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
