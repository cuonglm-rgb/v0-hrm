import { createClient } from "@/lib/supabase/server"
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
        // Check if employee record exists
        const { data: existingEmployee } = await supabase
          .from("employees")
          .select("id")
          .eq("user_id", user.id)
          .single()

        // Create employee if not exists
        if (!existingEmployee) {
          const fullName = user.user_metadata?.full_name 
            || user.user_metadata?.name 
            || user.email?.split("@")[0] 
            || "User"

          const { error: insertError } = await supabase.from("employees").insert({
            user_id: user.id,
            employee_code: generateEmployeeCode(),
            full_name: fullName,
            email: user.email,
            avatar_url: user.user_metadata?.avatar_url || null,
            status: "onboarding",
          })

          if (insertError) {
            console.error("Error creating employee:", insertError)
          }
        }
      }

      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  // Return the user to an error page with some instructions
  return NextResponse.redirect(`${origin}/auth/error`)
}
