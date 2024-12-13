import { PrismaClient, Prisma } from "@prisma/client";
import { Request, Response, NextFunction } from "express";
import asyncHandler from "express-async-handler";
import { AdvancedResults } from "../types/interfaces";
import { db } from "../utils/db.server";

type ModelDelegate = keyof PrismaClient;

const advancedResults = (model: ModelDelegate) =>
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    let results: any;

    // Copy req.query
    const reqQuery = { ...req.query };

    // Fields to exclude
    const removeFields = ["select", "sort", "page", "limit", "include"];

    // Loop over removeFields and delete them from reqQuery
    removeFields.forEach((param) => delete reqQuery[param]);

    // Prisma filters
    const filters: Record<string, any> = {};

    if (reqQuery) {
      Object.keys(reqQuery).forEach((key) => {
        if (["gt", "gte", "lt", "lte", "in"].includes(key)) {
          filters[key] = { [`${key}`]: reqQuery[key] };
        } else {
          filters[key] = !isNaN(Number(reqQuery[key]))
            ? Number(reqQuery[key])
            : reqQuery[key];
        }
      });
    }

    // Pagination
    const page = parseInt(req.query.page as string, 10) || 1;
    const limit = parseInt(req.query.limit as string, 10) || 25;
    const startIndex = (page - 1) * limit;

    // Get model metadata
    const modelInfo = Prisma.dmmf.datamodel.models.find(
      (m) => m.name.toLowerCase() === model.toString().toLowerCase()
    );

    // Build include object for relations up to 3 levels deep
    const buildIncludeObject = (
      modelName: string,
      depth: number = 0
    ): Record<string, any> => {
      if (depth >= 3) return {}; // Change depth limit to 3

      const modelMetadata = Prisma.dmmf.datamodel.models.find(
        (m) => m.name.toLowerCase() === modelName.toLowerCase()
      );

      if (!modelMetadata) return {};

      const include: Record<string, any> = {};

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
    const availableFields = modelInfo?.fields.map((field) => field.name) || [];

    // Build orderBy object
    let orderBy = {};
    if (req.query.sort && typeof req.query.sort === "string") {
      const sortField = req.query.sort;
      if (availableFields.includes(sortField)) {
        orderBy = { [sortField]: "asc" };
      }
    } else if (availableFields.includes("id")) {
      orderBy = { id: "desc" };
    }

    // Handle specific includes from query
    let specificIncludes: Record<string, any> = {};
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
    const finalInclude = {
      ...include,
      ...specificIncludes,
    };

    // Query using Prisma
    const query = (db[model] as any).findMany({
      where: filters,
      skip: startIndex,
      take: limit,
      orderBy,
      include: Object.keys(finalInclude).length > 0 ? finalInclude : undefined,
    });

    results = await query;

    // Get total count
    const total = await (db[model] as any).count({
      where: filters,
    });

    // Pagination result
    const pagination: Record<string, any> = {};

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

    const responseData: AdvancedResults = {
      success: true,
      count: results.length,
      pagination,
      data: results,
    };

    res.advancedResults = responseData;

    next();
  });

export default advancedResults;
