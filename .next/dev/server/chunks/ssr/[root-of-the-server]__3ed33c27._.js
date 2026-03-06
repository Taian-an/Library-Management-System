module.exports = [
"[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("react/jsx-dev-runtime", () => require("react/jsx-dev-runtime"));

module.exports = mod;
}),
"[project]/Documents/CSX4107_FriMorning/LMS/src/components/AdminPanel.tsx [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>AdminPanel
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react [external] (react, cjs)");
;
;
function AdminPanel() {
    const [books, setBooks] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])([]);
    const [, setReqs] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])([]);
    const [newBook, setNewBook] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])({
        title: '',
        author: '',
        quantity: 0,
        location: ''
    });
    const refresh = async ()=>{
        const token = localStorage.getItem('token');
        const bRes = await fetch('/api/books', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        const bData = await bRes.json();
        setBooks(bData);
        const rRes = await fetch('/api/borrow', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        const rData = await rRes.json();
        setReqs(rData);
    };
    // eslint-disable-next-line react-hooks/set-state-in-effect
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        refresh();
    }, []);
    const handleAddBook = async (e)=>{
        e.preventDefault();
        const res = await fetch('/api/books', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify(newBook)
        });
        if (res.ok) {
            alert('Book added successfully!');
            setNewBook({
                title: '',
                author: '',
                quantity: 0,
                location: ''
            });
            refresh();
        } else {
            alert('Failed to add book');
        }
    };
    const deleteBook = async (id)=>{
        await fetch(`/api/books/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        refresh();
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
        className: "p-4",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h2", {
                children: "Admin Dashboard"
            }, void 0, false, {
                fileName: "[project]/Documents/CSX4107_FriMorning/LMS/src/components/AdminPanel.tsx",
                lineNumber: 56,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("section", {
                className: "mb-8 p-4 border rounded bg-gray-50",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h3", {
                        className: "font-bold mb-4 text-blue-700",
                        children: "Add New Book"
                    }, void 0, false, {
                        fileName: "[project]/Documents/CSX4107_FriMorning/LMS/src/components/AdminPanel.tsx",
                        lineNumber: 59,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("form", {
                        onSubmit: handleAddBook,
                        className: "grid grid-cols-1 md:grid-cols-2 gap-4",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                                type: "text",
                                placeholder: "Book Title",
                                required: true,
                                className: "border p-2 rounded",
                                value: newBook.title,
                                onChange: (e)=>setNewBook({
                                        ...newBook,
                                        title: e.target.value
                                    })
                            }, void 0, false, {
                                fileName: "[project]/Documents/CSX4107_FriMorning/LMS/src/components/AdminPanel.tsx",
                                lineNumber: 61,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                                type: "text",
                                placeholder: "Author",
                                required: true,
                                className: "border p-2 rounded",
                                value: newBook.author,
                                onChange: (e)=>setNewBook({
                                        ...newBook,
                                        author: e.target.value
                                    })
                            }, void 0, false, {
                                fileName: "[project]/Documents/CSX4107_FriMorning/LMS/src/components/AdminPanel.tsx",
                                lineNumber: 65,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                                type: "number",
                                placeholder: "Quantity",
                                required: true,
                                className: "border p-2 rounded",
                                value: newBook.quantity,
                                onChange: (e)=>setNewBook({
                                        ...newBook,
                                        quantity: parseInt(e.target.value) || 0
                                    })
                            }, void 0, false, {
                                fileName: "[project]/Documents/CSX4107_FriMorning/LMS/src/components/AdminPanel.tsx",
                                lineNumber: 69,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                                type: "text",
                                placeholder: "Location (e.g., A1)",
                                required: true,
                                className: "border p-2 rounded",
                                value: newBook.location,
                                onChange: (e)=>setNewBook({
                                        ...newBook,
                                        location: e.target.value
                                    })
                            }, void 0, false, {
                                fileName: "[project]/Documents/CSX4107_FriMorning/LMS/src/components/AdminPanel.tsx",
                                lineNumber: 73,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                type: "submit",
                                className: "bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 md:col-span-2",
                                children: "Create Book"
                            }, void 0, false, {
                                fileName: "[project]/Documents/CSX4107_FriMorning/LMS/src/components/AdminPanel.tsx",
                                lineNumber: 77,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Documents/CSX4107_FriMorning/LMS/src/components/AdminPanel.tsx",
                        lineNumber: 60,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/Documents/CSX4107_FriMorning/LMS/src/components/AdminPanel.tsx",
                lineNumber: 58,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h3", {
                className: "font-bold mb-2",
                children: "Books Inventory"
            }, void 0, false, {
                fileName: "[project]/Documents/CSX4107_FriMorning/LMS/src/components/AdminPanel.tsx",
                lineNumber: 83,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: "space-y-2",
                children: books.map((b)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        className: "flex justify-between p-2 border-b",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                style: {
                                    color: b.status === 'deleted' ? 'red' : 'black'
                                },
                                children: [
                                    b.title,
                                    " (",
                                    b.author,
                                    ") - ",
                                    b.status
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Documents/CSX4107_FriMorning/LMS/src/components/AdminPanel.tsx",
                                lineNumber: 87,
                                columnNumber: 13
                            }, this),
                            b.status !== 'deleted' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                onClick: ()=>deleteBook(b._id),
                                className: "text-red-500 underline text-sm",
                                children: "Delete"
                            }, void 0, false, {
                                fileName: "[project]/Documents/CSX4107_FriMorning/LMS/src/components/AdminPanel.tsx",
                                lineNumber: 91,
                                columnNumber: 15
                            }, this)
                        ]
                    }, b._id, true, {
                        fileName: "[project]/Documents/CSX4107_FriMorning/LMS/src/components/AdminPanel.tsx",
                        lineNumber: 86,
                        columnNumber: 11
                    }, this))
            }, void 0, false, {
                fileName: "[project]/Documents/CSX4107_FriMorning/LMS/src/components/AdminPanel.tsx",
                lineNumber: 84,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/Documents/CSX4107_FriMorning/LMS/src/components/AdminPanel.tsx",
        lineNumber: 55,
        columnNumber: 5
    }, this);
}
}),
"[project]/Documents/CSX4107_FriMorning/LMS/src/components/UserPanel.tsx [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>UserPanel
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react [external] (react, cjs)");
;
;
function UserPanel() {
    const [books, setBooks] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])([]);
    const [search, setSearch] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])({
        title: '',
        author: ''
    });
    const [targetDate, setTargetDate] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])('');
    const fetchBooks = async ()=>{
        try {
            const query = new URLSearchParams(search).toString();
            const res = await fetch(`/api/books?${query}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            const data = await res.json();
            setBooks(data);
        } catch (error) {
            console.error("Failed to fetch books:", error);
        }
    };
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        fetchBooks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        search
    ]);
    const handleBorrow = async (bookId)=>{
        if (!targetDate) {
            alert("Please select a target date before borrowing.");
            return;
        }
        const res = await fetch('/api/borrow', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({
                bookId,
                targetDate
            })
        });
        if (res.ok) {
            alert('Borrowing request submitted! Status: INIT');
        } else {
            const result = await res.json();
            const typedResult = result;
            alert(typedResult.message || 'Failed to submit request');
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
        className: "user-panel p-6 bg-white rounded-lg shadow-md",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h2", {
                className: "text-2xl font-bold mb-6 text-blue-800",
                children: "Library Catalog"
            }, void 0, false, {
                fileName: "[project]/Documents/CSX4107_FriMorning/LMS/src/components/UserPanel.tsx",
                lineNumber: 54,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("section", {
                className: "grid grid-cols-1 md:grid-cols-2 gap-4 mb-8",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("label", {
                                className: "block text-sm font-medium text-gray-700 mb-1",
                                children: "Search by Title"
                            }, void 0, false, {
                                fileName: "[project]/Documents/CSX4107_FriMorning/LMS/src/components/UserPanel.tsx",
                                lineNumber: 58,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                                type: "text",
                                placeholder: "e.g. Java Programming",
                                className: "w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none",
                                onChange: (e)=>setSearch({
                                        ...search,
                                        title: e.target.value
                                    })
                            }, void 0, false, {
                                fileName: "[project]/Documents/CSX4107_FriMorning/LMS/src/components/UserPanel.tsx",
                                lineNumber: 59,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Documents/CSX4107_FriMorning/LMS/src/components/UserPanel.tsx",
                        lineNumber: 57,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("label", {
                                className: "block text-sm font-medium text-gray-700 mb-1",
                                children: "Search by Author"
                            }, void 0, false, {
                                fileName: "[project]/Documents/CSX4107_FriMorning/LMS/src/components/UserPanel.tsx",
                                lineNumber: 67,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                                type: "text",
                                placeholder: "e.g. Taian Chen",
                                className: "w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none",
                                onChange: (e)=>setSearch({
                                        ...search,
                                        author: e.target.value
                                    })
                            }, void 0, false, {
                                fileName: "[project]/Documents/CSX4107_FriMorning/LMS/src/components/UserPanel.tsx",
                                lineNumber: 68,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Documents/CSX4107_FriMorning/LMS/src/components/UserPanel.tsx",
                        lineNumber: 66,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/Documents/CSX4107_FriMorning/LMS/src/components/UserPanel.tsx",
                lineNumber: 56,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: "mb-8 p-4 bg-blue-50 rounded-md border border-blue-200",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("label", {
                        className: "block mb-2 font-bold text-blue-900",
                        children: "Step 1: Select Target Pick-up Date"
                    }, void 0, false, {
                        fileName: "[project]/Documents/CSX4107_FriMorning/LMS/src/components/UserPanel.tsx",
                        lineNumber: 78,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                        type: "date",
                        className: "border border-blue-300 p-2 rounded w-full md:w-auto",
                        value: targetDate,
                        onChange: (e)=>setTargetDate(e.target.value)
                    }, void 0, false, {
                        fileName: "[project]/Documents/CSX4107_FriMorning/LMS/src/components/UserPanel.tsx",
                        lineNumber: 79,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/Documents/CSX4107_FriMorning/LMS/src/components/UserPanel.tsx",
                lineNumber: 77,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6",
                children: books.map((book)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        className: "border p-4 rounded-xl hover:shadow-lg transition-shadow bg-gray-50",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h4", {
                                className: "text-lg font-bold text-gray-800",
                                children: book.title
                            }, void 0, false, {
                                fileName: "[project]/Documents/CSX4107_FriMorning/LMS/src/components/UserPanel.tsx",
                                lineNumber: 90,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                className: "text-sm text-gray-600 mt-2 space-y-1",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                        children: [
                                            "👤 Author: ",
                                            book.author
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Documents/CSX4107_FriMorning/LMS/src/components/UserPanel.tsx",
                                        lineNumber: 92,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                        children: [
                                            "📍 Location: ",
                                            book.location
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Documents/CSX4107_FriMorning/LMS/src/components/UserPanel.tsx",
                                        lineNumber: 93,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                        children: [
                                            "📚 Available: ",
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                className: "font-semibold text-green-600",
                                                children: book.quantity
                                            }, void 0, false, {
                                                fileName: "[project]/Documents/CSX4107_FriMorning/LMS/src/components/UserPanel.tsx",
                                                lineNumber: 94,
                                                columnNumber: 32
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Documents/CSX4107_FriMorning/LMS/src/components/UserPanel.tsx",
                                        lineNumber: 94,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Documents/CSX4107_FriMorning/LMS/src/components/UserPanel.tsx",
                                lineNumber: 91,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                onClick: ()=>handleBorrow(book._id),
                                disabled: book.quantity <= 0,
                                className: `w-full mt-4 py-2 rounded-lg font-semibold transition ${book.quantity > 0 ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`,
                                children: book.quantity > 0 ? 'Request to Borrow' : 'Out of Stock'
                            }, void 0, false, {
                                fileName: "[project]/Documents/CSX4107_FriMorning/LMS/src/components/UserPanel.tsx",
                                lineNumber: 97,
                                columnNumber: 13
                            }, this)
                        ]
                    }, book._id, true, {
                        fileName: "[project]/Documents/CSX4107_FriMorning/LMS/src/components/UserPanel.tsx",
                        lineNumber: 89,
                        columnNumber: 11
                    }, this))
            }, void 0, false, {
                fileName: "[project]/Documents/CSX4107_FriMorning/LMS/src/components/UserPanel.tsx",
                lineNumber: 87,
                columnNumber: 7
            }, this),
            books.length === 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: "text-center py-10 text-gray-500",
                children: "No books found matching your current filters."
            }, void 0, false, {
                fileName: "[project]/Documents/CSX4107_FriMorning/LMS/src/components/UserPanel.tsx",
                lineNumber: 113,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/Documents/CSX4107_FriMorning/LMS/src/components/UserPanel.tsx",
        lineNumber: 53,
        columnNumber: 5
    }, this);
}
}),
"[project]/Documents/CSX4107_FriMorning/LMS/pages/index.tsx [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react [external] (react, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$CSX4107_FriMorning$2f$LMS$2f$src$2f$components$2f$AdminPanel$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/CSX4107_FriMorning/LMS/src/components/AdminPanel.tsx [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$CSX4107_FriMorning$2f$LMS$2f$src$2f$components$2f$UserPanel$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/CSX4107_FriMorning/LMS/src/components/UserPanel.tsx [ssr] (ecmascript)");
;
;
;
;
function App() {
    const [user, setUser] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(null);
    const handleLogin = async (e)=>{
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const res = await fetch('/api/user/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(Object.fromEntries(formData))
        });
        const data = await res.json();
        if (res.ok) {
            const typedData = data;
            localStorage.setItem('token', typedData.token);
            setUser(typedData.user);
        } else {
            alert('Login failed');
        }
    };
    if (!user) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
            style: {
                display: 'flex',
                justifyContent: 'center',
                marginTop: '50px'
            },
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("form", {
                onSubmit: handleLogin,
                style: {
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px',
                    width: '300px'
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h2", {
                        children: "Library System Login"
                    }, void 0, false, {
                        fileName: "[project]/Documents/CSX4107_FriMorning/LMS/pages/index.tsx",
                        lineNumber: 32,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                        name: "email",
                        type: "email",
                        placeholder: "Email",
                        required: true
                    }, void 0, false, {
                        fileName: "[project]/Documents/CSX4107_FriMorning/LMS/pages/index.tsx",
                        lineNumber: 33,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                        name: "password",
                        type: "password",
                        placeholder: "Password",
                        required: true
                    }, void 0, false, {
                        fileName: "[project]/Documents/CSX4107_FriMorning/LMS/pages/index.tsx",
                        lineNumber: 34,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                        type: "submit",
                        children: "Login"
                    }, void 0, false, {
                        fileName: "[project]/Documents/CSX4107_FriMorning/LMS/pages/index.tsx",
                        lineNumber: 35,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/Documents/CSX4107_FriMorning/LMS/pages/index.tsx",
                lineNumber: 31,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/Documents/CSX4107_FriMorning/LMS/pages/index.tsx",
            lineNumber: 30,
            columnNumber: 7
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
        style: {
            padding: '20px'
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("nav", {
                style: {
                    marginBottom: '20px',
                    borderBottom: '1px solid #ccc',
                    paddingBottom: '10px'
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                        children: [
                            "Logged as: ",
                            user.email,
                            " (",
                            user.role,
                            ")"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Documents/CSX4107_FriMorning/LMS/pages/index.tsx",
                        lineNumber: 44,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                        onClick: ()=>setUser(null),
                        children: "Logout"
                    }, void 0, false, {
                        fileName: "[project]/Documents/CSX4107_FriMorning/LMS/pages/index.tsx",
                        lineNumber: 45,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/Documents/CSX4107_FriMorning/LMS/pages/index.tsx",
                lineNumber: 43,
                columnNumber: 7
            }, this),
            user.role === 'ADMIN' ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$CSX4107_FriMorning$2f$LMS$2f$src$2f$components$2f$AdminPanel$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                fileName: "[project]/Documents/CSX4107_FriMorning/LMS/pages/index.tsx",
                lineNumber: 47,
                columnNumber: 32
            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$CSX4107_FriMorning$2f$LMS$2f$src$2f$components$2f$UserPanel$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                fileName: "[project]/Documents/CSX4107_FriMorning/LMS/pages/index.tsx",
                lineNumber: 47,
                columnNumber: 49
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/Documents/CSX4107_FriMorning/LMS/pages/index.tsx",
        lineNumber: 42,
        columnNumber: 5
    }, this);
}
const __TURBOPACK__default__export__ = App;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__3ed33c27._.js.map