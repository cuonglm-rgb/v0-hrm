"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Building2, Briefcase, Clock } from "lucide-react"
import { DepartmentList } from "./department-list"
import { PositionList } from "./position-list"
import { ShiftList } from "./shift-list"
import type { Department, Position, WorkShift } from "@/lib/types/database"

interface OrganizationPanelProps {
  departments: Department[]
  positions: Position[]
  shifts: WorkShift[]
  isHROrAdmin: boolean
}

export function OrganizationPanel({ departments, positions, shifts, isHROrAdmin }: OrganizationPanelProps) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Tổ chức</h1>
        <p className="text-muted-foreground">Quản lý phòng ban, vị trí và ca làm việc</p>
      </div>

      <Tabs defaultValue="departments">
        <TabsList>
          <TabsTrigger value="departments" className="gap-2">
            <Building2 className="h-4 w-4" />
            Phòng ban ({departments.length})
          </TabsTrigger>
          <TabsTrigger value="positions" className="gap-2">
            <Briefcase className="h-4 w-4" />
            Vị trí ({positions.length})
          </TabsTrigger>
          <TabsTrigger value="shifts" className="gap-2">
            <Clock className="h-4 w-4" />
            Ca làm ({shifts.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="departments" className="mt-4">
          <DepartmentList departments={departments} isHROrAdmin={isHROrAdmin} />
        </TabsContent>

        <TabsContent value="positions" className="mt-4">
          <PositionList positions={positions} isHROrAdmin={isHROrAdmin} />
        </TabsContent>

        <TabsContent value="shifts" className="mt-4">
          <ShiftList shifts={shifts} isHROrAdmin={isHROrAdmin} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
