-- Prabhashwara Yoga Tracker Database Schema
-- Run this in your Supabase SQL Editor: https://supabase.com/dashboard/project/_/sql

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username TEXT UNIQUE NOT NULL,
  emoji TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Practice logs table
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

-- Meditation sessions table
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

-- Policies for users table (anyone can read, only own user can update)
CREATE POLICY "Users are viewable by everyone" ON users FOR SELECT USING (true);
CREATE POLICY "Users can insert their own data" ON users FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update their own data" ON users FOR UPDATE USING (true);

-- Policies for practice_logs table (anyone can read, only own logs can be modified)
CREATE POLICY "Practice logs are viewable by everyone" ON practice_logs FOR SELECT USING (true);
CREATE POLICY "Users can insert their own practice logs" ON practice_logs FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update their own practice logs" ON practice_logs FOR UPDATE USING (true);
CREATE POLICY "Users can delete their own practice logs" ON practice_logs FOR DELETE USING (true);

-- Policies for meditation_sessions table (anyone can read, only own sessions can be modified)
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

-- Trigger to automatically update updated_at
CREATE TRIGGER update_practice_logs_updated_at BEFORE UPDATE ON practice_logs
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
