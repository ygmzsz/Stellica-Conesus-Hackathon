"use client"

import { useEffect, useState } from "react"
import { ArrowDown, ArrowUp, AlertCircle } from "lucide-react"
import { useCryptoData } from "@/components/crypto-data-provider"

interface RealTimePriceProps {
  cryptoId: string
  showChange?: boolean
  className?: string
}

export function RealTimePrice({ cryptoId, showChange = true, className = "" }: RealTimePriceProps) {
  const { prices, isLoading, error } = useCryptoData()
  const [priceData, setPriceData] = useState<{
    price: number
    change: number
    isPositive: boolean
  } | null>(null)
  const [animate, setAnimate] = useState(false)

  useEffect(() => {
    if (!isLoading && prices.length > 0) {
      const crypto = prices.find((p) => p.id === cryptoId)
      if (crypto) {
        const newPriceData = {
          price: crypto.current_price,
          change: crypto.price_change_percentage_24h,
          isPositive: crypto.price_change_percentage_24h > 0,
        }

        // If we already have price data, check if the price has changed
        if (priceData && priceData.price !== newPriceData.price) {
          setAnimate(true)
          setTimeout(() => setAnimate(false), 1000)
        }

        setPriceData(newPriceData)
      }
    }
  }, [prices, isLoading, cryptoId, priceData])

  if (error) {
    return (
      <div className={`flex items-center text-red-500 ${className}`}>
        <AlertCircle className="mr-2 h-4 w-4" />
        <span className="text-sm">Error loading price</span>
      </div>
    )
  }

  if (isLoading || !priceData) {
    return <div className={`animate-pulse ${className}`}>Loading...</div>
  }

  // Make sure the price is a valid number before formatting
  const formattedPrice = typeof priceData.price === 'number' ? 
    priceData.price.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : 
    "0.00";

  // Make sure the change is a valid number before formatting
  const formattedChange = typeof priceData.change === 'number' ? 
    Math.abs(priceData.change).toFixed(2) : 
    "0.00";

  return (
    <div className={className}>
      <span
        className={`transition-colors duration-500 ${
          animate ? (priceData.isPositive ? "text-green-500" : "text-red-500") : ""
        }`}
      >
        ${formattedPrice}
      </span>
      {showChange && (
        <span
          className={`ml-2 inline-flex items-center text-sm ${
            priceData.isPositive ? "text-green-500 dark:text-green-400" : "text-red-500 dark:text-red-400"
          }`}
        >
          {priceData.isPositive ? <ArrowUp className="mr-1 h-3 w-3" /> : <ArrowDown className="mr-1 h-3 w-3" />}
          {formattedChange}%
        </span>
      )}
    </div>
  )
}