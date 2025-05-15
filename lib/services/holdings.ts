import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import { getSupabaseServerClient } from "@/lib/supabase/server"
import type { Database } from "@/lib/supabase/database.types"

export type Holding = Database["public"]["Tables"]["holdings"]["Row"]

// Client-side functions
export const getUserHoldings = async (userId: string) => {
  const supabase = getSupabaseBrowserClient()

  const { data, error } = await supabase
    .from("holdings")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching holdings:", error)
    throw error
  }

  return data
}

export const updateHolding = async (userId: string, cryptoId: string, amount: number) => {
  const supabase = getSupabaseBrowserClient()

  // Check if holding exists
  const { data: existingHolding, error: fetchError } = await supabase
    .from("holdings")
    .select("*")
    .eq("user_id", userId)
    .eq("crypto_id", cryptoId)
    .single()

  if (fetchError && fetchError.code !== "PGRST116") {
    // PGRST116 is "no rows returned"
    console.error("Error fetching holding:", fetchError)
    throw fetchError
  }

  if (existingHolding) {
    // Update existing holding
    const { error } = await supabase
      .from("holdings")
      .update({
        amount,
        updated_at: new Date().toISOString(),
      })
      .eq("id", existingHolding.id)

    if (error) {
      console.error("Error updating holding:", error)
      throw error
    }
  } else {
    // Get symbol from crypto_id (in a real app, you'd have this info)
    const symbol = cryptoId.substring(0, 3).toUpperCase()

    // Create new holding
    const { error } = await supabase.from("holdings").insert({
      user_id: userId,
      crypto_id: cryptoId,
      symbol,
      amount,
    })

    if (error) {
      console.error("Error creating holding:", error)
      throw error
    }
  }

  return true
}

// Server-side functions
export const getHoldingsForUser = async (userId: string) => {
  const supabase = getSupabaseServerClient()

  const { data, error } = await supabase.from("holdings").select("*").eq("user_id", userId)

  if (error) {
    console.error("Error fetching holdings:", error)
    throw error
  }

  return data
}
