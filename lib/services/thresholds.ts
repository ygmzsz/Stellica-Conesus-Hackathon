import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import { getSupabaseServerClient } from "@/lib/supabase/server"
import type { Database } from "@/lib/supabase/database.types"

export type Threshold = Database["public"]["Tables"]["thresholds"]["Row"]
export type ThresholdType = "buy" | "sell"
export type ThresholdCondition = "above" | "below"

// Client-side functions
export const getUserThresholds = async (userId: string) => {
  const supabase = getSupabaseBrowserClient()

  const { data, error } = await supabase
    .from("thresholds")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching thresholds:", error)
    throw error
  }

  return data
}

export const createThreshold = async (
  userId: string,
  cryptoId: string,
  type: ThresholdType,
  condition: ThresholdCondition,
  price: number,
  amount: number,
  notifyEmail = true,
  notifyPush = true,
  notifyDiscord = false,
) => {
  const supabase = getSupabaseBrowserClient()

  const { data, error } = await supabase
    .from("thresholds")
    .insert({
      user_id: userId,
      crypto_id: cryptoId,
      type,
      condition,
      price,
      amount,
      notify_email: notifyEmail,
      notify_push: notifyPush,
      notify_discord: notifyDiscord,
      is_active: true,
    })
    .select()
    .single()

  if (error) {
    console.error("Error creating threshold:", error)
    throw error
  }

  return data
}

export const updateThresholdStatus = async (userId: string, thresholdId: string, isActive: boolean) => {
  const supabase = getSupabaseBrowserClient()

  const { data, error } = await supabase
    .from("thresholds")
    .update({
      is_active: isActive,
      updated_at: new Date().toISOString(),
    })
    .eq("id", thresholdId)
    .eq("user_id", userId)
    .select()
    .single()

  if (error) {
    console.error("Error updating threshold:", error)
    throw error
  }

  return data
}

export const deleteThreshold = async (userId: string, thresholdId: string) => {
  const supabase = getSupabaseBrowserClient()

  const { error } = await supabase.from("thresholds").delete().eq("id", thresholdId).eq("user_id", userId)

  if (error) {
    console.error("Error deleting threshold:", error)
    throw error
  }

  return true
}

// Server-side functions
export const getThresholdsForUser = async (userId: string) => {
  const supabase = getSupabaseServerClient()

  const { data, error } = await supabase.from("thresholds").select("*").eq("user_id", userId).eq("is_active", true)

  if (error) {
    console.error("Error fetching thresholds:", error)
    throw error
  }

  return data
}
