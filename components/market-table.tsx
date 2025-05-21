"use client"

import { ArrowDown, ArrowUp, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCryptoData } from "@/components/crypto-data-provider"

interface MarketTableProps {
  filter?: "gainers" | "losers" | "volume"
}

export function MarketTable({ filter }: MarketTableProps) {
  const { prices, isLoading, error } = useCryptoData()
  
  if (isLoading) {
    return (
      <div className="flex h-[200px] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    )
  }
  
  if (error) {
    return (
      <div className="flex h-[200px] flex-col items-center justify-center text-red-500">
        <p>Error loading cryptocurrency data</p>
        <p className="text-sm">{error}</p>
      </div>
    )
  }

  // Apply filters if specified
  let filteredData = [...prices]
  
  if (filter === "gainers") {
    filteredData = filteredData.filter((crypto) => (crypto.price_change_percentage_24h || 0) > 0)
      .sort((a, b) => (b.price_change_percentage_24h || 0) - (a.price_change_percentage_24h || 0))
  } else if (filter === "losers") {
    filteredData = filteredData.filter((crypto) => (crypto.price_change_percentage_24h || 0) < 0)
      .sort((a, b) => (a.price_change_percentage_24h || 0) - (b.price_change_percentage_24h || 0))
  } else if (filter === "volume") {
    filteredData = filteredData.sort((a, b) => (b.total_volume || 0) - (a.total_volume || 0))
  }

  if (filteredData.length === 0) {
    return (
      <div className="flex h-[200px] flex-col items-center justify-center text-muted-foreground">
        <p>No data available</p>
      </div>
    );
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
          {filteredData.map((crypto, index) => {
            // Ensure values are numbers
            const price = typeof crypto.current_price === 'number' ? crypto.current_price : 0;
            const change = typeof crypto.price_change_percentage_24h === 'number' ? 
              crypto.price_change_percentage_24h : 0;
            const volume = typeof crypto.total_volume === 'number' ? crypto.total_volume : 0;
            const marketCap = typeof crypto.market_cap === 'number' ? crypto.market_cap : 0;
            const isPositive = change > 0;

            return (
              <tr key={crypto.id} className="border-b text-sm hover:bg-muted/50">
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
                    <div className="size-8 rounded-full overflow-hidden">
                      <img src={crypto.image} alt={crypto.name} className="h-full w-full object-cover" />
                    </div>
                    <div>
                      <p className="font-medium">{crypto.name}</p>
                      <p className="text-xs text-muted-foreground">{crypto.symbol.toUpperCase()}</p>
                    </div>
                  </div>
                </td>
                <td className="py-4 text-right">
                  ${price.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </td>
                <td className="py-4 text-right">
                  <div
                    className={`inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-xs font-medium ${isPositive ? "bg-green-500/10 text-green-500 dark:text-green-400" : "bg-red-500/10 text-red-500 dark:text-red-400"}`}
                  >
                    {isPositive ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
                    {Math.abs(change).toFixed(2)}%
                  </div>
                </td>
                <td className="py-4 text-right">${(volume / 1e9).toFixed(1)}B</td>
                <td className="py-4 text-right">${(marketCap / 1e9).toFixed(1)}B</td>
                <td className="py-4 text-right pr-4">
                  <Button size="sm" variant="outline">
                    Trade
                  </Button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  )
}
