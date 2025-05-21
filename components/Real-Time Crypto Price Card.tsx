import { useState, useEffect } from 'react';
import { useCryptoData } from './crypto-data-provider';
import { ArrowDown, ArrowUp, ExternalLink } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Skeleton } from './ui/skeleton';
import { type CryptoPrice } from "@/lib/crypto-api";

// Line chart component using Recharts
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';

const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value);
};

const formatCompactCurrency = (value: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    notation: 'compact',
    compactDisplay: 'short'
  }).format(value);
};

const formatDate = (timestamp: number): string => {
  return new Date(timestamp).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric'
  });
};

interface ChartDataPoint {
  date: number;
  price: number;
}

interface CryptoPriceCardProps {
  cryptoId: string;
}

export default function CryptoPriceCard({ cryptoId }: CryptoPriceCardProps) {
  const { prices, isLoading, getHistoricalData } = useCryptoData();
  const [cryptoData, setCryptoData] = useState<CryptoPrice | null>(null);
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [isChartLoading, setIsChartLoading] = useState(true);
  const [timeframe, setTimeframe] = useState(7); // 7 days by default

  // Get the cryptocurrency data from the prices array
  useEffect(() => {
    if (!isLoading && prices.length > 0) {
      const data = prices.find(crypto => crypto.id === cryptoId);
      if (data) {
        setCryptoData(data);
      }
    }
  }, [cryptoId, isLoading, prices]);

  // Fetch historical data for the chart
  useEffect(() => {
    const loadHistoricalData = async () => {
      setIsChartLoading(true);
      try {
        const data = await getHistoricalData(cryptoId, timeframe);
        
        // Format data for the chart
        const formattedData = data.prices.map(([timestamp, price]) => ({
          date: timestamp,
          price: price
        }));
        
        setChartData(formattedData);
      } catch (error) {
        console.error("Error loading chart data:", error);
      } finally {
        setIsChartLoading(false);
      }
    };

    if (cryptoData) {
      loadHistoricalData();
    }
  }, [cryptoId, cryptoData, timeframe, getHistoricalData]);

  // Handle timeframe changes
  const handleTimeframeChange = (days: number) => {
    setTimeframe(days);
  };

  if (isLoading || !cryptoData) {
    return (
      <Card className="w-full overflow-hidden">
        <CardHeader className="pb-2">
          <Skeleton className="h-6 w-32" />
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Skeleton className="h-8 w-24" />
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-[150px] w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  const priceChange = cryptoData.price_change_percentage_24h || 0;
  const isPriceUp = priceChange >= 0;

  return (
    <Card className="w-full overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img 
              src={cryptoData.image} 
              alt={cryptoData.name} 
              className="h-6 w-6 rounded-full"
            />
            <CardTitle>{cryptoData.name} ({cryptoData.symbol.toUpperCase()})</CardTitle>
          </div>
          <Button variant="ghost" size="sm" asChild>
            <a 
              href={`https://www.coingecko.com/en/coins/${cryptoData.id}`} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-1"
            >
              <ExternalLink className="h-4 w-4" />
              <span className="sr-only md:not-sr-only md:inline-block">Details</span>
            </a>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-4 flex items-baseline">
          <div className="text-2xl font-bold">
            {formatCurrency(cryptoData.current_price)}
          </div>
          <div className={`ml-2 flex items-center ${isPriceUp ? 'text-green-500' : 'text-red-500'}`}>
            {isPriceUp ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />}
            <span className="font-medium">{Math.abs(priceChange).toFixed(2)}%</span>
          </div>
        </div>
        
        <div className="mb-2 flex flex-wrap gap-2 text-xs">
          <div className="rounded-full bg-gray-100 px-2 py-1 dark:bg-gray-800">
            Market Cap: {formatCompactCurrency(cryptoData.market_cap)}
          </div>
          <div className="rounded-full bg-gray-100 px-2 py-1 dark:bg-gray-800">
            Vol: {formatCompactCurrency(cryptoData.total_volume)}
          </div>
          {cryptoData.circulating_supply && (
            <div className="rounded-full bg-gray-100 px-2 py-1 dark:bg-gray-800">
              Supply: {cryptoData.circulating_supply.toLocaleString()} {cryptoData.symbol.toUpperCase()}
            </div>
          )}
        </div>
        
        <div className="h-[150px] w-full">
          {isChartLoading ? (
            <div className="flex h-full items-center justify-center">
              <Skeleton className="h-full w-full" />
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis 
                  dataKey="date" 
                  tickFormatter={formatDate} 
                  tick={{ fontSize: 10 }} 
                  stroke="rgba(255,255,255,0.5)"
                />
                <YAxis 
                  domain={['auto', 'auto']} 
                  tickFormatter={(value) => formatCompactCurrency(value)} 
                  tick={{ fontSize: 10 }}
                  stroke="rgba(255,255,255,0.5)"
                  width={60}
                />
                <Tooltip 
                  formatter={(value) => [formatCurrency(value as number), 'Price']}
                  labelFormatter={(value) => formatDate(value as number)}
                  contentStyle={{ 
                    backgroundColor: '#1e1e1e', 
                    borderColor: '#333',
                    borderRadius: '4px'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="price" 
                  stroke={isPriceUp ? "#10b981" : "#ef4444"} 
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-center gap-2 border-t p-2">
        <Button 
          variant={timeframe === 1 ? "secondary" : "ghost"} 
          size="sm" 
          onClick={() => handleTimeframeChange(1)}
        >
          1D
        </Button>
        <Button 
          variant={timeframe === 7 ? "secondary" : "ghost"} 
          size="sm" 
          onClick={() => handleTimeframeChange(7)}
        >
          7D
        </Button>
        <Button 
          variant={timeframe === 30 ? "secondary" : "ghost"} 
          size="sm" 
          onClick={() => handleTimeframeChange(30)}
        >
          30D
        </Button>
        <Button 
          variant={timeframe === 90 ? "secondary" : "ghost"} 
          size="sm" 
          onClick={() => handleTimeframeChange(90)}
        >
          90D
        </Button>
      </CardFooter>
    </Card>
  );
}