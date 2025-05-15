"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth"
import { getUserDiscordSettings, updateDiscordSettings, type DiscordSettings } from "@/lib/services/discord"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { AlertCircle, Check, Link, Loader2 } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function DiscordSettingsPage() {
  const { user, isLoading: authLoading, linkDiscord } = useAuth()
  const router = useRouter()

  const [settings, setSettings] = useState<DiscordSettings | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [discordCode, setDiscordCode] = useState("")
  const [isLinking, setIsLinking] = useState(false)

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login")
      return
    }

    if (user) {
      loadSettings()
    }
  }, [user, authLoading])

  const loadSettings = async () => {
    if (!user) return

    try {
      setIsLoading(true)
      setError(null)
      const data = await getUserDiscordSettings(user.id)
      setSettings(data)
    } catch (err) {
      console.error("Error loading Discord settings:", err)
      setError("Failed to load Discord settings. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSaveSettings = async () => {
    if (!user || !settings) return

    try {
      setIsSaving(true)
      setError(null)
      setSuccess(false)

      await updateDiscordSettings(user.id, {
        is_enabled: settings.is_enabled,
        price_alerts: settings.price_alerts,
        transaction_updates: settings.transaction_updates,
        market_summaries: settings.market_summaries,
        threshold_alerts: settings.threshold_alerts,
      })

      setSuccess(true)
    } catch (err) {
      console.error("Error saving Discord settings:", err)
      setError("Failed to save Discord settings. Please try again.")
    } finally {
      setIsSaving(false)
    }
  }

  const handleLinkDiscord = async () => {
    if (!user || !discordCode) return

    try {
      setIsLinking(true)
      setError(null)

      // In a real app, you would exchange the code for a Discord token
      // and get the user's Discord ID and username
      // For this demo, we'll simulate it
      const discordId = `discord_${Math.random().toString(36).substring(2, 10)}`
      const discordUsername = `user_${Math.random().toString(36).substring(2, 6)}`

      const { error } = await linkDiscord(discordId, discordUsername)

      if (error) throw error

      setSuccess(true)
      setDiscordCode("")
    } catch (err) {
      console.error("Error linking Discord:", err)
      setError("Failed to link Discord account. Please try again.")
    } finally {
      setIsLinking(false)
    }
  }

  if (authLoading || isLoading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <main className="container mx-auto p-4 md:p-6">
      <h1 className="mb-6 text-2xl font-bold">Discord Integration Settings</h1>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="mb-6 border-green-500 bg-green-500/10">
          <Check className="h-4 w-4 text-green-500" />
          <AlertTitle>Success</AlertTitle>
          <AlertDescription>Your settings have been saved successfully.</AlertDescription>
        </Alert>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Link Discord Account</CardTitle>
            <CardDescription>
              Connect your Discord account to receive notifications and manage your portfolio through our bot
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {user?.discordId ? (
              <div className="rounded-lg border border-green-500 bg-green-500/10 p-4">
                <div className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-green-500" />
                  <div>
                    <h3 className="font-medium">Discord Account Linked</h3>
                    <p className="text-sm text-muted-foreground">
                      Your account is linked to Discord user: {user.discordUsername || user.discordId}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  To link your Discord account, enter the verification code provided by our Discord bot.
                </p>

                <div className="space-y-2">
                  <Label htmlFor="discord-code">Discord Verification Code</Label>
                  <div className="flex gap-2">
                    <Input
                      id="discord-code"
                      value={discordCode}
                      onChange={(e) => setDiscordCode(e.target.value)}
                      placeholder="Enter code from Discord bot"
                    />
                    <Button onClick={handleLinkDiscord} disabled={!discordCode || isLinking}>
                      {isLinking ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <Link className="mr-2 h-4 w-4" />
                      )}
                      Link
                    </Button>
                  </div>
                </div>

                <div className="rounded-lg border p-4">
                  <h3 className="mb-2 font-medium">How to get your verification code:</h3>
                  <ol className="list-inside list-decimal space-y-2 text-sm text-muted-foreground">
                    <li>Join our Discord server</li>
                    <li>
                      Send a direct message to our bot: <code>@StellarBot</code>
                    </li>
                    <li>
                      Type the command: <code>/link</code>
                    </li>
                    <li>The bot will provide you with a verification code</li>
                    <li>Enter that code above and click "Link"</li>
                  </ol>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Discord Notification Settings</CardTitle>
            <CardDescription>Configure what notifications you want to receive through Discord</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {settings && (
              <>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="discord-enabled">Enable Discord Notifications</Label>
                    <p className="text-xs text-muted-foreground">Turn on/off all Discord notifications</p>
                  </div>
                  <Switch
                    id="discord-enabled"
                    checked={settings.is_enabled}
                    onCheckedChange={(checked) => setSettings({ ...settings, is_enabled: checked })}
                  />
                </div>

                <div className="space-y-3 rounded-lg border p-4">
                  <h3 className="font-medium">Notification Types</h3>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="price-alerts">Price Alerts</Label>
                      <p className="text-xs text-muted-foreground">
                        Receive notifications when prices hit your thresholds
                      </p>
                    </div>
                    <Switch
                      id="price-alerts"
                      checked={settings.price_alerts}
                      onCheckedChange={(checked) => setSettings({ ...settings, price_alerts: checked })}
                      disabled={!settings.is_enabled}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="transaction-updates">Transaction Updates</Label>
                      <p className="text-xs text-muted-foreground">Get notified about your buy/sell transactions</p>
                    </div>
                    <Switch
                      id="transaction-updates"
                      checked={settings.transaction_updates}
                      onCheckedChange={(checked) => setSettings({ ...settings, transaction_updates: checked })}
                      disabled={!settings.is_enabled}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="market-summaries">Market Summaries</Label>
                      <p className="text-xs text-muted-foreground">Receive daily market summaries and analysis</p>
                    </div>
                    <Switch
                      id="market-summaries"
                      checked={settings.market_summaries}
                      onCheckedChange={(checked) => setSettings({ ...settings, market_summaries: checked })}
                      disabled={!settings.is_enabled}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="threshold-alerts">Threshold Alerts</Label>
                      <p className="text-xs text-muted-foreground">
                        Get notified when your buy/sell thresholds are triggered
                      </p>
                    </div>
                    <Switch
                      id="threshold-alerts"
                      checked={settings.threshold_alerts}
                      onCheckedChange={(checked) => setSettings({ ...settings, threshold_alerts: checked })}
                      disabled={!settings.is_enabled}
                    />
                  </div>
                </div>
              </>
            )}
          </CardContent>
          <CardFooter>
            <Button onClick={handleSaveSettings} disabled={isSaving || !settings} className="w-full">
              {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Save Settings
            </Button>
          </CardFooter>
        </Card>
      </div>

      <div className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Discord Bot Commands</CardTitle>
            <CardDescription>Use these commands to interact with our Discord bot</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b">
                      <th className="py-2 text-left font-medium">Command</th>
                      <th className="py-2 text-left font-medium">Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="py-2 font-mono text-sm">/portfolio</td>
                      <td className="py-2 text-sm">View your current portfolio and holdings</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2 font-mono text-sm">/price [symbol]</td>
                      <td className="py-2 text-sm">Get the current price of a cryptocurrency</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2 font-mono text-sm">/thresholds</td>
                      <td className="py-2 text-sm">View your active price thresholds</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2 font-mono text-sm">/transactions</td>
                      <td className="py-2 text-sm">View your recent transactions</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2 font-mono text-sm">/settings</td>
                      <td className="py-2 text-sm">Manage your Discord notification settings</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2 font-mono text-sm">/help</td>
                      <td className="py-2 text-sm">Get help and see all available commands</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
