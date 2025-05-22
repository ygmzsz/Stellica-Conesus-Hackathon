"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { AlertCircle, Loader2 } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function DiscordCallback() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  
  useEffect(() => {
    const handleCallback = async () => {
      try {
        setIsLoading(true)
        const supabase = getSupabaseBrowserClient()
        
        // Extract code and state params from URL
        const code = searchParams.get("code")
        const isLinking = searchParams.get("link") === "true"
        
        if (!code) {
          throw new Error("No code provided in callback")
        }
        
        // Exchange code for user session
        const { data, error: sessionError } = await supabase.auth.exchangeCodeForSession(code)
        
        if (sessionError) throw sessionError
        
        if (isLinking) {
          // Get Discord user details
          const token = data.session?.access_token
          // In a real implementation, you'd use the token to fetch Discord profile
          // For this demo, we'll use mock data
          const discordId = "discord123456789"
          const discordUsername = "DiscordUser#1234"
          
          // Update the user profile with Discord details
          const { error: updateError } = await supabase
            .from("profiles")
            .update({
              discord_id: discordId,
              discord_username: discordUsername,
              updated_at: new Date().toISOString(),
            })
            .eq("id", data.session?.user.id)
          
          if (updateError) throw updateError
          
          // Redirect back to account page
          router.push("/account?discord=linked")
        } else {
          // Normal sign-in, redirect to dashboard
          router.push("/dashboard")
        }
      } catch (err) {
        console.error("Error during Discord callback:", err)
        setError(err instanceof Error ? err.message : "Unknown error occurred")
      } finally {
        setIsLoading(false)
      }
    }
    
    handleCallback()
  }, [router, searchParams])
  
  if (error) {
    return (
      <div className="container flex flex-col items-center justify-center py-20">
        <Alert variant="destructive" className="mb-6 max-w-lg">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Authentication Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <Button onClick={() => router.push("/")}>Return to Home</Button>
      </div>
    )
  }
  
  return (
    <div className="container flex flex-col items-center justify-center py-20">
      <div className="flex flex-col items-center mb-8">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <h1 className="text-2xl font-bold">Processing Discord Authentication...</h1>
        <p className="text-muted-foreground mt-2">Please wait while we complete the process.</p>
      </div>
    </div>
  )
} 