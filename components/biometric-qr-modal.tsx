"use client"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Fingerprint, Smartphone } from "lucide-react"

interface BiometricQRModalProps {
  isOpen: boolean
  onClose: () => void
  qrCodeUrl: string
  onVerified: (token: string) => void
}

export function BiometricQRModal({ isOpen, onClose, qrCodeUrl, onVerified }: BiometricQRModalProps) {
  const [verificationCode, setVerificationCode] = useState("")
  const [isVerifying, setIsVerifying] = useState(false)

  const handleVerify = async () => {
    if (!verificationCode) return

    setIsVerifying(true)
    try {
      // In a real app, this would verify the code with the server
      await new Promise((resolve) => setTimeout(resolve, 1500))
      onVerified(verificationCode)
      onClose()
    } catch (error) {
      console.error("Verification error:", error)
    } finally {
      setIsVerifying(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Set Up Biometric Authentication</DialogTitle>
          <DialogDescription>
            Scan this QR code with your mobile device to set up biometric authentication.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col items-center justify-center space-y-6 py-4">
          <div className="relative size-64 overflow-hidden rounded-lg border">
            <Image src={qrCodeUrl || "/placeholder.svg"} alt="QR Code" fill className="object-cover" />
          </div>
          <div className="space-y-2 text-center">
            <div className="flex items-center justify-center gap-2">
              <Smartphone className="h-5 w-5 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">Scan with your mobile device</p>
            </div>
            <div className="flex items-center justify-center gap-2">
              <Fingerprint className="h-5 w-5 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">Verify with your fingerprint or face ID</p>
            </div>
          </div>
          <div className="w-full space-y-2">
            <Label htmlFor="verification-code">Enter verification code from your device</Label>
            <Input
              id="verification-code"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              placeholder="123456"
              className="text-center text-lg tracking-widest"
            />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleVerify} disabled={!verificationCode || isVerifying} className="w-full">
            {isVerifying ? "Verifying..." : "Verify"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
