"use client"

import React from "react"
import { useStore } from "@/lib/store"
import { Bug, ShieldAlert, Code2, AlertTriangle, TrendingUp, TrendingDown } from "lucide-react"
import { cn } from "@/lib/utils"

interface Metric {
  label: string
  value: number
  change: number
  status: "good" | "warning" | "critical"
  icon: React.ReactNode
}

const statusStyles = {
  good: "text-success bg-success/10 border-success/30",
  warning: "text-warning bg-warning/10 border-warning/30",
  critical: "text-destructive bg-destructive/10 border-destructive/30",
}

export function SonarMetrics() {
  const { vulnerabilities, selectedRepo, refreshing } = useStore()
  
  // Filter by selected repo
  const filtered = selectedRepo === "all" ? vulnerabilities : vulnerabilities.filter(v => v.repo === selectedRepo)
  const openVulns = filtered.filter(v => v.status === "open")
  
  // Calculate dynamic metrics
  const bugs = filtered.filter(v => v.type === "Injection" || v.type === "XSS").length
  const vulnCount = openVulns.filter(v => v.severity === "critical" || v.severity === "high").length
  const codeSmells = filtered.filter(v => v.type === "Security Misconfiguration" || v.type === "Information Disclosure").length
  const hotspots = filtered.filter(v => v.type === "Cryptography" || v.type === "Secrets").length
  
  const metrics: Metric[] = [
    {
      label: "Bugs",
      value: bugs,
      change: bugs > 0 ? bugs : 0,
      status: bugs === 0 ? "good" : bugs < 3 ? "warning" : "critical",
      icon: <Bug className="h-5 w-5" />,
    },
    {
      label: "Vulnerabilities",
      value: vulnCount,
      change: vulnCount > 0 ? vulnCount : 0,
      status: vulnCount === 0 ? "good" : vulnCount < 3 ? "warning" : "critical",
      icon: <ShieldAlert className="h-5 w-5" />,
    },
    {
      label: "Code Smells",
      value: codeSmells,
      change: codeSmells > 2 ? -2 : 0,
      status: codeSmells === 0 ? "good" : codeSmells < 5 ? "warning" : "critical",
      icon: <Code2 className="h-5 w-5" />,
    },
    {
      label: "Security Hotspots",
      value: hotspots,
      change: hotspots > 0 ? hotspots : 0,
      status: hotspots === 0 ? "good" : hotspots < 3 ? "warning" : "critical",
      icon: <AlertTriangle className="h-5 w-5" />,
    },
  ]

  return (
    <div className="rounded-lg border border-border bg-card p-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-card-foreground">SonarQube Metrics</h2>
        <span className="text-sm text-muted-foreground">
          {refreshing ? "Refreshing..." : "Last scan: Just now"}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {metrics.map((metric) => (
          <div
            key={metric.label}
            className={cn(
              "rounded-lg border p-4 transition-all hover:scale-[1.02]",
              statusStyles[metric.status]
            )}
          >
            <div className="flex items-center justify-between">
              {metric.icon}
              {metric.change !== 0 && (
                <div className="flex items-center gap-1 text-xs">
                  {metric.change > 0 ? (
                    <>
                      <TrendingUp className="h-3 w-3" />
                      <span>+{metric.change}</span>
                    </>
                  ) : (
                    <>
                      <TrendingDown className="h-3 w-3 text-success" />
                      <span className="text-success">{metric.change}</span>
                    </>
                  )}
                </div>
              )}
              {metric.change === 0 && metric.value === 0 && (
                <span className="text-xs text-success">Clear</span>
              )}
            </div>
            <div className="mt-3">
              <p className="text-3xl font-bold">{metric.value}</p>
              <p className="text-sm opacity-80">{metric.label}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
