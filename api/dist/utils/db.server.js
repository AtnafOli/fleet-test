"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = void 0;
const client_1 = require("@prisma/client");
let db;
const createPrismaClient = () => {
    const client = new client_1.PrismaClient({
        log: ["query", "info", "warn", "error"],
    });
    client.$connect().catch((error) => {
        console.error("Failed to connect to the database:", error);
        process.exit(1);
    });
    return client;
};
// Init prisma client, using the global instance if it exists
if (process.env.NODE_ENV == "development") {
    if (!global.__db) {
        global.__db = createPrismaClient();
    }
    exports.db = db = global.__db;
}
else {
    exports.db = db = createPrismaClient();
}
