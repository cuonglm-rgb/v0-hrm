"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { getNowVN, getTodayVN } from "@/lib/utils/date-utils"

interface ImportEmployeeRow {
  employee_code?: string
  full_name: string
  email: string
  phone?: string
  department_name?: string
  position_name?: string
  join_date?: string | number
  official_date?: string | number
  base_salary?: number | string
  shift_name?: string
}

interface ImportResult {
  success: boolean
  total: number
  imported: number
  skipped: number
  errors: string[]
  salaryCreated?: number
  salaryUpdated?: number
}

// Parse date from various formats (DD/MM/YYYY, D/M/YYYY, YYYY-MM-DD, Excel serial number)
function parseDate(dateStr: string | number | undefined): string | null {
  if (dateStr == null) return null
  
  // Handle Excel serial date number
  if (typeof dateStr === "number") {
    // Excel serial date: days since 1900-01-01 (with Excel's leap year bug)
    const excelEpoch = new Date(1899, 11, 30) // Dec 30, 1899
    const date = new Date(excelEpoch.getTime() + dateStr * 24 * 60 * 60 * 1000)
    return date.toISOString().split("T")[0]
  }
  
  const str = String(dateStr).trim()
  if (!str) return null

  // Try DD/MM/YYYY or D/M/YYYY format
  const dmyMatch = str.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/)
  if (dmyMatch) {
    const [, day, month, year] = dmyMatch
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
  }

  // Try YYYY-MM-DD format
  const ymdMatch = str.match(/^(\d{4})-(\d{2})-(\d{2})$/)
  if (ymdMatch) {
    return str
  }

  return null
}

