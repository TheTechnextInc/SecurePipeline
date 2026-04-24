"use client"

import { createContext, useContext, useState, useCallback, type ReactNode } from "react"

// ─── Types ───────────────────────────────────────────────────────────
export interface Repository {
  id: string
  name: string
  fullName: string
  isPrivate: boolean
  connectedAt: string
  branches: string[]
}

export interface PipelineStage {
  name: string
  status: "success" | "failed" | "running" | "pending" | "skipped"
}

export interface Pipeline {
  id: string
  name: string
  repo: string
  branch: string
  status: "success" | "failed" | "running" | "pending"
  commit: string
  author: string
  startedAt: string
  duration: string
  stages: PipelineStage[]
}

export interface Vulnerability {
  id: string
  title: string
  severity: "critical" | "high" | "medium" | "low"
  type: string
  file: string
  line: number
  rule: string
  description: string
  introduced: string
  status: "open" | "fixed" | "ignored"
  cwe?: string
  owasp?: string
  repo: string
}

export interface QualityGateCondition {
  id: string
  metric: string
  operator: string
  threshold: number
  unit: string
  actual?: number
  status: "passed" | "failed" | "warning"
}

export interface QualityGate {
  id: string
  name: string
  description: string
  isDefault: boolean
  status: "passed" | "failed"
  conditions: QualityGateCondition[]
  projects: number
  lastEvaluated: string
}

export interface Notification {
  id: string
  type: "critical" | "warning" | "success" | "info"
  title: string
  message: string
  time: string
  read: boolean
  source: string
}

export interface Report {
  id: string
  name: string
  type: string
  generated: string
  status: "ready" | "generating" | "scheduled"
  repo: string
}

export interface WebhookConfig {
  id: string
  url: string
  events: string[]
  active: boolean
}

export interface SonarConfig {
  url: string
  token: string
  projectKey: string
  isConnected: boolean
}

export interface SettingsTab {
  id: string
  label: string
}

// ─── Initial Data ────────────────────────────────────────────────────
const initialRepos: Repository[] = [
  {
    id: "demo-1",
    name: "webapp",
    fullName: "acme/webapp",
    isPrivate: false,
    connectedAt: "2 days ago",
    branches: ["main", "develop", "feature/api-v2"],
  },
]

const initialPipelines: Pipeline[] = [
  {
    id: "demo-1",
    name: "Build & Deploy Production",
    repo: "acme/webapp",
    branch: "main",
    status: "success",
    commit: "feat: add user authentication",
    author: "Sarah Chen",
    startedAt: "2 min ago",
    duration: "4m 32s",
    stages: [
      { name: "Source", status: "success" },
      { name: "Build", status: "success" },
      { name: "SAST", status: "success" },
      { name: "Test", status: "success" },
      { name: "Deploy", status: "success" },
    ],
  },
  {
    id: "demo-2",
    name: "Security Scan Pipeline",
    repo: "acme/webapp",
    branch: "feature/api-v2",
    status: "failed",
    commit: "refactor: optimize API endpoints",
    author: "Mike Johnson",
    startedAt: "15 min ago",
    duration: "2m 18s",
    stages: [
      { name: "Source", status: "success" },
      { name: "Build", status: "success" },
      { name: "SAST", status: "failed" },
      { name: "Test", status: "skipped" },
      { name: "Deploy", status: "skipped" },
    ],
  },
  {
    id: "demo-3",
    name: "Staging Deployment",
    repo: "acme/webapp",
    branch: "develop",
    status: "running",
    commit: "fix: resolve memory leak in worker",
    author: "Emily Davis",
    startedAt: "1 min ago",
    duration: "1m 45s",
    stages: [
      { name: "Source", status: "success" },
      { name: "Build", status: "success" },
      { name: "SAST", status: "running" },
      { name: "Test", status: "pending" },
      { name: "Deploy", status: "pending" },
    ],
  },
]

