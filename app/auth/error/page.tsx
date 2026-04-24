"use client"

import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Suspense } from "react"
import { Shield, AlertTriangle, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

function ErrorContent() {
  const searchParams = useSearchParams()
  const message = searchParams.get("message") || "An unexpected error occurred during authentication."

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="flex flex-col items-center gap-3">
          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary">
            <Shield className="h-8 w-8 text-primary-foreground" />
          </div>
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground">SecurePipe</h1>
          </div>
        </div>

        <Card className="border-border bg-card">
          <CardHeader className="space-y-1 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-destructive/20">
              <AlertTriangle className="h-6 w-6 text-destructive" />
            </div>
            <CardTitle className="text-xl text-card-foreground">Authentication Error</CardTitle>
            <CardDescription>{message}</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center gap-3">
            <Button variant="outline" className="gap-2 bg-transparent" asChild>
              <Link href="/auth/login">
                <ArrowLeft className="h-4 w-4" />
                Back to Login
              </Link>
            </Button>
            <Button className="gap-2" asChild>
              <Link href="/auth/sign-up">
                Try Sign Up
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default function AuthErrorPage() {
  return (
    <Suspense fallback={null}>
      <ErrorContent />
    </Suspense>
  )
}
