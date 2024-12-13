"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const db_server_1 = require("../utils/db.server");
const advancedResults = (model) => (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let results;
    // Copy req.query
    const reqQuery = Object.assign({}, req.query);
    // Fields to exclude
    const removeFields = ["select", "sort", "page", "limit", "include"];
    // Loop over removeFields and delete them from reqQuery
    removeFields.forEach((param) => delete reqQuery[param]);
    // Prisma filters
    const filters = {};
    if (reqQuery) {
        Object.keys(reqQuery).forEach((key) => {
            if (["gt", "gte", "lt", "lte", "in"].includes(key)) {
                filters[key] = { [`${key}`]: reqQuery[key] };
            }
            else {
                filters[key] = !isNaN(Number(reqQuery[key]))
                    ? Number(reqQuery[key])
                    : reqQuery[key];
            }
        });
    }
    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 25;
    const startIndex = (page - 1) * limit;
    // Get model metadata
    const modelInfo = client_1.Prisma.dmmf.datamodel.models.find((m) => m.name.toLowerCase() === model.toString().toLowerCase());
    // Build include object for relations up to 3 levels deep
    const buildIncludeObject = (modelName, depth = 0) => {
        if (depth >= 3)
            return {}; // Change depth limit to 3
        const modelMetadata = client_1.Prisma.dmmf.datamodel.models.find((m) => m.name.toLowerCase() === modelName.toLowerCase());
        if (!modelMetadata)
            return {};
        const include = {};
        modelMetadata.fields
            .filter((field) => field.kind === "object")
            .forEach((field) => {
            const relationType = field.type;
            include[field.name] = {
                include: buildIncludeObject(relationType, depth + 1),
            };
        });
        return include;
    };
    const include = buildIncludeObject(model.toString());
    // Determine available fields for sorting
    const availableFields = (modelInfo === null || modelInfo === void 0 ? void 0 : modelInfo.fields.map((field) => field.name)) || [];
    // Build orderBy object
    let orderBy = {};
    if (req.query.sort && typeof req.query.sort === "string") {
        const sortField = req.query.sort;
        if (availableFields.includes(sortField)) {
            orderBy = { [sortField]: "asc" };
        }
    }
    else if (availableFields.includes("id")) {
        orderBy = { id: "desc" };
    }
    // Handle specific includes from query
    let specificIncludes = {};
    if (req.query.include && typeof req.query.include === "string") {
        const requestedIncludes = req.query.include
            .split(",")
            .map((i) => i.trim());
        requestedIncludes.forEach((includeField) => {
            if (availableFields.includes(includeField)) {
                specificIncludes[includeField] = true;
            }
        });
    }
    // Merge specific includes with automatic includes
    const finalInclude = Object.assign(Object.assign({}, include), specificIncludes);
    // Query using Prisma
    const query = db_server_1.db[model].findMany({
        where: filters,
        skip: startIndex,
        take: limit,
        orderBy,
        include: Object.keys(finalInclude).length > 0 ? finalInclude : undefined,
    });
    results = yield query;
    // Get total count
    const total = yield db_server_1.db[model].count({
        where: filters,
    });
    // Pagination result
    const pagination = {};
    if (startIndex + limit < total) {
        pagination.next = {
            page: page + 1,
            limit,
        };
    }
    if (startIndex > 0) {
        pagination.prev = {
            page: page - 1,
            limit,
        };
    }
    const responseData = {
        success: true,
        count: results.length,
        pagination,
        data: results,
    };
    res.advancedResults = responseData;
    next();
}));
exports.default = advancedResults;
