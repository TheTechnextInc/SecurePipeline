"use client"

import { useStore } from "@/lib/store"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { DashboardHeader } from "@/components/dashboard-header"
import { PipelineVisualization } from "@/components/pipeline-visualization"
import { SonarMetrics } from "@/components/sonar-metrics"
import { CoverageChart } from "@/components/coverage-chart"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  CheckCircle2, XCircle, AlertTriangle, Clock, Shield, GitBranch,
  ExternalLink, FileCode, RefreshCw,
} from "lucide-react"
import Link from "next/link"

export default function OverviewPage() {
  const { pipelines, vulnerabilities, qualityGates, selectedRepo, sonarConfig, refreshing } = useStore()

  const filteredPipelines = selectedRepo === "all" ? pipelines : pipelines.filter(p => p.repo === selectedRepo)
  const filteredVulns = selectedRepo === "all" ? vulnerabilities : vulnerabilities.filter(v => v.repo === selectedRepo)
  const openVulns = filteredVulns.filter(v => v.status === "open")
  const criticalCount = openVulns.filter(v => v.severity === "critical").length
  const highCount = openVulns.filter(v => v.severity === "high").length

  const successPipelines = filteredPipelines.filter(p => p.status === "success").length
  const failedPipelines = filteredPipelines.filter(p => p.status === "failed").length

  const activeGate = qualityGates.find(g => g.isDefault) || qualityGates[0]

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <DashboardSidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <DashboardHeader />
        <main className="flex-1 overflow-auto p-6">
          <div className="mx-auto max-w-7xl space-y-6">

            {/* Stats Row */}
            <div className="grid gap-4 md:grid-cols-4">
              <Card className="border-border bg-card">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-success/10">
                      <CheckCircle2 className="h-5 w-5 text-success" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-foreground">{successPipelines}</p>
                      <p className="text-sm text-muted-foreground">Pipelines Passed</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-border bg-card">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-destructive/10">
                      <XCircle className="h-5 w-5 text-destructive" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-foreground">{failedPipelines}</p>
                      <p className="text-sm text-muted-foreground">Pipelines Failed</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-border bg-card">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-destructive/10">
                      <AlertTriangle className="h-5 w-5 text-destructive" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-foreground">{criticalCount}</p>
                      <p className="text-sm text-muted-foreground">Critical Vulns</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-border bg-card">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-warning/10">
                      <Shield className="h-5 w-5 text-warning" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-foreground">{activeGate?.status === "passed" ? "Passed" : "Failed"}</p>
                      <p className="text-sm text-muted-foreground">Quality Gate</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Pipeline Visualization */}
            <PipelineVisualization />
            <SonarMetrics />

            <div className="grid gap-6 lg:grid-cols-2">
              {/* Quality Gate Summary */}
              <Card className="border-border bg-card">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-foreground">Quality Gate: {activeGate?.name}</CardTitle>
                  <Link href="/quality-gates">
                    <Button variant="outline" size="sm" className="gap-2 bg-transparent">View All</Button>
                  </Link>
                </CardHeader>
                <CardContent className="space-y-3">
                  {activeGate?.conditions.map(c => (
                    <div key={c.id} className="flex items-center justify-between py-1">
                      <div className="flex items-center gap-2">
                        {c.status === "passed" ? <CheckCircle2 className="h-4 w-4 text-success" /> :
                         c.status === "failed" ? <XCircle className="h-4 w-4 text-destructive" /> :
                         <AlertTriangle className="h-4 w-4 text-warning" />}
                        <span className="text-sm text-foreground">{c.metric}</span>
                      </div>
                      <span className={`text-sm font-medium ${c.status === "passed" ? "text-success" : c.status === "failed" ? "text-destructive" : "text-warning"}`}>
                        {c.actual}{c.unit}
                      </span>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <CoverageChart />
            </div>

            {/* Security Failures */}
            <Card className="border-border bg-card">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-foreground">Open Vulnerabilities ({openVulns.length})</CardTitle>
                <div className="flex gap-2">
                  {sonarConfig.isConnected && (
                    <a href={`${sonarConfig.url}/dashboard?id=${sonarConfig.projectKey}`} target="_blank" rel="noopener noreferrer">
                      <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                        <ExternalLink className="h-4 w-4" />
                        View in SonarQube
                      </Button>
                    </a>
                  )}
                  <Link href="/security">
                    <Button size="sm" className="gap-2">View All</Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-border">
                  {openVulns.slice(0, 5).map(vuln => (
                    <div key={vuln.id} className="flex items-start gap-4 p-4 transition-colors hover:bg-muted/50">
                      <div className={`mt-1 h-2 w-2 rounded-full ${vuln.severity === "critical" ? "bg-red-500" : vuln.severity === "high" ? "bg-orange-500" : vuln.severity === "medium" ? "bg-yellow-500" : "bg-blue-500"}`} />
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-foreground">{vuln.title}</span>
                          <Badge variant="outline" className={`text-xs ${vuln.severity === "critical" ? "text-red-500 border-red-500/50" : vuln.severity === "high" ? "text-orange-500 border-orange-500/50" : "text-yellow-500 border-yellow-500/50"}`}>
                            {vuln.severity.toUpperCase()}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1 font-mono"><FileCode className="h-3 w-3" />{vuln.file}:{vuln.line}</span>
                          {vuln.cwe && <span className="text-primary">{vuln.cwe}</span>}
                        </div>
                      </div>
                    </div>
                  ))}
                  {openVulns.length === 0 && (
                    <div className="p-8 text-center text-muted-foreground">No open vulnerabilities found.</div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Recent Pipeline Runs */}
            <Card className="border-border bg-card">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-foreground">Recent Pipeline Runs</CardTitle>
                <Link href="/pipelines"><Button variant="outline" size="sm" className="bg-transparent">View All</Button></Link>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-border">
                  {filteredPipelines.slice(0, 5).map(p => {
                    const StatusIcon = p.status === "success" ? CheckCircle2 : p.status === "failed" ? XCircle : p.status === "running" ? RefreshCw : Clock
                    const statusColor = p.status === "success" ? "text-success" : p.status === "failed" ? "text-destructive" : p.status === "running" ? "text-primary" : "text-muted-foreground"
                    return (
                      <div key={p.id} className="flex items-center gap-4 p-4">
                        <StatusIcon className={`h-5 w-5 ${statusColor} ${p.status === "running" ? "animate-spin" : ""}`} />
                        <div className="flex-1">
                          <p className="font-medium text-foreground">{p.name}</p>
                          <div className="flex items-center gap-3 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1"><GitBranch className="h-3 w-3" />{p.branch}</span>
                            <span>{p.repo}</span>
                            <span>{p.startedAt}</span>
                          </div>
                        </div>
                        <Badge variant={p.status === "success" ? "default" : p.status === "failed" ? "destructive" : "secondary"}
                          className={p.status === "success" ? "bg-success text-success-foreground" : p.status === "running" ? "bg-primary/20 text-primary" : ""}>
                          {p.status}
                        </Badge>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

          </div>
        </main>
      </div>
    </div>
  )
}