export async function importEmployees(rows: ImportEmployeeRow[]): Promise<ImportResult> {
  const supabase = await createClient()
  
  const result: ImportResult = {
    success: true,
    total: rows.length,
    imported: 0,
    skipped: 0,
    errors: [],
    salaryCreated: 0,
    salaryUpdated: 0
  }

  // Fetch departments, positions, shifts for mapping
  const [{ data: departments }, { data: positions }, { data: shifts }] = await Promise.all([
    supabase.from("departments").select("id, name, code"),
    supabase.from("positions").select("id, name"),
    supabase.from("work_shifts").select("id, name")
  ])

  // Create maps for department lookup (by both name and code)
  const deptByNameMap = new Map(departments?.map(d => [d.name.toLowerCase(), d.id]) || [])
  const deptByCodeMap = new Map(departments?.filter(d => d.code).map(d => [d.code!.toLowerCase(), d.id]) || [])
  const posMap = new Map(positions?.map(p => [p.name.toLowerCase(), p.id]) || [])
  const shiftMap = new Map(shifts?.map(s => [s.name.toLowerCase(), s.id]) || [])

  // Helper function to find department ID by name or code
  const findDepartmentId = (deptName: string): string | null => {
    if (!deptName) return null
    const normalized = deptName.toLowerCase().trim()
    // Try to find by code first (exact match)
    const byCode = deptByCodeMap.get(normalized)
    if (byCode) return byCode
    // Then try by name (exact match)
    const byName = deptByNameMap.get(normalized)
    if (byName) return byName
    // Try partial match on name (e.g., "Support" matches "Phòng Support")
    for (const [name, id] of deptByNameMap.entries()) {
      if (name.includes(normalized) || normalized.includes(name)) {
        return id
      }
    }
    return null
  }

  // Get existing employees to check duplicates and update
  const { data: existingEmployees } = await supabase
    .from("employees")
    .select("id, email, employee_code")
  
  const existingEmailMap = new Map(existingEmployees?.map(e => [e.email.toLowerCase(), e.id]) || [])
  const existingCodes = new Set(existingEmployees?.map(e => e.employee_code).filter(Boolean) || [])

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i]
    const rowNum = i + 2 // Excel row number (1-indexed + header)

    // Normalize values - Excel may return numbers for some fields
    const fullName = row.full_name != null ? String(row.full_name).trim() : ""
    const emailRaw = row.email != null ? String(row.email).trim() : ""
    const phone = row.phone != null ? String(row.phone).trim() : ""
    const departmentName = row.department_name != null ? String(row.department_name).trim() : ""
    const positionName = row.position_name != null ? String(row.position_name).trim() : ""
    const shiftName = row.shift_name != null ? String(row.shift_name).trim() : ""
    // Parse dates - keep original value for Excel serial number support
    const joinDate = parseDate(row.join_date)
    const officialDate = parseDate(row.official_date)
    // Parse salary - handle formats like "5000000", "5,000,000", "5.000.000"
    const baseSalaryRaw = row.base_salary != null ? String(row.base_salary).trim() : ""
    let baseSalary = 0
    if (typeof row.base_salary === "number") {
      baseSalary = row.base_salary
    } else if (baseSalaryRaw) {
      // Remove all commas, dots, and spaces then parse
      const cleanedSalary = baseSalaryRaw.replace(/[,.\s]/g, "")
      baseSalary = parseFloat(cleanedSalary) || 0
    }

    // Validate required fields
    if (!fullName) {
      result.errors.push(`Dòng ${rowNum}: Thiếu họ tên`)
      result.skipped++
      continue
    }

    if (!emailRaw) {
      result.errors.push(`Dòng ${rowNum}: Thiếu email`)
      result.skipped++
      continue
    }

    const email = emailRaw.toLowerCase()

    // Check if employee already exists - update instead of skip
    const existingEmployeeId = existingEmailMap.get(email)
    if (existingEmployeeId) {
      // Update existing employee
      const updateData: Record<string, unknown> = {}
      
      // Map department (try both name and code)
      if (departmentName) {
        const deptId = findDepartmentId(departmentName)
        if (deptId) updateData.department_id = deptId
      }
      
      // Map position
      if (positionName) {
        const posId = posMap.get(positionName.toLowerCase())
        if (posId) updateData.position_id = posId
      }
      
      // Map shift
      if (shiftName) {
        const shiftId = shiftMap.get(shiftName.toLowerCase())
        if (shiftId) updateData.shift_id = shiftId
      }
      
      if (joinDate) updateData.join_date = joinDate
      if (officialDate) {
        updateData.official_date = officialDate
        updateData.status = "active"
      }
      if (phone) updateData.phone = phone
      
      // Update employee if there's data to update
      if (Object.keys(updateData).length > 0) {
        await supabase
          .from("employees")
          .update(updateData)
          .eq("id", existingEmployeeId)
      }
      
      // Create/update salary for existing employee
      if (baseSalary && baseSalary > 0) {
        const effectiveDate = officialDate || joinDate || getTodayVN()
        
        // Check if salary already exists for this date
        const { data: existingSalary } = await supabase
          .from("salary_structure")
          .select("id")
          .eq("employee_id", existingEmployeeId)
          .eq("effective_date", effectiveDate)
          .single()
        
        if (existingSalary) {
          // Update existing salary
          const { error: updateError } = await supabase
            .from("salary_structure")
            .update({
              base_salary: baseSalary,
              note: "Cập nhật từ import"
            })
            .eq("id", existingSalary.id)
          
          if (updateError) {
            result.errors.push(`Dòng ${rowNum}: Lỗi cập nhật lương - ${updateError.message}`)
          } else {
            result.salaryUpdated = (result.salaryUpdated || 0) + 1
          }
        } else {
          // Insert new salary
          const { error: insertError } = await supabase.from("salary_structure").insert({
            employee_id: existingEmployeeId,
            base_salary: baseSalary,
            allowance: 0,
            effective_date: effectiveDate,
            note: "Import từ file"
          })
          
          if (insertError) {
            result.errors.push(`Dòng ${rowNum}: Lỗi tạo lương - ${insertError.message}`)
          } else {
            result.salaryCreated = (result.salaryCreated || 0) + 1
          }
        }
      }
      
      result.imported++
      continue
    }

    // Generate or validate employee code for new employee
    let employeeCode = row.employee_code != null ? String(row.employee_code).trim() : ""
    if (employeeCode) {
      if (existingCodes.has(employeeCode)) {
        result.errors.push(`Dòng ${rowNum}: Mã nhân viên ${employeeCode} đã tồn tại`)
        result.skipped++
        continue
      }
    } else {
      // Auto generate code
      employeeCode = `NV${getNowVN().slice(0, 7).replace("-", "")}${Math.floor(Math.random() * 10000).toString().padStart(4, "0")}`
    }

    // Map department (try both name and code)
    const departmentId = departmentName 
      ? findDepartmentId(departmentName)
      : null

    // Map position
    const positionId = positionName
      ? posMap.get(positionName.toLowerCase()) || null
      : null

    // Map shift
    const shiftId = shiftName
      ? shiftMap.get(shiftName.toLowerCase()) || null
      : null

    // Insert employee
    const { data: newEmployee, error: empError } = await supabase
      .from("employees")
      .insert({
        employee_code: employeeCode,
        full_name: fullName,
        email: email,
        phone: phone || null,
        department_id: departmentId,
        position_id: positionId,
        shift_id: shiftId,
        join_date: joinDate,
        official_date: officialDate,
        status: officialDate ? "active" : "onboarding"
      })
      .select("id")
      .single()

    if (empError) {
      result.errors.push(`Dòng ${rowNum}: ${empError.message}`)
      result.skipped++
      continue
    }

    // Create salary structure if base_salary provided
    if (baseSalary && baseSalary > 0 && newEmployee) {
      const effectiveDate = officialDate || joinDate || getTodayVN()
      
      const { error: salaryError } = await supabase.from("salary_structure").insert({
        employee_id: newEmployee.id,
        base_salary: baseSalary,
        allowance: 0,
        effective_date: effectiveDate,
        note: "Import từ file"
      })
      
      if (salaryError) {
        result.errors.push(`Dòng ${rowNum}: Lỗi tạo lương - ${salaryError.message}`)
      } else {
        result.salaryCreated = (result.salaryCreated || 0) + 1
      }
    }

    existingEmailMap.set(email, newEmployee.id)
    existingCodes.add(employeeCode)
    result.imported++
  }

  if (result.errors.length > 0) {
    result.success = result.imported > 0
  }

  revalidatePath("/dashboard/employees")
  return result
}
