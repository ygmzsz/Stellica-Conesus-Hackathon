import { type NextRequest, NextResponse } from "next/server"
import { getSupabaseServerClient } from "@/lib/supabase/server"
import { getThresholdsForUser } from "@/lib/services/thresholds"
import { getHoldingsForUser } from "@/lib/services/holdings"
import { getTransactionsForUser } from "@/lib/services/transactions"
import { getDiscordSettingsForUser } from "@/lib/services/discord"
import { fetchCryptoPrices } from "@/lib/crypto-api"

// Verify the request is coming from our Discord bot
const verifyDiscordRequest = (req: NextRequest) => {
  const authHeader = req.headers.get("authorization")
  // In a real app, you would verify the token against an environment variable
  const validToken = process.env.DISCORD_BOT_SECRET || "your-secret-token"

  return authHeader === `Bearer ${validToken}`
}

export async function POST(req: NextRequest) {
  // Verify the request
  if (!verifyDiscordRequest(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await req.json()
    const { action, userId, discordUserId } = body

    if (!action || !userId) {
      return NextResponse.json({ error: "Missing required parameters" }, { status: 400 })
    }

    const supabase = getSupabaseServerClient()

    // Handle different actions
    switch (action) {
      case "link_account": {
        if (!discordUserId) {
          return NextResponse.json({ error: "Missing discordUserId" }, { status: 400 })
        }

        // Link Discord account to user
        const { data, error } = await supabase
          .from("profiles")
          .update({
            discord_id: discordUserId,
            discord_username: body.discordUsername || null,
            updated_at: new Date().toISOString(),
          })
          .eq("id", userId)
          .select()
          .single()

        if (error) {
          console.error("Error linking Discord account:", error)
          return NextResponse.json({ error: "Failed to link account" }, { status: 500 })
        }

        return NextResponse.json({ success: true, data })
      }

      case "get_portfolio": {
        // Get user's holdings
        const holdings = await getHoldingsForUser(userId)

        // Get current prices
        const cryptoIds = holdings.map((h) => h.crypto_id)
        const prices = await fetchCryptoPrices(cryptoIds)

        // Calculate portfolio value
        const portfolio = holdings.map((holding) => {
          const price = prices.find((p) => p.id === holding.crypto_id)
          const value = price ? holding.amount * price.current_price : 0

          return {
            ...holding,
            currentPrice: price?.current_price || 0,
            value,
          }
        })

        const totalValue = portfolio.reduce((sum, item) => sum + item.value, 0)

        return NextResponse.json({
          success: true,
          data: {
            portfolio,
            totalValue,
          },
        })
      }

      case "get_transactions": {
        // Get user's recent transactions
        const transactions = await getTransactionsForUser(userId)

        return NextResponse.json({
          success: true,
          data: transactions.slice(0, 10), // Return only the 10 most recent
        })
      }

      case "get_thresholds": {
        // Get user's active thresholds
        const thresholds = await getThresholdsForUser(userId)

        return NextResponse.json({ success: true, data: thresholds })
      }

      case "get_discord_settings": {
        // Get user's Discord notification settings
        const settings = await getDiscordSettingsForUser(userId)

        return NextResponse.json({ success: true, data: settings })
      }

      case "update_discord_settings": {
        const { settings } = body

        if (!settings) {
          return NextResponse.json({ error: "Missing settings" }, { status: 400 })
        }

        // Update Discord settings
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
          return NextResponse.json({ error: "Failed to update settings" }, { status: 500 })
        }

        return NextResponse.json({ success: true, data })
      }

      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 })
    }
  } catch (error) {
    console.error("Discord webhook error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
