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
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, Area, AreaChart,
} from "recharts"
import {
  Download, Calendar, TrendingUp, TrendingDown, FileText, Shield, Bug, Code, RefreshCw,
} from "lucide-react"

// Fixed colors for charts - using direct hex values instead of CSS variables
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

const vulnerabilityTrend = [
  { month: "Aug", critical: 12, high: 18, medium: 25, low: 32 },
  { month: "Sep", critical: 8, high: 15, medium: 22, low: 28 },
  { month: "Oct", critical: 5, high: 12, medium: 20, low: 25 },
  { month: "Nov", critical: 3, high: 10, medium: 18, low: 22 },
  { month: "Dec", critical: 4, high: 8, medium: 15, low: 20 },
  { month: "Jan", critical: 2, high: 6, medium: 12, low: 18 },
]

const coverageTrend = [
  { week: "W1", coverage: 65 }, { week: "W2", coverage: 68 }, { week: "W3", coverage: 70 },
  { week: "W4", coverage: 69 }, { week: "W5", coverage: 72 }, { week: "W6", coverage: 75 },
  { week: "W7", coverage: 74 }, { week: "W8", coverage: 78 },
]

const issuesByType = [
  { name: "Vulnerabilities", value: 23, color: CHART_COLORS.critical },
  { name: "Bugs", value: 45, color: CHART_COLORS.high },
  { name: "Code Smells", value: 156, color: CHART_COLORS.medium },
  { name: "Security Hotspots", value: 12, color: CHART_COLORS.low },
]

const pipelineMetrics = [
  { day: "Mon", success: 24, failed: 3 }, { day: "Tue", success: 28, failed: 2 },
  { day: "Wed", success: 32, failed: 5 }, { day: "Thu", success: 26, failed: 1 },
  { day: "Fri", success: 30, failed: 4 }, { day: "Sat", success: 12, failed: 0 },
  { day: "Sun", success: 8, failed: 1 },
]

export default function ReportsPage() {
  const { reports, scheduleReport, downloadReport, pipelines, vulnerabilities } = useStore()
  const [scheduleOpen, setScheduleOpen] = useState(false)
  const [newReport, setNewReport] = useState({ name: "", type: "Security" })

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
        <Card className="border-border bg-card"><CardContent className="p-4"><div className="flex items-center justify-between"><div><p className="text-sm text-muted-foreground">Vulnerabilities Fixed</p><p className="text-2xl font-bold text-foreground">{vulnerabilities.filter(v => v.status === "fixed").length}</p></div><div className="flex items-center gap-1 text-green-500"><TrendingDown className="h-4 w-4" /><span className="text-sm font-medium">-23%</span></div></div></CardContent></Card>
        <Card className="border-border bg-card"><CardContent className="p-4"><div className="flex items-center justify-between"><div><p className="text-sm text-muted-foreground">Pipeline Success Rate</p><p className="text-2xl font-bold text-foreground">{successRate}%</p></div><div className="flex items-center gap-1 text-green-500"><TrendingUp className="h-4 w-4" /><span className="text-sm font-medium">+2.4%</span></div></div></CardContent></Card>
        <Card className="border-border bg-card"><CardContent className="p-4"><div className="flex items-center justify-between"><div><p className="text-sm text-muted-foreground">Open Vulnerabilities</p><p className="text-2xl font-bold text-foreground">{vulnerabilities.filter(v => v.status === "open").length}</p></div><div className="flex items-center gap-1 text-red-500"><TrendingUp className="h-4 w-4" /></div></div></CardContent></Card>
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
          <CardHeader><CardTitle className="text-foreground">Issues by Type</CardTitle></CardHeader>
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
          <CardHeader><CardTitle className="text-foreground">Pipeline Activity</CardTitle></CardHeader>
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
