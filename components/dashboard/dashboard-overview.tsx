"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Users, Building2, Briefcase, Shield } from "lucide-react"
import type { EmployeeWithRelations, UserRoleWithRelations } from "@/lib/types/database"

interface DashboardOverviewProps {
  employee: EmployeeWithRelations | null
  userRoles: UserRoleWithRelations[]
  totalEmployees?: number
  totalDepartments: number
}

const statusColors: Record<string, string> = {
  onboarding: "bg-amber-100 text-amber-700",
  active: "bg-green-100 text-green-700",
  resigned: "bg-slate-100 text-slate-700",
}

const statusLabels: Record<string, string> = {
  onboarding: "Onboarding",
  active: "Active",
  resigned: "Resigned",
}

export function DashboardOverview({ employee, userRoles, totalEmployees, totalDepartments }: DashboardOverviewProps) {
  const initials =
    employee?.full_name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || "U"

  const roleCodes = userRoles.map((ur) => ur.role.code)
  const isHROrAdmin = roleCodes.includes("hr") || roleCodes.includes("admin")

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">
          Welcome back, {employee?.full_name?.split(" ")[0] || "User"}!
        </h1>
        <p className="text-muted-foreground mt-1">Here's what's happening with your team today.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {isHROrAdmin && totalEmployees !== undefined && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Employees</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalEmployees}</div>
              <p className="text-xs text-muted-foreground mt-1">Active members</p>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Departments</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalDepartments}</div>
            <p className="text-xs text-muted-foreground mt-1">Organization units</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Your Status</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <Badge className={statusColors[employee?.status || "onboarding"]}>
              {statusLabels[employee?.status || "onboarding"]}
            </Badge>
            <p className="text-xs text-muted-foreground mt-2">{employee?.position?.name || "No position"}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Your Roles</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-1">
              {userRoles.map((ur) => (
                <Badge key={ur.id} variant="outline" className="text-xs">
                  {ur.role.name}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Profile Card */}
      <Card>
        <CardHeader>
          <CardTitle>Your Profile</CardTitle>
          <CardDescription>Your employee information</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-start gap-6">
            <Avatar className="h-20 w-20">
              <AvatarImage src={employee?.avatar_url || ""} alt={employee?.full_name || ""} />
              <AvatarFallback className="bg-indigo-100 text-indigo-600 text-2xl">{initials}</AvatarFallback>
            </Avatar>
            <div className="grid gap-4 flex-1">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Full Name</p>
                  <p className="font-medium">{employee?.full_name || "-"}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Employee Code</p>
                  <p className="font-medium font-mono">{employee?.employee_code || "-"}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium">{employee?.email || "-"}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Phone</p>
                  <p className="font-medium">{employee?.phone || "-"}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Department</p>
                  <p className="font-medium">{employee?.department?.name || "Not assigned"}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Position</p>
                  <p className="font-medium">{employee?.position?.name || "Not assigned"}</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
