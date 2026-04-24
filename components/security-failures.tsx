"use client"

import { ShieldX, ExternalLink, AlertCircle, FileCode } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface SecurityFailure {
  id: string
  severity: "critical" | "high" | "medium" | "low"
  type: string
  message: string
  file: string
  line: number
  rule: string
  effort: string
}

const securityFailures: SecurityFailure[] = [
  {
    id: "1",
    severity: "critical",
    type: "Vulnerability",
    message: "SQL Injection vulnerability detected in database query",
    file: "src/api/users.ts",
    line: 45,
    rule: "S3649",
    effort: "30min",
  },
  {
    id: "2",
    severity: "critical",
    type: "Vulnerability",
    message: "Hard-coded credentials detected",
    file: "src/config/database.ts",
    line: 12,
    rule: "S2068",
    effort: "15min",
  },
  {
    id: "3",
    severity: "high",
    type: "Security Hotspot",
    message: "Make sure that using this hardcoded IP address is safe here",
    file: "src/services/external-api.ts",
    line: 23,
    rule: "S1313",
    effort: "10min",
  },
  {
    id: "4",
    severity: "high",
    type: "Vulnerability",
    message: "Using command line arguments without validation",
    file: "src/utils/exec.ts",
    line: 8,
    rule: "S4823",
    effort: "20min",
  },
  {
    id: "5",
    severity: "medium",
    type: "Security Hotspot",
    message: "Make sure this cross-domain message passing is safe",
    file: "src/components/iframe-handler.ts",
    line: 67,
    rule: "S5131",
    effort: "15min",
  },
]

const severityStyles = {
  critical: "bg-destructive/20 text-destructive border-destructive/30",
  high: "bg-warning/20 text-warning border-warning/30",
  medium: "bg-chart-5/20 text-chart-5 border-chart-5/30",
  low: "bg-muted text-muted-foreground border-border",
}

const severityBadgeStyles = {
  critical: "bg-destructive text-destructive-foreground",
  high: "bg-warning text-warning-foreground",
  medium: "bg-chart-5 text-card-foreground",
  low: "bg-muted text-muted-foreground",
}

export function SecurityFailures() {
  const criticalCount = securityFailures.filter((f) => f.severity === "critical").length
  const highCount = securityFailures.filter((f) => f.severity === "high").length

  return (
    <div className="rounded-lg border border-border bg-card p-6">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-destructive/20 p-2">
            <ShieldX className="h-6 w-6 text-destructive" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-card-foreground">Security Gate Failures</h2>
            <p className="text-sm text-muted-foreground">
              {criticalCount} critical · {highCount} high severity issues
            </p>
          </div>
        </div>
        <Button variant="outline" size="sm" className="gap-2 bg-transparent">
          <ExternalLink className="h-4 w-4" />
          View in SonarQube
        </Button>
      </div>

      <div className="space-y-3">
        {securityFailures.map((failure) => (
          <div
            key={failure.id}
            className={cn(
              "rounded-lg border p-4 transition-all hover:scale-[1.01]",
              severityStyles[failure.severity]
            )}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span
                    className={cn(
                      "rounded px-2 py-0.5 text-xs font-medium uppercase",
                      severityBadgeStyles[failure.severity]
                    )}
                  >
                    {failure.severity}
                  </span>
                  <span className="text-xs text-muted-foreground">{failure.type}</span>
                  <span className="rounded bg-secondary px-2 py-0.5 font-mono text-xs text-muted-foreground">
                    {failure.rule}
                  </span>
                </div>
                <p className="mt-2 font-medium text-card-foreground">{failure.message}</p>
                <div className="mt-2 flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <FileCode className="h-4 w-4" />
                    {failure.file}:{failure.line}
                  </span>
                  <span className="flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" />
                    Est. fix: {failure.effort}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
