import { redirect } from "next/navigation"
import { cookies } from "next/headers"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { CryptoCard } from "@/components/crypto-card"
import { LiveChart } from "@/components/live-chart"
import { RecentTransactions } from "@/components/recent-transactions"
import { Button } from "@/components/ui/button"
import { RealTimePrice } from "@/components/real-time-price"
import Link from "next/link"

export default async function Dashboard() {
  // Properly get cookies
  const cookieStore = cookies()
  
  // Create Supabase client with the cookie store
  const supabase = createServerComponentClient({ cookies: () => cookieStore })

  // Get session
  const {
    data: { session },
  } = await supabase.auth.getSession()

  // If not authenticated, redirect to login
  if (!session) {
    redirect("/login")
  }

  return (
    <main className="flex-1 p-4 md:p-6">
      <h1 className="mb-6 text-2xl font-bold">Dashboard</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <CryptoCard
          name="Bitcoin"
          symbol="BTC"
          price={65432.18}
          change={2.34}
          icon="https://assets.coingecko.com/coins/images/1/large/bitcoin.png"
        />
        <CryptoCard
          name="Ethereum"
          symbol="ETH"
          price={3521.67}
          change={-1.24}
          icon="https://assets.coingecko.com/coins/images/279/large/ethereum.png"
        />
        <CryptoCard
          name="Solana"
          symbol="SOL"
          price={178.92}
          change={5.67}
          icon="https://assets.coingecko.com/coins/images/4128/large/solana.png"
        />
        <CryptoCard
          name="Cardano"
          symbol="ADA"
          price={0.58}
          change={-0.32}
          icon="https://assets.coingecko.com/coins/images/975/large/cardano.png"
        />
      </div>
      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="col-span-2 rounded-xl border bg-card p-4 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-bold">BTC/USDT</h2>
            <div className="flex items-center gap-2">
              <RealTimePrice cryptoId="bitcoin" />
            </div>
          </div>
          <LiveChart cryptoId="bitcoin" height={400} />
          <div className="mt-4 grid grid-cols-2 gap-4">
            <Button className="w-full bg-green-500 text-white hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700">
              Buy
            </Button>
            <Button className="w-full bg-red-500 text-white hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700">
              Sell
            </Button>
          </div>
        </div>
        <div className="flex flex-col gap-6">
          <div className="rounded-xl border bg-card p-4 shadow-sm">
            <h2 className="mb-4 text-xl font-bold">Your Portfolio</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="size-8 rounded-full bg-orange-500/20 p-2">
                    <span className="block h-full w-full rounded-full bg-orange-500" />
                  </div>
                  <div>
                    <p className="font-medium">Bitcoin</p>
                    <p className="text-xs text-muted-foreground">0.45 BTC</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium">$29,444.48</p>
                  <p className="text-xs text-green-500 dark:text-green-400">+2.34%</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="size-8 rounded-full bg-blue-500/20 p-2">
                    <span className="block h-full w-full rounded-full bg-blue-500" />
                  </div>
                  <div>
                    <p className="font-medium">Ethereum</p>
                    <p className="text-xs text-muted-foreground">2.35 ETH</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium">$8,275.92</p>
                  <p className="text-xs text-red-500 dark:text-red-400">-1.24%</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="size-8 rounded-full bg-purple-500/20 p-2">
                    <span className="block h-full w-full rounded-full bg-purple-500" />
                  </div>
                  <div>
                    <p className="font-medium">Solana</p>
                    <p className="text-xs text-muted-foreground">12.5 SOL</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium">$2,236.50</p>
                  <p className="text-xs text-green-500 dark:text-green-400">+5.67%</p>
                </div>
              </div>
            </div>
            <Button className="mt-4 w-full" variant="outline">
              View All Assets
            </Button>
          </div>
          <div className="rounded-xl border bg-card p-4 shadow-sm">
            <h2 className="mb-4 text-xl font-bold">Market News</h2>
            <div className="space-y-4">
              <Link href="#" className="block rounded-lg border p-3 transition-colors hover:bg-muted/50">
                <p className="font-medium">Bitcoin Surpasses $65K as Institutional Interest Grows</p>
                <p className="text-xs text-muted-foreground">2 hours ago</p>
              </Link>
              <Link href="#" className="block rounded-lg border p-3 transition-colors hover:bg-muted/50">
                <p className="font-medium">Ethereum Layer 2 Solutions See Record Adoption</p>
                <p className="text-xs text-muted-foreground">5 hours ago</p>
              </Link>
              <Link href="#" className="block rounded-lg border p-3 transition-colors hover:bg-muted/50">
                <p className="font-medium">Regulatory Clarity Boosts Crypto Market Sentiment</p>
                <p className="text-xs text-muted-foreground">8 hours ago</p>
              </Link>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-6">
        <RecentTransactions />
      </div>
    </main>
  )
}
