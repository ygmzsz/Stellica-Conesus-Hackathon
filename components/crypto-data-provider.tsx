"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { fetchCryptoPricesWithFallback, type CryptoPrice } from "@/lib/crypto-api"

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

export function CryptoDataProvider({ children, refreshInterval = 30000 }: CryptoDataProviderProps) {
  // Track if we're on the client to prevent hydration errors
  const [isClient, setIsClient] = useState(false)
  const [prices, setPrices] = useState<CryptoPrice[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastFetchTime, setLastFetchTime] = useState<string | null>(null)

  // First useEffect to handle client-side detection
  useEffect(() => {
    setIsClient(true)
  }, [])

  const fetchData = async () => {
    if (!isClient) return; // Only fetch on client
    
    try {
      setError(null)
      console.log('CryptoDataProvider: Fetching crypto data...')
      const data = await fetchCryptoPricesWithFallback()
      
      // Validate the data before updating state
      if (Array.isArray(data) && data.length > 0) {
        console.log(`CryptoDataProvider: Received ${data.length} crypto prices`)
        
        // Ensure all numeric values are actually numbers
        const validatedData = data.map(crypto => {
          // Check if crypto object is not null before accessing properties
          if (!crypto) return null;
          
          return {
            ...crypto,
            current_price: typeof crypto.current_price === 'number' ? crypto.current_price : 0,
            price_change_percentage_24h: typeof crypto.price_change_percentage_24h === 'number' ? 
              crypto.price_change_percentage_24h : 0,
            market_cap: typeof crypto.market_cap === 'number' ? crypto.market_cap : 0,
            total_volume: typeof crypto.total_volume === 'number' ? crypto.total_volume : 0,
          };
        }).filter(item => item !== null) as CryptoPrice[];
        
        if (validatedData.length > 0) {
          setPrices(validatedData)
          setLastFetchTime(new Date().toISOString())
        } else {
          setError('No valid price data received')
        }
      } else {
        console.warn('CryptoDataProvider: Received invalid data format')
        setError('Invalid data format received')
      }
    } catch (err) {
      console.error("CryptoDataProvider: Error fetching crypto data:", err)
      setError(`Failed to fetch cryptocurrency data: ${err instanceof Error ? err.message : String(err)}`)
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    if (!isClient) return; // Only run on client
    
    // Initial fetch
    fetchData()

    // Set up polling for real-time updates
    const intervalId = setInterval(fetchData, refreshInterval)
    console.log(`CryptoDataProvider: Set up refresh interval of ${refreshInterval}ms`)

    return () => {
      console.log('CryptoDataProvider: Cleaning up interval')
      clearInterval(intervalId)
    }
  }, [refreshInterval, isClient])

  // Debug output
  useEffect(() => {
    if (!isClient) return; // Only run on client
    
    if (error) {
      console.error('CryptoDataProvider Error:', error)
    }
    if (prices.length > 0) {
      console.log(`CryptoDataProvider: Displaying ${prices.length} crypto prices, last updated at ${lastFetchTime}`)
    }
  }, [prices, error, lastFetchTime, isClient])

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