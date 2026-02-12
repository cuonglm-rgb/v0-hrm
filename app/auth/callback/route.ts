import { createClient, createServiceClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

// Generate employee code
function generateEmployeeCode() {
  const date = new Date()
  const yyyymm = `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, "0")}`
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, "0")
  return `NV${yyyymm}${random}`
}

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get("code")
  const next = searchParams.get("next") ?? "/dashboard"

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error) {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser()
      
      if (user) {
        console.log("=== AUTH CALLBACK: Processing user ===")
        console.log("User ID:", user.id)
        console.log("User Email:", user.email)

        // Validate email domain
        const email = user.email?.toLowerCase() || ""
        if (!email.endsWith("@pamoteam.com")) {
          console.log("❌ UNAUTHORIZED: Email domain not allowed:", email)
          
          // Delete the user from Supabase Auth using service client
          const serviceClient = createServiceClient()
          const { error: deleteError } = await serviceClient.auth.admin.deleteUser(user.id)
          
          if (deleteError) {
            console.error("❌ ERROR deleting unauthorized user:", deleteError)
          } else {
            console.log("✅ Deleted unauthorized user from auth")
          }
          
          // Sign out the current session
          await supabase.auth.signOut()
          
          // Redirect to error page with message
          return NextResponse.redirect(`${origin}/auth/error?message=unauthorized_domain`)
        }
        console.log("✅ AUTHORIZED: Email domain verified")

        // Use service client to bypass RLS for employee lookup/linking
        const serviceClient = createServiceClient()

        // 1. Check if employee already linked to this user
        const { data: linkedEmployee } = await serviceClient
          .from("employees")
          .select("id, employee_code, full_name, email")
          .eq("user_id", user.id)
          .single()

        if (linkedEmployee) {
          console.log("✅ EXISTING LINKED: Employee already linked to this user")
          console.log("   Employee ID:", linkedEmployee.id)
          console.log("   Employee Code:", linkedEmployee.employee_code)
          console.log("   Full Name:", linkedEmployee.full_name)
          console.log("   Email:", linkedEmployee.email)
        } else {
          // Debug: Check ALL employees with this email
          const { data: allWithEmail, error: debugError } = await serviceClient
            .from("employees")
            .select("id, employee_code, full_name, email, user_id")
            .ilike("email", user.email || "")

          console.log("🔍 DEBUG: All employees with email", user.email)
          console.log("   Results:", allWithEmail)
          console.log("   Error:", debugError)

          // 2. Check if pre-imported employee exists with same email (not yet linked)
          const { data: preImportedEmployee, error: searchError } = await serviceClient
            .from("employees")
            .select("id, employee_code, full_name, email")
            .ilike("email", user.email || "")
            .is("user_id", null)
            .single()

          console.log("🔍 SEARCH: Looking for pre-imported employee with email:", user.email)
          console.log("   Search result:", preImportedEmployee)
          console.log("   Search error:", searchError)

          if (preImportedEmployee) {
            console.log("🔗 PRE-IMPORTED FOUND: Linking existing employee to user")
            console.log("   Employee ID:", preImportedEmployee.id)
            console.log("   Employee Code:", preImportedEmployee.employee_code)
            console.log("   Full Name:", preImportedEmployee.full_name)
            console.log("   Email:", preImportedEmployee.email)

            // Link existing pre-imported employee to this user
            const { error: updateError } = await serviceClient
              .from("employees")
              .update({
                user_id: user.id,
                avatar_url: user.user_metadata?.avatar_url || null,
                updated_at: new Date().toISOString(),
              })
              .eq("id", preImportedEmployee.id)

            if (updateError) {
              console.error("❌ ERROR linking pre-imported employee:", updateError)
            } else {
              console.log("✅ SUCCESS: Linked pre-imported employee to user")
            }
          } else {
            // 3. No existing employee found - create new one
            console.log("🆕 NEW EMPLOYEE: No existing employee found, creating new one")
            
            const fullName = user.user_metadata?.full_name 
              || user.user_metadata?.name 
              || user.email?.split("@")[0] 
              || "User"
            const newEmployeeCode = generateEmployeeCode()

            console.log("   New Employee Code:", newEmployeeCode)
            console.log("   Full Name:", fullName)
            console.log("   Email:", user.email)

            const { error: insertError } = await serviceClient.from("employees").insert({
              user_id: user.id,
              employee_code: newEmployeeCode,
              full_name: fullName,
              email: user.email,
              avatar_url: user.user_metadata?.avatar_url || null,
              status: "onboarding",
            })

            if (insertError) {
              console.error("❌ ERROR creating employee:", insertError)
            } else {
              console.log("✅ SUCCESS: Created new employee")
            }
          }
        }
        console.log("=== AUTH CALLBACK: Complete ===")
      }

      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  // Return the user to an error page with some instructions
  return NextResponse.redirect(`${origin}/auth/error`)
}
