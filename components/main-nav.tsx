"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

export function MainNav() {
  const pathname = usePathname()

  const navItems = [
    { href: "/", label: "Dashboard" },
    { href: "/exchange", label: "Exchange" },
    { href: "/wallet", label: "Wallet" },
    { href: "/markets", label: "Markets" },
    { href: "/thresholds", label: "Thresholds" },
    { href: "/setup-wallet", label: "Setup Stellar" },
    { href: "/settings/discord", label: "Discord" },
  ]

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
