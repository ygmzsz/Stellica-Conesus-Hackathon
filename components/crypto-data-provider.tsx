"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { fetchCryptoPrices, type CryptoPrice } from "@/lib/crypto-api"

interface CryptoDataContextType {
  prices: CryptoPrice[]
  isLoading: boolean
  error: string | null
  refreshData: () => Promise<void>
}

const CryptoDataContext = createContext<CryptoDataContextType>({
  prices: [],
  isLoading: true,
  error: null,
  refreshData: async () => {},
})

export const useCryptoData = () => useContext(CryptoDataContext)

interface CryptoDataProviderProps {
  children: ReactNode
  refreshInterval?: number // in milliseconds
}

export function CryptoDataProvider({ children, refreshInterval = 60000 }: CryptoDataProviderProps) {
  const [prices, setPrices] = useState<CryptoPrice[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = async () => {
    try {
      setError(null)
      const data = await fetchCryptoPrices()
      setPrices(data)
    } catch (err) {
      console.error("Error fetching crypto data:", err)
      setError("Failed to fetch cryptocurrency data. Please try again later.")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchData()

    // Set up polling for real-time updates
    const intervalId = setInterval(fetchData, refreshInterval)

    return () => clearInterval(intervalId)
  }, [refreshInterval])

  return (
    <CryptoDataContext.Provider
      value={{
        prices,
        isLoading,
        error,
        refreshData: fetchData,
      }}
    >
      {children}
    </CryptoDataContext.Provider>
  )
}
