import { ArrowDown, ArrowUp } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function MarketOverview() {
  const marketData = [
    { name: "Bitcoin", symbol: "BTC", price: 65432.18, change: 2.34, volume: "12.5B" },
    { name: "Ethereum", symbol: "ETH", price: 3521.67, change: -1.24, volume: "8.2B" },
    { name: "Solana", symbol: "SOL", price: 178.92, change: 5.67, volume: "3.1B" },
    { name: "Cardano", symbol: "ADA", price: 0.58, change: -0.32, volume: "1.5B" },
    { name: "Ripple", symbol: "XRP", price: 0.62, change: 1.45, volume: "2.3B" },
    { name: "Polkadot", symbol: "DOT", price: 7.84, change: 3.21, volume: "0.9B" },
    { name: "Avalanche", symbol: "AVAX", price: 38.75, change: 4.56, volume: "1.2B" },
    { name: "Dogecoin", symbol: "DOGE", price: 0.12, change: -2.34, volume: "0.8B" },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Market Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b text-left text-xs font-medium text-muted-foreground">
                <th className="pb-3 pl-2">Name</th>
                <th className="pb-3">Price</th>
                <th className="pb-3">24h Change</th>
                <th className="pb-3 pr-2">24h Volume</th>
              </tr>
            </thead>
            <tbody>
              {marketData.map((crypto) => (
                <tr key={crypto.symbol} className="border-b text-sm hover:bg-muted/50">
                  <td className="py-3 pl-2">
                    <div className="flex items-center gap-2">
                      <div className="size-6 rounded-full bg-muted" />
                      <div>
                        <p className="font-medium">{crypto.name}</p>
                        <p className="text-xs text-muted-foreground">{crypto.symbol}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3">
                    ${crypto.price.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </td>
                  <td className="py-3">
                    <div
                      className={`flex w-fit items-center gap-1 rounded px-1.5 py-0.5 text-xs font-medium ${crypto.change > 0 ? "bg-green-500/10 text-green-500 dark:text-green-400" : "bg-red-500/10 text-red-500 dark:text-red-400"}`}
                    >
                      {crypto.change > 0 ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
                      {Math.abs(crypto.change)}%
                    </div>
                  </td>
                  <td className="py-3 pr-2">{crypto.volume}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}
