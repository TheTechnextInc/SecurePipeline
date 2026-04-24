import React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { StoreProvider } from "@/lib/store"
import "./globals.css"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "DevSecOps Pipeline | Security Insights",
  description: "Visualize CI/CD pipeline stages, security checks, and quality gates with real-time Sonar integration",
    generator: 'v0.app'
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="bg-background">
      <body className="font-sans antialiased bg-background text-foreground">
        <StoreProvider>
          {children}
        </StoreProvider>
        <Analytics />
      </body>
    </html>
  )
}
