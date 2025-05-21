"use client"

import { useEffect, useRef, useState } from "react"
import { useTheme } from "next-themes"
import { fetchCryptoHistoricalData } from "@/lib/crypto-api"

interface LiveChartProps {
  cryptoId: string
  days?: number
  height?: number
}

export function LiveChart({ cryptoId = "bitcoin", days = 7, height = 400 }: LiveChartProps) {
  const chartRef = useRef<HTMLCanvasElement>(null)
  const { theme } = useTheme()
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!chartRef.current) return

    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        // Use the improved function with no mock fallback
        const data = await fetchCryptoHistoricalData(cryptoId, days);
        drawChart(data.prices);
      } catch (err) {
        console.error("Error fetching historical data:", err);
        setError("Unable to load chart data. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();

    // Set up interval for refreshing data
    const intervalId = setInterval(fetchData, 5 * 60 * 1000);
    return () => clearInterval(intervalId);
  }, [cryptoId, days, theme])

  const drawChart = (priceData: [number, number][]) => {
    const canvas = chartRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    const dpr = window.devicePixelRatio || 1
    const rect = canvas.getBoundingClientRect()
    canvas.width = rect.width * dpr
    canvas.height = rect.height * dpr
    ctx.scale(dpr, dpr)
    canvas.style.width = `${rect.width}px`
    canvas.style.height = `${rect.height}px`

    // Clear canvas
    ctx.clearRect(0, 0, rect.width, rect.height)

    // Find min and max for scaling
    const prices = priceData.map((item) => item[1])
    const min = Math.min(...prices) * 0.999
    const max = Math.max(...prices) * 1.001
    const range = max - min

    // Determine colors based on theme
    const isDark = theme === "dark"
    const gridColor = isDark ? "#2e3440" : "#e2e8f0"
    const textColor = isDark ? "#94a3b8" : "#64748b"
    const lineColor = "#a855f7" // purple-500

    // Draw grid lines
    ctx.strokeStyle = gridColor
    ctx.lineWidth = 1

    // Horizontal grid lines
    for (let i = 0; i < 5; i++) {
      const y = (rect.height / 4) * i
      ctx.beginPath()
      ctx.moveTo(0, y)
      ctx.lineTo(rect.width, y)
      ctx.stroke()

      // Price labels
      const price = max - (range * i) / 4
      ctx.fillStyle = textColor
      ctx.font = "10px Inter, system-ui, sans-serif"
      ctx.textAlign = "left"
      ctx.fillText(`$${price.toLocaleString("en-US", { maximumFractionDigits: 0 })}`, 5, y - 5)
    }

    // Draw time labels
    const timestamps = priceData.map((item) => item[0])
    const timeLabels = [
      new Date(timestamps[0]).toLocaleDateString(),
      new Date(timestamps[Math.floor(timestamps.length / 2)]).toLocaleDateString(),
      new Date(timestamps[timestamps.length - 1]).toLocaleDateString(),
    ]

    timeLabels.forEach((label, index) => {
      const x = (rect.width / (timeLabels.length - 1)) * index
      ctx.fillStyle = textColor
      ctx.font = "10px Inter, system-ui, sans-serif"
      ctx.textAlign = "center"
      ctx.fillText(label, x, rect.height - 5)
    })

    // Draw price line
    ctx.strokeStyle = lineColor
    ctx.lineWidth = 2
    ctx.beginPath()

    // Calculate x and y coordinates for each data point
    priceData.forEach((item, index) => {
      const x = (rect.width / (priceData.length - 1)) * index
      const y = rect.height - ((item[1] - min) / range) * rect.height

      if (index === 0) {
        ctx.moveTo(x, y)
      } else {
        ctx.lineTo(x, y)
      }
    })

    ctx.stroke()

    // Add gradient fill under the line
    const gradient = ctx.createLinearGradient(0, 0, 0, rect.height)
    gradient.addColorStop(0, "rgba(168, 85, 247, 0.2)") // purple-500 with opacity
    gradient.addColorStop(1, "rgba(168, 85, 247, 0)")

    ctx.fillStyle = gradient
    ctx.beginPath()

    // Start from the bottom left
    ctx.moveTo(0, rect.height)

    // Draw the same line as before
    priceData.forEach((item, index) => {
      const x = (rect.width / (priceData.length - 1)) * index
      const y = rect.height - ((item[1] - min) / range) * rect.height

      if (index === 0) {
        ctx.lineTo(x, y)
      } else {
        ctx.lineTo(x, y)
      }
    })

    // Complete the path to the bottom right
    ctx.lineTo(rect.width, rect.height)
    ctx.closePath()
    ctx.fill()
  }

  return (
    <div className="relative h-full w-full">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/50">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        </div>
      )}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-red-500">{error}</div>
        </div>
      )}
      <canvas ref={chartRef} className="h-full w-full" style={{ height: `${height}px` }} />
    </div>
  )
}