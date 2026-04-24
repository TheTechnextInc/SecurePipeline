"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { useStore } from "@/lib/store"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  Shield, AlertTriangle, AlertCircle, Info, FileCode,
  Clock, ExternalLink, Filter, Download, RefreshCw, CheckCircle2, XCircle, Eye,
} from "lucide-react"
import type { Vulnerability } from "@/lib/store"

const severityConfig = {
  critical: { color: "bg-red-500", text: "text-red-500", border: "border-red-500/50" },
  high: { color: "bg-orange-500", text: "text-orange-500", border: "border-orange-500/50" },
  medium: { color: "bg-yellow-500", text: "text-yellow-500", border: "border-yellow-500/50" },
  low: { color: "bg-blue-500", text: "text-blue-500", border: "border-blue-500/50" },
}

const vulnStatusConfig = {
  open: { color: "bg-destructive", text: "Open" },
  fixed: { color: "bg-success", text: "Fixed" },
  ignored: { color: "bg-muted", text: "Ignored" },
}

export default function SecurityPage() {
  const { vulnerabilities, selectedRepo, updateVulnerabilityStatus, rescanning, triggerRescan, sonarConfig } = useStore()
  const [severityFilter, setSeverityFilter] = useState<string>("all")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [detailVuln, setDetailVuln] = useState<Vulnerability | null>(null)

  const filtered = vulnerabilities
    .filter(v => selectedRepo === "all" || v.repo === selectedRepo)
    .filter(v => severityFilter === "all" || v.severity === severityFilter)
    .filter(v => statusFilter === "all" || v.status === statusFilter)

  const openVulns = vulnerabilities.filter(v => v.status === "open" && (selectedRepo === "all" || v.repo === selectedRepo))
  const criticalCount = openVulns.filter(v => v.severity === "critical").length
  const highCount = openVulns.filter(v => v.severity === "high").length
  const mediumCount = openVulns.filter(v => v.severity === "medium").length
  const lowCount = openVulns.filter(v => v.severity === "low").length

  const handleExport = () => {
    const csv = ["ID,Title,Severity,Status,File,Line,CWE,OWASP,Repo",
      ...filtered.map(v => `${v.id},${v.title},${v.severity},${v.status},${v.file},${v.line},${v.cwe || ""},${v.owasp || ""},${v.repo}`)
    ].join("\n")
    const blob = new Blob([csv], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "vulnerability_report.csv"
    a.click()
    URL.revokeObjectURL(url)
  }

  const securityScore = Math.max(0, 100 - (criticalCount * 20 + highCount * 10 + mediumCount * 5 + lowCount * 2))
  const scoreGrade = securityScore >= 90 ? "A" : securityScore >= 75 ? "B" : securityScore >= 60 ? "C" : securityScore >= 40 ? "D" : "F"
  const scoreColor = securityScore >= 75 ? "text-success border-success" : securityScore >= 50 ? "text-warning border-warning" : "text-destructive border-destructive"

  return (
    <DashboardLayout title="Security Scans" description="SAST/DAST vulnerability findings from SonarQube security analysis">
      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-5">
        <Card className="border-border bg-card"><CardContent className="p-4"><div className="flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-lg bg-destructive/10"><Shield className="h-5 w-5 text-destructive" /></div><div><p className="text-2xl font-bold text-foreground">{openVulns.length}</p><p className="text-sm text-muted-foreground">Open Issues</p></div></div></CardContent></Card>
        <Card className="border-red-500/30 bg-card"><CardContent className="p-4"><div className="flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-500/10"><AlertCircle className="h-5 w-5 text-red-500" /></div><div><p className="text-2xl font-bold text-red-500">{criticalCount}</p><p className="text-sm text-muted-foreground">Critical</p></div></div></CardContent></Card>
        <Card className="border-orange-500/30 bg-card"><CardContent className="p-4"><div className="flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-500/10"><AlertTriangle className="h-5 w-5 text-orange-500" /></div><div><p className="text-2xl font-bold text-orange-500">{highCount}</p><p className="text-sm text-muted-foreground">High</p></div></div></CardContent></Card>
        <Card className="border-yellow-500/30 bg-card"><CardContent className="p-4"><div className="flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-lg bg-yellow-500/10"><AlertTriangle className="h-5 w-5 text-yellow-500" /></div><div><p className="text-2xl font-bold text-yellow-500">{mediumCount}</p><p className="text-sm text-muted-foreground">Medium</p></div></div></CardContent></Card>
        <Card className="border-blue-500/30 bg-card"><CardContent className="p-4"><div className="flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10"><Info className="h-5 w-5 text-blue-500" /></div><div><p className="text-2xl font-bold text-blue-500">{lowCount}</p><p className="text-sm text-muted-foreground">Low</p></div></div></CardContent></Card>
      </div>

      {/* Security Score */}
      <Card className="border-border bg-card">
        <CardHeader><CardTitle className="text-foreground">Security Score</CardTitle></CardHeader>
        <CardContent>
          <div className="flex items-center gap-6">
            <div className={`flex h-24 w-24 items-center justify-center rounded-full border-4 ${scoreColor}`}>
              <span className={`text-3xl font-bold ${scoreColor.split(" ")[0]}`}>{scoreGrade}</span>
            </div>
            <div className="flex-1 space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm"><span className="text-muted-foreground">Overall Security Health</span><span className="font-medium text-foreground">{securityScore}/100</span></div>
                <Progress value={securityScore} className="h-2" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Filters + List */}
      <Card className="border-border bg-card">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-foreground">Vulnerability Findings ({filtered.length})</CardTitle>
          <div className="flex gap-2">
            <Select value={severityFilter} onValueChange={setSeverityFilter}>
              <SelectTrigger className="w-32 bg-transparent"><Filter className="mr-2 h-4 w-4" /><SelectValue placeholder="Severity" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Severity</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-28 bg-transparent"><SelectValue placeholder="Status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="open">Open</SelectItem>
                <SelectItem value="fixed">Fixed</SelectItem>
                <SelectItem value="ignored">Ignored</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm" className="gap-2 bg-transparent" onClick={handleExport}><Download className="h-4 w-4" />Export CSV</Button>
            <Button size="sm" className="gap-2" onClick={triggerRescan} disabled={rescanning}>
              <RefreshCw className={`h-4 w-4 ${rescanning ? "animate-spin" : ""}`} />{rescanning ? "Scanning..." : "Rescan"}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-border">
            {filtered.length === 0 ? (
              <div className="p-12 text-center text-muted-foreground">No vulnerabilities match your filters.</div>
            ) : filtered.map(vuln => (
              <div key={vuln.id} className={`flex items-start gap-4 p-4 transition-colors hover:bg-muted/50 ${vuln.status !== "open" ? "opacity-60" : ""}`}>
                <div className={`mt-1 h-2 w-2 rounded-full ${severityConfig[vuln.severity].color}`} />
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-foreground">{vuln.title}</span>
                    <Badge variant="outline" className={`text-xs ${severityConfig[vuln.severity].text} ${severityConfig[vuln.severity].border}`}>{vuln.severity.toUpperCase()}</Badge>
                    <Badge variant="secondary" className={`text-xs ${vulnStatusConfig[vuln.status].color} ${vuln.status === "fixed" ? "text-success-foreground" : vuln.status === "open" ? "text-destructive-foreground" : ""}`}>{vulnStatusConfig[vuln.status].text}</Badge>
                    <Badge variant="outline" className="text-xs">{vuln.repo}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{vuln.description}</p>
                  <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1 font-mono"><FileCode className="h-3.5 w-3.5" />{vuln.file}:{vuln.line}</span>
                    <span className="rounded bg-muted px-2 py-0.5">{vuln.type}</span>
                    {vuln.cwe && <a href={`https://cwe.mitre.org/data/definitions/${vuln.cwe.split("-")[1]}.html`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-primary hover:underline">{vuln.cwe}<ExternalLink className="h-3 w-3" /></a>}
                    {vuln.owasp && <span className="rounded bg-primary/10 px-2 py-0.5 text-primary">OWASP {vuln.owasp}</span>}
                    <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" />{vuln.introduced}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  {vuln.status === "open" && (
                    <>
                      <Button variant="ghost" size="sm" onClick={() => updateVulnerabilityStatus(vuln.id, "fixed")} className="gap-1 text-xs text-success"><CheckCircle2 className="h-3 w-3" />Fix</Button>
                      <Button variant="ghost" size="sm" onClick={() => updateVulnerabilityStatus(vuln.id, "ignored")} className="gap-1 text-xs text-muted-foreground"><XCircle className="h-3 w-3" />Ignore</Button>
                    </>
                  )}
                  {vuln.status !== "open" && (
                    <Button variant="ghost" size="sm" onClick={() => updateVulnerabilityStatus(vuln.id, "open")} className="text-xs">Reopen</Button>
                  )}
                  <Button variant="ghost" size="sm" onClick={() => setDetailVuln(vuln)} className="gap-1 text-xs"><Eye className="h-3 w-3" />Details</Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Detail Dialog */}
      <Dialog open={!!detailVuln} onOpenChange={() => setDetailVuln(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{detailVuln?.title}</DialogTitle>
            <DialogDescription>{detailVuln?.id} - {detailVuln?.severity.toUpperCase()} severity</DialogDescription>
          </DialogHeader>
          {detailVuln && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <p className="text-sm font-medium text-foreground">Description</p>
                <p className="text-sm text-muted-foreground">{detailVuln.description}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><p className="text-xs text-muted-foreground">File</p><p className="font-mono text-sm text-foreground">{detailVuln.file}:{detailVuln.line}</p></div>
                <div><p className="text-xs text-muted-foreground">Rule</p><p className="font-mono text-sm text-foreground">{detailVuln.rule}</p></div>
                <div><p className="text-xs text-muted-foreground">Type</p><p className="text-sm text-foreground">{detailVuln.type}</p></div>
                <div><p className="text-xs text-muted-foreground">Repository</p><p className="text-sm text-foreground">{detailVuln.repo}</p></div>
                {detailVuln.cwe && <div><p className="text-xs text-muted-foreground">CWE</p><a href={`https://cwe.mitre.org/data/definitions/${detailVuln.cwe.split("-")[1]}.html`} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline">{detailVuln.cwe}</a></div>}
                {detailVuln.owasp && <div><p className="text-xs text-muted-foreground">OWASP</p><p className="text-sm text-foreground">{detailVuln.owasp}</p></div>}
              </div>
              <div className="rounded-lg border border-border bg-muted/50 p-3">
                <p className="text-xs font-medium text-foreground">Recommended Fix</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {detailVuln.severity === "critical" ? "Immediate action required. Parameterize queries, remove hardcoded secrets, and validate all user input." :
                   detailVuln.severity === "high" ? "Address within 24 hours. Implement proper escaping, authorization checks, and access controls." :
                   "Schedule for next sprint. Update hashing algorithms, add rate limiting, and configure security headers."}
                </p>
              </div>
            </div>
          )}
          <DialogFooter>
            {detailVuln?.status === "open" && (
              <Button onClick={() => { updateVulnerabilityStatus(detailVuln.id, "fixed"); setDetailVuln(null) }} className="gap-2"><CheckCircle2 className="h-4 w-4" />Mark as Fixed</Button>
            )}
            <Button variant="outline" onClick={() => setDetailVuln(null)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  )
}
