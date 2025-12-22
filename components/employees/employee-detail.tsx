"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { toast } from "sonner"
import { Save, ArrowLeft, Shield, Building2, User, Briefcase } from "lucide-react"
import { updateEmployee } from "@/lib/actions/employee-actions"
import { assignRole, removeRole } from "@/lib/actions/role-actions"
import type { EmployeeWithRelations, Department, Position, Role, RoleCode } from "@/lib/types/database"
import Link from "next/link"

interface EmployeeDetailProps {
  employee: EmployeeWithRelations
  employeeRoles: { role: Role }[]
  departments: Department[]
  positions: Position[]
  roles: Role[]
  isHROrAdmin: boolean
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

export function EmployeeDetail({
  employee,
  employeeRoles,
  departments,
  positions,
  roles,
  isHROrAdmin,
}: EmployeeDetailProps) {
  const router = useRouter()
  const [saving, setSaving] = useState(false)

  const [formData, setFormData] = useState({
    full_name: employee.full_name,
    phone: employee.phone || "",
    department_id: employee.department_id || "",
    position_id: employee.position_id || "",
    status: employee.status,
    join_date: employee.join_date || "",
  })

  const initials = employee.full_name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)

  const employeeRoleCodes = employeeRoles.map((er) => er.role.code)

  const handleSave = async () => {
    setSaving(true)
    try {
      const result = await updateEmployee(employee.id, {
        ...formData,
        department_id: formData.department_id || null,
        position_id: formData.position_id || null,
        join_date: formData.join_date || null,
      })

      if (result.success) {
        toast.success("Employee updated successfully")
        router.refresh()
      } else {
        toast.error(result.error || "Failed to update employee")
      }
    } finally {
      setSaving(false)
    }
  }

  const handleToggleRole = async (roleCode: RoleCode) => {
    if (!employee.user_id) return

    const hasRole = employeeRoleCodes.includes(roleCode)

    if (hasRole) {
      const result = await removeRole(employee.user_id, roleCode)
      if (result.success) {
        toast.success(`Role ${roleCode} removed`)
        router.refresh()
      } else {
        toast.error(result.error)
      }
    } else {
      const result = await assignRole(employee.user_id, roleCode)
      if (result.success) {
        toast.success(`Role ${roleCode} assigned`)
        router.refresh()
      } else {
        toast.error(result.error)
      }
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/dashboard/employees">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold">{employee.full_name}</h1>
            <p className="text-muted-foreground">
              {employee.employee_code} • {employee.email}
            </p>
          </div>
        </div>
        {isHROrAdmin && (
          <Button onClick={handleSave} disabled={saving}>
            <Save className="h-4 w-4 mr-2" />
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <Card className="lg:col-span-1">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center">
              <Avatar className="h-24 w-24 mb-4">
                <AvatarImage src={employee.avatar_url || ""} alt={employee.full_name} />
                <AvatarFallback className="bg-indigo-100 text-indigo-600 text-2xl">{initials}</AvatarFallback>
              </Avatar>
              <h3 className="font-semibold text-lg">{employee.full_name}</h3>
              <p className="text-sm text-muted-foreground">{employee.position?.name || "No position"}</p>
              <Badge className={`mt-2 ${statusColors[employee.status]}`}>{statusLabels[employee.status]}</Badge>

              <Separator className="my-4" />

              <div className="w-full space-y-3 text-left">
                <div className="flex items-center gap-3 text-sm">
                  <Building2 className="h-4 w-4 text-muted-foreground" />
                  <span>{employee.department?.name || "No department"}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Briefcase className="h-4 w-4 text-muted-foreground" />
                  <span>{employee.position?.name || "No position"}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span>{employee.manager?.full_name || "No manager"}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Detail Tabs */}
        <Card className="lg:col-span-2">
          <Tabs defaultValue="info">
            <CardHeader>
              <TabsList>
                <TabsTrigger value="info">Information</TabsTrigger>
                <TabsTrigger value="work">Work</TabsTrigger>
                {isHROrAdmin && <TabsTrigger value="roles">Roles</TabsTrigger>}
              </TabsList>
            </CardHeader>
            <CardContent>
              <TabsContent value="info" className="space-y-4 mt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="full_name">Full Name</Label>
                    <Input
                      id="full_name"
                      value={formData.full_name}
                      onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                      disabled={!isHROrAdmin}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" value={employee.email} disabled />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      disabled={!isHROrAdmin}
                      placeholder="Enter phone number"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="employee_code">Employee Code</Label>
                    <Input id="employee_code" value={employee.employee_code || ""} disabled />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="work" className="space-y-4 mt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="department">Department</Label>
                    <Select
                      value={formData.department_id}
                      onValueChange={(value) => setFormData({ ...formData, department_id: value })}
                      disabled={!isHROrAdmin}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select department" />
                      </SelectTrigger>
                      <SelectContent>
                        {departments.map((dept) => (
                          <SelectItem key={dept.id} value={dept.id}>
                            {dept.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="position">Position</Label>
                    <Select
                      value={formData.position_id}
                      onValueChange={(value) => setFormData({ ...formData, position_id: value })}
                      disabled={!isHROrAdmin}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select position" />
                      </SelectTrigger>
                      <SelectContent>
                        {positions.map((pos) => (
                          <SelectItem key={pos.id} value={pos.id}>
                            {pos.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select
                      value={formData.status}
                      onValueChange={(value) => setFormData({ ...formData, status: value as any })}
                      disabled={!isHROrAdmin}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="onboarding">Onboarding</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="resigned">Resigned</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="join_date">Join Date</Label>
                    <Input
                      id="join_date"
                      type="date"
                      value={formData.join_date}
                      onChange={(e) => setFormData({ ...formData, join_date: e.target.value })}
                      disabled={!isHROrAdmin}
                    />
                  </div>
                </div>
              </TabsContent>

              {isHROrAdmin && (
                <TabsContent value="roles" className="space-y-4 mt-0">
                  <div>
                    <h4 className="font-medium mb-3 flex items-center gap-2">
                      <Shield className="h-4 w-4" />
                      Assigned Roles
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {roles.map((role) => {
                        const hasRole = employeeRoleCodes.includes(role.code as RoleCode)
                        return (
                          <div
                            key={role.id}
                            className={`flex items-center justify-between p-3 rounded-lg border ${
                              hasRole ? "bg-indigo-50 border-indigo-200" : "bg-muted/50"
                            }`}
                          >
                            <div>
                              <p className="font-medium">{role.name}</p>
                              <p className="text-xs text-muted-foreground">{role.description}</p>
                            </div>
                            <Button
                              variant={hasRole ? "default" : "outline"}
                              size="sm"
                              onClick={() => handleToggleRole(role.code as RoleCode)}
                            >
                              {hasRole ? "Remove" : "Assign"}
                            </Button>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </TabsContent>
              )}
            </CardContent>
          </Tabs>
        </Card>
      </div>
    </div>
  )
}
