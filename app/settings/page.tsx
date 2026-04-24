"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { useStore } from "@/lib/store"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Key, Bell, Shield, GitBranch, Webhook, Mail, Slack, Globe,
  CheckCircle2, AlertCircle, RefreshCw, Eye, EyeOff, Plus, Trash2, ExternalLink,
} from "lucide-react"
import { cn } from "@/lib/utils"

const tabs = [
  { id: "integrations", label: "Integrations", icon: Key },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "security", label: "Security Policies", icon: Shield },
  { id: "cicd", label: "CI/CD Settings", icon: GitBranch },
  { id: "webhooks", label: "Webhooks", icon: Webhook },
]

export default function SettingsPage() {
  const {
    activeSettingsTab, setActiveSettingsTab,
    repositories, addRepository, removeRepository,
    sonarConfig, updateSonarConfig, testSonarConnection, sonarTestStatus,
    webhooks, addWebhook, removeWebhook, toggleWebhook,
  } = useStore()

  const [showToken, setShowToken] = useState(false)
  const [repoDialogOpen, setRepoDialogOpen] = useState(false)
  const [webhookDialogOpen, setWebhookDialogOpen] = useState(false)
  const [newRepoUrl, setNewRepoUrl] = useState("")
  const [newRepoPrivate, setNewRepoPrivate] = useState(false)
  const [newWebhookUrl, setNewWebhookUrl] = useState("")
  const [newWebhookEvents, setNewWebhookEvents] = useState<string[]>(["pipeline.failed"])

  // Notifications settings state
  const [slackEnabled, setSlackEnabled] = useState(true)
  const [emailEnabled, setEmailEnabled] = useState(true)
  const [slackChannel, setSlackChannel] = useState("#devsecops-alerts")
  const [emailAddress, setEmailAddress] = useState("security@acme.com")
  const [alertCritical, setAlertCritical] = useState(true)
  const [alertQualityGate, setAlertQualityGate] = useState(true)
  const [alertPipeline, setAlertPipeline] = useState(true)
  const [alertDigest, setAlertDigest] = useState(false)

  // Security policies state
  const [blockOnCritical, setBlockOnCritical] = useState(true)
  const [requireReview, setRequireReview] = useState(true)
  const [enforceSecHeaders, setEnforceSecHeaders] = useState(true)
  const [autoIgnoreLow, setAutoIgnoreLow] = useState(false)
  const [maxCritical, setMaxCritical] = useState("0")
  const [maxHigh, setMaxHigh] = useState("5")

  // CI/CD settings state
  const [autoTrigger, setAutoTrigger] = useState(true)
  const [prAnalysis, setPrAnalysis] = useState(true)
  const [branchProtection, setBranchProtection] = useState(true)
  const [parallelScans, setParallelScans] = useState(true)
  const [scanTimeout, setScanTimeout] = useState("30")
  const [deployEnv, setDeployEnv] = useState("staging")

  const handleAddRepo = () => {
    if (!newRepoUrl) return
    addRepository(newRepoUrl, newRepoPrivate)
    setNewRepoUrl("")
    setNewRepoPrivate(false)
    setRepoDialogOpen(false)
  }

  const handleAddWebhook = () => {
    if (!newWebhookUrl) return
    addWebhook(newWebhookUrl, newWebhookEvents)
    setNewWebhookUrl("")
    setNewWebhookEvents(["pipeline.failed"])
    setWebhookDialogOpen(false)
  }

  return (
    <DashboardLayout title="Settings" description="Configure integrations, notifications, and security policies">
      <div className="grid gap-6 lg:grid-cols-4">
        {/* Tab Navigation */}
        <div className="space-y-1">
          {tabs.map(tab => (
            <button key={tab.id} onClick={() => setActiveSettingsTab(tab.id)}
              className={cn("flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-sm transition-colors text-left",
                activeSettingsTab === tab.id ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-muted"
              )}>
              <tab.icon className="h-4 w-4" />{tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="space-y-6 lg:col-span-3">

          {/* ── Integrations Tab ── */}
          {activeSettingsTab === "integrations" && (
            <>
              {/* GitHub */}
              <Card className="border-primary/50 bg-card">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-foreground/10">
                        <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" /></svg>
                      </div>
                      <div><CardTitle className="text-foreground">GitHub Integration</CardTitle><CardDescription>Connect repositories for CI/CD</CardDescription></div>
                    </div>
                    <Badge className="bg-success text-success-foreground">Connected</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Connected Repositories ({repositories.length})</Label>
                    {repositories.map(repo => (
                      <div key={repo.id} className="flex items-center justify-between rounded-lg border border-border p-3">
                        <div className="flex items-center gap-3">
                          <CheckCircle2 className="h-5 w-5 text-success" />
                          <div><p className="font-medium text-foreground">{repo.fullName}</p><p className="text-xs text-muted-foreground">{repo.connectedAt} - {repo.isPrivate ? "Private" : "Public"} - Branches: {repo.branches.join(", ")}</p></div>
                        </div>
                        <Button variant="ghost" size="icon" onClick={() => removeRepository(repo.id)} className="text-muted-foreground hover:text-destructive"><Trash2 className="h-4 w-4" /></Button>
                      </div>
                    ))}
                  </div>
                  <Button variant="outline" className="w-full gap-2 bg-transparent" onClick={() => setRepoDialogOpen(true)}><Plus className="h-4 w-4" />Add Repository</Button>
                </CardContent>
              </Card>

              {/* SonarQube */}
              <Card className="border-border bg-card">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#549dd0]/10"><svg className="h-6 w-6 text-[#549dd0]" viewBox="0 0 512 512" fill="currentColor"><path d="M408 320h-48V128H152v192h-48V80h304v240zm0 112H104V208h48v176h208V208h48v224z" /></svg></div>
                      <div><CardTitle className="text-foreground">SonarQube</CardTitle><CardDescription>Code quality and security analysis</CardDescription></div>
                    </div>
                    <Badge className={sonarConfig.isConnected ? "bg-success text-success-foreground" : "bg-muted text-muted-foreground"}>{sonarConfig.isConnected ? "Connected" : "Disconnected"}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2"><Label>Server URL</Label><Input value={sonarConfig.url} onChange={e => updateSonarConfig({ url: e.target.value })} className="bg-input" /><p className="text-xs text-muted-foreground">Use https://sonarcloud.io for cloud or your self-hosted URL</p></div>
                  <div className="space-y-2"><Label>Authentication Token</Label>
                    <div className="relative"><Input type={showToken ? "text" : "password"} value={sonarConfig.token} onChange={e => updateSonarConfig({ token: e.target.value })} className="bg-input pr-10" /><Button variant="ghost" size="icon" className="absolute right-0 top-0" onClick={() => setShowToken(!showToken)}>{showToken ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</Button></div>
                  </div>
                  <div className="space-y-2"><Label>Project Key</Label><Input value={sonarConfig.projectKey} onChange={e => updateSonarConfig({ projectKey: e.target.value })} className="bg-input" /></div>
                  <div className="flex items-center justify-between">
                    <Button variant="outline" className="gap-2 bg-transparent" onClick={testSonarConnection} disabled={sonarTestStatus === "testing"}>
                      {sonarTestStatus === "testing" ? <RefreshCw className="h-4 w-4 animate-spin" /> : sonarTestStatus === "success" ? <CheckCircle2 className="h-4 w-4 text-success" /> : <RefreshCw className="h-4 w-4" />}
                      {sonarTestStatus === "testing" ? "Testing..." : sonarTestStatus === "success" ? "Connected!" : "Test Connection"}
                    </Button>
                    <Button onClick={() => updateSonarConfig({ isConnected: true })}>Save Changes</Button>
                  </div>
                </CardContent>
              </Card>
            </>
          )}

          {/* ── Notifications Tab ── */}
          {activeSettingsTab === "notifications" && (
            <>
              <Card className="border-border bg-card">
                <CardHeader><CardTitle className="text-foreground">Notification Channels</CardTitle><CardDescription>Configure where alerts are sent</CardDescription></CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between rounded-lg border border-border p-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#4A154B]/10"><Slack className="h-5 w-5 text-[#4A154B]" /></div>
                      <div>
                        <p className="font-medium text-foreground">Slack</p>
                        <Input value={slackChannel} onChange={e => setSlackChannel(e.target.value)} className="mt-1 h-7 w-40 bg-input text-xs" />
                      </div>
                    </div>
                    <Switch checked={slackEnabled} onCheckedChange={setSlackEnabled} />
                  </div>
                  <div className="flex items-center justify-between rounded-lg border border-border p-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10"><Mail className="h-5 w-5 text-primary" /></div>
                      <div>
                        <p className="font-medium text-foreground">Email</p>
                        <Input value={emailAddress} onChange={e => setEmailAddress(e.target.value)} className="mt-1 h-7 w-48 bg-input text-xs" />
                      </div>
                    </div>
                    <Switch checked={emailEnabled} onCheckedChange={setEmailEnabled} />
                  </div>
                </CardContent>
              </Card>
              <Card className="border-border bg-card">
                <CardHeader><CardTitle className="text-foreground">Alert Rules</CardTitle><CardDescription>When to send notifications</CardDescription></CardHeader>
                <CardContent className="space-y-4">
                  {[
                    { label: "Critical Vulnerabilities", desc: "Alert immediately for critical issues", icon: AlertCircle, color: "text-destructive", state: alertCritical, setter: setAlertCritical },
                    { label: "Quality Gate Failures", desc: "Alert when conditions are not met", icon: AlertCircle, color: "text-orange-500", state: alertQualityGate, setter: setAlertQualityGate },
                    { label: "Pipeline Failures", desc: "Alert when CI/CD pipeline fails", icon: GitBranch, color: "text-primary", state: alertPipeline, setter: setAlertPipeline },
                    { label: "Daily Digest", desc: "Summary of all findings", icon: Globe, color: "text-muted-foreground", state: alertDigest, setter: setAlertDigest },
                  ].map(rule => (
                    <div key={rule.label} className="flex items-center justify-between rounded-lg border border-border p-4">
                      <div className="flex items-center gap-3"><rule.icon className={`h-5 w-5 ${rule.color}`} /><div><p className="font-medium text-foreground">{rule.label}</p><p className="text-sm text-muted-foreground">{rule.desc}</p></div></div>
                      <Switch checked={rule.state} onCheckedChange={rule.setter} />
                    </div>
                  ))}
                </CardContent>
              </Card>
            </>
          )}

          {/* ── Security Policies Tab ── */}
          {activeSettingsTab === "security" && (
            <Card className="border-border bg-card">
              <CardHeader><CardTitle className="text-foreground">Security Policies</CardTitle><CardDescription>Configure security enforcement rules</CardDescription></CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between rounded-lg border border-border p-4">
                  <div><p className="font-medium text-foreground">Block Deployment on Critical Vulnerabilities</p><p className="text-sm text-muted-foreground">Prevent deployment when critical security issues exist</p></div>
                  <Switch checked={blockOnCritical} onCheckedChange={setBlockOnCritical} />
                </div>
                <div className="flex items-center justify-between rounded-lg border border-border p-4">
                  <div><p className="font-medium text-foreground">Require Security Hotspot Review</p><p className="text-sm text-muted-foreground">All security hotspots must be manually reviewed</p></div>
                  <Switch checked={requireReview} onCheckedChange={setRequireReview} />
                </div>
                <div className="flex items-center justify-between rounded-lg border border-border p-4">
                  <div><p className="font-medium text-foreground">Enforce Security Headers</p><p className="text-sm text-muted-foreground">Require CSP, X-Frame-Options, HSTS headers</p></div>
                  <Switch checked={enforceSecHeaders} onCheckedChange={setEnforceSecHeaders} />
                </div>
                <div className="flex items-center justify-between rounded-lg border border-border p-4">
                  <div><p className="font-medium text-foreground">Auto-Ignore Low Severity</p><p className="text-sm text-muted-foreground">Automatically ignore low severity findings</p></div>
                  <Switch checked={autoIgnoreLow} onCheckedChange={setAutoIgnoreLow} />
                </div>
                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div className="space-y-2"><Label>Max Critical Vulnerabilities</Label><Input type="number" value={maxCritical} onChange={e => setMaxCritical(e.target.value)} className="bg-input" /><p className="text-xs text-muted-foreground">0 = zero tolerance</p></div>
                  <div className="space-y-2"><Label>Max High Vulnerabilities</Label><Input type="number" value={maxHigh} onChange={e => setMaxHigh(e.target.value)} className="bg-input" /></div>
                </div>
                <Button className="w-full">Save Security Policies</Button>
              </CardContent>
            </Card>
          )}

          {/* ── CI/CD Settings Tab ── */}
          {activeSettingsTab === "cicd" && (
            <Card className="border-border bg-card">
              <CardHeader><CardTitle className="text-foreground">CI/CD Configuration</CardTitle><CardDescription>Pipeline behavior and deployment settings</CardDescription></CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between rounded-lg border border-border p-4">
                  <div><p className="font-medium text-foreground">Auto-trigger on Push</p><p className="text-sm text-muted-foreground">Automatically run pipeline on every push</p></div>
                  <Switch checked={autoTrigger} onCheckedChange={setAutoTrigger} />
                </div>
                <div className="flex items-center justify-between rounded-lg border border-border p-4">
                  <div><p className="font-medium text-foreground">Pull Request Analysis</p><p className="text-sm text-muted-foreground">Run security scans on every PR</p></div>
                  <Switch checked={prAnalysis} onCheckedChange={setPrAnalysis} />
                </div>
                <div className="flex items-center justify-between rounded-lg border border-border p-4">
                  <div><p className="font-medium text-foreground">Branch Protection</p><p className="text-sm text-muted-foreground">Block merge if quality gate fails</p></div>
                  <Switch checked={branchProtection} onCheckedChange={setBranchProtection} />
                </div>
                <div className="flex items-center justify-between rounded-lg border border-border p-4">
                  <div><p className="font-medium text-foreground">Parallel Scanning</p><p className="text-sm text-muted-foreground">Run SAST, SCA, and DAST scans in parallel</p></div>
                  <Switch checked={parallelScans} onCheckedChange={setParallelScans} />
                </div>
                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div className="space-y-2"><Label>Scan Timeout (minutes)</Label><Input type="number" value={scanTimeout} onChange={e => setScanTimeout(e.target.value)} className="bg-input" /></div>
                  <div className="space-y-2"><Label>Default Deploy Environment</Label>
                    <Select value={deployEnv} onValueChange={setDeployEnv}><SelectTrigger className="bg-input"><SelectValue /></SelectTrigger>
                      <SelectContent><SelectItem value="staging">Staging</SelectItem><SelectItem value="production">Production</SelectItem><SelectItem value="preview">Preview</SelectItem></SelectContent>
                    </Select>
                  </div>
                </div>
                <Button className="w-full">Save CI/CD Settings</Button>
              </CardContent>
            </Card>
          )}

          {/* ── Webhooks Tab ── */}
          {activeSettingsTab === "webhooks" && (
            <Card className="border-border bg-card">
              <CardHeader className="flex flex-row items-center justify-between">
                <div><CardTitle className="text-foreground">Webhooks</CardTitle><CardDescription>Send pipeline and security events to external services</CardDescription></div>
                <Button size="sm" className="gap-2" onClick={() => setWebhookDialogOpen(true)}><Plus className="h-4 w-4" />Add Webhook</Button>
              </CardHeader>
              <CardContent className="space-y-4">
                {webhooks.length === 0 ? (
                  <div className="py-8 text-center text-muted-foreground">No webhooks configured. Add one to receive event notifications.</div>
                ) : webhooks.map(wh => (
                  <div key={wh.id} className="flex items-center justify-between rounded-lg border border-border p-4">
                    <div className="flex items-center gap-3">
                      <Webhook className="h-5 w-5 text-primary" />
                      <div>
                        <p className="font-mono text-sm text-foreground">{wh.url}</p>
                        <div className="mt-1 flex gap-1">{wh.events.map(e => <Badge key={e} variant="outline" className="text-xs">{e}</Badge>)}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch checked={wh.active} onCheckedChange={() => toggleWebhook(wh.id)} />
                      <Button variant="ghost" size="icon" onClick={() => removeWebhook(wh.id)} className="text-muted-foreground hover:text-destructive"><Trash2 className="h-4 w-4" /></Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Add Repo Dialog */}
      <Dialog open={repoDialogOpen} onOpenChange={setRepoDialogOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Connect GitHub Repository</DialogTitle><DialogDescription>Enter your GitHub repository to connect it for CI/CD and security scanning.</DialogDescription></DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2"><Label>Repository</Label><Input placeholder="owner/repository (e.g., your-username/my-app)" value={newRepoUrl} onChange={e => setNewRepoUrl(e.target.value)} /></div>
            <div className="flex items-center gap-2"><Switch checked={newRepoPrivate} onCheckedChange={setNewRepoPrivate} /><Label>Private repository</Label></div>
            <div className="rounded-lg border border-border bg-muted/50 p-4">
              <h4 className="font-medium text-foreground">What happens next?</h4>
              <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                <li>- Repository will be monitored for code changes</li>
                <li>- Pipelines will trigger automatically on push/PR</li>
                <li>- SonarQube will scan code for security vulnerabilities</li>
                <li>- Quality gates will enforce code standards</li>
                <li>- Your repo will appear in the Pipelines and Security pages</li>
              </ul>
            </div>
          </div>
          <DialogFooter><Button variant="outline" onClick={() => setRepoDialogOpen(false)}>Cancel</Button><Button onClick={handleAddRepo} disabled={!newRepoUrl}>Connect Repository</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Webhook Dialog */}
      <Dialog open={webhookDialogOpen} onOpenChange={setWebhookDialogOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Add Webhook</DialogTitle><DialogDescription>Configure an endpoint to receive event notifications.</DialogDescription></DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2"><Label>Webhook URL</Label><Input placeholder="https://your-service.com/webhook" value={newWebhookUrl} onChange={e => setNewWebhookUrl(e.target.value)} /></div>
            <div className="space-y-2">
              <Label>Events</Label>
              <div className="space-y-2">
                {["pipeline.failed", "pipeline.success", "vulnerability.critical", "vulnerability.high", "quality_gate.failed"].map(event => (
                  <div key={event} className="flex items-center gap-2">
                    <Switch checked={newWebhookEvents.includes(event)} onCheckedChange={checked => {
                      setNewWebhookEvents(prev => checked ? [...prev, event] : prev.filter(e => e !== event))
                    }} />
                    <Label className="text-sm">{event}</Label>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter><Button variant="outline" onClick={() => setWebhookDialogOpen(false)}>Cancel</Button><Button onClick={handleAddWebhook} disabled={!newWebhookUrl}>Add Webhook</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  )
}
