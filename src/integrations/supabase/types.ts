export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      balderdash_options: {
        Row: {
          answer: string
          created_at: string
          id: string
          is_correct: boolean
          player_id: string | null
          room_id: string
          round_number: number
          sort_order: number
        }
        Insert: {
          answer: string
          created_at?: string
          id?: string
          is_correct?: boolean
          player_id?: string | null
          room_id: string
          round_number: number
          sort_order?: number
        }
        Update: {
          answer?: string
          created_at?: string
          id?: string
          is_correct?: boolean
          player_id?: string | null
          room_id?: string
          round_number?: number
          sort_order?: number
        }
        Relationships: [
          {
            foreignKeyName: "balderdash_options_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "balderdash_players"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "balderdash_options_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "balderdash_rooms"
            referencedColumns: ["id"]
          },
        ]
      }
      balderdash_players: {
        Row: {
          avatar: Json | null
          id: string
          is_connected: boolean
          is_ready: boolean
          joined_at: string
          name: string
          room_id: string
          score: number
          user_id: string
        }
        Insert: {
          avatar?: Json | null
          id?: string
          is_connected?: boolean
          is_ready?: boolean
          joined_at?: string
          name: string
          room_id: string
          score?: number
          user_id: string
        }
        Update: {
          avatar?: Json | null
          id?: string
          is_connected?: boolean
          is_ready?: boolean
          joined_at?: string
          name?: string
          room_id?: string
          score?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "balderdash_players_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "balderdash_rooms"
            referencedColumns: ["id"]
          },
        ]
      }
      balderdash_prompts: {
        Row: {
          correct_answer: string
          deck: string
          id: string
          term: string
        }
        Insert: {
          correct_answer: string
          deck: string
          id?: string
          term: string
        }
        Update: {
          correct_answer?: string
          deck?: string
          id?: string
          term?: string
        }
        Relationships: []
      }
      balderdash_rooms: {
        Row: {
          created_at: string
          current_prompt_id: string | null
          deck: string | null
          id: string
          last_activity_at: string
          max_players: number
          max_rounds: number
          name: string
          owner_id: string
          phase: string
          room_code: string
          round_number: number
          selector_player_id: string | null
          updated_at: string
          used_prompt_ids: string[]
        }
        Insert: {
          created_at?: string
          current_prompt_id?: string | null
          deck?: string | null
          id?: string
          last_activity_at?: string
          max_players?: number
          max_rounds?: number
          name: string
          owner_id: string
          phase?: string
          room_code: string
          round_number?: number
          selector_player_id?: string | null
          updated_at?: string
          used_prompt_ids?: string[]
        }
        Update: {
          created_at?: string
          current_prompt_id?: string | null
          deck?: string | null
          id?: string
          last_activity_at?: string
          max_players?: number
          max_rounds?: number
          name?: string
          owner_id?: string
          phase?: string
          room_code?: string
          round_number?: number
          selector_player_id?: string | null
          updated_at?: string
          used_prompt_ids?: string[]
        }
        Relationships: []
      }
      balderdash_submissions: {
        Row: {
          answer: string
          created_at: string
          id: string
          player_id: string
          room_id: string
          round_number: number
        }
        Insert: {
          answer: string
          created_at?: string
          id?: string
          player_id: string
          room_id: string
          round_number: number
        }
        Update: {
          answer?: string
          created_at?: string
          id?: string
          player_id?: string
          room_id?: string
          round_number?: number
        }
        Relationships: [
          {
            foreignKeyName: "balderdash_submissions_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "balderdash_players"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "balderdash_submissions_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "balderdash_rooms"
            referencedColumns: ["id"]
          },
        ]
      }
      balderdash_votes: {
        Row: {
          created_at: string
          id: string
          option_id: string
          player_id: string
          room_id: string
          round_number: number
        }
        Insert: {
          created_at?: string
          id?: string
          option_id: string
          player_id: string
          room_id: string
          round_number: number
        }
        Update: {
          created_at?: string
          id?: string
          option_id?: string
          player_id?: string
          room_id?: string
          round_number?: number
        }
        Relationships: [
          {
            foreignKeyName: "balderdash_votes_option_id_fkey"
            columns: ["option_id"]
            isOneToOne: false
            referencedRelation: "balderdash_options"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "balderdash_votes_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "balderdash_players"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "balderdash_votes_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "balderdash_rooms"
            referencedColumns: ["id"]
          },
        ]
      }
      chess_moves: {
        Row: {
          created_at: string
          fen: string
          id: string
          move_number: number
          player_id: string
          room_id: string
          san: string
          uci: string
        }
        Insert: {
          created_at?: string
          fen: string
          id?: string
          move_number: number
          player_id: string
          room_id: string
          san: string
          uci: string
        }
        Update: {
          created_at?: string
          fen?: string
          id?: string
          move_number?: number
          player_id?: string
          room_id?: string
          san?: string
          uci?: string
        }
        Relationships: [
          {
            foreignKeyName: "chess_moves_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "chess_players"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chess_moves_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "chess_rooms"
            referencedColumns: ["id"]
          },
        ]
      }
      chess_players: {
        Row: {
          avatar: Json | null
          color: string
          id: string
          is_connected: boolean
          joined_at: string
          name: string
          room_id: string
          user_id: string
        }
        Insert: {
          avatar?: Json | null
          color: string
          id?: string
          is_connected?: boolean
          joined_at?: string
          name: string
          room_id: string
          user_id: string
        }
        Update: {
          avatar?: Json | null
          color?: string
          id?: string
          is_connected?: boolean
          joined_at?: string
          name?: string
          room_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "chess_players_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "chess_rooms"
            referencedColumns: ["id"]
          },
        ]
      }
      chess_rooms: {
        Row: {
          black_id: string | null
          created_at: string
          current_fen: string
          id: string
          last_activity_at: string
          name: string
          owner_id: string
          pgn: string
          result: string | null
          room_code: string
          status: string
          updated_at: string
          white_id: string | null
        }
        Insert: {
          black_id?: string | null
          created_at?: string
          current_fen?: string
          id?: string
          last_activity_at?: string
          name: string
          owner_id: string
          pgn?: string
          result?: string | null
          room_code: string
          status?: string
          updated_at?: string
          white_id?: string | null
        }
        Update: {
          black_id?: string | null
          created_at?: string
          current_fen?: string
          id?: string
          last_activity_at?: string
          name?: string
          owner_id?: string
          pgn?: string
          result?: string | null
          room_code?: string
          status?: string
          updated_at?: string
          white_id?: string | null
        }
        Relationships: []
      }
      game_canvas_checkpoints: {
        Row: {
          created_at: string
          fabric_json: Json
          id: string
          room_id: string
          round_number: number
        }
        Insert: {
          created_at?: string
          fabric_json: Json
          id?: string
          room_id: string
          round_number: number
        }
        Update: {
          created_at?: string
          fabric_json?: Json
          id?: string
          room_id?: string
          round_number?: number
        }
        Relationships: [
          {
            foreignKeyName: "game_canvas_checkpoints_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "game_rooms"
            referencedColumns: ["id"]
          },
        ]
      }
      game_room_players: {
        Row: {
          avatar: Json | null
          created_at: string
          has_guessed: boolean
          id: string
          is_connected: boolean
          is_ready: boolean
          name: string
          room_id: string
          score: number
          user_id: string | null
        }
        Insert: {
          avatar?: Json | null
          created_at?: string
          has_guessed?: boolean
          id?: string
          is_connected?: boolean
          is_ready?: boolean
          name: string
          room_id: string
          score?: number
          user_id?: string | null
        }
        Update: {
          avatar?: Json | null
          created_at?: string
          has_guessed?: boolean
          id?: string
          is_connected?: boolean
          is_ready?: boolean
          name?: string
          room_id?: string
          score?: number
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "game_room_players_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "game_rooms"
            referencedColumns: ["id"]
          },
        ]
      }
      game_rooms: {
        Row: {
          created_at: string
          current_drawer_id: string | null
          current_word_id: string | null
          game_pin: string
          id: string
          is_game_active: boolean
          last_activity_at: string
          max_players: number
          max_rounds: number
          name: string
          owner_id: string | null
          round_deadline_at: string | null
          round_number: number
          round_time: number
          updated_at: string
          word_history: string[] | null
          word_pack: string | null
        }
        Insert: {
          created_at?: string
          current_drawer_id?: string | null
          current_word_id?: string | null
          game_pin: string
          id?: string
          is_game_active?: boolean
          last_activity_at?: string
          max_players?: number
          max_rounds?: number
          name: string
          owner_id?: string | null
          round_deadline_at?: string | null
          round_number?: number
          round_time?: number
          updated_at?: string
          word_history?: string[] | null
          word_pack?: string | null
        }
        Update: {
          created_at?: string
          current_drawer_id?: string | null
          current_word_id?: string | null
          game_pin?: string
          id?: string
          is_game_active?: boolean
          last_activity_at?: string
          max_players?: number
          max_rounds?: number
          name?: string
          owner_id?: string | null
          round_deadline_at?: string | null
          round_number?: number
          round_time?: number
          updated_at?: string
          word_history?: string[] | null
          word_pack?: string | null
        }
        Relationships: []
      }
      game_round_secrets: {
        Row: {
          created_at: string
          id: string
          room_id: string
          round_number: number
          word: string
          word_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          room_id: string
          round_number: number
          word: string
          word_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          room_id?: string
          round_number?: number
          word?: string
          word_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "game_round_secrets_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "game_rooms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "game_round_secrets_word_id_fkey"
            columns: ["word_id"]
            isOneToOne: false
            referencedRelation: "game_words"
            referencedColumns: ["id"]
          },
        ]
      }
      game_rounds: {
        Row: {
          created_at: string
          drawer_id: string
          drawer_name: string
          duration_ms: number
          finished_by: string
          id: string
          room_id: string
          round_number: number
          word: string
        }
        Insert: {
          created_at?: string
          drawer_id: string
          drawer_name: string
          duration_ms: number
          finished_by?: string
          id?: string
          room_id: string
          round_number: number
          word: string
        }
        Update: {
          created_at?: string
          drawer_id?: string
          drawer_name?: string
          duration_ms?: number
          finished_by?: string
          id?: string
          room_id?: string
          round_number?: number
          word?: string
        }
        Relationships: [
          {
            foreignKeyName: "game_rounds_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "game_rooms"
            referencedColumns: ["id"]
          },
        ]
      }
      game_scores: {
        Row: {
          created_at: string
          game_id: string
          id: string
          metadata: Json | null
          score: number
          user_id: string
        }
        Insert: {
          created_at?: string
          game_id: string
          id?: string
          metadata?: Json | null
          score: number
          user_id: string
        }
        Update: {
          created_at?: string
          game_id?: string
          id?: string
          metadata?: Json | null
          score?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "game_scores_game_id_fkey"
            columns: ["game_id"]
            isOneToOne: false
            referencedRelation: "games"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "game_scores_user_id_profiles_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      game_words: {
        Row: {
          id: string
          pack: string
          word: string
        }
        Insert: {
          id?: string
          pack: string
          word: string
        }
        Update: {
          id?: string
          pack?: string
          word?: string
        }
        Relationships: []
      }
      games: {
        Row: {
          accent_color: string | null
          category: string
          created_at: string
          description: string
          id: string
          is_active: boolean
          slug: string
          thumbnail_url: string | null
          title: string
        }
        Insert: {
          accent_color?: string | null
          category: string
          created_at?: string
          description: string
          id?: string
          is_active?: boolean
          slug: string
          thumbnail_url?: string | null
          title: string
        }
        Update: {
          accent_color?: string | null
          category?: string
          created_at?: string
          description?: string
          id?: string
          is_active?: boolean
          slug?: string
          thumbnail_url?: string | null
          title?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_config: Json | null
          created_at: string
          id: string
          updated_at: string
          username: string
        }
        Insert: {
          avatar_config?: Json | null
          created_at?: string
          id: string
          updated_at?: string
          username: string
        }
        Update: {
          avatar_config?: Json | null
          created_at?: string
          id?: string
          updated_at?: string
          username?: string
        }
        Relationships: []
      }
      scribble_battle_checkpoints: {
        Row: {
          created_at: string
          fabric_json: Json
          id: string
          room_id: string
          round_number: number
          team: number
        }
        Insert: {
          created_at?: string
          fabric_json: Json
          id?: string
          room_id: string
          round_number: number
          team: number
        }
        Update: {
          created_at?: string
          fabric_json?: Json
          id?: string
          room_id?: string
          round_number?: number
          team?: number
        }
        Relationships: [
          {
            foreignKeyName: "scribble_battle_checkpoints_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "scribble_battle_rooms"
            referencedColumns: ["id"]
          },
        ]
      }
      scribble_battle_players: {
        Row: {
          avatar: Json | null
          created_at: string
          has_guessed: boolean
          id: string
          is_connected: boolean
          is_ready: boolean
          name: string
          room_id: string
          score: number
          team: number
          user_id: string | null
          win_streak: number
        }
        Insert: {
          avatar?: Json | null
          created_at?: string
          has_guessed?: boolean
          id?: string
          is_connected?: boolean
          is_ready?: boolean
          name: string
          room_id: string
          score?: number
          team: number
          user_id?: string | null
          win_streak?: number
        }
        Update: {
          avatar?: Json | null
          created_at?: string
          has_guessed?: boolean
          id?: string
          is_connected?: boolean
          is_ready?: boolean
          name?: string
          room_id?: string
          score?: number
          team?: number
          user_id?: string | null
          win_streak?: number
        }
        Relationships: [
          {
            foreignKeyName: "scribble_battle_players_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "scribble_battle_rooms"
            referencedColumns: ["id"]
          },
        ]
      }
      scribble_battle_rooms: {
        Row: {
          created_at: string
          game_pin: string
          id: string
          is_game_active: boolean
          last_activity_at: string
          max_regular_rounds: number
          name: string
          owner_id: string | null
          phase: string
          round_deadline_at: string | null
          round_number: number
          round_time: number
          team1_drawer_id: string | null
          team1_final_progress: number
          team1_score: number
          team2_drawer_id: string | null
          team2_final_progress: number
          team2_score: number
          updated_at: string
          word_history: string[] | null
          word_pack: string | null
        }
        Insert: {
          created_at?: string
          game_pin: string
          id?: string
          is_game_active?: boolean
          last_activity_at?: string
          max_regular_rounds?: number
          name: string
          owner_id?: string | null
          phase?: string
          round_deadline_at?: string | null
          round_number?: number
          round_time?: number
          team1_drawer_id?: string | null
          team1_final_progress?: number
          team1_score?: number
          team2_drawer_id?: string | null
          team2_final_progress?: number
          team2_score?: number
          updated_at?: string
          word_history?: string[] | null
          word_pack?: string | null
        }
        Update: {
          created_at?: string
          game_pin?: string
          id?: string
          is_game_active?: boolean
          last_activity_at?: string
          max_regular_rounds?: number
          name?: string
          owner_id?: string | null
          phase?: string
          round_deadline_at?: string | null
          round_number?: number
          round_time?: number
          team1_drawer_id?: string | null
          team1_final_progress?: number
          team1_score?: number
          team2_drawer_id?: string | null
          team2_final_progress?: number
          team2_score?: number
          updated_at?: string
          word_history?: string[] | null
          word_pack?: string | null
        }
        Relationships: []
      }
      scribble_battle_round_secrets: {
        Row: {
          created_at: string
          id: string
          room_id: string
          round_number: number
          word: string
        }
        Insert: {
          created_at?: string
          id?: string
          room_id: string
          round_number: number
          word: string
        }
        Update: {
          created_at?: string
          id?: string
          room_id?: string
          round_number?: number
          word?: string
        }
        Relationships: [
          {
            foreignKeyName: "scribble_battle_round_secrets_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "scribble_battle_rooms"
            referencedColumns: ["id"]
          },
        ]
      }
      scribble_battle_rounds: {
        Row: {
          correct_guesser_id: string | null
          created_at: string
          duration_ms: number
          finished_by: string
          id: string
          phase: string
          room_id: string
          round_number: number
          team1_drawer_id: string
          team2_drawer_id: string
          winning_team: number | null
          word: string
        }
        Insert: {
          correct_guesser_id?: string | null
          created_at?: string
          duration_ms: number
          finished_by?: string
          id?: string
          phase: string
          room_id: string
          round_number: number
          team1_drawer_id: string
          team2_drawer_id: string
          winning_team?: number | null
          word: string
        }
        Update: {
          correct_guesser_id?: string | null
          created_at?: string
          duration_ms?: number
          finished_by?: string
          id?: string
          phase?: string
          room_id?: string
          round_number?: number
          team1_drawer_id?: string
          team2_drawer_id?: string
          winning_team?: number | null
          word?: string
        }
        Relationships: [
          {
            foreignKeyName: "scribble_battle_rounds_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "scribble_battle_rooms"
            referencedColumns: ["id"]
          },
        ]
      }
      trivia_answers: {
        Row: {
          created_at: string
          id: string
          is_correct: boolean
          player_id: string
          points: number
          question_id: string
          room_id: string
          round_number: number
          selected_option_id: string | null
          time_ms: number
        }
        Insert: {
          created_at?: string
          id?: string
          is_correct?: boolean
          player_id: string
          points?: number
          question_id: string
          room_id: string
          round_number: number
          selected_option_id?: string | null
          time_ms?: number
        }
        Update: {
          created_at?: string
          id?: string
          is_correct?: boolean
          player_id?: string
          points?: number
          question_id?: string
          room_id?: string
          round_number?: number
          selected_option_id?: string | null
          time_ms?: number
        }
        Relationships: [
          {
            foreignKeyName: "trivia_answers_player_fk"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "trivia_players"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "trivia_answers_question_fk"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "trivia_questions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "trivia_answers_room_fk"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "trivia_rooms"
            referencedColumns: ["id"]
          },
        ]
      }
      trivia_players: {
        Row: {
          avatar: Json | null
          id: string
          is_connected: boolean
          is_ready: boolean
          joined_at: string
          name: string
          room_id: string
          score: number
          streak: number
          user_id: string
        }
        Insert: {
          avatar?: Json | null
          id?: string
          is_connected?: boolean
          is_ready?: boolean
          joined_at?: string
          name: string
          room_id: string
          score?: number
          streak?: number
          user_id: string
        }
        Update: {
          avatar?: Json | null
          id?: string
          is_connected?: boolean
          is_ready?: boolean
          joined_at?: string
          name?: string
          room_id?: string
          score?: number
          streak?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "trivia_players_room_fk"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "trivia_rooms"
            referencedColumns: ["id"]
          },
        ]
      }
      trivia_questions: {
        Row: {
          correct_option_id: string
          id: string
          options: Json
          question_text: string
          quiz_id: string
          time_limit: number
        }
        Insert: {
          correct_option_id: string
          id?: string
          options: Json
          question_text: string
          quiz_id: string
          time_limit?: number
        }
        Update: {
          correct_option_id?: string
          id?: string
          options?: Json
          question_text?: string
          quiz_id?: string
          time_limit?: number
        }
        Relationships: []
      }
      trivia_rooms: {
        Row: {
          category_id: string | null
          created_at: string
          current_question_id: string | null
          id: string
          last_activity_at: string
          max_players: number
          max_rounds: number
          name: string
          owner_id: string
          phase: string
          room_code: string
          round_deadline_at: string | null
          round_number: number
          updated_at: string
          used_question_ids: string[]
        }
        Insert: {
          category_id?: string | null
          created_at?: string
          current_question_id?: string | null
          id?: string
          last_activity_at?: string
          max_players?: number
          max_rounds?: number
          name: string
          owner_id: string
          phase?: string
          room_code: string
          round_deadline_at?: string | null
          round_number?: number
          updated_at?: string
          used_question_ids?: string[]
        }
        Update: {
          category_id?: string | null
          created_at?: string
          current_question_id?: string | null
          id?: string
          last_activity_at?: string
          max_players?: number
          max_rounds?: number
          name?: string
          owner_id?: string
          phase?: string
          room_code?: string
          round_deadline_at?: string | null
          round_number?: number
          updated_at?: string
          used_question_ids?: string[]
        }
        Relationships: [
          {
            foreignKeyName: "trivia_rooms_question_fk"
            columns: ["current_question_id"]
            isOneToOne: false
            referencedRelation: "trivia_questions"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      advance_paint_round: { Args: { p_room_id: string }; Returns: Json }
      advance_sb_final_word: {
        Args: { p_room_id: string; p_team: number }
        Returns: Json
      }
      advance_sb_round: { Args: { p_room_id: string }; Returns: Json }
      advance_trivia_question: { Args: { p_room_id: string }; Returns: Json }
      all_guessers_finished: { Args: { room_id: string }; Returns: boolean }
      choose_balderdash_deck: {
        Args: { p_deck: string; p_room_id: string }
        Returns: Json
      }
      compute_trivia_points: {
        Args: { p_streak: number; p_time_left: number; p_time_limit: number }
        Returns: number
      }
      create_balderdash_room: {
        Args: {
          p_max_players?: number
          p_max_rounds?: number
          p_room_name?: string
        }
        Returns: Json
      }
      create_chess_room: { Args: { p_room_name?: string }; Returns: Json }
      create_paint_room: {
        Args: {
          max_players?: number
          max_rounds?: number
          room_name: string
          round_time?: number
          word_pack?: string
        }
        Returns: Json
      }
      create_scribble_battle_room: {
        Args: {
          max_regular_rounds?: number
          room_name: string
          round_time?: number
          word_pack?: string
        }
        Returns: Json
      }
      create_trivia_room: {
        Args: { p_max_rounds?: number; p_room_name?: string }
        Returns: Json
      }
      finish_chess_game: {
        Args: { p_result: string; p_room_id: string }
        Returns: Json
      }
      generate_balderdash_code: { Args: never; Returns: string }
      generate_chess_code: { Args: never; Returns: string }
      generate_game_pin: { Args: never; Returns: string }
      generate_trivia_code: { Args: never; Returns: string }
      get_balderdash_room_state: { Args: { p_room_id: string }; Returns: Json }
      get_canvas_checkpoint: {
        Args: { room_id: string; round_number: number }
        Returns: Json
      }
      get_chess_room_state: { Args: { p_room_id: string }; Returns: Json }
      get_leaderboard_standings: {
        Args: { p_days?: number; p_limit?: number }
        Returns: {
          avatar_config: Json
          best_game_slug: string
          best_game_title: string
          best_score: number
          last_played_at: string
          submissions: number
          total_score: number
          user_id: string
          username: string
        }[]
      }
      get_paint_room_state: { Args: { room_id: string }; Returns: Json }
      get_random_word: { Args: { pack: string }; Returns: string }
      get_sb_room_state: { Args: { room_id: string }; Returns: Json }
      get_trivia_room_state: { Args: { p_room_id: string }; Returns: Json }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      join_balderdash_room: { Args: { p_room_code: string }; Returns: Json }
      join_chess_room: { Args: { p_room_code: string }; Returns: Json }
      join_paint_room: { Args: { p_game_pin: string }; Returns: Json }
      join_scribble_battle_room: {
        Args: { p_game_pin: string; p_team?: number }
        Returns: Json
      }
      join_trivia_room: { Args: { p_room_code: string }; Returns: Json }
      leave_balderdash_room: { Args: { p_room_id: string }; Returns: Json }
      leave_chess_room: { Args: { p_room_id: string }; Returns: Json }
      leave_paint_room: { Args: { p_room_id: string }; Returns: Json }
      leave_scribble_battle_room: { Args: { p_room_id: string }; Returns: Json }
      leave_trivia_room: { Args: { p_room_id: string }; Returns: Json }
      make_chess_move: {
        Args: {
          p_move_san: string
          p_move_uci: string
          p_result_fen: string
          p_room_id: string
        }
        Returns: Json
      }
      next_balderdash_round: { Args: { p_room_id: string }; Returns: Json }
      save_canvas_checkpoint: {
        Args: { fabric_json: Json; room_id: string; round_number: number }
        Returns: Json
      }
      sb_round_resolved: { Args: { p_room_id: string }; Returns: boolean }
      select_trivia_category: {
        Args: { p_category_id: string; p_room_id: string }
        Returns: Json
      }
      set_balderdash_ready: {
        Args: { p_is_ready: boolean; p_room_id: string }
        Returns: Json
      }
      set_player_ready: {
        Args: { is_ready: boolean; room_id: string }
        Returns: Json
      }
      set_sb_player_ready: {
        Args: { is_ready: boolean; room_id: string }
        Returns: Json
      }
      set_trivia_ready: {
        Args: { p_is_ready: boolean; p_room_id: string }
        Returns: Json
      }
      start_balderdash_room: { Args: { p_room_id: string }; Returns: Json }
      start_chess_game: { Args: { p_room_id: string }; Returns: Json }
      start_paint_game: { Args: { p_room_id: string }; Returns: Json }
      start_scribble_battle: { Args: { p_room_id: string }; Returns: Json }
      start_trivia_game: { Args: { p_room_id: string }; Returns: Json }
      submit_balderdash_answer: {
        Args: { p_answer: string; p_room_id: string }
        Returns: Json
      }
      submit_paint_guess: {
        Args: { p_guess: string; p_room_id: string }
        Returns: Json
      }
      submit_sb_guess: {
        Args: { p_guess: string; p_room_id: string }
        Returns: Json
      }
      submit_trivia_answer: {
        Args: {
          p_question_id: string
          p_room_id: string
          p_selected_option_id: string
          p_time_ms: number
        }
        Returns: Json
      }
      switch_sb_team: {
        Args: { new_team: number; room_id: string }
        Returns: Json
      }
      vote_balderdash_answer: {
        Args: { p_option_id: string; p_room_id: string }
        Returns: Json
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
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
  public: {
    Enums: {
      app_role: ["admin", "moderator", "user"],
    },
  },
} as const
