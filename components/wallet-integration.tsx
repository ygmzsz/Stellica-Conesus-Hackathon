// components/wallet-integration.tsx
"use client"

import { useState, useEffect } from 'react'
import StellarSdk from 'stellar-sdk'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useToast } from "@/hooks/use-toast"

export default function WalletIntegration() {
  const [publicKey, setPublicKey] = useState<string>('')
  const [secretKey, setSecretKey] = useState<string>('')
  const [balance, setBalance] = useState<string>('0')
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string>('')
  const { toast } = useToast()
  
  // Create a new random keypair
  const generateWallet = () => {
    try {
      const pair = StellarSdk.Keypair.random()
      setPublicKey(pair.publicKey())
      setSecretKey(pair.secret())
      toast({
        title: "Wallet created!",
        description: "Your new Stellar wallet has been created. Please store your secret key safely!",
      })
    } catch (err) {
      setError('Failed to generate wallet')
      console.error(err)
    }
  }
  
  // Load wallet from secret key
  const loadWallet = () => {
    try {
      if (!secretKey) {
        setError('Secret key required')
        return
      }
      
      const keypair = StellarSdk.Keypair.fromSecret(secretKey)
      setPublicKey(keypair.publicKey())
      fetchBalance(keypair.publicKey())
      toast({
        title: "Wallet loaded!",
        description: "Your Stellar wallet has been successfully loaded.",
      })
    } catch (err) {
      setError('Invalid secret key')
      console.error(err)
    }
  }
  
  // Connect to Stellar network and fetch balance
  const fetchBalance = async (address: string) => {
    setIsLoading(true)
    setError('')
    
    try {
      // Connect to Stellar Testnet (change to StellarSdk.Networks.PUBLIC for mainnet)
      const server = new StellarSdk.Server('https://horizon-testnet.stellar.org')
      const account = await server.loadAccount(address)
      
      // Find XLM balance
      const xlmBalance = account.balances.find(
        (b: any) => b.asset_type === 'native'
      )
      
      setBalance(xlmBalance ? xlmBalance.balance : '0')
      setIsLoading(false)
    } catch (err) {
      setIsLoading(false)
      setError('Failed to load account. It may not be activated yet.')
      console.error(err)
    }
  }
  
  // Save wallet to database
  const saveWalletToDatabase = async () => {
    if (!publicKey) {
      setError('No wallet to save')
      return
    }
    
    try {
      const response = await fetch('/api/wallets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          publicKey,
          // Never send the secret key to your backend!
          // Instead, users should store it securely themselves
        }),
      })
      
      if (response.ok) {
        toast({
          title: "Wallet saved to database",
          description: "Your wallet has been successfully linked to your account.",
        })
      } else {
        throw new Error('Failed to save wallet')
      }
    } catch (err) {
      setError('Failed to save wallet to database')
      console.error(err)
    }
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Stellar Wallet Integration</CardTitle>
        <CardDescription>Connect or create a Stellar wallet to use with your account</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        <div className="space-y-2">
          <h3 className="text-sm font-medium">Create New Wallet</h3>
          <Button onClick={generateWallet}>Generate New Wallet</Button>
        </div>
        
        <div className="space-y-2">
          <h3 className="text-sm font-medium">Import Existing Wallet</h3>
          <Input
            type="password"
            placeholder="Enter your secret key"
            value={secretKey}
            onChange={(e) => setSecretKey(e.target.value)}
          />
          <Button variant="outline" onClick={loadWallet}>Load Wallet</Button>
        </div>
        
        {publicKey && (
          <div className="rounded-md border p-4">
            <h3 className="font-medium">Wallet Details</h3>
            <p className="mt-2 break-all text-sm">
              <span className="font-medium">Public Key:</span> {publicKey}
            </p>
            {secretKey && (
              <p className="mt-1 break-all text-sm">
                <span className="font-medium">Secret Key:</span> 
                <span className="text-red-500"> {secretKey}</span>
                <span className="block mt-1 text-red-500 font-bold">
                  Important: Store this securely! Never share your secret key.
                </span>
              </p>
            )}
            <p className="mt-2 text-sm">
              <span className="font-medium">Balance:</span> {isLoading ? 'Loading...' : `${balance} XLM`}
            </p>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button 
          className="w-full" 
          onClick={saveWalletToDatabase}
          disabled={!publicKey}
        >
          Link Wallet to Account
        </Button>
      </CardFooter>
    </Card>
  )
}