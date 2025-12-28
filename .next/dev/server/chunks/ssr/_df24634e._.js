module.exports = [
"[project]/lib/supabase/server.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "createClient",
    ()=>createClient
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$supabase$2b$ssr$40$0$2e$8$2e$0_$40$supabase$2b$supabase$2d$js$40$2$2e$89$2e$0$2f$node_modules$2f40$supabase$2f$ssr$2f$dist$2f$module$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@supabase+ssr@0.8.0_@supabase+supabase-js@2.89.0/node_modules/@supabase/ssr/dist/module/index.js [app-rsc] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$supabase$2b$ssr$40$0$2e$8$2e$0_$40$supabase$2b$supabase$2d$js$40$2$2e$89$2e$0$2f$node_modules$2f40$supabase$2f$ssr$2f$dist$2f$module$2f$createServerClient$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@supabase+ssr@0.8.0_@supabase+supabase-js@2.89.0/node_modules/@supabase/ssr/dist/module/createServerClient.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.10_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/headers.js [app-rsc] (ecmascript)");
;
;
async function createClient() {
    const cookieStore = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["cookies"])();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$supabase$2b$ssr$40$0$2e$8$2e$0_$40$supabase$2b$supabase$2d$js$40$2$2e$89$2e$0$2f$node_modules$2f40$supabase$2f$ssr$2f$dist$2f$module$2f$createServerClient$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createServerClient"])(("TURBOPACK compile-time value", "https://oylpnwofmqhkpckvzrqs.supabase.co"), ("TURBOPACK compile-time value", "sb_publishable_lC5prNOQpmecqW08_S21KQ_XYGB3yIy"), {
        cookies: {
            getAll () {
                return cookieStore.getAll();
            },
            setAll (cookiesToSet) {
                try {
                    cookiesToSet.forEach(({ name, value, options })=>cookieStore.set(name, value, options));
                } catch  {
                // The "setAll" method was called from a Server Component.
                // This can be ignored if you have proxy refreshing user sessions.
                }
            }
        }
    });
}
}),
"[project]/lib/actions/employee-actions.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/* __next_internal_action_entry_do_not_use__ [{"005e20e2e268d812762b030e4aac3b7693066871b6":"getMyRoles","00636a7c2e61bd285b975ea815e7fbbefdffae959f":"getMyEmployee","00b0c7f0352396833a3aa70b738bb3a8c2a485efae":"listEmployees","4072cdebcca1df607d08f62096843ddf91d2cf29f6":"createEmployee","407a7f2085358134fb9b61998dbd9fa880ad52c2cf":"updateMyProfile","409df3c5b25ea33596f872aab0b186da47271a8e80":"getEmployee","60e7529b55507157f11112b5c625757ac226a23a7c":"updateEmployee","701419c868154523741dd2880ac65e97064ceb8620":"changeDepartment","70daddb01ea9f495d095baa024616ddfa6ee94f8dd":"changePosition"},"",""] */ __turbopack_context__.s([
    "changeDepartment",
    ()=>changeDepartment,
    "changePosition",
    ()=>changePosition,
    "createEmployee",
    ()=>createEmployee,
    "getEmployee",
    ()=>getEmployee,
    "getMyEmployee",
    ()=>getMyEmployee,
    "getMyRoles",
    ()=>getMyRoles,
    "listEmployees",
    ()=>listEmployees,
    "updateEmployee",
    ()=>updateEmployee,
    "updateMyProfile",
    ()=>updateMyProfile
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.10_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/build/webpack/loaders/next-flight-loader/server-reference.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/supabase/server.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.10_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/cache.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.10_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-validate.js [app-rsc] (ecmascript)");
;
;
;
async function getMyEmployee() {
    const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createClient"])();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;
    const { data, error } = await supabase.from("employees").select(`
      *,
      department:departments(*),
      position:positions(*),
      manager:employees!manager_id(id, full_name, email)
    `).eq("user_id", user.id).single();
    if (error) {
        console.error("Error fetching employee:", error);
        return null;
    }
    return data;
}
async function getMyRoles() {
    const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createClient"])();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];
    const { data, error } = await supabase.from("user_roles").select(`
      *,
      role:roles(*)
    `).eq("user_id", user.id);
    if (error) {
        console.error("Error fetching roles:", error);
        return [];
    }
    return data || [];
}
async function listEmployees() {
    const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createClient"])();
    const { data, error } = await supabase.from("employees").select(`
      *,
      department:departments(*),
      position:positions(*)
    `).order("created_at", {
        ascending: false
    });
    if (error) {
        console.error("Error listing employees:", error);
        return [];
    }
    return data || [];
}
async function getEmployee(id) {
    const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createClient"])();
    const { data, error } = await supabase.from("employees").select(`
      *,
      department:departments(*),
      position:positions(*),
      manager:employees!manager_id(id, full_name, email)
    `).eq("id", id).single();
    if (error) {
        console.error("Error fetching employee:", error);
        return null;
    }
    return data;
}
async function updateEmployee(id, data) {
    const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createClient"])();
    const { error } = await supabase.from("employees").update({
        ...data,
        updated_at: new Date().toISOString()
    }).eq("id", id);
    if (error) {
        console.error("Error updating employee:", error);
        return {
            success: false,
            error: error.message
        };
    }
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])("/dashboard/employees");
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])(`/dashboard/employees/${id}`);
    return {
        success: true
    };
}
async function updateMyProfile(data) {
    const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createClient"])();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return {
        success: false,
        error: "Not authenticated"
    };
    const { error } = await supabase.from("employees").update({
        ...data,
        updated_at: new Date().toISOString()
    }).eq("user_id", user.id);
    if (error) {
        console.error("Error updating profile:", error);
        return {
            success: false,
            error: error.message
        };
    }
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])("/dashboard/profile");
    return {
        success: true
    };
}
async function createEmployee(data) {
    const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createClient"])();
    // Generate employee code
    const code = `NV${new Date().toISOString().slice(0, 7).replace("-", "")}${Math.floor(Math.random() * 10000).toString().padStart(4, "0")}`;
    const { error } = await supabase.from("employees").insert({
        employee_code: code,
        full_name: data.full_name,
        email: data.email,
        phone: data.phone,
        department_id: data.department_id,
        position_id: data.position_id,
        join_date: data.join_date,
        status: "onboarding"
    });
    if (error) {
        console.error("Error creating employee:", error);
        return {
            success: false,
            error: error.message
        };
    }
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])("/dashboard/employees");
    return {
        success: true
    };
}
async function changeDepartment(employeeId, newDepartmentId, salary) {
    const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createClient"])();
    // Lấy thông tin hiện tại
    const { data: employee } = await supabase.from("employees").select("department_id, position_id").eq("id", employeeId).single();
    if (!employee) return {
        success: false,
        error: "Employee not found"
    };
    const today = new Date().toISOString().split("T")[0];
    // Đóng record lịch sử cũ
    await supabase.from("employee_job_history").update({
        end_date: today
    }).eq("employee_id", employeeId).is("end_date", null);
    // Tạo record lịch sử mới
    await supabase.from("employee_job_history").insert({
        employee_id: employeeId,
        department_id: newDepartmentId,
        position_id: employee.position_id,
        salary: salary || null,
        start_date: today
    });
    // Update employee
    const { error } = await supabase.from("employees").update({
        department_id: newDepartmentId,
        updated_at: new Date().toISOString()
    }).eq("id", employeeId);
    if (error) {
        console.error("Error changing department:", error);
        return {
            success: false,
            error: error.message
        };
    }
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])("/dashboard/employees");
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])(`/dashboard/employees/${employeeId}`);
    return {
        success: true
    };
}
async function changePosition(employeeId, newPositionId, salary) {
    const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createClient"])();
    // Lấy thông tin hiện tại
    const { data: employee } = await supabase.from("employees").select("department_id, position_id").eq("id", employeeId).single();
    if (!employee) return {
        success: false,
        error: "Employee not found"
    };
    const today = new Date().toISOString().split("T")[0];
    // Đóng record lịch sử cũ
    await supabase.from("employee_job_history").update({
        end_date: today
    }).eq("employee_id", employeeId).is("end_date", null);
    // Tạo record lịch sử mới
    await supabase.from("employee_job_history").insert({
        employee_id: employeeId,
        department_id: employee.department_id,
        position_id: newPositionId,
        salary: salary || null,
        start_date: today
    });
    // Update employee
    const { error } = await supabase.from("employees").update({
        position_id: newPositionId,
        updated_at: new Date().toISOString()
    }).eq("id", employeeId);
    if (error) {
        console.error("Error changing position:", error);
        return {
            success: false,
            error: error.message
        };
    }
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])("/dashboard/employees");
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])(`/dashboard/employees/${employeeId}`);
    return {
        success: true
    };
}
;
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ensureServerEntryExports"])([
    getMyEmployee,
    getMyRoles,
    listEmployees,
    getEmployee,
    updateEmployee,
    updateMyProfile,
    createEmployee,
    changeDepartment,
    changePosition
]);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(getMyEmployee, "00636a7c2e61bd285b975ea815e7fbbefdffae959f", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(getMyRoles, "005e20e2e268d812762b030e4aac3b7693066871b6", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(listEmployees, "00b0c7f0352396833a3aa70b738bb3a8c2a485efae", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(getEmployee, "409df3c5b25ea33596f872aab0b186da47271a8e80", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(updateEmployee, "60e7529b55507157f11112b5c625757ac226a23a7c", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(updateMyProfile, "407a7f2085358134fb9b61998dbd9fa880ad52c2cf", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(createEmployee, "4072cdebcca1df607d08f62096843ddf91d2cf29f6", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(changeDepartment, "701419c868154523741dd2880ac65e97064ceb8620", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(changePosition, "70daddb01ea9f495d095baa024616ddfa6ee94f8dd", null);
}),
"[project]/lib/actions/payroll-actions.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/* __next_internal_action_entry_do_not_use__ [{"0027c1e01b93865d4e16c3244c190cf17597c3b79e":"getMyPayslips","00b639924a14db7d0577b90723c619fb29cb3da08b":"getMySalary","00edcd0b8e08912a509842ed084d383437e0528e1c":"listPayrollRuns","402e74e37af9c1c3c31327905012407b40504ecb97":"listSalaryStructure","403793e92e5baa492f2b0f99308903779c0f101b79":"getPayrollRun","403a965c140936f6d06f11d2499e56c3ac24eeaa42":"markPayrollPaid","40412a36516808b7d52f3f9eebce91052552a1b9f1":"getPayrollItems","40518eb5fd5da1dddc47d27c07ef37c3d1370a0081":"createSalaryStructure","40ede0ab5a9b6f1a8f1980612375ce413cfe2ce638":"lockPayroll","40f2270b430b959da8d042c7480dee4f84df06ed44":"deletePayrollRun","60969965aa57ad25a2e7fe770299bcab193808ffbc":"generatePayroll"},"",""] */ __turbopack_context__.s([
    "createSalaryStructure",
    ()=>createSalaryStructure,
    "deletePayrollRun",
    ()=>deletePayrollRun,
    "generatePayroll",
    ()=>generatePayroll,
    "getMyPayslips",
    ()=>getMyPayslips,
    "getMySalary",
    ()=>getMySalary,
    "getPayrollItems",
    ()=>getPayrollItems,
    "getPayrollRun",
    ()=>getPayrollRun,
    "listPayrollRuns",
    ()=>listPayrollRuns,
    "listSalaryStructure",
    ()=>listSalaryStructure,
    "lockPayroll",
    ()=>lockPayroll,
    "markPayrollPaid",
    ()=>markPayrollPaid
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.10_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/build/webpack/loaders/next-flight-loader/server-reference.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/supabase/server.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.10_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/cache.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.10_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-validate.js [app-rsc] (ecmascript)");
;
;
;
const STANDARD_WORKING_DAYS = 26 // Công chuẩn VN
;
async function getMyPayslips() {
    const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createClient"])();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];
    const { data: employee } = await supabase.from("employees").select("id").eq("user_id", user.id).single();
    if (!employee) return [];
    const { data, error } = await supabase.from("payroll_items").select(`
      *,
      payroll_run:payroll_runs(*)
    `).eq("employee_id", employee.id).order("created_at", {
        ascending: false
    });
    if (error) {
        console.error("Error fetching payslips:", error);
        return [];
    }
    return data || [];
}
async function listPayrollRuns() {
    const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createClient"])();
    const { data, error } = await supabase.from("payroll_runs").select("*").order("year", {
        ascending: false
    }).order("month", {
        ascending: false
    });
    if (error) {
        console.error("Error listing payroll runs:", error);
        return [];
    }
    return data || [];
}
async function getPayrollRun(id) {
    const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createClient"])();
    const { data, error } = await supabase.from("payroll_runs").select("*").eq("id", id).single();
    if (error) {
        console.error("Error fetching payroll run:", error);
        return null;
    }
    return data;
}
async function getPayrollItems(payroll_run_id) {
    const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createClient"])();
    const { data, error } = await supabase.from("payroll_items").select(`
      *,
      employee:employees(id, full_name, employee_code, department_id, department:departments(name))
    `).eq("payroll_run_id", payroll_run_id).order("created_at", {
        ascending: true
    });
    if (error) {
        console.error("Error fetching payroll items:", error);
        return [];
    }
    return data || [];
}
async function generatePayroll(month, year) {
    const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createClient"])();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return {
        success: false,
        error: "Chưa đăng nhập"
    };
    // Kiểm tra đã có payroll run chưa
    const { data: existingRun } = await supabase.from("payroll_runs").select("id, status").eq("month", month).eq("year", year).single();
    if (existingRun) {
        if (existingRun.status !== "draft") {
            return {
                success: false,
                error: "Bảng lương tháng này đã khóa, không thể tạo lại"
            };
        }
        // Xóa payroll items cũ để tạo lại
        await supabase.from("payroll_items").delete().eq("payroll_run_id", existingRun.id);
        await supabase.from("payroll_runs").delete().eq("id", existingRun.id);
    }
    // Tạo payroll run mới
    const { data: run, error: runError } = await supabase.from("payroll_runs").insert({
        month,
        year,
        status: "draft",
        created_by: user.id
    }).select().single();
    if (runError) {
        console.error("Error creating payroll run:", runError);
        return {
            success: false,
            error: runError.message
        };
    }
    // Lấy danh sách nhân viên active
    const { data: employees } = await supabase.from("employees").select("id").eq("status", "active");
    if (!employees || employees.length === 0) {
        return {
            success: false,
            error: "Không có nhân viên active"
        };
    }
    // Tính ngày đầu và cuối tháng
    const startDate = `${year}-${String(month).padStart(2, "0")}-01`;
    const endDate = new Date(year, month, 0).toISOString().split("T")[0];
    // Tạo payroll items cho từng nhân viên
    for (const emp of employees){
        // Lấy lương hiệu lực
        const { data: salary } = await supabase.from("salary_structure").select("*").eq("employee_id", emp.id).lte("effective_date", endDate).order("effective_date", {
            ascending: false
        }).limit(1).single();
        const baseSalary = salary?.base_salary || 0;
        const allowance = salary?.allowance || 0;
        // Đếm ngày công (có check_in)
        const { count: workingDaysCount } = await supabase.from("attendance_logs").select("*", {
            count: "exact",
            head: true
        }).eq("employee_id", emp.id).gte("check_in", startDate).lte("check_in", endDate + "T23:59:59");
        // Đếm ngày nghỉ phép (approved)
        const { data: leaveRequests } = await supabase.from("leave_requests").select("from_date, to_date, leave_type").eq("employee_id", emp.id).eq("status", "approved").lte("from_date", endDate).gte("to_date", startDate);
        let leaveDays = 0;
        let unpaidLeaveDays = 0;
        if (leaveRequests) {
            for (const leave of leaveRequests){
                // Tính số ngày nghỉ trong tháng
                const leaveStart = new Date(Math.max(new Date(leave.from_date).getTime(), new Date(startDate).getTime()));
                const leaveEnd = new Date(Math.min(new Date(leave.to_date).getTime(), new Date(endDate).getTime()));
                const days = Math.ceil((leaveEnd.getTime() - leaveStart.getTime()) / (1000 * 60 * 60 * 24)) + 1;
                if (leave.leave_type === "unpaid") {
                    unpaidLeaveDays += days;
                } else {
                    leaveDays += days; // Nghỉ có lương
                }
            }
        }
        const workingDays = workingDaysCount || 0;
        const dailySalary = baseSalary / STANDARD_WORKING_DAYS;
        // Tính lương
        // Gross = (lương ngày * ngày công) + (lương ngày * ngày nghỉ có lương) + phụ cấp
        const grossSalary = dailySalary * workingDays + dailySalary * leaveDays + allowance;
        // Khấu trừ = lương ngày * ngày nghỉ không lương
        const deduction = dailySalary * unpaidLeaveDays;
        // Net = Gross - Khấu trừ
        const netSalary = grossSalary - deduction;
        await supabase.from("payroll_items").insert({
            payroll_run_id: run.id,
            employee_id: emp.id,
            working_days: workingDays,
            leave_days: leaveDays,
            unpaid_leave_days: unpaidLeaveDays,
            base_salary: baseSalary,
            allowances: allowance,
            total_income: grossSalary,
            total_deduction: deduction,
            net_salary: netSalary
        });
    }
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])("/dashboard/payroll");
    return {
        success: true,
        data: run
    };
}
async function lockPayroll(id) {
    const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createClient"])();
    const { error } = await supabase.from("payroll_runs").update({
        status: "locked"
    }).eq("id", id).eq("status", "draft");
    if (error) {
        console.error("Error locking payroll:", error);
        return {
            success: false,
            error: error.message
        };
    }
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])("/dashboard/payroll");
    return {
        success: true
    };
}
async function markPayrollPaid(id) {
    const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createClient"])();
    const { error } = await supabase.from("payroll_runs").update({
        status: "paid"
    }).eq("id", id).eq("status", "locked");
    if (error) {
        console.error("Error marking payroll as paid:", error);
        return {
            success: false,
            error: error.message
        };
    }
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])("/dashboard/payroll");
    return {
        success: true
    };
}
async function deletePayrollRun(id) {
    const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createClient"])();
    // Chỉ xóa được draft
    const { error } = await supabase.from("payroll_runs").delete().eq("id", id).eq("status", "draft");
    if (error) {
        console.error("Error deleting payroll run:", error);
        return {
            success: false,
            error: error.message
        };
    }
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])("/dashboard/payroll");
    return {
        success: true
    };
}
async function listSalaryStructure(employee_id) {
    const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createClient"])();
    const { data, error } = await supabase.from("salary_structure").select("*").eq("employee_id", employee_id).order("effective_date", {
        ascending: false
    });
    if (error) {
        console.error("Error listing salary structure:", error);
        return [];
    }
    return data || [];
}
async function createSalaryStructure(input) {
    const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createClient"])();
    const { error } = await supabase.from("salary_structure").insert({
        employee_id: input.employee_id,
        base_salary: input.base_salary,
        allowance: input.allowance || 0,
        effective_date: input.effective_date,
        note: input.note
    });
    if (error) {
        console.error("Error creating salary structure:", error);
        return {
            success: false,
            error: error.message
        };
    }
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])("/dashboard/employees");
    return {
        success: true
    };
}
async function getMySalary() {
    const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createClient"])();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;
    const { data: employee } = await supabase.from("employees").select("id").eq("user_id", user.id).single();
    if (!employee) return null;
    const { data } = await supabase.from("salary_structure").select("*").eq("employee_id", employee.id).order("effective_date", {
        ascending: false
    }).limit(1).single();
    return data || null;
}
;
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ensureServerEntryExports"])([
    getMyPayslips,
    listPayrollRuns,
    getPayrollRun,
    getPayrollItems,
    generatePayroll,
    lockPayroll,
    markPayrollPaid,
    deletePayrollRun,
    listSalaryStructure,
    createSalaryStructure,
    getMySalary
]);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(getMyPayslips, "0027c1e01b93865d4e16c3244c190cf17597c3b79e", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(listPayrollRuns, "00edcd0b8e08912a509842ed084d383437e0528e1c", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(getPayrollRun, "403793e92e5baa492f2b0f99308903779c0f101b79", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(getPayrollItems, "40412a36516808b7d52f3f9eebce91052552a1b9f1", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(generatePayroll, "60969965aa57ad25a2e7fe770299bcab193808ffbc", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(lockPayroll, "40ede0ab5a9b6f1a8f1980612375ce413cfe2ce638", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(markPayrollPaid, "403a965c140936f6d06f11d2499e56c3ac24eeaa42", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(deletePayrollRun, "40f2270b430b959da8d042c7480dee4f84df06ed44", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(listSalaryStructure, "402e74e37af9c1c3c31327905012407b40504ecb97", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(createSalaryStructure, "40518eb5fd5da1dddc47d27c07ef37c3d1370a0081", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(getMySalary, "00b639924a14db7d0577b90723c619fb29cb3da08b", null);
}),
"[project]/.next-internal/server/app/dashboard/payroll/page/actions.js { ACTIONS_MODULE0 => \"[project]/lib/actions/employee-actions.ts [app-rsc] (ecmascript)\", ACTIONS_MODULE1 => \"[project]/lib/actions/payroll-actions.ts [app-rsc] (ecmascript)\" } [app-rsc] (server actions loader, ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$actions$2f$employee$2d$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/actions/employee-actions.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$actions$2f$payroll$2d$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/actions/payroll-actions.ts [app-rsc] (ecmascript)");
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
}),
"[project]/.next-internal/server/app/dashboard/payroll/page/actions.js { ACTIONS_MODULE0 => \"[project]/lib/actions/employee-actions.ts [app-rsc] (ecmascript)\", ACTIONS_MODULE1 => \"[project]/lib/actions/payroll-actions.ts [app-rsc] (ecmascript)\" } [app-rsc] (server actions loader, ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "0027c1e01b93865d4e16c3244c190cf17597c3b79e",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$actions$2f$payroll$2d$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getMyPayslips"],
    "005e20e2e268d812762b030e4aac3b7693066871b6",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$actions$2f$employee$2d$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getMyRoles"],
    "00636a7c2e61bd285b975ea815e7fbbefdffae959f",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$actions$2f$employee$2d$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getMyEmployee"],
    "00b0c7f0352396833a3aa70b738bb3a8c2a485efae",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$actions$2f$employee$2d$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["listEmployees"],
    "00b639924a14db7d0577b90723c619fb29cb3da08b",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$actions$2f$payroll$2d$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getMySalary"],
    "00edcd0b8e08912a509842ed084d383437e0528e1c",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$actions$2f$payroll$2d$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["listPayrollRuns"],
    "402e74e37af9c1c3c31327905012407b40504ecb97",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$actions$2f$payroll$2d$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["listSalaryStructure"],
    "403793e92e5baa492f2b0f99308903779c0f101b79",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$actions$2f$payroll$2d$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getPayrollRun"],
    "403a965c140936f6d06f11d2499e56c3ac24eeaa42",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$actions$2f$payroll$2d$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["markPayrollPaid"],
    "40412a36516808b7d52f3f9eebce91052552a1b9f1",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$actions$2f$payroll$2d$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getPayrollItems"],
    "40518eb5fd5da1dddc47d27c07ef37c3d1370a0081",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$actions$2f$payroll$2d$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createSalaryStructure"],
    "4072cdebcca1df607d08f62096843ddf91d2cf29f6",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$actions$2f$employee$2d$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createEmployee"],
    "407a7f2085358134fb9b61998dbd9fa880ad52c2cf",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$actions$2f$employee$2d$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["updateMyProfile"],
    "409df3c5b25ea33596f872aab0b186da47271a8e80",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$actions$2f$employee$2d$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getEmployee"],
    "40ede0ab5a9b6f1a8f1980612375ce413cfe2ce638",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$actions$2f$payroll$2d$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["lockPayroll"],
    "40f2270b430b959da8d042c7480dee4f84df06ed44",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$actions$2f$payroll$2d$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["deletePayrollRun"],
    "60969965aa57ad25a2e7fe770299bcab193808ffbc",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$actions$2f$payroll$2d$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["generatePayroll"],
    "60e7529b55507157f11112b5c625757ac226a23a7c",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$actions$2f$employee$2d$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["updateEmployee"],
    "701419c868154523741dd2880ac65e97064ceb8620",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$actions$2f$employee$2d$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["changeDepartment"],
    "70daddb01ea9f495d095baa024616ddfa6ee94f8dd",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$actions$2f$employee$2d$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["changePosition"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f2e$next$2d$internal$2f$server$2f$app$2f$dashboard$2f$payroll$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$lib$2f$actions$2f$employee$2d$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE1__$3d3e$__$225b$project$5d2f$lib$2f$actions$2f$payroll$2d$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i('[project]/.next-internal/server/app/dashboard/payroll/page/actions.js { ACTIONS_MODULE0 => "[project]/lib/actions/employee-actions.ts [app-rsc] (ecmascript)", ACTIONS_MODULE1 => "[project]/lib/actions/payroll-actions.ts [app-rsc] (ecmascript)" } [app-rsc] (server actions loader, ecmascript) <locals>');
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$actions$2f$employee$2d$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/actions/employee-actions.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$actions$2f$payroll$2d$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/actions/payroll-actions.ts [app-rsc] (ecmascript)");
}),
];

//# sourceMappingURL=_df24634e._.js.map