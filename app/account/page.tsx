"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader,
  CardTitle 
} from "@/components/ui/card"
import { 
  Alert,
  AlertDescription,
  AlertTitle 
} from "@/components/ui/alert"
import { Check, AlertCircle, Shield } from "lucide-react"
import { useAuth } from "@/lib/auth"
import { useToast } from "@/hooks/use-toast"

export default function AccountPage() {
  const { user, updateProfile, linkDiscord } = useAuth()
  const { toast } = useToast()
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
  })
  
  // Check for discord link success parameter
  useEffect(() => {
    if (searchParams.get("discord") === "linked") {
      toast({
        title: "Discord account linked",
        description: "Your Discord account has been linked successfully.",
      })
    }
  }, [searchParams, toast])
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    try {
      const { error } = await updateProfile({
        name: formData.name,
        email: formData.email
      })
      
      if (error) throw error
      
      toast({
        title: "Profile updated",
        description: "Your profile information has been updated successfully.",
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update profile. Please try again.",
      })
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }
  
  const handleDiscordLink = async () => {
    try {
      const { error } = await linkDiscord()
      
      if (error) throw error
      
      // The actual success will be handled in the callback
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to initiate Discord connection. Please try again.",
      })
      console.error(error)
    }
  }
  
  // Redirect to login if not authenticated
  if (!user) {
    return (
      <div className="container py-10">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Authentication required</AlertTitle>
          <AlertDescription>
            You need to be logged in to view this page.
          </AlertDescription>
        </Alert>
        <div className="mt-4">
          <Button onClick={() => router.push('/login')}>Go to Login</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-6">Account Details</h1>
      
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>
              Update your personal details and contact information
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="Your full name"
                    value={formData.name}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Your email address"
                    value={formData.email}
                    onChange={handleInputChange}
                  />
                </div>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Connected Accounts</CardTitle>
            <CardDescription>
              Link your accounts for a better experience
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-[#5865F2] flex items-center justify-center rounded-full">
                  <svg width="24" height="24" viewBox="0 0 127.14 96.36" fill="#FFFFFF">
                    <path d="M107.7,8.07A105.15,105.15,0,0,0,81.47,0a72.06,72.06,0,0,0-3.36,6.83A97.68,97.68,0,0,0,49,6.83,72.37,72.37,0,0,0,45.64,0,105.89,105.89,0,0,0,19.39,8.09C2.79,32.65-1.71,56.6.54,80.21h0A105.73,105.73,0,0,0,32.71,96.36,77.7,77.7,0,0,0,39.6,85.25a68.42,68.42,0,0,1-10.85-5.18c.91-.66,1.8-1.34,2.66-2a75.57,75.57,0,0,0,64.32,0c.87.71,1.76,1.39,2.66,2a68.68,68.68,0,0,1-10.87,5.19,77,77,0,0,0,6.89,11.1A105.25,105.25,0,0,0,126.6,80.22h0C129.24,52.84,122.09,29.11,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53s5-12.74,11.43-12.74S54,46,53.89,53,48.84,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.25,60,73.25,53s5-12.74,11.44-12.74S96.23,46,96.12,53,91.08,65.69,84.69,65.69Z"/>
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium">Discord</h3>
                  <p className="text-sm text-muted-foreground">
                    {user.discordUsername ? `Connected as ${user.discordUsername}` : "Not connected"}
                  </p>
                </div>
              </div>
              {user.discordUsername ? (
                <div className="flex items-center gap-2 text-green-500">
                  <Check className="w-5 h-5" />
                  <span>Connected</span>
                </div>
              ) : (
                <Button variant="outline" onClick={handleDiscordLink}>
                  Connect
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Wallet Information</CardTitle>
            <CardDescription>
              Your Stellar wallet details
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label>Stellar Public Key</Label>
                <div className="flex items-center gap-2 mt-1 p-3 bg-muted rounded-md font-mono text-sm break-all">
                  {user.stellarPublicKey || "No wallet connected"}
                </div>
              </div>
              {!user.stellarPublicKey && (
                <Button onClick={() => router.push('/setup-wallet')}>
                  Setup Wallet
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Security Settings</CardTitle>
            <CardDescription>
              Enhance your account security
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-amber-500 flex items-center justify-center rounded-full">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-medium">Two-Factor Authentication</h3>
                  <p className="text-sm text-muted-foreground">
                    {user.hasTwoFactorEnabled ? "Enabled" : "Not enabled"}
                  </p>
                </div>
              </div>
              <Button 
                variant={user.hasTwoFactorEnabled ? "outline" : "default"}
                onClick={() => router.push('/settings')}
              >
                {user.hasTwoFactorEnabled ? "Configure" : "Enable"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 