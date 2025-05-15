import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import { getSupabaseServerClient } from "@/lib/supabase/server"
import type { Database } from "@/lib/supabase/database.types"

export type DiscordSettings = Database["public"]["Tables"]["discord_settings"]["Row"]

// Client-side functions
export const getUserDiscordSettings = async (userId: string) => {
  const supabase = getSupabaseBrowserClient()

  const { data, error } = await supabase.from("discord_settings").select("*").eq("user_id", userId).single()

  if (error) {
    console.error("Error fetching Discord settings:", error)
    throw error
  }

  return data
}

export const updateDiscordSettings = async (
  userId: string,
  settings: Partial<Omit<DiscordSettings, "user_id" | "created_at" | "updated_at">>,
) => {
  const supabase = getSupabaseBrowserClient()

  const { data, error } = await supabase
    .from("discord_settings")
    .update({
      ...settings,
      updated_at: new Date().toISOString(),
    })
    .eq("user_id", userId)
    .select()
    .single()

  if (error) {
    console.error("Error updating Discord settings:", error)
    throw error
  }

  return data
}

// Server-side functions
export const getDiscordSettingsForUser = async (userId: string) => {
  const supabase = getSupabaseServerClient()

  const { data, error } = await supabase.from("discord_settings").select("*").eq("user_id", userId).single()

  if (error) {
    console.error("Error fetching Discord settings:", error)
    throw error
  }

  return data
}
