"use client"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Shield, Check, Copy, Download } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface TwoFactorSetupProps {
  onVerified: () => void
  verificationMode?: boolean
}

export function TwoFactorSetup({ onVerified, verificationMode = false }: TwoFactorSetupProps) {
  const [step, setStep] = useState(verificationMode ? 2 : 0)
  const [verificationCode, setVerificationCode] = useState("")
  const [isVerifying, setIsVerifying] = useState(false)
  const [error, setError] = useState("")

  // Mock QR code and secret key for demo purposes
  const secretKey = "JBSWY3DPEHPK3PXP"
  const qrCodeUrl = "/placeholder.svg?height=200&width=200"

  const handleCopySecretKey = () => {
    navigator.clipboard.writeText(secretKey)
  }

  const handleVerify = () => {
    setIsVerifying(true)
    setError("")

    // Simulate verification process
    setTimeout(() => {
      setIsVerifying(false)
      if (verificationCode === "123456") {
        setStep(3)
      } else {
        setError("Invalid verification code. Please try again.")
      }
    }, 1500)
  }

  const handleSkip = () => {
    onVerified()
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="space-y-1">
        <div className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-primary" />
          <CardTitle>{verificationMode ? "Two-Factor Authentication" : "Set Up Two-Factor Authentication"}</CardTitle>
        </div>
        <CardDescription>
          {verificationMode
            ? "Enter the verification code from your authenticator app"
            : "Enhance your account security with two-factor authentication"}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {step === 0 && (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Two-factor authentication adds an extra layer of security to your account. Once enabled, you'll need to
              enter a verification code from your authenticator app when signing in.
            </p>
            <div className="flex justify-end">
              <Button onClick={() => setStep(1)}>Get Started</Button>
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Scan the QR code below with your authenticator app (like Google Authenticator, Authy, or Microsoft
              Authenticator).
            </p>
            <div className="flex justify-center py-4">
              <div className="relative size-48 overflow-hidden rounded-lg border">
                <Image src={qrCodeUrl || "/placeholder.svg"} alt="QR Code" fill className="object-cover" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Or enter this setup key manually:</Label>
              <div className="flex items-center gap-2">
                <Input value={secretKey} readOnly className="font-mono" />
                <Button variant="outline" size="icon" onClick={handleCopySecretKey}>
                  <Copy className="h-4 w-4" />
                  <span className="sr-only">Copy secret key</span>
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Keep this key secret. You can use it to recover your authenticator if you lose your device.
              </p>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={handleSkip}>
                Skip for now
              </Button>
              <Button onClick={() => setStep(2)}>Continue</Button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <p className="text-sm text-muted-foreground">
              Enter the 6-digit verification code from your authenticator app to verify setup.
            </p>
            <div className="space-y-2">
              <Label htmlFor="verificationCode">Verification Code</Label>
              <Input
                id="verificationCode"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                placeholder="123456"
                maxLength={6}
                className="text-center text-lg tracking-widest"
              />
            </div>
            <div className="flex justify-end gap-2">
              {!verificationMode && (
                <Button variant="outline" onClick={handleSkip}>
                  Skip for now
                </Button>
              )}
              <Button onClick={handleVerify} disabled={verificationCode.length !== 6 || isVerifying}>
                {isVerifying ? "Verifying..." : "Verify"}
              </Button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <div className="flex flex-col items-center justify-center py-4">
              <div className="mb-4 flex size-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
                <Check className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-xl font-semibold">Setup Complete!</h3>
              <p className="text-center text-sm text-muted-foreground">
                Two-factor authentication has been successfully enabled for your account.
              </p>
            </div>
            <div className="rounded-lg border bg-muted p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Recovery Codes</h4>
                  <p className="text-xs text-muted-foreground">
                    Save these recovery codes in a secure place to regain access to your account if you lose your
                    authenticator device.
                  </p>
                </div>
                <Button variant="outline" size="icon">
                  <Download className="h-4 w-4" />
                  <span className="sr-only">Download recovery codes</span>
                </Button>
              </div>
              <div className="mt-3 grid grid-cols-2 gap-2">
                <code className="rounded bg-background p-1 text-xs">ABCD-EFGH-IJKL</code>
                <code className="rounded bg-background p-1 text-xs">MNOP-QRST-UVWX</code>
                <code className="rounded bg-background p-1 text-xs">1234-5678-90AB</code>
                <code className="rounded bg-background p-1 text-xs">CDEF-GHIJ-KLMN</code>
              </div>
            </div>
          </div>
        )}
      </CardContent>
      {step === 3 && (
        <CardFooter>
          <Button onClick={onVerified} className="w-full">
            Continue
          </Button>
        </CardFooter>
      )}
    </Card>
  )
}
