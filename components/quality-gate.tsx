"use client"

import { CheckCircle2, XCircle, Minus } from "lucide-react"
import { cn } from "@/lib/utils"

interface QualityCondition {
  metric: string
  operator: string
  threshold: string
  actual: string
  status: "passed" | "failed" | "not_evaluated"
}

const qualityConditions: QualityCondition[] = [
  {
    metric: "Coverage",
    operator: ">=",
    threshold: "80%",
    actual: "72.4%",
    status: "failed",
  },
  {
    metric: "Duplicated Lines",
    operator: "<",
    threshold: "3%",
    actual: "1.8%",
    status: "passed",
  },
  {
    metric: "Maintainability Rating",
    operator: ">=",
    threshold: "A",
    actual: "B",
    status: "failed",
  },
  {
    metric: "Reliability Rating",
    operator: ">=",
    threshold: "A",
    actual: "A",
    status: "passed",
  },
  {
    metric: "Security Rating",
    operator: ">=",
    threshold: "A",
    actual: "C",
    status: "failed",
  },
  {
    metric: "New Security Hotspots",
    operator: "<=",
    threshold: "0",
    actual: "3",
    status: "failed",
  },
]

const StatusIcon = ({ status }: { status: QualityCondition["status"] }) => {
  switch (status) {
    case "passed":
      return <CheckCircle2 className="h-5 w-5 text-success" />
    case "failed":
      return <XCircle className="h-5 w-5 text-destructive" />
    default:
      return <Minus className="h-5 w-5 text-muted-foreground" />
  }
}

export function QualityGate() {
  const passedCount = qualityConditions.filter((c) => c.status === "passed").length
  const failedCount = qualityConditions.filter((c) => c.status === "failed").length
  const overallStatus = failedCount > 0 ? "failed" : "passed"

  return (
    <div className="rounded-lg border border-border bg-card p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-card-foreground">Quality Gate Status</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {passedCount} passed · {failedCount} failed
          </p>
        </div>
        <div
          className={cn(
            "flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium",
            overallStatus === "passed"
              ? "bg-success/20 text-success"
              : "bg-destructive/20 text-destructive"
          )}
        >
          {overallStatus === "passed" ? (
            <CheckCircle2 className="h-4 w-4" />
          ) : (
            <XCircle className="h-4 w-4" />
          )}
          {overallStatus === "passed" ? "Passed" : "Failed"}
        </div>
      </div>

      <div className="space-y-3">
        {qualityConditions.map((condition, index) => (
          <div
            key={index}
            className={cn(
              "flex items-center justify-between rounded-lg border p-4 transition-colors",
              condition.status === "failed"
                ? "border-destructive/30 bg-destructive/5"
                : "border-border bg-secondary/30"
            )}
          >
            <div className="flex items-center gap-3">
              <StatusIcon status={condition.status} />
              <div>
                <p className="font-medium text-card-foreground">{condition.metric}</p>
                <p className="text-sm text-muted-foreground">
                  {condition.operator} {condition.threshold}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p
                className={cn(
                  "text-lg font-semibold",
                  condition.status === "failed" ? "text-destructive" : "text-success"
                )}
              >
                {condition.actual}
              </p>
              <p className="text-xs text-muted-foreground">Actual</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
