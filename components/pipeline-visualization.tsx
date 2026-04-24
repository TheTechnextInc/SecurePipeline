"use client"

import { useStore } from "@/lib/store"
import { CheckCircle2, XCircle, Clock, Play, GitBranch, GitCommit, AlertTriangle } from "lucide-react"
import { cn } from "@/lib/utils"

type StageStatus = "success" | "failed" | "running" | "pending" | "skipped" | "warning"

const StatusIcon = ({ status }: { status: StageStatus }) => {
  switch (status) {
    case "success":
      return <CheckCircle2 className="h-5 w-5 text-success" />
    case "failed":
      return <XCircle className="h-5 w-5 text-destructive" />
    case "running":
      return <Play className="h-5 w-5 text-primary animate-pulse" />
    case "warning":
      return <AlertTriangle className="h-5 w-5 text-warning" />
    case "skipped":
      return <Clock className="h-5 w-5 text-muted-foreground opacity-50" />
    default:
      return <Clock className="h-5 w-5 text-muted-foreground" />
  }
}

const statusColors: Record<StageStatus, string> = {
  success: "border-success bg-success/10",
  failed: "border-destructive bg-destructive/10",
  running: "border-primary bg-primary/10",
  warning: "border-warning bg-warning/10",
  pending: "border-muted bg-muted/50",
  skipped: "border-muted bg-muted/30 opacity-60",
}

export function PipelineVisualization() {
  const { pipelines, selectedRepo } = useStore()
  
  // Get the most recent pipeline for selected repo
  const filteredPipelines = selectedRepo === "all" ? pipelines : pipelines.filter(p => p.repo === selectedRepo)
  const latestPipeline = filteredPipelines[0]
  
  if (!latestPipeline) {
    return (
      <div className="rounded-lg border border-border bg-card p-6">
        <div className="text-center py-8 text-muted-foreground">
          <p>No pipeline runs yet.</p>
          <p className="text-sm mt-1">Create a pipeline and run it to see execution stages here.</p>
        </div>
      </div>
    )
  }

  const pipelineStatusColor = latestPipeline.status === "success" 
    ? "bg-success/20 text-success" 
    : latestPipeline.status === "failed" 
    ? "bg-destructive/20 text-destructive"
    : latestPipeline.status === "running"
    ? "bg-primary/20 text-primary"
    : "bg-muted text-muted-foreground"

  return (
    <div className="rounded-lg border border-border bg-card p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-card-foreground">Pipeline Execution</h2>
          <div className="mt-1 flex items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <GitBranch className="h-4 w-4" />
              {latestPipeline.branch}
            </span>
            <span className="flex items-center gap-1">
              <GitCommit className="h-4 w-4" />
              {latestPipeline.commit.slice(0, 20)}...
            </span>
            <span>{latestPipeline.startedAt}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={cn("rounded-full px-3 py-1 text-xs font-medium capitalize", pipelineStatusColor)}>
            {latestPipeline.status}
          </span>
          {latestPipeline.duration !== "-" && (
            <span className="text-sm text-muted-foreground">{latestPipeline.duration}</span>
          )}
        </div>
      </div>

      <div className="relative">
        {/* Pipeline connector line */}
        <div className="absolute left-0 right-0 top-8 h-0.5 bg-border" />
        
        <div className="relative flex justify-between gap-2">
          {latestPipeline.stages.map((stage, index) => (
            <div key={stage.name} className="flex flex-col items-center">
              {/* Stage node */}
              <div
                className={cn(
                  "relative z-10 flex h-16 w-16 flex-col items-center justify-center rounded-lg border-2 transition-all hover:scale-105",
                  statusColors[stage.status as StageStatus]
                )}
              >
                <StatusIcon status={stage.status as StageStatus} />
              </div>
              
              {/* Stage label */}
              <span className="mt-3 text-center text-sm font-medium text-card-foreground">
                {stage.name}
              </span>

              {/* Connector arrow */}
              {index < latestPipeline.stages.length - 1 && (
                <div className="absolute right-0 top-8 h-0 w-4 -translate-y-1/2 translate-x-full">
                  <div className="h-0.5 w-full bg-border" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
