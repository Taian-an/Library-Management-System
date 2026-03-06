(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[turbopack]/browser/dev/hmr-client/hmr-client.ts [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/// <reference path="../../../shared/runtime-types.d.ts" />
/// <reference path="../../runtime/base/dev-globals.d.ts" />
/// <reference path="../../runtime/base/dev-protocol.d.ts" />
/// <reference path="../../runtime/base/dev-extensions.ts" />
__turbopack_context__.s([
    "connect",
    ()=>connect,
    "setHooks",
    ()=>setHooks,
    "subscribeToUpdate",
    ()=>subscribeToUpdate
]);
function connect({ addMessageListener, sendMessage, onUpdateError = console.error }) {
    addMessageListener((msg)=>{
        switch(msg.type){
            case 'turbopack-connected':
                handleSocketConnected(sendMessage);
                break;
            default:
                try {
                    if (Array.isArray(msg.data)) {
                        for(let i = 0; i < msg.data.length; i++){
                            handleSocketMessage(msg.data[i]);
                        }
                    } else {
                        handleSocketMessage(msg.data);
                    }
                    applyAggregatedUpdates();
                } catch (e) {
                    console.warn('[Fast Refresh] performing full reload\n\n' + "Fast Refresh will perform a full reload when you edit a file that's imported by modules outside of the React rendering tree.\n" + 'You might have a file which exports a React component but also exports a value that is imported by a non-React component file.\n' + 'Consider migrating the non-React component export to a separate file and importing it into both files.\n\n' + 'It is also possible the parent component of the component you edited is a class component, which disables Fast Refresh.\n' + 'Fast Refresh requires at least one parent function component in your React tree.');
                    onUpdateError(e);
                    location.reload();
                }
                break;
        }
    });
    const queued = globalThis.TURBOPACK_CHUNK_UPDATE_LISTENERS;
    if (queued != null && !Array.isArray(queued)) {
        throw new Error('A separate HMR handler was already registered');
    }
    globalThis.TURBOPACK_CHUNK_UPDATE_LISTENERS = {
        push: ([chunkPath, callback])=>{
            subscribeToChunkUpdate(chunkPath, sendMessage, callback);
        }
    };
    if (Array.isArray(queued)) {
        for (const [chunkPath, callback] of queued){
            subscribeToChunkUpdate(chunkPath, sendMessage, callback);
        }
    }
}
const updateCallbackSets = new Map();
function sendJSON(sendMessage, message) {
    sendMessage(JSON.stringify(message));
}
function resourceKey(resource) {
    return JSON.stringify({
        path: resource.path,
        headers: resource.headers || null
    });
}
function subscribeToUpdates(sendMessage, resource) {
    sendJSON(sendMessage, {
        type: 'turbopack-subscribe',
        ...resource
    });
    return ()=>{
        sendJSON(sendMessage, {
            type: 'turbopack-unsubscribe',
            ...resource
        });
    };
}
function handleSocketConnected(sendMessage) {
    for (const key of updateCallbackSets.keys()){
        subscribeToUpdates(sendMessage, JSON.parse(key));
    }
}
// we aggregate all pending updates until the issues are resolved
const chunkListsWithPendingUpdates = new Map();
function aggregateUpdates(msg) {
    const key = resourceKey(msg.resource);
    let aggregated = chunkListsWithPendingUpdates.get(key);
    if (aggregated) {
        aggregated.instruction = mergeChunkListUpdates(aggregated.instruction, msg.instruction);
    } else {
        chunkListsWithPendingUpdates.set(key, msg);
    }
}
function applyAggregatedUpdates() {
    if (chunkListsWithPendingUpdates.size === 0) return;
    hooks.beforeRefresh();
    for (const msg of chunkListsWithPendingUpdates.values()){
        triggerUpdate(msg);
    }
    chunkListsWithPendingUpdates.clear();
    finalizeUpdate();
}
function mergeChunkListUpdates(updateA, updateB) {
    let chunks;
    if (updateA.chunks != null) {
        if (updateB.chunks == null) {
            chunks = updateA.chunks;
        } else {
            chunks = mergeChunkListChunks(updateA.chunks, updateB.chunks);
        }
    } else if (updateB.chunks != null) {
        chunks = updateB.chunks;
    }
    let merged;
    if (updateA.merged != null) {
        if (updateB.merged == null) {
            merged = updateA.merged;
        } else {
            // Since `merged` is an array of updates, we need to merge them all into
            // one, consistent update.
            // Since there can only be `EcmascriptMergeUpdates` in the array, there is
            // no need to key on the `type` field.
            let update = updateA.merged[0];
            for(let i = 1; i < updateA.merged.length; i++){
                update = mergeChunkListEcmascriptMergedUpdates(update, updateA.merged[i]);
            }
            for(let i = 0; i < updateB.merged.length; i++){
                update = mergeChunkListEcmascriptMergedUpdates(update, updateB.merged[i]);
            }
            merged = [
                update
            ];
        }
    } else if (updateB.merged != null) {
        merged = updateB.merged;
    }
    return {
        type: 'ChunkListUpdate',
        chunks,
        merged
    };
}
function mergeChunkListChunks(chunksA, chunksB) {
    const chunks = {};
    for (const [chunkPath, chunkUpdateA] of Object.entries(chunksA)){
        const chunkUpdateB = chunksB[chunkPath];
        if (chunkUpdateB != null) {
            const mergedUpdate = mergeChunkUpdates(chunkUpdateA, chunkUpdateB);
            if (mergedUpdate != null) {
                chunks[chunkPath] = mergedUpdate;
            }
        } else {
            chunks[chunkPath] = chunkUpdateA;
        }
    }
    for (const [chunkPath, chunkUpdateB] of Object.entries(chunksB)){
        if (chunks[chunkPath] == null) {
            chunks[chunkPath] = chunkUpdateB;
        }
    }
    return chunks;
}
function mergeChunkUpdates(updateA, updateB) {
    if (updateA.type === 'added' && updateB.type === 'deleted' || updateA.type === 'deleted' && updateB.type === 'added') {
        return undefined;
    }
    if (updateA.type === 'partial') {
        invariant(updateA.instruction, 'Partial updates are unsupported');
    }
    if (updateB.type === 'partial') {
        invariant(updateB.instruction, 'Partial updates are unsupported');
    }
    return undefined;
}
function mergeChunkListEcmascriptMergedUpdates(mergedA, mergedB) {
    const entries = mergeEcmascriptChunkEntries(mergedA.entries, mergedB.entries);
    const chunks = mergeEcmascriptChunksUpdates(mergedA.chunks, mergedB.chunks);
    return {
        type: 'EcmascriptMergedUpdate',
        entries,
        chunks
    };
}
function mergeEcmascriptChunkEntries(entriesA, entriesB) {
    return {
        ...entriesA,
        ...entriesB
    };
}
function mergeEcmascriptChunksUpdates(chunksA, chunksB) {
    if (chunksA == null) {
        return chunksB;
    }
    if (chunksB == null) {
        return chunksA;
    }
    const chunks = {};
    for (const [chunkPath, chunkUpdateA] of Object.entries(chunksA)){
        const chunkUpdateB = chunksB[chunkPath];
        if (chunkUpdateB != null) {
            const mergedUpdate = mergeEcmascriptChunkUpdates(chunkUpdateA, chunkUpdateB);
            if (mergedUpdate != null) {
                chunks[chunkPath] = mergedUpdate;
            }
        } else {
            chunks[chunkPath] = chunkUpdateA;
        }
    }
    for (const [chunkPath, chunkUpdateB] of Object.entries(chunksB)){
        if (chunks[chunkPath] == null) {
            chunks[chunkPath] = chunkUpdateB;
        }
    }
    if (Object.keys(chunks).length === 0) {
        return undefined;
    }
    return chunks;
}
function mergeEcmascriptChunkUpdates(updateA, updateB) {
    if (updateA.type === 'added' && updateB.type === 'deleted') {
        // These two completely cancel each other out.
        return undefined;
    }
    if (updateA.type === 'deleted' && updateB.type === 'added') {
        const added = [];
        const deleted = [];
        const deletedModules = new Set(updateA.modules ?? []);
        const addedModules = new Set(updateB.modules ?? []);
        for (const moduleId of addedModules){
            if (!deletedModules.has(moduleId)) {
                added.push(moduleId);
            }
        }
        for (const moduleId of deletedModules){
            if (!addedModules.has(moduleId)) {
                deleted.push(moduleId);
            }
        }
        if (added.length === 0 && deleted.length === 0) {
            return undefined;
        }
        return {
            type: 'partial',
            added,
            deleted
        };
    }
    if (updateA.type === 'partial' && updateB.type === 'partial') {
        const added = new Set([
            ...updateA.added ?? [],
            ...updateB.added ?? []
        ]);
        const deleted = new Set([
            ...updateA.deleted ?? [],
            ...updateB.deleted ?? []
        ]);
        if (updateB.added != null) {
            for (const moduleId of updateB.added){
                deleted.delete(moduleId);
            }
        }
        if (updateB.deleted != null) {
            for (const moduleId of updateB.deleted){
                added.delete(moduleId);
            }
        }
        return {
            type: 'partial',
            added: [
                ...added
            ],
            deleted: [
                ...deleted
            ]
        };
    }
    if (updateA.type === 'added' && updateB.type === 'partial') {
        const modules = new Set([
            ...updateA.modules ?? [],
            ...updateB.added ?? []
        ]);
        for (const moduleId of updateB.deleted ?? []){
            modules.delete(moduleId);
        }
        return {
            type: 'added',
            modules: [
                ...modules
            ]
        };
    }
    if (updateA.type === 'partial' && updateB.type === 'deleted') {
        // We could eagerly return `updateB` here, but this would potentially be
        // incorrect if `updateA` has added modules.
        const modules = new Set(updateB.modules ?? []);
        if (updateA.added != null) {
            for (const moduleId of updateA.added){
                modules.delete(moduleId);
            }
        }
        return {
            type: 'deleted',
            modules: [
                ...modules
            ]
        };
    }
    // Any other update combination is invalid.
    return undefined;
}
function invariant(_, message) {
    throw new Error(`Invariant: ${message}`);
}
const CRITICAL = [
    'bug',
    'error',
    'fatal'
];
function compareByList(list, a, b) {
    const aI = list.indexOf(a) + 1 || list.length;
    const bI = list.indexOf(b) + 1 || list.length;
    return aI - bI;
}
const chunksWithIssues = new Map();
function emitIssues() {
    const issues = [];
    const deduplicationSet = new Set();
    for (const [_, chunkIssues] of chunksWithIssues){
        for (const chunkIssue of chunkIssues){
            if (deduplicationSet.has(chunkIssue.formatted)) continue;
            issues.push(chunkIssue);
            deduplicationSet.add(chunkIssue.formatted);
        }
    }
    sortIssues(issues);
    hooks.issues(issues);
}
function handleIssues(msg) {
    const key = resourceKey(msg.resource);
    let hasCriticalIssues = false;
    for (const issue of msg.issues){
        if (CRITICAL.includes(issue.severity)) {
            hasCriticalIssues = true;
        }
    }
    if (msg.issues.length > 0) {
        chunksWithIssues.set(key, msg.issues);
    } else if (chunksWithIssues.has(key)) {
        chunksWithIssues.delete(key);
    }
    emitIssues();
    return hasCriticalIssues;
}
const SEVERITY_ORDER = [
    'bug',
    'fatal',
    'error',
    'warning',
    'info',
    'log'
];
const CATEGORY_ORDER = [
    'parse',
    'resolve',
    'code generation',
    'rendering',
    'typescript',
    'other'
];
function sortIssues(issues) {
    issues.sort((a, b)=>{
        const first = compareByList(SEVERITY_ORDER, a.severity, b.severity);
        if (first !== 0) return first;
        return compareByList(CATEGORY_ORDER, a.category, b.category);
    });
}
const hooks = {
    beforeRefresh: ()=>{},
    refresh: ()=>{},
    buildOk: ()=>{},
    issues: (_issues)=>{}
};
function setHooks(newHooks) {
    Object.assign(hooks, newHooks);
}
function handleSocketMessage(msg) {
    sortIssues(msg.issues);
    handleIssues(msg);
    switch(msg.type){
        case 'issues':
            break;
        case 'partial':
            // aggregate updates
            aggregateUpdates(msg);
            break;
        default:
            // run single update
            const runHooks = chunkListsWithPendingUpdates.size === 0;
            if (runHooks) hooks.beforeRefresh();
            triggerUpdate(msg);
            if (runHooks) finalizeUpdate();
            break;
    }
}
function finalizeUpdate() {
    hooks.refresh();
    hooks.buildOk();
    // This is used by the Next.js integration test suite to notify it when HMR
    // updates have been completed.
    // TODO: Only run this in test environments (gate by `process.env.__NEXT_TEST_MODE`)
    if (globalThis.__NEXT_HMR_CB) {
        globalThis.__NEXT_HMR_CB();
        globalThis.__NEXT_HMR_CB = null;
    }
}
function subscribeToChunkUpdate(chunkListPath, sendMessage, callback) {
    return subscribeToUpdate({
        path: chunkListPath
    }, sendMessage, callback);
}
function subscribeToUpdate(resource, sendMessage, callback) {
    const key = resourceKey(resource);
    let callbackSet;
    const existingCallbackSet = updateCallbackSets.get(key);
    if (!existingCallbackSet) {
        callbackSet = {
            callbacks: new Set([
                callback
            ]),
            unsubscribe: subscribeToUpdates(sendMessage, resource)
        };
        updateCallbackSets.set(key, callbackSet);
    } else {
        existingCallbackSet.callbacks.add(callback);
        callbackSet = existingCallbackSet;
    }
    return ()=>{
        callbackSet.callbacks.delete(callback);
        if (callbackSet.callbacks.size === 0) {
            callbackSet.unsubscribe();
            updateCallbackSets.delete(key);
        }
    };
}
function triggerUpdate(msg) {
    const key = resourceKey(msg.resource);
    const callbackSet = updateCallbackSets.get(key);
    if (!callbackSet) {
        return;
    }
    for (const callback of callbackSet.callbacks){
        callback(msg);
    }
    if (msg.type === 'notFound') {
        // This indicates that the resource which we subscribed to either does not exist or
        // has been deleted. In either case, we should clear all update callbacks, so if a
        // new subscription is created for the same resource, it will send a new "subscribe"
        // message to the server.
        // No need to send an "unsubscribe" message to the server, it will have already
        // dropped the update stream before sending the "notFound" message.
        updateCallbackSets.delete(key);
    }
}
}),
"[project]/Documents/CSX4107_FriMorning/LMS/src/components/AdminPanel.tsx [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>AdminPanel
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$CSX4107_FriMorning$2f$LMS$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/CSX4107_FriMorning/LMS/node_modules/react/jsx-dev-runtime.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$CSX4107_FriMorning$2f$LMS$2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/CSX4107_FriMorning/LMS/node_modules/react/index.js [client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
;
function AdminPanel() {
    _s();
    const [books, setBooks] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$CSX4107_FriMorning$2f$LMS$2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [, setReqs] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$CSX4107_FriMorning$2f$LMS$2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [newBook, setNewBook] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$CSX4107_FriMorning$2f$LMS$2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])({
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
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$CSX4107_FriMorning$2f$LMS$2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "AdminPanel.useEffect": ()=>{
            refresh();
        }
    }["AdminPanel.useEffect"], []);
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
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$CSX4107_FriMorning$2f$LMS$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "p-4",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$CSX4107_FriMorning$2f$LMS$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                children: "Admin Dashboard"
            }, void 0, false, {
                fileName: "[project]/Documents/CSX4107_FriMorning/LMS/src/components/AdminPanel.tsx",
                lineNumber: 56,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$CSX4107_FriMorning$2f$LMS$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                className: "mb-8 p-4 border rounded bg-gray-50",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$CSX4107_FriMorning$2f$LMS$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                        className: "font-bold mb-4 text-blue-700",
                        children: "Add New Book"
                    }, void 0, false, {
                        fileName: "[project]/Documents/CSX4107_FriMorning/LMS/src/components/AdminPanel.tsx",
                        lineNumber: 59,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$CSX4107_FriMorning$2f$LMS$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                        onSubmit: handleAddBook,
                        className: "grid grid-cols-1 md:grid-cols-2 gap-4",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$CSX4107_FriMorning$2f$LMS$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
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
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$CSX4107_FriMorning$2f$LMS$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
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
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$CSX4107_FriMorning$2f$LMS$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
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
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$CSX4107_FriMorning$2f$LMS$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
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
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$CSX4107_FriMorning$2f$LMS$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
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
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$CSX4107_FriMorning$2f$LMS$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                className: "font-bold mb-2",
                children: "Books Inventory"
            }, void 0, false, {
                fileName: "[project]/Documents/CSX4107_FriMorning/LMS/src/components/AdminPanel.tsx",
                lineNumber: 83,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$CSX4107_FriMorning$2f$LMS$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "space-y-2",
                children: books.map((b)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$CSX4107_FriMorning$2f$LMS$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex justify-between p-2 border-b",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$CSX4107_FriMorning$2f$LMS$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
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
                            b.status !== 'deleted' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$CSX4107_FriMorning$2f$LMS$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
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
_s(AdminPanel, "V6eGXpmO/MEO3oZFnhoQnwkfRXE=");
_c = AdminPanel;
var _c;
__turbopack_context__.k.register(_c, "AdminPanel");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Documents/CSX4107_FriMorning/LMS/src/components/UserPanel.tsx [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>UserPanel
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$CSX4107_FriMorning$2f$LMS$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/CSX4107_FriMorning/LMS/node_modules/react/jsx-dev-runtime.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$CSX4107_FriMorning$2f$LMS$2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/CSX4107_FriMorning/LMS/node_modules/react/index.js [client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
;
function UserPanel() {
    _s();
    const [books, setBooks] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$CSX4107_FriMorning$2f$LMS$2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [search, setSearch] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$CSX4107_FriMorning$2f$LMS$2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])({
        title: '',
        author: ''
    });
    const [targetDate, setTargetDate] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$CSX4107_FriMorning$2f$LMS$2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])('');
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
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$CSX4107_FriMorning$2f$LMS$2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "UserPanel.useEffect": ()=>{
            fetchBooks();
        // eslint-disable-next-line react-hooks/exhaustive-deps
        }
    }["UserPanel.useEffect"], [
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
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$CSX4107_FriMorning$2f$LMS$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "user-panel p-6 bg-white rounded-lg shadow-md",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$CSX4107_FriMorning$2f$LMS$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                className: "text-2xl font-bold mb-6 text-blue-800",
                children: "Library Catalog"
            }, void 0, false, {
                fileName: "[project]/Documents/CSX4107_FriMorning/LMS/src/components/UserPanel.tsx",
                lineNumber: 54,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$CSX4107_FriMorning$2f$LMS$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                className: "grid grid-cols-1 md:grid-cols-2 gap-4 mb-8",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$CSX4107_FriMorning$2f$LMS$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$CSX4107_FriMorning$2f$LMS$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                className: "block text-sm font-medium text-gray-700 mb-1",
                                children: "Search by Title"
                            }, void 0, false, {
                                fileName: "[project]/Documents/CSX4107_FriMorning/LMS/src/components/UserPanel.tsx",
                                lineNumber: 58,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$CSX4107_FriMorning$2f$LMS$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
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
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$CSX4107_FriMorning$2f$LMS$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$CSX4107_FriMorning$2f$LMS$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                className: "block text-sm font-medium text-gray-700 mb-1",
                                children: "Search by Author"
                            }, void 0, false, {
                                fileName: "[project]/Documents/CSX4107_FriMorning/LMS/src/components/UserPanel.tsx",
                                lineNumber: 67,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$CSX4107_FriMorning$2f$LMS$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
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
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$CSX4107_FriMorning$2f$LMS$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mb-8 p-4 bg-blue-50 rounded-md border border-blue-200",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$CSX4107_FriMorning$2f$LMS$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                        className: "block mb-2 font-bold text-blue-900",
                        children: "Step 1: Select Target Pick-up Date"
                    }, void 0, false, {
                        fileName: "[project]/Documents/CSX4107_FriMorning/LMS/src/components/UserPanel.tsx",
                        lineNumber: 78,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$CSX4107_FriMorning$2f$LMS$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
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
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$CSX4107_FriMorning$2f$LMS$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6",
                children: books.map((book)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$CSX4107_FriMorning$2f$LMS$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "border p-4 rounded-xl hover:shadow-lg transition-shadow bg-gray-50",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$CSX4107_FriMorning$2f$LMS$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                className: "text-lg font-bold text-gray-800",
                                children: book.title
                            }, void 0, false, {
                                fileName: "[project]/Documents/CSX4107_FriMorning/LMS/src/components/UserPanel.tsx",
                                lineNumber: 90,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$CSX4107_FriMorning$2f$LMS$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "text-sm text-gray-600 mt-2 space-y-1",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$CSX4107_FriMorning$2f$LMS$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        children: [
                                            "👤 Author: ",
                                            book.author
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Documents/CSX4107_FriMorning/LMS/src/components/UserPanel.tsx",
                                        lineNumber: 92,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$CSX4107_FriMorning$2f$LMS$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        children: [
                                            "📍 Location: ",
                                            book.location
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Documents/CSX4107_FriMorning/LMS/src/components/UserPanel.tsx",
                                        lineNumber: 93,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$CSX4107_FriMorning$2f$LMS$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        children: [
                                            "📚 Available: ",
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$CSX4107_FriMorning$2f$LMS$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
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
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$CSX4107_FriMorning$2f$LMS$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
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
            books.length === 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$CSX4107_FriMorning$2f$LMS$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
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
_s(UserPanel, "mlSI29lswEx0+vL56GXqZ78DMTo=");
_c = UserPanel;
var _c;
__turbopack_context__.k.register(_c, "UserPanel");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Documents/CSX4107_FriMorning/LMS/pages/index.tsx [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$CSX4107_FriMorning$2f$LMS$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/CSX4107_FriMorning/LMS/node_modules/react/jsx-dev-runtime.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$CSX4107_FriMorning$2f$LMS$2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/CSX4107_FriMorning/LMS/node_modules/react/index.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$CSX4107_FriMorning$2f$LMS$2f$src$2f$components$2f$AdminPanel$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/CSX4107_FriMorning/LMS/src/components/AdminPanel.tsx [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$CSX4107_FriMorning$2f$LMS$2f$src$2f$components$2f$UserPanel$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/CSX4107_FriMorning/LMS/src/components/UserPanel.tsx [client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
;
;
;
function App() {
    _s();
    const [user, setUser] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$CSX4107_FriMorning$2f$LMS$2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(null);
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
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$CSX4107_FriMorning$2f$LMS$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            style: {
                display: 'flex',
                justifyContent: 'center',
                marginTop: '50px'
            },
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$CSX4107_FriMorning$2f$LMS$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                onSubmit: handleLogin,
                style: {
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px',
                    width: '300px'
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$CSX4107_FriMorning$2f$LMS$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                        children: "Library System Login"
                    }, void 0, false, {
                        fileName: "[project]/Documents/CSX4107_FriMorning/LMS/pages/index.tsx",
                        lineNumber: 32,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$CSX4107_FriMorning$2f$LMS$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                        name: "email",
                        type: "email",
                        placeholder: "Email",
                        required: true
                    }, void 0, false, {
                        fileName: "[project]/Documents/CSX4107_FriMorning/LMS/pages/index.tsx",
                        lineNumber: 33,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$CSX4107_FriMorning$2f$LMS$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                        name: "password",
                        type: "password",
                        placeholder: "Password",
                        required: true
                    }, void 0, false, {
                        fileName: "[project]/Documents/CSX4107_FriMorning/LMS/pages/index.tsx",
                        lineNumber: 34,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$CSX4107_FriMorning$2f$LMS$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
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
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$CSX4107_FriMorning$2f$LMS$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        style: {
            padding: '20px'
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$CSX4107_FriMorning$2f$LMS$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("nav", {
                style: {
                    marginBottom: '20px',
                    borderBottom: '1px solid #ccc',
                    paddingBottom: '10px'
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$CSX4107_FriMorning$2f$LMS$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
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
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$CSX4107_FriMorning$2f$LMS$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
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
            user.role === 'ADMIN' ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$CSX4107_FriMorning$2f$LMS$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$CSX4107_FriMorning$2f$LMS$2f$src$2f$components$2f$AdminPanel$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                fileName: "[project]/Documents/CSX4107_FriMorning/LMS/pages/index.tsx",
                lineNumber: 47,
                columnNumber: 32
            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$CSX4107_FriMorning$2f$LMS$2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$CSX4107_FriMorning$2f$LMS$2f$src$2f$components$2f$UserPanel$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
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
_s(App, "Iei9RGtZU29Y1RhBe1sbfh/MntA=");
_c = App;
const __TURBOPACK__default__export__ = App;
var _c;
__turbopack_context__.k.register(_c, "App");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[next]/entry/page-loader.ts { PAGE => \"[project]/Documents/CSX4107_FriMorning/LMS/pages/index.tsx [client] (ecmascript)\" } [client] (ecmascript)", ((__turbopack_context__, module, exports) => {

const PAGE_PATH = "/";
(window.__NEXT_P = window.__NEXT_P || []).push([
    PAGE_PATH,
    ()=>{
        return __turbopack_context__.r("[project]/Documents/CSX4107_FriMorning/LMS/pages/index.tsx [client] (ecmascript)");
    }
]);
// @ts-expect-error module.hot exists
if (module.hot) {
    // @ts-expect-error module.hot exists
    module.hot.dispose(function() {
        window.__NEXT_P.push([
            PAGE_PATH
        ]);
    });
}
}),
"[hmr-entry]/hmr-entry.js { ENTRY => \"[project]/Documents/CSX4107_FriMorning/LMS/pages/index\" }", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.r("[next]/entry/page-loader.ts { PAGE => \"[project]/Documents/CSX4107_FriMorning/LMS/pages/index.tsx [client] (ecmascript)\" } [client] (ecmascript)");
}),
]);

//# sourceMappingURL=%5Broot-of-the-server%5D__a21d5e8a._.js.map