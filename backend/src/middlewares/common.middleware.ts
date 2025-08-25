import { NextFunction, Request, Response } from "express";
import { ObjectSchema } from "joi";
import { isObjectIdOrHexString } from "mongoose";

import { ApiError } from "../errors/api.error";

class CommonMiddleware {
    public isIdValidate(key: string) {
        return (req: Request, res: Response, next: NextFunction) => {
            try {
                const id = req.params[key];

                if (!isObjectIdOrHexString(id)) {
                    throw new ApiError(`${key}: ${id} is invalid ID`, 400);
                }
                next();
            } catch (e) {
                next(e);
            }
        };
    }

    public validateBody(validator: ObjectSchema) {
        return async (req: Request, res: Response, next: NextFunction) => {
            try {
                req.body = await validator.validateAsync(req.body);
                next();
            } catch (e: unknown) {
                if (e && typeof e === "object" && "details" in e) {
                    next(new ApiError(e.details[0].message, 400));
                } else {
                    next(new ApiError("Validation error", 400));
                }
            }
        };
    }

    public query(validator: ObjectSchema) {
        return async (req: Request, res: Response, next: NextFunction) => {
            try {
                const validated = await validator.validateAsync(
                    req.query ?? {},
                    {
                        abortEarly: false,
                        allowUnknown: true,
                        stripUnknown: true,
                        convert: true,
                    },
                );

                (req as any).validatedQuery = validated;

                next();
            } catch (e: any) {
                if (process.env.NODE_ENV !== "production") {
                    console.error("Joi query error:", e?.details ?? e);
                }
                if (e.isJoi && e.details) {
                    next(new ApiError(e.details[0].message, 400));
                } else {
                    next(new ApiError("Query validation error", 400));
                }
            }
        };
    }
}

export const commonMiddleware = new CommonMiddleware();
