module.exports = [
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/pages-api-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/pages-api-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/pages-api-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/pages-api-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[project]/Documents/CSX4107_FriMorning/LMS/lib/dbConnect.js [api] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
// Modified: Fixed connection logic to prevent multiple connections in development
// and ensured Mongoose types are correctly handled without 'any'.
var __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$Documents$2f$CSX4107_FriMorning$2f$LMS$2f$node_modules$2f$mongoose$29$__ = __turbopack_context__.i("[externals]/mongoose [external] (mongoose, cjs, [project]/Documents/CSX4107_FriMorning/LMS/node_modules/mongoose)");
;
const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
    throw new Error('Please define the MONGODB_URI environment variable');
}
let cached = /*TURBOPACK member replacement*/ __turbopack_context__.g.mongoose;
if (!cached) {
    cached = /*TURBOPACK member replacement*/ __turbopack_context__.g.mongoose = {
        conn: null,
        promise: null
    };
}
async function dbConnect() {
    if (cached.conn) return cached.conn;
    if (!cached.promise) {
        cached.promise = __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$Documents$2f$CSX4107_FriMorning$2f$LMS$2f$node_modules$2f$mongoose$29$__["default"].connect(MONGODB_URI).then((mongoose)=>{
            console.log("Database connection state:", mongoose.connection.readyState);
            return mongoose;
        });
    }
    cached.conn = await cached.promise;
    return cached.conn;
}
const __TURBOPACK__default__export__ = dbConnect;
}),
"[project]/Documents/CSX4107_FriMorning/LMS/models/Book.ts [api] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$Documents$2f$CSX4107_FriMorning$2f$LMS$2f$node_modules$2f$mongoose$29$__ = __turbopack_context__.i("[externals]/mongoose [external] (mongoose, cjs, [project]/Documents/CSX4107_FriMorning/LMS/node_modules/mongoose)");
;
const BookSchema = new __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$Documents$2f$CSX4107_FriMorning$2f$LMS$2f$node_modules$2f$mongoose$29$__["default"].Schema({
    title: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true,
        default: 'active',
        enum: [
            'active',
            'deleted'
        ]
    }
}, {
    timestamps: true
});
const BookModel = __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$Documents$2f$CSX4107_FriMorning$2f$LMS$2f$node_modules$2f$mongoose$29$__["default"].models.Book || __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$Documents$2f$CSX4107_FriMorning$2f$LMS$2f$node_modules$2f$mongoose$29$__["default"].model('Book', BookSchema);
const __TURBOPACK__default__export__ = BookModel;
}),
"[project]/Documents/CSX4107_FriMorning/LMS/lib/auth.ts [api] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "verifyToken",
    ()=>verifyToken
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$jsonwebtoken__$5b$external$5d$__$28$jsonwebtoken$2c$__cjs$2c$__$5b$project$5d2f$Documents$2f$CSX4107_FriMorning$2f$LMS$2f$node_modules$2f$jsonwebtoken$29$__ = __turbopack_context__.i("[externals]/jsonwebtoken [external] (jsonwebtoken, cjs, [project]/Documents/CSX4107_FriMorning/LMS/node_modules/jsonwebtoken)");
;
function verifyToken(req) {
    const r = req;
    const authHeader = r.headers.authorization;
    if (!authHeader) return null;
    const token = authHeader.split(' ')[1];
    try {
        const jwtTool = __TURBOPACK__imported__module__$5b$externals$5d2f$jsonwebtoken__$5b$external$5d$__$28$jsonwebtoken$2c$__cjs$2c$__$5b$project$5d2f$Documents$2f$CSX4107_FriMorning$2f$LMS$2f$node_modules$2f$jsonwebtoken$29$__["default"];
        return jwtTool.verify(token, process.env.JWT_SECRET || '123');
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
        return null;
    }
}
}),
"[project]/Documents/CSX4107_FriMorning/LMS/pages/api/books/index.ts [api] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>handler
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$CSX4107_FriMorning$2f$LMS$2f$lib$2f$dbConnect$2e$js__$5b$api$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/CSX4107_FriMorning/LMS/lib/dbConnect.js [api] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$CSX4107_FriMorning$2f$LMS$2f$models$2f$Book$2e$ts__$5b$api$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/CSX4107_FriMorning/LMS/models/Book.ts [api] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$CSX4107_FriMorning$2f$LMS$2f$lib$2f$auth$2e$ts__$5b$api$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/CSX4107_FriMorning/LMS/lib/auth.ts [api] (ecmascript)");
;
;
;
async function handler(req, res) {
    const r = req;
    const s = res;
    await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$CSX4107_FriMorning$2f$LMS$2f$lib$2f$dbConnect$2e$js__$5b$api$5d$__$28$ecmascript$29$__["default"])();
    const user = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$CSX4107_FriMorning$2f$LMS$2f$lib$2f$auth$2e$ts__$5b$api$5d$__$28$ecmascript$29$__["verifyToken"])(req);
    if (!user) return s.status(401).json({
        message: 'Unauthorized'
    });
    if (r.method === 'GET') {
        const filter = {};
        if (user.role !== 'ADMIN') {
            filter.status = 'active';
        }
        if (r.query.title) filter.title = {
            $regex: String(r.query.title),
            $options: 'i'
        };
        if (r.query.author) filter.author = {
            $regex: String(r.query.author),
            $options: 'i'
        };
        const books = await __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$CSX4107_FriMorning$2f$LMS$2f$models$2f$Book$2e$ts__$5b$api$5d$__$28$ecmascript$29$__["default"].find(filter);
        s.status(200).json(books);
        return;
    }
    if (r.method === 'POST') {
        if (user.role !== 'ADMIN') return s.status(403).json({
            message: 'Forbidden'
        });
        const newBook = await __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$CSX4107_FriMorning$2f$LMS$2f$models$2f$Book$2e$ts__$5b$api$5d$__$28$ecmascript$29$__["default"].create(r.body);
        s.status(201).json(newBook);
        return;
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__0d5c7321._.js.map