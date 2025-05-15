"use client"

import { useEffect, useRef } from "react"
import { useTheme } from "next-themes"

export function TradingView() {
  const chartRef = useRef<HTMLCanvasElement>(null)
  const { theme } = useTheme()

  useEffect(() => {
    if (!chartRef.current) return

    const ctx = chartRef.current.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    const canvas = chartRef.current
    const dpr = window.devicePixelRatio || 1
    const rect = canvas.getBoundingClientRect()
    canvas.width = rect.width * dpr
    canvas.height = rect.height * dpr
    ctx.scale(dpr, dpr)
    canvas.style.width = `${rect.width}px`
    canvas.style.height = `${rect.height}px`

    // Generate random price data (in a real app, this would come from an API)
    const generatePriceData = () => {
      const data = []
      let price = 65000
      for (let i = 0; i < 100; i++) {
        price += (Math.random() - 0.48) * 200
        data.push(price)
      }
      return data
    }

    const priceData = generatePriceData()

    // Draw chart
    const drawChart = () => {
      if (!ctx) return

      // Clear canvas
      ctx.clearRect(0, 0, rect.width, rect.height)

      // Find min and max for scaling
      const min = Math.min(...priceData) * 0.999
      const max = Math.max(...priceData) * 1.001
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

      // Draw price line
      ctx.strokeStyle = lineColor
      ctx.lineWidth = 2
      ctx.beginPath()

      // Calculate x and y coordinates for each data point
      priceData.forEach((price, index) => {
        const x = (rect.width / (priceData.length - 1)) * index
        const y = rect.height - ((price - min) / range) * rect.height

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
      priceData.forEach((price, index) => {
        const x = (rect.width / (priceData.length - 1)) * index
        const y = rect.height - ((price - min) / range) * rect.height

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

    drawChart()

    // Handle window resize
    const handleResize = () => {
      const rect = canvas.getBoundingClientRect()
      canvas.width = rect.width * dpr
      canvas.height = rect.height * dpr
      ctx.scale(dpr, dpr)
      canvas.style.width = `${rect.width}px`
      canvas.style.height = `${rect.height}px`
      drawChart()
    }

    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [theme])

  return (
    <div className="h-full w-full">
      <canvas ref={chartRef} className="h-full w-full" />
    </div>
  )
}
