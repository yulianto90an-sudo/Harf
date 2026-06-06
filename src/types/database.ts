export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      analytics_events: {
        Row: {
          created_at: string
          device_info: Json | null
          event_data: Json | null
          event_name: string
          id: number
          session_id: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          device_info?: Json | null
          event_data?: Json | null
          event_name: string
          id?: never
          session_id?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          device_info?: Json | null
          event_data?: Json | null
          event_name?: string
          id?: never
          session_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "analytics_events_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      analytics_events_2026_01: {
        Row: {
          created_at: string
          device_info: Json | null
          event_data: Json | null
          event_name: string
          id: number
          session_id: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          device_info?: Json | null
          event_data?: Json | null
          event_name: string
          id?: never
          session_id?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          device_info?: Json | null
          event_data?: Json | null
          event_name?: string
          id?: never
          session_id?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      analytics_events_2026_02: {
        Row: {
          created_at: string
          device_info: Json | null
          event_data: Json | null
          event_name: string
          id: number
          session_id: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          device_info?: Json | null
          event_data?: Json | null
          event_name: string
          id?: never
          session_id?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          device_info?: Json | null
          event_data?: Json | null
          event_name?: string
          id?: never
          session_id?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      analytics_events_2026_03: {
        Row: {
          created_at: string
          device_info: Json | null
          event_data: Json | null
          event_name: string
          id: number
          session_id: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          device_info?: Json | null
          event_data?: Json | null
          event_name: string
          id?: never
          session_id?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          device_info?: Json | null
          event_data?: Json | null
          event_name?: string
          id?: never
          session_id?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      analytics_events_2026_04: {
        Row: {
          created_at: string
          device_info: Json | null
          event_data: Json | null
          event_name: string
          id: number
          session_id: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          device_info?: Json | null
          event_data?: Json | null
          event_name: string
          id?: never
          session_id?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          device_info?: Json | null
          event_data?: Json | null
          event_name?: string
          id?: never
          session_id?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      analytics_events_2026_05: {
        Row: {
          created_at: string
          device_info: Json | null
          event_data: Json | null
          event_name: string
          id: number
          session_id: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          device_info?: Json | null
          event_data?: Json | null
          event_name: string
          id?: never
          session_id?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          device_info?: Json | null
          event_data?: Json | null
          event_name?: string
          id?: never
          session_id?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      analytics_events_2026_06: {
        Row: {
          created_at: string
          device_info: Json | null
          event_data: Json | null
          event_name: string
          id: number
          session_id: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          device_info?: Json | null
          event_data?: Json | null
          event_name: string
          id?: never
          session_id?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          device_info?: Json | null
          event_data?: Json | null
          event_name?: string
          id?: never
          session_id?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      analytics_events_default: {
        Row: {
          created_at: string
          device_info: Json | null
          event_data: Json | null
          event_name: string
          id: number
          session_id: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          device_info?: Json | null
          event_data?: Json | null
          event_name: string
          id?: never
          session_id?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          device_info?: Json | null
          event_data?: Json | null
          event_name?: string
          id?: never
          session_id?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      audio_play_log: {
        Row: {
          id: string
          played_at: string | null
          speed: string | null
          user_id: string
          word_id: string
        }
        Insert: {
          id?: string
          played_at?: string | null
          speed?: string | null
          user_id: string
          word_id: string
        }
        Update: {
          id?: string
          played_at?: string | null
          speed?: string | null
          user_id?: string
          word_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "audio_play_log_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "audio_play_log_word_id_fkey"
            columns: ["word_id"]
            isOneToOne: false
            referencedRelation: "vocabulary_words"
            referencedColumns: ["id"]
          },
        ]
      }
      badges: {
        Row: {
          category: string | null
          created_at: string | null
          description: string
          icon: string
          id: string
          max_progress: number | null
          name: string
          rarity: string
          slug: string
          sort_order: number | null
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          description: string
          icon: string
          id?: string
          max_progress?: number | null
          name: string
          rarity: string
          slug: string
          sort_order?: number | null
        }
        Update: {
          category?: string | null
          created_at?: string | null
          description?: string
          icon?: string
          id?: string
          max_progress?: number | null
          name?: string
          rarity?: string
          slug?: string
          sort_order?: number | null
        }
        Relationships: []
      }
      battle_questions: {
        Row: {
          battle_id: string
          combo_at_time: number | null
          correct_option_index: number
          created_at: string | null
          damage_dealt: number | null
          id: string
          is_correct: boolean
          is_timeout: boolean | null
          options_shown: Json | null
          question_index: number
          response_time_ms: number | null
          selected_option_index: number | null
          word_id: string
        }
        Insert: {
          battle_id: string
          combo_at_time?: number | null
          correct_option_index: number
          created_at?: string | null
          damage_dealt?: number | null
          id?: string
          is_correct: boolean
          is_timeout?: boolean | null
          options_shown?: Json | null
          question_index: number
          response_time_ms?: number | null
          selected_option_index?: number | null
          word_id: string
        }
        Update: {
          battle_id?: string
          combo_at_time?: number | null
          correct_option_index?: number
          created_at?: string | null
          damage_dealt?: number | null
          id?: string
          is_correct?: boolean
          is_timeout?: boolean | null
          options_shown?: Json | null
          question_index?: number
          response_time_ms?: number | null
          selected_option_index?: number | null
          word_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "battle_questions_battle_id_fkey"
            columns: ["battle_id"]
            isOneToOne: false
            referencedRelation: "battles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "battle_questions_word_id_fkey"
            columns: ["word_id"]
            isOneToOne: false
            referencedRelation: "vocabulary_words"
            referencedColumns: ["id"]
          },
        ]
      }
      battles: {
        Row: {
          battle_date: string | null
          coins_earned: number | null
          correct_count: number | null
          created_at: string | null
          duration_seconds: number | null
          enemy_hp_remaining: number | null
          enemy_level: number | null
          enemy_type: string
          id: string
          is_boss: boolean | null
          max_combo: number | null
          player_hp_remaining: number | null
          result: string
          timeout_count: number | null
          total_damage_dealt: number | null
          total_damage_taken: number | null
          total_questions: number | null
          user_id: string
          wrong_count: number | null
          xp_earned: number | null
        }
        Insert: {
          battle_date?: string | null
          coins_earned?: number | null
          correct_count?: number | null
          created_at?: string | null
          duration_seconds?: number | null
          enemy_hp_remaining?: number | null
          enemy_level?: number | null
          enemy_type: string
          id?: string
          is_boss?: boolean | null
          max_combo?: number | null
          player_hp_remaining?: number | null
          result: string
          timeout_count?: number | null
          total_damage_dealt?: number | null
          total_damage_taken?: number | null
          total_questions?: number | null
          user_id: string
          wrong_count?: number | null
          xp_earned?: number | null
        }
        Update: {
          battle_date?: string | null
          coins_earned?: number | null
          correct_count?: number | null
          created_at?: string | null
          duration_seconds?: number | null
          enemy_hp_remaining?: number | null
          enemy_level?: number | null
          enemy_type?: string
          id?: string
          is_boss?: boolean | null
          max_combo?: number | null
          player_hp_remaining?: number | null
          result?: string
          timeout_count?: number | null
          total_damage_dealt?: number | null
          total_damage_taken?: number | null
          total_questions?: number | null
          user_id?: string
          wrong_count?: number | null
          xp_earned?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "battles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      categories: {
        Row: {
          color: string | null
          created_at: string | null
          description: string | null
          icon: string | null
          id: string
          is_active: boolean | null
          name: string
          order_index: number | null
          slug: string
        }
        Insert: {
          color?: string | null
          created_at?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          order_index?: number | null
          slug: string
        }
        Update: {
          color?: string | null
          created_at?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          order_index?: number | null
          slug?: string
        }
        Relationships: []
      }
      daily_missions: {
        Row: {
          created_at: string | null
          id: string
          is_claimed: boolean | null
          is_completed: boolean | null
          mission_date: string
          mission_type: string
          progress: number | null
          reward_coins: number | null
          reward_xp: number
          target: number
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_claimed?: boolean | null
          is_completed?: boolean | null
          mission_date?: string
          mission_type: string
          progress?: number | null
          reward_coins?: number | null
          reward_xp: number
          target: number
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          is_claimed?: boolean | null
          is_completed?: boolean | null
          mission_date?: string
          mission_type?: string
          progress?: number | null
          reward_coins?: number | null
          reward_xp?: number
          target?: number
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "daily_missions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      friends: {
        Row: {
          created_at: string | null
          friend_id: string
          status: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          friend_id: string
          status?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          friend_id?: string
          status?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "friends_friend_id_fkey"
            columns: ["friend_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "friends_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      leaderboard_weekly: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          current_streak: number | null
          id: string
          rank_id: number | null
          rank_position: number | null
          user_id: string
          username: string
          week_start: string
          weekly_battles: number | null
          weekly_swipes: number | null
          weekly_xp: number | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          current_streak?: number | null
          id?: string
          rank_id?: number | null
          rank_position?: number | null
          user_id: string
          username: string
          week_start: string
          weekly_battles?: number | null
          weekly_swipes?: number | null
          weekly_xp?: number | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          current_streak?: number | null
          id?: string
          rank_id?: number | null
          rank_position?: number | null
          user_id?: string
          username?: string
          week_start?: string
          weekly_battles?: number | null
          weekly_swipes?: number | null
          weekly_xp?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "leaderboard_weekly_rank_id_fkey"
            columns: ["rank_id"]
            isOneToOne: false
            referencedRelation: "ranks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "leaderboard_weekly_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      lesson_words: {
        Row: {
          lesson_id: string
          order_index: number | null
          word_id: string
        }
        Insert: {
          lesson_id: string
          order_index?: number | null
          word_id: string
        }
        Update: {
          lesson_id?: string
          order_index?: number | null
          word_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "lesson_words_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "lessons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lesson_words_word_id_fkey"
            columns: ["word_id"]
            isOneToOne: false
            referencedRelation: "vocabulary_words"
            referencedColumns: ["id"]
          },
        ]
      }
      lessons: {
        Row: {
          category_id: string | null
          created_at: string | null
          description: string | null
          difficulty: number | null
          id: string
          is_active: boolean | null
          order_index: number | null
          title: string
          word_count: number | null
          xp_reward: number | null
        }
        Insert: {
          category_id?: string | null
          created_at?: string | null
          description?: string | null
          difficulty?: number | null
          id?: string
          is_active?: boolean | null
          order_index?: number | null
          title: string
          word_count?: number | null
          xp_reward?: number | null
        }
        Update: {
          category_id?: string | null
          created_at?: string | null
          description?: string | null
          difficulty?: number | null
          id?: string
          is_active?: boolean | null
          order_index?: number | null
          title?: string
          word_count?: number | null
          xp_reward?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "lessons_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          body: string | null
          created_at: string | null
          data: Json | null
          id: string
          is_push_sent: boolean | null
          is_read: boolean | null
          title: string
          type: string
          user_id: string
        }
        Insert: {
          body?: string | null
          created_at?: string | null
          data?: Json | null
          id?: string
          is_push_sent?: boolean | null
          is_read?: boolean | null
          title: string
          type: string
          user_id: string
        }
        Update: {
          body?: string | null
          created_at?: string | null
          data?: Json | null
          id?: string
          is_push_sent?: boolean | null
          is_read?: boolean | null
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          coins: number | null
          created_at: string | null
          current_streak: number | null
          gems: number | null
          highest_streak: number | null
          last_streak_date: string | null
          level: number | null
          lifetime_xp: number | null
          preferences: Json | null
          rank_id: number | null
          showcase_badges: string[] | null
          streak_freeze: number | null
          total_battles_played: number | null
          total_battles_won: number | null
          total_coins_earned: number | null
          total_words_learned: number | null
          updated_at: string | null
          user_id: string
          xp: number | null
        }
        Insert: {
          coins?: number | null
          created_at?: string | null
          current_streak?: number | null
          gems?: number | null
          highest_streak?: number | null
          last_streak_date?: string | null
          level?: number | null
          lifetime_xp?: number | null
          preferences?: Json | null
          rank_id?: number | null
          showcase_badges?: string[] | null
          streak_freeze?: number | null
          total_battles_played?: number | null
          total_battles_won?: number | null
          total_coins_earned?: number | null
          total_words_learned?: number | null
          updated_at?: string | null
          user_id: string
          xp?: number | null
        }
        Update: {
          coins?: number | null
          created_at?: string | null
          current_streak?: number | null
          gems?: number | null
          highest_streak?: number | null
          last_streak_date?: string | null
          level?: number | null
          lifetime_xp?: number | null
          preferences?: Json | null
          rank_id?: number | null
          showcase_badges?: string[] | null
          streak_freeze?: number | null
          total_battles_played?: number | null
          total_battles_won?: number | null
          total_coins_earned?: number | null
          total_words_learned?: number | null
          updated_at?: string | null
          user_id?: string
          xp?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_rank_id_fkey"
            columns: ["rank_id"]
            isOneToOne: false
            referencedRelation: "ranks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "profiles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      ranks: {
        Row: {
          color: string
          description: string | null
          icon: string
          id: number
          min_xp: number
          name: string
        }
        Insert: {
          color: string
          description?: string | null
          icon: string
          id: number
          min_xp: number
          name: string
        }
        Update: {
          color?: string
          description?: string | null
          icon?: string
          id?: number
          min_xp?: number
          name?: string
        }
        Relationships: []
      }
      referrals: {
        Row: {
          completed_at: string | null
          created_at: string | null
          id: string
          referred_id: string
          referrer_id: string
          reward_claimed: boolean | null
          status: string | null
        }
        Insert: {
          completed_at?: string | null
          created_at?: string | null
          id?: string
          referred_id: string
          referrer_id: string
          reward_claimed?: boolean | null
          status?: string | null
        }
        Update: {
          completed_at?: string | null
          created_at?: string | null
          id?: string
          referred_id?: string
          referrer_id?: string
          reward_claimed?: boolean | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "referrals_referred_id_fkey"
            columns: ["referred_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "referrals_referrer_id_fkey"
            columns: ["referrer_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      share_log: {
        Row: {
          card_url: string | null
          created_at: string | null
          id: string
          platform: string | null
          share_type: string
          user_id: string
        }
        Insert: {
          card_url?: string | null
          created_at?: string | null
          id?: string
          platform?: string | null
          share_type: string
          user_id: string
        }
        Update: {
          card_url?: string | null
          created_at?: string | null
          id?: string
          platform?: string | null
          share_type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "share_log_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      streak_log: {
        Row: {
          activity_date: string
          audio_count: number | null
          battle_count: number | null
          created_at: string | null
          frozen: boolean | null
          id: string
          local_date: string | null
          swipe_count: number | null
          timezone: string | null
          user_id: string
          xp_earned: number | null
        }
        Insert: {
          activity_date: string
          audio_count?: number | null
          battle_count?: number | null
          created_at?: string | null
          frozen?: boolean | null
          id?: string
          local_date?: string | null
          swipe_count?: number | null
          timezone?: string | null
          user_id: string
          xp_earned?: number | null
        }
        Update: {
          activity_date?: string
          audio_count?: number | null
          battle_count?: number | null
          created_at?: string | null
          frozen?: boolean | null
          id?: string
          local_date?: string | null
          swipe_count?: number | null
          timezone?: string | null
          user_id?: string
          xp_earned?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "streak_log_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      swipe_session_words: {
        Row: {
          action: string
          audio_played: boolean | null
          combo_at_time: number | null
          confidence_after: number | null
          confidence_before: number | null
          created_at: string | null
          id: string
          response_time_ms: number | null
          session_id: string
          swipe_velocity: number | null
          user_id: string
          word_id: string
          xp_earned: number | null
        }
        Insert: {
          action: string
          audio_played?: boolean | null
          combo_at_time?: number | null
          confidence_after?: number | null
          confidence_before?: number | null
          created_at?: string | null
          id?: string
          response_time_ms?: number | null
          session_id: string
          swipe_velocity?: number | null
          user_id: string
          word_id: string
          xp_earned?: number | null
        }
        Update: {
          action?: string
          audio_played?: boolean | null
          combo_at_time?: number | null
          confidence_after?: number | null
          confidence_before?: number | null
          created_at?: string | null
          id?: string
          response_time_ms?: number | null
          session_id?: string
          swipe_velocity?: number | null
          user_id?: string
          word_id?: string
          xp_earned?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "swipe_session_words_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "swipe_sessions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "swipe_session_words_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "swipe_session_words_word_id_fkey"
            columns: ["word_id"]
            isOneToOne: false
            referencedRelation: "vocabulary_words"
            referencedColumns: ["id"]
          },
        ]
      }
      swipe_sessions: {
        Row: {
          correct_count: number | null
          created_at: string | null
          device_info: Json | null
          duration_seconds: number | null
          ended_at: string | null
          id: string
          incorrect_count: number | null
          is_completed: boolean | null
          max_combo: number | null
          reveal_count: number | null
          started_at: string | null
          total_cards: number | null
          total_xp_earned: number | null
          user_id: string
          words_new: number | null
          words_reviewed: number | null
        }
        Insert: {
          correct_count?: number | null
          created_at?: string | null
          device_info?: Json | null
          duration_seconds?: number | null
          ended_at?: string | null
          id?: string
          incorrect_count?: number | null
          is_completed?: boolean | null
          max_combo?: number | null
          reveal_count?: number | null
          started_at?: string | null
          total_cards?: number | null
          total_xp_earned?: number | null
          user_id: string
          words_new?: number | null
          words_reviewed?: number | null
        }
        Update: {
          correct_count?: number | null
          created_at?: string | null
          device_info?: Json | null
          duration_seconds?: number | null
          ended_at?: string | null
          id?: string
          incorrect_count?: number | null
          is_completed?: boolean | null
          max_combo?: number | null
          reveal_count?: number | null
          started_at?: string | null
          total_cards?: number | null
          total_xp_earned?: number | null
          user_id?: string
          words_new?: number | null
          words_reviewed?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "swipe_sessions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      user_badges: {
        Row: {
          badge_id: string
          created_at: string | null
          earned_at: string | null
          is_earned: boolean | null
          is_new: boolean | null
          progress: number | null
          user_id: string
        }
        Insert: {
          badge_id: string
          created_at?: string | null
          earned_at?: string | null
          is_earned?: boolean | null
          is_new?: boolean | null
          progress?: number | null
          user_id: string
        }
        Update: {
          badge_id?: string
          created_at?: string | null
          earned_at?: string | null
          is_earned?: boolean | null
          is_new?: boolean | null
          progress?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_badges_badge_id_fkey"
            columns: ["badge_id"]
            isOneToOne: false
            referencedRelation: "badges"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_badges_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      user_sessions: {
        Row: {
          device_info: Json | null
          ended_at: string | null
          id: string
          ip_address: string | null
          is_active: boolean | null
          started_at: string | null
          user_agent: string | null
          user_id: string
        }
        Insert: {
          device_info?: Json | null
          ended_at?: string | null
          id?: string
          ip_address?: string | null
          is_active?: boolean | null
          started_at?: string | null
          user_agent?: string | null
          user_id: string
        }
        Update: {
          device_info?: Json | null
          ended_at?: string | null
          id?: string
          ip_address?: string | null
          is_active?: boolean | null
          started_at?: string | null
          user_agent?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_sessions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      user_word_progress: {
        Row: {
          audio_played_count: number | null
          combo_max_achieved: number | null
          confidence: number | null
          created_at: string | null
          id: string
          is_learned: boolean | null
          is_mastered: boolean | null
          last_reviewed_at: string | null
          next_review_at: string | null
          swipe_left_count: number | null
          swipe_right_count: number | null
          updated_at: string | null
          user_id: string
          word_id: string
        }
        Insert: {
          audio_played_count?: number | null
          combo_max_achieved?: number | null
          confidence?: number | null
          created_at?: string | null
          id?: string
          is_learned?: boolean | null
          is_mastered?: boolean | null
          last_reviewed_at?: string | null
          next_review_at?: string | null
          swipe_left_count?: number | null
          swipe_right_count?: number | null
          updated_at?: string | null
          user_id: string
          word_id: string
        }
        Update: {
          audio_played_count?: number | null
          combo_max_achieved?: number | null
          confidence?: number | null
          created_at?: string | null
          id?: string
          is_learned?: boolean | null
          is_mastered?: boolean | null
          last_reviewed_at?: string | null
          next_review_at?: string | null
          swipe_left_count?: number | null
          swipe_right_count?: number | null
          updated_at?: string | null
          user_id?: string
          word_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_word_progress_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_word_progress_word_id_fkey"
            columns: ["word_id"]
            isOneToOne: false
            referencedRelation: "vocabulary_words"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          deleted_at: string | null
          email: string | null
          id: string
          is_active: boolean | null
          is_guest: boolean | null
          last_active_at: string | null
          last_login_at: string | null
          metadata: Json | null
          referral_code: string
          updated_at: string | null
          username: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          deleted_at?: string | null
          email?: string | null
          id?: string
          is_active?: boolean | null
          is_guest?: boolean | null
          last_active_at?: string | null
          last_login_at?: string | null
          metadata?: Json | null
          referral_code: string
          updated_at?: string | null
          username: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          deleted_at?: string | null
          email?: string | null
          id?: string
          is_active?: boolean | null
          is_guest?: boolean | null
          last_active_at?: string | null
          last_login_at?: string | null
          metadata?: Json | null
          referral_code?: string
          updated_at?: string | null
          username?: string
        }
        Relationships: []
      }
      vocabulary_words: {
        Row: {
          arabic_text: string
          audio_duration_ms: number | null
          audio_url: string | null
          category_id: string | null
          created_at: string | null
          difficulty: number | null
          example_meaning: string | null
          example_sentence: string | null
          frequency_score: number | null
          id: string
          is_active: boolean | null
          meaning_en: string | null
          meaning_id: string
          root_letters: string | null
          transliteration: string
          updated_at: string | null
          vowelled_text: string | null
          word_type: string | null
        }
        Insert: {
          arabic_text: string
          audio_duration_ms?: number | null
          audio_url?: string | null
          category_id?: string | null
          created_at?: string | null
          difficulty?: number | null
          example_meaning?: string | null
          example_sentence?: string | null
          frequency_score?: number | null
          id?: string
          is_active?: boolean | null
          meaning_en?: string | null
          meaning_id: string
          root_letters?: string | null
          transliteration: string
          updated_at?: string | null
          vowelled_text?: string | null
          word_type?: string | null
        }
        Update: {
          arabic_text?: string
          audio_duration_ms?: number | null
          audio_url?: string | null
          category_id?: string | null
          created_at?: string | null
          difficulty?: number | null
          example_meaning?: string | null
          example_sentence?: string | null
          frequency_score?: number | null
          id?: string
          is_active?: boolean | null
          meaning_en?: string | null
          meaning_id?: string
          root_letters?: string | null
          transliteration?: string
          updated_at?: string | null
          vowelled_text?: string | null
          word_type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "vocabulary_words_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      xp_transactions: {
        Row: {
          amount: number
          balance_after: number
          balance_before: number
          created_at: string | null
          description: string | null
          id: string
          metadata: Json | null
          source: string
          source_id: string | null
          user_id: string
        }
        Insert: {
          amount: number
          balance_after: number
          balance_before: number
          created_at?: string | null
          description?: string | null
          id?: string
          metadata?: Json | null
          source: string
          source_id?: string | null
          user_id: string
        }
        Update: {
          amount?: number
          balance_after?: number
          balance_before?: number
          created_at?: string | null
          description?: string | null
          id?: string
          metadata?: Json | null
          source?: string
          source_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "xp_transactions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      top_up_requests: {
        Row: {
          admin_notes: string | null
          amount: number
          created_at: string | null
          id: string
          package: string
          price_rp: number
          proof_url: string
          reviewed_at: string | null
          status: string
          user_id: string
        }
        Insert: {
          admin_notes?: string | null
          amount: number
          created_at?: string | null
          id?: string
          package: string
          price_rp: number
          proof_url: string
          reviewed_at?: string | null
          status?: string
          user_id: string
        }
        Update: {
          admin_notes?: string | null
          amount?: number
          created_at?: string | null
          id?: string
          package?: string
          price_rp?: number
          proof_url?: string
          reviewed_at?: string | null
          status?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "top_up_requests_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      leaderboard_friends: {
        Row: {
          avatar_url: string | null
          current_streak: number | null
          friend_id: string | null
          level: number | null
          rank_id: number | null
          total_words_learned: number | null
          username: string | null
          viewer_id: string | null
          xp: number | null
        }
        Relationships: []
      }
    }
    Functions: {
      award_badge: {
        Args: { p_badge_slug: string; p_user_id: string }
        Returns: boolean
      }
      calculate_level: { Args: { p_xp: number }; Returns: number }
      calculate_next_review: { Args: { confidence: number }; Returns: string }
      check_rank_up: {
        Args: { p_user_id: string }
        Returns: {
          new_rank_id: number
          new_rank_name: string
          rank_up: boolean
        }[]
      }
      check_streak_badge: {
        Args: { p_streak: number; p_user_id: string }
        Returns: undefined
      }
      earn_xp: {
        Args: {
          p_amount: number
          p_description?: string
          p_metadata?: Json
          p_source: string
          p_source_id?: string
          p_user_id: string
        }
        Returns: {
          leveled_up: boolean
          new_level: number
          new_xp: number
          rank_updated: boolean
        }[]
      }
      get_due_words: {
        Args: { p_limit?: number; p_user_id: string }
        Returns: {
          arabic_text: string
          audio_url: string
          confidence: number
          is_new: boolean
          meaning_id: string
          transliteration: string
          word_id: string
        }[]
      }
      insert_notification: {
        Args: { p_data?: Json; p_type: string; p_user_id: string }
        Returns: string
      }
      credit_gems: {
        Args: { p_user_id: string; p_amount: number }
        Returns: number
      }
      record_daily_activity: {
        Args: {
          p_audio_count?: number
          p_battle_count?: number
          p_swipe_count?: number
          p_timezone?: string
          p_user_id: string
          p_xp_earned?: number
        }
        Returns: {
          is_new_streak: boolean
          streak_count: number
          streak_milestone: number
        }[]
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {},
  },
} as const

