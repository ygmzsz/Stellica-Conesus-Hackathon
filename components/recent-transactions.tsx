import { ArrowDown, ArrowUp } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function RecentTransactions() {
  const transactions = [
    { type: "buy", coin: "Bitcoin", amount: 0.05, value: 3271.61, time: "10:32 AM" },
    { type: "sell", coin: "Ethereum", amount: 1.2, value: 4225.98, time: "Yesterday" },
    { type: "buy", coin: "Solana", amount: 5.0, value: 894.6, time: "Yesterday" },
    { type: "buy", coin: "Cardano", amount: 500, value: 290.0, time: "May 12" },
    { type: "sell", coin: "Bitcoin", amount: 0.02, value: 1308.64, time: "May 10" },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Transactions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {transactions.map((transaction, index) => (
            <div key={index} className="flex items-center justify-between rounded-lg border p-3">
              <div className="flex items-center gap-3">
                <div
                  className={`flex size-10 items-center justify-center rounded-full ${transaction.type === "buy" ? "bg-green-500/10" : "bg-red-500/10"}`}
                >
                  {transaction.type === "buy" ? (
                    <ArrowDown className="h-5 w-5 text-green-500 dark:text-green-400" />
                  ) : (
                    <ArrowUp className="h-5 w-5 text-red-500 dark:text-red-400" />
                  )}
                </div>
                <div>
                  <p className="font-medium">
                    {transaction.type === "buy" ? "Bought" : "Sold"} {transaction.coin}
                  </p>
                  <p className="text-xs text-muted-foreground">{transaction.time}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-medium">
                  {transaction.type === "buy" ? "+" : "-"}
                  {transaction.amount} {transaction.coin.substring(0, 3).toUpperCase()}
                </p>
                <p className="text-xs text-muted-foreground">${transaction.value.toLocaleString()}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
