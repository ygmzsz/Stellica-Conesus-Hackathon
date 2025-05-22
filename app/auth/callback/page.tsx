"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { AlertCircle, Loader2 } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function AuthCallback() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  
  useEffect(() => {
    const handleCallback = async () => {
      try {
        setIsLoading(true)
        const supabase = getSupabaseBrowserClient()
        
        // Extract code from URL
        const code = searchParams.get("code")
        
        if (!code) {
          throw new Error("No code provided in callback")
        }
        
        // Exchange code for user session
        const { data, error: sessionError } = await supabase.auth.exchangeCodeForSession(code)
        
        if (sessionError) throw sessionError
        
        // Redirect to dashboard after successful authentication
        router.push("/dashboard")
      } catch (err) {
        console.error("Error during authentication callback:", err)
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
        <Button onClick={() => router.push("/login")}>Return to Login</Button>
      </div>
    )
  }
  
  return (
    <div className="container flex flex-col items-center justify-center py-20">
      <div className="flex flex-col items-center mb-8">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <h1 className="text-2xl font-bold">Processing Authentication...</h1>
        <p className="text-muted-foreground mt-2">Please wait while we log you in.</p>
      </div>
    </div>
  )
} 