"use client"

import { useState } from "react"
import { Bell, Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useCryptoData } from "@/components/crypto-data-provider"
import { RealTimePrice } from "@/components/real-time-price"

interface ThresholdRule {
  id: string
  cryptoId: string
  type: "buy" | "sell"
  condition: "above" | "below"
  price: number
  amount: number
  notifyEmail: boolean
  notifyPush: boolean
  active: boolean
}

export default function ThresholdsPage() {
  const { prices, isLoading } = useCryptoData()
  const [rules, setRules] = useState<ThresholdRule[]>([
    {
      id: "rule1",
      cryptoId: "bitcoin",
      type: "sell",
      condition: "above",
      price: 70000,
      amount: 0.1,
      notifyEmail: true,
      notifyPush: true,
      active: true,
    },
    {
      id: "rule2",
      cryptoId: "ethereum",
      type: "buy",
      condition: "below",
      price: 3000,
      amount: 1.5,
      notifyEmail: true,
      notifyPush: false,
      active: true,
    },
  ])

  const [newRule, setNewRule] = useState<Omit<ThresholdRule, "id">>({
    cryptoId: "bitcoin",
    type: "buy",
    condition: "below",
    price: 0,
    amount: 0,
    notifyEmail: true,
    notifyPush: true,
    active: true,
  })

  const handleAddRule = () => {
    const rule: ThresholdRule = {
      ...newRule,
      id: `rule${Date.now()}`,
    }
    setRules([...rules, rule])
    setNewRule({
      cryptoId: "bitcoin",
      type: "buy",
      condition: "below",
      price: 0,
      amount: 0,
      notifyEmail: true,
      notifyPush: true,
      active: true,
    })
  }

  const handleDeleteRule = (id: string) => {
    setRules(rules.filter((rule) => rule.id !== id))
  }

  const handleToggleRule = (id: string) => {
    setRules(rules.map((rule) => (rule.id === id ? { ...rule, active: !rule.active } : rule)))
  }

  const getCryptoName = (id: string) => {
    const crypto = prices.find((p) => p.id === id)
    return crypto ? crypto.name : id
  }

  return (
    <main className="flex-1 p-4 md:p-6">
      <h1 className="mb-6 text-2xl font-bold">Trading Thresholds</h1>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Create New Threshold</CardTitle>
            <CardDescription>
              Set up automatic buy or sell orders when cryptocurrencies reach specific price points
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="crypto">Cryptocurrency</Label>
                <Select value={newRule.cryptoId} onValueChange={(value) => setNewRule({ ...newRule, cryptoId: value })}>
                  <SelectTrigger id="crypto">
                    <SelectValue placeholder="Select cryptocurrency" />
                  </SelectTrigger>
                  <SelectContent>
                    {!isLoading &&
                      prices.map((crypto) => (
                        <SelectItem key={crypto.id} value={crypto.id}>
                          {crypto.name} ({crypto.symbol.toUpperCase()})
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="type">Action</Label>
                <Select
                  value={newRule.type}
                  onValueChange={(value) => setNewRule({ ...newRule, type: value as "buy" | "sell" })}
                >
                  <SelectTrigger id="type">
                    <SelectValue placeholder="Select action" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="buy">Buy</SelectItem>
                    <SelectItem value="sell">Sell</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="condition">Condition</Label>
                <Select
                  value={newRule.condition}
                  onValueChange={(value) => setNewRule({ ...newRule, condition: value as "above" | "below" })}
                >
                  <SelectTrigger id="condition">
                    <SelectValue placeholder="Select condition" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="above">Price goes above</SelectItem>
                    <SelectItem value="below">Price goes below</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="price">Target Price (USD)</Label>
                <Input
                  id="price"
                  type="text"
                  inputMode="decimal"
                  placeholder="0.00"
                  value={newRule.price || ""}
                  onChange={(e) => setNewRule({ ...newRule, price: Number.parseFloat(e.target.value) || 0 })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount">Amount to {newRule.type}</Label>
              <Input
                id="amount"
                type="text"
                inputMode="decimal"
                placeholder="0.00"
                value={newRule.amount || ""}
                onChange={(e) => setNewRule({ ...newRule, amount: Number.parseFloat(e.target.value) || 0 })}
              />
            </div>

            <div className="space-y-3 rounded-lg border p-4">
              <h3 className="font-medium">Notifications</h3>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="email-notification">Email Notification</Label>
                  <p className="text-xs text-muted-foreground">Receive an email when threshold is triggered</p>
                </div>
                <Switch
                  id="email-notification"
                  checked={newRule.notifyEmail}
                  onCheckedChange={(checked) => setNewRule({ ...newRule, notifyEmail: checked })}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="push-notification">Push Notification</Label>
                  <p className="text-xs text-muted-foreground">
                    Receive a push notification when threshold is triggered
                  </p>
                </div>
                <Switch
                  id="push-notification"
                  checked={newRule.notifyPush}
                  onCheckedChange={(checked) => setNewRule({ ...newRule, notifyPush: checked })}
                />
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={handleAddRule} disabled={!newRule.price || !newRule.amount} className="w-full">
              <Plus className="mr-2 h-4 w-4" />
              Create Threshold
            </Button>
          </CardFooter>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Active Thresholds</CardTitle>
              <CardDescription>Your current price thresholds for automatic trading</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="all" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="buy">Buy Orders</TabsTrigger>
                  <TabsTrigger value="sell">Sell Orders</TabsTrigger>
                </TabsList>
                <TabsContent value="all" className="space-y-4 pt-4">
                  {rules.length === 0 ? (
                    <div className="flex h-[200px] flex-col items-center justify-center rounded-lg border border-dashed">
                      <Bell className="mb-2 h-10 w-10 text-muted-foreground" />
                      <h3 className="text-lg font-medium">No thresholds yet</h3>
                      <p className="text-sm text-muted-foreground">Create your first threshold to get started</p>
                    </div>
                  ) : (
                    rules.map((rule) => (
                      <div key={rule.id} className="rounded-lg border p-4">
                        <div className="mb-2 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div
                              className={`flex size-10 items-center justify-center rounded-full ${
                                rule.type === "buy"
                                  ? "bg-green-500/10 text-green-500 dark:text-green-400"
                                  : "bg-red-500/10 text-red-500 dark:text-red-400"
                              }`}
                            >
                              {rule.type === "buy" ? "B" : "S"}
                            </div>
                            <div>
                              <h3 className="font-medium">
                                {rule.type === "buy" ? "Buy" : "Sell"} {getCryptoName(rule.cryptoId)}
                              </h3>
                              <p className="text-xs text-muted-foreground">
                                When price goes {rule.condition} ${rule.price.toLocaleString()}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Switch
                              checked={rule.active}
                              onCheckedChange={() => handleToggleRule(rule.id)}
                              aria-label="Toggle rule"
                            />
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDeleteRule(rule.id)}
                              className="text-muted-foreground hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                              <span className="sr-only">Delete rule</span>
                            </Button>
                          </div>
                        </div>
                        <div className="flex items-center justify-between rounded-lg bg-muted p-2 text-sm">
                          <span>Current price:</span>
                          <RealTimePrice cryptoId={rule.cryptoId} className="font-medium" />
                        </div>
                        <div className="mt-2 text-sm">
                          <span className="text-muted-foreground">Amount: </span>
                          <span className="font-medium">
                            {rule.amount} {prices.find((p) => p.id === rule.cryptoId)?.symbol.toUpperCase() || ""}
                          </span>
                        </div>
                        <div className="mt-1 text-sm">
                          <span className="text-muted-foreground">Notifications: </span>
                          <span className="font-medium">
                            {rule.notifyEmail && rule.notifyPush
                              ? "Email & Push"
                              : rule.notifyEmail
                                ? "Email"
                                : rule.notifyPush
                                  ? "Push"
                                  : "None"}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </TabsContent>
                <TabsContent value="buy" className="space-y-4 pt-4">
                  {rules.filter((rule) => rule.type === "buy").length === 0 ? (
                    <div className="flex h-[200px] flex-col items-center justify-center rounded-lg border border-dashed">
                      <Bell className="mb-2 h-10 w-10 text-muted-foreground" />
                      <h3 className="text-lg font-medium">No buy thresholds</h3>
                      <p className="text-sm text-muted-foreground">Create a buy threshold to get started</p>
                    </div>
                  ) : (
                    rules
                      .filter((rule) => rule.type === "buy")
                      .map((rule) => (
                        <div key={rule.id} className="rounded-lg border p-4">
                          <div className="mb-2 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className="flex size-10 items-center justify-center rounded-full bg-green-500/10 text-green-500 dark:text-green-400">
                                B
                              </div>
                              <div>
                                <h3 className="font-medium">Buy {getCryptoName(rule.cryptoId)}</h3>
                                <p className="text-xs text-muted-foreground">
                                  When price goes {rule.condition} ${rule.price.toLocaleString()}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Switch
                                checked={rule.active}
                                onCheckedChange={() => handleToggleRule(rule.id)}
                                aria-label="Toggle rule"
                              />
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleDeleteRule(rule.id)}
                                className="text-muted-foreground hover:text-destructive"
                              >
                                <Trash2 className="h-4 w-4" />
                                <span className="sr-only">Delete rule</span>
                              </Button>
                            </div>
                          </div>
                          <div className="flex items-center justify-between rounded-lg bg-muted p-2 text-sm">
                            <span>Current price:</span>
                            <RealTimePrice cryptoId={rule.cryptoId} className="font-medium" />
                          </div>
                          <div className="mt-2 text-sm">
                            <span className="text-muted-foreground">Amount: </span>
                            <span className="font-medium">
                              {rule.amount} {prices.find((p) => p.id === rule.cryptoId)?.symbol.toUpperCase() || ""}
                            </span>
                          </div>
                        </div>
                      ))
                  )}
                </TabsContent>
                <TabsContent value="sell" className="space-y-4 pt-4">
                  {rules.filter((rule) => rule.type === "sell").length === 0 ? (
                    <div className="flex h-[200px] flex-col items-center justify-center rounded-lg border border-dashed">
                      <Bell className="mb-2 h-10 w-10 text-muted-foreground" />
                      <h3 className="text-lg font-medium">No sell thresholds</h3>
                      <p className="text-sm text-muted-foreground">Create a sell threshold to get started</p>
                    </div>
                  ) : (
                    rules
                      .filter((rule) => rule.type === "sell")
                      .map((rule) => (
                        <div key={rule.id} className="rounded-lg border p-4">
                          <div className="mb-2 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className="flex size-10 items-center justify-center rounded-full bg-red-500/10 text-red-500 dark:text-red-400">
                                S
                              </div>
                              <div>
                                <h3 className="font-medium">Sell {getCryptoName(rule.cryptoId)}</h3>
                                <p className="text-xs text-muted-foreground">
                                  When price goes {rule.condition} ${rule.price.toLocaleString()}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Switch
                                checked={rule.active}
                                onCheckedChange={() => handleToggleRule(rule.id)}
                                aria-label="Toggle rule"
                              />
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleDeleteRule(rule.id)}
                                className="text-muted-foreground hover:text-destructive"
                              >
                                <Trash2 className="h-4 w-4" />
                                <span className="sr-only">Delete rule</span>
                              </Button>
                            </div>
                          </div>
                          <div className="flex items-center justify-between rounded-lg bg-muted p-2 text-sm">
                            <span>Current price:</span>
                            <RealTimePrice cryptoId={rule.cryptoId} className="font-medium" />
                          </div>
                          <div className="mt-2 text-sm">
                            <span className="text-muted-foreground">Amount: </span>
                            <span className="font-medium">
                              {rule.amount} {prices.find((p) => p.id === rule.cryptoId)?.symbol.toUpperCase() || ""}
                            </span>
                          </div>
                        </div>
                      ))
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Market Overview</CardTitle>
              <CardDescription>Current prices of popular cryptocurrencies</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {isLoading ? (
                  <div className="flex h-[200px] items-center justify-center">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                  </div>
                ) : (
                  prices.slice(0, 5).map((crypto) => (
                    <div key={crypto.id} className="flex items-center justify-between rounded-lg border p-3">
                      <div className="flex items-center gap-3">
                        <div className="size-10 overflow-hidden rounded-full">
                          <img
                            src={crypto.image || "/placeholder.svg"}
                            alt={crypto.name}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div>
                          <h3 className="font-medium">{crypto.name}</h3>
                          <p className="text-xs text-muted-foreground">{crypto.symbol.toUpperCase()}</p>
                        </div>
                      </div>
                      <RealTimePrice cryptoId={crypto.id} className="text-right font-medium" />
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  )
}
