"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import type { User as SupabaseUser } from "@supabase/supabase-js"

export interface User {
  id: string
  name: string | null
  email: string | null
  stellarPublicKey?: string | null
  hasTwoFactorEnabled: boolean
  hasBiometricEnabled: boolean
  discordId?: string | null
  discordUsername?: string | null
  balance?: number
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<{ error: Error | null }>
  loginWithGoogle: () => Promise<{ error: Error | null }>
  loginWithDiscord: () => Promise<{ error: Error | null }>
  logout: () => Promise<void>
  register: (email: string, password: string, name: string) => Promise<{ error: Error | null }>
  updateProfile: (data: Partial<User>) => Promise<{ error: Error | null }>
  linkDiscord: (discordId: string, discordUsername: string) => Promise<{ error: Error | null }>
  setupBiometric: () => Promise<{ qrCode: string; error: Error | null }>
  verifyBiometric: (token: string) => Promise<{ error: Error | null }>
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  isAuthenticated: false,
  login: async () => ({ error: null }),
  loginWithGoogle: async () => ({ error: null }),
  loginWithDiscord: async () => ({ error: null }),
  logout: async () => {},
  register: async () => ({ error: null }),
  updateProfile: async () => ({ error: null }),
  linkDiscord: async () => ({ error: null }),
  setupBiometric: async () => ({ qrCode: "", error: null }),
  verifyBiometric: async (_token: string) => ({ error: null }),
})

export const useAuth = () => useContext(AuthContext)

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isMounted, setIsMounted] = useState(false)
  const supabase = getSupabaseBrowserClient()

  // Handle client-side mounting to prevent hydration mismatches
  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    // Only run this after client-side mount to prevent hydration issues
    if (!isMounted) return;
    
    // Check if user is logged in
    const checkAuth = async () => {
      try {
        setIsLoading(true)

        // Get session
        const {
          data: { session },
        } = await supabase.auth.getSession()

        if (session?.user) {
          await fetchUserProfile(session.user)
        } else {
          setUser(null)
        }
      } catch (error) {
        console.error("Auth error:", error)
        setUser(null)
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        await fetchUserProfile(session.user)
      } else {
        setUser(null)
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [isMounted])

  const fetchUserProfile = async (supabaseUser: SupabaseUser) => {
    if (!isMounted) return; // Only run on client side
    
    const { data: profile, error } = await supabase.from("profiles").select("*").eq("id", supabaseUser.id).single()

    if (error) {
      console.error("Error fetching profile:", error)
      setUser(null)
      return
    }

    // Get user's holdings to calculate balance
    const { data: holdings, error: holdingsError } = await supabase
      .from("holdings")
      .select("*")
      .eq("user_id", supabaseUser.id)

    let balance = 0
    if (!holdingsError && holdings) {
      // Mock value for balance
      balance = 29444.48
    }

    setUser({
      id: supabaseUser.id,
      name: profile.full_name,
      email: supabaseUser.email || null,
      stellarPublicKey: profile.stellar_public_key,
      hasTwoFactorEnabled: profile.has_two_factor_enabled,
      hasBiometricEnabled: profile.has_biometric_enabled,
      discordId: profile.discord_id,
      discordUsername: profile.discord_username,
      balance,
    })
  }

  const login = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error

      return { error: null }
    } catch (error) {
      console.error("Login error:", error)
      return { error: error as Error }
    }
  }

  const loginWithGoogle = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (error) throw error

      return { error: null }
    } catch (error) {
      console.error("Google login error:", error)
      return { error: error as Error }
    }
  }

  const loginWithDiscord = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "discord",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (error) throw error

      return { error: null }
    } catch (error) {
      console.error("Discord login error:", error)
      return { error: error as Error }
    }
  }

  const logout = async () => {
    await supabase.auth.signOut()
    setUser(null)
  }

  const register = async (email: string, password: string, name: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
          },
        },
      })

      if (error) throw error

      return { error: null }
    } catch (error) {
      console.error("Registration error:", error)
      return { error: error as Error }
    }
  }

  const updateProfile = async (data: Partial<User>) => {
    if (!user) return { error: new Error("Not authenticated") }

    try {
      // Update auth metadata if email is provided
      if (data.email) {
        const { error: updateAuthError } = await supabase.auth.updateUser({
          email: data.email,
        })

        if (updateAuthError) throw updateAuthError
      }

      // Update profile data
      const { error: updateProfileError } = await supabase
        .from("profiles")
        .update({
          full_name: data.name,
          stellar_public_key: data.stellarPublicKey,
          has_two_factor_enabled: data.hasTwoFactorEnabled,
          has_biometric_enabled: data.hasBiometricEnabled,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id)

      if (updateProfileError) throw updateProfileError

      // Update local user state
      setUser({
        ...user,
        ...data,
      })

      return { error: null }
    } catch (error) {
      console.error("Update profile error:", error)
      return { error: error as Error }
    }
  }

  const linkDiscord = async (discordId: string, discordUsername: string) => {
    if (!user) return { error: new Error("Not authenticated") }

    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          discord_id: discordId,
          discord_username: discordUsername,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id)

      if (error) throw error

      // Update local user state
      setUser({
        ...user,
        discordId,
        discordUsername,
      })

      return { error: null }
    } catch (error) {
      console.error("Link Discord error:", error)
      return { error: error as Error }
    }
  }

  const setupBiometric = async () => {
    if (!user) return { qrCode: "", error: new Error("Not authenticated") }

    try {
      // In a real app, you would generate a QR code with a unique token
      // For this demo, we'll use a mock QR code
      const qrCode = "/placeholder.svg?height=200&width=200"

      // Update profile to indicate biometric setup is in progress
      const { error } = await supabase
        .from("profiles")
        .update({
          has_biometric_enabled: true,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id)

      if (error) throw error

      // Update local user state
      setUser({
        ...user,
        hasBiometricEnabled: true,
      })

      return { qrCode, error: null }
    } catch (error) {
      console.error("Setup biometric error:", error)
      return { qrCode: "", error: error as Error }
    }
  }

  const verifyBiometric = async (token: string) => {
    if (!user) return { error: new Error("Not authenticated") }

    try {
      // In a real app, you would verify the token
      // For this demo, we'll just return success
      return { error: null }
    } catch (error) {
      console.error("Verify biometric error:", error)
      return { error: error as Error }
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        loginWithGoogle,
        loginWithDiscord,
        logout,
        register,
        updateProfile,
        linkDiscord,
        setupBiometric,
        verifyBiometric,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
