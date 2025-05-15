import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Star } from "lucide-react"
import { MarketTable } from "@/components/market-table"

export default function MarketsPage() {
  return (
    <main className="flex-1 p-4 md:p-6">
      <h1 className="mb-6 text-2xl font-bold">Markets</h1>

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle>Cryptocurrency Markets</CardTitle>
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input type="search" placeholder="Search markets..." className="w-full pl-8 sm:w-[250px]" />
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
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-lg border p-4">
                  <p className="text-sm text-muted-foreground">Global Market Cap</p>
                  <p className="text-2xl font-bold">$2.45T</p>
                  <p className="text-xs text-green-500 dark:text-green-400">+3.2% (24h)</p>
                </div>
                <div className="rounded-lg border p-4">
                  <p className="text-sm text-muted-foreground">24h Volume</p>
                  <p className="text-2xl font-bold">$98.7B</p>
                  <p className="text-xs text-green-500 dark:text-green-400">+5.8% (24h)</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-lg border p-4">
                  <p className="text-sm text-muted-foreground">BTC Dominance</p>
                  <p className="text-2xl font-bold">42.3%</p>
                  <p className="text-xs text-red-500 dark:text-red-400">-0.5% (24h)</p>
                </div>
                <div className="rounded-lg border p-4">
                  <p className="text-sm text-muted-foreground">ETH Dominance</p>
                  <p className="text-2xl font-bold">18.7%</p>
                  <p className="text-xs text-green-500 dark:text-green-400">+0.3% (24h)</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Trending Cryptocurrencies</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between rounded-lg border p-4">
                <div className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900">
                    <span className="text-sm font-bold text-purple-600 dark:text-purple-300">1</span>
                  </div>
                  <div>
                    <p className="font-medium">Solana (SOL)</p>
                    <p className="text-xs text-muted-foreground">$178.92</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-green-500 dark:text-green-400">+5.67%</p>
                  <p className="text-xs text-muted-foreground">24h change</p>
                </div>
              </div>

              <div className="flex items-center justify-between rounded-lg border p-4">
                <div className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900">
                    <span className="text-sm font-bold text-purple-600 dark:text-purple-300">2</span>
                  </div>
                  <div>
                    <p className="font-medium">Avalanche (AVAX)</p>
                    <p className="text-xs text-muted-foreground">$38.75</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-green-500 dark:text-green-400">+4.56%</p>
                  <p className="text-xs text-muted-foreground">24h change</p>
                </div>
              </div>

              <div className="flex items-center justify-between rounded-lg border p-4">
                <div className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900">
                    <span className="text-sm font-bold text-purple-600 dark:text-purple-300">3</span>
                  </div>
                  <div>
                    <p className="font-medium">Polkadot (DOT)</p>
                    <p className="text-xs text-muted-foreground">$7.84</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-green-500 dark:text-green-400">+3.21%</p>
                  <p className="text-xs text-muted-foreground">24h change</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
