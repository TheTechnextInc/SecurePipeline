"use client"

import { Search, RefreshCw, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useStore } from "@/lib/store"
import { useRouter } from "next/navigation"

export function DashboardHeader() {
  const { refreshing, triggerRefresh, searchQuery, setSearchQuery } = useStore()
  const router = useRouter()

  return (
    <header className="flex h-16 items-center justify-between border-b border-border bg-card px-6">
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-semibold text-card-foreground">DevSecOps Pipeline</h1>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="h-4 w-4" />
          <span>{refreshing ? "Refreshing..." : "Last updated: 2 min ago"}</span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search pipelines..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="h-9 w-64 rounded-lg border border-input bg-input pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
        <Button variant="outline" size="sm" className="gap-2 bg-transparent" onClick={triggerRefresh} disabled={refreshing}>
          <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
          Refresh
        </Button>
        <Button size="sm" className="gap-2" onClick={() => router.push("/pipelines")}>
          New Pipeline
        </Button>
      </div>
    </header>
  )
}
