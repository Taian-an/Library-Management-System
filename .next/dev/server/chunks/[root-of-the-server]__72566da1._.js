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
"[project]/Documents/CSX4107_FriMorning/LMS/models/Borrow.ts [api] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$Documents$2f$CSX4107_FriMorning$2f$LMS$2f$node_modules$2f$mongoose$29$__ = __turbopack_context__.i("[externals]/mongoose [external] (mongoose, cjs, [project]/Documents/CSX4107_FriMorning/LMS/node_modules/mongoose)");
;
const BorrowSchema = new __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$Documents$2f$CSX4107_FriMorning$2f$LMS$2f$node_modules$2f$mongoose$29$__["Schema"]({
    userId: {
        type: String,
        required: true
    },
    bookId: {
        type: __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$Documents$2f$CSX4107_FriMorning$2f$LMS$2f$node_modules$2f$mongoose$29$__["default"].Schema.Types.ObjectId,
        ref: 'Book',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    targetDate: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        required: true,
        enum: [
            'INIT',
            'CLOSE-NO-AVAILABLE-BOOK',
            'ACCEPTED',
            'CANCEL-ADMIN',
            'CANCEL-USER'
        ],
        default: 'INIT'
    }
}, {
    timestamps: true
});
const BorrowModel = __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$Documents$2f$CSX4107_FriMorning$2f$LMS$2f$node_modules$2f$mongoose$29$__["models"].Borrow || (0, __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$Documents$2f$CSX4107_FriMorning$2f$LMS$2f$node_modules$2f$mongoose$29$__["model"])('Borrow', BorrowSchema);
const __TURBOPACK__default__export__ = BorrowModel;
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
"[project]/Documents/CSX4107_FriMorning/LMS/pages/api/borrow.ts [api] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>handler
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$CSX4107_FriMorning$2f$LMS$2f$lib$2f$dbConnect$2e$js__$5b$api$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/CSX4107_FriMorning/LMS/lib/dbConnect.js [api] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$CSX4107_FriMorning$2f$LMS$2f$models$2f$Borrow$2e$ts__$5b$api$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/CSX4107_FriMorning/LMS/models/Borrow.ts [api] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$CSX4107_FriMorning$2f$LMS$2f$models$2f$Book$2e$ts__$5b$api$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/CSX4107_FriMorning/LMS/models/Book.ts [api] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$CSX4107_FriMorning$2f$LMS$2f$lib$2f$auth$2e$ts__$5b$api$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/CSX4107_FriMorning/LMS/lib/auth.ts [api] (ecmascript)");
;
;
;
;
async function handler(req, res) {
    const r = req;
    const s = res;
    await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$CSX4107_FriMorning$2f$LMS$2f$lib$2f$dbConnect$2e$js__$5b$api$5d$__$28$ecmascript$29$__["default"])();
    const user = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$CSX4107_FriMorning$2f$LMS$2f$lib$2f$auth$2e$ts__$5b$api$5d$__$28$ecmascript$29$__["verifyToken"])(req);
    if (!user) {
        return s.status(401).json({
            message: 'Unauthorized'
        });
    }
    if (r.method === 'POST') {
        if (user.role !== 'USER') {
            return s.status(403).json({
                message: 'Forbidden'
            });
        }
        const { bookId, targetDate } = r.body;
        try {
            const book = await __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$CSX4107_FriMorning$2f$LMS$2f$models$2f$Book$2e$ts__$5b$api$5d$__$28$ecmascript$29$__["default"].findById(bookId);
            if (!book || book.quantity <= 0 || book.status === 'deleted') {
                return s.status(400).json({
                    message: 'Book out of stock or unavailable'
                });
            }
            await __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$CSX4107_FriMorning$2f$LMS$2f$models$2f$Book$2e$ts__$5b$api$5d$__$28$ecmascript$29$__["default"].findByIdAndUpdate(bookId, {
                $inc: {
                    quantity: -1
                }
            });
            const payload = {
                userId: user.id,
                bookId: bookId,
                targetDate: new Date(targetDate),
                status: 'INIT',
                createdAt: new Date()
            };
            const request = await __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$CSX4107_FriMorning$2f$LMS$2f$models$2f$Borrow$2e$ts__$5b$api$5d$__$28$ecmascript$29$__["default"].create(payload);
            return s.status(201).json(request);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
            return s.status(400).json({
                message: 'Invalid data'
            });
        }
    }
    if (r.method === 'PATCH') {
        if (user.role !== 'ADMIN') {
            return s.status(403).json({
                message: 'Forbidden'
            });
        }
        const { requestId, status } = r.body;
        const updated = await __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$CSX4107_FriMorning$2f$LMS$2f$models$2f$Borrow$2e$ts__$5b$api$5d$__$28$ecmascript$29$__["default"].findByIdAndUpdate(requestId, {
            status: status
        }, {
            new: true
        });
        if (!updated) {
            return s.status(404).json({
                message: 'Request not found'
            });
        }
        return s.status(200).json(updated);
    }
    if (r.method === 'GET') {
        const filter = user.role === 'ADMIN' ? {} : {
            userId: user.id
        };
        const requests = await __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$CSX4107_FriMorning$2f$LMS$2f$models$2f$Borrow$2e$ts__$5b$api$5d$__$28$ecmascript$29$__["default"].find(filter).sort({
            createdAt: -1
        });
        return s.status(200).json(requests);
    }
    s.status(405).end();
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__72566da1._.js.map