const initialVulnerabilities: Vulnerability[] = [
  {
    id: "VULN-001", title: "SQL Injection Vulnerability", severity: "critical", type: "Injection",
    file: "src/api/users.ts", line: 45, rule: "security/sql-injection",
    description: "User input is directly concatenated into SQL query without proper sanitization",
    introduced: "2 days ago", status: "open", cwe: "CWE-89", owasp: "A03:2021", repo: "acme/webapp",
  },
  {
    id: "VULN-002", title: "Hardcoded API Secret", severity: "critical", type: "Secrets",
    file: "src/config/api.ts", line: 12, rule: "security/no-hardcoded-secrets",
    description: "API secret key is hardcoded in source code instead of environment variables",
    introduced: "5 days ago", status: "open", cwe: "CWE-798", owasp: "A02:2021", repo: "acme/webapp",
  },
  {
    id: "VULN-003", title: "Cross-Site Scripting (XSS)", severity: "high", type: "XSS",
    file: "src/components/Comment.tsx", line: 28, rule: "security/xss-vulnerability",
    description: "User-generated content rendered without proper HTML escaping",
    introduced: "1 week ago", status: "open", cwe: "CWE-79", owasp: "A03:2021", repo: "acme/webapp",
  },
  {
    id: "VULN-004", title: "Insecure Direct Object Reference", severity: "high", type: "Authorization",
    file: "src/api/documents.ts", line: 67, rule: "security/idor",
    description: "Document access not properly validated against user permissions",
    introduced: "3 days ago", status: "open", cwe: "CWE-639", owasp: "A01:2021", repo: "acme/webapp",
  },
  {
    id: "VULN-005", title: "Weak Password Hashing", severity: "medium", type: "Cryptography",
    file: "src/auth/password.ts", line: 15, rule: "security/weak-hash",
    description: "Using MD5 for password hashing instead of bcrypt or argon2",
    introduced: "2 weeks ago", status: "open", cwe: "CWE-328", owasp: "A02:2021", repo: "acme/webapp",
  },
  {
    id: "VULN-006", title: "Missing Rate Limiting", severity: "medium", type: "Security Misconfiguration",
    file: "src/api/auth.ts", line: 89, rule: "security/rate-limiting",
    description: "Authentication endpoint lacks rate limiting protection",
    introduced: "1 week ago", status: "open", cwe: "CWE-307", owasp: "A05:2021", repo: "acme/webapp",
  },
  {
    id: "VULN-007", title: "Verbose Error Messages", severity: "low", type: "Information Disclosure",
    file: "src/middleware/error.ts", line: 34, rule: "security/error-disclosure",
    description: "Stack traces exposed in production error responses",
    introduced: "3 weeks ago", status: "fixed", cwe: "CWE-209", owasp: "A04:2021", repo: "acme/webapp",
  },
  {
    id: "VULN-008", title: "Missing Security Headers", severity: "low", type: "Security Misconfiguration",
    file: "next.config.js", line: 1, rule: "security/headers",
    description: "Security headers like CSP, X-Frame-Options not configured",
    introduced: "1 month ago", status: "ignored", cwe: "CWE-693", owasp: "A05:2021", repo: "acme/webapp",
  },
]

