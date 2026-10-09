-- Prabhashwara Database Schema
-- Run this in Supabase SQL Editor: https://supabase.com/dashboard/project/_/sql

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  username TEXT UNIQUE NOT NULL,
  emoji TEXT NOT NULL DEFAULT '🪷',
  pin_hash TEXT NOT NULL, -- argon2id hashed PIN
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Practice logs table
CREATE TABLE practice_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  practice_date DATE NOT NULL,
  
  -- Activity checkboxes
  priming BOOLEAN NOT NULL DEFAULT FALSE,
  surya_namaskaraya BOOLEAN NOT NULL DEFAULT FALSE,
  kapalabhati BOOLEAN NOT NULL DEFAULT FALSE,
  bhastrika BOOLEAN NOT NULL DEFAULT FALSE,
  nadi_shodhana BOOLEAN NOT NULL DEFAULT FALSE,
  bhramari BOOLEAN NOT NULL DEFAULT FALSE,
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  -- One log per user per day
  UNIQUE(user_id, practice_date)
);

-- Meditation sessions table
CREATE TABLE meditation_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  practice_date DATE NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('anapanasati', 'metta')),
  minutes INTEGER NOT NULL CHECK (minutes >= 5 AND minutes <= 120),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_practice_logs_user_date ON practice_logs(user_id, practice_date DESC);
CREATE INDEX idx_meditation_sessions_user_date ON meditation_sessions(user_id, practice_date DESC);
CREATE INDEX idx_users_username ON users(username);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_practice_logs_updated_at BEFORE UPDATE ON practice_logs
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE practice_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE meditation_sessions ENABLE ROW LEVEL SECURITY;

-- RLS Policies (Users can only access their own data)
CREATE POLICY "Users can view their own data" ON users
  FOR SELECT USING (true); -- Public usernames for leaderboard

CREATE POLICY "Users can update their own data" ON users
  FOR UPDATE USING (auth.uid()::text = id::text);

CREATE POLICY "Users can view all practice logs" ON practice_logs
  FOR SELECT USING (true); -- For leaderboard

CREATE POLICY "Users can insert their own logs" ON practice_logs
  FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

CREATE POLICY "Users can update their own logs" ON practice_logs
  FOR UPDATE USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can view all meditation sessions" ON meditation_sessions
  FOR SELECT USING (true); -- For leaderboard

CREATE POLICY "Users can insert their own sessions" ON meditation_sessions
  FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

CREATE POLICY "Users can delete their own sessions" ON meditation_sessions
  FOR DELETE USING (auth.uid()::text = user_id::text);
