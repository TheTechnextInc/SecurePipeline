"use client"

import { useState, useMemo } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { useStore } from "@/lib/store"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, Area, AreaChart,
} from "recharts"
import {
  Download, Calendar, TrendingUp, TrendingDown, FileText, Shield, Bug, Code, RefreshCw,
} from "lucide-react"

// Fixed colors for charts
const CHART_COLORS = {
  critical: "#ef4444",
  high: "#f97316",
  medium: "#eab308",
  low: "#3b82f6",
  primary: "#6366f1",
  success: "#22c55e",
  destructive: "#ef4444",
  border: "#374151",
  muted: "#6b7280",
}

// Get recent months dynamically
function getRecentMonths(count: number) {
  const months = []
  const now = new Date()
  for (let i = count - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    months.push(d.toLocaleDateString("en-US", { month: "short" }))
  }
  return months
}

// Get recent weeks dynamically
function getRecentWeeks(count: number) {
  return Array.from({ length: count }, (_, i) => `W${i + 1}`)
}

export default function ReportsPage() {
  const { reports, scheduleReport, downloadReport, pipelines, vulnerabilities } = useStore()
  const [scheduleOpen, setScheduleOpen] = useState(false)
  const [newReport, setNewReport] = useState({ name: "", type: "Security" })

  // Calculate dynamic metrics from store
  const openVulns = vulnerabilities.filter(v => v.status === "open")
  const fixedVulns = vulnerabilities.filter(v => v.status === "fixed")
  
  const criticalCount = openVulns.filter(v => v.severity === "critical").length
  const highCount = openVulns.filter(v => v.severity === "high").length
  const mediumCount = openVulns.filter(v => v.severity === "medium").length
  const lowCount = openVulns.filter(v => v.severity === "low").length

  // Dynamic issues by type from actual vulnerabilities
  const issuesByType = useMemo(() => {
    const bugs = vulnerabilities.filter(v => v.type === "Injection" || v.type === "XSS").length
    const vulns = openVulns.length
    const codeSmells = vulnerabilities.filter(v => v.type === "Security Misconfiguration" || v.type === "Information Disclosure").length
    const hotspots = vulnerabilities.filter(v => v.type === "Cryptography" || v.type === "Secrets" || v.type === "Authorization").length
    
    return [
      { name: "Vulnerabilities", value: vulns || 0, color: CHART_COLORS.critical },
      { name: "Bugs", value: bugs || 0, color: CHART_COLORS.high },
      { name: "Code Smells", value: codeSmells || 0, color: CHART_COLORS.medium },
      { name: "Security Hotspots", value: hotspots || 0, color: CHART_COLORS.low },
    ]
  }, [vulnerabilities, openVulns])

  // Dynamic vulnerability trend using recent months
  const vulnerabilityTrend = useMemo(() => {
    const months = getRecentMonths(6)
    // Simulate decreasing trend based on current data
    const baseVuln = openVulns.length
    return months.map((month, i) => ({
      month,
      critical: Math.max(0, criticalCount + (5 - i) * 2),
      high: Math.max(0, highCount + (5 - i) * 3),
      medium: Math.max(0, mediumCount + (5 - i) * 2),
      low: Math.max(0, lowCount + (5 - i) * 4),
    }))
  }, [openVulns, criticalCount, highCount, mediumCount, lowCount])

  // Dynamic coverage trend
  const coverageTrend = useMemo(() => {
    const weeks = getRecentWeeks(8)
    // Simulate improving coverage
    return weeks.map((week, i) => ({
      week,
      coverage: 65 + i * 2 + Math.floor(Math.random() * 3),
    }))
  }, [])

  // Dynamic pipeline metrics based on actual pipelines
  const pipelineMetrics = useMemo(() => {
    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
    const successCount = pipelines.filter(p => p.status === "success").length
    const failedCount = pipelines.filter(p => p.status === "failed").length
    
    return days.map((day, i) => ({
      day,
      success: Math.max(1, Math.floor(successCount / 7) + (i < 5 ? 5 : 2)),
      failed: Math.max(0, Math.floor(failedCount / 7) + (i === 2 ? 2 : i % 3 === 0 ? 1 : 0)),
    }))
  }, [pipelines])

  const successRate = pipelines.length > 0 ? Math.round((pipelines.filter(p => p.status === "success").length / pipelines.length) * 100) : 0

  const handleSchedule = () => {
    if (!newReport.name) return
    scheduleReport(newReport.name, newReport.type)
    setScheduleOpen(false)
    setNewReport({ name: "", type: "Security" })
  }

  return (
    <DashboardLayout title="Reports & Analytics" description="Security trends, pipeline metrics, and code quality analytics">
      {/* Summary */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="border-border bg-card"><CardContent className="p-4"><div className="flex items-center justify-between"><div><p className="text-sm text-muted-foreground">Vulnerabilities Fixed</p><p className="text-2xl font-bold text-foreground">{fixedVulns.length}</p></div><div className="flex items-center gap-1 text-green-500"><TrendingDown className="h-4 w-4" /><span className="text-sm font-medium">-{fixedVulns.length > 0 ? Math.round((fixedVulns.length / vulnerabilities.length) * 100) : 0}%</span></div></div></CardContent></Card>
        <Card className="border-border bg-card"><CardContent className="p-4"><div className="flex items-center justify-between"><div><p className="text-sm text-muted-foreground">Pipeline Success Rate</p><p className="text-2xl font-bold text-foreground">{successRate}%</p></div><div className="flex items-center gap-1 text-green-500"><TrendingUp className="h-4 w-4" /><span className="text-sm font-medium">+{successRate > 50 ? "2.4" : "0"}%</span></div></div></CardContent></Card>
        <Card className="border-border bg-card"><CardContent className="p-4"><div className="flex items-center justify-between"><div><p className="text-sm text-muted-foreground">Open Vulnerabilities</p><p className="text-2xl font-bold text-foreground">{openVulns.length}</p></div>{openVulns.length > 0 ? <div className="flex items-center gap-1 text-red-500"><TrendingUp className="h-4 w-4" /></div> : <div className="flex items-center gap-1 text-green-500"><TrendingDown className="h-4 w-4" /></div>}</div></CardContent></Card>
        <Card className="border-border bg-card"><CardContent className="p-4"><div className="flex items-center justify-between"><div><p className="text-sm text-muted-foreground">Total Pipelines</p><p className="text-2xl font-bold text-foreground">{pipelines.length}</p></div></div></CardContent></Card>
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-border bg-card">
          <CardHeader><CardTitle className="text-foreground">Vulnerability Trend</CardTitle><CardDescription>Security issues over the last 6 months</CardDescription></CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={vulnerabilityTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke={CHART_COLORS.border} />
                  <XAxis dataKey="month" stroke={CHART_COLORS.muted} fontSize={12} />
                  <YAxis stroke={CHART_COLORS.muted} fontSize={12} />
                  <Tooltip contentStyle={{ backgroundColor: "#1f2937", border: "1px solid #374151", borderRadius: "8px", color: "#f9fafb" }} />
                  <Area type="monotone" dataKey="low" stackId="1" stroke={CHART_COLORS.low} fill={CHART_COLORS.low} fillOpacity={0.6} />
                  <Area type="monotone" dataKey="medium" stackId="1" stroke={CHART_COLORS.medium} fill={CHART_COLORS.medium} fillOpacity={0.6} />
                  <Area type="monotone" dataKey="high" stackId="1" stroke={CHART_COLORS.high} fill={CHART_COLORS.high} fillOpacity={0.6} />
                  <Area type="monotone" dataKey="critical" stackId="1" stroke={CHART_COLORS.critical} fill={CHART_COLORS.critical} fillOpacity={0.6} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border bg-card">
          <CardHeader><CardTitle className="text-foreground">Coverage Trend</CardTitle><CardDescription>Code coverage over the last 8 weeks</CardDescription></CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={coverageTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke={CHART_COLORS.border} />
                  <XAxis dataKey="week" stroke={CHART_COLORS.muted} fontSize={12} />
                  <YAxis domain={[50, 100]} stroke={CHART_COLORS.muted} fontSize={12} />
                  <Tooltip contentStyle={{ backgroundColor: "#1f2937", border: "1px solid #374151", borderRadius: "8px", color: "#f9fafb" }} />
                  <Line type="monotone" dataKey="coverage" stroke={CHART_COLORS.primary} strokeWidth={2} dot={{ fill: CHART_COLORS.primary }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="border-border bg-card">
          <CardHeader><CardTitle className="text-foreground">Issues by Type</CardTitle><CardDescription>Current distribution from your repositories</CardDescription></CardHeader>
          <CardContent>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart><Pie data={issuesByType} cx="50%" cy="50%" innerRadius={40} outerRadius={70} paddingAngle={2} dataKey="value">{issuesByType.map((entry, i) => <Cell key={i} fill={entry.color} />)}</Pie>
                  <Tooltip contentStyle={{ backgroundColor: "#1f2937", border: "1px solid #374151", borderRadius: "8px", color: "#f9fafb" }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2">{issuesByType.map(item => (
              <div key={item.name} className="flex items-center gap-2"><div className="h-2 w-2 rounded-full" style={{ backgroundColor: item.color }} /><span className="text-xs text-muted-foreground">{item.name}</span><span className="ml-auto text-xs font-medium text-foreground">{item.value}</span></div>
            ))}</div>
          </CardContent>
        </Card>
        <Card className="border-border bg-card lg:col-span-2">
          <CardHeader><CardTitle className="text-foreground">Pipeline Activity</CardTitle><CardDescription>Success vs failed runs this week</CardDescription></CardHeader>
          <CardContent>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={pipelineMetrics}>
                  <CartesianGrid strokeDasharray="3 3" stroke={CHART_COLORS.border} />
                  <XAxis dataKey="day" stroke={CHART_COLORS.muted} fontSize={12} />
                  <YAxis stroke={CHART_COLORS.muted} fontSize={12} />
                  <Tooltip contentStyle={{ backgroundColor: "#1f2937", border: "1px solid #374151", borderRadius: "8px", color: "#f9fafb" }} />
                  <Bar dataKey="success" fill={CHART_COLORS.success} radius={[4, 4, 0, 0]} />
                  <Bar dataKey="failed" fill={CHART_COLORS.destructive} radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Reports List */}
      <Card className="border-border bg-card">
        <CardHeader className="flex flex-row items-center justify-between">
          <div><CardTitle className="text-foreground">Generated Reports</CardTitle><CardDescription>Download or schedule new reports</CardDescription></div>
          <Button className="gap-2" onClick={() => setScheduleOpen(true)}><Calendar className="h-4 w-4" />Schedule Report</Button>
        </CardHeader>
        <CardContent>
          <div className="divide-y divide-border">
            {reports.map(report => (
              <div key={report.id} className="flex items-center justify-between py-4">
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                    {report.type === "Security" && <Shield className="h-5 w-5 text-primary" />}
                    {report.type === "Quality" && <Code className="h-5 w-5 text-primary" />}
                    {report.type === "DevOps" && <Bug className="h-5 w-5 text-primary" />}
                    {report.type === "Compliance" && <FileText className="h-5 w-5 text-primary" />}
                    {!["Security", "Quality", "DevOps", "Compliance"].includes(report.type) && <FileText className="h-5 w-5 text-primary" />}
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{report.name}</p>
                    <p className="text-sm text-muted-foreground">{report.status === "generating" ? "Generating..." : `Generated on ${report.generated}`} {report.repo && `- ${report.repo}`}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Badge variant="outline">{report.type}</Badge>
                  {report.status === "generating" ? (
                    <Button variant="outline" size="sm" disabled className="gap-2 bg-transparent"><RefreshCw className="h-4 w-4 animate-spin" />Generating</Button>
                  ) : (
                    <Button variant="outline" size="sm" className="gap-2 bg-transparent" onClick={() => downloadReport(report.id)}><Download className="h-4 w-4" />Download</Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Schedule Dialog */}
      <Dialog open={scheduleOpen} onOpenChange={setScheduleOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Schedule New Report</DialogTitle><DialogDescription>Generate a custom report from your security and pipeline data.</DialogDescription></DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2"><Label>Report Name</Label><Input placeholder="e.g., Monthly Security Audit" value={newReport.name} onChange={e => setNewReport({ ...newReport, name: e.target.value })} /></div>
            <div className="space-y-2">
              <Label>Report Type</Label>
              <Select value={newReport.type} onValueChange={v => setNewReport({ ...newReport, type: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Security">Security</SelectItem>
                  <SelectItem value="Quality">Quality</SelectItem>
                  <SelectItem value="DevOps">DevOps</SelectItem>
                  <SelectItem value="Compliance">Compliance</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setScheduleOpen(false)}>Cancel</Button>
            <Button onClick={handleSchedule} disabled={!newReport.name}>Generate Report</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  )
}
