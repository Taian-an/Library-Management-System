module.exports = [
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/pages-api-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/pages-api-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/pages-api-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/pages-api-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[project]/Documents/CSX4107_FriMorning/LMS/pages/api/user/login.ts [api] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>handler
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$jsonwebtoken__$5b$external$5d$__$28$jsonwebtoken$2c$__cjs$2c$__$5b$project$5d2f$Documents$2f$CSX4107_FriMorning$2f$LMS$2f$node_modules$2f$jsonwebtoken$29$__ = __turbopack_context__.i("[externals]/jsonwebtoken [external] (jsonwebtoken, cjs, [project]/Documents/CSX4107_FriMorning/LMS/node_modules/jsonwebtoken)");
;
async function handler(req, res) {
    const r = req;
    const s = res;
    if (r.method !== 'POST') return s.status(405).end();
    const body = r.body;
    const { email, password } = body;
    let userData = null;
    if (email === 'admin@test.com' && password === 'admin123') {
        userData = {
            id: 'admin_1',
            email: 'admin@test.com',
            role: 'ADMIN'
        };
    } else if (email === 'user@test.com' && password === 'user123') {
        userData = {
            id: 'user_1',
            email: 'user@test.com',
            role: 'USER'
        };
    }
    if (!userData) {
        return s.status(401).json({
            message: 'Unauthorized'
        });
    }
    const sign = __TURBOPACK__imported__module__$5b$externals$5d2f$jsonwebtoken__$5b$external$5d$__$28$jsonwebtoken$2c$__cjs$2c$__$5b$project$5d2f$Documents$2f$CSX4107_FriMorning$2f$LMS$2f$node_modules$2f$jsonwebtoken$29$__["default"].sign;
    const token = sign(userData, process.env.JWT_SECRET || '123', {
        expiresIn: '1d'
    });
    s.status(200).json({
        token,
        user: userData
    });
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__27d0866d._.js.map