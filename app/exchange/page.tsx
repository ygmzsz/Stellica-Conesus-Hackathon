import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { TradingView } from "@/components/trading-view"
import { OrderBook } from "@/components/order-book"
import { MarketTrades } from "@/components/market-trades"

export default function ExchangePage() {
  return (
    <main className="flex-1 p-4 md:p-6">
      <h1 className="mb-6 text-2xl font-bold">Exchange</h1>

      <div className="grid gap-6 lg:grid-cols-4">
        <div className="lg:col-span-3">
          <Card className="mb-6">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>BTC/USDT</CardTitle>
                  <CardDescription>Bitcoin to Tether</CardDescription>
                </div>
                <div className="text-right">
                  <div className="text-xl font-bold">$65,432.18</div>
                  <div className="text-sm font-medium text-green-500 dark:text-green-400">+2.34%</div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <TradingView />
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-6 md:grid-cols-2">
            <OrderBook />
            <MarketTrades />
          </div>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Trade</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="buy" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="buy">Buy</TabsTrigger>
                  <TabsTrigger value="sell">Sell</TabsTrigger>
                  <TabsTrigger value="convert">Convert</TabsTrigger>
                </TabsList>
                <TabsContent value="buy" className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <Label htmlFor="pair">Pair</Label>
                    <Select defaultValue="btc">
                      <SelectTrigger>
                        <SelectValue placeholder="Select pair" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="btc">BTC/USDT</SelectItem>
                        <SelectItem value="eth">ETH/USDT</SelectItem>
                        <SelectItem value="sol">SOL/USDT</SelectItem>
                        <SelectItem value="ada">ADA/USDT</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="type">Order Type</Label>
                    <Select defaultValue="market">
                      <SelectTrigger>
                        <SelectValue placeholder="Select order type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="market">Market</SelectItem>
                        <SelectItem value="limit">Limit</SelectItem>
                        <SelectItem value="stop">Stop-Limit</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="amount">Amount (BTC)</Label>
                    <Input id="amount" type="number" placeholder="0.00" step="0.001" min="0" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="total">Total (USDT)</Label>
                    <Input id="total" type="number" placeholder="0.00" readOnly />
                  </div>

                  <Button className="w-full bg-green-500 text-white hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700">
                    Buy BTC
                  </Button>
                </TabsContent>

                <TabsContent value="sell" className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <Label htmlFor="pair">Pair</Label>
                    <Select defaultValue="btc">
                      <SelectTrigger>
                        <SelectValue placeholder="Select pair" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="btc">BTC/USDT</SelectItem>
                        <SelectItem value="eth">ETH/USDT</SelectItem>
                        <SelectItem value="sol">SOL/USDT</SelectItem>
                        <SelectItem value="ada">ADA/USDT</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="type">Order Type</Label>
                    <Select defaultValue="market">
                      <SelectTrigger>
                        <SelectValue placeholder="Select order type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="market">Market</SelectItem>
                        <SelectItem value="limit">Limit</SelectItem>
                        <SelectItem value="stop">Stop-Limit</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="amount">Amount (BTC)</Label>
                    <Input id="amount" type="number" placeholder="0.00" step="0.001" min="0" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="total">Total (USDT)</Label>
                    <Input id="total" type="number" placeholder="0.00" readOnly />
                  </div>

                  <Button className="w-full bg-red-500 text-white hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700">
                    Sell BTC
                  </Button>
                </TabsContent>

                <TabsContent value="convert" className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <Label htmlFor="from">From</Label>
                    <Select defaultValue="btc">
                      <SelectTrigger>
                        <SelectValue placeholder="Select currency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="btc">BTC</SelectItem>
                        <SelectItem value="eth">ETH</SelectItem>
                        <SelectItem value="sol">SOL</SelectItem>
                        <SelectItem value="usdt">USDT</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="fromAmount">Amount</Label>
                    <Input id="fromAmount" type="number" placeholder="0.00" step="0.001" min="0" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="to">To</Label>
                    <Select defaultValue="usdt">
                      <SelectTrigger>
                        <SelectValue placeholder="Select currency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="btc">BTC</SelectItem>
                        <SelectItem value="eth">ETH</SelectItem>
                        <SelectItem value="sol">SOL</SelectItem>
                        <SelectItem value="usdt">USDT</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="toAmount">You'll receive</Label>
                    <Input id="toAmount" type="number" placeholder="0.00" readOnly />
                  </div>

                  <Button className="w-full">Convert</Button>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  )
}
