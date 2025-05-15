import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowDown, ArrowUp, Copy, ExternalLink, Plus, Wallet } from "lucide-react"
import { WalletAsset } from "@/components/wallet-asset"
import { TransactionHistory } from "@/components/transaction-history"

export default function WalletPage() {
  return (
    <main className="flex-1 p-4 md:p-6">
      <h1 className="mb-6 text-2xl font-bold">Wallet</h1>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Balance</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$39,956.90</div>
            <p className="text-xs text-muted-foreground">+$2,453.23 (6.54%)</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available Balance</CardTitle>
            <ArrowUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$35,245.12</div>
            <p className="text-xs text-muted-foreground">Available for trading</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Locked Balance</CardTitle>
            <ArrowDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$4,711.78</div>
            <p className="text-xs text-muted-foreground">In open orders & staking</p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Your Assets</CardTitle>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <ArrowDown className="mr-2 h-4 w-4" />
                  Deposit
                </Button>
                <Button variant="outline" size="sm">
                  <ArrowUp className="mr-2 h-4 w-4" />
                  Withdraw
                </Button>
                <Button size="sm">
                  <Plus className="mr-2 h-4 w-4" />
                  Buy Crypto
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <WalletAsset
                name="Bitcoin"
                symbol="BTC"
                amount={0.45}
                value={29444.48}
                change={2.34}
                icon="/placeholder.svg?height=40&width=40"
              />
              <WalletAsset
                name="Ethereum"
                symbol="ETH"
                amount={2.35}
                value={8275.92}
                change={-1.24}
                icon="/placeholder.svg?height=40&width=40"
              />
              <WalletAsset
                name="Solana"
                symbol="SOL"
                amount={12.5}
                value={2236.5}
                change={5.67}
                icon="/placeholder.svg?height=40&width=40"
              />
              <WalletAsset
                name="Cardano"
                symbol="ADA"
                amount={500}
                value={290.0}
                change={-0.32}
                icon="/placeholder.svg?height=40&width=40"
              />
              <WalletAsset
                name="Tether"
                symbol="USDT"
                amount={4500}
                value={4500.0}
                change={0.01}
                icon="/placeholder.svg?height=40&width=40"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Deposit Address</CardTitle>
            <CardDescription>Use the following address to deposit funds to your wallet</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="btc" className="w-full">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="btc">BTC</TabsTrigger>
                <TabsTrigger value="eth">ETH</TabsTrigger>
                <TabsTrigger value="sol">SOL</TabsTrigger>
                <TabsTrigger value="ada">ADA</TabsTrigger>
                <TabsTrigger value="usdt">USDT</TabsTrigger>
              </TabsList>
              <TabsContent value="btc" className="pt-4">
                <div className="rounded-lg border p-3">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium break-all">bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh</p>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="icon">
                        <Copy className="h-4 w-4" />
                        <span className="sr-only">Copy address</span>
                      </Button>
                      <Button variant="ghost" size="icon">
                        <ExternalLink className="h-4 w-4" />
                        <span className="sr-only">View on blockchain</span>
                      </Button>
                    </div>
                  </div>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">
                  Only send Bitcoin (BTC) to this address. Sending any other coin may result in permanent loss.
                </p>
              </TabsContent>
              {/* Similar content for other tabs */}
            </Tabs>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6">
        <TransactionHistory />
      </div>
    </main>
  )
}
