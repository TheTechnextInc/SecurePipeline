import Link from "next/link"
import { Shield, Mail, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function SignUpSuccessPage() {
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
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-success/20">
              <Mail className="h-6 w-6 text-success" />
            </div>
            <CardTitle className="text-xl text-card-foreground">Check your email</CardTitle>
            <CardDescription>
              We sent you a confirmation link. Please check your email inbox and click the link to verify your account.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <Button variant="outline" className="gap-2 bg-transparent" asChild>
              <Link href="/auth/login">
                <ArrowLeft className="h-4 w-4" />
                Back to Login
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
