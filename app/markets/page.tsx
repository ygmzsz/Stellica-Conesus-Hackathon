"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Star } from "lucide-react"
import { MarketTable } from "@/components/market-table"
import { useCryptoData } from "@/components/crypto-data-provider"
import { RealTimePrice } from "@/components/real-time-price"
import { useEffect, useState } from "react"
import { type CryptoPrice } from "@/lib/crypto-api"

export default function MarketsPage() {
  const { prices, isLoading } = useCryptoData()
  const [isClient, setIsClient] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  
  // Enable client-side rendering to prevent hydration issues
  useEffect(() => {
    setIsClient(true)
  }, [])
  
  // Only calculate metrics once the client has mounted
  const totalMarketCap = isClient ? prices.reduce((sum, crypto) => sum + (typeof crypto.market_cap === 'number' ? crypto.market_cap : 0), 0) : 0
  const totalVolume = isClient ? prices.reduce((sum, crypto) => sum + (typeof crypto.total_volume === 'number' ? crypto.total_volume : 0), 0) : 0
  
  // Calculate dominance
  const btcDominance = isClient ? prices.find(c => c.id === 'bitcoin')?.market_cap ?? 0 : 0
  const ethDominance = isClient ? prices.find(c => c.id === 'ethereum')?.market_cap ?? 0 : 0
  const btcDominancePercent = btcDominance > 0 ? ((btcDominance / totalMarketCap) * 100).toFixed(1) : '0.0'
  const ethDominancePercent = ethDominance > 0 ? ((ethDominance / totalMarketCap) * 100).toFixed(1) : '0.0'
  
  // Get trending cryptos - safely
  let trendingCryptos: CryptoPrice[] = [];
  if (isClient && prices.length > 0) {
    // Filter out any invalid entries and sort
    trendingCryptos = [...prices]
      .filter(crypto => 
        typeof crypto.price_change_percentage_24h === 'number' && 
        typeof crypto.current_price === 'number'
      )
      .sort((a, b) => 
        (typeof b.price_change_percentage_24h === 'number' ? b.price_change_percentage_24h : 0) - 
        (typeof a.price_change_percentage_24h === 'number' ? a.price_change_percentage_24h : 0)
      )
      .slice(0, 3);
  }

  if (!isClient) {
    // SSR placeholder
    return (
      <main className="flex-1 p-4 md:p-6">
        <h1 className="mb-6 text-2xl font-bold">Markets</h1>
        <div className="animate-pulse">Loading...</div>
      </main>
    )
  }

  return (
    <main className="flex-1 p-4 md:p-6">
      <h1 className="mb-6 text-2xl font-bold">Markets</h1>

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle>Cryptocurrency Markets</CardTitle>
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input 
                className="w-full pl-8 sm:w-[250px]" 
                placeholder="Search markets..." 
                autoComplete="off"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="mb-4 w-full justify-start">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="favorites">
                <Star className="mr-1 h-4 w-4" />
                Favorites
              </TabsTrigger>
              <TabsTrigger value="gainers">Top Gainers</TabsTrigger>
              <TabsTrigger value="losers">Top Losers</TabsTrigger>
              <TabsTrigger value="volume">Volume</TabsTrigger>
            </TabsList>

            <TabsContent value="all">
              <MarketTable />
            </TabsContent>

            <TabsContent value="favorites">
              <div className="flex h-[200px] flex-col items-center justify-center rounded-lg border border-dashed">
                <Star className="mb-2 h-10 w-10 text-muted-foreground" />
                <h3 className="text-lg font-medium">No favorites yet</h3>
                <p className="text-sm text-muted-foreground">Add cryptocurrencies to your favorites list</p>
                <Button className="mt-4" variant="outline">
                  Browse Markets
                </Button>
              </div>
            </TabsContent>

            {/* Other tabs would have similar content to "all" but filtered */}
            <TabsContent value="gainers">
              <MarketTable filter="gainers" />
            </TabsContent>

            <TabsContent value="losers">
              <MarketTable filter="losers" />
            </TabsContent>

            <TabsContent value="volume">
              <MarketTable filter="volume" />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Market Insights</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex h-[200px] items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-lg border p-4">
                    <p className="text-sm text-muted-foreground">Global Market Cap</p>
                    <p className="text-2xl font-bold">${(totalMarketCap / 1e12).toFixed(2)}T</p>
                    <p className="text-xs text-green-500 dark:text-green-400">
                      {prices.length > 0 && (prices[0]?.market_cap_change_percentage_24h || 0) > 0 ? '+' : ''}
                      {prices.length > 0 ? (prices[0]?.market_cap_change_percentage_24h || 0).toFixed(2) : '0.00'}% (24h)
                    </p>
                  </div>
                  <div className="rounded-lg border p-4">
                    <p className="text-sm text-muted-foreground">24h Volume</p>
                    <p className="text-2xl font-bold">${(totalVolume / 1e9).toFixed(1)}B</p>
                    <p className="text-xs text-green-500 dark:text-green-400">Updated in real-time</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-lg border p-4">
                    <p className="text-sm text-muted-foreground">BTC Dominance</p>
                    <p className="text-2xl font-bold">{btcDominancePercent}%</p>
                    <p className="text-xs text-muted-foreground">Market share</p>
                  </div>
                  <div className="rounded-lg border p-4">
                    <p className="text-sm text-muted-foreground">ETH Dominance</p>
                    <p className="text-2xl font-bold">{ethDominancePercent}%</p>
                    <p className="text-xs text-muted-foreground">Market share</p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Trending Cryptocurrencies</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex h-[200px] items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
              </div>
            ) : (
              <div className="space-y-4">
                {trendingCryptos.map((crypto, index) => {
                  // Safe access to numeric values
                  const price = typeof crypto.current_price === 'number' ? crypto.current_price : 0;
                  const change = typeof crypto.price_change_percentage_24h === 'number' ? 
                    crypto.price_change_percentage_24h : 0;
                  const isPositive = change > 0;
                  
                  return (
                    <div key={crypto.id} className="flex items-center justify-between rounded-lg border p-4">
                      <div className="flex items-center gap-3">
                        <div className="flex size-10 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900">
                          <span className="text-sm font-bold text-purple-600 dark:text-purple-300">{index + 1}</span>
                        </div>
                        <div>
                          <p className="font-medium">{crypto.name} ({crypto.symbol.toUpperCase()})</p>
                          <p className="text-xs text-muted-foreground">${price.toLocaleString()}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`font-medium ${isPositive ? 'text-green-500 dark:text-green-400' : 'text-red-500 dark:text-red-400'}`}>
                          {isPositive ? '+' : ''}{Math.abs(change).toFixed(2)}%
                        </p>
                        <p className="text-xs text-muted-foreground">24h change</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
