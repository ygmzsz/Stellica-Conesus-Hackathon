"use client"

import { ArrowDown, ArrowUp } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useCryptoData } from "@/components/crypto-data-provider"

export function MarketOverview() {
  const { prices, isLoading, error } = useCryptoData()
  
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Market Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex h-[200px] items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          </div>
        </CardContent>
      </Card>
    )
  }
  
  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Market Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex h-[200px] flex-col items-center justify-center text-red-500">
            <p>Error loading cryptocurrency data</p>
            <p className="text-sm">{error}</p>
          </div>
        </CardContent>
      </Card>
    )
  }

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
              {prices.slice(0, 8).map((crypto) => {
                // Ensure values are valid numbers
                const price = typeof crypto.current_price === 'number' ? crypto.current_price : 0;
                const change = typeof crypto.price_change_percentage_24h === 'number' ? 
                  crypto.price_change_percentage_24h : 0;
                const volume = typeof crypto.total_volume === 'number' ? crypto.total_volume : 0;
                const isPositive = change > 0;
                
                return (
                  <tr key={crypto.id} className="border-b text-sm hover:bg-muted/50">
                    <td className="py-3 pl-2">
                      <div className="flex items-center gap-2">
                        <div className="size-6 rounded-full overflow-hidden">
                          <img src={crypto.image} alt={crypto.name} className="h-full w-full object-cover" />
                        </div>
                        <div>
                          <p className="font-medium">{crypto.name}</p>
                          <p className="text-xs text-muted-foreground">{crypto.symbol.toUpperCase()}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3">
                      ${price.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                    <td className="py-3">
                      <div
                        className={`flex w-fit items-center gap-1 rounded px-1.5 py-0.5 text-xs font-medium ${isPositive ? "bg-green-500/10 text-green-500 dark:text-green-400" : "bg-red-500/10 text-red-500 dark:text-red-400"}`}
                      >
                        {isPositive ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
                        {Math.abs(change).toFixed(2)}%
                      </div>
                    </td>
                    <td className="py-3 pr-2">${(volume / 1e9).toFixed(1)}B</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}
