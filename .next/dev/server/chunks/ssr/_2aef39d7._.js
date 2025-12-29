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
"[project]/lib/actions/payroll-actions.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/* __next_internal_action_entry_do_not_use__ [{"0027c1e01b93865d4e16c3244c190cf17597c3b79e":"getMyPayslips","00b639924a14db7d0577b90723c619fb29cb3da08b":"getMySalary","00edcd0b8e08912a509842ed084d383437e0528e1c":"listPayrollRuns","402e74e37af9c1c3c31327905012407b40504ecb97":"listSalaryStructure","403793e92e5baa492f2b0f99308903779c0f101b79":"getPayrollRun","403a965c140936f6d06f11d2499e56c3ac24eeaa42":"markPayrollPaid","40412a36516808b7d52f3f9eebce91052552a1b9f1":"getPayrollItems","40518eb5fd5da1dddc47d27c07ef37c3d1370a0081":"createSalaryStructure","40760250a0f0276425dcf05a519fbffe7aee716735":"getPayrollAdjustmentDetails","40ede0ab5a9b6f1a8f1980612375ce413cfe2ce638":"lockPayroll","40f2270b430b959da8d042c7480dee4f84df06ed44":"deletePayrollRun","60969965aa57ad25a2e7fe770299bcab193808ffbc":"generatePayroll"},"",""] */ __turbopack_context__.s([
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
    "getPayrollAdjustmentDetails",
    ()=>getPayrollAdjustmentDetails,
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
async function getEmployeeViolations(supabase, employeeId, startDate, endDate, shiftStartTime) {
    const violations = [];
    // Lấy attendance logs
    const { data: logs } = await supabase.from("attendance_logs").select("check_in, check_out").eq("employee_id", employeeId).gte("check_in", startDate).lte("check_in", endDate + "T23:59:59");
    // Lấy time adjustment requests đã approved
    const { data: approvedRequests } = await supabase.from("time_adjustment_requests").select("request_date").eq("employee_id", employeeId).eq("status", "approved").gte("request_date", startDate).lte("request_date", endDate);
    const approvedDates = new Set((approvedRequests || []).map((r)=>r.request_date));
    if (logs) {
        const [shiftH, shiftM] = shiftStartTime.split(":").map(Number);
        const shiftMinutes = shiftH * 60 + shiftM;
        for (const log of logs){
            if (!log.check_in) continue;
            const checkInDate = new Date(log.check_in);
            const dateStr = checkInDate.toISOString().split("T")[0];
            const checkInHour = checkInDate.getHours();
            const checkInMin = checkInDate.getMinutes();
            const checkInMinutes = checkInHour * 60 + checkInMin;
            const lateMinutes = Math.max(0, checkInMinutes - shiftMinutes);
            violations.push({
                date: dateStr,
                lateMinutes,
                earlyMinutes: 0,
                hasApprovedRequest: approvedDates.has(dateStr)
            });
        }
    }
    return violations;
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
        // Xóa payroll items và adjustment details cũ
        await supabase.from("payroll_adjustment_details").delete().in("payroll_item_id", (await supabase.from("payroll_items").select("id").eq("payroll_run_id", existingRun.id)).data?.map((i)=>i.id) || []);
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
    // Lấy danh sách nhân viên active hoặc onboarding
    const { data: employees, error: empError } = await supabase.from("employees").select("id, full_name, employee_code, shift_id").in("status", [
        "active",
        "onboarding"
    ]);
    if (empError || !employees || employees.length === 0) {
        return {
            success: false,
            error: "Không có nhân viên. Vui lòng kiểm tra trạng thái nhân viên."
        };
    }
    // Lấy các loại điều chỉnh active
    const { data: adjustmentTypes } = await supabase.from("payroll_adjustment_types").select("*").eq("is_active", true);
    // Lấy work shifts
    const { data: shifts } = await supabase.from("work_shifts").select("*");
    const shiftMap = new Map((shifts || []).map((s)=>[
            s.id,
            s
        ]));
    // Tính ngày đầu và cuối tháng
    const startDate = `${year}-${String(month).padStart(2, "0")}-01`;
    const endDate = new Date(year, month, 0).toISOString().split("T")[0];
    let processedCount = 0;
    for (const emp of employees){
        // Lấy lương hiệu lực
        const { data: salary } = await supabase.from("salary_structure").select("*").eq("employee_id", emp.id).lte("effective_date", endDate).order("effective_date", {
            ascending: false
        }).limit(1).maybeSingle();
        const baseSalary = salary?.base_salary || 0;
        const salaryAllowance = salary?.allowance || 0;
        const dailySalary = baseSalary / STANDARD_WORKING_DAYS;
        // Đếm ngày công
        const { count: workingDaysCount } = await supabase.from("attendance_logs").select("*", {
            count: "exact",
            head: true
        }).eq("employee_id", emp.id).gte("check_in", startDate).lte("check_in", endDate + "T23:59:59");
        // Đếm ngày nghỉ phép
        const { data: leaveRequests } = await supabase.from("leave_requests").select("from_date, to_date, leave_type").eq("employee_id", emp.id).eq("status", "approved").lte("from_date", endDate).gte("to_date", startDate);
        let leaveDays = 0;
        let unpaidLeaveDays = 0;
        if (leaveRequests) {
            for (const leave of leaveRequests){
                const leaveStart = new Date(Math.max(new Date(leave.from_date).getTime(), new Date(startDate).getTime()));
                const leaveEnd = new Date(Math.min(new Date(leave.to_date).getTime(), new Date(endDate).getTime()));
                const days = Math.ceil((leaveEnd.getTime() - leaveStart.getTime()) / (1000 * 60 * 60 * 24)) + 1;
                if (leave.leave_type === "unpaid") {
                    unpaidLeaveDays += days;
                } else {
                    leaveDays += days;
                }
            }
        }
        const workingDays = workingDaysCount || 0;
        // Lấy shift của nhân viên
        const shift = emp.shift_id ? shiftMap.get(emp.shift_id) : null;
        const shiftStartTime = shift?.start_time?.slice(0, 5) || "08:00";
        // Lấy vi phạm chấm công
        const violations = await getEmployeeViolations(supabase, emp.id, startDate, endDate, shiftStartTime);
        const lateCount = violations.filter((v)=>v.lateMinutes > 0).length;
        // Lấy các điều chỉnh được gán cho nhân viên
        const { data: empAdjustments } = await supabase.from("employee_adjustments").select("*, adjustment_type:payroll_adjustment_types(*)").eq("employee_id", emp.id).lte("effective_date", endDate).or(`end_date.is.null,end_date.gte.${startDate}`);
        // =============================================
        // TÍNH TOÁN PHỤ CẤP, KHẤU TRỪ, PHẠT
        // =============================================
        let totalAllowances = salaryAllowance // Phụ cấp từ salary structure
        ;
        let totalDeductions = 0;
        let totalPenalties = 0;
        const adjustmentDetails = [];
        // Xử lý các loại điều chỉnh tự động
        if (adjustmentTypes) {
            for (const adjType of adjustmentTypes){
                if (!adjType.is_auto_applied) continue;
                const rules = adjType.auto_rules;
                if (!rules) continue;
                if (adjType.category === "allowance") {
                    // Phụ cấp ăn trưa - tính theo ngày công
                    if (adjType.calculation_type === "daily") {
                        let eligibleDays = workingDays;
                        // Trừ ngày nghỉ
                        if (rules.deduct_on_absent) {
                            eligibleDays -= unpaidLeaveDays;
                        }
                        // Trừ nếu đi muộn quá số lần cho phép
                        if (rules.deduct_on_late && rules.late_grace_count !== undefined) {
                            const excessLateDays = Math.max(0, lateCount - rules.late_grace_count);
                            eligibleDays -= excessLateDays;
                        }
                        eligibleDays = Math.max(0, eligibleDays);
                        const amount = eligibleDays * adjType.amount;
                        if (amount > 0) {
                            totalAllowances += amount;
                            adjustmentDetails.push({
                                adjustment_type_id: adjType.id,
                                category: "allowance",
                                base_amount: workingDays * adjType.amount,
                                adjusted_amount: (workingDays - eligibleDays) * adjType.amount,
                                final_amount: amount,
                                reason: `${eligibleDays} ngày x ${adjType.amount.toLocaleString()}đ`,
                                occurrence_count: eligibleDays
                            });
                        }
                    }
                    // Phụ cấp chuyên cần - mất toàn bộ nếu vi phạm
                    if (adjType.calculation_type === "fixed" && rules.full_deduct_threshold !== undefined) {
                        const shouldDeduct = lateCount > rules.full_deduct_threshold || unpaidLeaveDays > 0;
                        if (!shouldDeduct) {
                            totalAllowances += adjType.amount;
                            adjustmentDetails.push({
                                adjustment_type_id: adjType.id,
                                category: "allowance",
                                base_amount: adjType.amount,
                                adjusted_amount: 0,
                                final_amount: adjType.amount,
                                reason: "Đủ điều kiện chuyên cần",
                                occurrence_count: 1
                            });
                        } else {
                            adjustmentDetails.push({
                                adjustment_type_id: adjType.id,
                                category: "allowance",
                                base_amount: adjType.amount,
                                adjusted_amount: adjType.amount,
                                final_amount: 0,
                                reason: `Mất phụ cấp: đi muộn ${lateCount} lần, nghỉ không phép ${unpaidLeaveDays} ngày`,
                                occurrence_count: 0
                            });
                        }
                    }
                }
                // Phạt đi muộn - đọc threshold từ auto_rules
                if (adjType.category === "penalty" && rules.trigger === "late") {
                    const thresholdMinutes = rules.late_threshold_minutes || 30;
                    const exemptWithRequest = rules.exempt_with_request !== false // Mặc định là true
                    ;
                    // Lọc các ngày vi phạm theo threshold từ database
                    const penaltyDays = violations.filter((v)=>{
                        if (v.lateMinutes <= thresholdMinutes) return false;
                        if (exemptWithRequest && v.hasApprovedRequest) return false;
                        return true;
                    });
                    for (const v of penaltyDays){
                        let penaltyAmount = 0;
                        if (rules.penalty_type === "half_day_salary") {
                            penaltyAmount = dailySalary / 2;
                        } else if (rules.penalty_type === "full_day_salary") {
                            penaltyAmount = dailySalary;
                        } else if (rules.penalty_type === "fixed_amount") {
                            penaltyAmount = adjType.amount;
                        }
                        totalPenalties += penaltyAmount;
                        adjustmentDetails.push({
                            adjustment_type_id: adjType.id,
                            category: "penalty",
                            base_amount: penaltyAmount,
                            adjusted_amount: 0,
                            final_amount: penaltyAmount,
                            reason: `Đi muộn ${v.lateMinutes} phút ngày ${v.date}`,
                            occurrence_count: 1
                        });
                    }
                }
            }
        }
        // Xử lý các điều chỉnh được gán thủ công cho nhân viên
        if (empAdjustments) {
            for (const empAdj of empAdjustments){
                const adjType = empAdj.adjustment_type;
                if (!adjType || adjType.is_auto_applied) continue; // Bỏ qua auto-applied (đã xử lý ở trên)
                const amount = empAdj.custom_amount || adjType.amount;
                if (adjType.category === "allowance") {
                    totalAllowances += amount;
                } else if (adjType.category === "deduction") {
                    // Tính BHXH theo % lương cơ bản
                    let finalAmount = amount;
                    if (adjType.auto_rules?.calculate_from === "base_salary" && adjType.auto_rules?.percentage) {
                        finalAmount = baseSalary * adjType.auto_rules.percentage / 100;
                    }
                    totalDeductions += finalAmount;
                    adjustmentDetails.push({
                        adjustment_type_id: adjType.id,
                        category: "deduction",
                        base_amount: amount,
                        adjusted_amount: 0,
                        final_amount: finalAmount,
                        reason: adjType.name,
                        occurrence_count: 1
                    });
                } else if (adjType.category === "penalty") {
                    totalPenalties += amount;
                }
            }
        }
        // =============================================
        // TÍNH LƯƠNG CUỐI CÙNG
        // =============================================
        const grossSalary = dailySalary * workingDays + dailySalary * leaveDays + totalAllowances;
        const totalDeduction = dailySalary * unpaidLeaveDays + totalDeductions + totalPenalties;
        const netSalary = grossSalary - totalDeduction;
        // Insert payroll item
        const { data: payrollItem, error: insertError } = await supabase.from("payroll_items").insert({
            payroll_run_id: run.id,
            employee_id: emp.id,
            working_days: workingDays,
            leave_days: leaveDays,
            unpaid_leave_days: unpaidLeaveDays,
            base_salary: baseSalary,
            allowances: totalAllowances,
            total_income: grossSalary,
            total_deduction: totalDeduction,
            net_salary: netSalary,
            note: totalPenalties > 0 ? `Đi muộn: ${lateCount} lần, Phạt: ${adjustmentDetails.filter((d)=>d.category === 'penalty').length} lần` : `Đi muộn: ${lateCount} lần`
        }).select().single();
        if (insertError) {
            console.error(`Error inserting payroll item for ${emp.full_name}:`, insertError);
        } else {
            processedCount++;
            // Insert adjustment details
            if (payrollItem && adjustmentDetails.length > 0) {
                const detailsWithItemId = adjustmentDetails.map((d)=>({
                        ...d,
                        payroll_item_id: payrollItem.id
                    }));
                await supabase.from("payroll_adjustment_details").insert(detailsWithItemId);
            }
        }
    }
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])("/dashboard/payroll");
    return {
        success: true,
        data: run,
        message: `Đã tạo bảng lương cho ${processedCount} nhân viên`
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
async function getPayrollAdjustmentDetails(payroll_item_id) {
    const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createClient"])();
    const { data, error } = await supabase.from("payroll_adjustment_details").select(`
      *,
      adjustment_type:payroll_adjustment_types(id, name, code, category)
    `).eq("payroll_item_id", payroll_item_id).order("category");
    if (error) {
        console.error("Error fetching adjustment details:", error);
        return [];
    }
    return data || [];
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
    getMySalary,
    getPayrollAdjustmentDetails
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
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(getPayrollAdjustmentDetails, "40760250a0f0276425dcf05a519fbffe7aee716735", null);
}),
"[project]/.next-internal/server/app/dashboard/payroll/[id]/page/actions.js { ACTIONS_MODULE0 => \"[project]/lib/actions/employee-actions.ts [app-rsc] (ecmascript)\", ACTIONS_MODULE1 => \"[project]/lib/actions/payroll-actions.ts [app-rsc] (ecmascript)\" } [app-rsc] (server actions loader, ecmascript) <locals>", ((__turbopack_context__) => {
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
;
}),
"[project]/.next-internal/server/app/dashboard/payroll/[id]/page/actions.js { ACTIONS_MODULE0 => \"[project]/lib/actions/employee-actions.ts [app-rsc] (ecmascript)\", ACTIONS_MODULE1 => \"[project]/lib/actions/payroll-actions.ts [app-rsc] (ecmascript)\" } [app-rsc] (server actions loader, ecmascript)", ((__turbopack_context__) => {
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
    "40760250a0f0276425dcf05a519fbffe7aee716735",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$actions$2f$payroll$2d$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getPayrollAdjustmentDetails"],
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
var __TURBOPACK__imported__module__$5b$project$5d2f2e$next$2d$internal$2f$server$2f$app$2f$dashboard$2f$payroll$2f5b$id$5d2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$lib$2f$actions$2f$employee$2d$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE1__$3d3e$__$225b$project$5d2f$lib$2f$actions$2f$payroll$2d$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i('[project]/.next-internal/server/app/dashboard/payroll/[id]/page/actions.js { ACTIONS_MODULE0 => "[project]/lib/actions/employee-actions.ts [app-rsc] (ecmascript)", ACTIONS_MODULE1 => "[project]/lib/actions/payroll-actions.ts [app-rsc] (ecmascript)" } [app-rsc] (server actions loader, ecmascript) <locals>');
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$actions$2f$employee$2d$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/actions/employee-actions.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$actions$2f$payroll$2d$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/actions/payroll-actions.ts [app-rsc] (ecmascript)");
}),
];

//# sourceMappingURL=_2aef39d7._.js.map