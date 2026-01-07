"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { LayoutDashboard, Users, Building2, UserCircle, Settings, LogOut, Clock, CalendarDays, CheckSquare, Wallet, Receipt, FileSpreadsheet, Coins } from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import type { EmployeeWithRelations, UserRoleWithRelations } from "@/lib/types/database"

interface NavItem {
  title: string
  url: string
  icon: any
  roles?: string[]
  checkApproverLevel?: boolean // Kiểm tra level chức vụ có quyền duyệt phiếu
}

const mainNavItems: NavItem[] = [
  {
    title: "Tổng quan",
    url: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Chấm công",
    url: "/dashboard/attendance",
    icon: Clock,
  },
  {
    title: "Tạo phiếu phép",
    url: "/dashboard/leave",
    icon: CalendarDays,
  },
  {
    title: "Phiếu lương",
    url: "/dashboard/payslip",
    icon: Receipt,
  },
  {
    title: "Duyệt phiếu phép",
    url: "/dashboard/leave-approval",
    icon: CheckSquare,
    checkApproverLevel: true, // Kiểm tra level thay vì roles
  },
  {
    title: "Quản lý chấm công",
    url: "/dashboard/attendance-management",
    icon: FileSpreadsheet,
    roles: ["hr", "admin"],
  },
  {
    title: "Bảng lương",
    url: "/dashboard/payroll",
    icon: Wallet,
    roles: ["hr", "admin"],
  },
  {
    title: "Phụ cấp",
    url: "/dashboard/allowances",
    icon: Coins,
    roles: ["hr", "admin"],
  },
  {
    title: "Nhân viên",
    url: "/dashboard/employees",
    icon: Users,
    roles: ["hr", "admin", "manager"],
  },
  {
    title: "Phòng ban",
    url: "/dashboard/departments",
    icon: Building2,
  },
  {
    title: "Hồ sơ cá nhân",
    url: "/dashboard/profile",
    icon: UserCircle,
  },
]

interface AppSidebarProps {
  employee: EmployeeWithRelations | null
  userRoles: UserRoleWithRelations[]
  canApproveRequests?: boolean // Có quyền duyệt phiếu dựa trên level
}

export function AppSidebar({ employee, userRoles, canApproveRequests }: AppSidebarProps) {
  const pathname = usePathname()
  const router = useRouter()

  const roleCodes = userRoles.map((ur) => ur.role.code)
  const isHROrAdmin = roleCodes.includes("hr") || roleCodes.includes("admin")

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/login")
    router.refresh()
  }

  const initials =
    employee?.full_name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || "U"

  const filteredNavItems = mainNavItems.filter((item) => {
    // Kiểm tra quyền duyệt phiếu dựa trên level
    if (item.checkApproverLevel) {
      return canApproveRequests || isHROrAdmin
    }
    // Kiểm tra roles
    if (item.roles) {
      return item.roles.some((role) => roleCodes.includes(role as any))
    }
    return true
  })

  return (
    <Sidebar>
      <SidebarHeader className="border-b border-sidebar-border">
        <div className="flex items-center gap-3 px-2 py-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600">
            <Users className="h-5 w-5 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-sidebar-foreground">HRM System</span>
            <span className="text-xs text-sidebar-foreground/60">Phase 3</span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {filteredNavItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={pathname === item.url || pathname.startsWith(item.url + "/")}>
                    <Link href={item.url}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {isHROrAdmin && (
          <SidebarGroup>
            <SidebarGroupLabel>Quản trị</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild isActive={pathname === "/dashboard/settings"}>
                    <Link href="/dashboard/settings">
                      <Settings className="h-4 w-4" />
                      <span>Cài đặt</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border">
        <div className="flex items-center gap-3 px-4 py-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src={employee?.avatar_url || ""} alt={employee?.full_name || ""} />
            <AvatarFallback className="bg-indigo-100 text-indigo-600 text-sm">{initials}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col flex-1 min-w-0">
            <span className="text-sm font-medium text-sidebar-foreground truncate">
              {employee?.full_name || "User"}
            </span>
            <span className="text-xs text-sidebar-foreground/60 truncate">{employee?.email}</span>
          </div>
        </div>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={handleLogout}>
              <LogOut className="h-4 w-4" />
              <span>Đăng xuất</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}
