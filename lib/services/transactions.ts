import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import { getSupabaseServerClient } from "@/lib/supabase/server"
import type { Database } from "@/lib/supabase/database.types"
import { updateHolding } from "./holdings"

export type Transaction = Database["public"]["Tables"]["transactions"]["Row"]
export type TransactionType = "buy" | "sell" | "deposit" | "withdrawal"

// Client-side functions
export const getUserTransactions = async (userId: string, limit = 10) => {
  const supabase = getSupabaseBrowserClient()

  const { data, error } = await supabase
    .from("transactions")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(limit)

  if (error) {
    console.error("Error fetching transactions:", error)
    throw error
  }

  return data
}

export const createTransaction = async (
  userId: string,
  type: TransactionType,
  cryptoId: string,
  symbol: string,
  amount: number,
  priceUsd: number,
  updateHoldings = true,
) => {
  const supabase = getSupabaseBrowserClient()

  // Calculate total
  const totalUsd = amount * priceUsd

  // Start a transaction
  try {
    // Insert transaction
    const { data, error } = await supabase
      .from("transactions")
      .insert({
        user_id: userId,
        type,
        crypto_id: cryptoId,
        symbol,
        amount,
        price_usd: priceUsd,
        total_usd: totalUsd,
        status: "completed",
      })
      .select()
      .single()

    if (error) throw error

    // Update holdings if needed
    if (updateHoldings) {
      // Get current holding
      const { data: holdings, error: holdingsError } = await supabase
        .from("holdings")
        .select("*")
        .eq("user_id", userId)
        .eq("crypto_id", cryptoId)
        .single()

      if (holdingsError && holdingsError.code !== "PGRST116") throw holdingsError

      const currentAmount = holdings?.amount || 0
      let newAmount = currentAmount

      // Update amount based on transaction type
      if (type === "buy" || type === "deposit") {
        newAmount += amount
      } else if (type === "sell" || type === "withdrawal") {
        newAmount -= amount

        // Ensure we don't go negative
        if (newAmount < 0) {
          throw new Error("Insufficient funds")
        }
      }

      // Update holding
      await updateHolding(userId, cryptoId, newAmount)
    }

    return data
  } catch (error) {
    console.error("Error creating transaction:", error)
    throw error
  }
}

// Server-side functions
export const getTransactionsForUser = async (userId: string) => {
  const supabase = getSupabaseServerClient()

  const { data, error } = await supabase
    .from("transactions")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching transactions:", error)
    throw error
  }

  return data
}