const initialQualityGates: QualityGate[] = [
  {
    id: "1", name: "Sonar Way", description: "SonarQube default quality gate - recommended for most projects",
    isDefault: true, status: "failed", lastEvaluated: "2 min ago", projects: 12,
    conditions: [
      { id: "c1", metric: "Coverage", operator: "<", threshold: 80, unit: "%", actual: 72.4, status: "failed" },
      { id: "c2", metric: "Duplicated Lines", operator: ">", threshold: 3, unit: "%", actual: 2.1, status: "passed" },
      { id: "c3", metric: "Maintainability Rating", operator: ">", threshold: 1, unit: "", actual: 1, status: "passed" },
      { id: "c4", metric: "Reliability Rating", operator: ">", threshold: 1, unit: "", actual: 1, status: "passed" },
      { id: "c5", metric: "Security Rating", operator: ">", threshold: 1, unit: "", actual: 3, status: "failed" },
      { id: "c6", metric: "Security Hotspots Reviewed", operator: "<", threshold: 100, unit: "%", actual: 85, status: "warning" },
    ],
  },
  {
    id: "2", name: "Strict Security", description: "Zero tolerance for security vulnerabilities",
    isDefault: false, status: "failed", lastEvaluated: "15 min ago", projects: 5,
    conditions: [
      { id: "c1", metric: "Security Rating", operator: ">", threshold: 1, unit: "", actual: 3, status: "failed" },
      { id: "c2", metric: "Security Hotspots Reviewed", operator: "<", threshold: 100, unit: "%", actual: 85, status: "failed" },
      { id: "c3", metric: "Vulnerabilities", operator: ">", threshold: 0, unit: "", actual: 8, status: "failed" },
      { id: "c4", metric: "Security Remediation Effort", operator: ">", threshold: 5, unit: "days", actual: 3, status: "passed" },
    ],
  },
  {
    id: "3", name: "Coverage Focus", description: "Emphasizes code coverage for test-driven teams",
    isDefault: false, status: "passed", lastEvaluated: "1 hour ago", projects: 8,
    conditions: [
      { id: "c1", metric: "Coverage on New Code", operator: "<", threshold: 90, unit: "%", actual: 94.2, status: "passed" },
      { id: "c2", metric: "Coverage", operator: "<", threshold: 70, unit: "%", actual: 72.4, status: "passed" },
      { id: "c3", metric: "Test Success Rate", operator: "<", threshold: 100, unit: "%", actual: 100, status: "passed" },
    ],
  },
]

const initialNotifications: Notification[] = [
  { id: "1", type: "critical", title: "Critical Vulnerability Detected", message: "SQL Injection vulnerability found in src/api/users.ts.", time: "5 min ago", read: false, source: "SonarQube" },
  { id: "2", type: "critical", title: "Hardcoded Secret Found", message: "API secret key exposed in src/config/api.ts.", time: "15 min ago", read: false, source: "SonarQube" },
  { id: "3", type: "warning", title: "Quality Gate Failed", message: "Code coverage dropped below 80% on feature/api-v2.", time: "1 hour ago", read: false, source: "Quality Gate" },
  { id: "4", type: "success", title: "Pipeline Completed", message: "Production deployment successful for main branch.", time: "2 hours ago", read: true, source: "CI/CD" },
  { id: "5", type: "warning", title: "Security Hotspot Needs Review", message: "12 new security hotspots require manual review.", time: "3 hours ago", read: true, source: "SonarQube" },
  { id: "6", type: "info", title: "Weekly Security Report Ready", message: "Your weekly security summary report is available.", time: "6 hours ago", read: true, source: "Reports" },
]

const getRecentDate = (daysAgo: number) => {
  const d = new Date()
  d.setDate(d.getDate() - daysAgo)
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
}

const initialReports: Report[] = [
  { id: "1", name: "Weekly Security Summary", type: "Security", generated: getRecentDate(0), status: "ready", repo: "acme/webapp" },
  { id: "2", name: "Code Quality Trends", type: "Quality", generated: getRecentDate(1), status: "ready", repo: "acme/webapp" },
  { id: "3", name: "Pipeline Performance Report", type: "DevOps", generated: getRecentDate(2), status: "ready", repo: "acme/webapp" },
  { id: "4", name: "Compliance Audit Log", type: "Compliance", generated: getRecentDate(5), status: "ready", repo: "acme/webapp" },
]

const initialWebhooks: WebhookConfig[] = [
  { id: "1", url: "https://hooks.slack.com/services/T00/B00/xxx", events: ["pipeline.failed", "vulnerability.critical"], active: true },
]

// ─── Context ─────────────────────────────────────────────────────────
interface StoreContextType {
  repositories: Repository[]
  addRepository: (fullName: string, isPrivate: boolean) => void
  removeRepository: (id: string) => void

  pipelines: Pipeline[]
  addPipeline: (name: string, repo: string, branch: string) => void
  removePipeline: (id: string) => void
  runPipeline: (id: string) => void

  vulnerabilities: Vulnerability[]
  updateVulnerabilityStatus: (id: string, status: "open" | "fixed" | "ignored") => void
  rescanning: boolean
  triggerRescan: () => void

