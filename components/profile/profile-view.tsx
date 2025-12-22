"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { toast } from "sonner"
import { Save, Building2, Calendar, Shield, Mail } from "lucide-react"
import { updateMyProfile } from "@/lib/actions/employee-actions"
import type { EmployeeWithRelations, UserRoleWithRelations } from "@/lib/types/database"

interface ProfileViewProps {
  employee: EmployeeWithRelations | null
  userRoles: UserRoleWithRelations[]
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

export function ProfileView({ employee, userRoles }: ProfileViewProps) {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    full_name: employee?.full_name || "",
    phone: employee?.phone || "",
  })

  const initials =
    employee?.full_name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || "U"

  const handleSave = async () => {
    setSaving(true)
    try {
      const result = await updateMyProfile(formData)
      if (result.success) {
        toast.success("Profile updated successfully")
        router.refresh()
      } else {
        toast.error(result.error || "Failed to update profile")
      }
    } finally {
      setSaving(false)
    }
  }

  if (!employee) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-muted-foreground">
          No employee record found. Please contact HR.
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">My Profile</h1>
          <p className="text-muted-foreground">View and update your information</p>
        </div>
        <Button onClick={handleSave} disabled={saving}>
          <Save className="h-4 w-4 mr-2" />
          {saving ? "Saving..." : "Save Changes"}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <Card>
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
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="truncate">{employee.email}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Building2 className="h-4 w-4 text-muted-foreground" />
                  <span>{employee.department?.name || "No department"}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>{employee.join_date ? new Date(employee.join_date).toLocaleDateString() : "Not set"}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Edit Form */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>Update your contact information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="full_name">Full Name</Label>
                <Input
                  id="full_name"
                  value={formData.full_name}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
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
                  placeholder="Enter your phone number"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="employee_code">Employee Code</Label>
                <Input id="employee_code" value={employee.employee_code || ""} disabled />
              </div>
            </div>

            <Separator />

            <div>
              <h4 className="font-medium mb-3 flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Your Roles
              </h4>
              <div className="flex flex-wrap gap-2">
                {userRoles.map((ur) => (
                  <Badge key={ur.id} variant="secondary">
                    {ur.role.name}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
