import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Shield,
  GitBranch,
  Search,
  AlertTriangle,
  CheckCircle2,
  BarChart3,
  Lock,
  Zap,
  Users,
  ArrowRight,
} from "lucide-react"

const features = [
  {
    icon: GitBranch,
    title: "CI/CD Pipeline Visualization",
    description:
      "Real-time visualization of your entire CI/CD pipeline stages including Source, Build, SAST Scan, Security Gate, Test, and Deploy phases. Track job status, duration, and identify bottlenecks instantly.",
  },
  {
    icon: Search,
    title: "SonarQube Integration",
    description:
      "Deep integration with SonarQube for comprehensive code quality and security analysis. Automatically fetch and display bugs, vulnerabilities, code smells, and security hotspots from your Sonar projects.",
  },
  {
    icon: AlertTriangle,
    title: "Security Gate Failures",
    description:
      "Highlighted display of security vulnerabilities with severity classification (Critical, High, Medium, Low). Each finding includes file location, rule ID, CWE references, and OWASP mapping.",
  },
  {
    icon: CheckCircle2,
    title: "Quality Gate Status",
    description:
      "Monitor quality gate conditions including code coverage, duplicated lines, maintainability rating, reliability rating, and security rating. Block deployments when thresholds aren't met.",
  },
  {
    icon: BarChart3,
    title: "Analytics & Reporting",
    description:
      "Track security trends over time, pipeline success rates, coverage improvements, and mean time to fix. Generate and download compliance reports for audits.",
  },
  {
    icon: Lock,
    title: "Secure SDLC Workflow",
    description:
      "Demonstrates a complete secure software development lifecycle with shift-left security practices. Security checks integrated at every stage of development.",
  },
]

const techStack = [
  { name: "Next.js 16", description: "React framework" },
  { name: "TypeScript", description: "Type safety" },
  { name: "Tailwind CSS", description: "Styling" },
  { name: "Recharts", description: "Data visualization" },
  { name: "shadcn/ui", description: "UI components" },
  { name: "Lucide Icons", description: "Icon library" },
]

const apiEndpoints = [
  {
    method: "GET",
    endpoint: "/api/measures/component",
    description: "Fetch project metrics (bugs, vulnerabilities, coverage)",
  },
  {
    method: "GET",
    endpoint: "/api/qualitygates/project_status",
    description: "Get quality gate status and condition results",
  },
  {
    method: "GET",
    endpoint: "/api/issues/search",
    description: "Search for security issues and vulnerabilities",
  },
  {
    method: "GET",
    endpoint: "/api/hotspots/search",
    description: "Get security hotspots requiring review",
  },
]

export default function AboutPage() {
  return (
    <DashboardLayout
      title="About This Platform"
      description="Understanding the DevSecOps Pipeline Visualization & Security Insights Platform"
    >
      {/* Hero Section */}
      <Card className="border-primary/30 bg-card">
        <CardContent className="p-6">
          <div className="flex items-start gap-6">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
              <Shield className="h-8 w-8 text-primary" />
            </div>
            <div className="flex-1 space-y-2">
              <h2 className="text-2xl font-bold text-foreground">DevSecOps Pipeline Platform</h2>
              <p className="text-muted-foreground leading-relaxed">
                This platform demonstrates a real-world DevSecOps workflow by visualizing CI/CD pipeline stages,
                integrating with SonarQube for security analysis, and providing comprehensive insights into code
                quality and security posture. It showcases how security can be shifted left in the development
                lifecycle, ensuring vulnerabilities are caught early before reaching production.
              </p>
              <div className="flex items-center gap-4 pt-2">
                <Badge variant="outline" className="gap-1">
                  <Zap className="h-3 w-3" />
                  Real-time Monitoring
                </Badge>
                <Badge variant="outline" className="gap-1">
                  <Shield className="h-3 w-3" />
                  Security-First
                </Badge>
                <Badge variant="outline" className="gap-1">
                  <Users className="h-3 w-3" />
                  Team Collaboration
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Key Features */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-foreground">Key Features</h3>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <Card key={feature.title} className="border-border bg-card">
              <CardContent className="p-5">
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                    <feature.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-medium text-foreground">{feature.title}</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Why Examiners Like It */}
      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="text-foreground">Why This Demonstrates DevSecOps Excellence</CardTitle>
          <CardDescription>Key aspects that showcase secure SDLC practices</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-success mt-0.5" />
                <div>
                  <p className="font-medium text-foreground">Shows Real DevSecOps Workflow</p>
                  <p className="text-sm text-muted-foreground">
                    Complete pipeline visibility from code commit to production deployment with security gates at each stage.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-success mt-0.5" />
                <div>
                  <p className="font-medium text-foreground">Demonstrates Secure SDLC</p>
                  <p className="text-sm text-muted-foreground">
                    Security integrated throughout development lifecycle, not just at the end. Shift-left security approach.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-success mt-0.5" />
                <div>
                  <p className="font-medium text-foreground">SonarQube API Integration</p>
                  <p className="text-sm text-muted-foreground">
                    Practical demonstration of security tool integration using real Sonar API endpoints.
                  </p>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-success mt-0.5" />
                <div>
                  <p className="font-medium text-foreground">Quality Gate Enforcement</p>
                  <p className="text-sm text-muted-foreground">
                    Configurable thresholds that must be met before code can be deployed. Prevents vulnerable code from reaching production.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-success mt-0.5" />
                <div>
                  <p className="font-medium text-foreground">Security Issue Tracking</p>
                  <p className="text-sm text-muted-foreground">
                    Detailed vulnerability information with CWE and OWASP references for remediation guidance.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-success mt-0.5" />
                <div>
                  <p className="font-medium text-foreground">Metrics & Analytics</p>
                  <p className="text-sm text-muted-foreground">
                    Track security trends over time to measure improvement and identify recurring issues.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* SonarQube API Usage */}
      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="text-foreground">SonarQube API Endpoints Used</CardTitle>
          <CardDescription>Key API endpoints for fetching security and quality data</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {apiEndpoints.map((api) => (
              <div
                key={api.endpoint}
                className="flex items-center gap-4 rounded-lg border border-border p-3"
              >
                <Badge
                  variant="outline"
                  className="shrink-0 font-mono text-xs bg-success/10 text-success border-success/30"
                >
                  {api.method}
                </Badge>
                <code className="shrink-0 text-sm text-primary font-mono">{api.endpoint}</code>
                <ArrowRight className="h-4 w-4 text-muted-foreground shrink-0" />
                <span className="text-sm text-muted-foreground">{api.description}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Tech Stack */}
      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="text-foreground">Technology Stack</CardTitle>
          <CardDescription>Built with modern, production-ready technologies</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
            {techStack.map((tech) => (
              <div key={tech.name} className="rounded-lg border border-border p-3 text-center">
                <p className="font-medium text-foreground">{tech.name}</p>
                <p className="text-xs text-muted-foreground">{tech.description}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </DashboardLayout>
  )
}