  qualityGates: QualityGate[]
  addQualityGate: (name: string, description: string) => void
  removeQualityGate: (id: string) => void
  setDefaultGate: (id: string) => void
  addCondition: (gateId: string, metric: string, operator: string, threshold: number, unit: string) => void
  removeCondition: (gateId: string, conditionId: string) => void

  notifications: Notification[]
  addNotification: (type: Notification["type"], title: string, message: string, source: string) => void
  markAsRead: (id: string) => void
  markAllAsRead: () => void
  deleteNotification: (id: string) => void
  unreadCount: number

  reports: Report[]
  scheduleReport: (name: string, type: string) => void
  downloadReport: (id: string) => void

  webhooks: WebhookConfig[]
  addWebhook: (url: string, events: string[]) => void
  removeWebhook: (id: string) => void
  toggleWebhook: (id: string) => void

  sonarConfig: SonarConfig
  updateSonarConfig: (config: Partial<SonarConfig>) => void
  testSonarConnection: () => void
  sonarTestStatus: "idle" | "testing" | "success" | "error"

  selectedRepo: string
  setSelectedRepo: (repo: string) => void

  refreshing: boolean
  triggerRefresh: () => void

  searchQuery: string
  setSearchQuery: (q: string) => void

  activeSettingsTab: string
  setActiveSettingsTab: (tab: string) => void
}

const StoreContext = createContext<StoreContextType | null>(null)

