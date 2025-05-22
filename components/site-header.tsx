"use client"

import Link from "next/link"
import { Bell, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ThemeToggle } from "@/components/theme-toggle"
import { MainNav } from "@/components/main-nav"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAuth } from "@/lib/auth"

export function SiteHeader() {
  const { user, isAuthenticated } = useAuth()

  return (
    <header className="sticky top-0 z-10 border-b bg-background px-4 py-3 md:px-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2">
            <div className="relative size-8 overflow-hidden rounded-full bg-gradient-to-br from-purple-500 to-blue-500">
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-lg font-bold text-white">S</span>
              </div>
            </div>
            <span className="text-xl font-bold">Stellica</span>
          </Link>
          <MainNav />
        </div>
        <div className="flex items-center gap-4">
          <div className="relative hidden md:block">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input type="search" placeholder="Search..." className="w-64 rounded-full pl-8 text-sm" />
          </div>
          <Button variant="ghost" size="icon" className="text-muted-foreground">
            <Bell className="h-5 w-5" />
            <span className="sr-only">Notifications</span>
          </Button>
          <ThemeToggle />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8 border">
                  <AvatarImage src="/placeholder.svg?height=32&width=32" alt="User" />
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 bg-[#121212] text-white">
              {isAuthenticated ? (
                <>
                  <DropdownMenuLabel className="font-normal">My Account</DropdownMenuLabel>
                  <DropdownMenuItem asChild className="focus:bg-gray-800">
                    <Link href="/account">Account Details</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="focus:bg-gray-800">
                    <Link href="/wallet">Wallet</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="focus:bg-gray-800">
                    <Link href="/settings">Settings</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-gray-700" />
                  <div className="p-2">
                    <div className="text-lg font-bold text-white">${user?.balance || "29,444.48"}</div>
                  </div>
                </>
              ) : (
                <>
                  <DropdownMenuItem asChild className="focus:bg-gray-800">
                    <Link href="/login">Sign in</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="focus:bg-gray-800">
                    <Link href="/register">Create account</Link>
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
