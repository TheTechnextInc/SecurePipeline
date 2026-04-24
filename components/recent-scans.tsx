"use client"

import { CheckCircle2, XCircle, Clock, GitBranch, GitCommit } from "lucide-react"
import { cn } from "@/lib/utils"

interface Scan {
  id: string
  branch: string
  commit: string
  status: "passed" | "failed" | "running"
  triggeredBy: string
  time: string
  duration: string
}

const recentScans: Scan[] = [
  {
    id: "1",
    branch: "main",
    commit: "a3f7c21",
    status: "failed",
    triggeredBy: "John Doe",
    time: "5 min ago",
    duration: "3m 15s",
  },
  {
    id: "2",
    branch: "feature/auth",
    commit: "b2e9f43",
    status: "passed",
    triggeredBy: "Jane Smith",
    time: "25 min ago",
    duration: "4m 32s",
  },
  {
    id: "3",
    branch: "main",
    commit: "c1d8e56",
    status: "passed",
    triggeredBy: "John Doe",
    time: "1 hour ago",
    duration: "3m 48s",
  },
  {
    id: "4",
    branch: "fix/security",
    commit: "d4c7b89",
    status: "running",
    triggeredBy: "Alice Chen",
    time: "2 min ago",
    duration: "1m 20s",
  },
  {
    id: "5",
    branch: "develop",
    commit: "e5f6a12",
    status: "failed",
    triggeredBy: "Bob Wilson",
    time: "2 hours ago",
    duration: "2m 55s",
  },
]

const statusStyles = {
  passed: "text-success",
  failed: "text-destructive",
  running: "text-primary",
}

const StatusIcon = ({ status }: { status: Scan["status"] }) => {
  switch (status) {
    case "passed":
      return <CheckCircle2 className="h-5 w-5 text-success" />
    case "failed":
      return <XCircle className="h-5 w-5 text-destructive" />
    default:
      return <Clock className="h-5 w-5 animate-pulse text-primary" />
  }
}

export function RecentScans() {
  return (
    <div className="rounded-lg border border-border bg-card p-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-card-foreground">Recent Pipeline Runs</h2>
        <button className="text-sm text-primary hover:underline">View All</button>
      </div>

      <div className="space-y-3">
        {recentScans.map((scan) => (
          <div
            key={scan.id}
            className="flex items-center justify-between rounded-lg border border-border bg-secondary/30 p-4 transition-colors hover:bg-secondary/50"
          >
            <div className="flex items-center gap-4">
              <StatusIcon status={scan.status} />
              <div>
                <div className="flex items-center gap-2">
                  <span className="flex items-center gap-1 text-sm font-medium text-card-foreground">
                    <GitBranch className="h-4 w-4" />
                    {scan.branch}
                  </span>
                  <span className="flex items-center gap-1 font-mono text-xs text-muted-foreground">
                    <GitCommit className="h-3 w-3" />
                    {scan.commit}
                  </span>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">
                  by {scan.triggeredBy} · {scan.time}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className={cn("text-sm font-medium capitalize", statusStyles[scan.status])}>
                {scan.status}
              </p>
              <p className="text-xs text-muted-foreground">{scan.duration}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
