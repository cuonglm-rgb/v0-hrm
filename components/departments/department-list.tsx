"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Building2, Plus, Pencil } from "lucide-react"
import { toast } from "sonner"
import { createDepartment, updateDepartment } from "@/lib/actions/department-actions"
import type { Department } from "@/lib/types/database"

interface DepartmentListProps {
  departments: Department[]
  isHROrAdmin: boolean
}

export function DepartmentList({ departments, isHROrAdmin }: DepartmentListProps) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [editingDept, setEditingDept] = useState<Department | null>(null)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({ name: "", code: "" })

  const handleOpenCreate = () => {
    setEditingDept(null)
    setFormData({ name: "", code: "" })
    setOpen(true)
  }

  const handleOpenEdit = (dept: Department) => {
    setEditingDept(dept)
    setFormData({ name: dept.name, code: dept.code || "" })
    setOpen(true)
  }

  const handleSave = async () => {
    if (!formData.name.trim()) {
      toast.error("Name is required")
      return
    }

    setSaving(true)
    try {
      if (editingDept) {
        const result = await updateDepartment(editingDept.id, {
          name: formData.name,
          code: formData.code || null,
        })
        if (result.success) {
          toast.success("Department updated")
          setOpen(false)
          router.refresh()
        } else {
          toast.error(result.error)
        }
      } else {
        const result = await createDepartment({
          name: formData.name,
          code: formData.code || undefined,
        })
        if (result.success) {
          toast.success("Department created")
          setOpen(false)
          router.refresh()
        } else {
          toast.error(result.error)
        }
      }
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Departments</h1>
          <p className="text-muted-foreground">Organization structure</p>
        </div>
        {isHROrAdmin && (
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button onClick={handleOpenCreate}>
                <Plus className="h-4 w-4 mr-2" />
                Add Department
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editingDept ? "Edit Department" : "Create Department"}</DialogTitle>
                <DialogDescription>
                  {editingDept ? "Update the department information" : "Add a new department to your organization"}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., Human Resources"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="code">Code</Label>
                  <Input
                    id="code"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                    placeholder="e.g., HR"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSave} disabled={saving}>
                  {saving ? "Saving..." : "Save"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <Card>
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Department</TableHead>
                <TableHead>Code</TableHead>
                <TableHead>Created</TableHead>
                {isHROrAdmin && <TableHead className="text-right">Actions</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {departments.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={isHROrAdmin ? 4 : 3} className="text-center py-8 text-muted-foreground">
                    No departments found
                  </TableCell>
                </TableRow>
              ) : (
                departments.map((dept) => (
                  <TableRow key={dept.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-100">
                          <Building2 className="h-4 w-4 text-indigo-600" />
                        </div>
                        <span className="font-medium">{dept.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {dept.code ? (
                        <code className="text-sm bg-muted px-2 py-1 rounded">{dept.code}</code>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {new Date(dept.created_at).toLocaleDateString()}
                    </TableCell>
                    {isHROrAdmin && (
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" onClick={() => handleOpenEdit(dept)}>
                          <Pencil className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                      </TableCell>
                    )}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
