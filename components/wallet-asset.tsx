import { ArrowDown, ArrowUp } from "lucide-react"
import Image from "next/image"
import { Button } from "@/components/ui/button"

interface WalletAssetProps {
  name: string
  symbol: string
  amount: number
  value: number
  change: number
  icon: string
}

export function WalletAsset({ name, symbol, amount, value, change, icon }: WalletAssetProps) {
  const isPositive = change > 0

  return (
    <div className="flex items-center justify-between rounded-lg border p-4">
      <div className="flex items-center gap-3">
        <div className="flex size-10 items-center justify-center rounded-full bg-muted">
          <Image src={icon || "/placeholder.svg"} alt={name} width={40} height={40} className="rounded-full" />
        </div>
        <div>
          <h3 className="font-medium">{name}</h3>
          <div className="flex items-center gap-2">
            <p className="text-sm text-muted-foreground">
              {amount} {symbol}
            </p>
            <div
              className={`flex items-center gap-1 rounded-full px-1.5 py-0.5 text-xs font-medium ${isPositive ? "bg-green-500/10 text-green-500 dark:text-green-400" : "bg-red-500/10 text-red-500 dark:text-red-400"}`}
            >
              {isPositive ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
              {Math.abs(change)}%
            </div>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="text-right">
          <p className="font-medium">
            ${value.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
          <p className="text-xs text-muted-foreground">
            ${(value / amount).toLocaleString("en-US", { maximumFractionDigits: 2 })} per {symbol}
          </p>
        </div>
        <div className="flex gap-1">
          <Button variant="outline" size="sm">
            Trade
          </Button>
        </div>
      </div>
    </div>
  )
}
