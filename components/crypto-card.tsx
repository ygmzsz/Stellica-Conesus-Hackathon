import { ArrowDown, ArrowUp } from "lucide-react"
import Image from "next/image"

interface CryptoCardProps {
  name: string
  symbol: string
  price: number
  change: number
  icon: string
}

export function CryptoCard({ name, symbol, price, change, icon }: CryptoCardProps) {
  const isPositive = change > 0

  return (
    <div className="rounded-xl border bg-card p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-full bg-muted">
            <Image src={icon || "/placeholder.svg"} alt={name} width={40} height={40} className="rounded-full" />
          </div>
          <div>
            <h3 className="font-medium">{name}</h3>
            <p className="text-xs text-muted-foreground">{symbol}</p>
          </div>
        </div>
        <div
          className={`flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium ${isPositive ? "bg-green-500/10 text-green-500 dark:text-green-400" : "bg-red-500/10 text-red-500 dark:text-red-400"}`}
        >
          {isPositive ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
          {Math.abs(change)}%
        </div>
      </div>
      <div className="mt-3">
        <p className="text-2xl font-bold">
          ${price.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </p>
      </div>
    </div>
  )
}
