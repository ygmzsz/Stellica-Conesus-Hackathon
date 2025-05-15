import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { SiteHeader } from "@/components/site-header"
import { AuthProvider } from "@/components/auth-provider"
import { CryptoDataProvider } from "@/components/crypto-data-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Stellica - Next-Gen Crypto Exchange",
  description: "Trade cryptocurrencies on the Stellar blockchain with Stellica",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          <AuthProvider>
            <CryptoDataProvider>
              <div className="relative flex min-h-screen flex-col bg-[#121212] text-white">
                <SiteHeader />
                <div className="flex-1">{children}</div>
              </div>
            </CryptoDataProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
