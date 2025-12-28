import type React from "react"
import { Fragment } from "react"
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "./app-sidebar"
import { Separator } from "@/components/ui/separator"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import type { EmployeeWithRelations, UserRoleWithRelations } from "@/lib/types/database"

interface DashboardLayoutProps {
  children: React.ReactNode
  employee: EmployeeWithRelations | null
  userRoles: UserRoleWithRelations[]
  breadcrumbs?: { label: string; href?: string }[]
}

export function DashboardLayout({ children, employee, userRoles, breadcrumbs = [] }: DashboardLayoutProps) {
  return (
    <SidebarProvider>
      <AppSidebar employee={employee} userRoles={userRoles} />
      <SidebarInset>
        <header className="flex h-14 shrink-0 items-center gap-2 border-b bg-background px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
              </BreadcrumbItem>
              {breadcrumbs.map((item, index) => (
                <Fragment key={index}>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    {item.href ? (
                      <BreadcrumbLink href={item.href}>{item.label}</BreadcrumbLink>
                    ) : (
                      <BreadcrumbPage>{item.label}</BreadcrumbPage>
                    )}
                  </BreadcrumbItem>
                </Fragment>
              ))}
            </BreadcrumbList>
          </Breadcrumb>
        </header>
        <main className="flex-1 overflow-auto p-6">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  )
}
