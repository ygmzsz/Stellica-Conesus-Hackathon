"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { useAuth } from "@/lib/auth"

export function MainNav() {
  const pathname = usePathname()
  const { isAuthenticated } = useAuth()

  // Public navigation items
  const publicNavItems = [
    { href: "/markets", label: "Markets" },
    { href: "/about", label: "About" },
    { href: "/features", label: "Features" },
  ]

  // Authenticated navigation items
  const authNavItems = [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/exchange", label: "Exchange" },
    { href: "/wallet", label: "Wallet" },
    { href: "/markets", label: "Markets" },
    { href: "/thresholds", label: "Thresholds" },
  ]

  const navItems = isAuthenticated ? authNavItems : publicNavItems

  return (
    <nav className="hidden md:flex md:items-center md:space-x-6">
      {navItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            "text-sm font-medium transition-colors hover:text-primary",
            pathname === item.href ? "text-primary" : "text-muted-foreground",
          )}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  )
}
