import { NewsWidget } from "@/components/dashboard/widgets/news-widget"
import { WorkScheduleWidget } from "@/components/dashboard/widgets/work-schedule-widget"
import { EventsCalendarWidget } from "@/components/dashboard/widgets/events-calendar-widget"
import { BirthdaysWidget } from "@/components/dashboard/widgets/birthdays-widget"
import { SeniorityWidget } from "@/components/dashboard/widgets/seniority-widget"
import { MyLeaveWidget } from "@/components/dashboard/widgets/my-leave-widget"
import { MyRequestsWidget, type RequestLite } from "@/components/dashboard/widgets/my-requests-widget"
import { cn } from "@/lib/utils"
import type { CompanyNewsWithRelations } from "@/lib/types/database"
import type {
  WorkScheduleSummary,
  CalendarEvent,
  BirthdayItem,
  SeniorityData,
  MyLeaveBalance,
} from "@/lib/actions/dashboard-actions"

export interface DashboardHomeProps {
  news: CompanyNewsWithRelations[]
  showWorkSchedule: boolean
  schedule: {
    initialSummary: WorkScheduleSummary
    today: string
    tomorrow: string
    weekStart: string
    weekEnd: string
  }
  calendar: { year: number; month: number; events: CalendarEvent[] }
  birthdays: BirthdayItem[]
  seniority: SeniorityData
  leave: MyLeaveBalance
  requests: { list: RequestLite[]; year: number; month: number }
}

export function DashboardHome({
  news,
  showWorkSchedule,
  schedule,
  calendar,
  birthdays,
  seniority,
  leave,
  requests,
}: DashboardHomeProps) {
  return (
    <div className="space-y-4">
      <div className={cn("grid grid-cols-1 gap-4", showWorkSchedule && "lg:grid-cols-2")}>
        <NewsWidget news={news} />
        {showWorkSchedule && (
          <WorkScheduleWidget
            initialSummary={schedule.initialSummary}
            today={schedule.today}
            tomorrow={schedule.tomorrow}
            weekStart={schedule.weekStart}
            weekEnd={schedule.weekEnd}
          />
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <BirthdaysWidget items={birthdays} />
        <SeniorityWidget data={seniority} />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <MyLeaveWidget initial={leave} />
        <MyRequestsWidget requests={requests.list} initialYear={requests.year} initialMonth={requests.month} />
      </div>

      <EventsCalendarWidget
        initialYear={calendar.year}
        initialMonth={calendar.month}
        initialEvents={calendar.events}
      />
    </div>
  )
}
