"use client"

import type React from "react"

import { AuthProvider as AuthContextProvider } from "@/lib/auth"

export function AuthProvider({ children }: { children: React.ReactNode }) {
  return <AuthContextProvider>{children}</AuthContextProvider>
}
