"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Shield, Mail, Lock, Loader2, ArrowRight, UserCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("admin@securepipe.dev")
  const [password, setPassword] = useState("Admin@123456")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "include",
      })
      
      const data = await res.json()
      
      if (res.ok && data.success) {
        // Use window.location for a full page reload to ensure cookies are read
        window.location.href = "/"
      } else {
        setError(data.error || "Login failed. Please check your credentials.")
        setLoading(false)
      }
    } catch (err) {
      console.error("[v0] Login error:", err)
      setError("Network error. Please try again.")
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Logo */}
        <div className="flex flex-col items-center gap-3">
          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary">
            <Shield className="h-8 w-8 text-primary-foreground" />
          </div>
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground">SecurePipe</h1>
            <p className="text-sm text-muted-foreground">DevSecOps Pipeline Visualization</p>
          </div>
        </div>

        {/* Login Card */}
        <Card className="border-border bg-card">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-xl text-card-foreground">Welcome back</CardTitle>
            <CardDescription>Sign in with your credentials</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {error && (
              <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                {error}
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-foreground">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@company.com"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="border-input bg-input pl-10 text-foreground placeholder:text-muted-foreground"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-foreground">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="border-input bg-input pl-10 text-foreground placeholder:text-muted-foreground"
                  />
                </div>
              </div>
              <Button type="submit" className="w-full gap-2" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign In
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </Button>
            </form>

            {/* Demo Credentials Info */}
            <div className="rounded-lg border border-border bg-secondary/50 p-3">
              <p className="mb-2 text-xs font-medium text-foreground flex items-center gap-2">
                <UserCheck className="h-4 w-4 text-primary" />
                Default Credentials (pre-filled)
              </p>
              <div className="space-y-1 font-mono text-xs text-muted-foreground">
                <div className="flex justify-between">
                  <span>Admin:</span>
                  <span>admin@securepipe.dev / Admin@123456</span>
                </div>
                <div className="flex justify-between">
                  <span>Demo:</span>
                  <span>demo@securepipe.dev / Demo@123456</span>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-center">
            <p className="text-sm text-muted-foreground">
              Local authentication - no external database required
            </p>
          </CardFooter>
        </Card>

        {/* Footer */}
        <p className="text-center text-xs text-muted-foreground">
          Secure CI/CD pipeline monitoring powered by SonarQube
        </p>
      </div>
    </div>
  )
}
