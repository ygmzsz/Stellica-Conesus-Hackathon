export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          username: string | null
          full_name: string | null
          avatar_url: string | null
          stellar_public_key: string | null
          has_two_factor_enabled: boolean
          has_biometric_enabled: boolean
          discord_id: string | null
          discord_username: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          username?: string | null
          full_name?: string | null
          avatar_url?: string | null
          stellar_public_key?: string | null
          has_two_factor_enabled?: boolean
          has_biometric_enabled?: boolean
          discord_id?: string | null
          discord_username?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          username?: string | null
          full_name?: string | null
          avatar_url?: string | null
          stellar_public_key?: string | null
          has_two_factor_enabled?: boolean
          has_biometric_enabled?: boolean
          discord_id?: string | null
          discord_username?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      holdings: {
        Row: {
          id: string
          user_id: string
          crypto_id: string
          symbol: string
          amount: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          crypto_id: string
          symbol: string
          amount: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          crypto_id?: string
          symbol?: string
          amount?: number
          created_at?: string
          updated_at?: string
        }
      }
      transactions: {
        Row: {
          id: string
          user_id: string
          type: "buy" | "sell" | "deposit" | "withdrawal"
          crypto_id: string
          symbol: string
          amount: number
          price_usd: number
          total_usd: number
          status: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          type: "buy" | "sell" | "deposit" | "withdrawal"
          crypto_id: string
          symbol: string
          amount: number
          price_usd: number
          total_usd: number
          status?: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          type?: "buy" | "sell" | "deposit" | "withdrawal"
          crypto_id?: string
          symbol?: string
          amount?: number
          price_usd?: number
          total_usd?: number
          status?: string
          created_at?: string
        }
      }
      thresholds: {
        Row: {
          id: string
          user_id: string
          crypto_id: string
          type: "buy" | "sell"
          condition: "above" | "below"
          price: number
          amount: number
          notify_email: boolean
          notify_push: boolean
          notify_discord: boolean
          is_active: boolean
          triggered_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          crypto_id: string
          type: "buy" | "sell"
          condition: "above" | "below"
          price: number
          amount: number
          notify_email?: boolean
          notify_push?: boolean
          notify_discord?: boolean
          is_active?: boolean
          triggered_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          crypto_id?: string
          type?: "buy" | "sell"
          condition?: "above" | "below"
          price?: number
          amount?: number
          notify_email?: boolean
          notify_push?: boolean
          notify_discord?: boolean
          is_active?: boolean
          triggered_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      discord_settings: {
        Row: {
          user_id: string
          is_enabled: boolean
          price_alerts: boolean
          transaction_updates: boolean
          market_summaries: boolean
          threshold_alerts: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          user_id: string
          is_enabled?: boolean
          price_alerts?: boolean
          transaction_updates?: boolean
          market_summaries?: boolean
          threshold_alerts?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          user_id?: string
          is_enabled?: boolean
          price_alerts?: boolean
          transaction_updates?: boolean
          market_summaries?: boolean
          threshold_alerts?: boolean
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
