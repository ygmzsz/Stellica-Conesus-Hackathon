"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Copy, ExternalLink, Key, Plus, Wallet } from "lucide-react"

export function StellarWalletConnect() {
  const [activeTab, setActiveTab] = useState("create")
  const [secretKey, setSecretKey] = useState("")
  const [walletCreated, setWalletCreated] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  // Mock wallet data
  const mockPublicKey = "GBPD7JNZXNWCFKGFVXOAOMR3QWYS547JQGQZQP6KSXFR4JCNRTKUQEBM"
  const mockSecretKey = "SBPD7JNZXNWCFKGFVXOAOMR3QWYS547JQGQZQP6KSXFR4JCNRTKUQEBM"

  const handleCreateWallet = async () => {
    setIsLoading(true)
    setError("")

    try {
      // Simulate wallet creation
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // In a real app, we would use the Stellar SDK to create a wallet
      // const pair = StellarSdk.Keypair.random();
      // const publicKey = pair.publicKey();
      // const secretKey = pair.secret();

      setWalletCreated(true)
      setIsLoading(false)
    } catch (err) {
      setError("Failed to create wallet. Please try again.")
      setIsLoading(false)
    }
  }

  const handleImportWallet = async () => {
    setIsLoading(true)
    setError("")

    try {
      // Simulate wallet import
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // In a real app, we would validate the secret key and import the wallet
      // const keypair = StellarSdk.Keypair.fromSecret(secretKey);
      // const publicKey = keypair.publicKey();

      if (secretKey.length < 10) {
        throw new Error("Invalid secret key")
      }

      setWalletCreated(true)
      setIsLoading(false)
    } catch (err) {
      setError("Invalid secret key. Please check and try again.")
      setIsLoading(false)
    }
  }

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(mockPublicKey)
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Wallet className="h-5 w-5 text-primary" />
          <CardTitle>Stellar Wallet</CardTitle>
        </div>
        <CardDescription>Create or import your Stellar wallet to start trading</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {!walletCreated ? (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="create">Create Wallet</TabsTrigger>
              <TabsTrigger value="import">Import Wallet</TabsTrigger>
            </TabsList>

            <TabsContent value="create" className="space-y-4 pt-4">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  Create a new Stellar wallet to send, receive, and trade assets on the Stellar network.
                </p>
                <Alert>
                  <AlertTitle className="flex items-center gap-2">
                    <Key className="h-4 w-4" />
                    Important Security Information
                  </AlertTitle>
                  <AlertDescription className="text-xs">
                    <ul className="list-inside list-disc space-y-1 pt-2">
                      <li>We will generate a secret key that gives access to your funds.</li>
                      <li>Make sure to back up your secret key in a secure location.</li>
                      <li>Never share your secret key with anyone.</li>
                      <li>If you lose your secret key, you will lose access to your funds.</li>
                    </ul>
                  </AlertDescription>
                </Alert>
              </div>
              <Button onClick={handleCreateWallet} className="w-full" disabled={isLoading}>
                {isLoading ? "Creating Wallet..." : "Create New Wallet"}
              </Button>
            </TabsContent>

            <TabsContent value="import" className="space-y-4 pt-4">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  Import an existing Stellar wallet using your secret key.
                </p>
                <div className="space-y-2">
                  <Label htmlFor="secretKey">Secret Key</Label>
                  <Input
                    id="secretKey"
                    value={secretKey}
                    onChange={(e) => setSecretKey(e.target.value)}
                    placeholder="S..."
                    className="font-mono"
                  />
                  <p className="text-xs text-muted-foreground">Enter your Stellar secret key starting with 'S'.</p>
                </div>
                <Alert>
                  <AlertTitle className="flex items-center gap-2">
                    <Key className="h-4 w-4" />
                    Security Warning
                  </AlertTitle>
                  <AlertDescription className="text-xs">
                    Your secret key is never sent to our servers and is only used locally to sign transactions.
                  </AlertDescription>
                </Alert>
              </div>
              <Button onClick={handleImportWallet} className="w-full" disabled={isLoading || secretKey.length < 10}>
                {isLoading ? "Importing Wallet..." : "Import Wallet"}
              </Button>
            </TabsContent>
          </Tabs>
        ) : (
          <div className="space-y-4">
            <div className="rounded-lg border bg-muted p-4">
              <h3 className="mb-2 font-medium">Wallet Connected</h3>
              <div className="space-y-2">
                <div>
                  <Label className="text-xs text-muted-foreground">Public Address</Label>
                  <div className="flex items-center gap-2">
                    <code className="flex-1 overflow-hidden overflow-ellipsis rounded bg-background p-2 text-xs">
                      {mockPublicKey}
                    </code>
                    <Button variant="outline" size="icon" onClick={handleCopyAddress}>
                      <Copy className="h-4 w-4" />
                      <span className="sr-only">Copy address</span>
                    </Button>
                    <Button variant="outline" size="icon" asChild>
                      <a
                        href={`https://stellar.expert/explorer/public/account/${mockPublicKey}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <ExternalLink className="h-4 w-4" />
                        <span className="sr-only">View on explorer</span>
                      </a>
                    </Button>
                  </div>
                </div>

                {activeTab === "create" && (
                  <div>
                    <Label className="text-xs text-muted-foreground">Secret Key (Keep this private!)</Label>
                    <div className="flex items-center gap-2">
                      <code className="flex-1 overflow-hidden overflow-ellipsis rounded bg-background p-2 text-xs">
                        {mockSecretKey}
                      </code>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => navigator.clipboard.writeText(mockSecretKey)}
                      >
                        <Copy className="h-4 w-4" />
                        <span className="sr-only">Copy secret key</span>
                      </Button>
                    </div>
                    <p className="mt-2 text-xs text-red-500 dark:text-red-400">
                      This is the only time your secret key will be displayed. Save it in a secure location.
                    </p>
                  </div>
                )}
              </div>
            </div>

            <Alert>
              <AlertTitle className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Next Steps
              </AlertTitle>
              <AlertDescription className="text-xs">
                <ul className="list-inside list-disc space-y-1 pt-2">
                  <li>Your wallet needs to be activated with a minimum balance of 1 XLM.</li>
                  <li>Send XLM to your public address to activate your account.</li>
                  <li>Once activated, you can start trading on the Stellar network.</li>
                </ul>
              </AlertDescription>
            </Alert>
          </div>
        )}
      </CardContent>
      {walletCreated && (
        <CardFooter>
          <Button className="w-full">Continue to Dashboard</Button>
        </CardFooter>
      )}
    </Card>
  )
}
