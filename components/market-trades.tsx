import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function MarketTrades() {
  // Mock data for market trades
  const trades = [
    { price: 65432.18, amount: 0.025, time: "12:45:32", type: "buy" },
    { price: 65430.5, amount: 0.015, time: "12:45:28", type: "sell" },
    { price: 65432.18, amount: 0.032, time: "12:45:15", type: "buy" },
    { price: 65428.75, amount: 0.018, time: "12:45:10", type: "sell" },
    { price: 65430.0, amount: 0.042, time: "12:45:05", type: "buy" },
    { price: 65425.0, amount: 0.038, time: "12:44:58", type: "buy" },
    { price: 65422.25, amount: 0.022, time: "12:44:45", type: "sell" },
    { price: 65425.0, amount: 0.045, time: "12:44:32", type: "buy" },
    { price: 65420.5, amount: 0.03, time: "12:44:28", type: "sell" },
    { price: 65425.0, amount: 0.055, time: "12:44:15", type: "buy" },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Market Trades</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-1">
          <div className="mb-2 grid grid-cols-3 text-xs font-medium text-muted-foreground">
            <div>Price (USDT)</div>
            <div className="text-right">Amount (BTC)</div>
            <div className="text-right">Time</div>
          </div>

          {trades.map((trade, index) => (
            <div key={index} className="grid grid-cols-3 text-sm">
              <div
                className={`font-medium ${trade.type === "buy" ? "text-green-500 dark:text-green-400" : "text-red-500 dark:text-red-400"}`}
              >
                {trade.price.toLocaleString("en-US", { minimumFractionDigits: 2 })}
              </div>
              <div className="text-right">{trade.amount.toFixed(4)}</div>
              <div className="text-right text-muted-foreground">{trade.time}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
