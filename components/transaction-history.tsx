import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowDown, ArrowUp, RefreshCw } from "lucide-react"

export function TransactionHistory() {
  // Mock data for transaction history
  const transactions = [
    {
      id: "TX123456789",
      type: "deposit",
      asset: "Bitcoin",
      amount: 0.05,
      value: 3271.61,
      status: "completed",
      date: "2023-05-14",
      time: "10:32 AM",
    },
    {
      id: "TX123456788",
      type: "withdrawal",
      asset: "Ethereum",
      amount: 1.2,
      value: 4225.98,
      status: "completed",
      date: "2023-05-13",
      time: "15:45 PM",
    },
    {
      id: "TX123456787",
      type: "deposit",
      asset: "Solana",
      amount: 5.0,
      value: 894.6,
      status: "completed",
      date: "2023-05-13",
      time: "09:12 AM",
    },
    {
      id: "TX123456786",
      type: "deposit",
      asset: "Cardano",
      amount: 500,
      value: 290.0,
      status: "completed",
      date: "2023-05-12",
      time: "14:23 PM",
    },
    {
      id: "TX123456785",
      type: "withdrawal",
      asset: "Bitcoin",
      amount: 0.02,
      value: 1308.64,
      status: "completed",
      date: "2023-05-10",
      time: "11:05 AM",
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Transaction History</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="mb-4 w-full justify-start">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="deposits">Deposits</TabsTrigger>
            <TabsTrigger value="withdrawals">Withdrawals</TabsTrigger>
            <TabsTrigger value="trades">Trades</TabsTrigger>
          </TabsList>

          <TabsContent value="all">
            <div className="space-y-4">
              {transactions.map((tx) => (
                <div key={tx.id} className="flex items-center justify-between rounded-lg border p-4">
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex size-10 items-center justify-center rounded-full ${
                        tx.type === "deposit"
                          ? "bg-green-500/10"
                          : tx.type === "withdrawal"
                            ? "bg-red-500/10"
                            : "bg-blue-500/10"
                      }`}
                    >
                      {tx.type === "deposit" ? (
                        <ArrowDown className="h-5 w-5 text-green-500 dark:text-green-400" />
                      ) : tx.type === "withdrawal" ? (
                        <ArrowUp className="h-5 w-5 text-red-500 dark:text-red-400" />
                      ) : (
                        <RefreshCw className="h-5 w-5 text-blue-500 dark:text-blue-400" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium">
                        {tx.type === "deposit" ? "Deposit" : tx.type === "withdrawal" ? "Withdrawal" : "Trade"}{" "}
                        {tx.asset}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {tx.date} at {tx.time}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">
                      {tx.type === "deposit" ? "+" : "-"}
                      {tx.amount} {tx.asset.substring(0, 3).toUpperCase()}
                    </p>
                    <p className="text-xs text-muted-foreground">${tx.value.toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          {/* Other tabs would filter the transactions based on type */}
          <TabsContent value="deposits">
            <div className="space-y-4">
              {transactions
                .filter((tx) => tx.type === "deposit")
                .map((tx) => (
                  <div key={tx.id} className="flex items-center justify-between rounded-lg border p-4">
                    <div className="flex items-center gap-3">
                      <div className="flex size-10 items-center justify-center rounded-full bg-green-500/10">
                        <ArrowDown className="h-5 w-5 text-green-500 dark:text-green-400" />
                      </div>
                      <div>
                        <p className="font-medium">Deposit {tx.asset}</p>
                        <p className="text-xs text-muted-foreground">
                          {tx.date} at {tx.time}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">
                        +{tx.amount} {tx.asset.substring(0, 3).toUpperCase()}
                      </p>
                      <p className="text-xs text-muted-foreground">${tx.value.toLocaleString()}</p>
                    </div>
                  </div>
                ))}
            </div>
          </TabsContent>

          <TabsContent value="withdrawals">
            <div className="space-y-4">
              {transactions
                .filter((tx) => tx.type === "withdrawal")
                .map((tx) => (
                  <div key={tx.id} className="flex items-center justify-between rounded-lg border p-4">
                    <div className="flex items-center gap-3">
                      <div className="flex size-10 items-center justify-center rounded-full bg-red-500/10">
                        <ArrowUp className="h-5 w-5 text-red-500 dark:text-red-400" />
                      </div>
                      <div>
                        <p className="font-medium">Withdrawal {tx.asset}</p>
                        <p className="text-xs text-muted-foreground">
                          {tx.date} at {tx.time}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">
                        -{tx.amount} {tx.asset.substring(0, 3).toUpperCase()}
                      </p>
                      <p className="text-xs text-muted-foreground">${tx.value.toLocaleString()}</p>
                    </div>
                  </div>
                ))}
            </div>
          </TabsContent>

          <TabsContent value="trades">
            <div className="flex h-[200px] flex-col items-center justify-center rounded-lg border border-dashed">
              <RefreshCw className="mb-2 h-10 w-10 text-muted-foreground" />
              <h3 className="text-lg font-medium">No trades yet</h3>
              <p className="text-sm text-muted-foreground">Your trading history will appear here</p>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
