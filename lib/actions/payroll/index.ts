"use server"

// =============================================
// PAYROLL ACTIONS - INDEX
// Wrapper functions that call modular implementations
// =============================================

import * as workingDays from "./working-days"
import * as payrollRuns from "./payroll-runs"
import * as generatePayrollModule from "./generate-payroll"
import * as recalculateSingleModule from "./recalculate-single"
import * as salaryStructure from "./salary-structure"
import * as adjustments from "./adjustments"
import * as exportModule from "./export"

// Working Days
export async function calculateStandardWorkingDays(month: number, year: number) {
  return workingDays.calculateStandardWorkingDays(month, year)
}

// Payroll Runs
export async function listPayrollRuns() {
  return payrollRuns.listPayrollRuns()
}

export async function getPayrollRun(id: string) {
  return payrollRuns.getPayrollRun(id)
}

export async function getPayrollItems(payroll_run_id: string) {
  return payrollRuns.getPayrollItems(payroll_run_id)
}

export async function getMyPayslips() {
  return payrollRuns.getMyPayslips()
}

export async function sendPayrollForReview(id: string) {
  return payrollRuns.sendPayrollForReview(id)
}

export async function lockPayroll(id: string) {
  return payrollRuns.lockPayroll(id)
}

export async function markPayrollPaid(id: string) {
  return payrollRuns.markPayrollPaid(id)
}

export async function deletePayrollRun(id: string) {
  return payrollRuns.deletePayrollRun(id)
}

// Generate Payroll
export async function generatePayroll(month: number, year: number) {
  return generatePayrollModule.generatePayroll(month, year)
}

export async function refreshPayroll(id: string) {
  return generatePayrollModule.refreshPayroll(id)
}

// Recalculate Single Employee
export async function recalculateSingleEmployee(payroll_item_id: string) {
  return recalculateSingleModule.recalculateSingleEmployee(payroll_item_id)
}

// Salary Structure
export async function listSalaryStructure(employee_id: string) {
  return salaryStructure.listSalaryStructure(employee_id)
}

export async function createSalaryStructure(input: {
  employee_id: string
  base_salary: number
  allowance?: number
  insurance_salary?: number
  effective_date: string
  note?: string
}) {
  return salaryStructure.createSalaryStructure(input)
}

export async function deleteSalaryStructure(id: string) {
  return salaryStructure.deleteSalaryStructure(id)
}

export async function getMySalary() {
  return salaryStructure.getMySalary()
}

// Adjustments
export async function getPayrollAdjustmentDetails(payroll_item_id: string) {
  return adjustments.getPayrollAdjustmentDetails(payroll_item_id)
}

export async function addManualAdjustment(input: {
  payroll_item_id: string
  category: "allowance" | "deduction" | "penalty"
  amount: number
  reason: string
}) {
  return adjustments.addManualAdjustment(input)
}

export async function deleteAdjustmentDetail(id: string) {
  return adjustments.deleteAdjustmentDetail(id)
}

export async function recalculatePayrollItemTotals(payroll_item_id: string) {
  return adjustments.recalculatePayrollItemTotals(payroll_item_id)
}

// Export
export async function getPayrollExportData(payroll_run_id: string, employee_ids?: string[]) {
  return exportModule.getPayrollExportData(payroll_run_id, employee_ids)
}
