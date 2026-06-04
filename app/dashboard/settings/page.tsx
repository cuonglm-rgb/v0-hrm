import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { getMyEmployee, getMyRoles } from "@/lib/actions/employee-actions"
import { checkCanApproveRequests } from "@/lib/actions/request-type-actions"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Settings, Database, Shield, Building2, Wallet } from "lucide-react"

export default async function SettingsPage() {
  const supabase = await createClient()
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    redirect("/login")
  }

  const [employee, userRoles, canApproveRequests] = await Promise.all([
    getMyEmployee(), 
    getMyRoles(),
    checkCanApproveRequests(),
  ])

  // Check permission
  const roleCodes = userRoles.map((ur) => ur.role.code)
  const isHROrAdmin = roleCodes.includes("hr") || roleCodes.includes("admin")

  if (!isHROrAdmin) {
    redirect("/dashboard")
  }

  return (
    <DashboardLayout employee={employee} userRoles={userRoles} breadcrumbs={[{ label: "Settings" }]} canApproveRequests={canApproveRequests}>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Settings</h1>
          <p className="text-muted-foreground">System configuration and administration</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-indigo-100">
                <Database className="h-6 w-6 text-indigo-600" />
              </div>
              <div>
                <CardTitle>Database</CardTitle>
                <CardDescription>System data status</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <Badge className="bg-green-100 text-green-700">Connected</Badge>
              <p className="text-sm text-muted-foreground mt-2">Supabase PostgreSQL</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-indigo-100">
                <Shield className="h-6 w-6 text-indigo-600" />
              </div>
              <div>
                <CardTitle>Authentication</CardTitle>
                <CardDescription>Login providers</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <Badge className="bg-green-100 text-green-700">Google OAuth</Badge>
              <p className="text-sm text-muted-foreground mt-2">Single Sign-On enabled</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-indigo-100">
                <Building2 className="h-6 w-6 text-indigo-600" />
              </div>
              <div>
                <CardTitle>Organization</CardTitle>
                <CardDescription>Company structure</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <Badge variant="outline">Phase 1</Badge>
              <p className="text-sm text-muted-foreground mt-2">Core HR module active</p>
            </CardContent>
          </Card>

          <Link href="/dashboard/settings/payroll" className="block">
            <Card className="hover:bg-accent/50 transition-colors cursor-pointer h-full">
              <CardHeader className="flex flex-row items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-indigo-100">
                  <Wallet className="h-6 w-6 text-indigo-600" />
                </div>
                <div>
                  <CardTitle>Cấu hình lương</CardTitle>
                  <CardDescription>Tỉ lệ lương thử việc, tham số tính lương</CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <Badge variant="outline">Payroll</Badge>
                <p className="text-sm text-muted-foreground mt-2">Cấu hình các tham số dùng khi tính bảng lương</p>
              </CardContent>
            </Card>
          </Link>

          <Card>
            <CardHeader className="flex flex-row items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-slate-100">
                <Settings className="h-6 w-6 text-slate-600" />
              </div>
              <div>
                <CardTitle>Advanced Settings</CardTitle>
                <CardDescription>Coming soon</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <Badge variant="secondary">Phase 2+</Badge>
              <p className="text-sm text-muted-foreground mt-2">Additional configuration options</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
