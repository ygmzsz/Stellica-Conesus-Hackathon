import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function OrderBook() {
  // Mock data for the order book
  const asks = [
    { price: 65500.0, amount: 0.25, total: 16375.0 },
    { price: 65480.5, amount: 0.15, total: 9822.08 },
    { price: 65475.25, amount: 0.32, total: 20952.08 },
    { price: 65460.75, amount: 0.18, total: 11782.94 },
    { price: 65450.0, amount: 0.42, total: 27489.0 },
  ]

  const bids = [
    { price: 65425.0, amount: 0.38, total: 24861.5 },
    { price: 65410.25, amount: 0.22, total: 14390.26 },
    { price: 65400.0, amount: 0.45, total: 29430.0 },
    { price: 65385.5, amount: 0.3, total: 19615.65 },
    { price: 65375.0, amount: 0.55, total: 35956.25 },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Order Book</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <div className="mb-2 grid grid-cols-3 text-xs font-medium text-muted-foreground">
              <div>Price (USDT)</div>
              <div className="text-right">Amount (BTC)</div>
              <div className="text-right">Total (USDT)</div>
            </div>
            <div className="space-y-1">
              {asks.map((ask, index) => (
                <div key={index} className="grid grid-cols-3 text-sm">
                  <div className="font-medium text-red-500 dark:text-red-400">
                    {ask.price.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                  </div>
                  <div className="text-right">{ask.amount.toFixed(4)}</div>
                  <div className="text-right">{ask.total.toLocaleString("en-US", { minimumFractionDigits: 2 })}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="border-y py-2 text-center">
            <span className="text-lg font-bold">65,432.18</span>
            <span className="ml-2 text-xs text-muted-foreground">$65,432.18</span>
          </div>

          <div>
            <div className="space-y-1">
              {bids.map((bid, index) => (
                <div key={index} className="grid grid-cols-3 text-sm">
                  <div className="font-medium text-green-500 dark:text-green-400">
                    {bid.price.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                  </div>
                  <div className="text-right">{bid.amount.toFixed(4)}</div>
                  <div className="text-right">{bid.total.toLocaleString("en-US", { minimumFractionDigits: 2 })}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
