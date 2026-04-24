"use client"

import React, { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard, GitBranch, Shield, Settings, BarChart3,
  FileCheck, Bell, Info, ChevronDown, LogOut, User,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useStore } from "@/lib/store"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

const navItems = [
  { label: "Overview", icon: <LayoutDashboard className="h-5 w-5" />, href: "/" },
  { label: "Pipelines", icon: <GitBranch className="h-5 w-5" />, href: "/pipelines" },
  { label: "Security Scans", icon: <Shield className="h-5 w-5" />, href: "/security" },
  { label: "Quality Gates", icon: <FileCheck className="h-5 w-5" />, href: "/quality-gates" },
  { label: "Reports", icon: <BarChart3 className="h-5 w-5" />, href: "/reports" },
  { label: "About", icon: <Info className="h-5 w-5" />, href: "/about" },
]

const bottomNavItems = [
  { label: "Notifications", icon: <Bell className="h-5 w-5" />, href: "/notifications" },
  { label: "Settings", icon: <Settings className="h-5 w-5" />, href: "/settings" },
]

export function DashboardSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const { repositories, selectedRepo, setSelectedRepo, unreadCount, vulnerabilities } = useStore()
  const [userEmail, setUserEmail] = useState<string | null>(null)

  const handleSignOut = async () => {
    await fetch("/api/auth/logout", { method: "POST" })
    router.push("/auth/login")
    router.refresh()
  }

  useEffect(() => {
    // Read user from local cookie (parsed on client)
    const getCookie = (name: string) => {
      const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"))
      return match ? decodeURIComponent(match[2]) : null
    }
    try {
      const session = getCookie("securepipe_session")
      if (session) {
        const user = JSON.parse(session)
        setUserEmail(user?.email || null)
      }
    } catch {
      setUserEmail(null)
    }
  }, [])

  const openVulnCount = vulnerabilities.filter(v => v.status === "open").length

  return (
    <aside className="flex h-screen w-64 flex-col border-r border-sidebar-border bg-sidebar">
      {/* Logo */}
      <div className="flex h-16 items-center gap-3 border-b border-sidebar-border px-6">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
          <Shield className="h-5 w-5 text-primary-foreground" />
        </div>
        <span className="text-lg font-semibold text-sidebar-foreground">SecurePipe</span>
      </div>

      {/* Repo Selector */}
      <div className="border-b border-sidebar-border p-4">
        <div className="relative">
          <select
            value={selectedRepo}
            onChange={e => setSelectedRepo(e.target.value)}
            className="flex w-full cursor-pointer appearance-none items-center rounded-lg bg-sidebar-accent px-3 py-2 pr-8 text-sm text-sidebar-foreground hover:bg-sidebar-accent/80 focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="all">All Repositories</option>
            {repositories.map(r => (
              <option key={r.id} value={r.fullName}>{r.fullName}</option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-sidebar-foreground" />
        </div>
      </div>

      {/* Main Nav */}
      <nav className="flex-1 space-y-1 p-4">
        {navItems.map(item => {
          const isActive = pathname === item.href
          const badge = item.href === "/security" ? openVulnCount : undefined
          return (
            <Link key={item.label} href={item.href}
              className={cn("flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors",
                isActive ? "bg-sidebar-primary text-sidebar-primary-foreground" : "text-sidebar-foreground hover:bg-sidebar-accent"
              )}
            >
              <div className="flex items-center gap-3">{item.icon}<span>{item.label}</span></div>
              {badge !== undefined && badge > 0 && (
                <span className="rounded-full bg-destructive px-2 py-0.5 text-xs font-medium text-destructive-foreground">{badge}</span>
              )}
            </Link>
          )
        })}
      </nav>

      {/* Bottom Nav */}
      <div className="border-t border-sidebar-border p-4">
        {bottomNavItems.map(item => {
          const isActive = pathname === item.href
          const badge = item.href === "/notifications" ? unreadCount : undefined
          return (
            <Link key={item.label} href={item.href}
              className={cn("flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors",
                isActive ? "bg-sidebar-primary text-sidebar-primary-foreground" : "text-sidebar-foreground hover:bg-sidebar-accent"
              )}
            >
              <div className="flex items-center gap-3">{item.icon}<span>{item.label}</span></div>
              {badge !== undefined && badge > 0 && (
                <span className="rounded-full bg-primary px-2 py-0.5 text-xs font-medium text-primary-foreground">{badge}</span>
              )}
            </Link>
          )
        })}
      </div>

      {/* User / Sign Out */}
      {userEmail && (
        <div className="border-t border-sidebar-border p-4">
          <div className="flex items-center gap-3 rounded-lg bg-sidebar-accent px-3 py-2">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary">
              <User className="h-4 w-4 text-primary-foreground" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs text-sidebar-foreground" title={userEmail}>{userEmail}</p>
            </div>
            <Button type="button" onClick={handleSignOut} variant="ghost" size="icon" className="h-7 w-7 shrink-0 text-muted-foreground hover:text-destructive" title="Sign out">
              <LogOut className="h-4 w-4" />
              <span className="sr-only">Sign out</span>
            </Button>
          </div>
        </div>
      )}
    </aside>
  )
}
