// Types for Fit Friends App

export interface User {
  id: string;
  email: string;
  name: string;
  avatar_url?: string;
  created_at: string;
}

export interface Profile {
  id: string;
  user_id: string;
  name: string;
  avatar_url?: string;
  bio?: string;
  created_at: string;
}

export interface Challenge {
  id: string;
  name: string;
  description?: string;
  start_date: string;
  end_date: string;
  created_by: string;
  referee_id: string;
  status: 'pending' | 'active' | 'completed';
  max_participants: number;
  created_at: string;
}

export interface Team {
  id: string;
  challenge_id: string;
  name: string;
  color: string;
  created_at: string;
}

export interface TeamMember {
  id: string;
  team_id: string;
  user_id: string;
  joined_at: string;
}

export interface ExerciseType {
  id: string;
  name: string;
  unit: string;
  points_per: number;
  unit_amount: number;
  icon?: string;
}

export interface ActivityLog {
  id: string;
  challenge_id: string;
  user_id: string;
  team_id: string;
  exercise_type_id: string;
  measurement: number;
  points: number;
  date: string;
  proof_url?: string;
  strava_link?: string;
  notes?: string;
  created_at: string;
  deleted_at?: string;
  deleted_by?: string;
}

export interface Dispute {
  id: string;
  activity_log_id: string;
  raised_by: string;
  reason: string;
  status: 'open' | 'resolved' | 'rejected';
  resolved_by?: string;
  resolution_notes?: string;
  created_at: string;
  resolved_at?: string;
}

export interface DailyQuote {
  id: string;
  day_number: number;
  quote: string;
  author?: string;
}

export interface TeamScore {
  team_id: string;
  team_name: string;
  team_color: string;
  total_points: number;
  member_count: number;
}

export interface UserStats {
  user_id: string;
  name: string;
  team_id: string;
  team_name: string;
  team_color: string;
  total_points: number;
  activity_count: number;
  daily_points: { date: string; points: number }[];
}
