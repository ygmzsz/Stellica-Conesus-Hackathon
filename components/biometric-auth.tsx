"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Fingerprint, Scan, ShieldCheck } from "lucide-react"

interface BiometricAuthProps {
  onAuthenticated: () => void
}

export function BiometricAuth({ onAuthenticated }: BiometricAuthProps) {
  const [status, setStatus] = useState<"idle" | "scanning" | "success" | "error">("idle")
  const [errorMessage, setErrorMessage] = useState("")

  const handleBiometricAuth = async () => {
    // Check if the Web Authentication API is available
    if (!window.PublicKeyCredential) {
      setStatus("error")
      setErrorMessage("Biometric authentication is not supported in this browser.")
      return
    }

    try {
      setStatus("scanning")

      // Simulate biometric authentication
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Simulate successful authentication
      setStatus("success")

      // Redirect after success
      setTimeout(() => {
        onAuthenticated()
      }, 1000)
    } catch (error) {
      setStatus("error")
      setErrorMessage("Authentication failed. Please try again.")
    }
  }

  return (
    <div className="flex flex-col items-center justify-center space-y-6">
      <div
        className={`flex size-32 items-center justify-center rounded-full transition-all duration-500 ${
          status === "idle"
            ? "bg-muted"
            : status === "scanning"
              ? "animate-pulse bg-blue-100 dark:bg-blue-900"
              : status === "success"
                ? "bg-green-100 dark:bg-green-900"
                : "bg-red-100 dark:bg-red-900"
        }`}
      >
        {status === "idle" && <Fingerprint className="h-16 w-16 text-muted-foreground" />}
        {status === "scanning" && <Scan className="h-16 w-16 text-blue-500" />}
        {status === "success" && <ShieldCheck className="h-16 w-16 text-green-500" />}
        {status === "error" && <Fingerprint className="h-16 w-16 text-red-500" />}
      </div>

      {status === "idle" && (
        <div className="text-center">
          <h3 className="mb-1 text-lg font-medium">Biometric Authentication</h3>
          <p className="mb-4 text-sm text-muted-foreground">Use your fingerprint or face ID to sign in securely</p>
          <Button onClick={handleBiometricAuth} className="gap-2">
            <Fingerprint className="h-4 w-4" />
            Authenticate
          </Button>
        </div>
      )}

      {status === "scanning" && (
        <div className="text-center">
          <h3 className="mb-1 text-lg font-medium">Scanning...</h3>
          <p className="text-sm text-muted-foreground">Please complete the biometric verification</p>
        </div>
      )}

      {status === "success" && (
        <div className="text-center">
          <h3 className="mb-1 text-lg font-medium">Authentication Successful</h3>
          <p className="text-sm text-muted-foreground">You will be redirected shortly</p>
        </div>
      )}

      {status === "error" && (
        <div className="text-center">
          <h3 className="mb-1 text-lg font-medium">Authentication Failed</h3>
          <p className="mb-4 text-sm text-muted-foreground">{errorMessage}</p>
          <Button onClick={handleBiometricAuth} variant="outline" className="gap-2">
            <Fingerprint className="h-4 w-4" />
            Try Again
          </Button>
        </div>
      )}
    </div>
  )
}
