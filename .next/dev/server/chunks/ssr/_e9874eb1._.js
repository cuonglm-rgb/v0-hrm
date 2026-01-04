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
"[project]/lib/actions/leave-actions.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/* __next_internal_action_entry_do_not_use__ [{"004f8ac509d8c63ac1f75a13f400b490249a90aa6a":"getMyLeaveRequests","4055415c0a91f32fcfb6f35153606167c5e2561264":"rejectLeaveRequest","4061c5d78bb72b7f647e5946c2c4d50669bd4b22db":"approveLeaveRequest","408aaabafb56d86415bd6d2c5804f8915bb7c02357":"listLeaveRequests","408b2507420e745ac1bdcb3611fab83db88edf0f05":"cancelLeaveRequest","40d8fbd856953646de7ab8c23a0495f7b607391a05":"createLeaveRequest"},"",""] */ __turbopack_context__.s([
    "approveLeaveRequest",
    ()=>approveLeaveRequest,
    "cancelLeaveRequest",
    ()=>cancelLeaveRequest,
    "createLeaveRequest",
    ()=>createLeaveRequest,
    "getMyLeaveRequests",
    ()=>getMyLeaveRequests,
    "listLeaveRequests",
    ()=>listLeaveRequests,
    "rejectLeaveRequest",
    ()=>rejectLeaveRequest
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.10_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/build/webpack/loaders/next-flight-loader/server-reference.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/supabase/server.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.10_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/cache.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.10_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-validate.js [app-rsc] (ecmascript)");
;
;
;
async function getMyLeaveRequests() {
    const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createClient"])();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];
    const { data: employee } = await supabase.from("employees").select("id").eq("user_id", user.id).single();
    if (!employee) return [];
    const { data, error } = await supabase.from("leave_requests").select("*").eq("employee_id", employee.id).order("created_at", {
        ascending: false
    });
    if (error) {
        console.error("Error fetching leave requests:", error);
        return [];
    }
    return data || [];
}
async function createLeaveRequest(input) {
    const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createClient"])();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return {
        success: false,
        error: "Not authenticated"
    };
    const { data: employee } = await supabase.from("employees").select("id").eq("user_id", user.id).single();
    if (!employee) return {
        success: false,
        error: "Employee not found"
    };
    // Validate: from_date <= to_date
    if (input.from_date > input.to_date) {
        return {
            success: false,
            error: "From date must be before or equal to To date"
        };
    }
    // Validate: chống đè ngày nghỉ (overlap)
    const { data: overlap } = await supabase.from("leave_requests").select("id").eq("employee_id", employee.id).neq("status", "rejected") // Chỉ check pending và approved
    .lte("from_date", input.to_date).gte("to_date", input.from_date);
    if (overlap && overlap.length > 0) {
        return {
            success: false,
            error: "Leave dates overlap with existing request"
        };
    }
    const { error } = await supabase.from("leave_requests").insert({
        employee_id: employee.id,
        leave_type: input.leave_type,
        from_date: input.from_date,
        to_date: input.to_date,
        reason: input.reason,
        status: "pending"
    });
    if (error) {
        console.error("Error creating leave request:", error);
        return {
            success: false,
            error: error.message
        };
    }
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])("/dashboard/leave");
    return {
        success: true
    };
}
async function cancelLeaveRequest(id) {
    const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createClient"])();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return {
        success: false,
        error: "Not authenticated"
    };
    // Chỉ có thể hủy đơn pending của mình
    const { error } = await supabase.from("leave_requests").delete().eq("id", id).eq("status", "pending");
    if (error) {
        console.error("Error canceling leave request:", error);
        return {
            success: false,
            error: error.message
        };
    }
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])("/dashboard/leave");
    return {
        success: true
    };
}
async function listLeaveRequests(filters) {
    const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createClient"])();
    let query = supabase.from("leave_requests").select(`
      *,
      employee:employees!employee_id(id, full_name, employee_code, department_id),
      approver:employees!approver_id(id, full_name)
    `).order("created_at", {
        ascending: false
    });
    if (filters?.status) query = query.eq("status", filters.status);
    if (filters?.employee_id) query = query.eq("employee_id", filters.employee_id);
    const { data, error } = await query.limit(100);
    if (error) {
        console.error("Error listing leave requests:", error);
        return [];
    }
    return data || [];
}
async function approveLeaveRequest(id) {
    const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createClient"])();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return {
        success: false,
        error: "Not authenticated"
    };
    const { data: employee } = await supabase.from("employees").select("id").eq("user_id", user.id).single();
    const { error } = await supabase.from("leave_requests").update({
        status: "approved",
        approver_id: employee?.id,
        approved_at: new Date().toISOString()
    }).eq("id", id).eq("status", "pending");
    if (error) {
        console.error("Error approving leave request:", error);
        return {
            success: false,
            error: error.message
        };
    }
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])("/dashboard/leave");
    return {
        success: true
    };
}
async function rejectLeaveRequest(id) {
    const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createClient"])();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return {
        success: false,
        error: "Not authenticated"
    };
    const { data: employee } = await supabase.from("employees").select("id").eq("user_id", user.id).single();
    const { error } = await supabase.from("leave_requests").update({
        status: "rejected",
        approver_id: employee?.id,
        approved_at: new Date().toISOString()
    }).eq("id", id).eq("status", "pending");
    if (error) {
        console.error("Error rejecting leave request:", error);
        return {
            success: false,
            error: error.message
        };
    }
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])("/dashboard/leave");
    return {
        success: true
    };
}
;
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ensureServerEntryExports"])([
    getMyLeaveRequests,
    createLeaveRequest,
    cancelLeaveRequest,
    listLeaveRequests,
    approveLeaveRequest,
    rejectLeaveRequest
]);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(getMyLeaveRequests, "004f8ac509d8c63ac1f75a13f400b490249a90aa6a", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(createLeaveRequest, "40d8fbd856953646de7ab8c23a0495f7b607391a05", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(cancelLeaveRequest, "408b2507420e745ac1bdcb3611fab83db88edf0f05", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(listLeaveRequests, "408aaabafb56d86415bd6d2c5804f8915bb7c02357", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(approveLeaveRequest, "4061c5d78bb72b7f647e5946c2c4d50669bd4b22db", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(rejectLeaveRequest, "4055415c0a91f32fcfb6f35153606167c5e2561264", null);
}),
"[project]/lib/actions/request-type-actions.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/* __next_internal_action_entry_do_not_use__ [{"008be2ca4bee2ec84966320cd00837f66626ca1347":"getMyEmployeeRequests","4001e7105a139387a0509394e2e0db7dfc08d5948c":"getRequestApprovals","4001f5b476bfff3a2c782317b0a873fa3ce157f9e3":"deleteRequestType","400df82b9368ba41f00983bfcb4080b640da906f52":"listRequestTypes","402436f981df17975bada56a175326306c7d07d00d":"addRequestTypeApprover","40303d7fa344720c20fd5bd2fcc949559c493532ad":"createEmployeeRequest","4042d2e753b5d3275d2b2ce0738eec4afa6de6c872":"cancelEmployeeRequest","405ac148a59377d1a8e5ebb4cc152f48bb1472908a":"removeRequestTypeApprover","4060c92fb4e2af154ea44bebf77713deffc22c1acb":"createRequestType","4070a717e158fe0e74f2cacf6158cc298ef92bdea8":"approveEmployeeRequest","4081e4f12487ef5c2892434111f2730ad649562fc5":"listRequestTypeApprovers","40a1fd095b336a43be7c71d7bd81394def3ce560f6":"listEmployeeRequests","40ea16f216b0a3067bd2b40ff93a49362c88376c88":"getRequestType","60173cbc597f2f482dcc28dd3b2e654e6ad40756d6":"updateRequestType","60265134f63162c1dde5c5a4d6ccf4844254519069":"rejectEmployeeRequest","6088ddda7e30236231128e7ada83151d0123a2b06e":"rejectRequestByApprover","60c6eb32d071a5f878194192530f07934fee4abce3":"approveRequestByApprover"},"",""] */ __turbopack_context__.s([
    "addRequestTypeApprover",
    ()=>addRequestTypeApprover,
    "approveEmployeeRequest",
    ()=>approveEmployeeRequest,
    "approveRequestByApprover",
    ()=>approveRequestByApprover,
    "cancelEmployeeRequest",
    ()=>cancelEmployeeRequest,
    "createEmployeeRequest",
    ()=>createEmployeeRequest,
    "createRequestType",
    ()=>createRequestType,
    "deleteRequestType",
    ()=>deleteRequestType,
    "getMyEmployeeRequests",
    ()=>getMyEmployeeRequests,
    "getRequestApprovals",
    ()=>getRequestApprovals,
    "getRequestType",
    ()=>getRequestType,
    "listEmployeeRequests",
    ()=>listEmployeeRequests,
    "listRequestTypeApprovers",
    ()=>listRequestTypeApprovers,
    "listRequestTypes",
    ()=>listRequestTypes,
    "rejectEmployeeRequest",
    ()=>rejectEmployeeRequest,
    "rejectRequestByApprover",
    ()=>rejectRequestByApprover,
    "removeRequestTypeApprover",
    ()=>removeRequestTypeApprover,
    "updateRequestType",
    ()=>updateRequestType
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.10_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/build/webpack/loaders/next-flight-loader/server-reference.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/supabase/server.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.10_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/cache.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.10_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-validate.js [app-rsc] (ecmascript)");
;
;
;
async function listRequestTypes(activeOnly = true) {
    const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createClient"])();
    let query = supabase.from("request_types").select("*").order("display_order", {
        ascending: true
    });
    if (activeOnly) {
        query = query.eq("is_active", true);
    }
    const { data, error } = await query;
    if (error) {
        console.error("Error listing request types:", error);
        return [];
    }
    return data || [];
}
async function getRequestType(id) {
    const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createClient"])();
    const { data, error } = await supabase.from("request_types").select("*").eq("id", id).single();
    if (error) {
        console.error("Error getting request type:", error);
        return null;
    }
    return data;
}
async function createRequestType(input) {
    const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createClient"])();
    const { error } = await supabase.from("request_types").insert({
        name: input.name,
        code: input.code.toLowerCase().replace(/\s+/g, "_"),
        description: input.description,
        requires_date_range: input.requires_date_range ?? true,
        requires_single_date: input.requires_single_date ?? false,
        requires_time: input.requires_time ?? false,
        requires_time_range: input.requires_time_range ?? false,
        requires_reason: input.requires_reason ?? true,
        requires_attachment: input.requires_attachment ?? false,
        affects_attendance: input.affects_attendance ?? false,
        affects_payroll: input.affects_payroll ?? false,
        deduct_leave_balance: input.deduct_leave_balance ?? false,
        approval_mode: input.approval_mode ?? "any",
        min_approver_level: input.min_approver_level,
        max_approver_level: input.max_approver_level,
        display_order: input.display_order ?? 0
    });
    if (error) {
        console.error("Error creating request type:", error);
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
async function updateRequestType(id, input) {
    const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createClient"])();
    const { error } = await supabase.from("request_types").update(input).eq("id", id);
    if (error) {
        console.error("Error updating request type:", error);
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
async function deleteRequestType(id) {
    const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createClient"])();
    // Check if any requests use this type
    const { data: requests } = await supabase.from("employee_requests").select("id").eq("request_type_id", id).limit(1);
    if (requests && requests.length > 0) {
        return {
            success: false,
            error: "Không thể xóa loại phiếu đã có phiếu sử dụng"
        };
    }
    const { error } = await supabase.from("request_types").delete().eq("id", id);
    if (error) {
        console.error("Error deleting request type:", error);
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
async function listEmployeeRequests(filters) {
    const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createClient"])();
    let query = supabase.from("employee_requests").select(`
      *,
      employee:employees!employee_id(id, full_name, employee_code, department_id),
      approver:employees!approver_id(id, full_name),
      request_type:request_types!request_type_id(*)
    `).order("created_at", {
        ascending: false
    });
    if (filters?.status) query = query.eq("status", filters.status);
    if (filters?.request_type_id) query = query.eq("request_type_id", filters.request_type_id);
    if (filters?.employee_id) query = query.eq("employee_id", filters.employee_id);
    const { data, error } = await query.limit(100);
    if (error) {
        console.error("Error listing employee requests:", error);
        return [];
    }
    return data || [];
}
async function getMyEmployeeRequests() {
    const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createClient"])();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];
    const { data: employee } = await supabase.from("employees").select("id").eq("user_id", user.id).single();
    if (!employee) return [];
    const { data, error } = await supabase.from("employee_requests").select(`
      *,
      request_type:request_types!request_type_id(*),
      approver:employees!approver_id(id, full_name)
    `).eq("employee_id", employee.id).order("created_at", {
        ascending: false
    });
    if (error) {
        console.error("Error fetching my requests:", error);
        return [];
    }
    return data || [];
}
async function createEmployeeRequest(input) {
    const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createClient"])();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return {
        success: false,
        error: "Not authenticated"
    };
    const { data: employee } = await supabase.from("employees").select("id").eq("user_id", user.id).single();
    if (!employee) return {
        success: false,
        error: "Employee not found"
    };
    // Validate date range
    if (input.from_date && input.to_date && input.from_date > input.to_date) {
        return {
            success: false,
            error: "Ngày bắt đầu phải trước ngày kết thúc"
        };
    }
    const { error } = await supabase.from("employee_requests").insert({
        employee_id: employee.id,
        request_type_id: input.request_type_id,
        from_date: input.from_date,
        to_date: input.to_date,
        request_date: input.request_date,
        request_time: input.request_time,
        from_time: input.from_time,
        to_time: input.to_time,
        reason: input.reason,
        attachment_url: input.attachment_url,
        status: "pending"
    });
    if (error) {
        console.error("Error creating employee request:", error);
        return {
            success: false,
            error: error.message
        };
    }
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])("/dashboard/leave");
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])("/dashboard/leave-approval");
    return {
        success: true
    };
}
async function approveEmployeeRequest(id) {
    const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createClient"])();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return {
        success: false,
        error: "Not authenticated"
    };
    const { data: employee } = await supabase.from("employees").select("id").eq("user_id", user.id).single();
    const { error } = await supabase.from("employee_requests").update({
        status: "approved",
        approver_id: employee?.id,
        approved_at: new Date().toISOString()
    }).eq("id", id).eq("status", "pending");
    if (error) {
        console.error("Error approving request:", error);
        return {
            success: false,
            error: error.message
        };
    }
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])("/dashboard/leave");
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])("/dashboard/leave-approval");
    return {
        success: true
    };
}
async function rejectEmployeeRequest(id, rejection_reason) {
    const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createClient"])();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return {
        success: false,
        error: "Not authenticated"
    };
    const { data: employee } = await supabase.from("employees").select("id").eq("user_id", user.id).single();
    const { error } = await supabase.from("employee_requests").update({
        status: "rejected",
        approver_id: employee?.id,
        approved_at: new Date().toISOString(),
        rejection_reason
    }).eq("id", id).eq("status", "pending");
    if (error) {
        console.error("Error rejecting request:", error);
        return {
            success: false,
            error: error.message
        };
    }
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])("/dashboard/leave");
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])("/dashboard/leave-approval");
    return {
        success: true
    };
}
async function cancelEmployeeRequest(id) {
    const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createClient"])();
    const { error } = await supabase.from("employee_requests").delete().eq("id", id).eq("status", "pending");
    if (error) {
        console.error("Error canceling request:", error);
        return {
            success: false,
            error: error.message
        };
    }
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])("/dashboard/leave");
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])("/dashboard/leave-approval");
    return {
        success: true
    };
}
async function listRequestTypeApprovers(requestTypeId) {
    const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createClient"])();
    const { data, error } = await supabase.from("request_type_approvers").select(`
      *,
      employee:employees!approver_employee_id(id, full_name, employee_code),
      position:positions!approver_position_id(id, name, level)
    `).eq("request_type_id", requestTypeId).order("display_order", {
        ascending: true
    });
    if (error) {
        console.error("Error listing approvers:", error);
        return [];
    }
    return data || [];
}
async function addRequestTypeApprover(input) {
    const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createClient"])();
    const { error } = await supabase.from("request_type_approvers").insert({
        request_type_id: input.request_type_id,
        approver_employee_id: input.approver_employee_id,
        approver_position_id: input.approver_position_id,
        approver_role_code: input.approver_role_code,
        display_order: input.display_order ?? 0
    });
    if (error) {
        console.error("Error adding approver:", error);
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
async function removeRequestTypeApprover(id) {
    const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createClient"])();
    const { error } = await supabase.from("request_type_approvers").delete().eq("id", id);
    if (error) {
        console.error("Error removing approver:", error);
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
async function getRequestApprovals(requestId) {
    const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createClient"])();
    const { data, error } = await supabase.from("request_approvals").select(`
      *,
      approver:employees!approver_id(id, full_name, employee_code)
    `).eq("request_id", requestId).order("created_at", {
        ascending: true
    });
    if (error) {
        console.error("Error getting approvals:", error);
        return [];
    }
    return data || [];
}
async function approveRequestByApprover(requestId, comment) {
    const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createClient"])();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return {
        success: false,
        error: "Not authenticated"
    };
    const { data: employee } = await supabase.from("employees").select("id").eq("user_id", user.id).single();
    if (!employee) return {
        success: false,
        error: "Employee not found"
    };
    // Cập nhật trạng thái duyệt của người này
    const { error: approvalError } = await supabase.from("request_approvals").upsert({
        request_id: requestId,
        approver_id: employee.id,
        status: "approved",
        comment,
        approved_at: new Date().toISOString()
    }, {
        onConflict: "request_id,approver_id"
    });
    if (approvalError) {
        console.error("Error approving:", approvalError);
        return {
            success: false,
            error: approvalError.message
        };
    }
    // Kiểm tra xem phiếu đã đủ điều kiện duyệt chưa
    await checkAndUpdateRequestStatus(requestId);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])("/dashboard/leave");
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])("/dashboard/leave-approval");
    return {
        success: true
    };
}
async function rejectRequestByApprover(requestId, comment) {
    const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createClient"])();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return {
        success: false,
        error: "Not authenticated"
    };
    const { data: employee } = await supabase.from("employees").select("id").eq("user_id", user.id).single();
    if (!employee) return {
        success: false,
        error: "Employee not found"
    };
    // Cập nhật trạng thái từ chối
    const { error: approvalError } = await supabase.from("request_approvals").upsert({
        request_id: requestId,
        approver_id: employee.id,
        status: "rejected",
        comment,
        approved_at: new Date().toISOString()
    }, {
        onConflict: "request_id,approver_id"
    });
    if (approvalError) {
        console.error("Error rejecting:", approvalError);
        return {
            success: false,
            error: approvalError.message
        };
    }
    // Nếu 1 người từ chối thì phiếu bị từ chối
    await supabase.from("employee_requests").update({
        status: "rejected",
        approver_id: employee.id,
        approved_at: new Date().toISOString(),
        rejection_reason: comment
    }).eq("id", requestId).eq("status", "pending");
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])("/dashboard/leave");
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])("/dashboard/leave-approval");
    return {
        success: true
    };
}
async function checkAndUpdateRequestStatus(requestId) {
    const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createClient"])();
    // Lấy thông tin phiếu và loại phiếu
    const { data: request } = await supabase.from("employee_requests").select(`
      *,
      request_type:request_types!request_type_id(approval_mode)
    `).eq("id", requestId).single();
    if (!request || request.status !== "pending") return;
    const approvalMode = request.request_type?.approval_mode || "any";
    // Lấy danh sách người duyệt đã duyệt
    const { data: approvals } = await supabase.from("request_approvals").select("*").eq("request_id", requestId);
    if (!approvals || approvals.length === 0) return;
    const approvedCount = approvals.filter((a)=>a.status === "approved").length;
    const rejectedCount = approvals.filter((a)=>a.status === "rejected").length;
    // Nếu có người từ chối -> phiếu bị từ chối
    if (rejectedCount > 0) {
        const rejector = approvals.find((a)=>a.status === "rejected");
        await supabase.from("employee_requests").update({
            status: "rejected",
            approver_id: rejector?.approver_id,
            approved_at: new Date().toISOString()
        }).eq("id", requestId);
        return;
    }
    // Kiểm tra điều kiện duyệt
    if (approvalMode === "any" && approvedCount >= 1) {
        // Chỉ cần 1 người duyệt
        const approver = approvals.find((a)=>a.status === "approved");
        await supabase.from("employee_requests").update({
            status: "approved",
            approver_id: approver?.approver_id,
            approved_at: new Date().toISOString()
        }).eq("id", requestId);
    } else if (approvalMode === "all") {
        // Cần tất cả người duyệt
        // Lấy số người duyệt được chỉ định
        const { data: requiredApprovers } = await supabase.from("request_type_approvers").select("id").eq("request_type_id", request.request_type_id);
        const requiredCount = requiredApprovers?.length || 1;
        if (approvedCount >= requiredCount) {
            const lastApprover = approvals.filter((a)=>a.status === "approved").pop();
            await supabase.from("employee_requests").update({
                status: "approved",
                approver_id: lastApprover?.approver_id,
                approved_at: new Date().toISOString()
            }).eq("id", requestId);
        }
    }
}
;
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ensureServerEntryExports"])([
    listRequestTypes,
    getRequestType,
    createRequestType,
    updateRequestType,
    deleteRequestType,
    listEmployeeRequests,
    getMyEmployeeRequests,
    createEmployeeRequest,
    approveEmployeeRequest,
    rejectEmployeeRequest,
    cancelEmployeeRequest,
    listRequestTypeApprovers,
    addRequestTypeApprover,
    removeRequestTypeApprover,
    getRequestApprovals,
    approveRequestByApprover,
    rejectRequestByApprover
]);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(listRequestTypes, "400df82b9368ba41f00983bfcb4080b640da906f52", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(getRequestType, "40ea16f216b0a3067bd2b40ff93a49362c88376c88", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(createRequestType, "4060c92fb4e2af154ea44bebf77713deffc22c1acb", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(updateRequestType, "60173cbc597f2f482dcc28dd3b2e654e6ad40756d6", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(deleteRequestType, "4001f5b476bfff3a2c782317b0a873fa3ce157f9e3", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(listEmployeeRequests, "40a1fd095b336a43be7c71d7bd81394def3ce560f6", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(getMyEmployeeRequests, "008be2ca4bee2ec84966320cd00837f66626ca1347", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(createEmployeeRequest, "40303d7fa344720c20fd5bd2fcc949559c493532ad", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(approveEmployeeRequest, "4070a717e158fe0e74f2cacf6158cc298ef92bdea8", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(rejectEmployeeRequest, "60265134f63162c1dde5c5a4d6ccf4844254519069", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(cancelEmployeeRequest, "4042d2e753b5d3275d2b2ce0738eec4afa6de6c872", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(listRequestTypeApprovers, "4081e4f12487ef5c2892434111f2730ad649562fc5", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(addRequestTypeApprover, "402436f981df17975bada56a175326306c7d07d00d", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(removeRequestTypeApprover, "405ac148a59377d1a8e5ebb4cc152f48bb1472908a", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(getRequestApprovals, "4001e7105a139387a0509394e2e0db7dfc08d5948c", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(approveRequestByApprover, "60c6eb32d071a5f878194192530f07934fee4abce3", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(rejectRequestByApprover, "6088ddda7e30236231128e7ada83151d0123a2b06e", null);
}),
"[project]/lib/actions/upload-actions.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/* __next_internal_action_entry_do_not_use__ [{"403e911e6f481468519342d120d182cdb3c7bd3ae4":"deleteRequestAttachment","406d8b767c63f4636c7173528b234e7b801bacaf01":"uploadRequestAttachment"},"",""] */ __turbopack_context__.s([
    "deleteRequestAttachment",
    ()=>deleteRequestAttachment,
    "uploadRequestAttachment",
    ()=>uploadRequestAttachment
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.10_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/build/webpack/loaders/next-flight-loader/server-reference.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/supabase/server.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.10_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-validate.js [app-rsc] (ecmascript)");
;
;
async function uploadRequestAttachment(formData) {
    const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createClient"])();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        return {
            success: false,
            error: "Not authenticated"
        };
    }
    const file = formData.get("file");
    if (!file) {
        return {
            success: false,
            error: "No file provided"
        };
    }
    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
        return {
            success: false,
            error: "File không được vượt quá 5MB"
        };
    }
    // Validate file type
    const allowedTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "image/jpeg",
        "image/png"
    ];
    if (!allowedTypes.includes(file.type)) {
        return {
            success: false,
            error: "Chỉ chấp nhận file PDF, DOC, DOCX, JPG, PNG"
        };
    }
    // Generate unique filename
    const ext = file.name.split(".").pop();
    const timestamp = Date.now();
    const randomStr = Math.random().toString(36).substring(2, 8);
    const fileName = `${user.id}/${timestamp}-${randomStr}.${ext}`;
    // Upload to Supabase Storage
    const { data, error } = await supabase.storage.from("request-attachments").upload(fileName, file, {
        cacheControl: "3600",
        upsert: false
    });
    if (error) {
        console.error("Upload error:", error);
        return {
            success: false,
            error: "Không thể upload file: " + error.message
        };
    }
    // Get public URL
    const { data: urlData } = supabase.storage.from("request-attachments").getPublicUrl(data.path);
    return {
        success: true,
        url: urlData.publicUrl,
        path: data.path
    };
}
async function deleteRequestAttachment(path) {
    const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createClient"])();
    const { error } = await supabase.storage.from("request-attachments").remove([
        path
    ]);
    if (error) {
        console.error("Delete error:", error);
        return {
            success: false,
            error: error.message
        };
    }
    return {
        success: true
    };
}
;
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ensureServerEntryExports"])([
    uploadRequestAttachment,
    deleteRequestAttachment
]);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(uploadRequestAttachment, "406d8b767c63f4636c7173528b234e7b801bacaf01", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(deleteRequestAttachment, "403e911e6f481468519342d120d182cdb3c7bd3ae4", null);
}),
"[project]/.next-internal/server/app/dashboard/leave/page/actions.js { ACTIONS_MODULE0 => \"[project]/lib/actions/employee-actions.ts [app-rsc] (ecmascript)\", ACTIONS_MODULE1 => \"[project]/lib/actions/leave-actions.ts [app-rsc] (ecmascript)\", ACTIONS_MODULE2 => \"[project]/lib/actions/request-type-actions.ts [app-rsc] (ecmascript)\", ACTIONS_MODULE3 => \"[project]/lib/actions/upload-actions.ts [app-rsc] (ecmascript)\" } [app-rsc] (server actions loader, ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$actions$2f$employee$2d$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/actions/employee-actions.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$actions$2f$leave$2d$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/actions/leave-actions.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$actions$2f$request$2d$type$2d$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/actions/request-type-actions.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$actions$2f$upload$2d$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/actions/upload-actions.ts [app-rsc] (ecmascript)");
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
"[project]/.next-internal/server/app/dashboard/leave/page/actions.js { ACTIONS_MODULE0 => \"[project]/lib/actions/employee-actions.ts [app-rsc] (ecmascript)\", ACTIONS_MODULE1 => \"[project]/lib/actions/leave-actions.ts [app-rsc] (ecmascript)\", ACTIONS_MODULE2 => \"[project]/lib/actions/request-type-actions.ts [app-rsc] (ecmascript)\", ACTIONS_MODULE3 => \"[project]/lib/actions/upload-actions.ts [app-rsc] (ecmascript)\" } [app-rsc] (server actions loader, ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "004f8ac509d8c63ac1f75a13f400b490249a90aa6a",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$actions$2f$leave$2d$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getMyLeaveRequests"],
    "005e20e2e268d812762b030e4aac3b7693066871b6",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$actions$2f$employee$2d$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getMyRoles"],
    "00636a7c2e61bd285b975ea815e7fbbefdffae959f",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$actions$2f$employee$2d$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getMyEmployee"],
    "008be2ca4bee2ec84966320cd00837f66626ca1347",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$actions$2f$request$2d$type$2d$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getMyEmployeeRequests"],
    "00b0c7f0352396833a3aa70b738bb3a8c2a485efae",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$actions$2f$employee$2d$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["listEmployees"],
    "4001e7105a139387a0509394e2e0db7dfc08d5948c",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$actions$2f$request$2d$type$2d$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getRequestApprovals"],
    "4001f5b476bfff3a2c782317b0a873fa3ce157f9e3",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$actions$2f$request$2d$type$2d$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["deleteRequestType"],
    "400df82b9368ba41f00983bfcb4080b640da906f52",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$actions$2f$request$2d$type$2d$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["listRequestTypes"],
    "402436f981df17975bada56a175326306c7d07d00d",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$actions$2f$request$2d$type$2d$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["addRequestTypeApprover"],
    "40303d7fa344720c20fd5bd2fcc949559c493532ad",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$actions$2f$request$2d$type$2d$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createEmployeeRequest"],
    "4042d2e753b5d3275d2b2ce0738eec4afa6de6c872",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$actions$2f$request$2d$type$2d$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["cancelEmployeeRequest"],
    "4055415c0a91f32fcfb6f35153606167c5e2561264",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$actions$2f$leave$2d$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["rejectLeaveRequest"],
    "405ac148a59377d1a8e5ebb4cc152f48bb1472908a",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$actions$2f$request$2d$type$2d$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["removeRequestTypeApprover"],
    "4060c92fb4e2af154ea44bebf77713deffc22c1acb",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$actions$2f$request$2d$type$2d$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createRequestType"],
    "4061c5d78bb72b7f647e5946c2c4d50669bd4b22db",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$actions$2f$leave$2d$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["approveLeaveRequest"],
    "406d8b767c63f4636c7173528b234e7b801bacaf01",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$actions$2f$upload$2d$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["uploadRequestAttachment"],
    "4070a717e158fe0e74f2cacf6158cc298ef92bdea8",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$actions$2f$request$2d$type$2d$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["approveEmployeeRequest"],
    "4072cdebcca1df607d08f62096843ddf91d2cf29f6",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$actions$2f$employee$2d$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createEmployee"],
    "407a7f2085358134fb9b61998dbd9fa880ad52c2cf",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$actions$2f$employee$2d$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["updateMyProfile"],
    "4081e4f12487ef5c2892434111f2730ad649562fc5",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$actions$2f$request$2d$type$2d$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["listRequestTypeApprovers"],
    "408aaabafb56d86415bd6d2c5804f8915bb7c02357",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$actions$2f$leave$2d$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["listLeaveRequests"],
    "408b2507420e745ac1bdcb3611fab83db88edf0f05",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$actions$2f$leave$2d$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["cancelLeaveRequest"],
    "409df3c5b25ea33596f872aab0b186da47271a8e80",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$actions$2f$employee$2d$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getEmployee"],
    "40a1fd095b336a43be7c71d7bd81394def3ce560f6",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$actions$2f$request$2d$type$2d$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["listEmployeeRequests"],
    "40d8fbd856953646de7ab8c23a0495f7b607391a05",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$actions$2f$leave$2d$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createLeaveRequest"],
    "40ea16f216b0a3067bd2b40ff93a49362c88376c88",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$actions$2f$request$2d$type$2d$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getRequestType"],
    "60173cbc597f2f482dcc28dd3b2e654e6ad40756d6",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$actions$2f$request$2d$type$2d$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["updateRequestType"],
    "60265134f63162c1dde5c5a4d6ccf4844254519069",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$actions$2f$request$2d$type$2d$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["rejectEmployeeRequest"],
    "6088ddda7e30236231128e7ada83151d0123a2b06e",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$actions$2f$request$2d$type$2d$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["rejectRequestByApprover"],
    "60c6eb32d071a5f878194192530f07934fee4abce3",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$actions$2f$request$2d$type$2d$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["approveRequestByApprover"],
    "60e7529b55507157f11112b5c625757ac226a23a7c",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$actions$2f$employee$2d$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["updateEmployee"],
    "701419c868154523741dd2880ac65e97064ceb8620",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$actions$2f$employee$2d$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["changeDepartment"],
    "70daddb01ea9f495d095baa024616ddfa6ee94f8dd",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$actions$2f$employee$2d$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["changePosition"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f2e$next$2d$internal$2f$server$2f$app$2f$dashboard$2f$leave$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$lib$2f$actions$2f$employee$2d$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE1__$3d3e$__$225b$project$5d2f$lib$2f$actions$2f$leave$2d$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE2__$3d3e$__$225b$project$5d2f$lib$2f$actions$2f$request$2d$type$2d$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE3__$3d3e$__$225b$project$5d2f$lib$2f$actions$2f$upload$2d$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i('[project]/.next-internal/server/app/dashboard/leave/page/actions.js { ACTIONS_MODULE0 => "[project]/lib/actions/employee-actions.ts [app-rsc] (ecmascript)", ACTIONS_MODULE1 => "[project]/lib/actions/leave-actions.ts [app-rsc] (ecmascript)", ACTIONS_MODULE2 => "[project]/lib/actions/request-type-actions.ts [app-rsc] (ecmascript)", ACTIONS_MODULE3 => "[project]/lib/actions/upload-actions.ts [app-rsc] (ecmascript)" } [app-rsc] (server actions loader, ecmascript) <locals>');
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$actions$2f$employee$2d$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/actions/employee-actions.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$actions$2f$leave$2d$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/actions/leave-actions.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$actions$2f$request$2d$type$2d$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/actions/request-type-actions.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$actions$2f$upload$2d$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/actions/upload-actions.ts [app-rsc] (ecmascript)");
}),
];

//# sourceMappingURL=_e9874eb1._.js.map