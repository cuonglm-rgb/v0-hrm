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
      manager:employees!manager_id(id, full_name, email),
      shift:work_shifts(*)
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
"[project]/lib/actions/allowance-actions.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/* __next_internal_action_entry_do_not_use__ [{"001da4ff3ab9060c5c5a4f54f47d1b7465c98e9b6a":"listMyTimeRequests","00ca4772e9dfd784dc10257c6422ded9ec85a8ac15":"listPendingTimeRequests","40026f5dcd571f9345e3beb1b8ed785960d3c8e37e":"createAdjustmentType","401c6b975e05df6efb7fd9c6ba1a8737f066f024b7":"listAdjustmentTypes","406b8435b970c02b6dabbc896bf4edefed7f73e26d":"deleteAdjustmentType","40aa85210cb3a78eb40dec4ff594c64933c0f34e9f":"removeEmployeeAdjustment","40aad902d6872d425323cec13eecdc4a144f694a94":"listEmployeeAdjustments","40d25dc24fe3a6b800bb2cd42510c52243942f572c":"createTimeRequest","40e68c341d28de4e27246f892d73094585cd299103":"assignAdjustmentToEmployee","60456f5eb7df605ec22c12adbae3ddd7557b03cd23":"approveTimeRequest","608e72bf0d3e94e2a83591d70f1a9ab2925449acab":"updateAdjustmentType"},"",""] */ __turbopack_context__.s([
    "approveTimeRequest",
    ()=>approveTimeRequest,
    "assignAdjustmentToEmployee",
    ()=>assignAdjustmentToEmployee,
    "createAdjustmentType",
    ()=>createAdjustmentType,
    "createTimeRequest",
    ()=>createTimeRequest,
    "deleteAdjustmentType",
    ()=>deleteAdjustmentType,
    "listAdjustmentTypes",
    ()=>listAdjustmentTypes,
    "listEmployeeAdjustments",
    ()=>listEmployeeAdjustments,
    "listMyTimeRequests",
    ()=>listMyTimeRequests,
    "listPendingTimeRequests",
    ()=>listPendingTimeRequests,
    "removeEmployeeAdjustment",
    ()=>removeEmployeeAdjustment,
    "updateAdjustmentType",
    ()=>updateAdjustmentType
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.10_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/build/webpack/loaders/next-flight-loader/server-reference.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/supabase/server.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.10_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/cache.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.10_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-validate.js [app-rsc] (ecmascript)");
;
;
;
async function listAdjustmentTypes(category) {
    const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createClient"])();
    let query = supabase.from("payroll_adjustment_types").select("*").order("category").order("name");
    if (category) {
        query = query.eq("category", category);
    }
    const { data, error } = await query;
    if (error) {
        if (error.code === "42P01" || error.message?.includes("does not exist")) {
            console.warn("Bảng payroll_adjustment_types chưa tồn tại. Vui lòng chạy script 016-allowance-types.sql");
        } else {
            console.error("Error listing adjustment types:", error.message || error);
        }
        return [];
    }
    return data || [];
}
async function createAdjustmentType(input) {
    const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createClient"])();
    const { error } = await supabase.from("payroll_adjustment_types").insert({
        name: input.name,
        code: input.code || null,
        category: input.category,
        amount: input.amount,
        calculation_type: input.calculation_type,
        is_auto_applied: input.is_auto_applied,
        auto_rules: input.auto_rules || null,
        description: input.description || null,
        is_active: true
    });
    if (error) {
        console.error("Error creating adjustment type:", error);
        return {
            success: false,
            error: error.message
        };
    }
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])("/dashboard/allowances");
    return {
        success: true
    };
}
async function updateAdjustmentType(id, input) {
    const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createClient"])();
    const { error } = await supabase.from("payroll_adjustment_types").update(input).eq("id", id);
    if (error) {
        console.error("Error updating adjustment type:", error);
        return {
            success: false,
            error: error.message
        };
    }
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])("/dashboard/allowances");
    return {
        success: true
    };
}
async function deleteAdjustmentType(id) {
    const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createClient"])();
    // Kiểm tra có nhân viên đang dùng không
    const { count } = await supabase.from("employee_adjustments").select("*", {
        count: "exact",
        head: true
    }).eq("adjustment_type_id", id);
    if (count && count > 0) {
        return {
            success: false,
            error: "Không thể xóa loại điều chỉnh đang được gán cho nhân viên"
        };
    }
    const { error } = await supabase.from("payroll_adjustment_types").delete().eq("id", id);
    if (error) {
        console.error("Error deleting adjustment type:", error);
        return {
            success: false,
            error: error.message
        };
    }
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])("/dashboard/allowances");
    return {
        success: true
    };
}
async function listEmployeeAdjustments(employee_id) {
    const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createClient"])();
    const { data, error } = await supabase.from("employee_adjustments").select(`
      *,
      adjustment_type:payroll_adjustment_types(*)
    `).eq("employee_id", employee_id).order("effective_date", {
        ascending: false
    });
    if (error) {
        console.error("Error listing employee adjustments:", error);
        return [];
    }
    return data || [];
}
async function assignAdjustmentToEmployee(input) {
    const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createClient"])();
    const { error } = await supabase.from("employee_adjustments").insert({
        employee_id: input.employee_id,
        adjustment_type_id: input.adjustment_type_id,
        custom_amount: input.custom_amount || null,
        effective_date: input.effective_date,
        end_date: input.end_date || null,
        note: input.note || null
    });
    if (error) {
        console.error("Error assigning adjustment:", error);
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
async function removeEmployeeAdjustment(id) {
    const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createClient"])();
    const { error } = await supabase.from("employee_adjustments").delete().eq("id", id);
    if (error) {
        console.error("Error removing employee adjustment:", error);
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
async function createTimeRequest(input) {
    const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createClient"])();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return {
        success: false,
        error: "Chưa đăng nhập"
    };
    const { data: employee } = await supabase.from("employees").select("id").eq("user_id", user.id).single();
    if (!employee) return {
        success: false,
        error: "Không tìm thấy nhân viên"
    };
    const { error } = await supabase.from("time_adjustment_requests").insert({
        employee_id: employee.id,
        request_type: input.request_type,
        request_date: input.request_date,
        reason: input.reason || null,
        status: "pending"
    });
    if (error) {
        console.error("Error creating time request:", error);
        return {
            success: false,
            error: error.message
        };
    }
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])("/dashboard/attendance");
    return {
        success: true
    };
}
async function approveTimeRequest(id, status) {
    const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createClient"])();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return {
        success: false,
        error: "Chưa đăng nhập"
    };
    const { data: approver } = await supabase.from("employees").select("id").eq("user_id", user.id).single();
    const { error } = await supabase.from("time_adjustment_requests").update({
        status,
        approver_id: approver?.id,
        approved_at: new Date().toISOString()
    }).eq("id", id);
    if (error) {
        console.error("Error approving time request:", error);
        return {
            success: false,
            error: error.message
        };
    }
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])("/dashboard/leave-approval");
    return {
        success: true
    };
}
async function listMyTimeRequests() {
    const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createClient"])();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];
    const { data: employee } = await supabase.from("employees").select("id").eq("user_id", user.id).single();
    if (!employee) return [];
    const { data, error } = await supabase.from("time_adjustment_requests").select("*").eq("employee_id", employee.id).order("created_at", {
        ascending: false
    });
    if (error) {
        console.error("Error listing time requests:", error);
        return [];
    }
    return data || [];
}
async function listPendingTimeRequests() {
    const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createClient"])();
    const { data, error } = await supabase.from("time_adjustment_requests").select(`
      *,
      employee:employees(id, full_name, employee_code, department:departments(name))
    `).eq("status", "pending").order("created_at", {
        ascending: false
    });
    if (error) {
        console.error("Error listing pending time requests:", error);
        return [];
    }
    return data || [];
}
;
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ensureServerEntryExports"])([
    listAdjustmentTypes,
    createAdjustmentType,
    updateAdjustmentType,
    deleteAdjustmentType,
    listEmployeeAdjustments,
    assignAdjustmentToEmployee,
    removeEmployeeAdjustment,
    createTimeRequest,
    approveTimeRequest,
    listMyTimeRequests,
    listPendingTimeRequests
]);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(listAdjustmentTypes, "401c6b975e05df6efb7fd9c6ba1a8737f066f024b7", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(createAdjustmentType, "40026f5dcd571f9345e3beb1b8ed785960d3c8e37e", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(updateAdjustmentType, "608e72bf0d3e94e2a83591d70f1a9ab2925449acab", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(deleteAdjustmentType, "406b8435b970c02b6dabbc896bf4edefed7f73e26d", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(listEmployeeAdjustments, "40aad902d6872d425323cec13eecdc4a144f694a94", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(assignAdjustmentToEmployee, "40e68c341d28de4e27246f892d73094585cd299103", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(removeEmployeeAdjustment, "40aa85210cb3a78eb40dec4ff594c64933c0f34e9f", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(createTimeRequest, "40d25dc24fe3a6b800bb2cd42510c52243942f572c", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(approveTimeRequest, "60456f5eb7df605ec22c12adbae3ddd7557b03cd23", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(listMyTimeRequests, "001da4ff3ab9060c5c5a4f54f47d1b7465c98e9b6a", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(listPendingTimeRequests, "00ca4772e9dfd784dc10257c6422ded9ec85a8ac15", null);
}),
"[project]/.next-internal/server/app/dashboard/allowances/page/actions.js { ACTIONS_MODULE0 => \"[project]/lib/actions/employee-actions.ts [app-rsc] (ecmascript)\", ACTIONS_MODULE1 => \"[project]/lib/actions/allowance-actions.ts [app-rsc] (ecmascript)\" } [app-rsc] (server actions loader, ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$actions$2f$employee$2d$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/actions/employee-actions.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$actions$2f$allowance$2d$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/actions/allowance-actions.ts [app-rsc] (ecmascript)");
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
;
}),
"[project]/.next-internal/server/app/dashboard/allowances/page/actions.js { ACTIONS_MODULE0 => \"[project]/lib/actions/employee-actions.ts [app-rsc] (ecmascript)\", ACTIONS_MODULE1 => \"[project]/lib/actions/allowance-actions.ts [app-rsc] (ecmascript)\" } [app-rsc] (server actions loader, ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "001da4ff3ab9060c5c5a4f54f47d1b7465c98e9b6a",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$actions$2f$allowance$2d$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["listMyTimeRequests"],
    "005e20e2e268d812762b030e4aac3b7693066871b6",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$actions$2f$employee$2d$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getMyRoles"],
    "00636a7c2e61bd285b975ea815e7fbbefdffae959f",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$actions$2f$employee$2d$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getMyEmployee"],
    "00b0c7f0352396833a3aa70b738bb3a8c2a485efae",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$actions$2f$employee$2d$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["listEmployees"],
    "00ca4772e9dfd784dc10257c6422ded9ec85a8ac15",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$actions$2f$allowance$2d$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["listPendingTimeRequests"],
    "40026f5dcd571f9345e3beb1b8ed785960d3c8e37e",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$actions$2f$allowance$2d$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createAdjustmentType"],
    "401c6b975e05df6efb7fd9c6ba1a8737f066f024b7",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$actions$2f$allowance$2d$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["listAdjustmentTypes"],
    "406b8435b970c02b6dabbc896bf4edefed7f73e26d",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$actions$2f$allowance$2d$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["deleteAdjustmentType"],
    "4072cdebcca1df607d08f62096843ddf91d2cf29f6",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$actions$2f$employee$2d$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createEmployee"],
    "407a7f2085358134fb9b61998dbd9fa880ad52c2cf",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$actions$2f$employee$2d$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["updateMyProfile"],
    "409df3c5b25ea33596f872aab0b186da47271a8e80",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$actions$2f$employee$2d$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getEmployee"],
    "40aa85210cb3a78eb40dec4ff594c64933c0f34e9f",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$actions$2f$allowance$2d$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["removeEmployeeAdjustment"],
    "40aad902d6872d425323cec13eecdc4a144f694a94",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$actions$2f$allowance$2d$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["listEmployeeAdjustments"],
    "40d25dc24fe3a6b800bb2cd42510c52243942f572c",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$actions$2f$allowance$2d$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createTimeRequest"],
    "40e68c341d28de4e27246f892d73094585cd299103",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$actions$2f$allowance$2d$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["assignAdjustmentToEmployee"],
    "60456f5eb7df605ec22c12adbae3ddd7557b03cd23",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$actions$2f$allowance$2d$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["approveTimeRequest"],
    "608e72bf0d3e94e2a83591d70f1a9ab2925449acab",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$actions$2f$allowance$2d$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["updateAdjustmentType"],
    "60e7529b55507157f11112b5c625757ac226a23a7c",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$actions$2f$employee$2d$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["updateEmployee"],
    "701419c868154523741dd2880ac65e97064ceb8620",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$actions$2f$employee$2d$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["changeDepartment"],
    "70daddb01ea9f495d095baa024616ddfa6ee94f8dd",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$actions$2f$employee$2d$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["changePosition"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f2e$next$2d$internal$2f$server$2f$app$2f$dashboard$2f$allowances$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$lib$2f$actions$2f$employee$2d$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE1__$3d3e$__$225b$project$5d2f$lib$2f$actions$2f$allowance$2d$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i('[project]/.next-internal/server/app/dashboard/allowances/page/actions.js { ACTIONS_MODULE0 => "[project]/lib/actions/employee-actions.ts [app-rsc] (ecmascript)", ACTIONS_MODULE1 => "[project]/lib/actions/allowance-actions.ts [app-rsc] (ecmascript)" } [app-rsc] (server actions loader, ecmascript) <locals>');
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$actions$2f$employee$2d$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/actions/employee-actions.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$actions$2f$allowance$2d$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/actions/allowance-actions.ts [app-rsc] (ecmascript)");
}),
];

//# sourceMappingURL=_0a3f6e93._.js.map