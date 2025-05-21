// This file handles the real-time cryptocurrency data fetching

import { NextApiRequest, NextApiResponse } from "next/types"

export interface CryptoPrice {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  fully_diluted_valuation: number | null;
  total_volume: number;
  high_24h: number;
  low_24h: number;
  price_change_24h: number;
  price_change_percentage_24h: number;
  market_cap_change_24h: number;
  market_cap_change_percentage_24h: number;
  circulating_supply: number;
  total_supply: number | null;
  max_supply: number | null;
  ath: number;
  ath_change_percentage: number;
  ath_date: string;
  atl: number;
  atl_change_percentage: number;
  atl_date: string;
  last_updated: string;
}

export interface CryptoHistoricalData {
  prices: [number, number][]; // [timestamp, price]
  market_caps: [number, number][]; // [timestamp, market_cap]
  total_volumes: [number, number][]; // [timestamp, volume]
}

// The main function to fetch cryptocurrency prices - no mock data fallback
export async function fetchCryptoPrices(ids?: string[]): Promise<CryptoPrice[]> {
  // Default cryptocurrencies to fetch if none specified
  const defaultIds = [
    'bitcoin',
    'ethereum',
    'solana',
    'cardano',
    'ripple',
    'polkadot',
    'avalanche',
    'dogecoin',
    'chainlink',
    'polygon'
  ];
  
  const cryptoIds = ids?.length ? ids.join(',') : defaultIds.join(',');
  
  // API URL with proper parameters
  const apiUrl = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${cryptoIds}&order=market_cap_desc&per_page=100&page=1&sparkline=false&price_change_percentage=24h`;
  
  // Add a cache-busting parameter to avoid stale data
  const url = `${apiUrl}&_timestamp=${Date.now()}`;
  
  console.log('Fetching crypto data from:', url);
  
  const response = await fetch(url, {
    headers: {
      'Accept': 'application/json',
      // If you have a CoinGecko API key, add it here
      // 'x-cg-api-key': process.env.COINGECKO_API_KEY,
    },
    cache: 'no-store'
  });
  
  if (!response.ok) {
    console.error(`API error: ${response.status} - ${response.statusText}`);
    
    // If we get rate limited (429), provide a more helpful message
    if (response.status === 429) {
      throw new Error('CoinGecko API rate limit reached. Consider using an API key or reducing request frequency.');
    }
    
    throw new Error(`CoinGecko API returned status ${response.status}`);
  }
  
  const data = await response.json();
  console.log('Successfully fetched data for', data.length, 'cryptocurrencies');
  return data;
}

// Historical data function with improved error handling - no mock data fallback
export async function fetchCryptoHistoricalData(
  id = "bitcoin",
  days = 7,
  currency = "usd"
): Promise<CryptoHistoricalData> {
  const url = `https://api.coingecko.com/api/v3/coins/${id}/market_chart?vs_currency=${currency}&days=${days}`;

  console.log('Fetching historical data for', id);
  
  const response = await fetch(url, {
    headers: {
      'Accept': 'application/json',
      // If you have a CoinGecko API key, add it here
      // 'x-cg-api-key': process.env.COINGECKO_API_KEY,
    },
    cache: 'no-store'
  });
  
  if (!response.ok) {
    console.error(`Historical data API error: ${response.status} - ${response.statusText}`);
    throw new Error(`Failed to fetch historical data: API returned ${response.status}`);
  }
  
  const data = await response.json();
  console.log('Successfully fetched historical data for', id);
  return data;
}

// Alternative API function that uses a different free crypto API if CoinGecko fails
export async function fetchCryptoPricesAlternative(symbols?: string[]): Promise<CryptoPrice[]> {
  const defaultSymbols = ['BTC', 'ETH', 'SOL', 'ADA', 'XRP', 'DOT', 'AVAX', 'DOGE', 'LINK', 'MATIC'];
  const cryptoSymbols = symbols?.length ? symbols.join(',') : defaultSymbols.join(',');
  
  // Using CoinCap API as an alternative (another free API)
  const url = `https://api.coincap.io/v2/assets?ids=${cryptoSymbols.toLowerCase()}`;
  
  console.log('Fetching from alternative API:', url);
  
  const response = await fetch(url, {
    headers: {
      'Accept': 'application/json',
    },
    cache: 'no-store'
  });
  
  if (!response.ok) {
    throw new Error(`Alternative API returned status ${response.status}`);
  }
  
  const { data } = await response.json();
  
  // Transform CoinCap data format to match our CryptoPrice interface
  return data.map((coin: any) => ({
    id: coin.id,
    symbol: coin.symbol.toLowerCase(),
    name: coin.name,
    image: `https://assets.coincap.io/assets/icons/${coin.symbol.toLowerCase()}@2x.png`,
    current_price: parseFloat(coin.priceUsd),
    market_cap: parseFloat(coin.marketCapUsd),
    market_cap_rank: parseInt(coin.rank),
    fully_diluted_valuation: null,
    total_volume: parseFloat(coin.volumeUsd24Hr),
    high_24h: 0, // Not provided by CoinCap
    low_24h: 0, // Not provided by CoinCap
    price_change_24h: 0, // Calculated differently in CoinCap
    price_change_percentage_24h: parseFloat(coin.changePercent24Hr),
    market_cap_change_24h: 0, // Not provided
    market_cap_change_percentage_24h: 0, // Not provided
    circulating_supply: parseFloat(coin.supply),
    total_supply: parseFloat(coin.maxSupply) || null,
    max_supply: parseFloat(coin.maxSupply) || null,
    ath: 0, // Not provided
    ath_change_percentage: 0, // Not provided
    ath_date: '', // Not provided
    atl: 0, // Not provided
    atl_change_percentage: 0, // Not provided
    atl_date: '', // Not provided
    last_updated: new Date().toISOString(),
  }));
}

// Function to try multiple APIs in sequence until one works
export async function fetchCryptoPricesRobust(ids?: string[]): Promise<CryptoPrice[]> {
  try {
    // Try CoinGecko first
    return await fetchCryptoPrices(ids);
  } catch (error) {
    console.error('Primary API failed, trying alternative:', error);
    
    try {
      // If CoinGecko fails, try the alternative API
      // Note: We need to convert IDs to symbols for this API
      const symbols = ids?.map(id => {
        // Simple mapping for common cryptos
        const mapping: {[key: string]: string} = {
          'bitcoin': 'BTC',
          'ethereum': 'ETH',
          'solana': 'SOL',
          'cardano': 'ADA',
          'ripple': 'XRP',
          'polkadot': 'DOT',
          'avalanche': 'AVAX',
          'dogecoin': 'DOGE',
          'chainlink': 'LINK',
          'polygon': 'MATIC'
        };
        return mapping[id] || id.toUpperCase();
      });
      
      return await fetchCryptoPricesAlternative(symbols);
    } catch (alternativeError) {
      console.error('Alternative API also failed:', alternativeError);
      throw new Error('All cryptocurrency APIs failed. Please try again later.');
    }
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
