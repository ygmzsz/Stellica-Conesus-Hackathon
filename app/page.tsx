import { redirect } from "next/navigation"
import { cookies } from "next/headers"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { MarketTable } from "@/components/market-table"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export default async function Home() {
  // Check if user is authenticated
  const cookieStore = await cookies()
  const token = cookieStore.get('sb-zvecpbopzlvvrweipheh-auth-token');

  const supabase = createServerComponentClient({ cookies });

  const {
    data: { session },
  } = await supabase.auth.getSession()

  // If authenticated, redirect to dashboard
  if (session) {
    redirect("/dashboard")
  }

  return (
    <main className="flex-1">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-black to-gray-900 py-20 text-white">
        <div className="container mx-auto px-4 text-center">
          <h1 className="mb-6 text-4xl font-bold md:text-6xl">Welcome to Stellica</h1>
          <p className="mx-auto mb-8 max-w-2xl text-lg text-gray-300">
            The next generation cryptocurrency exchange platform. Trade with confidence on the Stellar blockchain.
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button asChild size="lg" className="bg-purple-600 hover:bg-purple-700">
              <Link href="/register">Create Account</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-purple-600 text-purple-600 hover:bg-purple-600/10"
            >
              <Link href="/login">Sign In</Link>
            </Button>
          </div>
        </div>

        {/* Background elements */}
        <div className="absolute left-1/4 top-1/4 h-64 w-64 rounded-full bg-purple-600/20 blur-3xl"></div>
        <div className="absolute right-1/4 top-3/4 h-64 w-64 rounded-full bg-blue-600/20 blur-3xl"></div>
      </section>

      {/* Market Overview Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="mb-8 text-center text-3xl font-bold">Market Overview</h2>
          <Card>
            <CardHeader>
              <CardTitle>Cryptocurrency Markets</CardTitle>
              <CardDescription>Live prices of popular cryptocurrencies</CardDescription>
            </CardHeader>
            <CardContent>
              <MarketTable />
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-gray-100 py-16 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <h2 className="mb-12 text-center text-3xl font-bold">Why Choose Stellica</h2>
          <div className="grid gap-8 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Stellar Blockchain</CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  Built on the fast and secure Stellar blockchain, offering low transaction fees and quick settlement
                  times.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Advanced Security</CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  Protect your assets with biometric authentication, two-factor authentication, and advanced encryption.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Discord Integration</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Receive real-time alerts and manage your portfolio directly through our Discord bot integration.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-purple-600 py-16 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="mb-6 text-3xl font-bold">Ready to Start Trading?</h2>
          <p className="mx-auto mb-8 max-w-2xl">
            Join thousands of traders on Stellica and experience the future of cryptocurrency trading.
          </p>
          <Button asChild size="lg" className="bg-white text-purple-600 hover:bg-gray-100">
            <Link href="/register">Get Started Now</Link>
          </Button>
        </div>
      </section>
    </main>
  )
}
