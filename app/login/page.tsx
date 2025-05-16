"use client"

import type React from "react"

import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, KeyRound, Lock, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { TwoFactorSetup } from "@/components/two-factor-setup"
import { BiometricAuth } from "@/components/biometric-auth"
import { GoogleLogin } from "@/components/google-login"
import { useAuth } from "../../lib/auth"
import { BiometricQRModal } from "@/components/biometric-qr-modal"

export default function LoginPage() {
  const router = useRouter()
  const { login, loginWithGoogle, loginWithDiscord, setupBiometric, verifyBiometric } = useAuth()
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [showTwoFactor, setShowTwoFactor] = useState(false)
  const [showBiometricQR, setShowBiometricQR] = useState(false)
  const [qrCodeUrl, setQrCodeUrl] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [errorMessage, setErrorMessage] = useState("")

  // const handleLogin = async (e: React.FormEvent) => {
  //   e.preventDefault()
  //   setIsLoading(true)

  //   try {
  //     const { error } = await login(email, password)
  //     if (error) throw error

  //     // In a real app, the server would tell us if 2FA is required
  //     // For demo purposes, we'll just show it
  //     setShowTwoFactor(true)
  //   } catch (error) {
  //     console.error("Login error:", error)
  //   } finally {
  //     setIsLoading(false)
  //   }
  // }



  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Login started")
    setIsLoading(true)
    setErrorMessage("")

    const supabase = getSupabaseBrowserClient()
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setErrorMessage(error.message)
      console.log(error.message)
      setIsLoading(false)
      return
    }

    // On success, redirect or update UI
    router.push("/dashboard")
    setIsLoading(false)
  }


  const handleTwoFactorVerified = () => {
    router.push("/dashboard")
  }

  const handleGoogleLogin = async () => {
    setIsLoading(true)
    try {
      const { error } = await loginWithGoogle()
      if (error) throw error
      // Google OAuth will redirect to the callback URL
    } catch (error) {
      console.error("Google login error:", error)
      setIsLoading(false)
    }
  }

  const handleDiscordLogin = async () => {
    setIsLoading(true)
    try {
      const { error } = await loginWithDiscord()
      if (error) throw error
      // Discord OAuth will redirect to the callback URL
    } catch (error) {
      console.error("Discord login error:", error)
      setIsLoading(false)
    }
  }

  const handleBiometricSetup = async () => {
    try {
      const { qrCode, error } = await setupBiometric()
      if (error) throw error

      setQrCodeUrl(qrCode)
      setShowBiometricQR(true)
    } catch (error) {
      console.error("Biometric setup error:", error)
    }
  }

  const handleBiometricVerified = async (token: string) => {
    try {
      const { error } = await verifyBiometric(token)
      if (error) throw error

      router.push("/dashboard")
    } catch (error) {
      console.error("Biometric verification error:", error)
    }
  }

  if (showTwoFactor) {
    return (
      <div className="container flex h-screen w-screen flex-col items-center justify-center">
        <TwoFactorSetup onVerified={handleTwoFactorVerified} verificationMode />
      </div>
    )
  }

  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-blue-500">
            <Lock className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-2xl font-semibold tracking-tight">Welcome to Stellica</h1>
          <p className="text-sm text-muted-foreground">Sign in to your account to continue</p>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <GoogleLogin isLoading={isLoading} />

          <Button variant="outline" type="button" disabled={isLoading} className="w-full" onClick={handleDiscordLogin}>
            {isLoading ? (
              <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
            ) : (
              <svg
                className="mr-2 h-4 w-4"
                aria-hidden="true"
                focusable="false"
                role="img"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 640 512"
              >
                <path
                  fill="currentColor"
                  d="M524.531,69.836a1.5,1.5,0,0,0-.764-.7A485.065,485.065,0,0,0,404.081,32.03a1.816,1.816,0,0,0-1.923.91,337.461,337.461,0,0,0-14.9,30.6,447.848,447.848,0,0,0-134.426,0,309.541,309.541,0,0,0-15.135-30.6,1.89,1.89,0,0,0-1.924-.91A483.689,483.689,0,0,0,116.085,69.137a1.712,1.712,0,0,0-.788.676C39.068,183.651,18.186,294.69,28.43,404.354a2.016,2.016,0,0,0,.765,1.375A487.666,487.666,0,0,0,176.02,479.918a1.9,1.9,0,0,0,2.063-.676A348.2,348.2,0,0,0,208.12,430.4a1.86,1.86,0,0,0-1.019-2.588,321.173,321.173,0,0,1-45.868-21.853,1.885,1.885,0,0,1-.185-3.126c3.082-2.309,6.166-4.711,9.109-7.137a1.819,1.819,0,0,1,1.9-.256c96.229,43.917,200.41,43.917,295.5,0a1.812,1.812,0,0,1,1.924.233c2.944,2.426,6.027,4.851,9.132,7.16a1.884,1.884,0,0,1-.162,3.126,301.407,301.407,0,0,1-45.89,21.83,1.875,1.875,0,0,0-1,2.611,391.055,391.055,0,0,0,30.014,48.815,1.864,1.864,0,0,0,2.063.7A486.048,486.048,0,0,0,610.7,405.729a1.882,1.882,0,0,0,.765-1.352C623.729,277.594,590.933,167.465,524.531,69.836ZM222.491,337.58c-28.972,0-52.844-26.587-52.844-59.239S193.056,219.1,222.491,219.1c29.665,0,53.306,26.82,52.843,59.239C275.334,310.993,251.924,337.58,222.491,337.58Zm195.38,0c-28.971,0-52.843-26.587-52.843-59.239S388.437,219.1,417.871,219.1c29.667,0,53.307,26.82,52.844,59.239C470.715,310.993,447.538,337.58,417.871,337.58Z"
                ></path>
              </svg>
            )}
            {isLoading ? "Signing in..." : "Discord"}
          </Button>
        </div>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
          </div>
        </div>

        <Tabs defaultValue="credentials" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="credentials">Password</TabsTrigger>
            <TabsTrigger value="biometric">Biometric</TabsTrigger>
          </TabsList>

          <TabsContent value="credentials">
            <Card>
              <CardHeader className="space-y-1">
                <CardTitle className="text-xl">Sign in</CardTitle>
                <CardDescription>Enter your email and password to sign in</CardDescription>
              </CardHeader>
              <form onSubmit={handleLogin}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="email"
                        placeholder="name@example.com"
                        type="email"
                        required
                        className="pl-9"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password">Password</Label>
                      <Link href="/forgot-password" className="text-xs text-primary hover:underline">
                        Forgot password?
                      </Link>
                    </div>
                    <div className="relative">
                      <KeyRound className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        required
                        className="pl-9 pr-9"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-10 w-10 text-muted-foreground"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        <span className="sr-only">{showPassword ? "Hide password" : "Show password"}</span>
                      </Button>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="remember" />
                    <label
                      htmlFor="remember"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Remember me
                    </label>
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col space-y-4">
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Signing in..." : "Sign in"}
                  </Button>
                  <div className="text-center text-sm">
                    Don&apos;t have an account?{" "}
                    <Link href="/register" className="text-primary hover:underline">
                      Sign up
                    </Link>
                  </div>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>

          <TabsContent value="biometric">
            <Card>
              <CardHeader className="space-y-1">
                <CardTitle className="text-xl">Biometric Authentication</CardTitle>
                <CardDescription>Use your fingerprint or face ID to sign in</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center justify-center space-y-4 py-8">
                <BiometricAuth onAuthenticated={() => router.push("/dashboard")} />
                <Button onClick={handleBiometricSetup} variant="outline" className="mt-4">
                  Set Up Biometric Auth
                </Button>
              </CardContent>
              <CardFooter className="flex flex-col space-y-4">
                <div className="text-center text-sm">
                  Don&apos;t have an account?{" "}
                  <Link href="/register" className="text-primary hover:underline">
                    Sign up
                  </Link>
                </div>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Biometric QR Code Modal */}
      <BiometricQRModal
        isOpen={showBiometricQR}
        onClose={() => setShowBiometricQR(false)}
        qrCodeUrl={qrCodeUrl}
        onVerified={handleBiometricVerified}
      />
    </div>
  )
}
