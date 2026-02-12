import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertCircle } from "lucide-react"
import Link from "next/link"

export default async function AuthErrorPage({
  searchParams,
}: {
  searchParams: Promise<{ message?: string }>
}) {
  const params = await searchParams
  const isUnauthorizedDomain = params.message === "unauthorized_domain"

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-lg border-0">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
          <CardTitle className="text-xl font-bold text-slate-900">
            {isUnauthorizedDomain ? "Unauthorized Access" : "Authentication Error"}
          </CardTitle>
          <CardDescription className="text-slate-600">
            {isUnauthorizedDomain
              ? "Only @pamoteam.com email addresses are allowed to access this system."
              : "Something went wrong during the authentication process. Please try again."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild className="w-full bg-indigo-600 hover:bg-indigo-700">
            <Link href="/login">Back to Login</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
