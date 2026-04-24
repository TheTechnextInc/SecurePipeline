"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { useStore } from "@/lib/store"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import {
  GitBranch, Play, RefreshCw, CheckCircle2, XCircle, Clock,
  GitCommit, User, Calendar, ChevronRight, Plus, Trash2, Search,
} from "lucide-react"

const statusConfig = {
  success: { icon: CheckCircle2, color: "text-success", bg: "bg-success/10" },
  failed: { icon: XCircle, color: "text-destructive", bg: "bg-destructive/10" },
  running: { icon: RefreshCw, color: "text-primary", bg: "bg-primary/10" },
  pending: { icon: Clock, color: "text-muted-foreground", bg: "bg-muted" },
  skipped: { icon: Clock, color: "text-muted-foreground", bg: "bg-muted" },
}

function StageIndicator({ status }: { status: string }) {
  const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending
  return (
    <div className={`flex h-6 w-6 items-center justify-center rounded-full ${config.bg}`}>
      <config.icon className={`h-3.5 w-3.5 ${config.color} ${status === "running" ? "animate-spin" : ""}`} />
    </div>
  )
}

export default function PipelinesPage() {
  const { pipelines, repositories, addPipeline, removePipeline, runPipeline, selectedRepo, searchQuery } = useStore()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [localSearch, setLocalSearch] = useState("")
  const [newPipeline, setNewPipeline] = useState({ name: "", repo: "", branch: "main" })

  const query = localSearch || searchQuery
  const filtered = pipelines
    .filter(p => selectedRepo === "all" || p.repo === selectedRepo)
    .filter(p => !query || p.name.toLowerCase().includes(query.toLowerCase()) || p.repo.toLowerCase().includes(query.toLowerCase()) || p.commit.toLowerCase().includes(query.toLowerCase()))

  const handleCreate = () => {
    if (!newPipeline.name || !newPipeline.repo) return
    addPipeline(newPipeline.name, newPipeline.repo, newPipeline.branch)
    setIsDialogOpen(false)
    setNewPipeline({ name: "", repo: "", branch: "main" })
  }

  const successCount = filtered.filter(p => p.status === "success").length
  const failedCount = filtered.filter(p => p.status === "failed").length
  const runningCount = filtered.filter(p => p.status === "running").length
  const pendingCount = filtered.filter(p => p.status === "pending").length

  return (
    <DashboardLayout title="CI/CD Pipelines" description="Monitor and manage your continuous integration and deployment pipelines">
      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        {[
          { label: "Successful", count: successCount, icon: CheckCircle2, color: "text-success", bg: "bg-success/10" },
          { label: "Failed", count: failedCount, icon: XCircle, color: "text-destructive", bg: "bg-destructive/10" },
          { label: "Running", count: runningCount, icon: RefreshCw, color: "text-primary", bg: "bg-primary/10" },
          { label: "Pending", count: pendingCount, icon: Clock, color: "text-muted-foreground", bg: "bg-muted" },
        ].map(s => (
          <Card key={s.label} className="border-border bg-card">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${s.bg}`}>
                  <s.icon className={`h-5 w-5 ${s.color}`} />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{s.count}</p>
                  <p className="text-sm text-muted-foreground">{s.label}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Search + New Pipeline */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search pipelines by name, repo, or commit..."
            value={localSearch}
            onChange={e => setLocalSearch(e.target.value)}
            className="bg-input pl-10"
          />
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2"><Plus className="h-4 w-4" />New Pipeline</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Create New Pipeline</DialogTitle>
              <DialogDescription>Configure a CI/CD pipeline. Select a connected repository or type a new one.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Pipeline Name</Label>
                <Input placeholder="e.g., Production Deploy" value={newPipeline.name} onChange={e => setNewPipeline({ ...newPipeline, name: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Repository</Label>
                {repositories.length > 0 ? (
                  <Select value={newPipeline.repo} onValueChange={v => setNewPipeline({ ...newPipeline, repo: v })}>
                    <SelectTrigger><SelectValue placeholder="Select a connected repository" /></SelectTrigger>
                    <SelectContent>
                      {repositories.map(r => (
                        <SelectItem key={r.id} value={r.fullName}>{r.fullName}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <Input placeholder="owner/repo" value={newPipeline.repo} onChange={e => setNewPipeline({ ...newPipeline, repo: e.target.value })} />
                )}
                <p className="text-xs text-muted-foreground">Connect more repos in Settings.</p>
              </div>
              <div className="space-y-2">
                <Label>Branch</Label>
                <Select value={newPipeline.branch} onValueChange={v => setNewPipeline({ ...newPipeline, branch: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {(repositories.find(r => r.fullName === newPipeline.repo)?.branches || ["main", "develop", "staging"]).map(b => (
                      <SelectItem key={b} value={b}>{b}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="rounded-lg border border-border bg-muted/50 p-3">
                <p className="text-sm font-medium text-foreground">Pipeline Stages</p>
                <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                  {["Source", "Build", "SAST", "Test", "Deploy"].map((s, i, arr) => (
                    <span key={s} className="flex items-center gap-2">
                      <span className="rounded bg-primary/10 px-2 py-1">{s}</span>
                      {i < arr.length - 1 && <ChevronRight className="h-3 w-3" />}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleCreate} disabled={!newPipeline.name || !newPipeline.repo}>Create Pipeline</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Pipeline List */}
      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="text-foreground">Your Pipelines</CardTitle>
          <CardDescription>{filtered.length} pipeline{filtered.length !== 1 ? "s" : ""} {selectedRepo !== "all" ? `for ${selectedRepo}` : ""}</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-border">
            {filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-12 text-center">
                <GitBranch className="h-12 w-12 text-muted-foreground/50" />
                <p className="mt-4 font-medium text-foreground">No pipelines found</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {query ? "Try a different search term" : "Create your first pipeline to get started"}
                </p>
                {!query && (
                  <Button className="mt-4 gap-2" onClick={() => setIsDialogOpen(true)}>
                    <Plus className="h-4 w-4" />Create Pipeline
                  </Button>
                )}
              </div>
            ) : (
              filtered.map(pipeline => {
                const StatusIcon = statusConfig[pipeline.status].icon
                return (
                  <div key={pipeline.id} className="flex items-center gap-4 p-4 transition-colors hover:bg-muted/50">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${statusConfig[pipeline.status].bg}`}>
                      <StatusIcon className={`h-5 w-5 ${statusConfig[pipeline.status].color} ${pipeline.status === "running" ? "animate-spin" : ""}`} />
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-foreground">{pipeline.name}</span>
                        <Badge variant="outline" className="gap-1 text-xs"><GitBranch className="h-3 w-3" />{pipeline.branch}</Badge>
                        <Badge variant="secondary" className="text-xs">{pipeline.repo}</Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1"><GitCommit className="h-3.5 w-3.5" />{pipeline.commit}</span>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1"><User className="h-3 w-3" />{pipeline.author}</span>
                        <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{pipeline.startedAt}</span>
                        <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{pipeline.duration}</span>
                      </div>
                    </div>
                    <div className="hidden items-center gap-1 md:flex">
                      {pipeline.stages.map((stage, idx) => (
                        <div key={stage.name} className="flex items-center">
                          <div className="group relative">
                            <StageIndicator status={stage.status} />
                            <span className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-popover px-2 py-1 text-xs text-popover-foreground opacity-0 shadow-lg transition-opacity group-hover:opacity-100">{stage.name}</span>
                          </div>
                          {idx < pipeline.stages.length - 1 && <div className="mx-0.5 h-0.5 w-4 bg-border" />}
                        </div>
                      ))}
                    </div>
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="icon" onClick={() => runPipeline(pipeline.id)} disabled={pipeline.status === "running"} title="Run Pipeline">
                        <Play className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => removePipeline(pipeline.id)} title="Delete" className="text-muted-foreground hover:text-destructive">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </CardContent>
      </Card>
    </DashboardLayout>
  )
}
