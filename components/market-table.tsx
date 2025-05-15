import { ArrowDown, ArrowUp, Star } from "lucide-react"
import { Button } from "@/components/ui/button"

interface MarketTableProps {
  filter?: "gainers" | "losers" | "volume"
}

export function MarketTable({ filter }: MarketTableProps) {
  // Mock data for market table
  let marketData = [
    { name: "Bitcoin", symbol: "BTC", price: 65432.18, change: 2.34, volume: "12.5B", marketCap: "1.25T" },
    { name: "Ethereum", symbol: "ETH", price: 3521.67, change: -1.24, volume: "8.2B", marketCap: "422.6B" },
    { name: "Solana", symbol: "SOL", price: 178.92, change: 5.67, volume: "3.1B", marketCap: "76.8B" },
    { name: "Cardano", symbol: "ADA", price: 0.58, change: -0.32, volume: "1.5B", marketCap: "20.5B" },
    { name: "Ripple", symbol: "XRP", price: 0.62, change: 1.45, volume: "2.3B", marketCap: "33.7B" },
    { name: "Polkadot", symbol: "DOT", price: 7.84, change: 3.21, volume: "0.9B", marketCap: "10.2B" },
    { name: "Avalanche", symbol: "AVAX", price: 38.75, change: 4.56, volume: "1.2B", marketCap: "14.3B" },
    { name: "Dogecoin", symbol: "DOGE", price: 0.12, change: -2.34, volume: "0.8B", marketCap: "16.8B" },
    { name: "Chainlink", symbol: "LINK", price: 15.32, change: 2.87, volume: "0.7B", marketCap: "8.9B" },
    { name: "Polygon", symbol: "MATIC", price: 0.78, change: -1.56, volume: "0.6B", marketCap: "7.5B" },
  ]

  // Apply filters if specified
  if (filter === "gainers") {
    marketData = marketData.filter((crypto) => crypto.change > 0).sort((a, b) => b.change - a.change)
  } else if (filter === "losers") {
    marketData = marketData.filter((crypto) => crypto.change < 0).sort((a, b) => a.change - b.change)
  } else if (filter === "volume") {
    marketData = [...marketData].sort((a, b) => Number.parseFloat(b.volume) - Number.parseFloat(a.volume))
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b text-left text-xs font-medium text-muted-foreground">
            <th className="pb-3 pl-4">#</th>
            <th className="pb-3">Name</th>
            <th className="pb-3 text-right">Price</th>
            <th className="pb-3 text-right">24h Change</th>
            <th className="pb-3 text-right">24h Volume</th>
            <th className="pb-3 text-right">Market Cap</th>
            <th className="pb-3 text-right pr-4">Action</th>
          </tr>
        </thead>
        <tbody>
          {marketData.map((crypto, index) => (
            <tr key={crypto.symbol} className="border-b text-sm hover:bg-muted/50">
              <td className="py-4 pl-4">
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon" className="h-6 w-6">
                    <Star className="h-4 w-4 text-muted-foreground" />
                    <span className="sr-only">Add to favorites</span>
                  </Button>
                  <span>{index + 1}</span>
                </div>
              </td>
              <td className="py-4">
                <div className="flex items-center gap-2">
                  <div className="size-8 rounded-full bg-muted" />
                  <div>
                    <p className="font-medium">{crypto.name}</p>
                    <p className="text-xs text-muted-foreground">{crypto.symbol}</p>
                  </div>
                </div>
              </td>
              <td className="py-4 text-right">
                ${crypto.price.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </td>
              <td className="py-4 text-right">
                <div
                  className={`inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-xs font-medium ${crypto.change > 0 ? "bg-green-500/10 text-green-500 dark:text-green-400" : "bg-red-500/10 text-red-500 dark:text-red-400"}`}
                >
                  {crypto.change > 0 ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
                  {Math.abs(crypto.change)}%
                </div>
              </td>
              <td className="py-4 text-right">{crypto.volume}</td>
              <td className="py-4 text-right">{crypto.marketCap}</td>
              <td className="py-4 text-right pr-4">
                <Button size="sm" variant="outline">
                  Trade
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
