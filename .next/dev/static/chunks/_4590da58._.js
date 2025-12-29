(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/hooks/use-mobile.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useIsMobile",
    ()=>useIsMobile
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.10_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
;
const MOBILE_BREAKPOINT = 768;
function useIsMobile() {
    _s();
    const [isMobile, setIsMobile] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"](undefined);
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"]({
        "useIsMobile.useEffect": ()=>{
            const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
            const onChange = {
                "useIsMobile.useEffect.onChange": ()=>{
                    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
                }
            }["useIsMobile.useEffect.onChange"];
            mql.addEventListener('change', onChange);
            setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
            return ({
                "useIsMobile.useEffect": ()=>mql.removeEventListener('change', onChange)
            })["useIsMobile.useEffect"];
        }
    }["useIsMobile.useEffect"], []);
    return !!isMobile;
}
_s(useIsMobile, "D6B2cPXNCaIbeOx+abFr1uxLRM0=");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/utils.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "cn",
    ()=>cn
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$clsx$40$2$2e$1$2e$1$2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/clsx@2.1.1/node_modules/clsx/dist/clsx.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$tailwind$2d$merge$40$3$2e$3$2e$1$2f$node_modules$2f$tailwind$2d$merge$2f$dist$2f$bundle$2d$mjs$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/tailwind-merge@3.3.1/node_modules/tailwind-merge/dist/bundle-mjs.mjs [app-client] (ecmascript)");
;
;
function cn(...inputs) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$tailwind$2d$merge$40$3$2e$3$2e$1$2f$node_modules$2f$tailwind$2d$merge$2f$dist$2f$bundle$2d$mjs$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["twMerge"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$clsx$40$2$2e$1$2e$1$2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["clsx"])(inputs));
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/ui/button.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Button",
    ()=>Button,
    "buttonVariants",
    ()=>buttonVariants
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.10_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$slot$40$1$2e$1$2e$1_$40$types$2b$react$40$19$2e$0$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$slot$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@radix-ui+react-slot@1.1.1_@types+react@19.0.0_react@19.2.0/node_modules/@radix-ui/react-slot/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$class$2d$variance$2d$authority$40$0$2e$7$2e$1$2f$node_modules$2f$class$2d$variance$2d$authority$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/class-variance-authority@0.7.1/node_modules/class-variance-authority/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/utils.ts [app-client] (ecmascript)");
;
;
;
;
const buttonVariants = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$class$2d$variance$2d$authority$40$0$2e$7$2e$1$2f$node_modules$2f$class$2d$variance$2d$authority$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cva"])("inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive", {
    variants: {
        variant: {
            default: "bg-primary text-primary-foreground hover:bg-primary/90",
            destructive: "bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
            outline: "border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50",
            secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
            ghost: "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
            link: "text-primary underline-offset-4 hover:underline"
        },
        size: {
            default: "h-9 px-4 py-2 has-[>svg]:px-3",
            sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
            lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
            icon: "size-9",
            "icon-sm": "size-8",
            "icon-lg": "size-10"
        }
    },
    defaultVariants: {
        variant: "default",
        size: "default"
    }
});
function Button({ className, variant = "default", size = "default", asChild = false, ...props }) {
    const Comp = asChild ? __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$slot$40$1$2e$1$2e$1_$40$types$2b$react$40$19$2e$0$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$slot$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Slot"] : "button";
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Comp, {
        "data-slot": "button",
        "data-variant": variant,
        "data-size": size,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])(buttonVariants({
            variant,
            size,
            className
        })),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/button.tsx",
        lineNumber: 52,
        columnNumber: 5
    }, this);
}
_c = Button;
;
var _c;
__turbopack_context__.k.register(_c, "Button");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/ui/input.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Input",
    ()=>Input
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.10_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/utils.ts [app-client] (ecmascript)");
;
;
function Input({ className, type, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
        type: type,
        "data-slot": "input",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm', 'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]', 'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive', className),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/input.tsx",
        lineNumber: 7,
        columnNumber: 5
    }, this);
}
_c = Input;
;
var _c;
__turbopack_context__.k.register(_c, "Input");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/ui/separator.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Separator",
    ()=>Separator
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.10_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$separator$40$1_7a9b68b207212e8d069e8a408d34b131$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$separator$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@radix-ui+react-separator@1_7a9b68b207212e8d069e8a408d34b131/node_modules/@radix-ui/react-separator/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/utils.ts [app-client] (ecmascript)");
'use client';
;
;
;
function Separator({ className, orientation = 'horizontal', decorative = true, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$separator$40$1_7a9b68b207212e8d069e8a408d34b131$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$separator$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Root"], {
        "data-slot": "separator",
        decorative: decorative,
        orientation: orientation,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('bg-border shrink-0 data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-px', className),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/separator.tsx",
        lineNumber: 15,
        columnNumber: 5
    }, this);
}
_c = Separator;
;
var _c;
__turbopack_context__.k.register(_c, "Separator");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/ui/sheet.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Sheet",
    ()=>Sheet,
    "SheetClose",
    ()=>SheetClose,
    "SheetContent",
    ()=>SheetContent,
    "SheetDescription",
    ()=>SheetDescription,
    "SheetFooter",
    ()=>SheetFooter,
    "SheetHeader",
    ()=>SheetHeader,
    "SheetTitle",
    ()=>SheetTitle,
    "SheetTrigger",
    ()=>SheetTrigger
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.10_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$dialog$40$1$2e$1$2e$_3c24438a856d60dc4321c37f337cee45$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@radix-ui+react-dialog@1.1._3c24438a856d60dc4321c37f337cee45/node_modules/@radix-ui/react-dialog/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$454$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__XIcon$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.454.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/x.js [app-client] (ecmascript) <export default as XIcon>");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/utils.ts [app-client] (ecmascript)");
'use client';
;
;
;
;
function Sheet({ ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$dialog$40$1$2e$1$2e$_3c24438a856d60dc4321c37f337cee45$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Root"], {
        "data-slot": "sheet",
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/sheet.tsx",
        lineNumber: 10,
        columnNumber: 10
    }, this);
}
_c = Sheet;
function SheetTrigger({ ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$dialog$40$1$2e$1$2e$_3c24438a856d60dc4321c37f337cee45$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Trigger"], {
        "data-slot": "sheet-trigger",
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/sheet.tsx",
        lineNumber: 16,
        columnNumber: 10
    }, this);
}
_c1 = SheetTrigger;
function SheetClose({ ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$dialog$40$1$2e$1$2e$_3c24438a856d60dc4321c37f337cee45$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Close"], {
        "data-slot": "sheet-close",
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/sheet.tsx",
        lineNumber: 22,
        columnNumber: 10
    }, this);
}
_c2 = SheetClose;
function SheetPortal({ ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$dialog$40$1$2e$1$2e$_3c24438a856d60dc4321c37f337cee45$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Portal"], {
        "data-slot": "sheet-portal",
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/sheet.tsx",
        lineNumber: 28,
        columnNumber: 10
    }, this);
}
_c3 = SheetPortal;
function SheetOverlay({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$dialog$40$1$2e$1$2e$_3c24438a856d60dc4321c37f337cee45$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Overlay"], {
        "data-slot": "sheet-overlay",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/50', className),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/sheet.tsx",
        lineNumber: 36,
        columnNumber: 5
    }, this);
}
_c4 = SheetOverlay;
function SheetContent({ className, children, side = 'right', ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SheetPortal, {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SheetOverlay, {}, void 0, false, {
                fileName: "[project]/components/ui/sheet.tsx",
                lineNumber: 57,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$dialog$40$1$2e$1$2e$_3c24438a856d60dc4321c37f337cee45$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Content"], {
                "data-slot": "sheet-content",
                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('bg-background data-[state=open]:animate-in data-[state=closed]:animate-out fixed z-50 flex flex-col gap-4 shadow-lg transition ease-in-out data-[state=closed]:duration-300 data-[state=open]:duration-500', side === 'right' && 'data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right inset-y-0 right-0 h-full w-3/4 border-l sm:max-w-sm', side === 'left' && 'data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left inset-y-0 left-0 h-full w-3/4 border-r sm:max-w-sm', side === 'top' && 'data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top inset-x-0 top-0 h-auto border-b', side === 'bottom' && 'data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom inset-x-0 bottom-0 h-auto border-t', className),
                ...props,
                children: [
                    children,
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$dialog$40$1$2e$1$2e$_3c24438a856d60dc4321c37f337cee45$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Close"], {
                        className: "ring-offset-background focus:ring-ring data-[state=open]:bg-secondary absolute top-4 right-4 rounded-xs opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$454$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__XIcon$3e$__["XIcon"], {
                                className: "size-4"
                            }, void 0, false, {
                                fileName: "[project]/components/ui/sheet.tsx",
                                lineNumber: 76,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "sr-only",
                                children: "Close"
                            }, void 0, false, {
                                fileName: "[project]/components/ui/sheet.tsx",
                                lineNumber: 77,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/ui/sheet.tsx",
                        lineNumber: 75,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/ui/sheet.tsx",
                lineNumber: 58,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/ui/sheet.tsx",
        lineNumber: 56,
        columnNumber: 5
    }, this);
}
_c5 = SheetContent;
function SheetHeader({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        "data-slot": "sheet-header",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('flex flex-col gap-1.5 p-4', className),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/sheet.tsx",
        lineNumber: 86,
        columnNumber: 5
    }, this);
}
_c6 = SheetHeader;
function SheetFooter({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        "data-slot": "sheet-footer",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('mt-auto flex flex-col gap-2 p-4', className),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/sheet.tsx",
        lineNumber: 96,
        columnNumber: 5
    }, this);
}
_c7 = SheetFooter;
function SheetTitle({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$dialog$40$1$2e$1$2e$_3c24438a856d60dc4321c37f337cee45$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Title"], {
        "data-slot": "sheet-title",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('text-foreground font-semibold', className),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/sheet.tsx",
        lineNumber: 109,
        columnNumber: 5
    }, this);
}
_c8 = SheetTitle;
function SheetDescription({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$dialog$40$1$2e$1$2e$_3c24438a856d60dc4321c37f337cee45$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Description"], {
        "data-slot": "sheet-description",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('text-muted-foreground text-sm', className),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/sheet.tsx",
        lineNumber: 122,
        columnNumber: 5
    }, this);
}
_c9 = SheetDescription;
;
var _c, _c1, _c2, _c3, _c4, _c5, _c6, _c7, _c8, _c9;
__turbopack_context__.k.register(_c, "Sheet");
__turbopack_context__.k.register(_c1, "SheetTrigger");
__turbopack_context__.k.register(_c2, "SheetClose");
__turbopack_context__.k.register(_c3, "SheetPortal");
__turbopack_context__.k.register(_c4, "SheetOverlay");
__turbopack_context__.k.register(_c5, "SheetContent");
__turbopack_context__.k.register(_c6, "SheetHeader");
__turbopack_context__.k.register(_c7, "SheetFooter");
__turbopack_context__.k.register(_c8, "SheetTitle");
__turbopack_context__.k.register(_c9, "SheetDescription");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/ui/skeleton.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Skeleton",
    ()=>Skeleton
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.10_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/utils.ts [app-client] (ecmascript)");
;
;
function Skeleton({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        "data-slot": "skeleton",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('bg-accent animate-pulse rounded-md', className),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/skeleton.tsx",
        lineNumber: 5,
        columnNumber: 5
    }, this);
}
_c = Skeleton;
;
var _c;
__turbopack_context__.k.register(_c, "Skeleton");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/ui/tooltip.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Tooltip",
    ()=>Tooltip,
    "TooltipContent",
    ()=>TooltipContent,
    "TooltipProvider",
    ()=>TooltipProvider,
    "TooltipTrigger",
    ()=>TooltipTrigger
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.10_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$tooltip$40$1$2e$1_0114341443fb0ef870f8045dd6e0bbe2$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$tooltip$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@radix-ui+react-tooltip@1.1_0114341443fb0ef870f8045dd6e0bbe2/node_modules/@radix-ui/react-tooltip/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/utils.ts [app-client] (ecmascript)");
'use client';
;
;
;
function TooltipProvider({ delayDuration = 0, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$tooltip$40$1$2e$1_0114341443fb0ef870f8045dd6e0bbe2$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$tooltip$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Provider"], {
        "data-slot": "tooltip-provider",
        delayDuration: delayDuration,
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/tooltip.tsx",
        lineNumber: 13,
        columnNumber: 5
    }, this);
}
_c = TooltipProvider;
function Tooltip({ ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(TooltipProvider, {
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$tooltip$40$1$2e$1_0114341443fb0ef870f8045dd6e0bbe2$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$tooltip$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Root"], {
            "data-slot": "tooltip",
            ...props
        }, void 0, false, {
            fileName: "[project]/components/ui/tooltip.tsx",
            lineNumber: 26,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/components/ui/tooltip.tsx",
        lineNumber: 25,
        columnNumber: 5
    }, this);
}
_c1 = Tooltip;
function TooltipTrigger({ ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$tooltip$40$1$2e$1_0114341443fb0ef870f8045dd6e0bbe2$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$tooltip$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Trigger"], {
        "data-slot": "tooltip-trigger",
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/tooltip.tsx",
        lineNumber: 34,
        columnNumber: 10
    }, this);
}
_c2 = TooltipTrigger;
function TooltipContent({ className, sideOffset = 0, children, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$tooltip$40$1$2e$1_0114341443fb0ef870f8045dd6e0bbe2$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$tooltip$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Portal"], {
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$tooltip$40$1$2e$1_0114341443fb0ef870f8045dd6e0bbe2$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$tooltip$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Content"], {
            "data-slot": "tooltip-content",
            sideOffset: sideOffset,
            className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('bg-foreground text-background animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 w-fit origin-(--radix-tooltip-content-transform-origin) rounded-md px-3 py-1.5 text-xs text-balance', className),
            ...props,
            children: [
                children,
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$tooltip$40$1$2e$1_0114341443fb0ef870f8045dd6e0bbe2$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$tooltip$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Arrow"], {
                    className: "bg-foreground fill-foreground z-50 size-2.5 translate-y-[calc(-50%_-_2px)] rotate-45 rounded-[2px]"
                }, void 0, false, {
                    fileName: "[project]/components/ui/tooltip.tsx",
                    lineNumber: 55,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/components/ui/tooltip.tsx",
            lineNumber: 45,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/components/ui/tooltip.tsx",
        lineNumber: 44,
        columnNumber: 5
    }, this);
}
_c3 = TooltipContent;
;
var _c, _c1, _c2, _c3;
__turbopack_context__.k.register(_c, "TooltipProvider");
__turbopack_context__.k.register(_c1, "Tooltip");
__turbopack_context__.k.register(_c2, "TooltipTrigger");
__turbopack_context__.k.register(_c3, "TooltipContent");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/ui/sidebar.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Sidebar",
    ()=>Sidebar,
    "SidebarContent",
    ()=>SidebarContent,
    "SidebarFooter",
    ()=>SidebarFooter,
    "SidebarGroup",
    ()=>SidebarGroup,
    "SidebarGroupAction",
    ()=>SidebarGroupAction,
    "SidebarGroupContent",
    ()=>SidebarGroupContent,
    "SidebarGroupLabel",
    ()=>SidebarGroupLabel,
    "SidebarHeader",
    ()=>SidebarHeader,
    "SidebarInput",
    ()=>SidebarInput,
    "SidebarInset",
    ()=>SidebarInset,
    "SidebarMenu",
    ()=>SidebarMenu,
    "SidebarMenuAction",
    ()=>SidebarMenuAction,
    "SidebarMenuBadge",
    ()=>SidebarMenuBadge,
    "SidebarMenuButton",
    ()=>SidebarMenuButton,
    "SidebarMenuItem",
    ()=>SidebarMenuItem,
    "SidebarMenuSkeleton",
    ()=>SidebarMenuSkeleton,
    "SidebarMenuSub",
    ()=>SidebarMenuSub,
    "SidebarMenuSubButton",
    ()=>SidebarMenuSubButton,
    "SidebarMenuSubItem",
    ()=>SidebarMenuSubItem,
    "SidebarProvider",
    ()=>SidebarProvider,
    "SidebarRail",
    ()=>SidebarRail,
    "SidebarSeparator",
    ()=>SidebarSeparator,
    "SidebarTrigger",
    ()=>SidebarTrigger,
    "useSidebar",
    ()=>useSidebar
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.10_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.10_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$slot$40$1$2e$1$2e$1_$40$types$2b$react$40$19$2e$0$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$slot$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@radix-ui+react-slot@1.1.1_@types+react@19.0.0_react@19.2.0/node_modules/@radix-ui/react-slot/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$class$2d$variance$2d$authority$40$0$2e$7$2e$1$2f$node_modules$2f$class$2d$variance$2d$authority$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/class-variance-authority@0.7.1/node_modules/class-variance-authority/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$454$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$panel$2d$left$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__PanelLeftIcon$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.454.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/panel-left.js [app-client] (ecmascript) <export default as PanelLeftIcon>");
var __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$use$2d$mobile$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/hooks/use-mobile.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/utils.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/button.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/input.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$separator$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/separator.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$sheet$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/sheet.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$skeleton$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/skeleton.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$tooltip$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/tooltip.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature(), _s2 = __turbopack_context__.k.signature(), _s3 = __turbopack_context__.k.signature(), _s4 = __turbopack_context__.k.signature(), _s5 = __turbopack_context__.k.signature(), _s6 = __turbopack_context__.k.signature();
'use client';
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
const SIDEBAR_COOKIE_NAME = 'sidebar_state';
const SIDEBAR_COOKIE_MAX_AGE = 60 * 60 * 24 * 7;
const SIDEBAR_WIDTH = '16rem';
const SIDEBAR_WIDTH_MOBILE = '18rem';
const SIDEBAR_WIDTH_ICON = '3rem';
const SIDEBAR_KEYBOARD_SHORTCUT = 'b';
const SidebarContext = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createContext"](null);
function useSidebar() {
    _s();
    const context = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContext"](SidebarContext);
    if (!context) {
        throw new Error('useSidebar must be used within a SidebarProvider.');
    }
    return context;
}
_s(useSidebar, "b9L3QQ+jgeyIrH0NfHrJ8nn7VMU=");
function SidebarProvider({ defaultOpen = true, open: openProp, onOpenChange: setOpenProp, className, style, children, ...props }) {
    _s1();
    const isMobile = (0, __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$use$2d$mobile$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useIsMobile"])();
    const [openMobile, setOpenMobile] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"](false);
    // This is the internal state of the sidebar.
    // We use openProp and setOpenProp for control from outside the component.
    const [_open, _setOpen] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"](defaultOpen);
    const open = openProp ?? _open;
    const setOpen = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"]({
        "SidebarProvider.useCallback[setOpen]": (value)=>{
            const openState = typeof value === 'function' ? value(open) : value;
            if (setOpenProp) {
                setOpenProp(openState);
            } else {
                _setOpen(openState);
            }
            // This sets the cookie to keep the sidebar state.
            document.cookie = `${SIDEBAR_COOKIE_NAME}=${openState}; path=/; max-age=${SIDEBAR_COOKIE_MAX_AGE}`;
        }
    }["SidebarProvider.useCallback[setOpen]"], [
        setOpenProp,
        open
    ]);
    // Helper to toggle the sidebar.
    const toggleSidebar = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"]({
        "SidebarProvider.useCallback[toggleSidebar]": ()=>{
            return isMobile ? setOpenMobile({
                "SidebarProvider.useCallback[toggleSidebar]": (open)=>!open
            }["SidebarProvider.useCallback[toggleSidebar]"]) : setOpen({
                "SidebarProvider.useCallback[toggleSidebar]": (open)=>!open
            }["SidebarProvider.useCallback[toggleSidebar]"]);
        }
    }["SidebarProvider.useCallback[toggleSidebar]"], [
        isMobile,
        setOpen,
        setOpenMobile
    ]);
    // Adds a keyboard shortcut to toggle the sidebar.
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"]({
        "SidebarProvider.useEffect": ()=>{
            const handleKeyDown = {
                "SidebarProvider.useEffect.handleKeyDown": (event)=>{
                    if (event.key === SIDEBAR_KEYBOARD_SHORTCUT && (event.metaKey || event.ctrlKey)) {
                        event.preventDefault();
                        toggleSidebar();
                    }
                }
            }["SidebarProvider.useEffect.handleKeyDown"];
            window.addEventListener('keydown', handleKeyDown);
            return ({
                "SidebarProvider.useEffect": ()=>window.removeEventListener('keydown', handleKeyDown)
            })["SidebarProvider.useEffect"];
        }
    }["SidebarProvider.useEffect"], [
        toggleSidebar
    ]);
    // We add a state so that we can do data-state="expanded" or "collapsed".
    // This makes it easier to style the sidebar with Tailwind classes.
    const state = open ? 'expanded' : 'collapsed';
    const contextValue = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"]({
        "SidebarProvider.useMemo[contextValue]": ()=>({
                state,
                open,
                setOpen,
                isMobile,
                openMobile,
                setOpenMobile,
                toggleSidebar
            })
    }["SidebarProvider.useMemo[contextValue]"], [
        state,
        open,
        setOpen,
        isMobile,
        openMobile,
        setOpenMobile,
        toggleSidebar
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SidebarContext.Provider, {
        value: contextValue,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$tooltip$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TooltipProvider"], {
            delayDuration: 0,
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                "data-slot": "sidebar-wrapper",
                style: {
                    '--sidebar-width': SIDEBAR_WIDTH,
                    '--sidebar-width-icon': SIDEBAR_WIDTH_ICON,
                    ...style
                },
                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('group/sidebar-wrapper has-data-[variant=inset]:bg-sidebar flex min-h-svh w-full', className),
                ...props,
                children: children
            }, void 0, false, {
                fileName: "[project]/components/ui/sidebar.tsx",
                lineNumber: 132,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/components/ui/sidebar.tsx",
            lineNumber: 131,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/components/ui/sidebar.tsx",
        lineNumber: 130,
        columnNumber: 5
    }, this);
}
_s1(SidebarProvider, "QSOkjq1AvKFJW5+zwiK52jPX7zI=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$use$2d$mobile$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useIsMobile"]
    ];
});
_c = SidebarProvider;
function Sidebar({ side = 'left', variant = 'sidebar', collapsible = 'offcanvas', className, children, ...props }) {
    _s2();
    const { isMobile, state, openMobile, setOpenMobile } = useSidebar();
    if (collapsible === 'none') {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            "data-slot": "sidebar",
            className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('bg-sidebar text-sidebar-foreground flex h-full w-(--sidebar-width) flex-col', className),
            ...props,
            children: children
        }, void 0, false, {
            fileName: "[project]/components/ui/sidebar.tsx",
            lineNumber: 170,
            columnNumber: 7
        }, this);
    }
    if (isMobile) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$sheet$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Sheet"], {
            open: openMobile,
            onOpenChange: setOpenMobile,
            ...props,
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$sheet$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SheetContent"], {
                "data-sidebar": "sidebar",
                "data-slot": "sidebar",
                "data-mobile": "true",
                className: "bg-sidebar text-sidebar-foreground w-(--sidebar-width) p-0 [&>button]:hidden",
                style: {
                    '--sidebar-width': SIDEBAR_WIDTH_MOBILE
                },
                side: side,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$sheet$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SheetHeader"], {
                        className: "sr-only",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$sheet$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SheetTitle"], {
                                children: "Sidebar"
                            }, void 0, false, {
                                fileName: "[project]/components/ui/sidebar.tsx",
                                lineNumber: 199,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$sheet$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SheetDescription"], {
                                children: "Displays the mobile sidebar."
                            }, void 0, false, {
                                fileName: "[project]/components/ui/sidebar.tsx",
                                lineNumber: 200,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/ui/sidebar.tsx",
                        lineNumber: 198,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex h-full w-full flex-col",
                        children: children
                    }, void 0, false, {
                        fileName: "[project]/components/ui/sidebar.tsx",
                        lineNumber: 202,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/ui/sidebar.tsx",
                lineNumber: 186,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/components/ui/sidebar.tsx",
            lineNumber: 185,
            columnNumber: 7
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "group peer text-sidebar-foreground hidden md:block",
        "data-state": state,
        "data-collapsible": state === 'collapsed' ? collapsible : '',
        "data-variant": variant,
        "data-side": side,
        "data-slot": "sidebar",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                "data-slot": "sidebar-gap",
                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('relative w-(--sidebar-width) bg-transparent transition-[width] duration-200 ease-linear', 'group-data-[collapsible=offcanvas]:w-0', 'group-data-[side=right]:rotate-180', variant === 'floating' || variant === 'inset' ? 'group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)+(--spacing(4)))]' : 'group-data-[collapsible=icon]:w-(--sidebar-width-icon)')
            }, void 0, false, {
                fileName: "[project]/components/ui/sidebar.tsx",
                lineNumber: 218,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                "data-slot": "sidebar-container",
                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('fixed inset-y-0 z-10 hidden h-svh w-(--sidebar-width) transition-[left,right,width] duration-200 ease-linear md:flex', side === 'left' ? 'left-0 group-data-[collapsible=offcanvas]:left-[calc(var(--sidebar-width)*-1)]' : 'right-0 group-data-[collapsible=offcanvas]:right-[calc(var(--sidebar-width)*-1)]', // Adjust the padding for floating and inset variants.
                variant === 'floating' || variant === 'inset' ? 'p-2 group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)+(--spacing(4))+2px)]' : 'group-data-[collapsible=icon]:w-(--sidebar-width-icon) group-data-[side=left]:border-r group-data-[side=right]:border-l', className),
                ...props,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    "data-sidebar": "sidebar",
                    "data-slot": "sidebar-inner",
                    className: "bg-sidebar group-data-[variant=floating]:border-sidebar-border flex h-full w-full flex-col group-data-[variant=floating]:rounded-lg group-data-[variant=floating]:border group-data-[variant=floating]:shadow-sm",
                    children: children
                }, void 0, false, {
                    fileName: "[project]/components/ui/sidebar.tsx",
                    lineNumber: 244,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/ui/sidebar.tsx",
                lineNumber: 229,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/ui/sidebar.tsx",
        lineNumber: 209,
        columnNumber: 5
    }, this);
}
_s2(Sidebar, "hAL3+uRFwO9tnbDK50BUE5wZ71s=", false, function() {
    return [
        useSidebar
    ];
});
_c1 = Sidebar;
function SidebarTrigger({ className, onClick, ...props }) {
    _s3();
    const { toggleSidebar } = useSidebar();
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
        "data-sidebar": "trigger",
        "data-slot": "sidebar-trigger",
        variant: "ghost",
        size: "icon",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('size-7', className),
        onClick: (event)=>{
            onClick?.(event);
            toggleSidebar();
        },
        ...props,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$454$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$panel$2d$left$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__PanelLeftIcon$3e$__["PanelLeftIcon"], {}, void 0, false, {
                fileName: "[project]/components/ui/sidebar.tsx",
                lineNumber: 276,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "sr-only",
                children: "Toggle Sidebar"
            }, void 0, false, {
                fileName: "[project]/components/ui/sidebar.tsx",
                lineNumber: 277,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/ui/sidebar.tsx",
        lineNumber: 264,
        columnNumber: 5
    }, this);
}
_s3(SidebarTrigger, "dRnjPhQbCChcVGr4xvQkpNxnqyg=", false, function() {
    return [
        useSidebar
    ];
});
_c2 = SidebarTrigger;
function SidebarRail({ className, ...props }) {
    _s4();
    const { toggleSidebar } = useSidebar();
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
        "data-sidebar": "rail",
        "data-slot": "sidebar-rail",
        "aria-label": "Toggle Sidebar",
        tabIndex: -1,
        onClick: toggleSidebar,
        title: "Toggle Sidebar",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('hover:after:bg-sidebar-border absolute inset-y-0 z-20 hidden w-4 -translate-x-1/2 transition-all ease-linear group-data-[side=left]:-right-4 group-data-[side=right]:left-0 after:absolute after:inset-y-0 after:left-1/2 after:w-[2px] sm:flex', 'in-data-[side=left]:cursor-w-resize in-data-[side=right]:cursor-e-resize', '[[data-side=left][data-state=collapsed]_&]:cursor-e-resize [[data-side=right][data-state=collapsed]_&]:cursor-w-resize', 'hover:group-data-[collapsible=offcanvas]:bg-sidebar group-data-[collapsible=offcanvas]:translate-x-0 group-data-[collapsible=offcanvas]:after:left-full', '[[data-side=left][data-collapsible=offcanvas]_&]:-right-2', '[[data-side=right][data-collapsible=offcanvas]_&]:-left-2', className),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/sidebar.tsx",
        lineNumber: 286,
        columnNumber: 5
    }, this);
}
_s4(SidebarRail, "dRnjPhQbCChcVGr4xvQkpNxnqyg=", false, function() {
    return [
        useSidebar
    ];
});
_c3 = SidebarRail;
function SidebarInset({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
        "data-slot": "sidebar-inset",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('bg-background relative flex w-full flex-1 flex-col', 'md:peer-data-[variant=inset]:m-2 md:peer-data-[variant=inset]:ml-0 md:peer-data-[variant=inset]:rounded-xl md:peer-data-[variant=inset]:shadow-sm md:peer-data-[variant=inset]:peer-data-[state=collapsed]:ml-2', className),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/sidebar.tsx",
        lineNumber: 309,
        columnNumber: 5
    }, this);
}
_c4 = SidebarInset;
function SidebarInput({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Input"], {
        "data-slot": "sidebar-input",
        "data-sidebar": "input",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('bg-background h-8 w-full shadow-none', className),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/sidebar.tsx",
        lineNumber: 326,
        columnNumber: 5
    }, this);
}
_c5 = SidebarInput;
function SidebarHeader({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        "data-slot": "sidebar-header",
        "data-sidebar": "header",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('flex flex-col gap-2 p-2', className),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/sidebar.tsx",
        lineNumber: 337,
        columnNumber: 5
    }, this);
}
_c6 = SidebarHeader;
function SidebarFooter({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        "data-slot": "sidebar-footer",
        "data-sidebar": "footer",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('flex flex-col gap-2 p-2', className),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/sidebar.tsx",
        lineNumber: 348,
        columnNumber: 5
    }, this);
}
_c7 = SidebarFooter;
function SidebarSeparator({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$separator$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Separator"], {
        "data-slot": "sidebar-separator",
        "data-sidebar": "separator",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('bg-sidebar-border mx-2 w-auto', className),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/sidebar.tsx",
        lineNumber: 362,
        columnNumber: 5
    }, this);
}
_c8 = SidebarSeparator;
function SidebarContent({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        "data-slot": "sidebar-content",
        "data-sidebar": "content",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('flex min-h-0 flex-1 flex-col gap-2 overflow-auto group-data-[collapsible=icon]:overflow-hidden', className),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/sidebar.tsx",
        lineNumber: 373,
        columnNumber: 5
    }, this);
}
_c9 = SidebarContent;
function SidebarGroup({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        "data-slot": "sidebar-group",
        "data-sidebar": "group",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('relative flex w-full min-w-0 flex-col p-2', className),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/sidebar.tsx",
        lineNumber: 387,
        columnNumber: 5
    }, this);
}
_c10 = SidebarGroup;
function SidebarGroupLabel({ className, asChild = false, ...props }) {
    const Comp = asChild ? __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$slot$40$1$2e$1$2e$1_$40$types$2b$react$40$19$2e$0$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$slot$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Slot"] : 'div';
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Comp, {
        "data-slot": "sidebar-group-label",
        "data-sidebar": "group-label",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('text-sidebar-foreground/70 ring-sidebar-ring flex h-8 shrink-0 items-center rounded-md px-2 text-xs font-medium outline-hidden transition-[margin,opacity] duration-200 ease-linear focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0', 'group-data-[collapsible=icon]:-mt-8 group-data-[collapsible=icon]:opacity-0', className),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/sidebar.tsx",
        lineNumber: 404,
        columnNumber: 5
    }, this);
}
_c11 = SidebarGroupLabel;
function SidebarGroupAction({ className, asChild = false, ...props }) {
    const Comp = asChild ? __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$slot$40$1$2e$1$2e$1_$40$types$2b$react$40$19$2e$0$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$slot$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Slot"] : 'button';
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Comp, {
        "data-slot": "sidebar-group-action",
        "data-sidebar": "group-action",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('text-sidebar-foreground ring-sidebar-ring hover:bg-sidebar-accent hover:text-sidebar-accent-foreground absolute top-3.5 right-3 flex aspect-square w-5 items-center justify-center rounded-md p-0 outline-hidden transition-transform focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0', // Increases the hit area of the button on mobile.
        'after:absolute after:-inset-2 md:after:hidden', 'group-data-[collapsible=icon]:hidden', className),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/sidebar.tsx",
        lineNumber: 425,
        columnNumber: 5
    }, this);
}
_c12 = SidebarGroupAction;
function SidebarGroupContent({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        "data-slot": "sidebar-group-content",
        "data-sidebar": "group-content",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('w-full text-sm', className),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/sidebar.tsx",
        lineNumber: 445,
        columnNumber: 5
    }, this);
}
_c13 = SidebarGroupContent;
function SidebarMenu({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
        "data-slot": "sidebar-menu",
        "data-sidebar": "menu",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('flex w-full min-w-0 flex-col gap-1', className),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/sidebar.tsx",
        lineNumber: 456,
        columnNumber: 5
    }, this);
}
_c14 = SidebarMenu;
function SidebarMenuItem({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
        "data-slot": "sidebar-menu-item",
        "data-sidebar": "menu-item",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('group/menu-item relative', className),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/sidebar.tsx",
        lineNumber: 467,
        columnNumber: 5
    }, this);
}
_c15 = SidebarMenuItem;
const sidebarMenuButtonVariants = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$class$2d$variance$2d$authority$40$0$2e$7$2e$1$2f$node_modules$2f$class$2d$variance$2d$authority$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cva"])('peer/menu-button flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left text-sm outline-hidden ring-sidebar-ring transition-[width,height,padding] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 group-has-data-[sidebar=menu-action]/menu-item:pr-8 aria-disabled:pointer-events-none aria-disabled:opacity-50 data-[active=true]:bg-sidebar-accent data-[active=true]:font-medium data-[active=true]:text-sidebar-accent-foreground data-[state=open]:hover:bg-sidebar-accent data-[state=open]:hover:text-sidebar-accent-foreground group-data-[collapsible=icon]:size-8! group-data-[collapsible=icon]:p-2! [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0', {
    variants: {
        variant: {
            default: 'hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
            outline: 'bg-background shadow-[0_0_0_1px_hsl(var(--sidebar-border))] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground hover:shadow-[0_0_0_1px_hsl(var(--sidebar-accent))]'
        },
        size: {
            default: 'h-8 text-sm',
            sm: 'h-7 text-xs',
            lg: 'h-12 text-sm group-data-[collapsible=icon]:p-0!'
        }
    },
    defaultVariants: {
        variant: 'default',
        size: 'default'
    }
});
function SidebarMenuButton({ asChild = false, isActive = false, variant = 'default', size = 'default', tooltip, className, ...props }) {
    _s5();
    const Comp = asChild ? __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$slot$40$1$2e$1$2e$1_$40$types$2b$react$40$19$2e$0$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$slot$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Slot"] : 'button';
    const { isMobile, state } = useSidebar();
    const button = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Comp, {
        "data-slot": "sidebar-menu-button",
        "data-sidebar": "menu-button",
        "data-size": size,
        "data-active": isActive,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])(sidebarMenuButtonVariants({
            variant,
            size
        }), className),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/sidebar.tsx",
        lineNumber: 515,
        columnNumber: 5
    }, this);
    if (!tooltip) {
        return button;
    }
    if (typeof tooltip === 'string') {
        tooltip = {
            children: tooltip
        };
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$tooltip$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Tooltip"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$tooltip$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TooltipTrigger"], {
                asChild: true,
                children: button
            }, void 0, false, {
                fileName: "[project]/components/ui/sidebar.tsx",
                lineNumber: 537,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$tooltip$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TooltipContent"], {
                side: "right",
                align: "center",
                hidden: state !== 'collapsed' || isMobile,
                ...tooltip
            }, void 0, false, {
                fileName: "[project]/components/ui/sidebar.tsx",
                lineNumber: 538,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/ui/sidebar.tsx",
        lineNumber: 536,
        columnNumber: 5
    }, this);
}
_s5(SidebarMenuButton, "DSCdbs8JtpmKVxCYgM7sPAZNgB0=", false, function() {
    return [
        useSidebar
    ];
});
_c16 = SidebarMenuButton;
function SidebarMenuAction({ className, asChild = false, showOnHover = false, ...props }) {
    const Comp = asChild ? __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$slot$40$1$2e$1$2e$1_$40$types$2b$react$40$19$2e$0$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$slot$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Slot"] : 'button';
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Comp, {
        "data-slot": "sidebar-menu-action",
        "data-sidebar": "menu-action",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('text-sidebar-foreground ring-sidebar-ring hover:bg-sidebar-accent hover:text-sidebar-accent-foreground peer-hover/menu-button:text-sidebar-accent-foreground absolute top-1.5 right-1 flex aspect-square w-5 items-center justify-center rounded-md p-0 outline-hidden transition-transform focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0', // Increases the hit area of the button on mobile.
        'after:absolute after:-inset-2 md:after:hidden', 'peer-data-[size=sm]/menu-button:top-1', 'peer-data-[size=default]/menu-button:top-1.5', 'peer-data-[size=lg]/menu-button:top-2.5', 'group-data-[collapsible=icon]:hidden', showOnHover && 'peer-data-[active=true]/menu-button:text-sidebar-accent-foreground group-focus-within/menu-item:opacity-100 group-hover/menu-item:opacity-100 data-[state=open]:opacity-100 md:opacity-0', className),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/sidebar.tsx",
        lineNumber: 560,
        columnNumber: 5
    }, this);
}
_c17 = SidebarMenuAction;
function SidebarMenuBadge({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        "data-slot": "sidebar-menu-badge",
        "data-sidebar": "menu-badge",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('text-sidebar-foreground pointer-events-none absolute right-1 flex h-5 min-w-5 items-center justify-center rounded-md px-1 text-xs font-medium tabular-nums select-none', 'peer-hover/menu-button:text-sidebar-accent-foreground peer-data-[active=true]/menu-button:text-sidebar-accent-foreground', 'peer-data-[size=sm]/menu-button:top-1', 'peer-data-[size=default]/menu-button:top-1.5', 'peer-data-[size=lg]/menu-button:top-2.5', 'group-data-[collapsible=icon]:hidden', className),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/sidebar.tsx",
        lineNumber: 585,
        columnNumber: 5
    }, this);
}
_c18 = SidebarMenuBadge;
function SidebarMenuSkeleton({ className, showIcon = false, ...props }) {
    _s6();
    // Random width between 50 to 90%.
    const width = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"]({
        "SidebarMenuSkeleton.useMemo[width]": ()=>{
            return `${Math.floor(Math.random() * 40) + 50}%`;
        }
    }["SidebarMenuSkeleton.useMemo[width]"], []);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        "data-slot": "sidebar-menu-skeleton",
        "data-sidebar": "menu-skeleton",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('flex h-8 items-center gap-2 rounded-md px-2', className),
        ...props,
        children: [
            showIcon && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$skeleton$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Skeleton"], {
                className: "size-4 rounded-md",
                "data-sidebar": "menu-skeleton-icon"
            }, void 0, false, {
                fileName: "[project]/components/ui/sidebar.tsx",
                lineNumber: 622,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$skeleton$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Skeleton"], {
                className: "h-4 max-w-(--skeleton-width) flex-1",
                "data-sidebar": "menu-skeleton-text",
                style: {
                    '--skeleton-width': width
                }
            }, void 0, false, {
                fileName: "[project]/components/ui/sidebar.tsx",
                lineNumber: 627,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/ui/sidebar.tsx",
        lineNumber: 615,
        columnNumber: 5
    }, this);
}
_s6(SidebarMenuSkeleton, "nKFjX4dxbYo91VAj5VdWQ1XUe3I=");
_c19 = SidebarMenuSkeleton;
function SidebarMenuSub({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
        "data-slot": "sidebar-menu-sub",
        "data-sidebar": "menu-sub",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('border-sidebar-border mx-3.5 flex min-w-0 translate-x-px flex-col gap-1 border-l px-2.5 py-0.5', 'group-data-[collapsible=icon]:hidden', className),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/sidebar.tsx",
        lineNumber: 642,
        columnNumber: 5
    }, this);
}
_c20 = SidebarMenuSub;
function SidebarMenuSubItem({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
        "data-slot": "sidebar-menu-sub-item",
        "data-sidebar": "menu-sub-item",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('group/menu-sub-item relative', className),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/sidebar.tsx",
        lineNumber: 660,
        columnNumber: 5
    }, this);
}
_c21 = SidebarMenuSubItem;
function SidebarMenuSubButton({ asChild = false, size = 'md', isActive = false, className, ...props }) {
    const Comp = asChild ? __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$slot$40$1$2e$1$2e$1_$40$types$2b$react$40$19$2e$0$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$slot$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Slot"] : 'a';
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Comp, {
        "data-slot": "sidebar-menu-sub-button",
        "data-sidebar": "menu-sub-button",
        "data-size": size,
        "data-active": isActive,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('text-sidebar-foreground ring-sidebar-ring hover:bg-sidebar-accent hover:text-sidebar-accent-foreground active:bg-sidebar-accent active:text-sidebar-accent-foreground [&>svg]:text-sidebar-accent-foreground flex h-7 min-w-0 -translate-x-px items-center gap-2 overflow-hidden rounded-md px-2 outline-hidden focus-visible:ring-2 disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0', 'data-[active=true]:bg-sidebar-accent data-[active=true]:text-sidebar-accent-foreground', size === 'sm' && 'text-xs', size === 'md' && 'text-sm', 'group-data-[collapsible=icon]:hidden', className),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/sidebar.tsx",
        lineNumber: 683,
        columnNumber: 5
    }, this);
}
_c22 = SidebarMenuSubButton;
;
var _c, _c1, _c2, _c3, _c4, _c5, _c6, _c7, _c8, _c9, _c10, _c11, _c12, _c13, _c14, _c15, _c16, _c17, _c18, _c19, _c20, _c21, _c22;
__turbopack_context__.k.register(_c, "SidebarProvider");
__turbopack_context__.k.register(_c1, "Sidebar");
__turbopack_context__.k.register(_c2, "SidebarTrigger");
__turbopack_context__.k.register(_c3, "SidebarRail");
__turbopack_context__.k.register(_c4, "SidebarInset");
__turbopack_context__.k.register(_c5, "SidebarInput");
__turbopack_context__.k.register(_c6, "SidebarHeader");
__turbopack_context__.k.register(_c7, "SidebarFooter");
__turbopack_context__.k.register(_c8, "SidebarSeparator");
__turbopack_context__.k.register(_c9, "SidebarContent");
__turbopack_context__.k.register(_c10, "SidebarGroup");
__turbopack_context__.k.register(_c11, "SidebarGroupLabel");
__turbopack_context__.k.register(_c12, "SidebarGroupAction");
__turbopack_context__.k.register(_c13, "SidebarGroupContent");
__turbopack_context__.k.register(_c14, "SidebarMenu");
__turbopack_context__.k.register(_c15, "SidebarMenuItem");
__turbopack_context__.k.register(_c16, "SidebarMenuButton");
__turbopack_context__.k.register(_c17, "SidebarMenuAction");
__turbopack_context__.k.register(_c18, "SidebarMenuBadge");
__turbopack_context__.k.register(_c19, "SidebarMenuSkeleton");
__turbopack_context__.k.register(_c20, "SidebarMenuSub");
__turbopack_context__.k.register(_c21, "SidebarMenuSubItem");
__turbopack_context__.k.register(_c22, "SidebarMenuSubButton");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/ui/avatar.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Avatar",
    ()=>Avatar,
    "AvatarFallback",
    ()=>AvatarFallback,
    "AvatarImage",
    ()=>AvatarImage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.10_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$avatar$40$1$2e$1$2e$_ed99227a606b37d896202b002403fa66$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$avatar$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@radix-ui+react-avatar@1.1._ed99227a606b37d896202b002403fa66/node_modules/@radix-ui/react-avatar/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/utils.ts [app-client] (ecmascript)");
'use client';
;
;
;
function Avatar({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$avatar$40$1$2e$1$2e$_ed99227a606b37d896202b002403fa66$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$avatar$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Root"], {
        "data-slot": "avatar",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('relative flex size-8 shrink-0 overflow-hidden rounded-full', className),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/avatar.tsx",
        lineNumber: 13,
        columnNumber: 5
    }, this);
}
_c = Avatar;
function AvatarImage({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$avatar$40$1$2e$1$2e$_ed99227a606b37d896202b002403fa66$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$avatar$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Image"], {
        "data-slot": "avatar-image",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('aspect-square size-full', className),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/avatar.tsx",
        lineNumber: 29,
        columnNumber: 5
    }, this);
}
_c1 = AvatarImage;
function AvatarFallback({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$avatar$40$1$2e$1$2e$_ed99227a606b37d896202b002403fa66$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$avatar$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fallback"], {
        "data-slot": "avatar-fallback",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('bg-muted flex size-full items-center justify-center rounded-full', className),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/avatar.tsx",
        lineNumber: 42,
        columnNumber: 5
    }, this);
}
_c2 = AvatarFallback;
;
var _c, _c1, _c2;
__turbopack_context__.k.register(_c, "Avatar");
__turbopack_context__.k.register(_c1, "AvatarImage");
__turbopack_context__.k.register(_c2, "AvatarFallback");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/supabase/client.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "createClient",
    ()=>createClient
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.10_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$supabase$2b$ssr$40$0$2e$8$2e$0_$40$supabase$2b$supabase$2d$js$40$2$2e$89$2e$0$2f$node_modules$2f40$supabase$2f$ssr$2f$dist$2f$module$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@supabase+ssr@0.8.0_@supabase+supabase-js@2.89.0/node_modules/@supabase/ssr/dist/module/index.js [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$supabase$2b$ssr$40$0$2e$8$2e$0_$40$supabase$2b$supabase$2d$js$40$2$2e$89$2e$0$2f$node_modules$2f40$supabase$2f$ssr$2f$dist$2f$module$2f$createBrowserClient$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@supabase+ssr@0.8.0_@supabase+supabase-js@2.89.0/node_modules/@supabase/ssr/dist/module/createBrowserClient.js [app-client] (ecmascript)");
;
let client = null;
function createClient() {
    if (client) {
        return client;
    }
    client = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$supabase$2b$ssr$40$0$2e$8$2e$0_$40$supabase$2b$supabase$2d$js$40$2$2e$89$2e$0$2f$node_modules$2f40$supabase$2f$ssr$2f$dist$2f$module$2f$createBrowserClient$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createBrowserClient"])(("TURBOPACK compile-time value", "https://oylpnwofmqhkpckvzrqs.supabase.co"), ("TURBOPACK compile-time value", "sb_publishable_lC5prNOQpmecqW08_S21KQ_XYGB3yIy"));
    return client;
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/layout/app-sidebar.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AppSidebar",
    ()=>AppSidebar
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.10_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.10_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.10_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$454$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$layout$2d$dashboard$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__LayoutDashboard$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.454.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/layout-dashboard.js [app-client] (ecmascript) <export default as LayoutDashboard>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$454$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$users$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Users$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.454.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/users.js [app-client] (ecmascript) <export default as Users>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$454$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$building$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Building2$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.454.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/building-2.js [app-client] (ecmascript) <export default as Building2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$454$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$user$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__UserCircle$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.454.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/circle-user.js [app-client] (ecmascript) <export default as UserCircle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$454$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$settings$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Settings$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.454.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/settings.js [app-client] (ecmascript) <export default as Settings>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$454$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$log$2d$out$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__LogOut$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.454.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/log-out.js [app-client] (ecmascript) <export default as LogOut>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$454$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clock$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Clock$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.454.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/clock.js [app-client] (ecmascript) <export default as Clock>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$454$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$calendar$2d$days$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CalendarDays$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.454.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/calendar-days.js [app-client] (ecmascript) <export default as CalendarDays>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$454$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$square$2d$check$2d$big$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckSquare$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.454.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/square-check-big.js [app-client] (ecmascript) <export default as CheckSquare>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$454$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$wallet$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Wallet$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.454.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/wallet.js [app-client] (ecmascript) <export default as Wallet>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$454$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$receipt$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Receipt$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.454.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/receipt.js [app-client] (ecmascript) <export default as Receipt>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$454$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$spreadsheet$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FileSpreadsheet$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.454.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/file-spreadsheet.js [app-client] (ecmascript) <export default as FileSpreadsheet>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$454$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$coins$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Coins$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.454.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/coins.js [app-client] (ecmascript) <export default as Coins>");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$sidebar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/sidebar.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$avatar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/avatar.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/supabase/client.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
;
;
const mainNavItems = [
    {
        title: "Tổng quan",
        url: "/dashboard",
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$454$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$layout$2d$dashboard$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__LayoutDashboard$3e$__["LayoutDashboard"]
    },
    {
        title: "Chấm công",
        url: "/dashboard/attendance",
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$454$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clock$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Clock$3e$__["Clock"]
    },
    {
        title: "Nghỉ phép",
        url: "/dashboard/leave",
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$454$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$calendar$2d$days$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CalendarDays$3e$__["CalendarDays"]
    },
    {
        title: "Phiếu lương",
        url: "/dashboard/payslip",
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$454$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$receipt$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Receipt$3e$__["Receipt"]
    },
    {
        title: "Duyệt nghỉ phép",
        url: "/dashboard/leave-approval",
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$454$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$square$2d$check$2d$big$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckSquare$3e$__["CheckSquare"],
        roles: [
            "hr",
            "admin",
            "manager"
        ]
    },
    {
        title: "Quản lý chấm công",
        url: "/dashboard/attendance-management",
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$454$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$spreadsheet$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FileSpreadsheet$3e$__["FileSpreadsheet"],
        roles: [
            "hr",
            "admin"
        ]
    },
    {
        title: "Bảng lương",
        url: "/dashboard/payroll",
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$454$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$wallet$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Wallet$3e$__["Wallet"],
        roles: [
            "hr",
            "admin"
        ]
    },
    {
        title: "Phụ cấp",
        url: "/dashboard/allowances",
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$454$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$coins$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Coins$3e$__["Coins"],
        roles: [
            "hr",
            "admin"
        ]
    },
    {
        title: "Nhân viên",
        url: "/dashboard/employees",
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$454$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$users$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Users$3e$__["Users"],
        roles: [
            "hr",
            "admin",
            "manager"
        ]
    },
    {
        title: "Phòng ban",
        url: "/dashboard/departments",
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$454$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$building$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Building2$3e$__["Building2"]
    },
    {
        title: "Hồ sơ cá nhân",
        url: "/dashboard/profile",
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$454$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$user$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__UserCircle$3e$__["UserCircle"]
    }
];
function AppSidebar({ employee, userRoles }) {
    _s();
    const pathname = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"])();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const roleCodes = userRoles.map((ur)=>ur.role.code);
    const isHROrAdmin = roleCodes.includes("hr") || roleCodes.includes("admin");
    const isManager = roleCodes.includes("manager");
    const handleLogout = async ()=>{
        const supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createClient"])();
        await supabase.auth.signOut();
        router.push("/login");
        router.refresh();
    };
    const initials = employee?.full_name?.split(" ").map((n)=>n[0]).join("").toUpperCase().slice(0, 2) || "U";
    const filteredNavItems = mainNavItems.filter((item)=>{
        if (!item.roles) return true;
        return item.roles.some((role)=>roleCodes.includes(role));
    });
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$sidebar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Sidebar"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$sidebar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SidebarHeader"], {
                className: "border-b border-sidebar-border",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex items-center gap-3 px-2 py-3",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$454$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$users$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Users$3e$__["Users"], {
                                className: "h-5 w-5 text-white"
                            }, void 0, false, {
                                fileName: "[project]/components/layout/app-sidebar.tsx",
                                lineNumber: 125,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/components/layout/app-sidebar.tsx",
                            lineNumber: 124,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex flex-col",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "font-semibold text-sidebar-foreground",
                                    children: "HRM System"
                                }, void 0, false, {
                                    fileName: "[project]/components/layout/app-sidebar.tsx",
                                    lineNumber: 128,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "text-xs text-sidebar-foreground/60",
                                    children: "Phase 3"
                                }, void 0, false, {
                                    fileName: "[project]/components/layout/app-sidebar.tsx",
                                    lineNumber: 129,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/layout/app-sidebar.tsx",
                            lineNumber: 127,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/layout/app-sidebar.tsx",
                    lineNumber: 123,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/layout/app-sidebar.tsx",
                lineNumber: 122,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$sidebar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SidebarContent"], {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$sidebar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SidebarGroup"], {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$sidebar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SidebarGroupLabel"], {
                                children: "Menu"
                            }, void 0, false, {
                                fileName: "[project]/components/layout/app-sidebar.tsx",
                                lineNumber: 136,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$sidebar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SidebarGroupContent"], {
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$sidebar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SidebarMenu"], {
                                    children: filteredNavItems.map((item)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$sidebar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SidebarMenuItem"], {
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$sidebar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SidebarMenuButton"], {
                                                asChild: true,
                                                isActive: pathname === item.url || pathname.startsWith(item.url + "/"),
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                    href: item.url,
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(item.icon, {
                                                            className: "h-4 w-4"
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/layout/app-sidebar.tsx",
                                                            lineNumber: 143,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            children: item.title
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/layout/app-sidebar.tsx",
                                                            lineNumber: 144,
                                                            columnNumber: 23
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/components/layout/app-sidebar.tsx",
                                                    lineNumber: 142,
                                                    columnNumber: 21
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/components/layout/app-sidebar.tsx",
                                                lineNumber: 141,
                                                columnNumber: 19
                                            }, this)
                                        }, item.title, false, {
                                            fileName: "[project]/components/layout/app-sidebar.tsx",
                                            lineNumber: 140,
                                            columnNumber: 17
                                        }, this))
                                }, void 0, false, {
                                    fileName: "[project]/components/layout/app-sidebar.tsx",
                                    lineNumber: 138,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/components/layout/app-sidebar.tsx",
                                lineNumber: 137,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/layout/app-sidebar.tsx",
                        lineNumber: 135,
                        columnNumber: 9
                    }, this),
                    isHROrAdmin && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$sidebar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SidebarGroup"], {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$sidebar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SidebarGroupLabel"], {
                                children: "Quản trị"
                            }, void 0, false, {
                                fileName: "[project]/components/layout/app-sidebar.tsx",
                                lineNumber: 155,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$sidebar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SidebarGroupContent"], {
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$sidebar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SidebarMenu"], {
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$sidebar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SidebarMenuItem"], {
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$sidebar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SidebarMenuButton"], {
                                            asChild: true,
                                            isActive: pathname === "/dashboard/settings",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                href: "/dashboard/settings",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$454$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$settings$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Settings$3e$__["Settings"], {
                                                        className: "h-4 w-4"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/layout/app-sidebar.tsx",
                                                        lineNumber: 161,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        children: "Cài đặt"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/layout/app-sidebar.tsx",
                                                        lineNumber: 162,
                                                        columnNumber: 23
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/layout/app-sidebar.tsx",
                                                lineNumber: 160,
                                                columnNumber: 21
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/components/layout/app-sidebar.tsx",
                                            lineNumber: 159,
                                            columnNumber: 19
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/components/layout/app-sidebar.tsx",
                                        lineNumber: 158,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/components/layout/app-sidebar.tsx",
                                    lineNumber: 157,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/components/layout/app-sidebar.tsx",
                                lineNumber: 156,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/layout/app-sidebar.tsx",
                        lineNumber: 154,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/layout/app-sidebar.tsx",
                lineNumber: 134,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$sidebar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SidebarFooter"], {
                className: "border-t border-sidebar-border",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-3 px-4 py-3",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$avatar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Avatar"], {
                                className: "h-8 w-8",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$avatar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AvatarImage"], {
                                        src: employee?.avatar_url || "",
                                        alt: employee?.full_name || ""
                                    }, void 0, false, {
                                        fileName: "[project]/components/layout/app-sidebar.tsx",
                                        lineNumber: 175,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$avatar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AvatarFallback"], {
                                        className: "bg-indigo-100 text-indigo-600 text-sm",
                                        children: initials
                                    }, void 0, false, {
                                        fileName: "[project]/components/layout/app-sidebar.tsx",
                                        lineNumber: 176,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/layout/app-sidebar.tsx",
                                lineNumber: 174,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex flex-col flex-1 min-w-0",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-sm font-medium text-sidebar-foreground truncate",
                                        children: employee?.full_name || "User"
                                    }, void 0, false, {
                                        fileName: "[project]/components/layout/app-sidebar.tsx",
                                        lineNumber: 179,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-xs text-sidebar-foreground/60 truncate",
                                        children: employee?.email
                                    }, void 0, false, {
                                        fileName: "[project]/components/layout/app-sidebar.tsx",
                                        lineNumber: 182,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/layout/app-sidebar.tsx",
                                lineNumber: 178,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/layout/app-sidebar.tsx",
                        lineNumber: 173,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$sidebar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SidebarMenu"], {
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$sidebar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SidebarMenuItem"], {
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$sidebar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SidebarMenuButton"], {
                                onClick: handleLogout,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$454$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$log$2d$out$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__LogOut$3e$__["LogOut"], {
                                        className: "h-4 w-4"
                                    }, void 0, false, {
                                        fileName: "[project]/components/layout/app-sidebar.tsx",
                                        lineNumber: 188,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        children: "Đăng xuất"
                                    }, void 0, false, {
                                        fileName: "[project]/components/layout/app-sidebar.tsx",
                                        lineNumber: 189,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/layout/app-sidebar.tsx",
                                lineNumber: 187,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/components/layout/app-sidebar.tsx",
                            lineNumber: 186,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/components/layout/app-sidebar.tsx",
                        lineNumber: 185,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/layout/app-sidebar.tsx",
                lineNumber: 172,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$sidebar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SidebarRail"], {}, void 0, false, {
                fileName: "[project]/components/layout/app-sidebar.tsx",
                lineNumber: 195,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/layout/app-sidebar.tsx",
        lineNumber: 121,
        columnNumber: 5
    }, this);
}
_s(AppSidebar, "0h+B63IiVHeDT9bDhB3JTwv8ebY=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"]
    ];
});
_c = AppSidebar;
var _c;
__turbopack_context__.k.register(_c, "AppSidebar");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/ui/card.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Card",
    ()=>Card,
    "CardAction",
    ()=>CardAction,
    "CardContent",
    ()=>CardContent,
    "CardDescription",
    ()=>CardDescription,
    "CardFooter",
    ()=>CardFooter,
    "CardHeader",
    ()=>CardHeader,
    "CardTitle",
    ()=>CardTitle
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.10_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/utils.ts [app-client] (ecmascript)");
;
;
function Card({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        "data-slot": "card",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm', className),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/card.tsx",
        lineNumber: 7,
        columnNumber: 5
    }, this);
}
_c = Card;
function CardHeader({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        "data-slot": "card-header",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-2 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6', className),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/card.tsx",
        lineNumber: 20,
        columnNumber: 5
    }, this);
}
_c1 = CardHeader;
function CardTitle({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        "data-slot": "card-title",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('leading-none font-semibold', className),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/card.tsx",
        lineNumber: 33,
        columnNumber: 5
    }, this);
}
_c2 = CardTitle;
function CardDescription({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        "data-slot": "card-description",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('text-muted-foreground text-sm', className),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/card.tsx",
        lineNumber: 43,
        columnNumber: 5
    }, this);
}
_c3 = CardDescription;
function CardAction({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        "data-slot": "card-action",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('col-start-2 row-span-2 row-start-1 self-start justify-self-end', className),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/card.tsx",
        lineNumber: 53,
        columnNumber: 5
    }, this);
}
_c4 = CardAction;
function CardContent({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        "data-slot": "card-content",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('px-6', className),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/card.tsx",
        lineNumber: 66,
        columnNumber: 5
    }, this);
}
_c5 = CardContent;
function CardFooter({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        "data-slot": "card-footer",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('flex items-center px-6 [.border-t]:pt-6', className),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/card.tsx",
        lineNumber: 76,
        columnNumber: 5
    }, this);
}
_c6 = CardFooter;
;
var _c, _c1, _c2, _c3, _c4, _c5, _c6;
__turbopack_context__.k.register(_c, "Card");
__turbopack_context__.k.register(_c1, "CardHeader");
__turbopack_context__.k.register(_c2, "CardTitle");
__turbopack_context__.k.register(_c3, "CardDescription");
__turbopack_context__.k.register(_c4, "CardAction");
__turbopack_context__.k.register(_c5, "CardContent");
__turbopack_context__.k.register(_c6, "CardFooter");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/ui/table.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Table",
    ()=>Table,
    "TableBody",
    ()=>TableBody,
    "TableCaption",
    ()=>TableCaption,
    "TableCell",
    ()=>TableCell,
    "TableFooter",
    ()=>TableFooter,
    "TableHead",
    ()=>TableHead,
    "TableHeader",
    ()=>TableHeader,
    "TableRow",
    ()=>TableRow
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.10_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/utils.ts [app-client] (ecmascript)");
'use client';
;
;
function Table({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        "data-slot": "table-container",
        className: "relative w-full overflow-x-auto",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("table", {
            "data-slot": "table",
            className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('w-full caption-bottom text-sm', className),
            ...props
        }, void 0, false, {
            fileName: "[project]/components/ui/table.tsx",
            lineNumber: 13,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/components/ui/table.tsx",
        lineNumber: 9,
        columnNumber: 5
    }, this);
}
_c = Table;
function TableHeader({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("thead", {
        "data-slot": "table-header",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('[&_tr]:border-b', className),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/table.tsx",
        lineNumber: 24,
        columnNumber: 5
    }, this);
}
_c1 = TableHeader;
function TableBody({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tbody", {
        "data-slot": "table-body",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('[&_tr:last-child]:border-0', className),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/table.tsx",
        lineNumber: 34,
        columnNumber: 5
    }, this);
}
_c2 = TableBody;
function TableFooter({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tfoot", {
        "data-slot": "table-footer",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('bg-muted/50 border-t font-medium [&>tr]:last:border-b-0', className),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/table.tsx",
        lineNumber: 44,
        columnNumber: 5
    }, this);
}
_c3 = TableFooter;
function TableRow({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
        "data-slot": "table-row",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('hover:bg-muted/50 data-[state=selected]:bg-muted border-b transition-colors', className),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/table.tsx",
        lineNumber: 57,
        columnNumber: 5
    }, this);
}
_c4 = TableRow;
function TableHead({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
        "data-slot": "table-head",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('text-foreground h-10 px-2 text-left align-middle font-medium whitespace-nowrap [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]', className),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/table.tsx",
        lineNumber: 70,
        columnNumber: 5
    }, this);
}
_c5 = TableHead;
function TableCell({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
        "data-slot": "table-cell",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('p-2 align-middle whitespace-nowrap [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]', className),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/table.tsx",
        lineNumber: 83,
        columnNumber: 5
    }, this);
}
_c6 = TableCell;
function TableCaption({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("caption", {
        "data-slot": "table-caption",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('text-muted-foreground mt-4 text-sm', className),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/table.tsx",
        lineNumber: 99,
        columnNumber: 5
    }, this);
}
_c7 = TableCaption;
;
var _c, _c1, _c2, _c3, _c4, _c5, _c6, _c7;
__turbopack_context__.k.register(_c, "Table");
__turbopack_context__.k.register(_c1, "TableHeader");
__turbopack_context__.k.register(_c2, "TableBody");
__turbopack_context__.k.register(_c3, "TableFooter");
__turbopack_context__.k.register(_c4, "TableRow");
__turbopack_context__.k.register(_c5, "TableHead");
__turbopack_context__.k.register(_c6, "TableCell");
__turbopack_context__.k.register(_c7, "TableCaption");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/ui/badge.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Badge",
    ()=>Badge,
    "badgeVariants",
    ()=>badgeVariants
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.10_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$slot$40$1$2e$1$2e$1_$40$types$2b$react$40$19$2e$0$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$slot$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@radix-ui+react-slot@1.1.1_@types+react@19.0.0_react@19.2.0/node_modules/@radix-ui/react-slot/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$class$2d$variance$2d$authority$40$0$2e$7$2e$1$2f$node_modules$2f$class$2d$variance$2d$authority$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/class-variance-authority@0.7.1/node_modules/class-variance-authority/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/utils.ts [app-client] (ecmascript)");
;
;
;
;
const badgeVariants = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$class$2d$variance$2d$authority$40$0$2e$7$2e$1$2f$node_modules$2f$class$2d$variance$2d$authority$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cva"])('inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden', {
    variants: {
        variant: {
            default: 'border-transparent bg-primary text-primary-foreground [a&]:hover:bg-primary/90',
            secondary: 'border-transparent bg-secondary text-secondary-foreground [a&]:hover:bg-secondary/90',
            destructive: 'border-transparent bg-destructive text-white [a&]:hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60',
            outline: 'text-foreground [a&]:hover:bg-accent [a&]:hover:text-accent-foreground'
        }
    },
    defaultVariants: {
        variant: 'default'
    }
});
function Badge({ className, variant, asChild = false, ...props }) {
    const Comp = asChild ? __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$slot$40$1$2e$1$2e$1_$40$types$2b$react$40$19$2e$0$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$slot$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Slot"] : 'span';
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Comp, {
        "data-slot": "badge",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])(badgeVariants({
            variant
        }), className),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/badge.tsx",
        lineNumber: 38,
        columnNumber: 5
    }, this);
}
_c = Badge;
;
var _c;
__turbopack_context__.k.register(_c, "Badge");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/actions/data:b02214 [app-client] (ecmascript) <text/javascript>", ((__turbopack_context__) => {
"use strict";

/* __next_internal_action_entry_do_not_use__ [{"40ede0ab5a9b6f1a8f1980612375ce413cfe2ce638":"lockPayroll"},"lib/actions/payroll-actions.ts",""] */ __turbopack_context__.s([
    "lockPayroll",
    ()=>lockPayroll
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.10_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-client-wrapper.js [app-client] (ecmascript)");
"use turbopack no side effects";
;
var lockPayroll = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createServerReference"])("40ede0ab5a9b6f1a8f1980612375ce413cfe2ce638", __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["callServer"], void 0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["findSourceMapURL"], "lockPayroll"); //# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4vcGF5cm9sbC1hY3Rpb25zLnRzIl0sInNvdXJjZXNDb250ZW50IjpbIlwidXNlIHNlcnZlclwiXHJcblxyXG5pbXBvcnQgeyBjcmVhdGVDbGllbnQgfSBmcm9tIFwiQC9saWIvc3VwYWJhc2Uvc2VydmVyXCJcclxuaW1wb3J0IHsgcmV2YWxpZGF0ZVBhdGggfSBmcm9tIFwibmV4dC9jYWNoZVwiXHJcbmltcG9ydCB0eXBlIHtcclxuICBQYXlyb2xsUnVuLFxyXG4gIFBheXJvbGxJdGVtV2l0aFJlbGF0aW9ucyxcclxuICBTYWxhcnlTdHJ1Y3R1cmUsXHJcbiAgUGF5cm9sbEFkanVzdG1lbnRUeXBlLFxyXG59IGZyb20gXCJAL2xpYi90eXBlcy9kYXRhYmFzZVwiXHJcblxyXG5jb25zdCBTVEFOREFSRF9XT1JLSU5HX0RBWVMgPSAyNiAvLyBDw7RuZyBjaHXhuqluIFZOXHJcblxyXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuLy8gRU1QTE9ZRUUgQUNUSU9OU1xyXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHJcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBnZXRNeVBheXNsaXBzKCk6IFByb21pc2U8UGF5cm9sbEl0ZW1XaXRoUmVsYXRpb25zW10+IHtcclxuICBjb25zdCBzdXBhYmFzZSA9IGF3YWl0IGNyZWF0ZUNsaWVudCgpXHJcblxyXG4gIGNvbnN0IHtcclxuICAgIGRhdGE6IHsgdXNlciB9LFxyXG4gIH0gPSBhd2FpdCBzdXBhYmFzZS5hdXRoLmdldFVzZXIoKVxyXG4gIGlmICghdXNlcikgcmV0dXJuIFtdXHJcblxyXG4gIGNvbnN0IHsgZGF0YTogZW1wbG95ZWUgfSA9IGF3YWl0IHN1cGFiYXNlXHJcbiAgICAuZnJvbShcImVtcGxveWVlc1wiKVxyXG4gICAgLnNlbGVjdChcImlkXCIpXHJcbiAgICAuZXEoXCJ1c2VyX2lkXCIsIHVzZXIuaWQpXHJcbiAgICAuc2luZ2xlKClcclxuXHJcbiAgaWYgKCFlbXBsb3llZSkgcmV0dXJuIFtdXHJcblxyXG4gIGNvbnN0IHsgZGF0YSwgZXJyb3IgfSA9IGF3YWl0IHN1cGFiYXNlXHJcbiAgICAuZnJvbShcInBheXJvbGxfaXRlbXNcIilcclxuICAgIC5zZWxlY3QoXHJcbiAgICAgIGBcclxuICAgICAgKixcclxuICAgICAgcGF5cm9sbF9ydW46cGF5cm9sbF9ydW5zKCopXHJcbiAgICBgXHJcbiAgICApXHJcbiAgICAuZXEoXCJlbXBsb3llZV9pZFwiLCBlbXBsb3llZS5pZClcclxuICAgIC5vcmRlcihcImNyZWF0ZWRfYXRcIiwgeyBhc2NlbmRpbmc6IGZhbHNlIH0pXHJcblxyXG4gIGlmIChlcnJvcikge1xyXG4gICAgY29uc29sZS5lcnJvcihcIkVycm9yIGZldGNoaW5nIHBheXNsaXBzOlwiLCBlcnJvcilcclxuICAgIHJldHVybiBbXVxyXG4gIH1cclxuXHJcbiAgcmV0dXJuIChkYXRhIHx8IFtdKSBhcyBQYXlyb2xsSXRlbVdpdGhSZWxhdGlvbnNbXVxyXG59XHJcblxyXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuLy8gSFIgQUNUSU9OUyAtIFBBWVJPTEwgUlVOU1xyXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHJcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBsaXN0UGF5cm9sbFJ1bnMoKTogUHJvbWlzZTxQYXlyb2xsUnVuW10+IHtcclxuICBjb25zdCBzdXBhYmFzZSA9IGF3YWl0IGNyZWF0ZUNsaWVudCgpXHJcblxyXG4gIGNvbnN0IHsgZGF0YSwgZXJyb3IgfSA9IGF3YWl0IHN1cGFiYXNlXHJcbiAgICAuZnJvbShcInBheXJvbGxfcnVuc1wiKVxyXG4gICAgLnNlbGVjdChcIipcIilcclxuICAgIC5vcmRlcihcInllYXJcIiwgeyBhc2NlbmRpbmc6IGZhbHNlIH0pXHJcbiAgICAub3JkZXIoXCJtb250aFwiLCB7IGFzY2VuZGluZzogZmFsc2UgfSlcclxuXHJcbiAgaWYgKGVycm9yKSB7XHJcbiAgICBjb25zb2xlLmVycm9yKFwiRXJyb3IgbGlzdGluZyBwYXlyb2xsIHJ1bnM6XCIsIGVycm9yKVxyXG4gICAgcmV0dXJuIFtdXHJcbiAgfVxyXG5cclxuICByZXR1cm4gZGF0YSB8fCBbXVxyXG59XHJcblxyXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZ2V0UGF5cm9sbFJ1bihpZDogc3RyaW5nKTogUHJvbWlzZTxQYXlyb2xsUnVuIHwgbnVsbD4ge1xyXG4gIGNvbnN0IHN1cGFiYXNlID0gYXdhaXQgY3JlYXRlQ2xpZW50KClcclxuXHJcbiAgY29uc3QgeyBkYXRhLCBlcnJvciB9ID0gYXdhaXQgc3VwYWJhc2VcclxuICAgIC5mcm9tKFwicGF5cm9sbF9ydW5zXCIpXHJcbiAgICAuc2VsZWN0KFwiKlwiKVxyXG4gICAgLmVxKFwiaWRcIiwgaWQpXHJcbiAgICAuc2luZ2xlKClcclxuXHJcbiAgaWYgKGVycm9yKSB7XHJcbiAgICBjb25zb2xlLmVycm9yKFwiRXJyb3IgZmV0Y2hpbmcgcGF5cm9sbCBydW46XCIsIGVycm9yKVxyXG4gICAgcmV0dXJuIG51bGxcclxuICB9XHJcblxyXG4gIHJldHVybiBkYXRhXHJcbn1cclxuXHJcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBnZXRQYXlyb2xsSXRlbXMoXHJcbiAgcGF5cm9sbF9ydW5faWQ6IHN0cmluZ1xyXG4pOiBQcm9taXNlPFBheXJvbGxJdGVtV2l0aFJlbGF0aW9uc1tdPiB7XHJcbiAgY29uc3Qgc3VwYWJhc2UgPSBhd2FpdCBjcmVhdGVDbGllbnQoKVxyXG5cclxuICBjb25zdCB7IGRhdGEsIGVycm9yIH0gPSBhd2FpdCBzdXBhYmFzZVxyXG4gICAgLmZyb20oXCJwYXlyb2xsX2l0ZW1zXCIpXHJcbiAgICAuc2VsZWN0KFxyXG4gICAgICBgXHJcbiAgICAgICosXHJcbiAgICAgIGVtcGxveWVlOmVtcGxveWVlcyhpZCwgZnVsbF9uYW1lLCBlbXBsb3llZV9jb2RlLCBkZXBhcnRtZW50X2lkLCBkZXBhcnRtZW50OmRlcGFydG1lbnRzKG5hbWUpKVxyXG4gICAgYFxyXG4gICAgKVxyXG4gICAgLmVxKFwicGF5cm9sbF9ydW5faWRcIiwgcGF5cm9sbF9ydW5faWQpXHJcbiAgICAub3JkZXIoXCJjcmVhdGVkX2F0XCIsIHsgYXNjZW5kaW5nOiB0cnVlIH0pXHJcblxyXG4gIGlmIChlcnJvcikge1xyXG4gICAgY29uc29sZS5lcnJvcihcIkVycm9yIGZldGNoaW5nIHBheXJvbGwgaXRlbXM6XCIsIGVycm9yKVxyXG4gICAgcmV0dXJuIFtdXHJcbiAgfVxyXG5cclxuICByZXR1cm4gKGRhdGEgfHwgW10pIGFzIFBheXJvbGxJdGVtV2l0aFJlbGF0aW9uc1tdXHJcbn1cclxuXHJcbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG4vLyBIUiBBQ1RJT05TIC0gR0VORVJBVEUgUEFZUk9MTCAoduG7m2kgcGjhu6UgY+G6pXAsIHF14bu5LCBwaOG6oXQpXHJcbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cclxuaW50ZXJmYWNlIEF0dGVuZGFuY2VWaW9sYXRpb24ge1xyXG4gIGRhdGU6IHN0cmluZ1xyXG4gIGxhdGVNaW51dGVzOiBudW1iZXJcclxuICBlYXJseU1pbnV0ZXM6IG51bWJlclxyXG4gIGlzSGFsZkRheTogYm9vbGVhbiAvLyBOZ2jhu4kgbuG7rWEgbmfDoHkgKGNhIHPDoW5nIGhv4bq3YyBjYSBjaGnhu4F1KVxyXG4gIGlzQWJzZW50OiBib29sZWFuIC8vIEtow7RuZyB0w61uaCBjw7RuZyAoxJFpIG114buZbiA+MSB0aeG6v25nIGtow7RuZyBjw7MgcGjDqXApXHJcbiAgaGFzQXBwcm92ZWRSZXF1ZXN0OiBib29sZWFuXHJcbn1cclxuXHJcbmludGVyZmFjZSBTaGlmdEluZm8ge1xyXG4gIHN0YXJ0VGltZTogc3RyaW5nIC8vIFwiMDg6MDBcIlxyXG4gIGVuZFRpbWU6IHN0cmluZyAvLyBcIjE3OjAwXCJcclxuICBicmVha1N0YXJ0OiBzdHJpbmcgfCBudWxsIC8vIFwiMTI6MDBcIlxyXG4gIGJyZWFrRW5kOiBzdHJpbmcgfCBudWxsIC8vIFwiMTM6MzBcIlxyXG59XHJcblxyXG5hc3luYyBmdW5jdGlvbiBnZXRFbXBsb3llZVZpb2xhdGlvbnMoXHJcbiAgc3VwYWJhc2U6IGFueSxcclxuICBlbXBsb3llZUlkOiBzdHJpbmcsXHJcbiAgc3RhcnREYXRlOiBzdHJpbmcsXHJcbiAgZW5kRGF0ZTogc3RyaW5nLFxyXG4gIHNoaWZ0OiBTaGlmdEluZm9cclxuKTogUHJvbWlzZTxBdHRlbmRhbmNlVmlvbGF0aW9uW10+IHtcclxuICBjb25zdCB2aW9sYXRpb25zOiBBdHRlbmRhbmNlVmlvbGF0aW9uW10gPSBbXVxyXG5cclxuICAvLyBM4bqleSBhdHRlbmRhbmNlIGxvZ3NcclxuICBjb25zdCB7IGRhdGE6IGxvZ3MgfSA9IGF3YWl0IHN1cGFiYXNlXHJcbiAgICAuZnJvbShcImF0dGVuZGFuY2VfbG9nc1wiKVxyXG4gICAgLnNlbGVjdChcImNoZWNrX2luLCBjaGVja19vdXRcIilcclxuICAgIC5lcShcImVtcGxveWVlX2lkXCIsIGVtcGxveWVlSWQpXHJcbiAgICAuZ3RlKFwiY2hlY2tfaW5cIiwgc3RhcnREYXRlKVxyXG4gICAgLmx0ZShcImNoZWNrX2luXCIsIGVuZERhdGUgKyBcIlQyMzo1OTo1OVwiKVxyXG5cclxuICAvLyBM4bqleSB0aW1lIGFkanVzdG1lbnQgcmVxdWVzdHMgxJHDoyBhcHByb3ZlZFxyXG4gIGNvbnN0IHsgZGF0YTogYXBwcm92ZWRSZXF1ZXN0cyB9ID0gYXdhaXQgc3VwYWJhc2VcclxuICAgIC5mcm9tKFwidGltZV9hZGp1c3RtZW50X3JlcXVlc3RzXCIpXHJcbiAgICAuc2VsZWN0KFwicmVxdWVzdF9kYXRlXCIpXHJcbiAgICAuZXEoXCJlbXBsb3llZV9pZFwiLCBlbXBsb3llZUlkKVxyXG4gICAgLmVxKFwic3RhdHVzXCIsIFwiYXBwcm92ZWRcIilcclxuICAgIC5ndGUoXCJyZXF1ZXN0X2RhdGVcIiwgc3RhcnREYXRlKVxyXG4gICAgLmx0ZShcInJlcXVlc3RfZGF0ZVwiLCBlbmREYXRlKVxyXG5cclxuICBjb25zdCBhcHByb3ZlZERhdGVzID0gbmV3IFNldCgoYXBwcm92ZWRSZXF1ZXN0cyB8fCBbXSkubWFwKChyOiBhbnkpID0+IHIucmVxdWVzdF9kYXRlKSlcclxuXHJcbiAgaWYgKGxvZ3MpIHtcclxuICAgIGNvbnN0IFtzaGlmdEgsIHNoaWZ0TV0gPSBzaGlmdC5zdGFydFRpbWUuc3BsaXQoXCI6XCIpLm1hcChOdW1iZXIpXHJcbiAgICBjb25zdCBzaGlmdFN0YXJ0TWludXRlcyA9IHNoaWZ0SCAqIDYwICsgc2hpZnRNXHJcblxyXG4gICAgLy8gUGFyc2UgYnJlYWsgdGltZXNcclxuICAgIGxldCBicmVha1N0YXJ0TWludXRlcyA9IDBcclxuICAgIGxldCBicmVha0VuZE1pbnV0ZXMgPSAwXHJcbiAgICBpZiAoc2hpZnQuYnJlYWtTdGFydCAmJiBzaGlmdC5icmVha0VuZCkge1xyXG4gICAgICBjb25zdCBbYnNILCBic01dID0gc2hpZnQuYnJlYWtTdGFydC5zcGxpdChcIjpcIikubWFwKE51bWJlcilcclxuICAgICAgY29uc3QgW2JlSCwgYmVNXSA9IHNoaWZ0LmJyZWFrRW5kLnNwbGl0KFwiOlwiKS5tYXAoTnVtYmVyKVxyXG4gICAgICBicmVha1N0YXJ0TWludXRlcyA9IGJzSCAqIDYwICsgYnNNXHJcbiAgICAgIGJyZWFrRW5kTWludXRlcyA9IGJlSCAqIDYwICsgYmVNXHJcbiAgICB9XHJcblxyXG4gICAgZm9yIChjb25zdCBsb2cgb2YgbG9ncykge1xyXG4gICAgICBpZiAoIWxvZy5jaGVja19pbikgY29udGludWVcclxuXHJcbiAgICAgIGNvbnN0IGNoZWNrSW5EYXRlID0gbmV3IERhdGUobG9nLmNoZWNrX2luKVxyXG4gICAgICBjb25zdCBkYXRlU3RyID0gY2hlY2tJbkRhdGUudG9JU09TdHJpbmcoKS5zcGxpdChcIlRcIilbMF1cclxuICAgICAgY29uc3QgY2hlY2tJbkhvdXIgPSBjaGVja0luRGF0ZS5nZXRIb3VycygpXHJcbiAgICAgIGNvbnN0IGNoZWNrSW5NaW4gPSBjaGVja0luRGF0ZS5nZXRNaW51dGVzKClcclxuICAgICAgY29uc3QgY2hlY2tJbk1pbnV0ZXMgPSBjaGVja0luSG91ciAqIDYwICsgY2hlY2tJbk1pblxyXG5cclxuICAgICAgY29uc3QgaGFzQXBwcm92ZWRSZXF1ZXN0ID0gYXBwcm92ZWREYXRlcy5oYXMoZGF0ZVN0cilcclxuXHJcbiAgICAgIC8vIEtp4buDbSB0cmEgbuG6v3UgY2hlY2sgaW4gdHJvbmcgZ2nhu50gbmdo4buJIHRyxrBhIGhv4bq3YyBzYXUgZ2nhu50gbmdo4buJIHRyxrBhXHJcbiAgICAgIC8vID0+IE5naOG7iSBjYSBzw6FuZywgxJFpIGzDoG0gY2EgY2hp4buBdSAodMOtbmggbuG7rWEgbmfDoHkpXHJcbiAgICAgIGxldCBpc0hhbGZEYXkgPSBmYWxzZVxyXG4gICAgICBsZXQgbGF0ZU1pbnV0ZXMgPSAwXHJcblxyXG4gICAgICBpZiAoYnJlYWtTdGFydE1pbnV0ZXMgPiAwICYmIGJyZWFrRW5kTWludXRlcyA+IDApIHtcclxuICAgICAgICAvLyBDaGVjayBpbiB0cm9uZyBraG/huqNuZyBuZ2jhu4kgdHLGsGEgaG/hurdjIMSR4bqndSBjYSBjaGnhu4F1XHJcbiAgICAgICAgaWYgKGNoZWNrSW5NaW51dGVzID49IGJyZWFrU3RhcnRNaW51dGVzICYmIGNoZWNrSW5NaW51dGVzIDw9IGJyZWFrRW5kTWludXRlcyArIDE1KSB7XHJcbiAgICAgICAgICAvLyBDaGVjayBpbiB04burIDEyOjAwIMSR4bq/biAxMzo0NSA9PiBuZ2jhu4kgY2Egc8OhbmcsIMSRaSBjYSBjaGnhu4F1XHJcbiAgICAgICAgICBpc0hhbGZEYXkgPSB0cnVlXHJcbiAgICAgICAgICBsYXRlTWludXRlcyA9IDAgLy8gS2jDtG5nIHTDrW5oIGzDoCDEkWkgbXXhu5luXHJcbiAgICAgICAgfSBlbHNlIGlmIChjaGVja0luTWludXRlcyA+IGJyZWFrRW5kTWludXRlcyArIDE1KSB7XHJcbiAgICAgICAgICAvLyBDaGVjayBpbiBzYXUgMTM6NDUgPT4gxJFpIG114buZbiBjYSBjaGnhu4F1XHJcbiAgICAgICAgICBsYXRlTWludXRlcyA9IGNoZWNrSW5NaW51dGVzIC0gYnJlYWtFbmRNaW51dGVzXHJcbiAgICAgICAgICBpc0hhbGZEYXkgPSB0cnVlXHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIC8vIENoZWNrIGluIHRyxrDhu5tjIGdp4budIG5naOG7iSB0csawYSA9PiB0w61uaCDEkWkgbXXhu5luIGLDrG5oIHRoxrDhu51uZ1xyXG4gICAgICAgICAgbGF0ZU1pbnV0ZXMgPSBNYXRoLm1heCgwLCBjaGVja0luTWludXRlcyAtIHNoaWZ0U3RhcnRNaW51dGVzKVxyXG4gICAgICAgIH1cclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICAvLyBLaMO0bmcgY8OzIGdp4budIG5naOG7iSB0csawYSA9PiB0w61uaCDEkWkgbXXhu5luIGLDrG5oIHRoxrDhu51uZ1xyXG4gICAgICAgIGxhdGVNaW51dGVzID0gTWF0aC5tYXgoMCwgY2hlY2tJbk1pbnV0ZXMgLSBzaGlmdFN0YXJ0TWludXRlcylcclxuICAgICAgfVxyXG5cclxuICAgICAgLy8gxJBpIG114buZbiA+NjAgcGjDunQgdsOgIGtow7RuZyBjw7MgcGjDqXAgPT4ga2jDtG5nIHTDrW5oIGPDtG5nIChpc0Fic2VudClcclxuICAgICAgY29uc3QgaXNBYnNlbnQgPSBsYXRlTWludXRlcyA+IDYwICYmICFoYXNBcHByb3ZlZFJlcXVlc3RcclxuXHJcbiAgICAgIHZpb2xhdGlvbnMucHVzaCh7XHJcbiAgICAgICAgZGF0ZTogZGF0ZVN0cixcclxuICAgICAgICBsYXRlTWludXRlcyxcclxuICAgICAgICBlYXJseU1pbnV0ZXM6IDAsXHJcbiAgICAgICAgaXNIYWxmRGF5LFxyXG4gICAgICAgIGlzQWJzZW50LFxyXG4gICAgICAgIGhhc0FwcHJvdmVkUmVxdWVzdCxcclxuICAgICAgfSlcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHJldHVybiB2aW9sYXRpb25zXHJcbn1cclxuXHJcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBnZW5lcmF0ZVBheXJvbGwobW9udGg6IG51bWJlciwgeWVhcjogbnVtYmVyKSB7XHJcbiAgY29uc3Qgc3VwYWJhc2UgPSBhd2FpdCBjcmVhdGVDbGllbnQoKVxyXG5cclxuICBjb25zdCB7XHJcbiAgICBkYXRhOiB7IHVzZXIgfSxcclxuICB9ID0gYXdhaXQgc3VwYWJhc2UuYXV0aC5nZXRVc2VyKClcclxuICBpZiAoIXVzZXIpIHJldHVybiB7IHN1Y2Nlc3M6IGZhbHNlLCBlcnJvcjogXCJDaMawYSDEkcSDbmcgbmjhuq1wXCIgfVxyXG5cclxuICAvLyBLaeG7g20gdHJhIMSRw6MgY8OzIHBheXJvbGwgcnVuIGNoxrBhXHJcbiAgY29uc3QgeyBkYXRhOiBleGlzdGluZ1J1biB9ID0gYXdhaXQgc3VwYWJhc2VcclxuICAgIC5mcm9tKFwicGF5cm9sbF9ydW5zXCIpXHJcbiAgICAuc2VsZWN0KFwiaWQsIHN0YXR1c1wiKVxyXG4gICAgLmVxKFwibW9udGhcIiwgbW9udGgpXHJcbiAgICAuZXEoXCJ5ZWFyXCIsIHllYXIpXHJcbiAgICAuc2luZ2xlKClcclxuXHJcbiAgaWYgKGV4aXN0aW5nUnVuKSB7XHJcbiAgICBpZiAoZXhpc3RpbmdSdW4uc3RhdHVzICE9PSBcImRyYWZ0XCIpIHtcclxuICAgICAgcmV0dXJuIHsgc3VjY2VzczogZmFsc2UsIGVycm9yOiBcIkLhuqNuZyBsxrDGoW5nIHRow6FuZyBuw6B5IMSRw6Mga2jDs2EsIGtow7RuZyB0aOG7gyB04bqhbyBs4bqhaVwiIH1cclxuICAgIH1cclxuICAgIC8vIFjDs2EgcGF5cm9sbCBpdGVtcyB2w6AgYWRqdXN0bWVudCBkZXRhaWxzIGPFqVxyXG4gICAgYXdhaXQgc3VwYWJhc2UuZnJvbShcInBheXJvbGxfYWRqdXN0bWVudF9kZXRhaWxzXCIpLmRlbGV0ZSgpLmluKFxyXG4gICAgICBcInBheXJvbGxfaXRlbV9pZFwiLFxyXG4gICAgICAoYXdhaXQgc3VwYWJhc2UuZnJvbShcInBheXJvbGxfaXRlbXNcIikuc2VsZWN0KFwiaWRcIikuZXEoXCJwYXlyb2xsX3J1bl9pZFwiLCBleGlzdGluZ1J1bi5pZCkpLmRhdGE/Lm1hcCgoaTogYW55KSA9PiBpLmlkKSB8fCBbXVxyXG4gICAgKVxyXG4gICAgYXdhaXQgc3VwYWJhc2UuZnJvbShcInBheXJvbGxfaXRlbXNcIikuZGVsZXRlKCkuZXEoXCJwYXlyb2xsX3J1bl9pZFwiLCBleGlzdGluZ1J1bi5pZClcclxuICAgIGF3YWl0IHN1cGFiYXNlLmZyb20oXCJwYXlyb2xsX3J1bnNcIikuZGVsZXRlKCkuZXEoXCJpZFwiLCBleGlzdGluZ1J1bi5pZClcclxuICB9XHJcblxyXG4gIC8vIFThuqFvIHBheXJvbGwgcnVuIG3hu5tpXHJcbiAgY29uc3QgeyBkYXRhOiBydW4sIGVycm9yOiBydW5FcnJvciB9ID0gYXdhaXQgc3VwYWJhc2VcclxuICAgIC5mcm9tKFwicGF5cm9sbF9ydW5zXCIpXHJcbiAgICAuaW5zZXJ0KHtcclxuICAgICAgbW9udGgsXHJcbiAgICAgIHllYXIsXHJcbiAgICAgIHN0YXR1czogXCJkcmFmdFwiLFxyXG4gICAgICBjcmVhdGVkX2J5OiB1c2VyLmlkLFxyXG4gICAgfSlcclxuICAgIC5zZWxlY3QoKVxyXG4gICAgLnNpbmdsZSgpXHJcblxyXG4gIGlmIChydW5FcnJvcikge1xyXG4gICAgY29uc29sZS5lcnJvcihcIkVycm9yIGNyZWF0aW5nIHBheXJvbGwgcnVuOlwiLCBydW5FcnJvcilcclxuICAgIHJldHVybiB7IHN1Y2Nlc3M6IGZhbHNlLCBlcnJvcjogcnVuRXJyb3IubWVzc2FnZSB9XHJcbiAgfVxyXG5cclxuICAvLyBM4bqleSBkYW5oIHPDoWNoIG5ow6JuIHZpw6puIGFjdGl2ZSBob+G6t2Mgb25ib2FyZGluZ1xyXG4gIGNvbnN0IHsgZGF0YTogZW1wbG95ZWVzLCBlcnJvcjogZW1wRXJyb3IgfSA9IGF3YWl0IHN1cGFiYXNlXHJcbiAgICAuZnJvbShcImVtcGxveWVlc1wiKVxyXG4gICAgLnNlbGVjdChcImlkLCBmdWxsX25hbWUsIGVtcGxveWVlX2NvZGUsIHNoaWZ0X2lkXCIpXHJcbiAgICAuaW4oXCJzdGF0dXNcIiwgW1wiYWN0aXZlXCIsIFwib25ib2FyZGluZ1wiXSlcclxuXHJcbiAgaWYgKGVtcEVycm9yIHx8ICFlbXBsb3llZXMgfHwgZW1wbG95ZWVzLmxlbmd0aCA9PT0gMCkge1xyXG4gICAgcmV0dXJuIHsgc3VjY2VzczogZmFsc2UsIGVycm9yOiBcIktow7RuZyBjw7MgbmjDom4gdmnDqm4uIFZ1aSBsw7JuZyBraeG7g20gdHJhIHRy4bqhbmcgdGjDoWkgbmjDom4gdmnDqm4uXCIgfVxyXG4gIH1cclxuXHJcbiAgLy8gTOG6pXkgY8OhYyBsb+G6oWkgxJFp4buBdSBjaOG7iW5oIGFjdGl2ZVxyXG4gIGNvbnN0IHsgZGF0YTogYWRqdXN0bWVudFR5cGVzIH0gPSBhd2FpdCBzdXBhYmFzZVxyXG4gICAgLmZyb20oXCJwYXlyb2xsX2FkanVzdG1lbnRfdHlwZXNcIilcclxuICAgIC5zZWxlY3QoXCIqXCIpXHJcbiAgICAuZXEoXCJpc19hY3RpdmVcIiwgdHJ1ZSlcclxuXHJcbiAgLy8gTOG6pXkgd29yayBzaGlmdHNcclxuICBjb25zdCB7IGRhdGE6IHNoaWZ0cyB9ID0gYXdhaXQgc3VwYWJhc2UuZnJvbShcIndvcmtfc2hpZnRzXCIpLnNlbGVjdChcIipcIilcclxuICBjb25zdCBzaGlmdE1hcCA9IG5ldyBNYXAoKHNoaWZ0cyB8fCBbXSkubWFwKChzOiBhbnkpID0+IFtzLmlkLCBzXSkpXHJcblxyXG4gIC8vIFTDrW5oIG5nw6B5IMSR4bqndSB2w6AgY3Xhu5FpIHRow6FuZ1xyXG4gIGNvbnN0IHN0YXJ0RGF0ZSA9IGAke3llYXJ9LSR7U3RyaW5nKG1vbnRoKS5wYWRTdGFydCgyLCBcIjBcIil9LTAxYFxyXG4gIGNvbnN0IGVuZERhdGUgPSBuZXcgRGF0ZSh5ZWFyLCBtb250aCwgMCkudG9JU09TdHJpbmcoKS5zcGxpdChcIlRcIilbMF1cclxuXHJcbiAgbGV0IHByb2Nlc3NlZENvdW50ID0gMFxyXG4gIGZvciAoY29uc3QgZW1wIG9mIGVtcGxveWVlcykge1xyXG4gICAgLy8gTOG6pXkgbMawxqFuZyBoaeG7h3UgbOG7sWNcclxuICAgIGNvbnN0IHsgZGF0YTogc2FsYXJ5IH0gPSBhd2FpdCBzdXBhYmFzZVxyXG4gICAgICAuZnJvbShcInNhbGFyeV9zdHJ1Y3R1cmVcIilcclxuICAgICAgLnNlbGVjdChcIipcIilcclxuICAgICAgLmVxKFwiZW1wbG95ZWVfaWRcIiwgZW1wLmlkKVxyXG4gICAgICAubHRlKFwiZWZmZWN0aXZlX2RhdGVcIiwgZW5kRGF0ZSlcclxuICAgICAgLm9yZGVyKFwiZWZmZWN0aXZlX2RhdGVcIiwgeyBhc2NlbmRpbmc6IGZhbHNlIH0pXHJcbiAgICAgIC5saW1pdCgxKVxyXG4gICAgICAubWF5YmVTaW5nbGUoKVxyXG5cclxuICAgIGNvbnN0IGJhc2VTYWxhcnkgPSBzYWxhcnk/LmJhc2Vfc2FsYXJ5IHx8IDBcclxuICAgIGNvbnN0IGRhaWx5U2FsYXJ5ID0gYmFzZVNhbGFyeSAvIFNUQU5EQVJEX1dPUktJTkdfREFZU1xyXG5cclxuICAgIC8vIMSQ4bq/bSBuZ8OgeSBjw7RuZ1xyXG4gICAgY29uc3QgeyBjb3VudDogd29ya2luZ0RheXNDb3VudCB9ID0gYXdhaXQgc3VwYWJhc2VcclxuICAgICAgLmZyb20oXCJhdHRlbmRhbmNlX2xvZ3NcIilcclxuICAgICAgLnNlbGVjdChcIipcIiwgeyBjb3VudDogXCJleGFjdFwiLCBoZWFkOiB0cnVlIH0pXHJcbiAgICAgIC5lcShcImVtcGxveWVlX2lkXCIsIGVtcC5pZClcclxuICAgICAgLmd0ZShcImNoZWNrX2luXCIsIHN0YXJ0RGF0ZSlcclxuICAgICAgLmx0ZShcImNoZWNrX2luXCIsIGVuZERhdGUgKyBcIlQyMzo1OTo1OVwiKVxyXG5cclxuICAgIC8vIMSQ4bq/bSBuZ8OgeSBuZ2jhu4kgcGjDqXBcclxuICAgIGNvbnN0IHsgZGF0YTogbGVhdmVSZXF1ZXN0cyB9ID0gYXdhaXQgc3VwYWJhc2VcclxuICAgICAgLmZyb20oXCJsZWF2ZV9yZXF1ZXN0c1wiKVxyXG4gICAgICAuc2VsZWN0KFwiZnJvbV9kYXRlLCB0b19kYXRlLCBsZWF2ZV90eXBlXCIpXHJcbiAgICAgIC5lcShcImVtcGxveWVlX2lkXCIsIGVtcC5pZClcclxuICAgICAgLmVxKFwic3RhdHVzXCIsIFwiYXBwcm92ZWRcIilcclxuICAgICAgLmx0ZShcImZyb21fZGF0ZVwiLCBlbmREYXRlKVxyXG4gICAgICAuZ3RlKFwidG9fZGF0ZVwiLCBzdGFydERhdGUpXHJcblxyXG4gICAgbGV0IGxlYXZlRGF5cyA9IDBcclxuICAgIGxldCB1bnBhaWRMZWF2ZURheXMgPSAwXHJcblxyXG4gICAgaWYgKGxlYXZlUmVxdWVzdHMpIHtcclxuICAgICAgZm9yIChjb25zdCBsZWF2ZSBvZiBsZWF2ZVJlcXVlc3RzKSB7XHJcbiAgICAgICAgY29uc3QgbGVhdmVTdGFydCA9IG5ldyBEYXRlKE1hdGgubWF4KG5ldyBEYXRlKGxlYXZlLmZyb21fZGF0ZSkuZ2V0VGltZSgpLCBuZXcgRGF0ZShzdGFydERhdGUpLmdldFRpbWUoKSkpXHJcbiAgICAgICAgY29uc3QgbGVhdmVFbmQgPSBuZXcgRGF0ZShNYXRoLm1pbihuZXcgRGF0ZShsZWF2ZS50b19kYXRlKS5nZXRUaW1lKCksIG5ldyBEYXRlKGVuZERhdGUpLmdldFRpbWUoKSkpXHJcbiAgICAgICAgY29uc3QgZGF5cyA9IE1hdGguY2VpbCgobGVhdmVFbmQuZ2V0VGltZSgpIC0gbGVhdmVTdGFydC5nZXRUaW1lKCkpIC8gKDEwMDAgKiA2MCAqIDYwICogMjQpKSArIDFcclxuXHJcbiAgICAgICAgaWYgKGxlYXZlLmxlYXZlX3R5cGUgPT09IFwidW5wYWlkXCIpIHtcclxuICAgICAgICAgIHVucGFpZExlYXZlRGF5cyArPSBkYXlzXHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIGxlYXZlRGF5cyArPSBkYXlzXHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLy8gTOG6pXkgc2hpZnQgY+G7p2EgbmjDom4gdmnDqm5cclxuICAgIGNvbnN0IHNoaWZ0RGF0YSA9IGVtcC5zaGlmdF9pZCA/IHNoaWZ0TWFwLmdldChlbXAuc2hpZnRfaWQpIDogbnVsbFxyXG4gICAgY29uc3Qgc2hpZnRJbmZvOiBTaGlmdEluZm8gPSB7XHJcbiAgICAgIHN0YXJ0VGltZTogc2hpZnREYXRhPy5zdGFydF90aW1lPy5zbGljZSgwLCA1KSB8fCBcIjA4OjAwXCIsXHJcbiAgICAgIGVuZFRpbWU6IHNoaWZ0RGF0YT8uZW5kX3RpbWU/LnNsaWNlKDAsIDUpIHx8IFwiMTc6MDBcIixcclxuICAgICAgYnJlYWtTdGFydDogc2hpZnREYXRhPy5icmVha19zdGFydD8uc2xpY2UoMCwgNSkgfHwgbnVsbCxcclxuICAgICAgYnJlYWtFbmQ6IHNoaWZ0RGF0YT8uYnJlYWtfZW5kPy5zbGljZSgwLCA1KSB8fCBudWxsLFxyXG4gICAgfVxyXG5cclxuICAgIC8vIEzhuqV5IHZpIHBo4bqhbSBjaOG6pW0gY8O0bmdcclxuICAgIGNvbnN0IHZpb2xhdGlvbnMgPSBhd2FpdCBnZXRFbXBsb3llZVZpb2xhdGlvbnMoc3VwYWJhc2UsIGVtcC5pZCwgc3RhcnREYXRlLCBlbmREYXRlLCBzaGlmdEluZm8pXHJcbiAgICBcclxuICAgIC8vIFTDrW5oIG5nw6B5IGPDtG5nIHRo4buxYyB04bq/ICh0cuG7qyBuZ8OgeSBraMO0bmcgdMOtbmggY8O0bmcgdsOgIG7hu61hIG5nw6B5KVxyXG4gICAgY29uc3QgYWJzZW50RGF5cyA9IHZpb2xhdGlvbnMuZmlsdGVyKCh2KSA9PiB2LmlzQWJzZW50KS5sZW5ndGhcclxuICAgIGNvbnN0IGhhbGZEYXlzID0gdmlvbGF0aW9ucy5maWx0ZXIoKHYpID0+IHYuaXNIYWxmRGF5ICYmICF2LmlzQWJzZW50KS5sZW5ndGhcclxuICAgIGNvbnN0IGZ1bGxXb3JrRGF5cyA9IHZpb2xhdGlvbnMuZmlsdGVyKCh2KSA9PiAhdi5pc0hhbGZEYXkgJiYgIXYuaXNBYnNlbnQpLmxlbmd0aFxyXG4gICAgY29uc3QgYWN0dWFsV29ya2luZ0RheXMgPSBmdWxsV29ya0RheXMgKyAoaGFsZkRheXMgKiAwLjUpXHJcbiAgICBcclxuICAgIGNvbnN0IGxhdGVDb3VudCA9IHZpb2xhdGlvbnMuZmlsdGVyKCh2KSA9PiB2LmxhdGVNaW51dGVzID4gMCAmJiAhdi5pc0hhbGZEYXkpLmxlbmd0aFxyXG5cclxuICAgIC8vIEzhuqV5IGPDoWMgxJFp4buBdSBjaOG7iW5oIMSRxrDhu6NjIGfDoW4gY2hvIG5ow6JuIHZpw6puXHJcbiAgICBjb25zdCB7IGRhdGE6IGVtcEFkanVzdG1lbnRzIH0gPSBhd2FpdCBzdXBhYmFzZVxyXG4gICAgICAuZnJvbShcImVtcGxveWVlX2FkanVzdG1lbnRzXCIpXHJcbiAgICAgIC5zZWxlY3QoXCIqLCBhZGp1c3RtZW50X3R5cGU6cGF5cm9sbF9hZGp1c3RtZW50X3R5cGVzKCopXCIpXHJcbiAgICAgIC5lcShcImVtcGxveWVlX2lkXCIsIGVtcC5pZClcclxuICAgICAgLmx0ZShcImVmZmVjdGl2ZV9kYXRlXCIsIGVuZERhdGUpXHJcbiAgICAgIC5vcihgZW5kX2RhdGUuaXMubnVsbCxlbmRfZGF0ZS5ndGUuJHtzdGFydERhdGV9YClcclxuXHJcbiAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuICAgIC8vIFTDjU5IIFRPw4FOIFBI4bukIEPhuqRQLCBLSOG6pFUgVFLhu6osIFBI4bqgVFxyXG4gICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcbiAgICBsZXQgdG90YWxBbGxvd2FuY2VzID0gMCAvLyBQaOG7pSBj4bqlcCB04burIHBheXJvbGxfYWRqdXN0bWVudF90eXBlc1xyXG4gICAgbGV0IHRvdGFsRGVkdWN0aW9ucyA9IDBcclxuICAgIGxldCB0b3RhbFBlbmFsdGllcyA9IDBcclxuICAgIGNvbnN0IGFkanVzdG1lbnREZXRhaWxzOiBhbnlbXSA9IFtdXHJcblxyXG4gICAgLy8gWOG7rSBsw70gY8OhYyBsb+G6oWkgxJFp4buBdSBjaOG7iW5oIHThu7EgxJHhu5luZ1xyXG4gICAgaWYgKGFkanVzdG1lbnRUeXBlcykge1xyXG4gICAgICBmb3IgKGNvbnN0IGFkalR5cGUgb2YgYWRqdXN0bWVudFR5cGVzIGFzIFBheXJvbGxBZGp1c3RtZW50VHlwZVtdKSB7XHJcbiAgICAgICAgaWYgKCFhZGpUeXBlLmlzX2F1dG9fYXBwbGllZCkgY29udGludWVcclxuXHJcbiAgICAgICAgY29uc3QgcnVsZXMgPSBhZGpUeXBlLmF1dG9fcnVsZXNcclxuXHJcbiAgICAgICAgLy8gPT09PT09PT09PSBLSOG6pFUgVFLhu6ogVOG7sCDEkOG7mE5HIChRdeG7uSBjaHVuZywgQkhYSC4uLikgPT09PT09PT09PVxyXG4gICAgICAgIGlmIChhZGpUeXBlLmNhdGVnb3J5ID09PSBcImRlZHVjdGlvblwiKSB7XHJcbiAgICAgICAgICBsZXQgZmluYWxBbW91bnQgPSBhZGpUeXBlLmFtb3VudFxyXG5cclxuICAgICAgICAgIC8vIFTDrW5oIEJIWEggdGhlbyAlIGzGsMahbmcgY8ahIGLhuqNuIG7hur91IGPDsyBydWxlXHJcbiAgICAgICAgICBpZiAocnVsZXM/LmNhbGN1bGF0ZV9mcm9tID09PSBcImJhc2Vfc2FsYXJ5XCIgJiYgcnVsZXM/LnBlcmNlbnRhZ2UpIHtcclxuICAgICAgICAgICAgZmluYWxBbW91bnQgPSAoYmFzZVNhbGFyeSAqIHJ1bGVzLnBlcmNlbnRhZ2UpIC8gMTAwXHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgdG90YWxEZWR1Y3Rpb25zICs9IGZpbmFsQW1vdW50XHJcbiAgICAgICAgICBhZGp1c3RtZW50RGV0YWlscy5wdXNoKHtcclxuICAgICAgICAgICAgYWRqdXN0bWVudF90eXBlX2lkOiBhZGpUeXBlLmlkLFxyXG4gICAgICAgICAgICBjYXRlZ29yeTogXCJkZWR1Y3Rpb25cIixcclxuICAgICAgICAgICAgYmFzZV9hbW91bnQ6IGFkalR5cGUuYW1vdW50LFxyXG4gICAgICAgICAgICBhZGp1c3RlZF9hbW91bnQ6IDAsXHJcbiAgICAgICAgICAgIGZpbmFsX2Ftb3VudDogZmluYWxBbW91bnQsXHJcbiAgICAgICAgICAgIHJlYXNvbjogYWRqVHlwZS5uYW1lLFxyXG4gICAgICAgICAgICBvY2N1cnJlbmNlX2NvdW50OiAxLFxyXG4gICAgICAgICAgfSlcclxuICAgICAgICAgIGNvbnRpbnVlXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyA9PT09PT09PT09IFBI4bukIEPhuqRQIFThu7AgxJDhu5hORyA9PT09PT09PT09XHJcbiAgICAgICAgaWYgKGFkalR5cGUuY2F0ZWdvcnkgPT09IFwiYWxsb3dhbmNlXCIpIHtcclxuICAgICAgICAgIC8vIFBo4bulIGPhuqVwIHRoZW8gbmfDoHkgY8O0bmcgKMSDbiB0csawYSkgLSBjaOG7iSB0w61uaCBuZ8OgeSDEkWkgbMOgbSDEkeG7pywga2jDtG5nIHTDrW5oIG7hu61hIG5nw6B5XHJcbiAgICAgICAgICBpZiAoYWRqVHlwZS5jYWxjdWxhdGlvbl90eXBlID09PSBcImRhaWx5XCIpIHtcclxuICAgICAgICAgICAgbGV0IGVsaWdpYmxlRGF5cyA9IGZ1bGxXb3JrRGF5cyAvLyBDaOG7iSB0w61uaCBuZ8OgeSDEkWkgbMOgbSDEkeG7p1xyXG5cclxuICAgICAgICAgICAgaWYgKHJ1bGVzKSB7XHJcbiAgICAgICAgICAgICAgLy8gVHLhu6sgbmfDoHkgbmdo4buJXHJcbiAgICAgICAgICAgICAgaWYgKHJ1bGVzLmRlZHVjdF9vbl9hYnNlbnQpIHtcclxuICAgICAgICAgICAgICAgIGVsaWdpYmxlRGF5cyAtPSB1bnBhaWRMZWF2ZURheXNcclxuICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgIC8vIFRy4burIG7hur91IMSRaSBtdeG7mW4gcXXDoSBz4buRIGzhuqduIGNobyBwaMOpcFxyXG4gICAgICAgICAgICAgIGlmIChydWxlcy5kZWR1Y3Rfb25fbGF0ZSAmJiBydWxlcy5sYXRlX2dyYWNlX2NvdW50ICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGV4Y2Vzc0xhdGVEYXlzID0gTWF0aC5tYXgoMCwgbGF0ZUNvdW50IC0gcnVsZXMubGF0ZV9ncmFjZV9jb3VudClcclxuICAgICAgICAgICAgICAgIGVsaWdpYmxlRGF5cyAtPSBleGNlc3NMYXRlRGF5c1xyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgZWxpZ2libGVEYXlzID0gTWF0aC5tYXgoMCwgZWxpZ2libGVEYXlzKVxyXG4gICAgICAgICAgICBjb25zdCBhbW91bnQgPSBlbGlnaWJsZURheXMgKiBhZGpUeXBlLmFtb3VudFxyXG5cclxuICAgICAgICAgICAgaWYgKGFtb3VudCA+IDApIHtcclxuICAgICAgICAgICAgICB0b3RhbEFsbG93YW5jZXMgKz0gYW1vdW50XHJcbiAgICAgICAgICAgICAgYWRqdXN0bWVudERldGFpbHMucHVzaCh7XHJcbiAgICAgICAgICAgICAgICBhZGp1c3RtZW50X3R5cGVfaWQ6IGFkalR5cGUuaWQsXHJcbiAgICAgICAgICAgICAgICBjYXRlZ29yeTogXCJhbGxvd2FuY2VcIixcclxuICAgICAgICAgICAgICAgIGJhc2VfYW1vdW50OiBmdWxsV29ya0RheXMgKiBhZGpUeXBlLmFtb3VudCxcclxuICAgICAgICAgICAgICAgIGFkanVzdGVkX2Ftb3VudDogKGZ1bGxXb3JrRGF5cyAtIGVsaWdpYmxlRGF5cykgKiBhZGpUeXBlLmFtb3VudCxcclxuICAgICAgICAgICAgICAgIGZpbmFsX2Ftb3VudDogYW1vdW50LFxyXG4gICAgICAgICAgICAgICAgcmVhc29uOiBgJHtlbGlnaWJsZURheXN9IG5nw6B5IHggJHthZGpUeXBlLmFtb3VudC50b0xvY2FsZVN0cmluZygpfcSRYCxcclxuICAgICAgICAgICAgICAgIG9jY3VycmVuY2VfY291bnQ6IGVsaWdpYmxlRGF5cyxcclxuICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgLy8gUGjhu6UgY+G6pXAgY+G7kSDEkeG7i25oIChjaHV5w6puIGPhuqduKVxyXG4gICAgICAgICAgaWYgKGFkalR5cGUuY2FsY3VsYXRpb25fdHlwZSA9PT0gXCJmaXhlZFwiKSB7XHJcbiAgICAgICAgICAgIGlmIChydWxlcz8uZnVsbF9kZWR1Y3RfdGhyZXNob2xkICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgICAvLyBDw7MgxJFp4buBdSBraeG7h24gLSBt4bqldCB0b8OgbiBi4buZIG7hur91IHZpIHBo4bqhbSAoxJFpIG114buZbiBob+G6t2Mgbmdo4buJIGtow7RuZyBwaMOpcCBob+G6t2Mga2jDtG5nIHTDrW5oIGPDtG5nKVxyXG4gICAgICAgICAgICAgIGNvbnN0IHNob3VsZERlZHVjdCA9IGxhdGVDb3VudCA+IHJ1bGVzLmZ1bGxfZGVkdWN0X3RocmVzaG9sZCB8fCB1bnBhaWRMZWF2ZURheXMgPiAwIHx8IGFic2VudERheXMgPiAwXHJcbiAgICAgICAgICAgICAgaWYgKCFzaG91bGREZWR1Y3QpIHtcclxuICAgICAgICAgICAgICAgIHRvdGFsQWxsb3dhbmNlcyArPSBhZGpUeXBlLmFtb3VudFxyXG4gICAgICAgICAgICAgICAgYWRqdXN0bWVudERldGFpbHMucHVzaCh7XHJcbiAgICAgICAgICAgICAgICAgIGFkanVzdG1lbnRfdHlwZV9pZDogYWRqVHlwZS5pZCxcclxuICAgICAgICAgICAgICAgICAgY2F0ZWdvcnk6IFwiYWxsb3dhbmNlXCIsXHJcbiAgICAgICAgICAgICAgICAgIGJhc2VfYW1vdW50OiBhZGpUeXBlLmFtb3VudCxcclxuICAgICAgICAgICAgICAgICAgYWRqdXN0ZWRfYW1vdW50OiAwLFxyXG4gICAgICAgICAgICAgICAgICBmaW5hbF9hbW91bnQ6IGFkalR5cGUuYW1vdW50LFxyXG4gICAgICAgICAgICAgICAgICByZWFzb246IFwixJDhu6cgxJFp4buBdSBraeG7h24gY2h1ecOqbiBj4bqnblwiLFxyXG4gICAgICAgICAgICAgICAgICBvY2N1cnJlbmNlX2NvdW50OiAxLFxyXG4gICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgYWRqdXN0bWVudERldGFpbHMucHVzaCh7XHJcbiAgICAgICAgICAgICAgICAgIGFkanVzdG1lbnRfdHlwZV9pZDogYWRqVHlwZS5pZCxcclxuICAgICAgICAgICAgICAgICAgY2F0ZWdvcnk6IFwiYWxsb3dhbmNlXCIsXHJcbiAgICAgICAgICAgICAgICAgIGJhc2VfYW1vdW50OiBhZGpUeXBlLmFtb3VudCxcclxuICAgICAgICAgICAgICAgICAgYWRqdXN0ZWRfYW1vdW50OiBhZGpUeXBlLmFtb3VudCxcclxuICAgICAgICAgICAgICAgICAgZmluYWxfYW1vdW50OiAwLFxyXG4gICAgICAgICAgICAgICAgICByZWFzb246IGBN4bqldCBwaOG7pSBj4bqlcDogxJFpIG114buZbiAke2xhdGVDb3VudH0gbOG6p24sIG5naOG7iSBraMO0bmcgcGjDqXAgJHt1bnBhaWRMZWF2ZURheXN9IG5nw6B5YCxcclxuICAgICAgICAgICAgICAgICAgb2NjdXJyZW5jZV9jb3VudDogMCxcclxuICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgIC8vIEtow7RuZyBjw7MgxJFp4buBdSBraeG7h24gLSBj4buZbmcgdGjhurNuZ1xyXG4gICAgICAgICAgICAgIHRvdGFsQWxsb3dhbmNlcyArPSBhZGpUeXBlLmFtb3VudFxyXG4gICAgICAgICAgICAgIGFkanVzdG1lbnREZXRhaWxzLnB1c2goe1xyXG4gICAgICAgICAgICAgICAgYWRqdXN0bWVudF90eXBlX2lkOiBhZGpUeXBlLmlkLFxyXG4gICAgICAgICAgICAgICAgY2F0ZWdvcnk6IFwiYWxsb3dhbmNlXCIsXHJcbiAgICAgICAgICAgICAgICBiYXNlX2Ftb3VudDogYWRqVHlwZS5hbW91bnQsXHJcbiAgICAgICAgICAgICAgICBhZGp1c3RlZF9hbW91bnQ6IDAsXHJcbiAgICAgICAgICAgICAgICBmaW5hbF9hbW91bnQ6IGFkalR5cGUuYW1vdW50LFxyXG4gICAgICAgICAgICAgICAgcmVhc29uOiBhZGpUeXBlLm5hbWUsXHJcbiAgICAgICAgICAgICAgICBvY2N1cnJlbmNlX2NvdW50OiAxLFxyXG4gICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH1cclxuICAgICAgICAgIGNvbnRpbnVlXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyA9PT09PT09PT09IFBI4bqgVCBU4buwIMSQ4buYTkcgPT09PT09PT09PVxyXG4gICAgICAgIGlmIChhZGpUeXBlLmNhdGVnb3J5ID09PSBcInBlbmFsdHlcIiAmJiBydWxlcz8udHJpZ2dlciA9PT0gXCJsYXRlXCIpIHtcclxuICAgICAgICAgIGNvbnN0IHRocmVzaG9sZE1pbnV0ZXMgPSBydWxlcy5sYXRlX3RocmVzaG9sZF9taW51dGVzIHx8IDMwXHJcbiAgICAgICAgICBjb25zdCBleGVtcHRXaXRoUmVxdWVzdCA9IHJ1bGVzLmV4ZW1wdF93aXRoX3JlcXVlc3QgIT09IGZhbHNlXHJcblxyXG4gICAgICAgICAgY29uc3QgcGVuYWx0eURheXMgPSB2aW9sYXRpb25zLmZpbHRlcigodikgPT4ge1xyXG4gICAgICAgICAgICBpZiAodi5sYXRlTWludXRlcyA8PSB0aHJlc2hvbGRNaW51dGVzKSByZXR1cm4gZmFsc2VcclxuICAgICAgICAgICAgaWYgKGV4ZW1wdFdpdGhSZXF1ZXN0ICYmIHYuaGFzQXBwcm92ZWRSZXF1ZXN0KSByZXR1cm4gZmFsc2VcclxuICAgICAgICAgICAgcmV0dXJuIHRydWVcclxuICAgICAgICAgIH0pXHJcblxyXG4gICAgICAgICAgZm9yIChjb25zdCB2IG9mIHBlbmFsdHlEYXlzKSB7XHJcbiAgICAgICAgICAgIGxldCBwZW5hbHR5QW1vdW50ID0gMFxyXG4gICAgICAgICAgICBpZiAocnVsZXMucGVuYWx0eV90eXBlID09PSBcImhhbGZfZGF5X3NhbGFyeVwiKSB7XHJcbiAgICAgICAgICAgICAgcGVuYWx0eUFtb3VudCA9IGRhaWx5U2FsYXJ5IC8gMlxyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKHJ1bGVzLnBlbmFsdHlfdHlwZSA9PT0gXCJmdWxsX2RheV9zYWxhcnlcIikge1xyXG4gICAgICAgICAgICAgIHBlbmFsdHlBbW91bnQgPSBkYWlseVNhbGFyeVxyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKHJ1bGVzLnBlbmFsdHlfdHlwZSA9PT0gXCJmaXhlZF9hbW91bnRcIikge1xyXG4gICAgICAgICAgICAgIHBlbmFsdHlBbW91bnQgPSBhZGpUeXBlLmFtb3VudFxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB0b3RhbFBlbmFsdGllcyArPSBwZW5hbHR5QW1vdW50XHJcbiAgICAgICAgICAgIGFkanVzdG1lbnREZXRhaWxzLnB1c2goe1xyXG4gICAgICAgICAgICAgIGFkanVzdG1lbnRfdHlwZV9pZDogYWRqVHlwZS5pZCxcclxuICAgICAgICAgICAgICBjYXRlZ29yeTogXCJwZW5hbHR5XCIsXHJcbiAgICAgICAgICAgICAgYmFzZV9hbW91bnQ6IHBlbmFsdHlBbW91bnQsXHJcbiAgICAgICAgICAgICAgYWRqdXN0ZWRfYW1vdW50OiAwLFxyXG4gICAgICAgICAgICAgIGZpbmFsX2Ftb3VudDogcGVuYWx0eUFtb3VudCxcclxuICAgICAgICAgICAgICByZWFzb246IGDEkGkgbXXhu5luICR7di5sYXRlTWludXRlc30gcGjDunQgbmfDoHkgJHt2LmRhdGV9YCxcclxuICAgICAgICAgICAgICBvY2N1cnJlbmNlX2NvdW50OiAxLFxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8vIFjhu60gbMO9IGPDoWMgxJFp4buBdSBjaOG7iW5oIMSRxrDhu6NjIGfDoW4gdGjhu6cgY8O0bmcgY2hvIG5ow6JuIHZpw6puXHJcbiAgICBpZiAoZW1wQWRqdXN0bWVudHMpIHtcclxuICAgICAgZm9yIChjb25zdCBlbXBBZGogb2YgZW1wQWRqdXN0bWVudHMpIHtcclxuICAgICAgICBjb25zdCBhZGpUeXBlID0gZW1wQWRqLmFkanVzdG1lbnRfdHlwZSBhcyBQYXlyb2xsQWRqdXN0bWVudFR5cGVcclxuICAgICAgICBpZiAoIWFkalR5cGUgfHwgYWRqVHlwZS5pc19hdXRvX2FwcGxpZWQpIGNvbnRpbnVlIC8vIELhu48gcXVhIGF1dG8tYXBwbGllZCAoxJHDoyB44butIGzDvSDhu58gdHLDqm4pXHJcblxyXG4gICAgICAgIGNvbnN0IGFtb3VudCA9IGVtcEFkai5jdXN0b21fYW1vdW50IHx8IGFkalR5cGUuYW1vdW50XHJcblxyXG4gICAgICAgIGlmIChhZGpUeXBlLmNhdGVnb3J5ID09PSBcImFsbG93YW5jZVwiKSB7XHJcbiAgICAgICAgICB0b3RhbEFsbG93YW5jZXMgKz0gYW1vdW50XHJcbiAgICAgICAgfSBlbHNlIGlmIChhZGpUeXBlLmNhdGVnb3J5ID09PSBcImRlZHVjdGlvblwiKSB7XHJcbiAgICAgICAgICAvLyBUw61uaCBCSFhIIHRoZW8gJSBsxrDGoW5nIGPGoSBi4bqjblxyXG4gICAgICAgICAgbGV0IGZpbmFsQW1vdW50ID0gYW1vdW50XHJcbiAgICAgICAgICBpZiAoYWRqVHlwZS5hdXRvX3J1bGVzPy5jYWxjdWxhdGVfZnJvbSA9PT0gXCJiYXNlX3NhbGFyeVwiICYmIGFkalR5cGUuYXV0b19ydWxlcz8ucGVyY2VudGFnZSkge1xyXG4gICAgICAgICAgICBmaW5hbEFtb3VudCA9IChiYXNlU2FsYXJ5ICogYWRqVHlwZS5hdXRvX3J1bGVzLnBlcmNlbnRhZ2UpIC8gMTAwXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICB0b3RhbERlZHVjdGlvbnMgKz0gZmluYWxBbW91bnRcclxuICAgICAgICAgIGFkanVzdG1lbnREZXRhaWxzLnB1c2goe1xyXG4gICAgICAgICAgICBhZGp1c3RtZW50X3R5cGVfaWQ6IGFkalR5cGUuaWQsXHJcbiAgICAgICAgICAgIGNhdGVnb3J5OiBcImRlZHVjdGlvblwiLFxyXG4gICAgICAgICAgICBiYXNlX2Ftb3VudDogYW1vdW50LFxyXG4gICAgICAgICAgICBhZGp1c3RlZF9hbW91bnQ6IDAsXHJcbiAgICAgICAgICAgIGZpbmFsX2Ftb3VudDogZmluYWxBbW91bnQsXHJcbiAgICAgICAgICAgIHJlYXNvbjogYWRqVHlwZS5uYW1lLFxyXG4gICAgICAgICAgICBvY2N1cnJlbmNlX2NvdW50OiAxLFxyXG4gICAgICAgICAgfSlcclxuICAgICAgICB9IGVsc2UgaWYgKGFkalR5cGUuY2F0ZWdvcnkgPT09IFwicGVuYWx0eVwiKSB7XHJcbiAgICAgICAgICB0b3RhbFBlbmFsdGllcyArPSBhbW91bnRcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuICAgIC8vIFTDjU5IIEzGr8agTkcgQ1Xhu5BJIEPDmU5HXHJcbiAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuICAgIC8vIGFjdHVhbFdvcmtpbmdEYXlzIMSRw6MgdMOtbmg6IG5nw6B5IMSR4bunICsgMC41ICogbuG7rWEgbmfDoHksIHRy4burIG5nw6B5IGtow7RuZyB0w61uaCBjw7RuZ1xyXG4gICAgY29uc3QgZ3Jvc3NTYWxhcnkgPSBkYWlseVNhbGFyeSAqIGFjdHVhbFdvcmtpbmdEYXlzICsgZGFpbHlTYWxhcnkgKiBsZWF2ZURheXMgKyB0b3RhbEFsbG93YW5jZXNcclxuICAgIGNvbnN0IHRvdGFsRGVkdWN0aW9uID0gZGFpbHlTYWxhcnkgKiB1bnBhaWRMZWF2ZURheXMgKyB0b3RhbERlZHVjdGlvbnMgKyB0b3RhbFBlbmFsdGllc1xyXG4gICAgY29uc3QgbmV0U2FsYXJ5ID0gZ3Jvc3NTYWxhcnkgLSB0b3RhbERlZHVjdGlvblxyXG5cclxuICAgIC8vIFThuqFvIGdoaSBjaMO6IGNoaSB0aeG6v3RcclxuICAgIGxldCBub3RlSXRlbXM6IHN0cmluZ1tdID0gW11cclxuICAgIGlmIChsYXRlQ291bnQgPiAwKSBub3RlSXRlbXMucHVzaChgxJBpIG114buZbjogJHtsYXRlQ291bnR9IGzhuqduYClcclxuICAgIGlmIChoYWxmRGF5cyA+IDApIG5vdGVJdGVtcy5wdXNoKGBO4butYSBuZ8OgeTogJHtoYWxmRGF5c31gKVxyXG4gICAgaWYgKGFic2VudERheXMgPiAwKSBub3RlSXRlbXMucHVzaChgS2jDtG5nIHTDrW5oIGPDtG5nOiAke2Fic2VudERheXN9YClcclxuICAgIGNvbnN0IHBlbmFsdHlDb3VudCA9IGFkanVzdG1lbnREZXRhaWxzLmZpbHRlcihkID0+IGQuY2F0ZWdvcnkgPT09ICdwZW5hbHR5JykubGVuZ3RoXHJcbiAgICBpZiAocGVuYWx0eUNvdW50ID4gMCkgbm90ZUl0ZW1zLnB1c2goYFBo4bqhdDogJHtwZW5hbHR5Q291bnR9IGzhuqduYClcclxuXHJcbiAgICAvLyBJbnNlcnQgcGF5cm9sbCBpdGVtXHJcbiAgICBjb25zdCB7IGRhdGE6IHBheXJvbGxJdGVtLCBlcnJvcjogaW5zZXJ0RXJyb3IgfSA9IGF3YWl0IHN1cGFiYXNlXHJcbiAgICAgIC5mcm9tKFwicGF5cm9sbF9pdGVtc1wiKVxyXG4gICAgICAuaW5zZXJ0KHtcclxuICAgICAgICBwYXlyb2xsX3J1bl9pZDogcnVuLmlkLFxyXG4gICAgICAgIGVtcGxveWVlX2lkOiBlbXAuaWQsXHJcbiAgICAgICAgd29ya2luZ19kYXlzOiBhY3R1YWxXb3JraW5nRGF5cyxcclxuICAgICAgICBsZWF2ZV9kYXlzOiBsZWF2ZURheXMsXHJcbiAgICAgICAgdW5wYWlkX2xlYXZlX2RheXM6IHVucGFpZExlYXZlRGF5cyArIGFic2VudERheXMsIC8vIEPhu5luZyB0aMOqbSBuZ8OgeSBraMO0bmcgdMOtbmggY8O0bmdcclxuICAgICAgICBiYXNlX3NhbGFyeTogYmFzZVNhbGFyeSxcclxuICAgICAgICBhbGxvd2FuY2VzOiB0b3RhbEFsbG93YW5jZXMsXHJcbiAgICAgICAgdG90YWxfaW5jb21lOiBncm9zc1NhbGFyeSxcclxuICAgICAgICB0b3RhbF9kZWR1Y3Rpb246IHRvdGFsRGVkdWN0aW9uLFxyXG4gICAgICAgIG5ldF9zYWxhcnk6IG5ldFNhbGFyeSxcclxuICAgICAgICBub3RlOiBub3RlSXRlbXMuam9pbihcIiwgXCIpIHx8IG51bGwsXHJcbiAgICAgIH0pXHJcbiAgICAgIC5zZWxlY3QoKVxyXG4gICAgICAuc2luZ2xlKClcclxuXHJcbiAgICBpZiAoaW5zZXJ0RXJyb3IpIHtcclxuICAgICAgY29uc29sZS5lcnJvcihgRXJyb3IgaW5zZXJ0aW5nIHBheXJvbGwgaXRlbSBmb3IgJHtlbXAuZnVsbF9uYW1lfTpgLCBpbnNlcnRFcnJvcilcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHByb2Nlc3NlZENvdW50KytcclxuXHJcbiAgICAgIC8vIEluc2VydCBhZGp1c3RtZW50IGRldGFpbHNcclxuICAgICAgaWYgKHBheXJvbGxJdGVtICYmIGFkanVzdG1lbnREZXRhaWxzLmxlbmd0aCA+IDApIHtcclxuICAgICAgICBjb25zdCBkZXRhaWxzV2l0aEl0ZW1JZCA9IGFkanVzdG1lbnREZXRhaWxzLm1hcCgoZCkgPT4gKHtcclxuICAgICAgICAgIC4uLmQsXHJcbiAgICAgICAgICBwYXlyb2xsX2l0ZW1faWQ6IHBheXJvbGxJdGVtLmlkLFxyXG4gICAgICAgIH0pKVxyXG4gICAgICAgIGF3YWl0IHN1cGFiYXNlLmZyb20oXCJwYXlyb2xsX2FkanVzdG1lbnRfZGV0YWlsc1wiKS5pbnNlcnQoZGV0YWlsc1dpdGhJdGVtSWQpXHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcblxyXG4gIHJldmFsaWRhdGVQYXRoKFwiL2Rhc2hib2FyZC9wYXlyb2xsXCIpXHJcbiAgcmV0dXJuIHsgc3VjY2VzczogdHJ1ZSwgZGF0YTogcnVuLCBtZXNzYWdlOiBgxJDDoyB04bqhbyBi4bqjbmcgbMawxqFuZyBjaG8gJHtwcm9jZXNzZWRDb3VudH0gbmjDom4gdmnDqm5gIH1cclxufVxyXG5cclxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcbi8vIEhSIEFDVElPTlMgLSBMT0NLL1VOTE9DSyBQQVlST0xMXHJcbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGxvY2tQYXlyb2xsKGlkOiBzdHJpbmcpIHtcclxuICBjb25zdCBzdXBhYmFzZSA9IGF3YWl0IGNyZWF0ZUNsaWVudCgpXHJcblxyXG4gIGNvbnN0IHsgZXJyb3IgfSA9IGF3YWl0IHN1cGFiYXNlXHJcbiAgICAuZnJvbShcInBheXJvbGxfcnVuc1wiKVxyXG4gICAgLnVwZGF0ZSh7IHN0YXR1czogXCJsb2NrZWRcIiB9KVxyXG4gICAgLmVxKFwiaWRcIiwgaWQpXHJcbiAgICAuZXEoXCJzdGF0dXNcIiwgXCJkcmFmdFwiKVxyXG5cclxuICBpZiAoZXJyb3IpIHtcclxuICAgIGNvbnNvbGUuZXJyb3IoXCJFcnJvciBsb2NraW5nIHBheXJvbGw6XCIsIGVycm9yKVxyXG4gICAgcmV0dXJuIHsgc3VjY2VzczogZmFsc2UsIGVycm9yOiBlcnJvci5tZXNzYWdlIH1cclxuICB9XHJcblxyXG4gIHJldmFsaWRhdGVQYXRoKFwiL2Rhc2hib2FyZC9wYXlyb2xsXCIpXHJcbiAgcmV0dXJuIHsgc3VjY2VzczogdHJ1ZSB9XHJcbn1cclxuXHJcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBtYXJrUGF5cm9sbFBhaWQoaWQ6IHN0cmluZykge1xyXG4gIGNvbnN0IHN1cGFiYXNlID0gYXdhaXQgY3JlYXRlQ2xpZW50KClcclxuXHJcbiAgY29uc3QgeyBlcnJvciB9ID0gYXdhaXQgc3VwYWJhc2VcclxuICAgIC5mcm9tKFwicGF5cm9sbF9ydW5zXCIpXHJcbiAgICAudXBkYXRlKHsgc3RhdHVzOiBcInBhaWRcIiB9KVxyXG4gICAgLmVxKFwiaWRcIiwgaWQpXHJcbiAgICAuZXEoXCJzdGF0dXNcIiwgXCJsb2NrZWRcIilcclxuXHJcbiAgaWYgKGVycm9yKSB7XHJcbiAgICBjb25zb2xlLmVycm9yKFwiRXJyb3IgbWFya2luZyBwYXlyb2xsIGFzIHBhaWQ6XCIsIGVycm9yKVxyXG4gICAgcmV0dXJuIHsgc3VjY2VzczogZmFsc2UsIGVycm9yOiBlcnJvci5tZXNzYWdlIH1cclxuICB9XHJcblxyXG4gIHJldmFsaWRhdGVQYXRoKFwiL2Rhc2hib2FyZC9wYXlyb2xsXCIpXHJcbiAgcmV0dXJuIHsgc3VjY2VzczogdHJ1ZSB9XHJcbn1cclxuXHJcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBkZWxldGVQYXlyb2xsUnVuKGlkOiBzdHJpbmcpIHtcclxuICBjb25zdCBzdXBhYmFzZSA9IGF3YWl0IGNyZWF0ZUNsaWVudCgpXHJcblxyXG4gIC8vIENo4buJIHjDs2EgxJHGsOG7o2MgZHJhZnRcclxuICBjb25zdCB7IGVycm9yIH0gPSBhd2FpdCBzdXBhYmFzZVxyXG4gICAgLmZyb20oXCJwYXlyb2xsX3J1bnNcIilcclxuICAgIC5kZWxldGUoKVxyXG4gICAgLmVxKFwiaWRcIiwgaWQpXHJcbiAgICAuZXEoXCJzdGF0dXNcIiwgXCJkcmFmdFwiKVxyXG5cclxuICBpZiAoZXJyb3IpIHtcclxuICAgIGNvbnNvbGUuZXJyb3IoXCJFcnJvciBkZWxldGluZyBwYXlyb2xsIHJ1bjpcIiwgZXJyb3IpXHJcbiAgICByZXR1cm4geyBzdWNjZXNzOiBmYWxzZSwgZXJyb3I6IGVycm9yLm1lc3NhZ2UgfVxyXG4gIH1cclxuXHJcbiAgcmV2YWxpZGF0ZVBhdGgoXCIvZGFzaGJvYXJkL3BheXJvbGxcIilcclxuICByZXR1cm4geyBzdWNjZXNzOiB0cnVlIH1cclxufVxyXG5cclxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcbi8vIEhSIEFDVElPTlMgLSBTQUxBUlkgU1RSVUNUVVJFXHJcbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGxpc3RTYWxhcnlTdHJ1Y3R1cmUoXHJcbiAgZW1wbG95ZWVfaWQ6IHN0cmluZ1xyXG4pOiBQcm9taXNlPFNhbGFyeVN0cnVjdHVyZVtdPiB7XHJcbiAgY29uc3Qgc3VwYWJhc2UgPSBhd2FpdCBjcmVhdGVDbGllbnQoKVxyXG5cclxuICBjb25zdCB7IGRhdGEsIGVycm9yIH0gPSBhd2FpdCBzdXBhYmFzZVxyXG4gICAgLmZyb20oXCJzYWxhcnlfc3RydWN0dXJlXCIpXHJcbiAgICAuc2VsZWN0KFwiKlwiKVxyXG4gICAgLmVxKFwiZW1wbG95ZWVfaWRcIiwgZW1wbG95ZWVfaWQpXHJcbiAgICAub3JkZXIoXCJlZmZlY3RpdmVfZGF0ZVwiLCB7IGFzY2VuZGluZzogZmFsc2UgfSlcclxuXHJcbiAgaWYgKGVycm9yKSB7XHJcbiAgICBjb25zb2xlLmVycm9yKFwiRXJyb3IgbGlzdGluZyBzYWxhcnkgc3RydWN0dXJlOlwiLCBlcnJvcilcclxuICAgIHJldHVybiBbXVxyXG4gIH1cclxuXHJcbiAgcmV0dXJuIGRhdGEgfHwgW11cclxufVxyXG5cclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGNyZWF0ZVNhbGFyeVN0cnVjdHVyZShpbnB1dDoge1xyXG4gIGVtcGxveWVlX2lkOiBzdHJpbmdcclxuICBiYXNlX3NhbGFyeTogbnVtYmVyXHJcbiAgYWxsb3dhbmNlPzogbnVtYmVyXHJcbiAgZWZmZWN0aXZlX2RhdGU6IHN0cmluZ1xyXG4gIG5vdGU/OiBzdHJpbmdcclxufSkge1xyXG4gIGNvbnN0IHN1cGFiYXNlID0gYXdhaXQgY3JlYXRlQ2xpZW50KClcclxuXHJcbiAgY29uc3QgeyBlcnJvciB9ID0gYXdhaXQgc3VwYWJhc2UuZnJvbShcInNhbGFyeV9zdHJ1Y3R1cmVcIikuaW5zZXJ0KHtcclxuICAgIGVtcGxveWVlX2lkOiBpbnB1dC5lbXBsb3llZV9pZCxcclxuICAgIGJhc2Vfc2FsYXJ5OiBpbnB1dC5iYXNlX3NhbGFyeSxcclxuICAgIGFsbG93YW5jZTogaW5wdXQuYWxsb3dhbmNlIHx8IDAsXHJcbiAgICBlZmZlY3RpdmVfZGF0ZTogaW5wdXQuZWZmZWN0aXZlX2RhdGUsXHJcbiAgICBub3RlOiBpbnB1dC5ub3RlLFxyXG4gIH0pXHJcblxyXG4gIGlmIChlcnJvcikge1xyXG4gICAgY29uc29sZS5lcnJvcihcIkVycm9yIGNyZWF0aW5nIHNhbGFyeSBzdHJ1Y3R1cmU6XCIsIGVycm9yKVxyXG4gICAgcmV0dXJuIHsgc3VjY2VzczogZmFsc2UsIGVycm9yOiBlcnJvci5tZXNzYWdlIH1cclxuICB9XHJcblxyXG4gIHJldmFsaWRhdGVQYXRoKFwiL2Rhc2hib2FyZC9lbXBsb3llZXNcIilcclxuICByZXR1cm4geyBzdWNjZXNzOiB0cnVlIH1cclxufVxyXG5cclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGdldE15U2FsYXJ5KCk6IFByb21pc2U8U2FsYXJ5U3RydWN0dXJlIHwgbnVsbD4ge1xyXG4gIGNvbnN0IHN1cGFiYXNlID0gYXdhaXQgY3JlYXRlQ2xpZW50KClcclxuXHJcbiAgY29uc3Qge1xyXG4gICAgZGF0YTogeyB1c2VyIH0sXHJcbiAgfSA9IGF3YWl0IHN1cGFiYXNlLmF1dGguZ2V0VXNlcigpXHJcbiAgaWYgKCF1c2VyKSByZXR1cm4gbnVsbFxyXG5cclxuICBjb25zdCB7IGRhdGE6IGVtcGxveWVlIH0gPSBhd2FpdCBzdXBhYmFzZVxyXG4gICAgLmZyb20oXCJlbXBsb3llZXNcIilcclxuICAgIC5zZWxlY3QoXCJpZFwiKVxyXG4gICAgLmVxKFwidXNlcl9pZFwiLCB1c2VyLmlkKVxyXG4gICAgLnNpbmdsZSgpXHJcblxyXG4gIGlmICghZW1wbG95ZWUpIHJldHVybiBudWxsXHJcblxyXG4gIGNvbnN0IHsgZGF0YSB9ID0gYXdhaXQgc3VwYWJhc2VcclxuICAgIC5mcm9tKFwic2FsYXJ5X3N0cnVjdHVyZVwiKVxyXG4gICAgLnNlbGVjdChcIipcIilcclxuICAgIC5lcShcImVtcGxveWVlX2lkXCIsIGVtcGxveWVlLmlkKVxyXG4gICAgLm9yZGVyKFwiZWZmZWN0aXZlX2RhdGVcIiwgeyBhc2NlbmRpbmc6IGZhbHNlIH0pXHJcbiAgICAubGltaXQoMSlcclxuICAgIC5zaW5nbGUoKVxyXG5cclxuICByZXR1cm4gZGF0YSB8fCBudWxsXHJcbn1cclxuXHJcbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG4vLyBQQVlST0xMIEFESlVTVE1FTlQgREVUQUlMU1xyXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHJcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBnZXRQYXlyb2xsQWRqdXN0bWVudERldGFpbHMocGF5cm9sbF9pdGVtX2lkOiBzdHJpbmcpIHtcclxuICBjb25zdCBzdXBhYmFzZSA9IGF3YWl0IGNyZWF0ZUNsaWVudCgpXHJcblxyXG4gIGNvbnN0IHsgZGF0YSwgZXJyb3IgfSA9IGF3YWl0IHN1cGFiYXNlXHJcbiAgICAuZnJvbShcInBheXJvbGxfYWRqdXN0bWVudF9kZXRhaWxzXCIpXHJcbiAgICAuc2VsZWN0KGBcclxuICAgICAgKixcclxuICAgICAgYWRqdXN0bWVudF90eXBlOnBheXJvbGxfYWRqdXN0bWVudF90eXBlcyhpZCwgbmFtZSwgY29kZSwgY2F0ZWdvcnkpXHJcbiAgICBgKVxyXG4gICAgLmVxKFwicGF5cm9sbF9pdGVtX2lkXCIsIHBheXJvbGxfaXRlbV9pZClcclxuICAgIC5vcmRlcihcImNhdGVnb3J5XCIpXHJcblxyXG4gIGlmIChlcnJvcikge1xyXG4gICAgY29uc29sZS5lcnJvcihcIkVycm9yIGZldGNoaW5nIGFkanVzdG1lbnQgZGV0YWlsczpcIiwgZXJyb3IpXHJcbiAgICByZXR1cm4gW11cclxuICB9XHJcblxyXG4gIHJldHVybiBkYXRhIHx8IFtdXHJcbn1cclxuIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJtU0EybUJzQiJ9
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/actions/data:bd8f6d [app-client] (ecmascript) <text/javascript>", ((__turbopack_context__) => {
"use strict";

/* __next_internal_action_entry_do_not_use__ [{"403a965c140936f6d06f11d2499e56c3ac24eeaa42":"markPayrollPaid"},"lib/actions/payroll-actions.ts",""] */ __turbopack_context__.s([
    "markPayrollPaid",
    ()=>markPayrollPaid
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.10_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-client-wrapper.js [app-client] (ecmascript)");
"use turbopack no side effects";
;
var markPayrollPaid = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createServerReference"])("403a965c140936f6d06f11d2499e56c3ac24eeaa42", __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["callServer"], void 0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["findSourceMapURL"], "markPayrollPaid"); //# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4vcGF5cm9sbC1hY3Rpb25zLnRzIl0sInNvdXJjZXNDb250ZW50IjpbIlwidXNlIHNlcnZlclwiXHJcblxyXG5pbXBvcnQgeyBjcmVhdGVDbGllbnQgfSBmcm9tIFwiQC9saWIvc3VwYWJhc2Uvc2VydmVyXCJcclxuaW1wb3J0IHsgcmV2YWxpZGF0ZVBhdGggfSBmcm9tIFwibmV4dC9jYWNoZVwiXHJcbmltcG9ydCB0eXBlIHtcclxuICBQYXlyb2xsUnVuLFxyXG4gIFBheXJvbGxJdGVtV2l0aFJlbGF0aW9ucyxcclxuICBTYWxhcnlTdHJ1Y3R1cmUsXHJcbiAgUGF5cm9sbEFkanVzdG1lbnRUeXBlLFxyXG59IGZyb20gXCJAL2xpYi90eXBlcy9kYXRhYmFzZVwiXHJcblxyXG5jb25zdCBTVEFOREFSRF9XT1JLSU5HX0RBWVMgPSAyNiAvLyBDw7RuZyBjaHXhuqluIFZOXHJcblxyXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuLy8gRU1QTE9ZRUUgQUNUSU9OU1xyXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHJcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBnZXRNeVBheXNsaXBzKCk6IFByb21pc2U8UGF5cm9sbEl0ZW1XaXRoUmVsYXRpb25zW10+IHtcclxuICBjb25zdCBzdXBhYmFzZSA9IGF3YWl0IGNyZWF0ZUNsaWVudCgpXHJcblxyXG4gIGNvbnN0IHtcclxuICAgIGRhdGE6IHsgdXNlciB9LFxyXG4gIH0gPSBhd2FpdCBzdXBhYmFzZS5hdXRoLmdldFVzZXIoKVxyXG4gIGlmICghdXNlcikgcmV0dXJuIFtdXHJcblxyXG4gIGNvbnN0IHsgZGF0YTogZW1wbG95ZWUgfSA9IGF3YWl0IHN1cGFiYXNlXHJcbiAgICAuZnJvbShcImVtcGxveWVlc1wiKVxyXG4gICAgLnNlbGVjdChcImlkXCIpXHJcbiAgICAuZXEoXCJ1c2VyX2lkXCIsIHVzZXIuaWQpXHJcbiAgICAuc2luZ2xlKClcclxuXHJcbiAgaWYgKCFlbXBsb3llZSkgcmV0dXJuIFtdXHJcblxyXG4gIGNvbnN0IHsgZGF0YSwgZXJyb3IgfSA9IGF3YWl0IHN1cGFiYXNlXHJcbiAgICAuZnJvbShcInBheXJvbGxfaXRlbXNcIilcclxuICAgIC5zZWxlY3QoXHJcbiAgICAgIGBcclxuICAgICAgKixcclxuICAgICAgcGF5cm9sbF9ydW46cGF5cm9sbF9ydW5zKCopXHJcbiAgICBgXHJcbiAgICApXHJcbiAgICAuZXEoXCJlbXBsb3llZV9pZFwiLCBlbXBsb3llZS5pZClcclxuICAgIC5vcmRlcihcImNyZWF0ZWRfYXRcIiwgeyBhc2NlbmRpbmc6IGZhbHNlIH0pXHJcblxyXG4gIGlmIChlcnJvcikge1xyXG4gICAgY29uc29sZS5lcnJvcihcIkVycm9yIGZldGNoaW5nIHBheXNsaXBzOlwiLCBlcnJvcilcclxuICAgIHJldHVybiBbXVxyXG4gIH1cclxuXHJcbiAgcmV0dXJuIChkYXRhIHx8IFtdKSBhcyBQYXlyb2xsSXRlbVdpdGhSZWxhdGlvbnNbXVxyXG59XHJcblxyXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuLy8gSFIgQUNUSU9OUyAtIFBBWVJPTEwgUlVOU1xyXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHJcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBsaXN0UGF5cm9sbFJ1bnMoKTogUHJvbWlzZTxQYXlyb2xsUnVuW10+IHtcclxuICBjb25zdCBzdXBhYmFzZSA9IGF3YWl0IGNyZWF0ZUNsaWVudCgpXHJcblxyXG4gIGNvbnN0IHsgZGF0YSwgZXJyb3IgfSA9IGF3YWl0IHN1cGFiYXNlXHJcbiAgICAuZnJvbShcInBheXJvbGxfcnVuc1wiKVxyXG4gICAgLnNlbGVjdChcIipcIilcclxuICAgIC5vcmRlcihcInllYXJcIiwgeyBhc2NlbmRpbmc6IGZhbHNlIH0pXHJcbiAgICAub3JkZXIoXCJtb250aFwiLCB7IGFzY2VuZGluZzogZmFsc2UgfSlcclxuXHJcbiAgaWYgKGVycm9yKSB7XHJcbiAgICBjb25zb2xlLmVycm9yKFwiRXJyb3IgbGlzdGluZyBwYXlyb2xsIHJ1bnM6XCIsIGVycm9yKVxyXG4gICAgcmV0dXJuIFtdXHJcbiAgfVxyXG5cclxuICByZXR1cm4gZGF0YSB8fCBbXVxyXG59XHJcblxyXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZ2V0UGF5cm9sbFJ1bihpZDogc3RyaW5nKTogUHJvbWlzZTxQYXlyb2xsUnVuIHwgbnVsbD4ge1xyXG4gIGNvbnN0IHN1cGFiYXNlID0gYXdhaXQgY3JlYXRlQ2xpZW50KClcclxuXHJcbiAgY29uc3QgeyBkYXRhLCBlcnJvciB9ID0gYXdhaXQgc3VwYWJhc2VcclxuICAgIC5mcm9tKFwicGF5cm9sbF9ydW5zXCIpXHJcbiAgICAuc2VsZWN0KFwiKlwiKVxyXG4gICAgLmVxKFwiaWRcIiwgaWQpXHJcbiAgICAuc2luZ2xlKClcclxuXHJcbiAgaWYgKGVycm9yKSB7XHJcbiAgICBjb25zb2xlLmVycm9yKFwiRXJyb3IgZmV0Y2hpbmcgcGF5cm9sbCBydW46XCIsIGVycm9yKVxyXG4gICAgcmV0dXJuIG51bGxcclxuICB9XHJcblxyXG4gIHJldHVybiBkYXRhXHJcbn1cclxuXHJcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBnZXRQYXlyb2xsSXRlbXMoXHJcbiAgcGF5cm9sbF9ydW5faWQ6IHN0cmluZ1xyXG4pOiBQcm9taXNlPFBheXJvbGxJdGVtV2l0aFJlbGF0aW9uc1tdPiB7XHJcbiAgY29uc3Qgc3VwYWJhc2UgPSBhd2FpdCBjcmVhdGVDbGllbnQoKVxyXG5cclxuICBjb25zdCB7IGRhdGEsIGVycm9yIH0gPSBhd2FpdCBzdXBhYmFzZVxyXG4gICAgLmZyb20oXCJwYXlyb2xsX2l0ZW1zXCIpXHJcbiAgICAuc2VsZWN0KFxyXG4gICAgICBgXHJcbiAgICAgICosXHJcbiAgICAgIGVtcGxveWVlOmVtcGxveWVlcyhpZCwgZnVsbF9uYW1lLCBlbXBsb3llZV9jb2RlLCBkZXBhcnRtZW50X2lkLCBkZXBhcnRtZW50OmRlcGFydG1lbnRzKG5hbWUpKVxyXG4gICAgYFxyXG4gICAgKVxyXG4gICAgLmVxKFwicGF5cm9sbF9ydW5faWRcIiwgcGF5cm9sbF9ydW5faWQpXHJcbiAgICAub3JkZXIoXCJjcmVhdGVkX2F0XCIsIHsgYXNjZW5kaW5nOiB0cnVlIH0pXHJcblxyXG4gIGlmIChlcnJvcikge1xyXG4gICAgY29uc29sZS5lcnJvcihcIkVycm9yIGZldGNoaW5nIHBheXJvbGwgaXRlbXM6XCIsIGVycm9yKVxyXG4gICAgcmV0dXJuIFtdXHJcbiAgfVxyXG5cclxuICByZXR1cm4gKGRhdGEgfHwgW10pIGFzIFBheXJvbGxJdGVtV2l0aFJlbGF0aW9uc1tdXHJcbn1cclxuXHJcbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG4vLyBIUiBBQ1RJT05TIC0gR0VORVJBVEUgUEFZUk9MTCAoduG7m2kgcGjhu6UgY+G6pXAsIHF14bu5LCBwaOG6oXQpXHJcbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cclxuaW50ZXJmYWNlIEF0dGVuZGFuY2VWaW9sYXRpb24ge1xyXG4gIGRhdGU6IHN0cmluZ1xyXG4gIGxhdGVNaW51dGVzOiBudW1iZXJcclxuICBlYXJseU1pbnV0ZXM6IG51bWJlclxyXG4gIGlzSGFsZkRheTogYm9vbGVhbiAvLyBOZ2jhu4kgbuG7rWEgbmfDoHkgKGNhIHPDoW5nIGhv4bq3YyBjYSBjaGnhu4F1KVxyXG4gIGlzQWJzZW50OiBib29sZWFuIC8vIEtow7RuZyB0w61uaCBjw7RuZyAoxJFpIG114buZbiA+MSB0aeG6v25nIGtow7RuZyBjw7MgcGjDqXApXHJcbiAgaGFzQXBwcm92ZWRSZXF1ZXN0OiBib29sZWFuXHJcbn1cclxuXHJcbmludGVyZmFjZSBTaGlmdEluZm8ge1xyXG4gIHN0YXJ0VGltZTogc3RyaW5nIC8vIFwiMDg6MDBcIlxyXG4gIGVuZFRpbWU6IHN0cmluZyAvLyBcIjE3OjAwXCJcclxuICBicmVha1N0YXJ0OiBzdHJpbmcgfCBudWxsIC8vIFwiMTI6MDBcIlxyXG4gIGJyZWFrRW5kOiBzdHJpbmcgfCBudWxsIC8vIFwiMTM6MzBcIlxyXG59XHJcblxyXG5hc3luYyBmdW5jdGlvbiBnZXRFbXBsb3llZVZpb2xhdGlvbnMoXHJcbiAgc3VwYWJhc2U6IGFueSxcclxuICBlbXBsb3llZUlkOiBzdHJpbmcsXHJcbiAgc3RhcnREYXRlOiBzdHJpbmcsXHJcbiAgZW5kRGF0ZTogc3RyaW5nLFxyXG4gIHNoaWZ0OiBTaGlmdEluZm9cclxuKTogUHJvbWlzZTxBdHRlbmRhbmNlVmlvbGF0aW9uW10+IHtcclxuICBjb25zdCB2aW9sYXRpb25zOiBBdHRlbmRhbmNlVmlvbGF0aW9uW10gPSBbXVxyXG5cclxuICAvLyBM4bqleSBhdHRlbmRhbmNlIGxvZ3NcclxuICBjb25zdCB7IGRhdGE6IGxvZ3MgfSA9IGF3YWl0IHN1cGFiYXNlXHJcbiAgICAuZnJvbShcImF0dGVuZGFuY2VfbG9nc1wiKVxyXG4gICAgLnNlbGVjdChcImNoZWNrX2luLCBjaGVja19vdXRcIilcclxuICAgIC5lcShcImVtcGxveWVlX2lkXCIsIGVtcGxveWVlSWQpXHJcbiAgICAuZ3RlKFwiY2hlY2tfaW5cIiwgc3RhcnREYXRlKVxyXG4gICAgLmx0ZShcImNoZWNrX2luXCIsIGVuZERhdGUgKyBcIlQyMzo1OTo1OVwiKVxyXG5cclxuICAvLyBM4bqleSB0aW1lIGFkanVzdG1lbnQgcmVxdWVzdHMgxJHDoyBhcHByb3ZlZFxyXG4gIGNvbnN0IHsgZGF0YTogYXBwcm92ZWRSZXF1ZXN0cyB9ID0gYXdhaXQgc3VwYWJhc2VcclxuICAgIC5mcm9tKFwidGltZV9hZGp1c3RtZW50X3JlcXVlc3RzXCIpXHJcbiAgICAuc2VsZWN0KFwicmVxdWVzdF9kYXRlXCIpXHJcbiAgICAuZXEoXCJlbXBsb3llZV9pZFwiLCBlbXBsb3llZUlkKVxyXG4gICAgLmVxKFwic3RhdHVzXCIsIFwiYXBwcm92ZWRcIilcclxuICAgIC5ndGUoXCJyZXF1ZXN0X2RhdGVcIiwgc3RhcnREYXRlKVxyXG4gICAgLmx0ZShcInJlcXVlc3RfZGF0ZVwiLCBlbmREYXRlKVxyXG5cclxuICBjb25zdCBhcHByb3ZlZERhdGVzID0gbmV3IFNldCgoYXBwcm92ZWRSZXF1ZXN0cyB8fCBbXSkubWFwKChyOiBhbnkpID0+IHIucmVxdWVzdF9kYXRlKSlcclxuXHJcbiAgaWYgKGxvZ3MpIHtcclxuICAgIGNvbnN0IFtzaGlmdEgsIHNoaWZ0TV0gPSBzaGlmdC5zdGFydFRpbWUuc3BsaXQoXCI6XCIpLm1hcChOdW1iZXIpXHJcbiAgICBjb25zdCBzaGlmdFN0YXJ0TWludXRlcyA9IHNoaWZ0SCAqIDYwICsgc2hpZnRNXHJcblxyXG4gICAgLy8gUGFyc2UgYnJlYWsgdGltZXNcclxuICAgIGxldCBicmVha1N0YXJ0TWludXRlcyA9IDBcclxuICAgIGxldCBicmVha0VuZE1pbnV0ZXMgPSAwXHJcbiAgICBpZiAoc2hpZnQuYnJlYWtTdGFydCAmJiBzaGlmdC5icmVha0VuZCkge1xyXG4gICAgICBjb25zdCBbYnNILCBic01dID0gc2hpZnQuYnJlYWtTdGFydC5zcGxpdChcIjpcIikubWFwKE51bWJlcilcclxuICAgICAgY29uc3QgW2JlSCwgYmVNXSA9IHNoaWZ0LmJyZWFrRW5kLnNwbGl0KFwiOlwiKS5tYXAoTnVtYmVyKVxyXG4gICAgICBicmVha1N0YXJ0TWludXRlcyA9IGJzSCAqIDYwICsgYnNNXHJcbiAgICAgIGJyZWFrRW5kTWludXRlcyA9IGJlSCAqIDYwICsgYmVNXHJcbiAgICB9XHJcblxyXG4gICAgZm9yIChjb25zdCBsb2cgb2YgbG9ncykge1xyXG4gICAgICBpZiAoIWxvZy5jaGVja19pbikgY29udGludWVcclxuXHJcbiAgICAgIGNvbnN0IGNoZWNrSW5EYXRlID0gbmV3IERhdGUobG9nLmNoZWNrX2luKVxyXG4gICAgICBjb25zdCBkYXRlU3RyID0gY2hlY2tJbkRhdGUudG9JU09TdHJpbmcoKS5zcGxpdChcIlRcIilbMF1cclxuICAgICAgY29uc3QgY2hlY2tJbkhvdXIgPSBjaGVja0luRGF0ZS5nZXRIb3VycygpXHJcbiAgICAgIGNvbnN0IGNoZWNrSW5NaW4gPSBjaGVja0luRGF0ZS5nZXRNaW51dGVzKClcclxuICAgICAgY29uc3QgY2hlY2tJbk1pbnV0ZXMgPSBjaGVja0luSG91ciAqIDYwICsgY2hlY2tJbk1pblxyXG5cclxuICAgICAgY29uc3QgaGFzQXBwcm92ZWRSZXF1ZXN0ID0gYXBwcm92ZWREYXRlcy5oYXMoZGF0ZVN0cilcclxuXHJcbiAgICAgIC8vIEtp4buDbSB0cmEgbuG6v3UgY2hlY2sgaW4gdHJvbmcgZ2nhu50gbmdo4buJIHRyxrBhIGhv4bq3YyBzYXUgZ2nhu50gbmdo4buJIHRyxrBhXHJcbiAgICAgIC8vID0+IE5naOG7iSBjYSBzw6FuZywgxJFpIGzDoG0gY2EgY2hp4buBdSAodMOtbmggbuG7rWEgbmfDoHkpXHJcbiAgICAgIGxldCBpc0hhbGZEYXkgPSBmYWxzZVxyXG4gICAgICBsZXQgbGF0ZU1pbnV0ZXMgPSAwXHJcblxyXG4gICAgICBpZiAoYnJlYWtTdGFydE1pbnV0ZXMgPiAwICYmIGJyZWFrRW5kTWludXRlcyA+IDApIHtcclxuICAgICAgICAvLyBDaGVjayBpbiB0cm9uZyBraG/huqNuZyBuZ2jhu4kgdHLGsGEgaG/hurdjIMSR4bqndSBjYSBjaGnhu4F1XHJcbiAgICAgICAgaWYgKGNoZWNrSW5NaW51dGVzID49IGJyZWFrU3RhcnRNaW51dGVzICYmIGNoZWNrSW5NaW51dGVzIDw9IGJyZWFrRW5kTWludXRlcyArIDE1KSB7XHJcbiAgICAgICAgICAvLyBDaGVjayBpbiB04burIDEyOjAwIMSR4bq/biAxMzo0NSA9PiBuZ2jhu4kgY2Egc8OhbmcsIMSRaSBjYSBjaGnhu4F1XHJcbiAgICAgICAgICBpc0hhbGZEYXkgPSB0cnVlXHJcbiAgICAgICAgICBsYXRlTWludXRlcyA9IDAgLy8gS2jDtG5nIHTDrW5oIGzDoCDEkWkgbXXhu5luXHJcbiAgICAgICAgfSBlbHNlIGlmIChjaGVja0luTWludXRlcyA+IGJyZWFrRW5kTWludXRlcyArIDE1KSB7XHJcbiAgICAgICAgICAvLyBDaGVjayBpbiBzYXUgMTM6NDUgPT4gxJFpIG114buZbiBjYSBjaGnhu4F1XHJcbiAgICAgICAgICBsYXRlTWludXRlcyA9IGNoZWNrSW5NaW51dGVzIC0gYnJlYWtFbmRNaW51dGVzXHJcbiAgICAgICAgICBpc0hhbGZEYXkgPSB0cnVlXHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIC8vIENoZWNrIGluIHRyxrDhu5tjIGdp4budIG5naOG7iSB0csawYSA9PiB0w61uaCDEkWkgbXXhu5luIGLDrG5oIHRoxrDhu51uZ1xyXG4gICAgICAgICAgbGF0ZU1pbnV0ZXMgPSBNYXRoLm1heCgwLCBjaGVja0luTWludXRlcyAtIHNoaWZ0U3RhcnRNaW51dGVzKVxyXG4gICAgICAgIH1cclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICAvLyBLaMO0bmcgY8OzIGdp4budIG5naOG7iSB0csawYSA9PiB0w61uaCDEkWkgbXXhu5luIGLDrG5oIHRoxrDhu51uZ1xyXG4gICAgICAgIGxhdGVNaW51dGVzID0gTWF0aC5tYXgoMCwgY2hlY2tJbk1pbnV0ZXMgLSBzaGlmdFN0YXJ0TWludXRlcylcclxuICAgICAgfVxyXG5cclxuICAgICAgLy8gxJBpIG114buZbiA+NjAgcGjDunQgdsOgIGtow7RuZyBjw7MgcGjDqXAgPT4ga2jDtG5nIHTDrW5oIGPDtG5nIChpc0Fic2VudClcclxuICAgICAgY29uc3QgaXNBYnNlbnQgPSBsYXRlTWludXRlcyA+IDYwICYmICFoYXNBcHByb3ZlZFJlcXVlc3RcclxuXHJcbiAgICAgIHZpb2xhdGlvbnMucHVzaCh7XHJcbiAgICAgICAgZGF0ZTogZGF0ZVN0cixcclxuICAgICAgICBsYXRlTWludXRlcyxcclxuICAgICAgICBlYXJseU1pbnV0ZXM6IDAsXHJcbiAgICAgICAgaXNIYWxmRGF5LFxyXG4gICAgICAgIGlzQWJzZW50LFxyXG4gICAgICAgIGhhc0FwcHJvdmVkUmVxdWVzdCxcclxuICAgICAgfSlcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHJldHVybiB2aW9sYXRpb25zXHJcbn1cclxuXHJcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBnZW5lcmF0ZVBheXJvbGwobW9udGg6IG51bWJlciwgeWVhcjogbnVtYmVyKSB7XHJcbiAgY29uc3Qgc3VwYWJhc2UgPSBhd2FpdCBjcmVhdGVDbGllbnQoKVxyXG5cclxuICBjb25zdCB7XHJcbiAgICBkYXRhOiB7IHVzZXIgfSxcclxuICB9ID0gYXdhaXQgc3VwYWJhc2UuYXV0aC5nZXRVc2VyKClcclxuICBpZiAoIXVzZXIpIHJldHVybiB7IHN1Y2Nlc3M6IGZhbHNlLCBlcnJvcjogXCJDaMawYSDEkcSDbmcgbmjhuq1wXCIgfVxyXG5cclxuICAvLyBLaeG7g20gdHJhIMSRw6MgY8OzIHBheXJvbGwgcnVuIGNoxrBhXHJcbiAgY29uc3QgeyBkYXRhOiBleGlzdGluZ1J1biB9ID0gYXdhaXQgc3VwYWJhc2VcclxuICAgIC5mcm9tKFwicGF5cm9sbF9ydW5zXCIpXHJcbiAgICAuc2VsZWN0KFwiaWQsIHN0YXR1c1wiKVxyXG4gICAgLmVxKFwibW9udGhcIiwgbW9udGgpXHJcbiAgICAuZXEoXCJ5ZWFyXCIsIHllYXIpXHJcbiAgICAuc2luZ2xlKClcclxuXHJcbiAgaWYgKGV4aXN0aW5nUnVuKSB7XHJcbiAgICBpZiAoZXhpc3RpbmdSdW4uc3RhdHVzICE9PSBcImRyYWZ0XCIpIHtcclxuICAgICAgcmV0dXJuIHsgc3VjY2VzczogZmFsc2UsIGVycm9yOiBcIkLhuqNuZyBsxrDGoW5nIHRow6FuZyBuw6B5IMSRw6Mga2jDs2EsIGtow7RuZyB0aOG7gyB04bqhbyBs4bqhaVwiIH1cclxuICAgIH1cclxuICAgIC8vIFjDs2EgcGF5cm9sbCBpdGVtcyB2w6AgYWRqdXN0bWVudCBkZXRhaWxzIGPFqVxyXG4gICAgYXdhaXQgc3VwYWJhc2UuZnJvbShcInBheXJvbGxfYWRqdXN0bWVudF9kZXRhaWxzXCIpLmRlbGV0ZSgpLmluKFxyXG4gICAgICBcInBheXJvbGxfaXRlbV9pZFwiLFxyXG4gICAgICAoYXdhaXQgc3VwYWJhc2UuZnJvbShcInBheXJvbGxfaXRlbXNcIikuc2VsZWN0KFwiaWRcIikuZXEoXCJwYXlyb2xsX3J1bl9pZFwiLCBleGlzdGluZ1J1bi5pZCkpLmRhdGE/Lm1hcCgoaTogYW55KSA9PiBpLmlkKSB8fCBbXVxyXG4gICAgKVxyXG4gICAgYXdhaXQgc3VwYWJhc2UuZnJvbShcInBheXJvbGxfaXRlbXNcIikuZGVsZXRlKCkuZXEoXCJwYXlyb2xsX3J1bl9pZFwiLCBleGlzdGluZ1J1bi5pZClcclxuICAgIGF3YWl0IHN1cGFiYXNlLmZyb20oXCJwYXlyb2xsX3J1bnNcIikuZGVsZXRlKCkuZXEoXCJpZFwiLCBleGlzdGluZ1J1bi5pZClcclxuICB9XHJcblxyXG4gIC8vIFThuqFvIHBheXJvbGwgcnVuIG3hu5tpXHJcbiAgY29uc3QgeyBkYXRhOiBydW4sIGVycm9yOiBydW5FcnJvciB9ID0gYXdhaXQgc3VwYWJhc2VcclxuICAgIC5mcm9tKFwicGF5cm9sbF9ydW5zXCIpXHJcbiAgICAuaW5zZXJ0KHtcclxuICAgICAgbW9udGgsXHJcbiAgICAgIHllYXIsXHJcbiAgICAgIHN0YXR1czogXCJkcmFmdFwiLFxyXG4gICAgICBjcmVhdGVkX2J5OiB1c2VyLmlkLFxyXG4gICAgfSlcclxuICAgIC5zZWxlY3QoKVxyXG4gICAgLnNpbmdsZSgpXHJcblxyXG4gIGlmIChydW5FcnJvcikge1xyXG4gICAgY29uc29sZS5lcnJvcihcIkVycm9yIGNyZWF0aW5nIHBheXJvbGwgcnVuOlwiLCBydW5FcnJvcilcclxuICAgIHJldHVybiB7IHN1Y2Nlc3M6IGZhbHNlLCBlcnJvcjogcnVuRXJyb3IubWVzc2FnZSB9XHJcbiAgfVxyXG5cclxuICAvLyBM4bqleSBkYW5oIHPDoWNoIG5ow6JuIHZpw6puIGFjdGl2ZSBob+G6t2Mgb25ib2FyZGluZ1xyXG4gIGNvbnN0IHsgZGF0YTogZW1wbG95ZWVzLCBlcnJvcjogZW1wRXJyb3IgfSA9IGF3YWl0IHN1cGFiYXNlXHJcbiAgICAuZnJvbShcImVtcGxveWVlc1wiKVxyXG4gICAgLnNlbGVjdChcImlkLCBmdWxsX25hbWUsIGVtcGxveWVlX2NvZGUsIHNoaWZ0X2lkXCIpXHJcbiAgICAuaW4oXCJzdGF0dXNcIiwgW1wiYWN0aXZlXCIsIFwib25ib2FyZGluZ1wiXSlcclxuXHJcbiAgaWYgKGVtcEVycm9yIHx8ICFlbXBsb3llZXMgfHwgZW1wbG95ZWVzLmxlbmd0aCA9PT0gMCkge1xyXG4gICAgcmV0dXJuIHsgc3VjY2VzczogZmFsc2UsIGVycm9yOiBcIktow7RuZyBjw7MgbmjDom4gdmnDqm4uIFZ1aSBsw7JuZyBraeG7g20gdHJhIHRy4bqhbmcgdGjDoWkgbmjDom4gdmnDqm4uXCIgfVxyXG4gIH1cclxuXHJcbiAgLy8gTOG6pXkgY8OhYyBsb+G6oWkgxJFp4buBdSBjaOG7iW5oIGFjdGl2ZVxyXG4gIGNvbnN0IHsgZGF0YTogYWRqdXN0bWVudFR5cGVzIH0gPSBhd2FpdCBzdXBhYmFzZVxyXG4gICAgLmZyb20oXCJwYXlyb2xsX2FkanVzdG1lbnRfdHlwZXNcIilcclxuICAgIC5zZWxlY3QoXCIqXCIpXHJcbiAgICAuZXEoXCJpc19hY3RpdmVcIiwgdHJ1ZSlcclxuXHJcbiAgLy8gTOG6pXkgd29yayBzaGlmdHNcclxuICBjb25zdCB7IGRhdGE6IHNoaWZ0cyB9ID0gYXdhaXQgc3VwYWJhc2UuZnJvbShcIndvcmtfc2hpZnRzXCIpLnNlbGVjdChcIipcIilcclxuICBjb25zdCBzaGlmdE1hcCA9IG5ldyBNYXAoKHNoaWZ0cyB8fCBbXSkubWFwKChzOiBhbnkpID0+IFtzLmlkLCBzXSkpXHJcblxyXG4gIC8vIFTDrW5oIG5nw6B5IMSR4bqndSB2w6AgY3Xhu5FpIHRow6FuZ1xyXG4gIGNvbnN0IHN0YXJ0RGF0ZSA9IGAke3llYXJ9LSR7U3RyaW5nKG1vbnRoKS5wYWRTdGFydCgyLCBcIjBcIil9LTAxYFxyXG4gIGNvbnN0IGVuZERhdGUgPSBuZXcgRGF0ZSh5ZWFyLCBtb250aCwgMCkudG9JU09TdHJpbmcoKS5zcGxpdChcIlRcIilbMF1cclxuXHJcbiAgbGV0IHByb2Nlc3NlZENvdW50ID0gMFxyXG4gIGZvciAoY29uc3QgZW1wIG9mIGVtcGxveWVlcykge1xyXG4gICAgLy8gTOG6pXkgbMawxqFuZyBoaeG7h3UgbOG7sWNcclxuICAgIGNvbnN0IHsgZGF0YTogc2FsYXJ5IH0gPSBhd2FpdCBzdXBhYmFzZVxyXG4gICAgICAuZnJvbShcInNhbGFyeV9zdHJ1Y3R1cmVcIilcclxuICAgICAgLnNlbGVjdChcIipcIilcclxuICAgICAgLmVxKFwiZW1wbG95ZWVfaWRcIiwgZW1wLmlkKVxyXG4gICAgICAubHRlKFwiZWZmZWN0aXZlX2RhdGVcIiwgZW5kRGF0ZSlcclxuICAgICAgLm9yZGVyKFwiZWZmZWN0aXZlX2RhdGVcIiwgeyBhc2NlbmRpbmc6IGZhbHNlIH0pXHJcbiAgICAgIC5saW1pdCgxKVxyXG4gICAgICAubWF5YmVTaW5nbGUoKVxyXG5cclxuICAgIGNvbnN0IGJhc2VTYWxhcnkgPSBzYWxhcnk/LmJhc2Vfc2FsYXJ5IHx8IDBcclxuICAgIGNvbnN0IGRhaWx5U2FsYXJ5ID0gYmFzZVNhbGFyeSAvIFNUQU5EQVJEX1dPUktJTkdfREFZU1xyXG5cclxuICAgIC8vIMSQ4bq/bSBuZ8OgeSBjw7RuZ1xyXG4gICAgY29uc3QgeyBjb3VudDogd29ya2luZ0RheXNDb3VudCB9ID0gYXdhaXQgc3VwYWJhc2VcclxuICAgICAgLmZyb20oXCJhdHRlbmRhbmNlX2xvZ3NcIilcclxuICAgICAgLnNlbGVjdChcIipcIiwgeyBjb3VudDogXCJleGFjdFwiLCBoZWFkOiB0cnVlIH0pXHJcbiAgICAgIC5lcShcImVtcGxveWVlX2lkXCIsIGVtcC5pZClcclxuICAgICAgLmd0ZShcImNoZWNrX2luXCIsIHN0YXJ0RGF0ZSlcclxuICAgICAgLmx0ZShcImNoZWNrX2luXCIsIGVuZERhdGUgKyBcIlQyMzo1OTo1OVwiKVxyXG5cclxuICAgIC8vIMSQ4bq/bSBuZ8OgeSBuZ2jhu4kgcGjDqXBcclxuICAgIGNvbnN0IHsgZGF0YTogbGVhdmVSZXF1ZXN0cyB9ID0gYXdhaXQgc3VwYWJhc2VcclxuICAgICAgLmZyb20oXCJsZWF2ZV9yZXF1ZXN0c1wiKVxyXG4gICAgICAuc2VsZWN0KFwiZnJvbV9kYXRlLCB0b19kYXRlLCBsZWF2ZV90eXBlXCIpXHJcbiAgICAgIC5lcShcImVtcGxveWVlX2lkXCIsIGVtcC5pZClcclxuICAgICAgLmVxKFwic3RhdHVzXCIsIFwiYXBwcm92ZWRcIilcclxuICAgICAgLmx0ZShcImZyb21fZGF0ZVwiLCBlbmREYXRlKVxyXG4gICAgICAuZ3RlKFwidG9fZGF0ZVwiLCBzdGFydERhdGUpXHJcblxyXG4gICAgbGV0IGxlYXZlRGF5cyA9IDBcclxuICAgIGxldCB1bnBhaWRMZWF2ZURheXMgPSAwXHJcblxyXG4gICAgaWYgKGxlYXZlUmVxdWVzdHMpIHtcclxuICAgICAgZm9yIChjb25zdCBsZWF2ZSBvZiBsZWF2ZVJlcXVlc3RzKSB7XHJcbiAgICAgICAgY29uc3QgbGVhdmVTdGFydCA9IG5ldyBEYXRlKE1hdGgubWF4KG5ldyBEYXRlKGxlYXZlLmZyb21fZGF0ZSkuZ2V0VGltZSgpLCBuZXcgRGF0ZShzdGFydERhdGUpLmdldFRpbWUoKSkpXHJcbiAgICAgICAgY29uc3QgbGVhdmVFbmQgPSBuZXcgRGF0ZShNYXRoLm1pbihuZXcgRGF0ZShsZWF2ZS50b19kYXRlKS5nZXRUaW1lKCksIG5ldyBEYXRlKGVuZERhdGUpLmdldFRpbWUoKSkpXHJcbiAgICAgICAgY29uc3QgZGF5cyA9IE1hdGguY2VpbCgobGVhdmVFbmQuZ2V0VGltZSgpIC0gbGVhdmVTdGFydC5nZXRUaW1lKCkpIC8gKDEwMDAgKiA2MCAqIDYwICogMjQpKSArIDFcclxuXHJcbiAgICAgICAgaWYgKGxlYXZlLmxlYXZlX3R5cGUgPT09IFwidW5wYWlkXCIpIHtcclxuICAgICAgICAgIHVucGFpZExlYXZlRGF5cyArPSBkYXlzXHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIGxlYXZlRGF5cyArPSBkYXlzXHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLy8gTOG6pXkgc2hpZnQgY+G7p2EgbmjDom4gdmnDqm5cclxuICAgIGNvbnN0IHNoaWZ0RGF0YSA9IGVtcC5zaGlmdF9pZCA/IHNoaWZ0TWFwLmdldChlbXAuc2hpZnRfaWQpIDogbnVsbFxyXG4gICAgY29uc3Qgc2hpZnRJbmZvOiBTaGlmdEluZm8gPSB7XHJcbiAgICAgIHN0YXJ0VGltZTogc2hpZnREYXRhPy5zdGFydF90aW1lPy5zbGljZSgwLCA1KSB8fCBcIjA4OjAwXCIsXHJcbiAgICAgIGVuZFRpbWU6IHNoaWZ0RGF0YT8uZW5kX3RpbWU/LnNsaWNlKDAsIDUpIHx8IFwiMTc6MDBcIixcclxuICAgICAgYnJlYWtTdGFydDogc2hpZnREYXRhPy5icmVha19zdGFydD8uc2xpY2UoMCwgNSkgfHwgbnVsbCxcclxuICAgICAgYnJlYWtFbmQ6IHNoaWZ0RGF0YT8uYnJlYWtfZW5kPy5zbGljZSgwLCA1KSB8fCBudWxsLFxyXG4gICAgfVxyXG5cclxuICAgIC8vIEzhuqV5IHZpIHBo4bqhbSBjaOG6pW0gY8O0bmdcclxuICAgIGNvbnN0IHZpb2xhdGlvbnMgPSBhd2FpdCBnZXRFbXBsb3llZVZpb2xhdGlvbnMoc3VwYWJhc2UsIGVtcC5pZCwgc3RhcnREYXRlLCBlbmREYXRlLCBzaGlmdEluZm8pXHJcbiAgICBcclxuICAgIC8vIFTDrW5oIG5nw6B5IGPDtG5nIHRo4buxYyB04bq/ICh0cuG7qyBuZ8OgeSBraMO0bmcgdMOtbmggY8O0bmcgdsOgIG7hu61hIG5nw6B5KVxyXG4gICAgY29uc3QgYWJzZW50RGF5cyA9IHZpb2xhdGlvbnMuZmlsdGVyKCh2KSA9PiB2LmlzQWJzZW50KS5sZW5ndGhcclxuICAgIGNvbnN0IGhhbGZEYXlzID0gdmlvbGF0aW9ucy5maWx0ZXIoKHYpID0+IHYuaXNIYWxmRGF5ICYmICF2LmlzQWJzZW50KS5sZW5ndGhcclxuICAgIGNvbnN0IGZ1bGxXb3JrRGF5cyA9IHZpb2xhdGlvbnMuZmlsdGVyKCh2KSA9PiAhdi5pc0hhbGZEYXkgJiYgIXYuaXNBYnNlbnQpLmxlbmd0aFxyXG4gICAgY29uc3QgYWN0dWFsV29ya2luZ0RheXMgPSBmdWxsV29ya0RheXMgKyAoaGFsZkRheXMgKiAwLjUpXHJcbiAgICBcclxuICAgIGNvbnN0IGxhdGVDb3VudCA9IHZpb2xhdGlvbnMuZmlsdGVyKCh2KSA9PiB2LmxhdGVNaW51dGVzID4gMCAmJiAhdi5pc0hhbGZEYXkpLmxlbmd0aFxyXG5cclxuICAgIC8vIEzhuqV5IGPDoWMgxJFp4buBdSBjaOG7iW5oIMSRxrDhu6NjIGfDoW4gY2hvIG5ow6JuIHZpw6puXHJcbiAgICBjb25zdCB7IGRhdGE6IGVtcEFkanVzdG1lbnRzIH0gPSBhd2FpdCBzdXBhYmFzZVxyXG4gICAgICAuZnJvbShcImVtcGxveWVlX2FkanVzdG1lbnRzXCIpXHJcbiAgICAgIC5zZWxlY3QoXCIqLCBhZGp1c3RtZW50X3R5cGU6cGF5cm9sbF9hZGp1c3RtZW50X3R5cGVzKCopXCIpXHJcbiAgICAgIC5lcShcImVtcGxveWVlX2lkXCIsIGVtcC5pZClcclxuICAgICAgLmx0ZShcImVmZmVjdGl2ZV9kYXRlXCIsIGVuZERhdGUpXHJcbiAgICAgIC5vcihgZW5kX2RhdGUuaXMubnVsbCxlbmRfZGF0ZS5ndGUuJHtzdGFydERhdGV9YClcclxuXHJcbiAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuICAgIC8vIFTDjU5IIFRPw4FOIFBI4bukIEPhuqRQLCBLSOG6pFUgVFLhu6osIFBI4bqgVFxyXG4gICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcbiAgICBsZXQgdG90YWxBbGxvd2FuY2VzID0gMCAvLyBQaOG7pSBj4bqlcCB04burIHBheXJvbGxfYWRqdXN0bWVudF90eXBlc1xyXG4gICAgbGV0IHRvdGFsRGVkdWN0aW9ucyA9IDBcclxuICAgIGxldCB0b3RhbFBlbmFsdGllcyA9IDBcclxuICAgIGNvbnN0IGFkanVzdG1lbnREZXRhaWxzOiBhbnlbXSA9IFtdXHJcblxyXG4gICAgLy8gWOG7rSBsw70gY8OhYyBsb+G6oWkgxJFp4buBdSBjaOG7iW5oIHThu7EgxJHhu5luZ1xyXG4gICAgaWYgKGFkanVzdG1lbnRUeXBlcykge1xyXG4gICAgICBmb3IgKGNvbnN0IGFkalR5cGUgb2YgYWRqdXN0bWVudFR5cGVzIGFzIFBheXJvbGxBZGp1c3RtZW50VHlwZVtdKSB7XHJcbiAgICAgICAgaWYgKCFhZGpUeXBlLmlzX2F1dG9fYXBwbGllZCkgY29udGludWVcclxuXHJcbiAgICAgICAgY29uc3QgcnVsZXMgPSBhZGpUeXBlLmF1dG9fcnVsZXNcclxuXHJcbiAgICAgICAgLy8gPT09PT09PT09PSBLSOG6pFUgVFLhu6ogVOG7sCDEkOG7mE5HIChRdeG7uSBjaHVuZywgQkhYSC4uLikgPT09PT09PT09PVxyXG4gICAgICAgIGlmIChhZGpUeXBlLmNhdGVnb3J5ID09PSBcImRlZHVjdGlvblwiKSB7XHJcbiAgICAgICAgICBsZXQgZmluYWxBbW91bnQgPSBhZGpUeXBlLmFtb3VudFxyXG5cclxuICAgICAgICAgIC8vIFTDrW5oIEJIWEggdGhlbyAlIGzGsMahbmcgY8ahIGLhuqNuIG7hur91IGPDsyBydWxlXHJcbiAgICAgICAgICBpZiAocnVsZXM/LmNhbGN1bGF0ZV9mcm9tID09PSBcImJhc2Vfc2FsYXJ5XCIgJiYgcnVsZXM/LnBlcmNlbnRhZ2UpIHtcclxuICAgICAgICAgICAgZmluYWxBbW91bnQgPSAoYmFzZVNhbGFyeSAqIHJ1bGVzLnBlcmNlbnRhZ2UpIC8gMTAwXHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgdG90YWxEZWR1Y3Rpb25zICs9IGZpbmFsQW1vdW50XHJcbiAgICAgICAgICBhZGp1c3RtZW50RGV0YWlscy5wdXNoKHtcclxuICAgICAgICAgICAgYWRqdXN0bWVudF90eXBlX2lkOiBhZGpUeXBlLmlkLFxyXG4gICAgICAgICAgICBjYXRlZ29yeTogXCJkZWR1Y3Rpb25cIixcclxuICAgICAgICAgICAgYmFzZV9hbW91bnQ6IGFkalR5cGUuYW1vdW50LFxyXG4gICAgICAgICAgICBhZGp1c3RlZF9hbW91bnQ6IDAsXHJcbiAgICAgICAgICAgIGZpbmFsX2Ftb3VudDogZmluYWxBbW91bnQsXHJcbiAgICAgICAgICAgIHJlYXNvbjogYWRqVHlwZS5uYW1lLFxyXG4gICAgICAgICAgICBvY2N1cnJlbmNlX2NvdW50OiAxLFxyXG4gICAgICAgICAgfSlcclxuICAgICAgICAgIGNvbnRpbnVlXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyA9PT09PT09PT09IFBI4bukIEPhuqRQIFThu7AgxJDhu5hORyA9PT09PT09PT09XHJcbiAgICAgICAgaWYgKGFkalR5cGUuY2F0ZWdvcnkgPT09IFwiYWxsb3dhbmNlXCIpIHtcclxuICAgICAgICAgIC8vIFBo4bulIGPhuqVwIHRoZW8gbmfDoHkgY8O0bmcgKMSDbiB0csawYSkgLSBjaOG7iSB0w61uaCBuZ8OgeSDEkWkgbMOgbSDEkeG7pywga2jDtG5nIHTDrW5oIG7hu61hIG5nw6B5XHJcbiAgICAgICAgICBpZiAoYWRqVHlwZS5jYWxjdWxhdGlvbl90eXBlID09PSBcImRhaWx5XCIpIHtcclxuICAgICAgICAgICAgbGV0IGVsaWdpYmxlRGF5cyA9IGZ1bGxXb3JrRGF5cyAvLyBDaOG7iSB0w61uaCBuZ8OgeSDEkWkgbMOgbSDEkeG7p1xyXG5cclxuICAgICAgICAgICAgaWYgKHJ1bGVzKSB7XHJcbiAgICAgICAgICAgICAgLy8gVHLhu6sgbmfDoHkgbmdo4buJXHJcbiAgICAgICAgICAgICAgaWYgKHJ1bGVzLmRlZHVjdF9vbl9hYnNlbnQpIHtcclxuICAgICAgICAgICAgICAgIGVsaWdpYmxlRGF5cyAtPSB1bnBhaWRMZWF2ZURheXNcclxuICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgIC8vIFRy4burIG7hur91IMSRaSBtdeG7mW4gcXXDoSBz4buRIGzhuqduIGNobyBwaMOpcFxyXG4gICAgICAgICAgICAgIGlmIChydWxlcy5kZWR1Y3Rfb25fbGF0ZSAmJiBydWxlcy5sYXRlX2dyYWNlX2NvdW50ICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGV4Y2Vzc0xhdGVEYXlzID0gTWF0aC5tYXgoMCwgbGF0ZUNvdW50IC0gcnVsZXMubGF0ZV9ncmFjZV9jb3VudClcclxuICAgICAgICAgICAgICAgIGVsaWdpYmxlRGF5cyAtPSBleGNlc3NMYXRlRGF5c1xyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgZWxpZ2libGVEYXlzID0gTWF0aC5tYXgoMCwgZWxpZ2libGVEYXlzKVxyXG4gICAgICAgICAgICBjb25zdCBhbW91bnQgPSBlbGlnaWJsZURheXMgKiBhZGpUeXBlLmFtb3VudFxyXG5cclxuICAgICAgICAgICAgaWYgKGFtb3VudCA+IDApIHtcclxuICAgICAgICAgICAgICB0b3RhbEFsbG93YW5jZXMgKz0gYW1vdW50XHJcbiAgICAgICAgICAgICAgYWRqdXN0bWVudERldGFpbHMucHVzaCh7XHJcbiAgICAgICAgICAgICAgICBhZGp1c3RtZW50X3R5cGVfaWQ6IGFkalR5cGUuaWQsXHJcbiAgICAgICAgICAgICAgICBjYXRlZ29yeTogXCJhbGxvd2FuY2VcIixcclxuICAgICAgICAgICAgICAgIGJhc2VfYW1vdW50OiBmdWxsV29ya0RheXMgKiBhZGpUeXBlLmFtb3VudCxcclxuICAgICAgICAgICAgICAgIGFkanVzdGVkX2Ftb3VudDogKGZ1bGxXb3JrRGF5cyAtIGVsaWdpYmxlRGF5cykgKiBhZGpUeXBlLmFtb3VudCxcclxuICAgICAgICAgICAgICAgIGZpbmFsX2Ftb3VudDogYW1vdW50LFxyXG4gICAgICAgICAgICAgICAgcmVhc29uOiBgJHtlbGlnaWJsZURheXN9IG5nw6B5IHggJHthZGpUeXBlLmFtb3VudC50b0xvY2FsZVN0cmluZygpfcSRYCxcclxuICAgICAgICAgICAgICAgIG9jY3VycmVuY2VfY291bnQ6IGVsaWdpYmxlRGF5cyxcclxuICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgLy8gUGjhu6UgY+G6pXAgY+G7kSDEkeG7i25oIChjaHV5w6puIGPhuqduKVxyXG4gICAgICAgICAgaWYgKGFkalR5cGUuY2FsY3VsYXRpb25fdHlwZSA9PT0gXCJmaXhlZFwiKSB7XHJcbiAgICAgICAgICAgIGlmIChydWxlcz8uZnVsbF9kZWR1Y3RfdGhyZXNob2xkICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgICAvLyBDw7MgxJFp4buBdSBraeG7h24gLSBt4bqldCB0b8OgbiBi4buZIG7hur91IHZpIHBo4bqhbSAoxJFpIG114buZbiBob+G6t2Mgbmdo4buJIGtow7RuZyBwaMOpcCBob+G6t2Mga2jDtG5nIHTDrW5oIGPDtG5nKVxyXG4gICAgICAgICAgICAgIGNvbnN0IHNob3VsZERlZHVjdCA9IGxhdGVDb3VudCA+IHJ1bGVzLmZ1bGxfZGVkdWN0X3RocmVzaG9sZCB8fCB1bnBhaWRMZWF2ZURheXMgPiAwIHx8IGFic2VudERheXMgPiAwXHJcbiAgICAgICAgICAgICAgaWYgKCFzaG91bGREZWR1Y3QpIHtcclxuICAgICAgICAgICAgICAgIHRvdGFsQWxsb3dhbmNlcyArPSBhZGpUeXBlLmFtb3VudFxyXG4gICAgICAgICAgICAgICAgYWRqdXN0bWVudERldGFpbHMucHVzaCh7XHJcbiAgICAgICAgICAgICAgICAgIGFkanVzdG1lbnRfdHlwZV9pZDogYWRqVHlwZS5pZCxcclxuICAgICAgICAgICAgICAgICAgY2F0ZWdvcnk6IFwiYWxsb3dhbmNlXCIsXHJcbiAgICAgICAgICAgICAgICAgIGJhc2VfYW1vdW50OiBhZGpUeXBlLmFtb3VudCxcclxuICAgICAgICAgICAgICAgICAgYWRqdXN0ZWRfYW1vdW50OiAwLFxyXG4gICAgICAgICAgICAgICAgICBmaW5hbF9hbW91bnQ6IGFkalR5cGUuYW1vdW50LFxyXG4gICAgICAgICAgICAgICAgICByZWFzb246IFwixJDhu6cgxJFp4buBdSBraeG7h24gY2h1ecOqbiBj4bqnblwiLFxyXG4gICAgICAgICAgICAgICAgICBvY2N1cnJlbmNlX2NvdW50OiAxLFxyXG4gICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgYWRqdXN0bWVudERldGFpbHMucHVzaCh7XHJcbiAgICAgICAgICAgICAgICAgIGFkanVzdG1lbnRfdHlwZV9pZDogYWRqVHlwZS5pZCxcclxuICAgICAgICAgICAgICAgICAgY2F0ZWdvcnk6IFwiYWxsb3dhbmNlXCIsXHJcbiAgICAgICAgICAgICAgICAgIGJhc2VfYW1vdW50OiBhZGpUeXBlLmFtb3VudCxcclxuICAgICAgICAgICAgICAgICAgYWRqdXN0ZWRfYW1vdW50OiBhZGpUeXBlLmFtb3VudCxcclxuICAgICAgICAgICAgICAgICAgZmluYWxfYW1vdW50OiAwLFxyXG4gICAgICAgICAgICAgICAgICByZWFzb246IGBN4bqldCBwaOG7pSBj4bqlcDogxJFpIG114buZbiAke2xhdGVDb3VudH0gbOG6p24sIG5naOG7iSBraMO0bmcgcGjDqXAgJHt1bnBhaWRMZWF2ZURheXN9IG5nw6B5YCxcclxuICAgICAgICAgICAgICAgICAgb2NjdXJyZW5jZV9jb3VudDogMCxcclxuICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgIC8vIEtow7RuZyBjw7MgxJFp4buBdSBraeG7h24gLSBj4buZbmcgdGjhurNuZ1xyXG4gICAgICAgICAgICAgIHRvdGFsQWxsb3dhbmNlcyArPSBhZGpUeXBlLmFtb3VudFxyXG4gICAgICAgICAgICAgIGFkanVzdG1lbnREZXRhaWxzLnB1c2goe1xyXG4gICAgICAgICAgICAgICAgYWRqdXN0bWVudF90eXBlX2lkOiBhZGpUeXBlLmlkLFxyXG4gICAgICAgICAgICAgICAgY2F0ZWdvcnk6IFwiYWxsb3dhbmNlXCIsXHJcbiAgICAgICAgICAgICAgICBiYXNlX2Ftb3VudDogYWRqVHlwZS5hbW91bnQsXHJcbiAgICAgICAgICAgICAgICBhZGp1c3RlZF9hbW91bnQ6IDAsXHJcbiAgICAgICAgICAgICAgICBmaW5hbF9hbW91bnQ6IGFkalR5cGUuYW1vdW50LFxyXG4gICAgICAgICAgICAgICAgcmVhc29uOiBhZGpUeXBlLm5hbWUsXHJcbiAgICAgICAgICAgICAgICBvY2N1cnJlbmNlX2NvdW50OiAxLFxyXG4gICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH1cclxuICAgICAgICAgIGNvbnRpbnVlXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyA9PT09PT09PT09IFBI4bqgVCBU4buwIMSQ4buYTkcgPT09PT09PT09PVxyXG4gICAgICAgIGlmIChhZGpUeXBlLmNhdGVnb3J5ID09PSBcInBlbmFsdHlcIiAmJiBydWxlcz8udHJpZ2dlciA9PT0gXCJsYXRlXCIpIHtcclxuICAgICAgICAgIGNvbnN0IHRocmVzaG9sZE1pbnV0ZXMgPSBydWxlcy5sYXRlX3RocmVzaG9sZF9taW51dGVzIHx8IDMwXHJcbiAgICAgICAgICBjb25zdCBleGVtcHRXaXRoUmVxdWVzdCA9IHJ1bGVzLmV4ZW1wdF93aXRoX3JlcXVlc3QgIT09IGZhbHNlXHJcblxyXG4gICAgICAgICAgY29uc3QgcGVuYWx0eURheXMgPSB2aW9sYXRpb25zLmZpbHRlcigodikgPT4ge1xyXG4gICAgICAgICAgICBpZiAodi5sYXRlTWludXRlcyA8PSB0aHJlc2hvbGRNaW51dGVzKSByZXR1cm4gZmFsc2VcclxuICAgICAgICAgICAgaWYgKGV4ZW1wdFdpdGhSZXF1ZXN0ICYmIHYuaGFzQXBwcm92ZWRSZXF1ZXN0KSByZXR1cm4gZmFsc2VcclxuICAgICAgICAgICAgcmV0dXJuIHRydWVcclxuICAgICAgICAgIH0pXHJcblxyXG4gICAgICAgICAgZm9yIChjb25zdCB2IG9mIHBlbmFsdHlEYXlzKSB7XHJcbiAgICAgICAgICAgIGxldCBwZW5hbHR5QW1vdW50ID0gMFxyXG4gICAgICAgICAgICBpZiAocnVsZXMucGVuYWx0eV90eXBlID09PSBcImhhbGZfZGF5X3NhbGFyeVwiKSB7XHJcbiAgICAgICAgICAgICAgcGVuYWx0eUFtb3VudCA9IGRhaWx5U2FsYXJ5IC8gMlxyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKHJ1bGVzLnBlbmFsdHlfdHlwZSA9PT0gXCJmdWxsX2RheV9zYWxhcnlcIikge1xyXG4gICAgICAgICAgICAgIHBlbmFsdHlBbW91bnQgPSBkYWlseVNhbGFyeVxyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKHJ1bGVzLnBlbmFsdHlfdHlwZSA9PT0gXCJmaXhlZF9hbW91bnRcIikge1xyXG4gICAgICAgICAgICAgIHBlbmFsdHlBbW91bnQgPSBhZGpUeXBlLmFtb3VudFxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB0b3RhbFBlbmFsdGllcyArPSBwZW5hbHR5QW1vdW50XHJcbiAgICAgICAgICAgIGFkanVzdG1lbnREZXRhaWxzLnB1c2goe1xyXG4gICAgICAgICAgICAgIGFkanVzdG1lbnRfdHlwZV9pZDogYWRqVHlwZS5pZCxcclxuICAgICAgICAgICAgICBjYXRlZ29yeTogXCJwZW5hbHR5XCIsXHJcbiAgICAgICAgICAgICAgYmFzZV9hbW91bnQ6IHBlbmFsdHlBbW91bnQsXHJcbiAgICAgICAgICAgICAgYWRqdXN0ZWRfYW1vdW50OiAwLFxyXG4gICAgICAgICAgICAgIGZpbmFsX2Ftb3VudDogcGVuYWx0eUFtb3VudCxcclxuICAgICAgICAgICAgICByZWFzb246IGDEkGkgbXXhu5luICR7di5sYXRlTWludXRlc30gcGjDunQgbmfDoHkgJHt2LmRhdGV9YCxcclxuICAgICAgICAgICAgICBvY2N1cnJlbmNlX2NvdW50OiAxLFxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8vIFjhu60gbMO9IGPDoWMgxJFp4buBdSBjaOG7iW5oIMSRxrDhu6NjIGfDoW4gdGjhu6cgY8O0bmcgY2hvIG5ow6JuIHZpw6puXHJcbiAgICBpZiAoZW1wQWRqdXN0bWVudHMpIHtcclxuICAgICAgZm9yIChjb25zdCBlbXBBZGogb2YgZW1wQWRqdXN0bWVudHMpIHtcclxuICAgICAgICBjb25zdCBhZGpUeXBlID0gZW1wQWRqLmFkanVzdG1lbnRfdHlwZSBhcyBQYXlyb2xsQWRqdXN0bWVudFR5cGVcclxuICAgICAgICBpZiAoIWFkalR5cGUgfHwgYWRqVHlwZS5pc19hdXRvX2FwcGxpZWQpIGNvbnRpbnVlIC8vIELhu48gcXVhIGF1dG8tYXBwbGllZCAoxJHDoyB44butIGzDvSDhu58gdHLDqm4pXHJcblxyXG4gICAgICAgIGNvbnN0IGFtb3VudCA9IGVtcEFkai5jdXN0b21fYW1vdW50IHx8IGFkalR5cGUuYW1vdW50XHJcblxyXG4gICAgICAgIGlmIChhZGpUeXBlLmNhdGVnb3J5ID09PSBcImFsbG93YW5jZVwiKSB7XHJcbiAgICAgICAgICB0b3RhbEFsbG93YW5jZXMgKz0gYW1vdW50XHJcbiAgICAgICAgfSBlbHNlIGlmIChhZGpUeXBlLmNhdGVnb3J5ID09PSBcImRlZHVjdGlvblwiKSB7XHJcbiAgICAgICAgICAvLyBUw61uaCBCSFhIIHRoZW8gJSBsxrDGoW5nIGPGoSBi4bqjblxyXG4gICAgICAgICAgbGV0IGZpbmFsQW1vdW50ID0gYW1vdW50XHJcbiAgICAgICAgICBpZiAoYWRqVHlwZS5hdXRvX3J1bGVzPy5jYWxjdWxhdGVfZnJvbSA9PT0gXCJiYXNlX3NhbGFyeVwiICYmIGFkalR5cGUuYXV0b19ydWxlcz8ucGVyY2VudGFnZSkge1xyXG4gICAgICAgICAgICBmaW5hbEFtb3VudCA9IChiYXNlU2FsYXJ5ICogYWRqVHlwZS5hdXRvX3J1bGVzLnBlcmNlbnRhZ2UpIC8gMTAwXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICB0b3RhbERlZHVjdGlvbnMgKz0gZmluYWxBbW91bnRcclxuICAgICAgICAgIGFkanVzdG1lbnREZXRhaWxzLnB1c2goe1xyXG4gICAgICAgICAgICBhZGp1c3RtZW50X3R5cGVfaWQ6IGFkalR5cGUuaWQsXHJcbiAgICAgICAgICAgIGNhdGVnb3J5OiBcImRlZHVjdGlvblwiLFxyXG4gICAgICAgICAgICBiYXNlX2Ftb3VudDogYW1vdW50LFxyXG4gICAgICAgICAgICBhZGp1c3RlZF9hbW91bnQ6IDAsXHJcbiAgICAgICAgICAgIGZpbmFsX2Ftb3VudDogZmluYWxBbW91bnQsXHJcbiAgICAgICAgICAgIHJlYXNvbjogYWRqVHlwZS5uYW1lLFxyXG4gICAgICAgICAgICBvY2N1cnJlbmNlX2NvdW50OiAxLFxyXG4gICAgICAgICAgfSlcclxuICAgICAgICB9IGVsc2UgaWYgKGFkalR5cGUuY2F0ZWdvcnkgPT09IFwicGVuYWx0eVwiKSB7XHJcbiAgICAgICAgICB0b3RhbFBlbmFsdGllcyArPSBhbW91bnRcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuICAgIC8vIFTDjU5IIEzGr8agTkcgQ1Xhu5BJIEPDmU5HXHJcbiAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuICAgIC8vIGFjdHVhbFdvcmtpbmdEYXlzIMSRw6MgdMOtbmg6IG5nw6B5IMSR4bunICsgMC41ICogbuG7rWEgbmfDoHksIHRy4burIG5nw6B5IGtow7RuZyB0w61uaCBjw7RuZ1xyXG4gICAgY29uc3QgZ3Jvc3NTYWxhcnkgPSBkYWlseVNhbGFyeSAqIGFjdHVhbFdvcmtpbmdEYXlzICsgZGFpbHlTYWxhcnkgKiBsZWF2ZURheXMgKyB0b3RhbEFsbG93YW5jZXNcclxuICAgIGNvbnN0IHRvdGFsRGVkdWN0aW9uID0gZGFpbHlTYWxhcnkgKiB1bnBhaWRMZWF2ZURheXMgKyB0b3RhbERlZHVjdGlvbnMgKyB0b3RhbFBlbmFsdGllc1xyXG4gICAgY29uc3QgbmV0U2FsYXJ5ID0gZ3Jvc3NTYWxhcnkgLSB0b3RhbERlZHVjdGlvblxyXG5cclxuICAgIC8vIFThuqFvIGdoaSBjaMO6IGNoaSB0aeG6v3RcclxuICAgIGxldCBub3RlSXRlbXM6IHN0cmluZ1tdID0gW11cclxuICAgIGlmIChsYXRlQ291bnQgPiAwKSBub3RlSXRlbXMucHVzaChgxJBpIG114buZbjogJHtsYXRlQ291bnR9IGzhuqduYClcclxuICAgIGlmIChoYWxmRGF5cyA+IDApIG5vdGVJdGVtcy5wdXNoKGBO4butYSBuZ8OgeTogJHtoYWxmRGF5c31gKVxyXG4gICAgaWYgKGFic2VudERheXMgPiAwKSBub3RlSXRlbXMucHVzaChgS2jDtG5nIHTDrW5oIGPDtG5nOiAke2Fic2VudERheXN9YClcclxuICAgIGNvbnN0IHBlbmFsdHlDb3VudCA9IGFkanVzdG1lbnREZXRhaWxzLmZpbHRlcihkID0+IGQuY2F0ZWdvcnkgPT09ICdwZW5hbHR5JykubGVuZ3RoXHJcbiAgICBpZiAocGVuYWx0eUNvdW50ID4gMCkgbm90ZUl0ZW1zLnB1c2goYFBo4bqhdDogJHtwZW5hbHR5Q291bnR9IGzhuqduYClcclxuXHJcbiAgICAvLyBJbnNlcnQgcGF5cm9sbCBpdGVtXHJcbiAgICBjb25zdCB7IGRhdGE6IHBheXJvbGxJdGVtLCBlcnJvcjogaW5zZXJ0RXJyb3IgfSA9IGF3YWl0IHN1cGFiYXNlXHJcbiAgICAgIC5mcm9tKFwicGF5cm9sbF9pdGVtc1wiKVxyXG4gICAgICAuaW5zZXJ0KHtcclxuICAgICAgICBwYXlyb2xsX3J1bl9pZDogcnVuLmlkLFxyXG4gICAgICAgIGVtcGxveWVlX2lkOiBlbXAuaWQsXHJcbiAgICAgICAgd29ya2luZ19kYXlzOiBhY3R1YWxXb3JraW5nRGF5cyxcclxuICAgICAgICBsZWF2ZV9kYXlzOiBsZWF2ZURheXMsXHJcbiAgICAgICAgdW5wYWlkX2xlYXZlX2RheXM6IHVucGFpZExlYXZlRGF5cyArIGFic2VudERheXMsIC8vIEPhu5luZyB0aMOqbSBuZ8OgeSBraMO0bmcgdMOtbmggY8O0bmdcclxuICAgICAgICBiYXNlX3NhbGFyeTogYmFzZVNhbGFyeSxcclxuICAgICAgICBhbGxvd2FuY2VzOiB0b3RhbEFsbG93YW5jZXMsXHJcbiAgICAgICAgdG90YWxfaW5jb21lOiBncm9zc1NhbGFyeSxcclxuICAgICAgICB0b3RhbF9kZWR1Y3Rpb246IHRvdGFsRGVkdWN0aW9uLFxyXG4gICAgICAgIG5ldF9zYWxhcnk6IG5ldFNhbGFyeSxcclxuICAgICAgICBub3RlOiBub3RlSXRlbXMuam9pbihcIiwgXCIpIHx8IG51bGwsXHJcbiAgICAgIH0pXHJcbiAgICAgIC5zZWxlY3QoKVxyXG4gICAgICAuc2luZ2xlKClcclxuXHJcbiAgICBpZiAoaW5zZXJ0RXJyb3IpIHtcclxuICAgICAgY29uc29sZS5lcnJvcihgRXJyb3IgaW5zZXJ0aW5nIHBheXJvbGwgaXRlbSBmb3IgJHtlbXAuZnVsbF9uYW1lfTpgLCBpbnNlcnRFcnJvcilcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHByb2Nlc3NlZENvdW50KytcclxuXHJcbiAgICAgIC8vIEluc2VydCBhZGp1c3RtZW50IGRldGFpbHNcclxuICAgICAgaWYgKHBheXJvbGxJdGVtICYmIGFkanVzdG1lbnREZXRhaWxzLmxlbmd0aCA+IDApIHtcclxuICAgICAgICBjb25zdCBkZXRhaWxzV2l0aEl0ZW1JZCA9IGFkanVzdG1lbnREZXRhaWxzLm1hcCgoZCkgPT4gKHtcclxuICAgICAgICAgIC4uLmQsXHJcbiAgICAgICAgICBwYXlyb2xsX2l0ZW1faWQ6IHBheXJvbGxJdGVtLmlkLFxyXG4gICAgICAgIH0pKVxyXG4gICAgICAgIGF3YWl0IHN1cGFiYXNlLmZyb20oXCJwYXlyb2xsX2FkanVzdG1lbnRfZGV0YWlsc1wiKS5pbnNlcnQoZGV0YWlsc1dpdGhJdGVtSWQpXHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcblxyXG4gIHJldmFsaWRhdGVQYXRoKFwiL2Rhc2hib2FyZC9wYXlyb2xsXCIpXHJcbiAgcmV0dXJuIHsgc3VjY2VzczogdHJ1ZSwgZGF0YTogcnVuLCBtZXNzYWdlOiBgxJDDoyB04bqhbyBi4bqjbmcgbMawxqFuZyBjaG8gJHtwcm9jZXNzZWRDb3VudH0gbmjDom4gdmnDqm5gIH1cclxufVxyXG5cclxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcbi8vIEhSIEFDVElPTlMgLSBMT0NLL1VOTE9DSyBQQVlST0xMXHJcbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGxvY2tQYXlyb2xsKGlkOiBzdHJpbmcpIHtcclxuICBjb25zdCBzdXBhYmFzZSA9IGF3YWl0IGNyZWF0ZUNsaWVudCgpXHJcblxyXG4gIGNvbnN0IHsgZXJyb3IgfSA9IGF3YWl0IHN1cGFiYXNlXHJcbiAgICAuZnJvbShcInBheXJvbGxfcnVuc1wiKVxyXG4gICAgLnVwZGF0ZSh7IHN0YXR1czogXCJsb2NrZWRcIiB9KVxyXG4gICAgLmVxKFwiaWRcIiwgaWQpXHJcbiAgICAuZXEoXCJzdGF0dXNcIiwgXCJkcmFmdFwiKVxyXG5cclxuICBpZiAoZXJyb3IpIHtcclxuICAgIGNvbnNvbGUuZXJyb3IoXCJFcnJvciBsb2NraW5nIHBheXJvbGw6XCIsIGVycm9yKVxyXG4gICAgcmV0dXJuIHsgc3VjY2VzczogZmFsc2UsIGVycm9yOiBlcnJvci5tZXNzYWdlIH1cclxuICB9XHJcblxyXG4gIHJldmFsaWRhdGVQYXRoKFwiL2Rhc2hib2FyZC9wYXlyb2xsXCIpXHJcbiAgcmV0dXJuIHsgc3VjY2VzczogdHJ1ZSB9XHJcbn1cclxuXHJcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBtYXJrUGF5cm9sbFBhaWQoaWQ6IHN0cmluZykge1xyXG4gIGNvbnN0IHN1cGFiYXNlID0gYXdhaXQgY3JlYXRlQ2xpZW50KClcclxuXHJcbiAgY29uc3QgeyBlcnJvciB9ID0gYXdhaXQgc3VwYWJhc2VcclxuICAgIC5mcm9tKFwicGF5cm9sbF9ydW5zXCIpXHJcbiAgICAudXBkYXRlKHsgc3RhdHVzOiBcInBhaWRcIiB9KVxyXG4gICAgLmVxKFwiaWRcIiwgaWQpXHJcbiAgICAuZXEoXCJzdGF0dXNcIiwgXCJsb2NrZWRcIilcclxuXHJcbiAgaWYgKGVycm9yKSB7XHJcbiAgICBjb25zb2xlLmVycm9yKFwiRXJyb3IgbWFya2luZyBwYXlyb2xsIGFzIHBhaWQ6XCIsIGVycm9yKVxyXG4gICAgcmV0dXJuIHsgc3VjY2VzczogZmFsc2UsIGVycm9yOiBlcnJvci5tZXNzYWdlIH1cclxuICB9XHJcblxyXG4gIHJldmFsaWRhdGVQYXRoKFwiL2Rhc2hib2FyZC9wYXlyb2xsXCIpXHJcbiAgcmV0dXJuIHsgc3VjY2VzczogdHJ1ZSB9XHJcbn1cclxuXHJcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBkZWxldGVQYXlyb2xsUnVuKGlkOiBzdHJpbmcpIHtcclxuICBjb25zdCBzdXBhYmFzZSA9IGF3YWl0IGNyZWF0ZUNsaWVudCgpXHJcblxyXG4gIC8vIENo4buJIHjDs2EgxJHGsOG7o2MgZHJhZnRcclxuICBjb25zdCB7IGVycm9yIH0gPSBhd2FpdCBzdXBhYmFzZVxyXG4gICAgLmZyb20oXCJwYXlyb2xsX3J1bnNcIilcclxuICAgIC5kZWxldGUoKVxyXG4gICAgLmVxKFwiaWRcIiwgaWQpXHJcbiAgICAuZXEoXCJzdGF0dXNcIiwgXCJkcmFmdFwiKVxyXG5cclxuICBpZiAoZXJyb3IpIHtcclxuICAgIGNvbnNvbGUuZXJyb3IoXCJFcnJvciBkZWxldGluZyBwYXlyb2xsIHJ1bjpcIiwgZXJyb3IpXHJcbiAgICByZXR1cm4geyBzdWNjZXNzOiBmYWxzZSwgZXJyb3I6IGVycm9yLm1lc3NhZ2UgfVxyXG4gIH1cclxuXHJcbiAgcmV2YWxpZGF0ZVBhdGgoXCIvZGFzaGJvYXJkL3BheXJvbGxcIilcclxuICByZXR1cm4geyBzdWNjZXNzOiB0cnVlIH1cclxufVxyXG5cclxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcbi8vIEhSIEFDVElPTlMgLSBTQUxBUlkgU1RSVUNUVVJFXHJcbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGxpc3RTYWxhcnlTdHJ1Y3R1cmUoXHJcbiAgZW1wbG95ZWVfaWQ6IHN0cmluZ1xyXG4pOiBQcm9taXNlPFNhbGFyeVN0cnVjdHVyZVtdPiB7XHJcbiAgY29uc3Qgc3VwYWJhc2UgPSBhd2FpdCBjcmVhdGVDbGllbnQoKVxyXG5cclxuICBjb25zdCB7IGRhdGEsIGVycm9yIH0gPSBhd2FpdCBzdXBhYmFzZVxyXG4gICAgLmZyb20oXCJzYWxhcnlfc3RydWN0dXJlXCIpXHJcbiAgICAuc2VsZWN0KFwiKlwiKVxyXG4gICAgLmVxKFwiZW1wbG95ZWVfaWRcIiwgZW1wbG95ZWVfaWQpXHJcbiAgICAub3JkZXIoXCJlZmZlY3RpdmVfZGF0ZVwiLCB7IGFzY2VuZGluZzogZmFsc2UgfSlcclxuXHJcbiAgaWYgKGVycm9yKSB7XHJcbiAgICBjb25zb2xlLmVycm9yKFwiRXJyb3IgbGlzdGluZyBzYWxhcnkgc3RydWN0dXJlOlwiLCBlcnJvcilcclxuICAgIHJldHVybiBbXVxyXG4gIH1cclxuXHJcbiAgcmV0dXJuIGRhdGEgfHwgW11cclxufVxyXG5cclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGNyZWF0ZVNhbGFyeVN0cnVjdHVyZShpbnB1dDoge1xyXG4gIGVtcGxveWVlX2lkOiBzdHJpbmdcclxuICBiYXNlX3NhbGFyeTogbnVtYmVyXHJcbiAgYWxsb3dhbmNlPzogbnVtYmVyXHJcbiAgZWZmZWN0aXZlX2RhdGU6IHN0cmluZ1xyXG4gIG5vdGU/OiBzdHJpbmdcclxufSkge1xyXG4gIGNvbnN0IHN1cGFiYXNlID0gYXdhaXQgY3JlYXRlQ2xpZW50KClcclxuXHJcbiAgY29uc3QgeyBlcnJvciB9ID0gYXdhaXQgc3VwYWJhc2UuZnJvbShcInNhbGFyeV9zdHJ1Y3R1cmVcIikuaW5zZXJ0KHtcclxuICAgIGVtcGxveWVlX2lkOiBpbnB1dC5lbXBsb3llZV9pZCxcclxuICAgIGJhc2Vfc2FsYXJ5OiBpbnB1dC5iYXNlX3NhbGFyeSxcclxuICAgIGFsbG93YW5jZTogaW5wdXQuYWxsb3dhbmNlIHx8IDAsXHJcbiAgICBlZmZlY3RpdmVfZGF0ZTogaW5wdXQuZWZmZWN0aXZlX2RhdGUsXHJcbiAgICBub3RlOiBpbnB1dC5ub3RlLFxyXG4gIH0pXHJcblxyXG4gIGlmIChlcnJvcikge1xyXG4gICAgY29uc29sZS5lcnJvcihcIkVycm9yIGNyZWF0aW5nIHNhbGFyeSBzdHJ1Y3R1cmU6XCIsIGVycm9yKVxyXG4gICAgcmV0dXJuIHsgc3VjY2VzczogZmFsc2UsIGVycm9yOiBlcnJvci5tZXNzYWdlIH1cclxuICB9XHJcblxyXG4gIHJldmFsaWRhdGVQYXRoKFwiL2Rhc2hib2FyZC9lbXBsb3llZXNcIilcclxuICByZXR1cm4geyBzdWNjZXNzOiB0cnVlIH1cclxufVxyXG5cclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGdldE15U2FsYXJ5KCk6IFByb21pc2U8U2FsYXJ5U3RydWN0dXJlIHwgbnVsbD4ge1xyXG4gIGNvbnN0IHN1cGFiYXNlID0gYXdhaXQgY3JlYXRlQ2xpZW50KClcclxuXHJcbiAgY29uc3Qge1xyXG4gICAgZGF0YTogeyB1c2VyIH0sXHJcbiAgfSA9IGF3YWl0IHN1cGFiYXNlLmF1dGguZ2V0VXNlcigpXHJcbiAgaWYgKCF1c2VyKSByZXR1cm4gbnVsbFxyXG5cclxuICBjb25zdCB7IGRhdGE6IGVtcGxveWVlIH0gPSBhd2FpdCBzdXBhYmFzZVxyXG4gICAgLmZyb20oXCJlbXBsb3llZXNcIilcclxuICAgIC5zZWxlY3QoXCJpZFwiKVxyXG4gICAgLmVxKFwidXNlcl9pZFwiLCB1c2VyLmlkKVxyXG4gICAgLnNpbmdsZSgpXHJcblxyXG4gIGlmICghZW1wbG95ZWUpIHJldHVybiBudWxsXHJcblxyXG4gIGNvbnN0IHsgZGF0YSB9ID0gYXdhaXQgc3VwYWJhc2VcclxuICAgIC5mcm9tKFwic2FsYXJ5X3N0cnVjdHVyZVwiKVxyXG4gICAgLnNlbGVjdChcIipcIilcclxuICAgIC5lcShcImVtcGxveWVlX2lkXCIsIGVtcGxveWVlLmlkKVxyXG4gICAgLm9yZGVyKFwiZWZmZWN0aXZlX2RhdGVcIiwgeyBhc2NlbmRpbmc6IGZhbHNlIH0pXHJcbiAgICAubGltaXQoMSlcclxuICAgIC5zaW5nbGUoKVxyXG5cclxuICByZXR1cm4gZGF0YSB8fCBudWxsXHJcbn1cclxuXHJcbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG4vLyBQQVlST0xMIEFESlVTVE1FTlQgREVUQUlMU1xyXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHJcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBnZXRQYXlyb2xsQWRqdXN0bWVudERldGFpbHMocGF5cm9sbF9pdGVtX2lkOiBzdHJpbmcpIHtcclxuICBjb25zdCBzdXBhYmFzZSA9IGF3YWl0IGNyZWF0ZUNsaWVudCgpXHJcblxyXG4gIGNvbnN0IHsgZGF0YSwgZXJyb3IgfSA9IGF3YWl0IHN1cGFiYXNlXHJcbiAgICAuZnJvbShcInBheXJvbGxfYWRqdXN0bWVudF9kZXRhaWxzXCIpXHJcbiAgICAuc2VsZWN0KGBcclxuICAgICAgKixcclxuICAgICAgYWRqdXN0bWVudF90eXBlOnBheXJvbGxfYWRqdXN0bWVudF90eXBlcyhpZCwgbmFtZSwgY29kZSwgY2F0ZWdvcnkpXHJcbiAgICBgKVxyXG4gICAgLmVxKFwicGF5cm9sbF9pdGVtX2lkXCIsIHBheXJvbGxfaXRlbV9pZClcclxuICAgIC5vcmRlcihcImNhdGVnb3J5XCIpXHJcblxyXG4gIGlmIChlcnJvcikge1xyXG4gICAgY29uc29sZS5lcnJvcihcIkVycm9yIGZldGNoaW5nIGFkanVzdG1lbnQgZGV0YWlsczpcIiwgZXJyb3IpXHJcbiAgICByZXR1cm4gW11cclxuICB9XHJcblxyXG4gIHJldHVybiBkYXRhIHx8IFtdXHJcbn1cclxuIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJ1U0E2bkJzQiJ9
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/ui/dialog.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Dialog",
    ()=>Dialog,
    "DialogClose",
    ()=>DialogClose,
    "DialogContent",
    ()=>DialogContent,
    "DialogDescription",
    ()=>DialogDescription,
    "DialogFooter",
    ()=>DialogFooter,
    "DialogHeader",
    ()=>DialogHeader,
    "DialogOverlay",
    ()=>DialogOverlay,
    "DialogPortal",
    ()=>DialogPortal,
    "DialogTitle",
    ()=>DialogTitle,
    "DialogTrigger",
    ()=>DialogTrigger
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.10_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$dialog$40$1$2e$1$2e$_3c24438a856d60dc4321c37f337cee45$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@radix-ui+react-dialog@1.1._3c24438a856d60dc4321c37f337cee45/node_modules/@radix-ui/react-dialog/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$454$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__XIcon$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.454.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/x.js [app-client] (ecmascript) <export default as XIcon>");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/utils.ts [app-client] (ecmascript)");
'use client';
;
;
;
;
function Dialog({ ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$dialog$40$1$2e$1$2e$_3c24438a856d60dc4321c37f337cee45$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Root"], {
        "data-slot": "dialog",
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/dialog.tsx",
        lineNumber: 12,
        columnNumber: 10
    }, this);
}
_c = Dialog;
function DialogTrigger({ ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$dialog$40$1$2e$1$2e$_3c24438a856d60dc4321c37f337cee45$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Trigger"], {
        "data-slot": "dialog-trigger",
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/dialog.tsx",
        lineNumber: 18,
        columnNumber: 10
    }, this);
}
_c1 = DialogTrigger;
function DialogPortal({ ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$dialog$40$1$2e$1$2e$_3c24438a856d60dc4321c37f337cee45$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Portal"], {
        "data-slot": "dialog-portal",
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/dialog.tsx",
        lineNumber: 24,
        columnNumber: 10
    }, this);
}
_c2 = DialogPortal;
function DialogClose({ ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$dialog$40$1$2e$1$2e$_3c24438a856d60dc4321c37f337cee45$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Close"], {
        "data-slot": "dialog-close",
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/dialog.tsx",
        lineNumber: 30,
        columnNumber: 10
    }, this);
}
_c3 = DialogClose;
function DialogOverlay({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$dialog$40$1$2e$1$2e$_3c24438a856d60dc4321c37f337cee45$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Overlay"], {
        "data-slot": "dialog-overlay",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/50', className),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/dialog.tsx",
        lineNumber: 38,
        columnNumber: 5
    }, this);
}
_c4 = DialogOverlay;
function DialogContent({ className, children, showCloseButton = true, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(DialogPortal, {
        "data-slot": "dialog-portal",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(DialogOverlay, {}, void 0, false, {
                fileName: "[project]/components/ui/dialog.tsx",
                lineNumber: 59,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$dialog$40$1$2e$1$2e$_3c24438a856d60dc4321c37f337cee45$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Content"], {
                "data-slot": "dialog-content",
                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('bg-background data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 fixed top-[50%] left-[50%] z-50 grid w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] gap-4 rounded-lg border p-6 shadow-lg duration-200 sm:max-w-lg', className),
                ...props,
                children: [
                    children,
                    showCloseButton && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$dialog$40$1$2e$1$2e$_3c24438a856d60dc4321c37f337cee45$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Close"], {
                        "data-slot": "dialog-close",
                        className: "ring-offset-background focus:ring-ring data-[state=open]:bg-accent data-[state=open]:text-muted-foreground absolute top-4 right-4 rounded-xs opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$454$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__XIcon$3e$__["XIcon"], {}, void 0, false, {
                                fileName: "[project]/components/ui/dialog.tsx",
                                lineNumber: 74,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "sr-only",
                                children: "Close"
                            }, void 0, false, {
                                fileName: "[project]/components/ui/dialog.tsx",
                                lineNumber: 75,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/ui/dialog.tsx",
                        lineNumber: 70,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/ui/dialog.tsx",
                lineNumber: 60,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/ui/dialog.tsx",
        lineNumber: 58,
        columnNumber: 5
    }, this);
}
_c5 = DialogContent;
function DialogHeader({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        "data-slot": "dialog-header",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('flex flex-col gap-2 text-center sm:text-left', className),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/dialog.tsx",
        lineNumber: 85,
        columnNumber: 5
    }, this);
}
_c6 = DialogHeader;
function DialogFooter({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        "data-slot": "dialog-footer",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('flex flex-col-reverse gap-2 sm:flex-row sm:justify-end', className),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/dialog.tsx",
        lineNumber: 95,
        columnNumber: 5
    }, this);
}
_c7 = DialogFooter;
function DialogTitle({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$dialog$40$1$2e$1$2e$_3c24438a856d60dc4321c37f337cee45$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Title"], {
        "data-slot": "dialog-title",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('text-lg leading-none font-semibold', className),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/dialog.tsx",
        lineNumber: 111,
        columnNumber: 5
    }, this);
}
_c8 = DialogTitle;
function DialogDescription({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$radix$2d$ui$2b$react$2d$dialog$40$1$2e$1$2e$_3c24438a856d60dc4321c37f337cee45$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Description"], {
        "data-slot": "dialog-description",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('text-muted-foreground text-sm', className),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/dialog.tsx",
        lineNumber: 124,
        columnNumber: 5
    }, this);
}
_c9 = DialogDescription;
;
var _c, _c1, _c2, _c3, _c4, _c5, _c6, _c7, _c8, _c9;
__turbopack_context__.k.register(_c, "Dialog");
__turbopack_context__.k.register(_c1, "DialogTrigger");
__turbopack_context__.k.register(_c2, "DialogPortal");
__turbopack_context__.k.register(_c3, "DialogClose");
__turbopack_context__.k.register(_c4, "DialogOverlay");
__turbopack_context__.k.register(_c5, "DialogContent");
__turbopack_context__.k.register(_c6, "DialogHeader");
__turbopack_context__.k.register(_c7, "DialogFooter");
__turbopack_context__.k.register(_c8, "DialogTitle");
__turbopack_context__.k.register(_c9, "DialogDescription");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/actions/data:496743 [app-client] (ecmascript) <text/javascript>", ((__turbopack_context__) => {
"use strict";

/* __next_internal_action_entry_do_not_use__ [{"40760250a0f0276425dcf05a519fbffe7aee716735":"getPayrollAdjustmentDetails"},"lib/actions/payroll-actions.ts",""] */ __turbopack_context__.s([
    "getPayrollAdjustmentDetails",
    ()=>getPayrollAdjustmentDetails
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.10_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-client-wrapper.js [app-client] (ecmascript)");
"use turbopack no side effects";
;
var getPayrollAdjustmentDetails = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createServerReference"])("40760250a0f0276425dcf05a519fbffe7aee716735", __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["callServer"], void 0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["findSourceMapURL"], "getPayrollAdjustmentDetails"); //# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4vcGF5cm9sbC1hY3Rpb25zLnRzIl0sInNvdXJjZXNDb250ZW50IjpbIlwidXNlIHNlcnZlclwiXHJcblxyXG5pbXBvcnQgeyBjcmVhdGVDbGllbnQgfSBmcm9tIFwiQC9saWIvc3VwYWJhc2Uvc2VydmVyXCJcclxuaW1wb3J0IHsgcmV2YWxpZGF0ZVBhdGggfSBmcm9tIFwibmV4dC9jYWNoZVwiXHJcbmltcG9ydCB0eXBlIHtcclxuICBQYXlyb2xsUnVuLFxyXG4gIFBheXJvbGxJdGVtV2l0aFJlbGF0aW9ucyxcclxuICBTYWxhcnlTdHJ1Y3R1cmUsXHJcbiAgUGF5cm9sbEFkanVzdG1lbnRUeXBlLFxyXG59IGZyb20gXCJAL2xpYi90eXBlcy9kYXRhYmFzZVwiXHJcblxyXG5jb25zdCBTVEFOREFSRF9XT1JLSU5HX0RBWVMgPSAyNiAvLyBDw7RuZyBjaHXhuqluIFZOXHJcblxyXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuLy8gRU1QTE9ZRUUgQUNUSU9OU1xyXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHJcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBnZXRNeVBheXNsaXBzKCk6IFByb21pc2U8UGF5cm9sbEl0ZW1XaXRoUmVsYXRpb25zW10+IHtcclxuICBjb25zdCBzdXBhYmFzZSA9IGF3YWl0IGNyZWF0ZUNsaWVudCgpXHJcblxyXG4gIGNvbnN0IHtcclxuICAgIGRhdGE6IHsgdXNlciB9LFxyXG4gIH0gPSBhd2FpdCBzdXBhYmFzZS5hdXRoLmdldFVzZXIoKVxyXG4gIGlmICghdXNlcikgcmV0dXJuIFtdXHJcblxyXG4gIGNvbnN0IHsgZGF0YTogZW1wbG95ZWUgfSA9IGF3YWl0IHN1cGFiYXNlXHJcbiAgICAuZnJvbShcImVtcGxveWVlc1wiKVxyXG4gICAgLnNlbGVjdChcImlkXCIpXHJcbiAgICAuZXEoXCJ1c2VyX2lkXCIsIHVzZXIuaWQpXHJcbiAgICAuc2luZ2xlKClcclxuXHJcbiAgaWYgKCFlbXBsb3llZSkgcmV0dXJuIFtdXHJcblxyXG4gIGNvbnN0IHsgZGF0YSwgZXJyb3IgfSA9IGF3YWl0IHN1cGFiYXNlXHJcbiAgICAuZnJvbShcInBheXJvbGxfaXRlbXNcIilcclxuICAgIC5zZWxlY3QoXHJcbiAgICAgIGBcclxuICAgICAgKixcclxuICAgICAgcGF5cm9sbF9ydW46cGF5cm9sbF9ydW5zKCopXHJcbiAgICBgXHJcbiAgICApXHJcbiAgICAuZXEoXCJlbXBsb3llZV9pZFwiLCBlbXBsb3llZS5pZClcclxuICAgIC5vcmRlcihcImNyZWF0ZWRfYXRcIiwgeyBhc2NlbmRpbmc6IGZhbHNlIH0pXHJcblxyXG4gIGlmIChlcnJvcikge1xyXG4gICAgY29uc29sZS5lcnJvcihcIkVycm9yIGZldGNoaW5nIHBheXNsaXBzOlwiLCBlcnJvcilcclxuICAgIHJldHVybiBbXVxyXG4gIH1cclxuXHJcbiAgcmV0dXJuIChkYXRhIHx8IFtdKSBhcyBQYXlyb2xsSXRlbVdpdGhSZWxhdGlvbnNbXVxyXG59XHJcblxyXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuLy8gSFIgQUNUSU9OUyAtIFBBWVJPTEwgUlVOU1xyXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHJcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBsaXN0UGF5cm9sbFJ1bnMoKTogUHJvbWlzZTxQYXlyb2xsUnVuW10+IHtcclxuICBjb25zdCBzdXBhYmFzZSA9IGF3YWl0IGNyZWF0ZUNsaWVudCgpXHJcblxyXG4gIGNvbnN0IHsgZGF0YSwgZXJyb3IgfSA9IGF3YWl0IHN1cGFiYXNlXHJcbiAgICAuZnJvbShcInBheXJvbGxfcnVuc1wiKVxyXG4gICAgLnNlbGVjdChcIipcIilcclxuICAgIC5vcmRlcihcInllYXJcIiwgeyBhc2NlbmRpbmc6IGZhbHNlIH0pXHJcbiAgICAub3JkZXIoXCJtb250aFwiLCB7IGFzY2VuZGluZzogZmFsc2UgfSlcclxuXHJcbiAgaWYgKGVycm9yKSB7XHJcbiAgICBjb25zb2xlLmVycm9yKFwiRXJyb3IgbGlzdGluZyBwYXlyb2xsIHJ1bnM6XCIsIGVycm9yKVxyXG4gICAgcmV0dXJuIFtdXHJcbiAgfVxyXG5cclxuICByZXR1cm4gZGF0YSB8fCBbXVxyXG59XHJcblxyXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZ2V0UGF5cm9sbFJ1bihpZDogc3RyaW5nKTogUHJvbWlzZTxQYXlyb2xsUnVuIHwgbnVsbD4ge1xyXG4gIGNvbnN0IHN1cGFiYXNlID0gYXdhaXQgY3JlYXRlQ2xpZW50KClcclxuXHJcbiAgY29uc3QgeyBkYXRhLCBlcnJvciB9ID0gYXdhaXQgc3VwYWJhc2VcclxuICAgIC5mcm9tKFwicGF5cm9sbF9ydW5zXCIpXHJcbiAgICAuc2VsZWN0KFwiKlwiKVxyXG4gICAgLmVxKFwiaWRcIiwgaWQpXHJcbiAgICAuc2luZ2xlKClcclxuXHJcbiAgaWYgKGVycm9yKSB7XHJcbiAgICBjb25zb2xlLmVycm9yKFwiRXJyb3IgZmV0Y2hpbmcgcGF5cm9sbCBydW46XCIsIGVycm9yKVxyXG4gICAgcmV0dXJuIG51bGxcclxuICB9XHJcblxyXG4gIHJldHVybiBkYXRhXHJcbn1cclxuXHJcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBnZXRQYXlyb2xsSXRlbXMoXHJcbiAgcGF5cm9sbF9ydW5faWQ6IHN0cmluZ1xyXG4pOiBQcm9taXNlPFBheXJvbGxJdGVtV2l0aFJlbGF0aW9uc1tdPiB7XHJcbiAgY29uc3Qgc3VwYWJhc2UgPSBhd2FpdCBjcmVhdGVDbGllbnQoKVxyXG5cclxuICBjb25zdCB7IGRhdGEsIGVycm9yIH0gPSBhd2FpdCBzdXBhYmFzZVxyXG4gICAgLmZyb20oXCJwYXlyb2xsX2l0ZW1zXCIpXHJcbiAgICAuc2VsZWN0KFxyXG4gICAgICBgXHJcbiAgICAgICosXHJcbiAgICAgIGVtcGxveWVlOmVtcGxveWVlcyhpZCwgZnVsbF9uYW1lLCBlbXBsb3llZV9jb2RlLCBkZXBhcnRtZW50X2lkLCBkZXBhcnRtZW50OmRlcGFydG1lbnRzKG5hbWUpKVxyXG4gICAgYFxyXG4gICAgKVxyXG4gICAgLmVxKFwicGF5cm9sbF9ydW5faWRcIiwgcGF5cm9sbF9ydW5faWQpXHJcbiAgICAub3JkZXIoXCJjcmVhdGVkX2F0XCIsIHsgYXNjZW5kaW5nOiB0cnVlIH0pXHJcblxyXG4gIGlmIChlcnJvcikge1xyXG4gICAgY29uc29sZS5lcnJvcihcIkVycm9yIGZldGNoaW5nIHBheXJvbGwgaXRlbXM6XCIsIGVycm9yKVxyXG4gICAgcmV0dXJuIFtdXHJcbiAgfVxyXG5cclxuICByZXR1cm4gKGRhdGEgfHwgW10pIGFzIFBheXJvbGxJdGVtV2l0aFJlbGF0aW9uc1tdXHJcbn1cclxuXHJcbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG4vLyBIUiBBQ1RJT05TIC0gR0VORVJBVEUgUEFZUk9MTCAoduG7m2kgcGjhu6UgY+G6pXAsIHF14bu5LCBwaOG6oXQpXHJcbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cclxuaW50ZXJmYWNlIEF0dGVuZGFuY2VWaW9sYXRpb24ge1xyXG4gIGRhdGU6IHN0cmluZ1xyXG4gIGxhdGVNaW51dGVzOiBudW1iZXJcclxuICBlYXJseU1pbnV0ZXM6IG51bWJlclxyXG4gIGlzSGFsZkRheTogYm9vbGVhbiAvLyBOZ2jhu4kgbuG7rWEgbmfDoHkgKGNhIHPDoW5nIGhv4bq3YyBjYSBjaGnhu4F1KVxyXG4gIGlzQWJzZW50OiBib29sZWFuIC8vIEtow7RuZyB0w61uaCBjw7RuZyAoxJFpIG114buZbiA+MSB0aeG6v25nIGtow7RuZyBjw7MgcGjDqXApXHJcbiAgaGFzQXBwcm92ZWRSZXF1ZXN0OiBib29sZWFuXHJcbn1cclxuXHJcbmludGVyZmFjZSBTaGlmdEluZm8ge1xyXG4gIHN0YXJ0VGltZTogc3RyaW5nIC8vIFwiMDg6MDBcIlxyXG4gIGVuZFRpbWU6IHN0cmluZyAvLyBcIjE3OjAwXCJcclxuICBicmVha1N0YXJ0OiBzdHJpbmcgfCBudWxsIC8vIFwiMTI6MDBcIlxyXG4gIGJyZWFrRW5kOiBzdHJpbmcgfCBudWxsIC8vIFwiMTM6MzBcIlxyXG59XHJcblxyXG5hc3luYyBmdW5jdGlvbiBnZXRFbXBsb3llZVZpb2xhdGlvbnMoXHJcbiAgc3VwYWJhc2U6IGFueSxcclxuICBlbXBsb3llZUlkOiBzdHJpbmcsXHJcbiAgc3RhcnREYXRlOiBzdHJpbmcsXHJcbiAgZW5kRGF0ZTogc3RyaW5nLFxyXG4gIHNoaWZ0OiBTaGlmdEluZm9cclxuKTogUHJvbWlzZTxBdHRlbmRhbmNlVmlvbGF0aW9uW10+IHtcclxuICBjb25zdCB2aW9sYXRpb25zOiBBdHRlbmRhbmNlVmlvbGF0aW9uW10gPSBbXVxyXG5cclxuICAvLyBM4bqleSBhdHRlbmRhbmNlIGxvZ3NcclxuICBjb25zdCB7IGRhdGE6IGxvZ3MgfSA9IGF3YWl0IHN1cGFiYXNlXHJcbiAgICAuZnJvbShcImF0dGVuZGFuY2VfbG9nc1wiKVxyXG4gICAgLnNlbGVjdChcImNoZWNrX2luLCBjaGVja19vdXRcIilcclxuICAgIC5lcShcImVtcGxveWVlX2lkXCIsIGVtcGxveWVlSWQpXHJcbiAgICAuZ3RlKFwiY2hlY2tfaW5cIiwgc3RhcnREYXRlKVxyXG4gICAgLmx0ZShcImNoZWNrX2luXCIsIGVuZERhdGUgKyBcIlQyMzo1OTo1OVwiKVxyXG5cclxuICAvLyBM4bqleSB0aW1lIGFkanVzdG1lbnQgcmVxdWVzdHMgxJHDoyBhcHByb3ZlZFxyXG4gIGNvbnN0IHsgZGF0YTogYXBwcm92ZWRSZXF1ZXN0cyB9ID0gYXdhaXQgc3VwYWJhc2VcclxuICAgIC5mcm9tKFwidGltZV9hZGp1c3RtZW50X3JlcXVlc3RzXCIpXHJcbiAgICAuc2VsZWN0KFwicmVxdWVzdF9kYXRlXCIpXHJcbiAgICAuZXEoXCJlbXBsb3llZV9pZFwiLCBlbXBsb3llZUlkKVxyXG4gICAgLmVxKFwic3RhdHVzXCIsIFwiYXBwcm92ZWRcIilcclxuICAgIC5ndGUoXCJyZXF1ZXN0X2RhdGVcIiwgc3RhcnREYXRlKVxyXG4gICAgLmx0ZShcInJlcXVlc3RfZGF0ZVwiLCBlbmREYXRlKVxyXG5cclxuICBjb25zdCBhcHByb3ZlZERhdGVzID0gbmV3IFNldCgoYXBwcm92ZWRSZXF1ZXN0cyB8fCBbXSkubWFwKChyOiBhbnkpID0+IHIucmVxdWVzdF9kYXRlKSlcclxuXHJcbiAgaWYgKGxvZ3MpIHtcclxuICAgIGNvbnN0IFtzaGlmdEgsIHNoaWZ0TV0gPSBzaGlmdC5zdGFydFRpbWUuc3BsaXQoXCI6XCIpLm1hcChOdW1iZXIpXHJcbiAgICBjb25zdCBzaGlmdFN0YXJ0TWludXRlcyA9IHNoaWZ0SCAqIDYwICsgc2hpZnRNXHJcblxyXG4gICAgLy8gUGFyc2UgYnJlYWsgdGltZXNcclxuICAgIGxldCBicmVha1N0YXJ0TWludXRlcyA9IDBcclxuICAgIGxldCBicmVha0VuZE1pbnV0ZXMgPSAwXHJcbiAgICBpZiAoc2hpZnQuYnJlYWtTdGFydCAmJiBzaGlmdC5icmVha0VuZCkge1xyXG4gICAgICBjb25zdCBbYnNILCBic01dID0gc2hpZnQuYnJlYWtTdGFydC5zcGxpdChcIjpcIikubWFwKE51bWJlcilcclxuICAgICAgY29uc3QgW2JlSCwgYmVNXSA9IHNoaWZ0LmJyZWFrRW5kLnNwbGl0KFwiOlwiKS5tYXAoTnVtYmVyKVxyXG4gICAgICBicmVha1N0YXJ0TWludXRlcyA9IGJzSCAqIDYwICsgYnNNXHJcbiAgICAgIGJyZWFrRW5kTWludXRlcyA9IGJlSCAqIDYwICsgYmVNXHJcbiAgICB9XHJcblxyXG4gICAgZm9yIChjb25zdCBsb2cgb2YgbG9ncykge1xyXG4gICAgICBpZiAoIWxvZy5jaGVja19pbikgY29udGludWVcclxuXHJcbiAgICAgIGNvbnN0IGNoZWNrSW5EYXRlID0gbmV3IERhdGUobG9nLmNoZWNrX2luKVxyXG4gICAgICBjb25zdCBkYXRlU3RyID0gY2hlY2tJbkRhdGUudG9JU09TdHJpbmcoKS5zcGxpdChcIlRcIilbMF1cclxuICAgICAgY29uc3QgY2hlY2tJbkhvdXIgPSBjaGVja0luRGF0ZS5nZXRIb3VycygpXHJcbiAgICAgIGNvbnN0IGNoZWNrSW5NaW4gPSBjaGVja0luRGF0ZS5nZXRNaW51dGVzKClcclxuICAgICAgY29uc3QgY2hlY2tJbk1pbnV0ZXMgPSBjaGVja0luSG91ciAqIDYwICsgY2hlY2tJbk1pblxyXG5cclxuICAgICAgY29uc3QgaGFzQXBwcm92ZWRSZXF1ZXN0ID0gYXBwcm92ZWREYXRlcy5oYXMoZGF0ZVN0cilcclxuXHJcbiAgICAgIC8vIEtp4buDbSB0cmEgbuG6v3UgY2hlY2sgaW4gdHJvbmcgZ2nhu50gbmdo4buJIHRyxrBhIGhv4bq3YyBzYXUgZ2nhu50gbmdo4buJIHRyxrBhXHJcbiAgICAgIC8vID0+IE5naOG7iSBjYSBzw6FuZywgxJFpIGzDoG0gY2EgY2hp4buBdSAodMOtbmggbuG7rWEgbmfDoHkpXHJcbiAgICAgIGxldCBpc0hhbGZEYXkgPSBmYWxzZVxyXG4gICAgICBsZXQgbGF0ZU1pbnV0ZXMgPSAwXHJcblxyXG4gICAgICBpZiAoYnJlYWtTdGFydE1pbnV0ZXMgPiAwICYmIGJyZWFrRW5kTWludXRlcyA+IDApIHtcclxuICAgICAgICAvLyBDaGVjayBpbiB0cm9uZyBraG/huqNuZyBuZ2jhu4kgdHLGsGEgaG/hurdjIMSR4bqndSBjYSBjaGnhu4F1XHJcbiAgICAgICAgaWYgKGNoZWNrSW5NaW51dGVzID49IGJyZWFrU3RhcnRNaW51dGVzICYmIGNoZWNrSW5NaW51dGVzIDw9IGJyZWFrRW5kTWludXRlcyArIDE1KSB7XHJcbiAgICAgICAgICAvLyBDaGVjayBpbiB04burIDEyOjAwIMSR4bq/biAxMzo0NSA9PiBuZ2jhu4kgY2Egc8OhbmcsIMSRaSBjYSBjaGnhu4F1XHJcbiAgICAgICAgICBpc0hhbGZEYXkgPSB0cnVlXHJcbiAgICAgICAgICBsYXRlTWludXRlcyA9IDAgLy8gS2jDtG5nIHTDrW5oIGzDoCDEkWkgbXXhu5luXHJcbiAgICAgICAgfSBlbHNlIGlmIChjaGVja0luTWludXRlcyA+IGJyZWFrRW5kTWludXRlcyArIDE1KSB7XHJcbiAgICAgICAgICAvLyBDaGVjayBpbiBzYXUgMTM6NDUgPT4gxJFpIG114buZbiBjYSBjaGnhu4F1XHJcbiAgICAgICAgICBsYXRlTWludXRlcyA9IGNoZWNrSW5NaW51dGVzIC0gYnJlYWtFbmRNaW51dGVzXHJcbiAgICAgICAgICBpc0hhbGZEYXkgPSB0cnVlXHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIC8vIENoZWNrIGluIHRyxrDhu5tjIGdp4budIG5naOG7iSB0csawYSA9PiB0w61uaCDEkWkgbXXhu5luIGLDrG5oIHRoxrDhu51uZ1xyXG4gICAgICAgICAgbGF0ZU1pbnV0ZXMgPSBNYXRoLm1heCgwLCBjaGVja0luTWludXRlcyAtIHNoaWZ0U3RhcnRNaW51dGVzKVxyXG4gICAgICAgIH1cclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICAvLyBLaMO0bmcgY8OzIGdp4budIG5naOG7iSB0csawYSA9PiB0w61uaCDEkWkgbXXhu5luIGLDrG5oIHRoxrDhu51uZ1xyXG4gICAgICAgIGxhdGVNaW51dGVzID0gTWF0aC5tYXgoMCwgY2hlY2tJbk1pbnV0ZXMgLSBzaGlmdFN0YXJ0TWludXRlcylcclxuICAgICAgfVxyXG5cclxuICAgICAgLy8gxJBpIG114buZbiA+NjAgcGjDunQgdsOgIGtow7RuZyBjw7MgcGjDqXAgPT4ga2jDtG5nIHTDrW5oIGPDtG5nIChpc0Fic2VudClcclxuICAgICAgY29uc3QgaXNBYnNlbnQgPSBsYXRlTWludXRlcyA+IDYwICYmICFoYXNBcHByb3ZlZFJlcXVlc3RcclxuXHJcbiAgICAgIHZpb2xhdGlvbnMucHVzaCh7XHJcbiAgICAgICAgZGF0ZTogZGF0ZVN0cixcclxuICAgICAgICBsYXRlTWludXRlcyxcclxuICAgICAgICBlYXJseU1pbnV0ZXM6IDAsXHJcbiAgICAgICAgaXNIYWxmRGF5LFxyXG4gICAgICAgIGlzQWJzZW50LFxyXG4gICAgICAgIGhhc0FwcHJvdmVkUmVxdWVzdCxcclxuICAgICAgfSlcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHJldHVybiB2aW9sYXRpb25zXHJcbn1cclxuXHJcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBnZW5lcmF0ZVBheXJvbGwobW9udGg6IG51bWJlciwgeWVhcjogbnVtYmVyKSB7XHJcbiAgY29uc3Qgc3VwYWJhc2UgPSBhd2FpdCBjcmVhdGVDbGllbnQoKVxyXG5cclxuICBjb25zdCB7XHJcbiAgICBkYXRhOiB7IHVzZXIgfSxcclxuICB9ID0gYXdhaXQgc3VwYWJhc2UuYXV0aC5nZXRVc2VyKClcclxuICBpZiAoIXVzZXIpIHJldHVybiB7IHN1Y2Nlc3M6IGZhbHNlLCBlcnJvcjogXCJDaMawYSDEkcSDbmcgbmjhuq1wXCIgfVxyXG5cclxuICAvLyBLaeG7g20gdHJhIMSRw6MgY8OzIHBheXJvbGwgcnVuIGNoxrBhXHJcbiAgY29uc3QgeyBkYXRhOiBleGlzdGluZ1J1biB9ID0gYXdhaXQgc3VwYWJhc2VcclxuICAgIC5mcm9tKFwicGF5cm9sbF9ydW5zXCIpXHJcbiAgICAuc2VsZWN0KFwiaWQsIHN0YXR1c1wiKVxyXG4gICAgLmVxKFwibW9udGhcIiwgbW9udGgpXHJcbiAgICAuZXEoXCJ5ZWFyXCIsIHllYXIpXHJcbiAgICAuc2luZ2xlKClcclxuXHJcbiAgaWYgKGV4aXN0aW5nUnVuKSB7XHJcbiAgICBpZiAoZXhpc3RpbmdSdW4uc3RhdHVzICE9PSBcImRyYWZ0XCIpIHtcclxuICAgICAgcmV0dXJuIHsgc3VjY2VzczogZmFsc2UsIGVycm9yOiBcIkLhuqNuZyBsxrDGoW5nIHRow6FuZyBuw6B5IMSRw6Mga2jDs2EsIGtow7RuZyB0aOG7gyB04bqhbyBs4bqhaVwiIH1cclxuICAgIH1cclxuICAgIC8vIFjDs2EgcGF5cm9sbCBpdGVtcyB2w6AgYWRqdXN0bWVudCBkZXRhaWxzIGPFqVxyXG4gICAgYXdhaXQgc3VwYWJhc2UuZnJvbShcInBheXJvbGxfYWRqdXN0bWVudF9kZXRhaWxzXCIpLmRlbGV0ZSgpLmluKFxyXG4gICAgICBcInBheXJvbGxfaXRlbV9pZFwiLFxyXG4gICAgICAoYXdhaXQgc3VwYWJhc2UuZnJvbShcInBheXJvbGxfaXRlbXNcIikuc2VsZWN0KFwiaWRcIikuZXEoXCJwYXlyb2xsX3J1bl9pZFwiLCBleGlzdGluZ1J1bi5pZCkpLmRhdGE/Lm1hcCgoaTogYW55KSA9PiBpLmlkKSB8fCBbXVxyXG4gICAgKVxyXG4gICAgYXdhaXQgc3VwYWJhc2UuZnJvbShcInBheXJvbGxfaXRlbXNcIikuZGVsZXRlKCkuZXEoXCJwYXlyb2xsX3J1bl9pZFwiLCBleGlzdGluZ1J1bi5pZClcclxuICAgIGF3YWl0IHN1cGFiYXNlLmZyb20oXCJwYXlyb2xsX3J1bnNcIikuZGVsZXRlKCkuZXEoXCJpZFwiLCBleGlzdGluZ1J1bi5pZClcclxuICB9XHJcblxyXG4gIC8vIFThuqFvIHBheXJvbGwgcnVuIG3hu5tpXHJcbiAgY29uc3QgeyBkYXRhOiBydW4sIGVycm9yOiBydW5FcnJvciB9ID0gYXdhaXQgc3VwYWJhc2VcclxuICAgIC5mcm9tKFwicGF5cm9sbF9ydW5zXCIpXHJcbiAgICAuaW5zZXJ0KHtcclxuICAgICAgbW9udGgsXHJcbiAgICAgIHllYXIsXHJcbiAgICAgIHN0YXR1czogXCJkcmFmdFwiLFxyXG4gICAgICBjcmVhdGVkX2J5OiB1c2VyLmlkLFxyXG4gICAgfSlcclxuICAgIC5zZWxlY3QoKVxyXG4gICAgLnNpbmdsZSgpXHJcblxyXG4gIGlmIChydW5FcnJvcikge1xyXG4gICAgY29uc29sZS5lcnJvcihcIkVycm9yIGNyZWF0aW5nIHBheXJvbGwgcnVuOlwiLCBydW5FcnJvcilcclxuICAgIHJldHVybiB7IHN1Y2Nlc3M6IGZhbHNlLCBlcnJvcjogcnVuRXJyb3IubWVzc2FnZSB9XHJcbiAgfVxyXG5cclxuICAvLyBM4bqleSBkYW5oIHPDoWNoIG5ow6JuIHZpw6puIGFjdGl2ZSBob+G6t2Mgb25ib2FyZGluZ1xyXG4gIGNvbnN0IHsgZGF0YTogZW1wbG95ZWVzLCBlcnJvcjogZW1wRXJyb3IgfSA9IGF3YWl0IHN1cGFiYXNlXHJcbiAgICAuZnJvbShcImVtcGxveWVlc1wiKVxyXG4gICAgLnNlbGVjdChcImlkLCBmdWxsX25hbWUsIGVtcGxveWVlX2NvZGUsIHNoaWZ0X2lkXCIpXHJcbiAgICAuaW4oXCJzdGF0dXNcIiwgW1wiYWN0aXZlXCIsIFwib25ib2FyZGluZ1wiXSlcclxuXHJcbiAgaWYgKGVtcEVycm9yIHx8ICFlbXBsb3llZXMgfHwgZW1wbG95ZWVzLmxlbmd0aCA9PT0gMCkge1xyXG4gICAgcmV0dXJuIHsgc3VjY2VzczogZmFsc2UsIGVycm9yOiBcIktow7RuZyBjw7MgbmjDom4gdmnDqm4uIFZ1aSBsw7JuZyBraeG7g20gdHJhIHRy4bqhbmcgdGjDoWkgbmjDom4gdmnDqm4uXCIgfVxyXG4gIH1cclxuXHJcbiAgLy8gTOG6pXkgY8OhYyBsb+G6oWkgxJFp4buBdSBjaOG7iW5oIGFjdGl2ZVxyXG4gIGNvbnN0IHsgZGF0YTogYWRqdXN0bWVudFR5cGVzIH0gPSBhd2FpdCBzdXBhYmFzZVxyXG4gICAgLmZyb20oXCJwYXlyb2xsX2FkanVzdG1lbnRfdHlwZXNcIilcclxuICAgIC5zZWxlY3QoXCIqXCIpXHJcbiAgICAuZXEoXCJpc19hY3RpdmVcIiwgdHJ1ZSlcclxuXHJcbiAgLy8gTOG6pXkgd29yayBzaGlmdHNcclxuICBjb25zdCB7IGRhdGE6IHNoaWZ0cyB9ID0gYXdhaXQgc3VwYWJhc2UuZnJvbShcIndvcmtfc2hpZnRzXCIpLnNlbGVjdChcIipcIilcclxuICBjb25zdCBzaGlmdE1hcCA9IG5ldyBNYXAoKHNoaWZ0cyB8fCBbXSkubWFwKChzOiBhbnkpID0+IFtzLmlkLCBzXSkpXHJcblxyXG4gIC8vIFTDrW5oIG5nw6B5IMSR4bqndSB2w6AgY3Xhu5FpIHRow6FuZ1xyXG4gIGNvbnN0IHN0YXJ0RGF0ZSA9IGAke3llYXJ9LSR7U3RyaW5nKG1vbnRoKS5wYWRTdGFydCgyLCBcIjBcIil9LTAxYFxyXG4gIGNvbnN0IGVuZERhdGUgPSBuZXcgRGF0ZSh5ZWFyLCBtb250aCwgMCkudG9JU09TdHJpbmcoKS5zcGxpdChcIlRcIilbMF1cclxuXHJcbiAgbGV0IHByb2Nlc3NlZENvdW50ID0gMFxyXG4gIGZvciAoY29uc3QgZW1wIG9mIGVtcGxveWVlcykge1xyXG4gICAgLy8gTOG6pXkgbMawxqFuZyBoaeG7h3UgbOG7sWNcclxuICAgIGNvbnN0IHsgZGF0YTogc2FsYXJ5IH0gPSBhd2FpdCBzdXBhYmFzZVxyXG4gICAgICAuZnJvbShcInNhbGFyeV9zdHJ1Y3R1cmVcIilcclxuICAgICAgLnNlbGVjdChcIipcIilcclxuICAgICAgLmVxKFwiZW1wbG95ZWVfaWRcIiwgZW1wLmlkKVxyXG4gICAgICAubHRlKFwiZWZmZWN0aXZlX2RhdGVcIiwgZW5kRGF0ZSlcclxuICAgICAgLm9yZGVyKFwiZWZmZWN0aXZlX2RhdGVcIiwgeyBhc2NlbmRpbmc6IGZhbHNlIH0pXHJcbiAgICAgIC5saW1pdCgxKVxyXG4gICAgICAubWF5YmVTaW5nbGUoKVxyXG5cclxuICAgIGNvbnN0IGJhc2VTYWxhcnkgPSBzYWxhcnk/LmJhc2Vfc2FsYXJ5IHx8IDBcclxuICAgIGNvbnN0IGRhaWx5U2FsYXJ5ID0gYmFzZVNhbGFyeSAvIFNUQU5EQVJEX1dPUktJTkdfREFZU1xyXG5cclxuICAgIC8vIMSQ4bq/bSBuZ8OgeSBjw7RuZ1xyXG4gICAgY29uc3QgeyBjb3VudDogd29ya2luZ0RheXNDb3VudCB9ID0gYXdhaXQgc3VwYWJhc2VcclxuICAgICAgLmZyb20oXCJhdHRlbmRhbmNlX2xvZ3NcIilcclxuICAgICAgLnNlbGVjdChcIipcIiwgeyBjb3VudDogXCJleGFjdFwiLCBoZWFkOiB0cnVlIH0pXHJcbiAgICAgIC5lcShcImVtcGxveWVlX2lkXCIsIGVtcC5pZClcclxuICAgICAgLmd0ZShcImNoZWNrX2luXCIsIHN0YXJ0RGF0ZSlcclxuICAgICAgLmx0ZShcImNoZWNrX2luXCIsIGVuZERhdGUgKyBcIlQyMzo1OTo1OVwiKVxyXG5cclxuICAgIC8vIMSQ4bq/bSBuZ8OgeSBuZ2jhu4kgcGjDqXBcclxuICAgIGNvbnN0IHsgZGF0YTogbGVhdmVSZXF1ZXN0cyB9ID0gYXdhaXQgc3VwYWJhc2VcclxuICAgICAgLmZyb20oXCJsZWF2ZV9yZXF1ZXN0c1wiKVxyXG4gICAgICAuc2VsZWN0KFwiZnJvbV9kYXRlLCB0b19kYXRlLCBsZWF2ZV90eXBlXCIpXHJcbiAgICAgIC5lcShcImVtcGxveWVlX2lkXCIsIGVtcC5pZClcclxuICAgICAgLmVxKFwic3RhdHVzXCIsIFwiYXBwcm92ZWRcIilcclxuICAgICAgLmx0ZShcImZyb21fZGF0ZVwiLCBlbmREYXRlKVxyXG4gICAgICAuZ3RlKFwidG9fZGF0ZVwiLCBzdGFydERhdGUpXHJcblxyXG4gICAgbGV0IGxlYXZlRGF5cyA9IDBcclxuICAgIGxldCB1bnBhaWRMZWF2ZURheXMgPSAwXHJcblxyXG4gICAgaWYgKGxlYXZlUmVxdWVzdHMpIHtcclxuICAgICAgZm9yIChjb25zdCBsZWF2ZSBvZiBsZWF2ZVJlcXVlc3RzKSB7XHJcbiAgICAgICAgY29uc3QgbGVhdmVTdGFydCA9IG5ldyBEYXRlKE1hdGgubWF4KG5ldyBEYXRlKGxlYXZlLmZyb21fZGF0ZSkuZ2V0VGltZSgpLCBuZXcgRGF0ZShzdGFydERhdGUpLmdldFRpbWUoKSkpXHJcbiAgICAgICAgY29uc3QgbGVhdmVFbmQgPSBuZXcgRGF0ZShNYXRoLm1pbihuZXcgRGF0ZShsZWF2ZS50b19kYXRlKS5nZXRUaW1lKCksIG5ldyBEYXRlKGVuZERhdGUpLmdldFRpbWUoKSkpXHJcbiAgICAgICAgY29uc3QgZGF5cyA9IE1hdGguY2VpbCgobGVhdmVFbmQuZ2V0VGltZSgpIC0gbGVhdmVTdGFydC5nZXRUaW1lKCkpIC8gKDEwMDAgKiA2MCAqIDYwICogMjQpKSArIDFcclxuXHJcbiAgICAgICAgaWYgKGxlYXZlLmxlYXZlX3R5cGUgPT09IFwidW5wYWlkXCIpIHtcclxuICAgICAgICAgIHVucGFpZExlYXZlRGF5cyArPSBkYXlzXHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIGxlYXZlRGF5cyArPSBkYXlzXHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLy8gTOG6pXkgc2hpZnQgY+G7p2EgbmjDom4gdmnDqm5cclxuICAgIGNvbnN0IHNoaWZ0RGF0YSA9IGVtcC5zaGlmdF9pZCA/IHNoaWZ0TWFwLmdldChlbXAuc2hpZnRfaWQpIDogbnVsbFxyXG4gICAgY29uc3Qgc2hpZnRJbmZvOiBTaGlmdEluZm8gPSB7XHJcbiAgICAgIHN0YXJ0VGltZTogc2hpZnREYXRhPy5zdGFydF90aW1lPy5zbGljZSgwLCA1KSB8fCBcIjA4OjAwXCIsXHJcbiAgICAgIGVuZFRpbWU6IHNoaWZ0RGF0YT8uZW5kX3RpbWU/LnNsaWNlKDAsIDUpIHx8IFwiMTc6MDBcIixcclxuICAgICAgYnJlYWtTdGFydDogc2hpZnREYXRhPy5icmVha19zdGFydD8uc2xpY2UoMCwgNSkgfHwgbnVsbCxcclxuICAgICAgYnJlYWtFbmQ6IHNoaWZ0RGF0YT8uYnJlYWtfZW5kPy5zbGljZSgwLCA1KSB8fCBudWxsLFxyXG4gICAgfVxyXG5cclxuICAgIC8vIEzhuqV5IHZpIHBo4bqhbSBjaOG6pW0gY8O0bmdcclxuICAgIGNvbnN0IHZpb2xhdGlvbnMgPSBhd2FpdCBnZXRFbXBsb3llZVZpb2xhdGlvbnMoc3VwYWJhc2UsIGVtcC5pZCwgc3RhcnREYXRlLCBlbmREYXRlLCBzaGlmdEluZm8pXHJcbiAgICBcclxuICAgIC8vIFTDrW5oIG5nw6B5IGPDtG5nIHRo4buxYyB04bq/ICh0cuG7qyBuZ8OgeSBraMO0bmcgdMOtbmggY8O0bmcgdsOgIG7hu61hIG5nw6B5KVxyXG4gICAgY29uc3QgYWJzZW50RGF5cyA9IHZpb2xhdGlvbnMuZmlsdGVyKCh2KSA9PiB2LmlzQWJzZW50KS5sZW5ndGhcclxuICAgIGNvbnN0IGhhbGZEYXlzID0gdmlvbGF0aW9ucy5maWx0ZXIoKHYpID0+IHYuaXNIYWxmRGF5ICYmICF2LmlzQWJzZW50KS5sZW5ndGhcclxuICAgIGNvbnN0IGZ1bGxXb3JrRGF5cyA9IHZpb2xhdGlvbnMuZmlsdGVyKCh2KSA9PiAhdi5pc0hhbGZEYXkgJiYgIXYuaXNBYnNlbnQpLmxlbmd0aFxyXG4gICAgY29uc3QgYWN0dWFsV29ya2luZ0RheXMgPSBmdWxsV29ya0RheXMgKyAoaGFsZkRheXMgKiAwLjUpXHJcbiAgICBcclxuICAgIGNvbnN0IGxhdGVDb3VudCA9IHZpb2xhdGlvbnMuZmlsdGVyKCh2KSA9PiB2LmxhdGVNaW51dGVzID4gMCAmJiAhdi5pc0hhbGZEYXkpLmxlbmd0aFxyXG5cclxuICAgIC8vIEzhuqV5IGPDoWMgxJFp4buBdSBjaOG7iW5oIMSRxrDhu6NjIGfDoW4gY2hvIG5ow6JuIHZpw6puXHJcbiAgICBjb25zdCB7IGRhdGE6IGVtcEFkanVzdG1lbnRzIH0gPSBhd2FpdCBzdXBhYmFzZVxyXG4gICAgICAuZnJvbShcImVtcGxveWVlX2FkanVzdG1lbnRzXCIpXHJcbiAgICAgIC5zZWxlY3QoXCIqLCBhZGp1c3RtZW50X3R5cGU6cGF5cm9sbF9hZGp1c3RtZW50X3R5cGVzKCopXCIpXHJcbiAgICAgIC5lcShcImVtcGxveWVlX2lkXCIsIGVtcC5pZClcclxuICAgICAgLmx0ZShcImVmZmVjdGl2ZV9kYXRlXCIsIGVuZERhdGUpXHJcbiAgICAgIC5vcihgZW5kX2RhdGUuaXMubnVsbCxlbmRfZGF0ZS5ndGUuJHtzdGFydERhdGV9YClcclxuXHJcbiAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuICAgIC8vIFTDjU5IIFRPw4FOIFBI4bukIEPhuqRQLCBLSOG6pFUgVFLhu6osIFBI4bqgVFxyXG4gICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcbiAgICBsZXQgdG90YWxBbGxvd2FuY2VzID0gMCAvLyBQaOG7pSBj4bqlcCB04burIHBheXJvbGxfYWRqdXN0bWVudF90eXBlc1xyXG4gICAgbGV0IHRvdGFsRGVkdWN0aW9ucyA9IDBcclxuICAgIGxldCB0b3RhbFBlbmFsdGllcyA9IDBcclxuICAgIGNvbnN0IGFkanVzdG1lbnREZXRhaWxzOiBhbnlbXSA9IFtdXHJcblxyXG4gICAgLy8gWOG7rSBsw70gY8OhYyBsb+G6oWkgxJFp4buBdSBjaOG7iW5oIHThu7EgxJHhu5luZ1xyXG4gICAgaWYgKGFkanVzdG1lbnRUeXBlcykge1xyXG4gICAgICBmb3IgKGNvbnN0IGFkalR5cGUgb2YgYWRqdXN0bWVudFR5cGVzIGFzIFBheXJvbGxBZGp1c3RtZW50VHlwZVtdKSB7XHJcbiAgICAgICAgaWYgKCFhZGpUeXBlLmlzX2F1dG9fYXBwbGllZCkgY29udGludWVcclxuXHJcbiAgICAgICAgY29uc3QgcnVsZXMgPSBhZGpUeXBlLmF1dG9fcnVsZXNcclxuXHJcbiAgICAgICAgLy8gPT09PT09PT09PSBLSOG6pFUgVFLhu6ogVOG7sCDEkOG7mE5HIChRdeG7uSBjaHVuZywgQkhYSC4uLikgPT09PT09PT09PVxyXG4gICAgICAgIGlmIChhZGpUeXBlLmNhdGVnb3J5ID09PSBcImRlZHVjdGlvblwiKSB7XHJcbiAgICAgICAgICBsZXQgZmluYWxBbW91bnQgPSBhZGpUeXBlLmFtb3VudFxyXG5cclxuICAgICAgICAgIC8vIFTDrW5oIEJIWEggdGhlbyAlIGzGsMahbmcgY8ahIGLhuqNuIG7hur91IGPDsyBydWxlXHJcbiAgICAgICAgICBpZiAocnVsZXM/LmNhbGN1bGF0ZV9mcm9tID09PSBcImJhc2Vfc2FsYXJ5XCIgJiYgcnVsZXM/LnBlcmNlbnRhZ2UpIHtcclxuICAgICAgICAgICAgZmluYWxBbW91bnQgPSAoYmFzZVNhbGFyeSAqIHJ1bGVzLnBlcmNlbnRhZ2UpIC8gMTAwXHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgdG90YWxEZWR1Y3Rpb25zICs9IGZpbmFsQW1vdW50XHJcbiAgICAgICAgICBhZGp1c3RtZW50RGV0YWlscy5wdXNoKHtcclxuICAgICAgICAgICAgYWRqdXN0bWVudF90eXBlX2lkOiBhZGpUeXBlLmlkLFxyXG4gICAgICAgICAgICBjYXRlZ29yeTogXCJkZWR1Y3Rpb25cIixcclxuICAgICAgICAgICAgYmFzZV9hbW91bnQ6IGFkalR5cGUuYW1vdW50LFxyXG4gICAgICAgICAgICBhZGp1c3RlZF9hbW91bnQ6IDAsXHJcbiAgICAgICAgICAgIGZpbmFsX2Ftb3VudDogZmluYWxBbW91bnQsXHJcbiAgICAgICAgICAgIHJlYXNvbjogYWRqVHlwZS5uYW1lLFxyXG4gICAgICAgICAgICBvY2N1cnJlbmNlX2NvdW50OiAxLFxyXG4gICAgICAgICAgfSlcclxuICAgICAgICAgIGNvbnRpbnVlXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyA9PT09PT09PT09IFBI4bukIEPhuqRQIFThu7AgxJDhu5hORyA9PT09PT09PT09XHJcbiAgICAgICAgaWYgKGFkalR5cGUuY2F0ZWdvcnkgPT09IFwiYWxsb3dhbmNlXCIpIHtcclxuICAgICAgICAgIC8vIFBo4bulIGPhuqVwIHRoZW8gbmfDoHkgY8O0bmcgKMSDbiB0csawYSkgLSBjaOG7iSB0w61uaCBuZ8OgeSDEkWkgbMOgbSDEkeG7pywga2jDtG5nIHTDrW5oIG7hu61hIG5nw6B5XHJcbiAgICAgICAgICBpZiAoYWRqVHlwZS5jYWxjdWxhdGlvbl90eXBlID09PSBcImRhaWx5XCIpIHtcclxuICAgICAgICAgICAgbGV0IGVsaWdpYmxlRGF5cyA9IGZ1bGxXb3JrRGF5cyAvLyBDaOG7iSB0w61uaCBuZ8OgeSDEkWkgbMOgbSDEkeG7p1xyXG5cclxuICAgICAgICAgICAgaWYgKHJ1bGVzKSB7XHJcbiAgICAgICAgICAgICAgLy8gVHLhu6sgbmfDoHkgbmdo4buJXHJcbiAgICAgICAgICAgICAgaWYgKHJ1bGVzLmRlZHVjdF9vbl9hYnNlbnQpIHtcclxuICAgICAgICAgICAgICAgIGVsaWdpYmxlRGF5cyAtPSB1bnBhaWRMZWF2ZURheXNcclxuICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgIC8vIFRy4burIG7hur91IMSRaSBtdeG7mW4gcXXDoSBz4buRIGzhuqduIGNobyBwaMOpcFxyXG4gICAgICAgICAgICAgIGlmIChydWxlcy5kZWR1Y3Rfb25fbGF0ZSAmJiBydWxlcy5sYXRlX2dyYWNlX2NvdW50ICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGV4Y2Vzc0xhdGVEYXlzID0gTWF0aC5tYXgoMCwgbGF0ZUNvdW50IC0gcnVsZXMubGF0ZV9ncmFjZV9jb3VudClcclxuICAgICAgICAgICAgICAgIGVsaWdpYmxlRGF5cyAtPSBleGNlc3NMYXRlRGF5c1xyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgZWxpZ2libGVEYXlzID0gTWF0aC5tYXgoMCwgZWxpZ2libGVEYXlzKVxyXG4gICAgICAgICAgICBjb25zdCBhbW91bnQgPSBlbGlnaWJsZURheXMgKiBhZGpUeXBlLmFtb3VudFxyXG5cclxuICAgICAgICAgICAgaWYgKGFtb3VudCA+IDApIHtcclxuICAgICAgICAgICAgICB0b3RhbEFsbG93YW5jZXMgKz0gYW1vdW50XHJcbiAgICAgICAgICAgICAgYWRqdXN0bWVudERldGFpbHMucHVzaCh7XHJcbiAgICAgICAgICAgICAgICBhZGp1c3RtZW50X3R5cGVfaWQ6IGFkalR5cGUuaWQsXHJcbiAgICAgICAgICAgICAgICBjYXRlZ29yeTogXCJhbGxvd2FuY2VcIixcclxuICAgICAgICAgICAgICAgIGJhc2VfYW1vdW50OiBmdWxsV29ya0RheXMgKiBhZGpUeXBlLmFtb3VudCxcclxuICAgICAgICAgICAgICAgIGFkanVzdGVkX2Ftb3VudDogKGZ1bGxXb3JrRGF5cyAtIGVsaWdpYmxlRGF5cykgKiBhZGpUeXBlLmFtb3VudCxcclxuICAgICAgICAgICAgICAgIGZpbmFsX2Ftb3VudDogYW1vdW50LFxyXG4gICAgICAgICAgICAgICAgcmVhc29uOiBgJHtlbGlnaWJsZURheXN9IG5nw6B5IHggJHthZGpUeXBlLmFtb3VudC50b0xvY2FsZVN0cmluZygpfcSRYCxcclxuICAgICAgICAgICAgICAgIG9jY3VycmVuY2VfY291bnQ6IGVsaWdpYmxlRGF5cyxcclxuICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgLy8gUGjhu6UgY+G6pXAgY+G7kSDEkeG7i25oIChjaHV5w6puIGPhuqduKVxyXG4gICAgICAgICAgaWYgKGFkalR5cGUuY2FsY3VsYXRpb25fdHlwZSA9PT0gXCJmaXhlZFwiKSB7XHJcbiAgICAgICAgICAgIGlmIChydWxlcz8uZnVsbF9kZWR1Y3RfdGhyZXNob2xkICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgICAvLyBDw7MgxJFp4buBdSBraeG7h24gLSBt4bqldCB0b8OgbiBi4buZIG7hur91IHZpIHBo4bqhbSAoxJFpIG114buZbiBob+G6t2Mgbmdo4buJIGtow7RuZyBwaMOpcCBob+G6t2Mga2jDtG5nIHTDrW5oIGPDtG5nKVxyXG4gICAgICAgICAgICAgIGNvbnN0IHNob3VsZERlZHVjdCA9IGxhdGVDb3VudCA+IHJ1bGVzLmZ1bGxfZGVkdWN0X3RocmVzaG9sZCB8fCB1bnBhaWRMZWF2ZURheXMgPiAwIHx8IGFic2VudERheXMgPiAwXHJcbiAgICAgICAgICAgICAgaWYgKCFzaG91bGREZWR1Y3QpIHtcclxuICAgICAgICAgICAgICAgIHRvdGFsQWxsb3dhbmNlcyArPSBhZGpUeXBlLmFtb3VudFxyXG4gICAgICAgICAgICAgICAgYWRqdXN0bWVudERldGFpbHMucHVzaCh7XHJcbiAgICAgICAgICAgICAgICAgIGFkanVzdG1lbnRfdHlwZV9pZDogYWRqVHlwZS5pZCxcclxuICAgICAgICAgICAgICAgICAgY2F0ZWdvcnk6IFwiYWxsb3dhbmNlXCIsXHJcbiAgICAgICAgICAgICAgICAgIGJhc2VfYW1vdW50OiBhZGpUeXBlLmFtb3VudCxcclxuICAgICAgICAgICAgICAgICAgYWRqdXN0ZWRfYW1vdW50OiAwLFxyXG4gICAgICAgICAgICAgICAgICBmaW5hbF9hbW91bnQ6IGFkalR5cGUuYW1vdW50LFxyXG4gICAgICAgICAgICAgICAgICByZWFzb246IFwixJDhu6cgxJFp4buBdSBraeG7h24gY2h1ecOqbiBj4bqnblwiLFxyXG4gICAgICAgICAgICAgICAgICBvY2N1cnJlbmNlX2NvdW50OiAxLFxyXG4gICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgYWRqdXN0bWVudERldGFpbHMucHVzaCh7XHJcbiAgICAgICAgICAgICAgICAgIGFkanVzdG1lbnRfdHlwZV9pZDogYWRqVHlwZS5pZCxcclxuICAgICAgICAgICAgICAgICAgY2F0ZWdvcnk6IFwiYWxsb3dhbmNlXCIsXHJcbiAgICAgICAgICAgICAgICAgIGJhc2VfYW1vdW50OiBhZGpUeXBlLmFtb3VudCxcclxuICAgICAgICAgICAgICAgICAgYWRqdXN0ZWRfYW1vdW50OiBhZGpUeXBlLmFtb3VudCxcclxuICAgICAgICAgICAgICAgICAgZmluYWxfYW1vdW50OiAwLFxyXG4gICAgICAgICAgICAgICAgICByZWFzb246IGBN4bqldCBwaOG7pSBj4bqlcDogxJFpIG114buZbiAke2xhdGVDb3VudH0gbOG6p24sIG5naOG7iSBraMO0bmcgcGjDqXAgJHt1bnBhaWRMZWF2ZURheXN9IG5nw6B5YCxcclxuICAgICAgICAgICAgICAgICAgb2NjdXJyZW5jZV9jb3VudDogMCxcclxuICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgIC8vIEtow7RuZyBjw7MgxJFp4buBdSBraeG7h24gLSBj4buZbmcgdGjhurNuZ1xyXG4gICAgICAgICAgICAgIHRvdGFsQWxsb3dhbmNlcyArPSBhZGpUeXBlLmFtb3VudFxyXG4gICAgICAgICAgICAgIGFkanVzdG1lbnREZXRhaWxzLnB1c2goe1xyXG4gICAgICAgICAgICAgICAgYWRqdXN0bWVudF90eXBlX2lkOiBhZGpUeXBlLmlkLFxyXG4gICAgICAgICAgICAgICAgY2F0ZWdvcnk6IFwiYWxsb3dhbmNlXCIsXHJcbiAgICAgICAgICAgICAgICBiYXNlX2Ftb3VudDogYWRqVHlwZS5hbW91bnQsXHJcbiAgICAgICAgICAgICAgICBhZGp1c3RlZF9hbW91bnQ6IDAsXHJcbiAgICAgICAgICAgICAgICBmaW5hbF9hbW91bnQ6IGFkalR5cGUuYW1vdW50LFxyXG4gICAgICAgICAgICAgICAgcmVhc29uOiBhZGpUeXBlLm5hbWUsXHJcbiAgICAgICAgICAgICAgICBvY2N1cnJlbmNlX2NvdW50OiAxLFxyXG4gICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH1cclxuICAgICAgICAgIGNvbnRpbnVlXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyA9PT09PT09PT09IFBI4bqgVCBU4buwIMSQ4buYTkcgPT09PT09PT09PVxyXG4gICAgICAgIGlmIChhZGpUeXBlLmNhdGVnb3J5ID09PSBcInBlbmFsdHlcIiAmJiBydWxlcz8udHJpZ2dlciA9PT0gXCJsYXRlXCIpIHtcclxuICAgICAgICAgIGNvbnN0IHRocmVzaG9sZE1pbnV0ZXMgPSBydWxlcy5sYXRlX3RocmVzaG9sZF9taW51dGVzIHx8IDMwXHJcbiAgICAgICAgICBjb25zdCBleGVtcHRXaXRoUmVxdWVzdCA9IHJ1bGVzLmV4ZW1wdF93aXRoX3JlcXVlc3QgIT09IGZhbHNlXHJcblxyXG4gICAgICAgICAgY29uc3QgcGVuYWx0eURheXMgPSB2aW9sYXRpb25zLmZpbHRlcigodikgPT4ge1xyXG4gICAgICAgICAgICBpZiAodi5sYXRlTWludXRlcyA8PSB0aHJlc2hvbGRNaW51dGVzKSByZXR1cm4gZmFsc2VcclxuICAgICAgICAgICAgaWYgKGV4ZW1wdFdpdGhSZXF1ZXN0ICYmIHYuaGFzQXBwcm92ZWRSZXF1ZXN0KSByZXR1cm4gZmFsc2VcclxuICAgICAgICAgICAgcmV0dXJuIHRydWVcclxuICAgICAgICAgIH0pXHJcblxyXG4gICAgICAgICAgZm9yIChjb25zdCB2IG9mIHBlbmFsdHlEYXlzKSB7XHJcbiAgICAgICAgICAgIGxldCBwZW5hbHR5QW1vdW50ID0gMFxyXG4gICAgICAgICAgICBpZiAocnVsZXMucGVuYWx0eV90eXBlID09PSBcImhhbGZfZGF5X3NhbGFyeVwiKSB7XHJcbiAgICAgICAgICAgICAgcGVuYWx0eUFtb3VudCA9IGRhaWx5U2FsYXJ5IC8gMlxyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKHJ1bGVzLnBlbmFsdHlfdHlwZSA9PT0gXCJmdWxsX2RheV9zYWxhcnlcIikge1xyXG4gICAgICAgICAgICAgIHBlbmFsdHlBbW91bnQgPSBkYWlseVNhbGFyeVxyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKHJ1bGVzLnBlbmFsdHlfdHlwZSA9PT0gXCJmaXhlZF9hbW91bnRcIikge1xyXG4gICAgICAgICAgICAgIHBlbmFsdHlBbW91bnQgPSBhZGpUeXBlLmFtb3VudFxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB0b3RhbFBlbmFsdGllcyArPSBwZW5hbHR5QW1vdW50XHJcbiAgICAgICAgICAgIGFkanVzdG1lbnREZXRhaWxzLnB1c2goe1xyXG4gICAgICAgICAgICAgIGFkanVzdG1lbnRfdHlwZV9pZDogYWRqVHlwZS5pZCxcclxuICAgICAgICAgICAgICBjYXRlZ29yeTogXCJwZW5hbHR5XCIsXHJcbiAgICAgICAgICAgICAgYmFzZV9hbW91bnQ6IHBlbmFsdHlBbW91bnQsXHJcbiAgICAgICAgICAgICAgYWRqdXN0ZWRfYW1vdW50OiAwLFxyXG4gICAgICAgICAgICAgIGZpbmFsX2Ftb3VudDogcGVuYWx0eUFtb3VudCxcclxuICAgICAgICAgICAgICByZWFzb246IGDEkGkgbXXhu5luICR7di5sYXRlTWludXRlc30gcGjDunQgbmfDoHkgJHt2LmRhdGV9YCxcclxuICAgICAgICAgICAgICBvY2N1cnJlbmNlX2NvdW50OiAxLFxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8vIFjhu60gbMO9IGPDoWMgxJFp4buBdSBjaOG7iW5oIMSRxrDhu6NjIGfDoW4gdGjhu6cgY8O0bmcgY2hvIG5ow6JuIHZpw6puXHJcbiAgICBpZiAoZW1wQWRqdXN0bWVudHMpIHtcclxuICAgICAgZm9yIChjb25zdCBlbXBBZGogb2YgZW1wQWRqdXN0bWVudHMpIHtcclxuICAgICAgICBjb25zdCBhZGpUeXBlID0gZW1wQWRqLmFkanVzdG1lbnRfdHlwZSBhcyBQYXlyb2xsQWRqdXN0bWVudFR5cGVcclxuICAgICAgICBpZiAoIWFkalR5cGUgfHwgYWRqVHlwZS5pc19hdXRvX2FwcGxpZWQpIGNvbnRpbnVlIC8vIELhu48gcXVhIGF1dG8tYXBwbGllZCAoxJHDoyB44butIGzDvSDhu58gdHLDqm4pXHJcblxyXG4gICAgICAgIGNvbnN0IGFtb3VudCA9IGVtcEFkai5jdXN0b21fYW1vdW50IHx8IGFkalR5cGUuYW1vdW50XHJcblxyXG4gICAgICAgIGlmIChhZGpUeXBlLmNhdGVnb3J5ID09PSBcImFsbG93YW5jZVwiKSB7XHJcbiAgICAgICAgICB0b3RhbEFsbG93YW5jZXMgKz0gYW1vdW50XHJcbiAgICAgICAgfSBlbHNlIGlmIChhZGpUeXBlLmNhdGVnb3J5ID09PSBcImRlZHVjdGlvblwiKSB7XHJcbiAgICAgICAgICAvLyBUw61uaCBCSFhIIHRoZW8gJSBsxrDGoW5nIGPGoSBi4bqjblxyXG4gICAgICAgICAgbGV0IGZpbmFsQW1vdW50ID0gYW1vdW50XHJcbiAgICAgICAgICBpZiAoYWRqVHlwZS5hdXRvX3J1bGVzPy5jYWxjdWxhdGVfZnJvbSA9PT0gXCJiYXNlX3NhbGFyeVwiICYmIGFkalR5cGUuYXV0b19ydWxlcz8ucGVyY2VudGFnZSkge1xyXG4gICAgICAgICAgICBmaW5hbEFtb3VudCA9IChiYXNlU2FsYXJ5ICogYWRqVHlwZS5hdXRvX3J1bGVzLnBlcmNlbnRhZ2UpIC8gMTAwXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICB0b3RhbERlZHVjdGlvbnMgKz0gZmluYWxBbW91bnRcclxuICAgICAgICAgIGFkanVzdG1lbnREZXRhaWxzLnB1c2goe1xyXG4gICAgICAgICAgICBhZGp1c3RtZW50X3R5cGVfaWQ6IGFkalR5cGUuaWQsXHJcbiAgICAgICAgICAgIGNhdGVnb3J5OiBcImRlZHVjdGlvblwiLFxyXG4gICAgICAgICAgICBiYXNlX2Ftb3VudDogYW1vdW50LFxyXG4gICAgICAgICAgICBhZGp1c3RlZF9hbW91bnQ6IDAsXHJcbiAgICAgICAgICAgIGZpbmFsX2Ftb3VudDogZmluYWxBbW91bnQsXHJcbiAgICAgICAgICAgIHJlYXNvbjogYWRqVHlwZS5uYW1lLFxyXG4gICAgICAgICAgICBvY2N1cnJlbmNlX2NvdW50OiAxLFxyXG4gICAgICAgICAgfSlcclxuICAgICAgICB9IGVsc2UgaWYgKGFkalR5cGUuY2F0ZWdvcnkgPT09IFwicGVuYWx0eVwiKSB7XHJcbiAgICAgICAgICB0b3RhbFBlbmFsdGllcyArPSBhbW91bnRcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuICAgIC8vIFTDjU5IIEzGr8agTkcgQ1Xhu5BJIEPDmU5HXHJcbiAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuICAgIC8vIGFjdHVhbFdvcmtpbmdEYXlzIMSRw6MgdMOtbmg6IG5nw6B5IMSR4bunICsgMC41ICogbuG7rWEgbmfDoHksIHRy4burIG5nw6B5IGtow7RuZyB0w61uaCBjw7RuZ1xyXG4gICAgY29uc3QgZ3Jvc3NTYWxhcnkgPSBkYWlseVNhbGFyeSAqIGFjdHVhbFdvcmtpbmdEYXlzICsgZGFpbHlTYWxhcnkgKiBsZWF2ZURheXMgKyB0b3RhbEFsbG93YW5jZXNcclxuICAgIGNvbnN0IHRvdGFsRGVkdWN0aW9uID0gZGFpbHlTYWxhcnkgKiB1bnBhaWRMZWF2ZURheXMgKyB0b3RhbERlZHVjdGlvbnMgKyB0b3RhbFBlbmFsdGllc1xyXG4gICAgY29uc3QgbmV0U2FsYXJ5ID0gZ3Jvc3NTYWxhcnkgLSB0b3RhbERlZHVjdGlvblxyXG5cclxuICAgIC8vIFThuqFvIGdoaSBjaMO6IGNoaSB0aeG6v3RcclxuICAgIGxldCBub3RlSXRlbXM6IHN0cmluZ1tdID0gW11cclxuICAgIGlmIChsYXRlQ291bnQgPiAwKSBub3RlSXRlbXMucHVzaChgxJBpIG114buZbjogJHtsYXRlQ291bnR9IGzhuqduYClcclxuICAgIGlmIChoYWxmRGF5cyA+IDApIG5vdGVJdGVtcy5wdXNoKGBO4butYSBuZ8OgeTogJHtoYWxmRGF5c31gKVxyXG4gICAgaWYgKGFic2VudERheXMgPiAwKSBub3RlSXRlbXMucHVzaChgS2jDtG5nIHTDrW5oIGPDtG5nOiAke2Fic2VudERheXN9YClcclxuICAgIGNvbnN0IHBlbmFsdHlDb3VudCA9IGFkanVzdG1lbnREZXRhaWxzLmZpbHRlcihkID0+IGQuY2F0ZWdvcnkgPT09ICdwZW5hbHR5JykubGVuZ3RoXHJcbiAgICBpZiAocGVuYWx0eUNvdW50ID4gMCkgbm90ZUl0ZW1zLnB1c2goYFBo4bqhdDogJHtwZW5hbHR5Q291bnR9IGzhuqduYClcclxuXHJcbiAgICAvLyBJbnNlcnQgcGF5cm9sbCBpdGVtXHJcbiAgICBjb25zdCB7IGRhdGE6IHBheXJvbGxJdGVtLCBlcnJvcjogaW5zZXJ0RXJyb3IgfSA9IGF3YWl0IHN1cGFiYXNlXHJcbiAgICAgIC5mcm9tKFwicGF5cm9sbF9pdGVtc1wiKVxyXG4gICAgICAuaW5zZXJ0KHtcclxuICAgICAgICBwYXlyb2xsX3J1bl9pZDogcnVuLmlkLFxyXG4gICAgICAgIGVtcGxveWVlX2lkOiBlbXAuaWQsXHJcbiAgICAgICAgd29ya2luZ19kYXlzOiBhY3R1YWxXb3JraW5nRGF5cyxcclxuICAgICAgICBsZWF2ZV9kYXlzOiBsZWF2ZURheXMsXHJcbiAgICAgICAgdW5wYWlkX2xlYXZlX2RheXM6IHVucGFpZExlYXZlRGF5cyArIGFic2VudERheXMsIC8vIEPhu5luZyB0aMOqbSBuZ8OgeSBraMO0bmcgdMOtbmggY8O0bmdcclxuICAgICAgICBiYXNlX3NhbGFyeTogYmFzZVNhbGFyeSxcclxuICAgICAgICBhbGxvd2FuY2VzOiB0b3RhbEFsbG93YW5jZXMsXHJcbiAgICAgICAgdG90YWxfaW5jb21lOiBncm9zc1NhbGFyeSxcclxuICAgICAgICB0b3RhbF9kZWR1Y3Rpb246IHRvdGFsRGVkdWN0aW9uLFxyXG4gICAgICAgIG5ldF9zYWxhcnk6IG5ldFNhbGFyeSxcclxuICAgICAgICBub3RlOiBub3RlSXRlbXMuam9pbihcIiwgXCIpIHx8IG51bGwsXHJcbiAgICAgIH0pXHJcbiAgICAgIC5zZWxlY3QoKVxyXG4gICAgICAuc2luZ2xlKClcclxuXHJcbiAgICBpZiAoaW5zZXJ0RXJyb3IpIHtcclxuICAgICAgY29uc29sZS5lcnJvcihgRXJyb3IgaW5zZXJ0aW5nIHBheXJvbGwgaXRlbSBmb3IgJHtlbXAuZnVsbF9uYW1lfTpgLCBpbnNlcnRFcnJvcilcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHByb2Nlc3NlZENvdW50KytcclxuXHJcbiAgICAgIC8vIEluc2VydCBhZGp1c3RtZW50IGRldGFpbHNcclxuICAgICAgaWYgKHBheXJvbGxJdGVtICYmIGFkanVzdG1lbnREZXRhaWxzLmxlbmd0aCA+IDApIHtcclxuICAgICAgICBjb25zdCBkZXRhaWxzV2l0aEl0ZW1JZCA9IGFkanVzdG1lbnREZXRhaWxzLm1hcCgoZCkgPT4gKHtcclxuICAgICAgICAgIC4uLmQsXHJcbiAgICAgICAgICBwYXlyb2xsX2l0ZW1faWQ6IHBheXJvbGxJdGVtLmlkLFxyXG4gICAgICAgIH0pKVxyXG4gICAgICAgIGF3YWl0IHN1cGFiYXNlLmZyb20oXCJwYXlyb2xsX2FkanVzdG1lbnRfZGV0YWlsc1wiKS5pbnNlcnQoZGV0YWlsc1dpdGhJdGVtSWQpXHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcblxyXG4gIHJldmFsaWRhdGVQYXRoKFwiL2Rhc2hib2FyZC9wYXlyb2xsXCIpXHJcbiAgcmV0dXJuIHsgc3VjY2VzczogdHJ1ZSwgZGF0YTogcnVuLCBtZXNzYWdlOiBgxJDDoyB04bqhbyBi4bqjbmcgbMawxqFuZyBjaG8gJHtwcm9jZXNzZWRDb3VudH0gbmjDom4gdmnDqm5gIH1cclxufVxyXG5cclxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcbi8vIEhSIEFDVElPTlMgLSBMT0NLL1VOTE9DSyBQQVlST0xMXHJcbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGxvY2tQYXlyb2xsKGlkOiBzdHJpbmcpIHtcclxuICBjb25zdCBzdXBhYmFzZSA9IGF3YWl0IGNyZWF0ZUNsaWVudCgpXHJcblxyXG4gIGNvbnN0IHsgZXJyb3IgfSA9IGF3YWl0IHN1cGFiYXNlXHJcbiAgICAuZnJvbShcInBheXJvbGxfcnVuc1wiKVxyXG4gICAgLnVwZGF0ZSh7IHN0YXR1czogXCJsb2NrZWRcIiB9KVxyXG4gICAgLmVxKFwiaWRcIiwgaWQpXHJcbiAgICAuZXEoXCJzdGF0dXNcIiwgXCJkcmFmdFwiKVxyXG5cclxuICBpZiAoZXJyb3IpIHtcclxuICAgIGNvbnNvbGUuZXJyb3IoXCJFcnJvciBsb2NraW5nIHBheXJvbGw6XCIsIGVycm9yKVxyXG4gICAgcmV0dXJuIHsgc3VjY2VzczogZmFsc2UsIGVycm9yOiBlcnJvci5tZXNzYWdlIH1cclxuICB9XHJcblxyXG4gIHJldmFsaWRhdGVQYXRoKFwiL2Rhc2hib2FyZC9wYXlyb2xsXCIpXHJcbiAgcmV0dXJuIHsgc3VjY2VzczogdHJ1ZSB9XHJcbn1cclxuXHJcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBtYXJrUGF5cm9sbFBhaWQoaWQ6IHN0cmluZykge1xyXG4gIGNvbnN0IHN1cGFiYXNlID0gYXdhaXQgY3JlYXRlQ2xpZW50KClcclxuXHJcbiAgY29uc3QgeyBlcnJvciB9ID0gYXdhaXQgc3VwYWJhc2VcclxuICAgIC5mcm9tKFwicGF5cm9sbF9ydW5zXCIpXHJcbiAgICAudXBkYXRlKHsgc3RhdHVzOiBcInBhaWRcIiB9KVxyXG4gICAgLmVxKFwiaWRcIiwgaWQpXHJcbiAgICAuZXEoXCJzdGF0dXNcIiwgXCJsb2NrZWRcIilcclxuXHJcbiAgaWYgKGVycm9yKSB7XHJcbiAgICBjb25zb2xlLmVycm9yKFwiRXJyb3IgbWFya2luZyBwYXlyb2xsIGFzIHBhaWQ6XCIsIGVycm9yKVxyXG4gICAgcmV0dXJuIHsgc3VjY2VzczogZmFsc2UsIGVycm9yOiBlcnJvci5tZXNzYWdlIH1cclxuICB9XHJcblxyXG4gIHJldmFsaWRhdGVQYXRoKFwiL2Rhc2hib2FyZC9wYXlyb2xsXCIpXHJcbiAgcmV0dXJuIHsgc3VjY2VzczogdHJ1ZSB9XHJcbn1cclxuXHJcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBkZWxldGVQYXlyb2xsUnVuKGlkOiBzdHJpbmcpIHtcclxuICBjb25zdCBzdXBhYmFzZSA9IGF3YWl0IGNyZWF0ZUNsaWVudCgpXHJcblxyXG4gIC8vIENo4buJIHjDs2EgxJHGsOG7o2MgZHJhZnRcclxuICBjb25zdCB7IGVycm9yIH0gPSBhd2FpdCBzdXBhYmFzZVxyXG4gICAgLmZyb20oXCJwYXlyb2xsX3J1bnNcIilcclxuICAgIC5kZWxldGUoKVxyXG4gICAgLmVxKFwiaWRcIiwgaWQpXHJcbiAgICAuZXEoXCJzdGF0dXNcIiwgXCJkcmFmdFwiKVxyXG5cclxuICBpZiAoZXJyb3IpIHtcclxuICAgIGNvbnNvbGUuZXJyb3IoXCJFcnJvciBkZWxldGluZyBwYXlyb2xsIHJ1bjpcIiwgZXJyb3IpXHJcbiAgICByZXR1cm4geyBzdWNjZXNzOiBmYWxzZSwgZXJyb3I6IGVycm9yLm1lc3NhZ2UgfVxyXG4gIH1cclxuXHJcbiAgcmV2YWxpZGF0ZVBhdGgoXCIvZGFzaGJvYXJkL3BheXJvbGxcIilcclxuICByZXR1cm4geyBzdWNjZXNzOiB0cnVlIH1cclxufVxyXG5cclxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcbi8vIEhSIEFDVElPTlMgLSBTQUxBUlkgU1RSVUNUVVJFXHJcbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGxpc3RTYWxhcnlTdHJ1Y3R1cmUoXHJcbiAgZW1wbG95ZWVfaWQ6IHN0cmluZ1xyXG4pOiBQcm9taXNlPFNhbGFyeVN0cnVjdHVyZVtdPiB7XHJcbiAgY29uc3Qgc3VwYWJhc2UgPSBhd2FpdCBjcmVhdGVDbGllbnQoKVxyXG5cclxuICBjb25zdCB7IGRhdGEsIGVycm9yIH0gPSBhd2FpdCBzdXBhYmFzZVxyXG4gICAgLmZyb20oXCJzYWxhcnlfc3RydWN0dXJlXCIpXHJcbiAgICAuc2VsZWN0KFwiKlwiKVxyXG4gICAgLmVxKFwiZW1wbG95ZWVfaWRcIiwgZW1wbG95ZWVfaWQpXHJcbiAgICAub3JkZXIoXCJlZmZlY3RpdmVfZGF0ZVwiLCB7IGFzY2VuZGluZzogZmFsc2UgfSlcclxuXHJcbiAgaWYgKGVycm9yKSB7XHJcbiAgICBjb25zb2xlLmVycm9yKFwiRXJyb3IgbGlzdGluZyBzYWxhcnkgc3RydWN0dXJlOlwiLCBlcnJvcilcclxuICAgIHJldHVybiBbXVxyXG4gIH1cclxuXHJcbiAgcmV0dXJuIGRhdGEgfHwgW11cclxufVxyXG5cclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGNyZWF0ZVNhbGFyeVN0cnVjdHVyZShpbnB1dDoge1xyXG4gIGVtcGxveWVlX2lkOiBzdHJpbmdcclxuICBiYXNlX3NhbGFyeTogbnVtYmVyXHJcbiAgYWxsb3dhbmNlPzogbnVtYmVyXHJcbiAgZWZmZWN0aXZlX2RhdGU6IHN0cmluZ1xyXG4gIG5vdGU/OiBzdHJpbmdcclxufSkge1xyXG4gIGNvbnN0IHN1cGFiYXNlID0gYXdhaXQgY3JlYXRlQ2xpZW50KClcclxuXHJcbiAgY29uc3QgeyBlcnJvciB9ID0gYXdhaXQgc3VwYWJhc2UuZnJvbShcInNhbGFyeV9zdHJ1Y3R1cmVcIikuaW5zZXJ0KHtcclxuICAgIGVtcGxveWVlX2lkOiBpbnB1dC5lbXBsb3llZV9pZCxcclxuICAgIGJhc2Vfc2FsYXJ5OiBpbnB1dC5iYXNlX3NhbGFyeSxcclxuICAgIGFsbG93YW5jZTogaW5wdXQuYWxsb3dhbmNlIHx8IDAsXHJcbiAgICBlZmZlY3RpdmVfZGF0ZTogaW5wdXQuZWZmZWN0aXZlX2RhdGUsXHJcbiAgICBub3RlOiBpbnB1dC5ub3RlLFxyXG4gIH0pXHJcblxyXG4gIGlmIChlcnJvcikge1xyXG4gICAgY29uc29sZS5lcnJvcihcIkVycm9yIGNyZWF0aW5nIHNhbGFyeSBzdHJ1Y3R1cmU6XCIsIGVycm9yKVxyXG4gICAgcmV0dXJuIHsgc3VjY2VzczogZmFsc2UsIGVycm9yOiBlcnJvci5tZXNzYWdlIH1cclxuICB9XHJcblxyXG4gIHJldmFsaWRhdGVQYXRoKFwiL2Rhc2hib2FyZC9lbXBsb3llZXNcIilcclxuICByZXR1cm4geyBzdWNjZXNzOiB0cnVlIH1cclxufVxyXG5cclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGdldE15U2FsYXJ5KCk6IFByb21pc2U8U2FsYXJ5U3RydWN0dXJlIHwgbnVsbD4ge1xyXG4gIGNvbnN0IHN1cGFiYXNlID0gYXdhaXQgY3JlYXRlQ2xpZW50KClcclxuXHJcbiAgY29uc3Qge1xyXG4gICAgZGF0YTogeyB1c2VyIH0sXHJcbiAgfSA9IGF3YWl0IHN1cGFiYXNlLmF1dGguZ2V0VXNlcigpXHJcbiAgaWYgKCF1c2VyKSByZXR1cm4gbnVsbFxyXG5cclxuICBjb25zdCB7IGRhdGE6IGVtcGxveWVlIH0gPSBhd2FpdCBzdXBhYmFzZVxyXG4gICAgLmZyb20oXCJlbXBsb3llZXNcIilcclxuICAgIC5zZWxlY3QoXCJpZFwiKVxyXG4gICAgLmVxKFwidXNlcl9pZFwiLCB1c2VyLmlkKVxyXG4gICAgLnNpbmdsZSgpXHJcblxyXG4gIGlmICghZW1wbG95ZWUpIHJldHVybiBudWxsXHJcblxyXG4gIGNvbnN0IHsgZGF0YSB9ID0gYXdhaXQgc3VwYWJhc2VcclxuICAgIC5mcm9tKFwic2FsYXJ5X3N0cnVjdHVyZVwiKVxyXG4gICAgLnNlbGVjdChcIipcIilcclxuICAgIC5lcShcImVtcGxveWVlX2lkXCIsIGVtcGxveWVlLmlkKVxyXG4gICAgLm9yZGVyKFwiZWZmZWN0aXZlX2RhdGVcIiwgeyBhc2NlbmRpbmc6IGZhbHNlIH0pXHJcbiAgICAubGltaXQoMSlcclxuICAgIC5zaW5nbGUoKVxyXG5cclxuICByZXR1cm4gZGF0YSB8fCBudWxsXHJcbn1cclxuXHJcbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG4vLyBQQVlST0xMIEFESlVTVE1FTlQgREVUQUlMU1xyXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHJcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBnZXRQYXlyb2xsQWRqdXN0bWVudERldGFpbHMocGF5cm9sbF9pdGVtX2lkOiBzdHJpbmcpIHtcclxuICBjb25zdCBzdXBhYmFzZSA9IGF3YWl0IGNyZWF0ZUNsaWVudCgpXHJcblxyXG4gIGNvbnN0IHsgZGF0YSwgZXJyb3IgfSA9IGF3YWl0IHN1cGFiYXNlXHJcbiAgICAuZnJvbShcInBheXJvbGxfYWRqdXN0bWVudF9kZXRhaWxzXCIpXHJcbiAgICAuc2VsZWN0KGBcclxuICAgICAgKixcclxuICAgICAgYWRqdXN0bWVudF90eXBlOnBheXJvbGxfYWRqdXN0bWVudF90eXBlcyhpZCwgbmFtZSwgY29kZSwgY2F0ZWdvcnkpXHJcbiAgICBgKVxyXG4gICAgLmVxKFwicGF5cm9sbF9pdGVtX2lkXCIsIHBheXJvbGxfaXRlbV9pZClcclxuICAgIC5vcmRlcihcImNhdGVnb3J5XCIpXHJcblxyXG4gIGlmIChlcnJvcikge1xyXG4gICAgY29uc29sZS5lcnJvcihcIkVycm9yIGZldGNoaW5nIGFkanVzdG1lbnQgZGV0YWlsczpcIiwgZXJyb3IpXHJcbiAgICByZXR1cm4gW11cclxuICB9XHJcblxyXG4gIHJldHVybiBkYXRhIHx8IFtdXHJcbn1cclxuIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJtVEFrdkJzQiJ9
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/utils/format-utils.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Format số tiền theo định dạng VND
 */ __turbopack_context__.s([
    "formatCurrency",
    ()=>formatCurrency,
    "formatNumber",
    ()=>formatNumber,
    "parseNumber",
    ()=>parseNumber
]);
function formatCurrency(amount) {
    if (amount === null || amount === undefined) return "0 ₫";
    return new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
        maximumFractionDigits: 0
    }).format(amount);
}
function formatNumber(num) {
    if (num === null || num === undefined) return "0";
    return new Intl.NumberFormat("vi-VN").format(num);
}
function parseNumber(str) {
    return Number(str.replace(/[^\d.-]/g, "")) || 0;
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/payroll/payroll-breakdown-dialog.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "PayrollBreakdownDialog",
    ()=>PayrollBreakdownDialog
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.10_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.10_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/dialog.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$separator$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/separator.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$actions$2f$data$3a$496743__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$text$2f$javascript$3e$__ = __turbopack_context__.i("[project]/lib/actions/data:496743 [app-client] (ecmascript) <text/javascript>");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2f$format$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/utils/format-utils.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$454$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.454.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/loader-circle.js [app-client] (ecmascript) <export default as Loader2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$454$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trending$2d$up$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__TrendingUp$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.454.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/trending-up.js [app-client] (ecmascript) <export default as TrendingUp>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$454$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trending$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__TrendingDown$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.454.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/trending-down.js [app-client] (ecmascript) <export default as TrendingDown>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$454$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$triangle$2d$alert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertTriangle$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.454.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/triangle-alert.js [app-client] (ecmascript) <export default as AlertTriangle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$454$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$wallet$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Wallet$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.454.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/wallet.js [app-client] (ecmascript) <export default as Wallet>");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
;
function PayrollBreakdownDialog({ open, onOpenChange, payrollItem, standardWorkingDays = 26 }) {
    _s();
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [details, setDetails] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "PayrollBreakdownDialog.useEffect": ()=>{
            if (open && payrollItem) {
                loadDetails();
            }
        }
    }["PayrollBreakdownDialog.useEffect"], [
        open,
        payrollItem
    ]);
    const loadDetails = async ()=>{
        if (!payrollItem) return;
        setLoading(true);
        const data = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$actions$2f$data$3a$496743__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$text$2f$javascript$3e$__["getPayrollAdjustmentDetails"])(payrollItem.id);
        setDetails(data);
        setLoading(false);
    };
    if (!payrollItem) return null;
    const dailySalary = (payrollItem.base_salary || 0) / standardWorkingDays;
    const workingSalary = dailySalary * (payrollItem.working_days || 0);
    const leaveSalary = dailySalary * (payrollItem.leave_days || 0);
    const unpaidDeduction = dailySalary * (payrollItem.unpaid_leave_days || 0);
    const allowances = details.filter((d)=>d.category === "allowance");
    const deductions = details.filter((d)=>d.category === "deduction");
    const penalties = details.filter((d)=>d.category === "penalty");
    const totalAllowanceFromDetails = allowances.reduce((sum, d)=>sum + d.final_amount, 0);
    const totalDeductionFromDetails = deductions.reduce((sum, d)=>sum + d.final_amount, 0);
    const totalPenaltyFromDetails = penalties.reduce((sum, d)=>sum + d.final_amount, 0);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Dialog"], {
        open: open,
        onOpenChange: onOpenChange,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DialogContent"], {
            className: "max-w-2xl max-h-[90vh] overflow-y-auto",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DialogHeader"], {
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DialogTitle"], {
                            className: "flex items-center gap-2",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$454$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$wallet$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Wallet$3e$__["Wallet"], {
                                    className: "h-5 w-5"
                                }, void 0, false, {
                                    fileName: "[project]/components/payroll/payroll-breakdown-dialog.tsx",
                                    lineNumber: 84,
                                    columnNumber: 13
                                }, this),
                                "Chi tiết cơ cấu lương"
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/payroll/payroll-breakdown-dialog.tsx",
                            lineNumber: 83,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DialogDescription"], {
                            children: [
                                payrollItem.employee?.full_name,
                                " - ",
                                payrollItem.employee?.employee_code
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/payroll/payroll-breakdown-dialog.tsx",
                            lineNumber: 87,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/payroll/payroll-breakdown-dialog.tsx",
                    lineNumber: 82,
                    columnNumber: 9
                }, this),
                loading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex items-center justify-center py-8",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$454$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__["Loader2"], {
                        className: "h-6 w-6 animate-spin"
                    }, void 0, false, {
                        fileName: "[project]/components/payroll/payroll-breakdown-dialog.tsx",
                        lineNumber: 94,
                        columnNumber: 13
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/components/payroll/payroll-breakdown-dialog.tsx",
                    lineNumber: 93,
                    columnNumber: 11
                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "space-y-6",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "grid grid-cols-3 gap-4 p-4 bg-muted/50 rounded-lg",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-sm text-muted-foreground",
                                            children: "Lương cơ bản"
                                        }, void 0, false, {
                                            fileName: "[project]/components/payroll/payroll-breakdown-dialog.tsx",
                                            lineNumber: 101,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "font-semibold",
                                            children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2f$format$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatCurrency"])(payrollItem.base_salary)
                                        }, void 0, false, {
                                            fileName: "[project]/components/payroll/payroll-breakdown-dialog.tsx",
                                            lineNumber: 102,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/payroll/payroll-breakdown-dialog.tsx",
                                    lineNumber: 100,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-sm text-muted-foreground",
                                            children: "Lương ngày"
                                        }, void 0, false, {
                                            fileName: "[project]/components/payroll/payroll-breakdown-dialog.tsx",
                                            lineNumber: 105,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "font-semibold",
                                            children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2f$format$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatCurrency"])(dailySalary)
                                        }, void 0, false, {
                                            fileName: "[project]/components/payroll/payroll-breakdown-dialog.tsx",
                                            lineNumber: 106,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/payroll/payroll-breakdown-dialog.tsx",
                                    lineNumber: 104,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-sm text-muted-foreground",
                                            children: "Công chuẩn"
                                        }, void 0, false, {
                                            fileName: "[project]/components/payroll/payroll-breakdown-dialog.tsx",
                                            lineNumber: 109,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "font-semibold",
                                            children: [
                                                standardWorkingDays,
                                                " ngày"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/payroll/payroll-breakdown-dialog.tsx",
                                            lineNumber: 110,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/payroll/payroll-breakdown-dialog.tsx",
                                    lineNumber: 108,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/payroll/payroll-breakdown-dialog.tsx",
                            lineNumber: 99,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                    className: "font-medium flex items-center gap-2 mb-3",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$454$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trending$2d$up$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__TrendingUp$3e$__["TrendingUp"], {
                                            className: "h-4 w-4 text-green-600"
                                        }, void 0, false, {
                                            fileName: "[project]/components/payroll/payroll-breakdown-dialog.tsx",
                                            lineNumber: 117,
                                            columnNumber: 17
                                        }, this),
                                        "Thu nhập"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/payroll/payroll-breakdown-dialog.tsx",
                                    lineNumber: 116,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "space-y-2 pl-6",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex justify-between text-sm",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    children: [
                                                        "Lương theo ngày công (",
                                                        payrollItem.working_days,
                                                        " ngày)"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/components/payroll/payroll-breakdown-dialog.tsx",
                                                    lineNumber: 122,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "font-medium text-green-600",
                                                    children: [
                                                        "+",
                                                        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2f$format$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatCurrency"])(workingSalary)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/components/payroll/payroll-breakdown-dialog.tsx",
                                                    lineNumber: 123,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/payroll/payroll-breakdown-dialog.tsx",
                                            lineNumber: 121,
                                            columnNumber: 17
                                        }, this),
                                        (payrollItem.leave_days || 0) > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex justify-between text-sm",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    children: [
                                                        "Lương nghỉ phép có lương (",
                                                        payrollItem.leave_days,
                                                        " ngày)"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/components/payroll/payroll-breakdown-dialog.tsx",
                                                    lineNumber: 127,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "font-medium text-green-600",
                                                    children: [
                                                        "+",
                                                        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2f$format$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatCurrency"])(leaveSalary)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/components/payroll/payroll-breakdown-dialog.tsx",
                                                    lineNumber: 128,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/payroll/payroll-breakdown-dialog.tsx",
                                            lineNumber: 126,
                                            columnNumber: 19
                                        }, this),
                                        allowances.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$separator$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Separator"], {
                                                    className: "my-2"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/payroll/payroll-breakdown-dialog.tsx",
                                                    lineNumber: 135,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-xs text-muted-foreground font-medium",
                                                    children: "Phụ cấp:"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/payroll/payroll-breakdown-dialog.tsx",
                                                    lineNumber: 136,
                                                    columnNumber: 21
                                                }, this),
                                                allowances.map((item)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex justify-between text-sm",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "flex items-center gap-2",
                                                                children: [
                                                                    item.adjustment_type?.name || "Phụ cấp",
                                                                    item.reason && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        className: "text-xs text-muted-foreground",
                                                                        children: [
                                                                            "(",
                                                                            item.reason,
                                                                            ")"
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/components/payroll/payroll-breakdown-dialog.tsx",
                                                                        lineNumber: 142,
                                                                        columnNumber: 29
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/components/payroll/payroll-breakdown-dialog.tsx",
                                                                lineNumber: 139,
                                                                columnNumber: 25
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "font-medium text-green-600",
                                                                children: [
                                                                    "+",
                                                                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2f$format$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatCurrency"])(item.final_amount)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/components/payroll/payroll-breakdown-dialog.tsx",
                                                                lineNumber: 145,
                                                                columnNumber: 25
                                                            }, this)
                                                        ]
                                                    }, item.id, true, {
                                                        fileName: "[project]/components/payroll/payroll-breakdown-dialog.tsx",
                                                        lineNumber: 138,
                                                        columnNumber: 23
                                                    }, this))
                                            ]
                                        }, void 0, true),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$separator$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Separator"], {
                                            className: "my-2"
                                        }, void 0, false, {
                                            fileName: "[project]/components/payroll/payroll-breakdown-dialog.tsx",
                                            lineNumber: 153,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex justify-between font-medium",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    children: "Tổng thu nhập"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/payroll/payroll-breakdown-dialog.tsx",
                                                    lineNumber: 155,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "text-blue-600",
                                                    children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2f$format$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatCurrency"])(payrollItem.total_income)
                                                }, void 0, false, {
                                                    fileName: "[project]/components/payroll/payroll-breakdown-dialog.tsx",
                                                    lineNumber: 156,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/payroll/payroll-breakdown-dialog.tsx",
                                            lineNumber: 154,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/payroll/payroll-breakdown-dialog.tsx",
                                    lineNumber: 120,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/payroll/payroll-breakdown-dialog.tsx",
                            lineNumber: 115,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                    className: "font-medium flex items-center gap-2 mb-3",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$454$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trending$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__TrendingDown$3e$__["TrendingDown"], {
                                            className: "h-4 w-4 text-red-600"
                                        }, void 0, false, {
                                            fileName: "[project]/components/payroll/payroll-breakdown-dialog.tsx",
                                            lineNumber: 164,
                                            columnNumber: 17
                                        }, this),
                                        "Khấu trừ"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/payroll/payroll-breakdown-dialog.tsx",
                                    lineNumber: 163,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "space-y-2 pl-6",
                                    children: [
                                        (payrollItem.unpaid_leave_days || 0) > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex justify-between text-sm",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    children: [
                                                        "Nghỉ không lương (",
                                                        payrollItem.unpaid_leave_days,
                                                        " ngày)"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/components/payroll/payroll-breakdown-dialog.tsx",
                                                    lineNumber: 170,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "font-medium text-red-600",
                                                    children: [
                                                        "-",
                                                        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2f$format$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatCurrency"])(unpaidDeduction)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/components/payroll/payroll-breakdown-dialog.tsx",
                                                    lineNumber: 171,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/payroll/payroll-breakdown-dialog.tsx",
                                            lineNumber: 169,
                                            columnNumber: 19
                                        }, this),
                                        deductions.map((item)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex justify-between text-sm",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        children: item.adjustment_type?.name || "Khấu trừ"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/payroll/payroll-breakdown-dialog.tsx",
                                                        lineNumber: 178,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "font-medium text-red-600",
                                                        children: [
                                                            "-",
                                                            (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2f$format$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatCurrency"])(item.final_amount)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/components/payroll/payroll-breakdown-dialog.tsx",
                                                        lineNumber: 179,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, item.id, true, {
                                                fileName: "[project]/components/payroll/payroll-breakdown-dialog.tsx",
                                                lineNumber: 177,
                                                columnNumber: 19
                                            }, this)),
                                        penalties.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$separator$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Separator"], {
                                                    className: "my-2"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/payroll/payroll-breakdown-dialog.tsx",
                                                    lineNumber: 188,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-xs text-muted-foreground font-medium flex items-center gap-1",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$454$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$triangle$2d$alert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertTriangle$3e$__["AlertTriangle"], {
                                                            className: "h-3 w-3"
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/payroll/payroll-breakdown-dialog.tsx",
                                                            lineNumber: 190,
                                                            columnNumber: 23
                                                        }, this),
                                                        "Tiền phạt:"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/components/payroll/payroll-breakdown-dialog.tsx",
                                                    lineNumber: 189,
                                                    columnNumber: 21
                                                }, this),
                                                penalties.map((item)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex justify-between text-sm",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "flex items-center gap-2",
                                                                children: [
                                                                    item.adjustment_type?.name || "Phạt",
                                                                    item.reason && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        className: "text-xs text-muted-foreground",
                                                                        children: [
                                                                            "(",
                                                                            item.reason,
                                                                            ")"
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/components/payroll/payroll-breakdown-dialog.tsx",
                                                                        lineNumber: 198,
                                                                        columnNumber: 29
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/components/payroll/payroll-breakdown-dialog.tsx",
                                                                lineNumber: 195,
                                                                columnNumber: 25
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "font-medium text-red-600",
                                                                children: [
                                                                    "-",
                                                                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2f$format$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatCurrency"])(item.final_amount)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/components/payroll/payroll-breakdown-dialog.tsx",
                                                                lineNumber: 201,
                                                                columnNumber: 25
                                                            }, this)
                                                        ]
                                                    }, item.id, true, {
                                                        fileName: "[project]/components/payroll/payroll-breakdown-dialog.tsx",
                                                        lineNumber: 194,
                                                        columnNumber: 23
                                                    }, this))
                                            ]
                                        }, void 0, true),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$separator$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Separator"], {
                                            className: "my-2"
                                        }, void 0, false, {
                                            fileName: "[project]/components/payroll/payroll-breakdown-dialog.tsx",
                                            lineNumber: 209,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex justify-between font-medium",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    children: "Tổng khấu trừ"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/payroll/payroll-breakdown-dialog.tsx",
                                                    lineNumber: 211,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "text-red-600",
                                                    children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2f$format$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatCurrency"])(payrollItem.total_deduction)
                                                }, void 0, false, {
                                                    fileName: "[project]/components/payroll/payroll-breakdown-dialog.tsx",
                                                    lineNumber: 212,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/payroll/payroll-breakdown-dialog.tsx",
                                            lineNumber: 210,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/payroll/payroll-breakdown-dialog.tsx",
                                    lineNumber: 167,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/payroll/payroll-breakdown-dialog.tsx",
                            lineNumber: 162,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "p-4 bg-green-50 rounded-lg border border-green-200",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex justify-between items-center",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "font-medium text-green-800",
                                            children: "THỰC LĨNH"
                                        }, void 0, false, {
                                            fileName: "[project]/components/payroll/payroll-breakdown-dialog.tsx",
                                            lineNumber: 220,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "text-2xl font-bold text-green-600",
                                            children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2f$format$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatCurrency"])(payrollItem.net_salary)
                                        }, void 0, false, {
                                            fileName: "[project]/components/payroll/payroll-breakdown-dialog.tsx",
                                            lineNumber: 221,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/payroll/payroll-breakdown-dialog.tsx",
                                    lineNumber: 219,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-xs text-green-600 mt-1",
                                    children: [
                                        "= Thu nhập (",
                                        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2f$format$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatCurrency"])(payrollItem.total_income),
                                        ") - Khấu trừ (",
                                        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2f$format$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatCurrency"])(payrollItem.total_deduction),
                                        ")"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/payroll/payroll-breakdown-dialog.tsx",
                                    lineNumber: 225,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/payroll/payroll-breakdown-dialog.tsx",
                            lineNumber: 218,
                            columnNumber: 13
                        }, this),
                        payrollItem.note && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "p-3 bg-amber-50 rounded-lg border border-amber-200",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-sm text-amber-800",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "font-medium",
                                        children: "Ghi chú:"
                                    }, void 0, false, {
                                        fileName: "[project]/components/payroll/payroll-breakdown-dialog.tsx",
                                        lineNumber: 234,
                                        columnNumber: 19
                                    }, this),
                                    " ",
                                    payrollItem.note
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/payroll/payroll-breakdown-dialog.tsx",
                                lineNumber: 233,
                                columnNumber: 17
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/components/payroll/payroll-breakdown-dialog.tsx",
                            lineNumber: 232,
                            columnNumber: 15
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/payroll/payroll-breakdown-dialog.tsx",
                    lineNumber: 97,
                    columnNumber: 11
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/components/payroll/payroll-breakdown-dialog.tsx",
            lineNumber: 81,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/components/payroll/payroll-breakdown-dialog.tsx",
        lineNumber: 80,
        columnNumber: 5
    }, this);
}
_s(PayrollBreakdownDialog, "aHMBFiaaEvn8tXf/zKO5ueqqsds=");
_c = PayrollBreakdownDialog;
var _c;
__turbopack_context__.k.register(_c, "PayrollBreakdownDialog");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/payroll/payroll-detail-panel.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "PayrollDetailPanel",
    ()=>PayrollDetailPanel
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.10_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.10_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.0.10_react-dom@19.2.0_react@19.2.0__react@19.2.0/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/button.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/card.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/table.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/badge.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$actions$2f$data$3a$b02214__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$text$2f$javascript$3e$__ = __turbopack_context__.i("[project]/lib/actions/data:b02214 [app-client] (ecmascript) <text/javascript>");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$actions$2f$data$3a$bd8f6d__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$text$2f$javascript$3e$__ = __turbopack_context__.i("[project]/lib/actions/data:bd8f6d [app-client] (ecmascript) <text/javascript>");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$payroll$2f$payroll$2d$breakdown$2d$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/payroll/payroll-breakdown-dialog.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2f$format$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/utils/format-utils.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$454$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$left$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowLeft$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.454.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/arrow-left.js [app-client] (ecmascript) <export default as ArrowLeft>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$454$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$lock$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Lock$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.454.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/lock.js [app-client] (ecmascript) <export default as Lock>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$454$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2d$big$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.454.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/circle-check-big.js [app-client] (ecmascript) <export default as CheckCircle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$454$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$users$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Users$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.454.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/users.js [app-client] (ecmascript) <export default as Users>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$454$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$wallet$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Wallet$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.454.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/wallet.js [app-client] (ecmascript) <export default as Wallet>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$454$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$calculator$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Calculator$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.454.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/calculator.js [app-client] (ecmascript) <export default as Calculator>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$454$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$eye$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Eye$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lucide-react@0.454.0_react@19.2.0/node_modules/lucide-react/dist/esm/icons/eye.js [app-client] (ecmascript) <export default as Eye>");
;
var _s = __turbopack_context__.k.signature();
"use client";
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
const STANDARD_WORKING_DAYS = 26;
function PayrollDetailPanel({ payrollRun, payrollItems }) {
    _s();
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [selectedItem, setSelectedItem] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [showBreakdown, setShowBreakdown] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const handleLock = async ()=>{
        if (!confirm("Sau khi khóa sẽ không thể chỉnh sửa. Bạn có chắc?")) return;
        setLoading("lock");
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$actions$2f$data$3a$b02214__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$text$2f$javascript$3e$__["lockPayroll"])(payrollRun.id);
        setLoading(null);
    };
    const handleMarkPaid = async ()=>{
        if (!confirm("Xác nhận đã thanh toán lương?")) return;
        setLoading("paid");
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$actions$2f$data$3a$bd8f6d__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$text$2f$javascript$3e$__["markPayrollPaid"])(payrollRun.id);
        setLoading(null);
    };
    const getStatusBadge = (status)=>{
        switch(status){
            case "locked":
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Badge"], {
                    className: "bg-blue-100 text-blue-800",
                    children: "🔒 Đã khóa"
                }, void 0, false, {
                    fileName: "[project]/components/payroll/payroll-detail-panel.tsx",
                    lineNumber: 44,
                    columnNumber: 16
                }, this);
            case "paid":
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Badge"], {
                    className: "bg-green-100 text-green-800",
                    children: "✅ Đã trả"
                }, void 0, false, {
                    fileName: "[project]/components/payroll/payroll-detail-panel.tsx",
                    lineNumber: 46,
                    columnNumber: 16
                }, this);
            default:
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Badge"], {
                    variant: "secondary",
                    children: "📝 Nháp"
                }, void 0, false, {
                    fileName: "[project]/components/payroll/payroll-detail-panel.tsx",
                    lineNumber: 48,
                    columnNumber: 16
                }, this);
        }
    };
    // Tính tổng
    const totalGross = payrollItems.reduce((sum, item)=>sum + (item.total_income || 0), 0);
    const totalDeduction = payrollItems.reduce((sum, item)=>sum + (item.total_deduction || 0), 0);
    const totalNet = payrollItems.reduce((sum, item)=>sum + (item.net_salary || 0), 0);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "space-y-6",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center justify-between",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                        variant: "outline",
                        asChild: true,
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                            href: "/dashboard/payroll",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$454$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$left$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowLeft$3e$__["ArrowLeft"], {
                                    className: "h-4 w-4 mr-2"
                                }, void 0, false, {
                                    fileName: "[project]/components/payroll/payroll-detail-panel.tsx",
                                    lineNumber: 63,
                                    columnNumber: 13
                                }, this),
                                "Quay lại"
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/payroll/payroll-detail-panel.tsx",
                            lineNumber: 62,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/components/payroll/payroll-detail-panel.tsx",
                        lineNumber: 61,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-2",
                        children: [
                            getStatusBadge(payrollRun.status),
                            payrollRun.status === "draft" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                onClick: handleLock,
                                disabled: loading === "lock",
                                className: "gap-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$454$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$lock$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Lock$3e$__["Lock"], {
                                        className: "h-4 w-4"
                                    }, void 0, false, {
                                        fileName: "[project]/components/payroll/payroll-detail-panel.tsx",
                                        lineNumber: 71,
                                        columnNumber: 15
                                    }, this),
                                    loading === "lock" ? "Đang khóa..." : "Khóa bảng lương"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/payroll/payroll-detail-panel.tsx",
                                lineNumber: 70,
                                columnNumber: 13
                            }, this),
                            payrollRun.status === "locked" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                onClick: handleMarkPaid,
                                disabled: loading === "paid",
                                className: "gap-2 bg-green-600 hover:bg-green-700",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$454$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2d$big$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle$3e$__["CheckCircle"], {
                                        className: "h-4 w-4"
                                    }, void 0, false, {
                                        fileName: "[project]/components/payroll/payroll-detail-panel.tsx",
                                        lineNumber: 81,
                                        columnNumber: 15
                                    }, this),
                                    loading === "paid" ? "Đang xử lý..." : "Đánh dấu đã trả"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/payroll/payroll-detail-panel.tsx",
                                lineNumber: 76,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/payroll/payroll-detail-panel.tsx",
                        lineNumber: 67,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/payroll/payroll-detail-panel.tsx",
                lineNumber: 60,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "grid grid-cols-4 gap-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Card"], {
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardContent"], {
                            className: "pt-6",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-center gap-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$454$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$users$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Users$3e$__["Users"], {
                                            className: "h-4 w-4 text-muted-foreground"
                                        }, void 0, false, {
                                            fileName: "[project]/components/payroll/payroll-detail-panel.tsx",
                                            lineNumber: 93,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "text-sm text-muted-foreground",
                                            children: "Nhân viên"
                                        }, void 0, false, {
                                            fileName: "[project]/components/payroll/payroll-detail-panel.tsx",
                                            lineNumber: 94,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/payroll/payroll-detail-panel.tsx",
                                    lineNumber: 92,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-2xl font-bold mt-1",
                                    children: payrollItems.length
                                }, void 0, false, {
                                    fileName: "[project]/components/payroll/payroll-detail-panel.tsx",
                                    lineNumber: 96,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/payroll/payroll-detail-panel.tsx",
                            lineNumber: 91,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/components/payroll/payroll-detail-panel.tsx",
                        lineNumber: 90,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Card"], {
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardContent"], {
                            className: "pt-6",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-center gap-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$454$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$calculator$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Calculator$3e$__["Calculator"], {
                                            className: "h-4 w-4 text-muted-foreground"
                                        }, void 0, false, {
                                            fileName: "[project]/components/payroll/payroll-detail-panel.tsx",
                                            lineNumber: 102,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "text-sm text-muted-foreground",
                                            children: "Tổng thu nhập"
                                        }, void 0, false, {
                                            fileName: "[project]/components/payroll/payroll-detail-panel.tsx",
                                            lineNumber: 103,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/payroll/payroll-detail-panel.tsx",
                                    lineNumber: 101,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-xl font-bold mt-1 text-blue-600",
                                    children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2f$format$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatCurrency"])(totalGross)
                                }, void 0, false, {
                                    fileName: "[project]/components/payroll/payroll-detail-panel.tsx",
                                    lineNumber: 105,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/payroll/payroll-detail-panel.tsx",
                            lineNumber: 100,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/components/payroll/payroll-detail-panel.tsx",
                        lineNumber: 99,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Card"], {
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardContent"], {
                            className: "pt-6",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-center gap-2",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-sm text-muted-foreground",
                                        children: "Tổng khấu trừ"
                                    }, void 0, false, {
                                        fileName: "[project]/components/payroll/payroll-detail-panel.tsx",
                                        lineNumber: 111,
                                        columnNumber: 15
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/components/payroll/payroll-detail-panel.tsx",
                                    lineNumber: 110,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-xl font-bold mt-1 text-red-600",
                                    children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2f$format$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatCurrency"])(totalDeduction)
                                }, void 0, false, {
                                    fileName: "[project]/components/payroll/payroll-detail-panel.tsx",
                                    lineNumber: 113,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/payroll/payroll-detail-panel.tsx",
                            lineNumber: 109,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/components/payroll/payroll-detail-panel.tsx",
                        lineNumber: 108,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Card"], {
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardContent"], {
                            className: "pt-6",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-center gap-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$454$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$wallet$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Wallet$3e$__["Wallet"], {
                                            className: "h-4 w-4 text-muted-foreground"
                                        }, void 0, false, {
                                            fileName: "[project]/components/payroll/payroll-detail-panel.tsx",
                                            lineNumber: 119,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "text-sm text-muted-foreground",
                                            children: "Tổng thực lĩnh"
                                        }, void 0, false, {
                                            fileName: "[project]/components/payroll/payroll-detail-panel.tsx",
                                            lineNumber: 120,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/payroll/payroll-detail-panel.tsx",
                                    lineNumber: 118,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-xl font-bold mt-1 text-green-600",
                                    children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2f$format$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatCurrency"])(totalNet)
                                }, void 0, false, {
                                    fileName: "[project]/components/payroll/payroll-detail-panel.tsx",
                                    lineNumber: 122,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/payroll/payroll-detail-panel.tsx",
                            lineNumber: 117,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/components/payroll/payroll-detail-panel.tsx",
                        lineNumber: 116,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/payroll/payroll-detail-panel.tsx",
                lineNumber: 89,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Card"], {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardHeader"], {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardTitle"], {
                                children: "Chi tiết lương nhân viên"
                            }, void 0, false, {
                                fileName: "[project]/components/payroll/payroll-detail-panel.tsx",
                                lineNumber: 130,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardDescription"], {
                                children: [
                                    "Kỳ lương tháng ",
                                    payrollRun.month,
                                    "/",
                                    payrollRun.year,
                                    " - Click vào dòng để xem cơ cấu chi tiết"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/payroll/payroll-detail-panel.tsx",
                                lineNumber: 131,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/payroll/payroll-detail-panel.tsx",
                        lineNumber: 129,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardContent"], {
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Table"], {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TableHeader"], {
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TableRow"], {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TableHead"], {
                                                children: "Nhân viên"
                                            }, void 0, false, {
                                                fileName: "[project]/components/payroll/payroll-detail-panel.tsx",
                                                lineNumber: 139,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TableHead"], {
                                                className: "text-right",
                                                children: "Ngày công"
                                            }, void 0, false, {
                                                fileName: "[project]/components/payroll/payroll-detail-panel.tsx",
                                                lineNumber: 140,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TableHead"], {
                                                className: "text-right",
                                                children: "Nghỉ phép"
                                            }, void 0, false, {
                                                fileName: "[project]/components/payroll/payroll-detail-panel.tsx",
                                                lineNumber: 141,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TableHead"], {
                                                className: "text-right",
                                                children: "Nghỉ KL"
                                            }, void 0, false, {
                                                fileName: "[project]/components/payroll/payroll-detail-panel.tsx",
                                                lineNumber: 142,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TableHead"], {
                                                className: "text-right",
                                                children: "Lương CB"
                                            }, void 0, false, {
                                                fileName: "[project]/components/payroll/payroll-detail-panel.tsx",
                                                lineNumber: 143,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TableHead"], {
                                                className: "text-right",
                                                children: "Phụ cấp"
                                            }, void 0, false, {
                                                fileName: "[project]/components/payroll/payroll-detail-panel.tsx",
                                                lineNumber: 144,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TableHead"], {
                                                className: "text-right",
                                                children: "Thu nhập"
                                            }, void 0, false, {
                                                fileName: "[project]/components/payroll/payroll-detail-panel.tsx",
                                                lineNumber: 145,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TableHead"], {
                                                className: "text-right",
                                                children: "Khấu trừ"
                                            }, void 0, false, {
                                                fileName: "[project]/components/payroll/payroll-detail-panel.tsx",
                                                lineNumber: 146,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TableHead"], {
                                                className: "text-right",
                                                children: "Thực lĩnh"
                                            }, void 0, false, {
                                                fileName: "[project]/components/payroll/payroll-detail-panel.tsx",
                                                lineNumber: 147,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TableHead"], {
                                                className: "text-center",
                                                children: "Chi tiết"
                                            }, void 0, false, {
                                                fileName: "[project]/components/payroll/payroll-detail-panel.tsx",
                                                lineNumber: 148,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/payroll/payroll-detail-panel.tsx",
                                        lineNumber: 138,
                                        columnNumber: 15
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/components/payroll/payroll-detail-panel.tsx",
                                    lineNumber: 137,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TableBody"], {
                                    children: payrollItems.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TableRow"], {
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TableCell"], {
                                            colSpan: 10,
                                            className: "text-center text-muted-foreground",
                                            children: "Chưa có dữ liệu"
                                        }, void 0, false, {
                                            fileName: "[project]/components/payroll/payroll-detail-panel.tsx",
                                            lineNumber: 154,
                                            columnNumber: 19
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/components/payroll/payroll-detail-panel.tsx",
                                        lineNumber: 153,
                                        columnNumber: 17
                                    }, this) : payrollItems.map((item)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TableRow"], {
                                            className: "cursor-pointer hover:bg-muted/50",
                                            onClick: ()=>{
                                                setSelectedItem(item);
                                                setShowBreakdown(true);
                                            },
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TableCell"], {
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "font-medium",
                                                                children: item.employee?.full_name
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/payroll/payroll-detail-panel.tsx",
                                                                lineNumber: 170,
                                                                columnNumber: 25
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "text-sm text-muted-foreground",
                                                                children: item.employee?.employee_code
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/payroll/payroll-detail-panel.tsx",
                                                                lineNumber: 171,
                                                                columnNumber: 25
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/components/payroll/payroll-detail-panel.tsx",
                                                        lineNumber: 169,
                                                        columnNumber: 23
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/components/payroll/payroll-detail-panel.tsx",
                                                    lineNumber: 168,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TableCell"], {
                                                    className: "text-right",
                                                    children: item.working_days || 0
                                                }, void 0, false, {
                                                    fileName: "[project]/components/payroll/payroll-detail-panel.tsx",
                                                    lineNumber: 176,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TableCell"], {
                                                    className: "text-right",
                                                    children: item.leave_days || 0
                                                }, void 0, false, {
                                                    fileName: "[project]/components/payroll/payroll-detail-panel.tsx",
                                                    lineNumber: 177,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TableCell"], {
                                                    className: "text-right",
                                                    children: item.unpaid_leave_days || 0
                                                }, void 0, false, {
                                                    fileName: "[project]/components/payroll/payroll-detail-panel.tsx",
                                                    lineNumber: 178,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TableCell"], {
                                                    className: "text-right",
                                                    children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2f$format$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatCurrency"])(item.base_salary)
                                                }, void 0, false, {
                                                    fileName: "[project]/components/payroll/payroll-detail-panel.tsx",
                                                    lineNumber: 179,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TableCell"], {
                                                    className: "text-right",
                                                    children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2f$format$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatCurrency"])(item.allowances)
                                                }, void 0, false, {
                                                    fileName: "[project]/components/payroll/payroll-detail-panel.tsx",
                                                    lineNumber: 180,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TableCell"], {
                                                    className: "text-right text-blue-600",
                                                    children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2f$format$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatCurrency"])(item.total_income)
                                                }, void 0, false, {
                                                    fileName: "[project]/components/payroll/payroll-detail-panel.tsx",
                                                    lineNumber: 181,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TableCell"], {
                                                    className: "text-right text-red-600",
                                                    children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2f$format$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatCurrency"])(item.total_deduction)
                                                }, void 0, false, {
                                                    fileName: "[project]/components/payroll/payroll-detail-panel.tsx",
                                                    lineNumber: 184,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TableCell"], {
                                                    className: "text-right font-bold text-green-600",
                                                    children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2f$format$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatCurrency"])(item.net_salary)
                                                }, void 0, false, {
                                                    fileName: "[project]/components/payroll/payroll-detail-panel.tsx",
                                                    lineNumber: 187,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TableCell"], {
                                                    className: "text-center",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                                        variant: "ghost",
                                                        size: "sm",
                                                        onClick: (e)=>{
                                                            e.stopPropagation();
                                                            setSelectedItem(item);
                                                            setShowBreakdown(true);
                                                        },
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lucide$2d$react$40$0$2e$454$2e$0_react$40$19$2e$2$2e$0$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$eye$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Eye$3e$__["Eye"], {
                                                            className: "h-4 w-4"
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/payroll/payroll-detail-panel.tsx",
                                                            lineNumber: 200,
                                                            columnNumber: 25
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/payroll/payroll-detail-panel.tsx",
                                                        lineNumber: 191,
                                                        columnNumber: 23
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/components/payroll/payroll-detail-panel.tsx",
                                                    lineNumber: 190,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, item.id, true, {
                                            fileName: "[project]/components/payroll/payroll-detail-panel.tsx",
                                            lineNumber: 160,
                                            columnNumber: 19
                                        }, this))
                                }, void 0, false, {
                                    fileName: "[project]/components/payroll/payroll-detail-panel.tsx",
                                    lineNumber: 151,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/payroll/payroll-detail-panel.tsx",
                            lineNumber: 136,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/components/payroll/payroll-detail-panel.tsx",
                        lineNumber: 135,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/payroll/payroll-detail-panel.tsx",
                lineNumber: 128,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$0$2e$10_react$2d$dom$40$19$2e$2$2e$0_react$40$19$2e$2$2e$0_$5f$react$40$19$2e$2$2e$0$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$payroll$2f$payroll$2d$breakdown$2d$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PayrollBreakdownDialog"], {
                open: showBreakdown,
                onOpenChange: setShowBreakdown,
                payrollItem: selectedItem,
                standardWorkingDays: STANDARD_WORKING_DAYS
            }, void 0, false, {
                fileName: "[project]/components/payroll/payroll-detail-panel.tsx",
                lineNumber: 212,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/payroll/payroll-detail-panel.tsx",
        lineNumber: 58,
        columnNumber: 5
    }, this);
}
_s(PayrollDetailPanel, "/MTEuVsjox0D2chDHKvWUKBxyNE=");
_c = PayrollDetailPanel;
var _c;
__turbopack_context__.k.register(_c, "PayrollDetailPanel");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=_4590da58._.js.map