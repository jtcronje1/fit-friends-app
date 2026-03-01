export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          avatar_url: string | null;
          bio: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          avatar_url?: string | null;
          bio?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          avatar_url?: string | null;
          bio?: string | null;
          created_at?: string;
        };
      };
      challenges: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          start_date: string;
          end_date: string;
          created_by: string;
          referee_id: string;
          status: 'pending' | 'active' | 'completed';
          max_participants: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string | null;
          start_date: string;
          end_date: string;
          created_by: string;
          referee_id: string;
          status?: 'pending' | 'active' | 'completed';
          max_participants?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string | null;
          start_date?: string;
          end_date?: string;
          created_by?: string;
          referee_id?: string;
          status?: 'pending' | 'active' | 'completed';
          max_participants?: number;
          created_at?: string;
        };
      };
      teams: {
        Row: {
          id: string;
          challenge_id: string;
          name: string;
          color: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          challenge_id: string;
          name: string;
          color: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          challenge_id?: string;
          name?: string;
          color?: string;
          created_at?: string;
        };
      };
      team_members: {
        Row: {
          id: string;
          team_id: string;
          user_id: string;
          joined_at: string;
        };
        Insert: {
          id?: string;
          team_id: string;
          user_id: string;
          joined_at?: string;
        };
        Update: {
          id?: string;
          team_id?: string;
          user_id?: string;
          joined_at?: string;
        };
      };
      activity_logs: {
        Row: {
          id: string;
          challenge_id: string;
          user_id: string;
          team_id: string;
          exercise_type_id: string;
          measurement: number;
          points: number;
          date: string;
          proof_url: string | null;
          strava_link: string | null;
          notes: string | null;
          created_at: string;
          deleted_at: string | null;
          deleted_by: string | null;
        };
        Insert: {
          id?: string;
          challenge_id: string;
          user_id: string;
          team_id: string;
          exercise_type_id: string;
          measurement: number;
          points: number;
          date: string;
          proof_url?: string | null;
          strava_link?: string | null;
          notes?: string | null;
          created_at?: string;
          deleted_at?: string | null;
          deleted_by?: string | null;
        };
        Update: {
          id?: string;
          challenge_id?: string;
          user_id?: string;
          team_id?: string;
          exercise_type_id?: string;
          measurement?: number;
          points?: number;
          date?: string;
          proof_url?: string | null;
          strava_link?: string | null;
          notes?: string | null;
          created_at?: string;
          deleted_at?: string | null;
          deleted_by?: string | null;
        };
      };
      disputes: {
        Row: {
          id: string;
          activity_log_id: string;
          raised_by: string;
          reason: string;
          status: 'open' | 'resolved' | 'rejected';
          resolved_by: string | null;
          resolution_notes: string | null;
          created_at: string;
          resolved_at: string | null;
        };
        Insert: {
          id?: string;
          activity_log_id: string;
          raised_by: string;
          reason: string;
          status?: 'open' | 'resolved' | 'rejected';
          resolved_by?: string | null;
          resolution_notes?: string | null;
          created_at?: string;
          resolved_at?: string | null;
        };
        Update: {
          id?: string;
          activity_log_id?: string;
          raised_by?: string;
          reason?: string;
          status?: 'open' | 'resolved' | 'rejected';
          resolved_by?: string | null;
          resolution_notes?: string | null;
          created_at?: string;
          resolved_at?: string | null;
        };
      };
      daily_quotes: {
        Row: {
          id: string;
          day_number: number;
          quote: string;
          author: string | null;
        };
        Insert: {
          id?: string;
          day_number: number;
          quote: string;
          author?: string | null;
        };
        Update: {
          id?: string;
          day_number?: number;
          quote?: string;
          author?: string | null;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}
