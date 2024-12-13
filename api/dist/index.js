"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const not_found_1 = require("./middlewares/not-found");
const errorHandler_1 = require("./middlewares/errorHandler");
const routes_1 = __importDefault(require("./routes"));
const logger_1 = __importDefault(require("./utils/logger"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const app = (0, express_1.default)();
app.use((req, res, next) => {
    logger_1.default.info(`Received request: ${req.method} ${req.url}`);
    next();
});
app.use((0, cors_1.default)({
    origin: [
        ...Array.from({ length: 65535 }, (_, i) => `http://localhost:${i + 1}`),
        "https://nice-events.vercel.app",
        "http://localhost:3000",
    ],
    credentials: true,
}));
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.json({ limit: "10mb" }));
// Routes
app.use("/api", routes_1.default);
// Catch 404 routes
app.use(not_found_1.notFoundHandler);
// global error handler
app.use((err, req, res, next) => {
    (0, errorHandler_1.errorHandler)(err, req, res, next);
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    logger_1.default.info(`Server running on port ${PORT}`);
});
