"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { StellarWalletConnect } from "@/components/stellar-wallet-connect"
import { Button } from "@/components/ui/button"
import { ArrowLeft, ArrowRight } from "lucide-react"

export default function SetupWalletPage() {
  const router = useRouter()
  const [step, setStep] = useState(0)

  const steps = [
    {
      title: "Connect to Stellar",
      description: "Create or import your Stellar wallet to get started",
      content: <StellarWalletConnect />,
    },
    {
      title: "Fund Your Wallet",
      description: "Add funds to your Stellar wallet to start trading",
      content: (
        <div className="space-y-4 rounded-lg border p-6">
          <h3 className="text-lg font-medium">Fund Your Wallet</h3>
          <p className="text-sm text-muted-foreground">
            Your Stellar wallet needs to be activated with a minimum balance of 1 XLM. You can fund your wallet by:
          </p>
          <ul className="list-inside list-disc space-y-2 text-sm">
            <li>Transferring XLM from another wallet or exchange</li>
            <li>Purchasing XLM with a credit/debit card</li>
            <li>Using a Stellar faucet for testnet accounts</li>
          </ul>
          <div className="flex justify-end">
            <Button onClick={() => setStep(2)}>I've Funded My Wallet</Button>
          </div>
        </div>
      ),
    },
    {
      title: "Setup Complete",
      description: "Your Stellar wallet is ready to use",
      content: (
        <div className="space-y-4 rounded-lg border p-6 text-center">
          <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="h-8 w-8 text-green-600 dark:text-green-400"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
          </div>
          <h3 className="text-lg font-medium">Setup Complete!</h3>
          <p className="text-sm text-muted-foreground">
            Your Stellar wallet is now set up and ready to use. You can now start trading on the Stellar network.
          </p>
          <Button onClick={() => router.push("/")} className="mt-4">
            Go to Dashboard
          </Button>
        </div>
      ),
    },
  ]

  return (
    <div className="container flex min-h-screen flex-col items-center justify-center py-12">
      <div className="mx-auto w-full max-w-md">
        <div className="mb-8">
          <h1 className="text-2xl font-bold">{steps[step].title}</h1>
          <p className="text-muted-foreground">{steps[step].description}</p>
        </div>

        <div className="mb-8">{steps[step].content}</div>

        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            onClick={() => step > 0 && setStep(step - 1)}
            disabled={step === 0}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>

          <div className="flex items-center gap-2">
            {steps.map((_, index) => (
              <div key={index} className={`size-2 rounded-full ${index === step ? "bg-primary" : "bg-muted"}`} />
            ))}
          </div>

          {step < steps.length - 1 && (
            <Button onClick={() => setStep(step + 1)} className="gap-2">
              Next
              <ArrowRight className="h-4 w-4" />
            </Button>
          )}
          {step === steps.length - 1 && (
            <Button onClick={() => router.push("/")} className="gap-2">
              Finish
              <ArrowRight className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