export function StoreProvider({ children }: { children: ReactNode }) {
  const [repositories, setRepositories] = useState<Repository[]>(initialRepos)
  const [pipelines, setPipelines] = useState<Pipeline[]>(initialPipelines)
  const [vulnerabilities, setVulnerabilities] = useState<Vulnerability[]>(initialVulnerabilities)
  const [qualityGates, setQualityGates] = useState<QualityGate[]>(initialQualityGates)
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications)
  const [reports, setReports] = useState<Report[]>(initialReports)
  const [webhooks, setWebhooks] = useState<WebhookConfig[]>(initialWebhooks)
  const [selectedRepo, setSelectedRepo] = useState<string>("all")
  const [refreshing, setRefreshing] = useState(false)
  const [rescanning, setRescanning] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [activeSettingsTab, setActiveSettingsTab] = useState("integrations")
  const [sonarTestStatus, setSonarTestStatus] = useState<"idle" | "testing" | "success" | "error">("idle")
  const [sonarConfig, setSonarConfig] = useState<SonarConfig>({
    url: "https://sonarcloud.io", token: "sqp_xxxxxxxxxxxxxxxxxxxxxxxxxxxx",
    projectKey: "acme_web-app", isConnected: true,
  })

  // ── Helpers ──
  const pushNotification = useCallback((type: Notification["type"], title: string, message: string, source: string) => {
    setNotifications(prev => [{ id: Date.now().toString(), type, title, message, time: "Just now", read: false, source }, ...prev])
  }, [])

  // ── Repository ──
  const addRepository = useCallback((fullName: string, isPrivate: boolean) => {
    const name = fullName.split("/").pop() || fullName
    const repoId = Date.now().toString()
    const newRepo: Repository = { id: repoId, name, fullName, isPrivate, connectedAt: "Just now", branches: ["main", "develop"] }
    setRepositories(prev => [...prev, newRepo])
    
    // Auto-create a default pipeline for this repo
    const newPipeline: Pipeline = {
      id: `pip-${repoId}`, name: `Build & Deploy ${name}`, repo: fullName, branch: "main",
      status: "pending", commit: "Initial commit", author: "You", startedAt: "Just now", duration: "-",
      stages: [
        { name: "Source", status: "pending" }, { name: "Build", status: "pending" },
        { name: "SAST", status: "pending" }, { name: "Test", status: "pending" },
        { name: "Deploy", status: "pending" },
      ],
    }
    setPipelines(prev => [newPipeline, ...prev])
    
    // Auto-create sample vulnerabilities for this repo (clean slate - no critical/high so pipeline can pass)
    const newVulns: Vulnerability[] = [
      {
        id: `VULN-${repoId}-1`, title: "Missing Security Headers", severity: "medium", type: "Security Misconfiguration",
        file: "next.config.js", line: 1, rule: "security/headers",
        description: "Security headers like CSP, X-Frame-Options not configured",
        introduced: "Just now", status: "open", cwe: "CWE-693", owasp: "A05:2021", repo: fullName,
      },
      {
        id: `VULN-${repoId}-2`, title: "Verbose Error Messages", severity: "low", type: "Information Disclosure",
        file: "src/middleware/error.ts", line: 34, rule: "security/error-disclosure",
        description: "Stack traces may be exposed in error responses",
        introduced: "Just now", status: "open", cwe: "CWE-209", owasp: "A04:2021", repo: fullName,
      },
    ]
    setVulnerabilities(prev => [...newVulns, ...prev])
    
    // Auto-create a report for this repo
    const newReport: Report = {
      id: `rep-${repoId}`, name: `Security Scan - ${name}`, type: "Security",
      generated: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      status: "ready", repo: fullName,
    }
    setReports(prev => [newReport, ...prev])
    
    // Select this repo automatically
    setSelectedRepo(fullName)
    
    pushNotification("success", "Repository Connected", `${fullName} has been connected with pipeline, security scan, and report initialized.`, "GitHub")
  }, [pushNotification])

  const removeRepository = useCallback((id: string) => {
    setRepositories(prev => {
      const repo = prev.find(r => r.id === id)
      if (repo) {
        // Remove all related data
        setPipelines(p => p.filter(pl => pl.repo !== repo.fullName))
        setVulnerabilities(v => v.filter(vl => vl.repo !== repo.fullName))
        setReports(r => r.filter(rp => rp.repo !== repo.fullName))
        // Reset selection if this repo was selected
        if (selectedRepo === repo.fullName) {
          setSelectedRepo("all")
        }
        pushNotification("info", "Repository Removed", `${repo.fullName} and all related data has been disconnected.`, "GitHub")
      }
      return prev.filter(r => r.id !== id)
    })
  }, [pushNotification, selectedRepo])

  // ── Pipeline ──
  const addPipeline = useCallback((name: string, repo: string, branch: string) => {
    const p: Pipeline = {
      id: Date.now().toString(), name, repo, branch, status: "pending",
      commit: "Initial pipeline setup", author: "You", startedAt: "Just now", duration: "-",
      stages: [
        { name: "Source", status: "pending" }, { name: "Build", status: "pending" },
        { name: "SAST", status: "pending" }, { name: "Test", status: "pending" },
        { name: "Deploy", status: "pending" },
      ],
    }
    setPipelines(prev => [p, ...prev])
    pushNotification("info", "Pipeline Created", `Pipeline "${name}" created for ${repo}.`, "CI/CD")
  }, [pushNotification])

  const removePipeline = useCallback((id: string) => {
    setPipelines(prev => prev.filter(p => p.id !== id))
  }, [])

  const runPipeline = useCallback((id: string) => {
    // Get the pipeline repo to check its vulnerabilities
    const pipeline = pipelines.find(p => p.id === id)
    const pipelineRepo = pipeline?.repo || ""
    
    // Check if this repo has open critical/high vulnerabilities
    const repoVulns = vulnerabilities.filter(v => v.repo === pipelineRepo && v.status === "open")
    const hasCriticalOrHigh = repoVulns.some(v => v.severity === "critical" || v.severity === "high")
    
    // Pipeline passes if no critical/high vulnerabilities exist for this repo
    const willPass = !hasCriticalOrHigh
    
    setPipelines(prev => prev.map(p => {
      if (p.id === id) {
        return { ...p, status: "running" as const, startedAt: "Just now", duration: "0s",
          stages: p.stages.map((s, i) => ({ ...s, status: i === 0 ? "running" as const : "pending" as const })),
        }
      }
      return p
    }))

    // Stage 2 after 1s
    setTimeout(() => {
      setPipelines(prev => prev.map(p => {
        if (p.id === id && p.status === "running") {
          return { ...p, duration: "1m 10s",
            stages: p.stages.map((s, i) => ({ ...s, status: i <= 1 ? "success" as const : i === 2 ? "running" as const : "pending" as const })),
          }
        }
        return p
      }))
    }, 1500)

    // Finish after 3.5s
    setTimeout(() => {
      setPipelines(prev => prev.map(p => {
        if (p.id === id && p.status === "running") {
          return {
            ...p, status: willPass ? "success" as const : "failed" as const, duration: "3m 22s",
            stages: p.stages.map((s, i) => ({
              ...s, status: willPass ? "success" as const : (i < 3 ? "success" as const : i === 3 ? "failed" as const : "skipped" as const),
            })),
          }
        }
        return p
      }))
      pushNotification(
        willPass ? "success" : "critical",
        willPass ? "Pipeline Passed" : "Pipeline Failed",
        willPass 
          ? `Pipeline for ${pipelineRepo} completed successfully - no critical vulnerabilities found.`
          : `Pipeline for ${pipelineRepo} failed at Security Gate - ${repoVulns.filter(v => v.severity === "critical" || v.severity === "high").length} critical/high vulnerabilities detected.`,
        "CI/CD"
      )
    }, 3500)
  }, [pipelines, vulnerabilities, pushNotification])

  // ── Vulnerability ──
  const updateVulnerabilityStatus = useCallback((id: string, status: "open" | "fixed" | "ignored") => {
    setVulnerabilities(prev => prev.map(v => v.id === id ? { ...v, status } : v))
    const statusLabel = status === "fixed" ? "marked as fixed" : status === "ignored" ? "marked as ignored" : "reopened"
    pushNotification("info", "Vulnerability Updated", `${id} has been ${statusLabel}.`, "SonarQube")
  }, [pushNotification])

  const triggerRescan = useCallback(() => {
    setRescanning(true)
    pushNotification("info", "Rescan Started", "Full security rescan has been triggered.", "SonarQube")
    setTimeout(() => {
      setRescanning(false)
      // Simulate finding a new vuln
      const newVuln: Vulnerability = {
        id: `VULN-${Date.now()}`, title: "Outdated Dependency (simulated)", severity: "medium",
        type: "Dependency", file: "package.json", line: 1, rule: "security/outdated-dep",
        description: "Simulated finding from rescan - outdated dependency with known CVE",
        introduced: "Just now", status: "open", cwe: "CWE-1104", owasp: "A06:2021",
        repo: selectedRepo === "all" ? (repositories[0]?.fullName || "acme/webapp") : selectedRepo,
      }
      setVulnerabilities(prev => [newVuln, ...prev])
      pushNotification("warning", "Rescan Complete", "1 new vulnerability found during rescan.", "SonarQube")
    }, 3000)
  }, [selectedRepo, repositories, pushNotification])

  // ── Quality Gate ──
  const addQualityGate = useCallback((name: string, description: string) => {
    const gate: QualityGate = {
      id: Date.now().toString(), name, description, isDefault: false, status: "passed",
      conditions: [], projects: 0, lastEvaluated: "Never",
    }
    setQualityGates(prev => [...prev, gate])
    pushNotification("info", "Quality Gate Created", `"${name}" quality gate has been created.`, "Quality Gate")
  }, [pushNotification])

  const removeQualityGate = useCallback((id: string) => {
    setQualityGates(prev => prev.filter(g => g.id !== id))
  }, [])

  const setDefaultGate = useCallback((id: string) => {
    setQualityGates(prev => prev.map(g => ({ ...g, isDefault: g.id === id })))
  }, [])

  const addCondition = useCallback((gateId: string, metric: string, operator: string, threshold: number, unit: string) => {
    setQualityGates(prev => prev.map(g => {
      if (g.id === gateId) {
        const cond: QualityGateCondition = {
          id: Date.now().toString(), metric, operator, threshold, unit,
          actual: Math.round(Math.random() * threshold * 1.5), status: "passed",
        }
        cond.status = operator === "<" ? (cond.actual! <= threshold ? "passed" : "failed") : (cond.actual! >= threshold ? "failed" : "passed")
        return { ...g, conditions: [...g.conditions, cond] }
      }
      return g
    }))
  }, [])

  const removeCondition = useCallback((gateId: string, conditionId: string) => {
    setQualityGates(prev => prev.map(g => {
      if (g.id === gateId) {
        return { ...g, conditions: g.conditions.filter(c => c.id !== conditionId) }
      }
      return g
    }))
  }, [])

  // ── Notification ──
  const addNotification = pushNotification
  const markAsRead = useCallback((id: string) => { setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n)) }, [])
  const markAllAsRead = useCallback(() => { setNotifications(prev => prev.map(n => ({ ...n, read: true }))) }, [])
  const deleteNotification = useCallback((id: string) => { setNotifications(prev => prev.filter(n => n.id !== id)) }, [])
  const unreadCount = notifications.filter(n => !n.read).length

  // ── Reports ──
  const scheduleReport = useCallback((name: string, type: string) => {
    const r: Report = { id: Date.now().toString(), name, type, generated: "Generating...", status: "generating", repo: selectedRepo === "all" ? "All Repos" : selectedRepo }
    setReports(prev => [r, ...prev])
    pushNotification("info", "Report Scheduled", `"${name}" report is being generated.`, "Reports")
    setTimeout(() => {
      setReports(prev => prev.map(rep => rep.id === r.id ? { ...rep, generated: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }), status: "ready" as const } : rep))
      pushNotification("success", "Report Ready", `"${name}" report is ready for download.`, "Reports")
    }, 3000)
  }, [selectedRepo, pushNotification])

  const downloadReport = useCallback((id: string) => {
    const report = reports.find(r => r.id === id)
    if (!report) return
    // Simulate download by creating a text blob
    const content = `DevSecOps Report: ${report.name}\nType: ${report.type}\nGenerated: ${report.generated}\nRepository: ${report.repo}\n\nThis is a simulated report download.`
    const blob = new Blob([content], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${report.name.replace(/\s+/g, "_")}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }, [reports])

  // ── Webhooks ──
  const addWebhook = useCallback((url: string, events: string[]) => {
    setWebhooks(prev => [...prev, { id: Date.now().toString(), url, events, active: true }])
    pushNotification("info", "Webhook Added", `Webhook configured for ${url}.`, "Settings")
  }, [pushNotification])
  const removeWebhook = useCallback((id: string) => { setWebhooks(prev => prev.filter(w => w.id !== id)) }, [])
  const toggleWebhook = useCallback((id: string) => { setWebhooks(prev => prev.map(w => w.id === id ? { ...w, active: !w.active } : w)) }, [])

  // ── Sonar ──
  const updateSonarConfig = useCallback((config: Partial<SonarConfig>) => { setSonarConfig(prev => ({ ...prev, ...config })) }, [])
  const testSonarConnection = useCallback(() => {
    setSonarTestStatus("testing")
    setTimeout(() => {
      setSonarTestStatus("success")
      updateSonarConfig({ isConnected: true })
      pushNotification("success", "SonarQube Connected", "Successfully connected to SonarQube server.", "SonarQube")
      setTimeout(() => setSonarTestStatus("idle"), 3000)
    }, 2000)
  }, [updateSonarConfig, pushNotification])

  // ── Refresh ──
  const triggerRefresh = useCallback(() => {
    setRefreshing(true)
    setTimeout(() => setRefreshing(false), 2000)
  }, [])

  return (
    <StoreContext.Provider value={{
      repositories, addRepository, removeRepository,
      pipelines, addPipeline, removePipeline, runPipeline,
      vulnerabilities, updateVulnerabilityStatus, rescanning, triggerRescan,
      qualityGates, addQualityGate, removeQualityGate, setDefaultGate, addCondition, removeCondition,
      notifications, addNotification, markAsRead, markAllAsRead, deleteNotification, unreadCount,
      reports, scheduleReport, downloadReport,
      webhooks, addWebhook, removeWebhook, toggleWebhook,
      sonarConfig, updateSonarConfig, testSonarConnection, sonarTestStatus,
      selectedRepo, setSelectedRepo,
      refreshing, triggerRefresh,
      searchQuery, setSearchQuery,
      activeSettingsTab, setActiveSettingsTab,
    }}>
      {children}
    </StoreContext.Provider>
  )
}

export function useStore() {
  const ctx = useContext(StoreContext)
  if (!ctx) throw new Error("useStore must be used within StoreProvider")
  return ctx
}
