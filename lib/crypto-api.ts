// This file handles the real-time cryptocurrency data fetching

import { NextApiRequest, NextApiResponse } from "next/types"

export interface CryptoPrice {
  id: string
  symbol: string
  name: string
  image: string
  current_price: number
  market_cap: number
  market_cap_rank: number
  fully_diluted_valuation: number | null
  total_volume: number
  high_24h: number
  low_24h: number
  price_change_24h: number
  price_change_percentage_24h: number
  market_cap_change_24h: number
  market_cap_change_percentage_24h: number
  circulating_supply: number
  total_supply: number | null
  max_supply: number | null
  ath: number
  ath_change_percentage: number
  ath_date: string
  atl: number
  atl_change_percentage: number
  atl_date: string
  last_updated: string
}

export interface CryptoHistoricalData {
  prices: [number, number][] // [timestamp, price]
  market_caps: [number, number][] // [timestamp, market_cap]
  total_volumes: [number, number][] // [timestamp, volume]
}

// Fetch cryptocurrency prices
// pages/api/crypto-prices.ts
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const url = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=bitcoin,ethereum,...`
  try {
    const response = await fetch(url)
    if (!response.ok) {
      return res.status(response.status).json({ error: 'API error' });
    }
    const data = await response.json()
    res.status(200).json(data)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch' })
  }
}


// Fetch historical data for a specific cryptocurrency
export async function fetchCryptoHistoricalData(
  id = "bitcoin",
  days = 7,
  currency = "usd",
): Promise<CryptoHistoricalData> {
  const url = `https://api.coingecko.com/api/v3/coins/${id}/market_chart?vs_currency=${currency}&days=${days}`

  try {
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`)
    }
    return await response.json()
  } catch (error) {
    console.error("Error fetching historical data:", error)
    // Return mock data if API fails
    return getMockHistoricalData()
  }
}

// Mock data for when API is unavailable or rate limited
function getMockCryptoPrices(): CryptoPrice[] {
  return [
    {
      id: "bitcoin",
      symbol: "btc",
      name: "Bitcoin",
      image: "https://assets.coingecko.com/coins/images/1/large/bitcoin.png",
      current_price: 65432.18,
      market_cap: 1250000000000,
      market_cap_rank: 1,
      fully_diluted_valuation: 1350000000000,
      total_volume: 12500000000,
      high_24h: 66000.12,
      low_24h: 64500.34,
      price_change_24h: 1500.23,
      price_change_percentage_24h: 2.34,
      market_cap_change_24h: 25000000000,
      market_cap_change_percentage_24h: 2.1,
      circulating_supply: 19000000,
      total_supply: 21000000,
      max_supply: 21000000,
      ath: 69000,
      ath_change_percentage: -5.2,
      ath_date: "2021-11-10T14:24:11.849Z",
      atl: 67.81,
      atl_change_percentage: 96000.12,
      atl_date: "2013-07-06T00:00:00.000Z",
      last_updated: new Date().toISOString(),
    },
    {
      id: "ethereum",
      symbol: "eth",
      name: "Ethereum",
      image: "https://assets.coingecko.com/coins/images/279/large/ethereum.png",
      current_price: 3521.67,
      market_cap: 422600000000,
      market_cap_rank: 2,
      fully_diluted_valuation: 422600000000,
      total_volume: 8200000000,
      high_24h: 3600.45,
      low_24h: 3480.12,
      price_change_24h: -45.23,
      price_change_percentage_24h: -1.24,
      market_cap_change_24h: -5000000000,
      market_cap_change_percentage_24h: -1.2,
      circulating_supply: 120000000,
      total_supply: null,
      max_supply: null,
      ath: 4878.26,
      ath_change_percentage: -28.12,
      ath_date: "2021-11-10T14:24:19.604Z",
      atl: 0.432979,
      atl_change_percentage: 812000.45,
      atl_date: "2015-10-20T00:00:00.000Z",
      last_updated: new Date().toISOString(),
    },
    {
      id: "solana",
      symbol: "sol",
      name: "Solana",
      image: "https://assets.coingecko.com/coins/images/4128/large/solana.png",
      current_price: 178.92,
      market_cap: 76800000000,
      market_cap_rank: 5,
      fully_diluted_valuation: 95000000000,
      total_volume: 3100000000,
      high_24h: 182.45,
      low_24h: 170.12,
      price_change_24h: 9.56,
      price_change_percentage_24h: 5.67,
      market_cap_change_24h: 4000000000,
      market_cap_change_percentage_24h: 5.5,
      circulating_supply: 430000000,
      total_supply: 533000000,
      max_supply: null,
      ath: 259.96,
      ath_change_percentage: -31.45,
      ath_date: "2021-11-06T21:54:35.825Z",
      atl: 0.50428,
      atl_change_percentage: 35000.34,
      atl_date: "2020-05-11T19:35:23.449Z",
      last_updated: new Date().toISOString(),
    },
    {
      id: "cardano",
      symbol: "ada",
      name: "Cardano",
      image: "https://assets.coingecko.com/coins/images/975/large/cardano.png",
      current_price: 0.58,
      market_cap: 20500000000,
      market_cap_rank: 9,
      fully_diluted_valuation: 26000000000,
      total_volume: 1500000000,
      high_24h: 0.59,
      low_24h: 0.57,
      price_change_24h: -0.002,
      price_change_percentage_24h: -0.32,
      market_cap_change_24h: -70000000,
      market_cap_change_percentage_24h: -0.34,
      circulating_supply: 35400000000,
      total_supply: 45000000000,
      max_supply: 45000000000,
      ath: 3.09,
      ath_change_percentage: -81.23,
      ath_date: "2021-09-02T06:00:10.474Z",
      atl: 0.01925275,
      atl_change_percentage: 2900.45,
      atl_date: "2020-03-13T02:22:55.044Z",
      last_updated: new Date().toISOString(),
    },
    {
      id: "ripple",
      symbol: "xrp",
      name: "XRP",
      image: "https://assets.coingecko.com/coins/images/44/large/xrp-symbol-white-128.png",
      current_price: 0.62,
      market_cap: 33700000000,
      market_cap_rank: 7,
      fully_diluted_valuation: 62000000000,
      total_volume: 2300000000,
      high_24h: 0.63,
      low_24h: 0.61,
      price_change_24h: 0.009,
      price_change_percentage_24h: 1.45,
      market_cap_change_24h: 500000000,
      market_cap_change_percentage_24h: 1.5,
      circulating_supply: 54500000000,
      total_supply: 100000000000,
      max_supply: 100000000000,
      ath: 3.4,
      ath_change_percentage: -81.78,
      ath_date: "2018-01-07T00:00:00.000Z",
      atl: 0.00268621,
      atl_change_percentage: 22900.34,
      atl_date: "2014-05-22T00:00:00.000Z",
      last_updated: new Date().toISOString(),
    },
    {
      id: "polkadot",
      symbol: "dot",
      name: "Polkadot",
      image: "https://assets.coingecko.com/coins/images/12171/large/polkadot.png",
      current_price: 7.84,
      market_cap: 10200000000,
      market_cap_rank: 13,
      fully_diluted_valuation: 11500000000,
      total_volume: 900000000,
      high_24h: 7.9,
      low_24h: 7.6,
      price_change_24h: 0.24,
      price_change_percentage_24h: 3.21,
      market_cap_change_24h: 320000000,
      market_cap_change_percentage_24h: 3.2,
      circulating_supply: 1300000000,
      total_supply: 1466000000,
      max_supply: null,
      ath: 54.98,
      ath_change_percentage: -85.74,
      ath_date: "2021-11-04T14:10:09.301Z",
      atl: 2.7,
      atl_change_percentage: 190.45,
      atl_date: "2020-08-20T05:48:11.359Z",
      last_updated: new Date().toISOString(),
    },
    {
      id: "avalanche",
      symbol: "avax",
      name: "Avalanche",
      image: "https://assets.coingecko.com/coins/images/12559/large/Avalanche_Circle_RedWhite_Trans.png",
      current_price: 38.75,
      market_cap: 14300000000,
      market_cap_rank: 11,
      fully_diluted_valuation: 27800000000,
      total_volume: 1200000000,
      high_24h: 39.5,
      low_24h: 37.2,
      price_change_24h: 1.69,
      price_change_percentage_24h: 4.56,
      market_cap_change_24h: 620000000,
      market_cap_change_percentage_24h: 4.5,
      circulating_supply: 370000000,
      total_supply: 720000000,
      max_supply: 720000000,
      ath: 144.96,
      ath_change_percentage: -73.23,
      ath_date: "2021-11-21T14:18:56.538Z",
      atl: 2.8,
      atl_change_percentage: 1280.45,
      atl_date: "2020-12-31T13:15:21.540Z",
      last_updated: new Date().toISOString(),
    },
    {
      id: "dogecoin",
      symbol: "doge",
      name: "Dogecoin",
      image: "https://assets.coingecko.com/coins/images/5/large/dogecoin.png",
      current_price: 0.12,
      market_cap: 16800000000,
      market_cap_rank: 10,
      fully_diluted_valuation: null,
      total_volume: 800000000,
      high_24h: 0.123,
      low_24h: 0.117,
      price_change_24h: -0.003,
      price_change_percentage_24h: -2.34,
      market_cap_change_24h: -400000000,
      market_cap_change_percentage_24h: -2.3,
      circulating_supply: 140000000000,
      total_supply: null,
      max_supply: null,
      ath: 0.731578,
      ath_change_percentage: -83.56,
      ath_date: "2021-05-08T05:08:23.458Z",
      atl: 0.0000869,
      atl_change_percentage: 137900.34,
      atl_date: "2015-05-06T00:00:00.000Z",
      last_updated: new Date().toISOString(),
    },
  ]
}

function getMockHistoricalData(): CryptoHistoricalData {
  const now = Date.now()
  const day = 24 * 60 * 60 * 1000
  const prices: [number, number][] = []
  const market_caps: [number, number][] = []
  const total_volumes: [number, number][] = []

  // Generate 7 days of mock data
  for (let i = 7; i >= 0; i--) {
    const timestamp = now - i * day
    // Generate a price that fluctuates around 65000 for BTC
    const price = 65000 + Math.sin(i) * 2000 + (Math.random() - 0.5) * 1000
    prices.push([timestamp, price])

    // Generate market cap based on price
    const marketCap = price * 19000000 // Assuming ~19M BTC in circulation
    market_caps.push([timestamp, marketCap])

    // Generate volume
    const volume = 5000000000 + (Math.random() - 0.5) * 2000000000
    total_volumes.push([timestamp, volume])
  }

  return {
    prices,
    market_caps,
    total_volumes,
  }
}

// Add this export function
export async function fetchCryptoPrices(): Promise<CryptoPrice[]> {
  console.log('Attempting to fetch crypto prices from API...')
  
  try {
    // Always attempt to fetch real data regardless of environment
    const baseUrl = 'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&sparkline=false&ids=bitcoin,ethereum,solana,cardano,ripple,polkadot,avalanche,dogecoin'
    
    // Add API key if it exists in environment variables
    const apiKey = process.env.NEXT_PUBLIC_COINGECKO_API_KEY
    const url = apiKey ? `${baseUrl}&x_cg_api_key=${apiKey}` : baseUrl
    
    console.log('Fetching crypto prices from CoinGecko API...')
    
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 10000) // Increased timeout
    
    const response = await fetch(url, {
      method: 'GET',
      signal: controller.signal,
      headers: apiKey ? { 'x-cg-api-key': apiKey } : {}
    })
    
    clearTimeout(timeoutId)
    
    if (response.ok) {
      const data = await response.json()
      console.log('Successfully fetched real crypto prices')
      
      // Validate the data
      if (Array.isArray(data) && data.length > 0) {
        return data.map(crypto => ({
          ...crypto,
          current_price: typeof crypto.current_price === 'number' ? crypto.current_price : 0,
          price_change_percentage_24h: typeof crypto.price_change_percentage_24h === 'number' ? 
            crypto.price_change_percentage_24h : 0,
          market_cap: typeof crypto.market_cap === 'number' ? crypto.market_cap : 0,
          total_volume: typeof crypto.total_volume === 'number' ? crypto.total_volume : 0,
        }));
      } else {
        throw new Error('Invalid data format received from API');
      }
    } else {
      throw new Error(`API responded with status: ${response.status}`);
    }
  } catch (error) {
    console.error("Error fetching crypto prices:", error)
    console.log('Falling back to mock data')
    
    // Get fresh mock data with current timestamp
    const mockData = getMockCryptoPrices()
    
    // Update the last_updated field to current time for all mock data items
    const currentTime = new Date().toISOString()
    return mockData.map(crypto => ({
      ...crypto,
      last_updated: currentTime
    }))
  }
}
