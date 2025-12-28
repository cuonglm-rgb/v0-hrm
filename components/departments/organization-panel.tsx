"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Building2, Briefcase } from "lucide-react"
import { DepartmentList } from "./department-list"
import { PositionList } from "./position-list"
import type { Department, Position } from "@/lib/types/database"

interface OrganizationPanelProps {
  departments: Department[]
  positions: Position[]
  isHROrAdmin: boolean
}

export function OrganizationPanel({ departments, positions, isHROrAdmin }: OrganizationPanelProps) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Tổ chức</h1>
        <p className="text-muted-foreground">Quản lý phòng ban và vị trí trong công ty</p>
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
        </TabsList>

        <TabsContent value="departments" className="mt-4">
          <DepartmentList departments={departments} isHROrAdmin={isHROrAdmin} />
        </TabsContent>

        <TabsContent value="positions" className="mt-4">
          <PositionList positions={positions} isHROrAdmin={isHROrAdmin} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
