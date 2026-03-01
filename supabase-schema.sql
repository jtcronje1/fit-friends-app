-- Fit Friends Database Schema
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Profiles table (extends auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  avatar_url TEXT,
  bio TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Challenges table
CREATE TABLE IF NOT EXISTS challenges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  created_by UUID REFERENCES auth.users(id),
  referee_id UUID REFERENCES auth.users(id),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'completed')),
  max_participants INTEGER DEFAULT 6,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Teams table
CREATE TABLE IF NOT EXISTS teams (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  challenge_id UUID REFERENCES challenges(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  color TEXT NOT NULL DEFAULT '#3b82f6',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Team members table
CREATE TABLE IF NOT EXISTS team_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id),
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(team_id, user_id)
);

-- Activity logs table
CREATE TABLE IF NOT EXISTS activity_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  challenge_id UUID REFERENCES challenges(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id),
  team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
  exercise_type_id TEXT NOT NULL,
  measurement DECIMAL(10,2) NOT NULL,
  points INTEGER NOT NULL,
  date DATE NOT NULL,
  proof_url TEXT,
  strava_link TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  deleted_at TIMESTAMP WITH TIME ZONE,
  deleted_by UUID REFERENCES auth.users(id)
);

-- Disputes table
CREATE TABLE IF NOT EXISTS disputes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  activity_log_id UUID REFERENCES activity_logs(id) ON DELETE CASCADE,
  raised_by UUID REFERENCES auth.users(id),
  reason TEXT NOT NULL,
  status TEXT DEFAULT 'open' CHECK (status IN ('open', 'resolved', 'rejected')),
  resolved_by UUID REFERENCES auth.users(id),
  resolution_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  resolved_at TIMESTAMP WITH TIME ZONE
);

-- Daily quotes table
CREATE TABLE IF NOT EXISTS daily_quotes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  day_number INTEGER NOT NULL UNIQUE,
  quote TEXT NOT NULL,
  author TEXT
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_challenges_created_by ON challenges(created_by);
CREATE INDEX IF NOT EXISTS idx_challenges_status ON challenges(status);
CREATE INDEX IF NOT EXISTS idx_teams_challenge_id ON teams(challenge_id);
CREATE INDEX IF NOT EXISTS idx_team_members_team_id ON team_members(team_id);
CREATE INDEX IF NOT EXISTS idx_team_members_user_id ON team_members(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_challenge_id ON activity_logs(challenge_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_user_id ON activity_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_team_id ON activity_logs(team_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_deleted_at ON activity_logs(deleted_at);

-- Row Level Security (RLS) Policies
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE disputes ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Public profiles are viewable by everyone"
  ON profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can insert their own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = user_id);

-- Challenges policies
CREATE POLICY "Challenges are viewable by everyone"
  ON challenges FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create challenges"
  ON challenges FOR INSERT
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Challenge creators can update their challenges"
  ON challenges FOR UPDATE
  USING (auth.uid() = created_by);

-- Teams policies
CREATE POLICY "Teams are viewable by everyone"
  ON teams FOR SELECT
  USING (true);

CREATE POLICY "Challenge creators can create teams"
  ON teams FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM challenges
      WHERE id = teams.challenge_id
      AND created_by = auth.uid()
    )
  );

-- Team members policies
CREATE POLICY "Team members are viewable by everyone"
  ON team_members FOR SELECT
  USING (true);

CREATE POLICY "Users can join teams"
  ON team_members FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Activity logs policies
CREATE POLICY "Activity logs are viewable by everyone"
  ON activity_logs FOR SELECT
  USING (true);

CREATE POLICY "Users can create their own activity logs"
  ON activity_logs FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own non-deleted logs"
  ON activity_logs FOR UPDATE
  USING (auth.uid() = user_id AND deleted_at IS NULL);

-- Disputes policies
CREATE POLICY "Disputes are viewable by everyone"
  ON disputes FOR SELECT
  USING (true);

CREATE POLICY "Users can create disputes"
  ON disputes FOR INSERT
  WITH CHECK (auth.uid() = raised_by);

-- Function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'name', NEW.email));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Insert sample daily quotes
INSERT INTO daily_quotes (day_number, quote, author) VALUES
(1, 'The only bad workout is the one that didn''t happen.', 'Unknown'),
(2, 'Don''t stop when you''re tired. Stop when you''re done.', 'Unknown'),
(3, 'Your body can stand almost anything. It''s your mind that you have to convince.', 'Unknown'),
(4, 'Fitness is not about being better than someone else. It''s about being better than you used to be.', 'Khloe Kardashian'),
(5, 'The pain you feel today will be the strength you feel tomorrow.', 'Unknown'),
(6, 'A one-hour workout is 4% of your day. No excuses.', 'Unknown'),
(7, 'Sweat is just fat crying.', 'Unknown'),
(8, 'The hardest lift of all is lifting your butt off the couch.', 'Unknown'),
(9, 'Discipline is doing what needs to be done, even if you don''t want to do it.', 'Unknown'),
(10, 'Success is the sum of small efforts, repeated day in and day out.', 'Robert Collier'),
(11, 'Train insane or remain the same.', 'Unknown'),
(12, 'Your only limit is you.', 'Unknown'),
(13, 'Believe you can and you''re halfway there.', 'Theodore Roosevelt'),
(14, 'Action is the foundational key to all success.', 'Pablo Picasso'),
(15, 'Don''t wish for it, work for it.', 'Unknown'),
(16, 'Every workout is a step closer to your goal.', 'Unknown'),
(17, 'Strive for progress, not perfection.', 'Unknown'),
(18, 'The only way to define your limits is by going beyond them.', 'Arthur Clarke'),
(19, 'Push yourself because no one else is going to do it for you.', 'Unknown'),
(20, 'Great things never come from comfort zones.', 'Unknown'),
(21, 'Winners train, losers complain.', 'Unknown'),
(22, 'If it doesn''t challenge you, it doesn''t change you.', 'Fred DeVito'),
(23, 'Tough times don''t last. Tough people do.', 'Robert H. Schuller'),
(24, 'Champions keep playing until they get it right.', 'Billie Jean King'),
(25, 'Do something today that your future self will thank you for.', 'Sean Patrick Flanery'),
(26, 'Fall in love with taking care of yourself.', 'Unknown'),
(27, 'Be stronger than your excuses.', 'Unknown'),
(28, 'Make your body the sexiest outfit you own.', 'Unknown')
ON CONFLICT (day_number) DO NOTHING;
