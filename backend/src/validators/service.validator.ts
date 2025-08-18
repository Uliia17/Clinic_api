import joi from "joi";
import { QueryOrderEnumServices } from "../enums/query-order.enum";

const nameSchema = joi
    .string()
    .pattern(/^[А-ЯA-ZІЇЄҐ][А-ЯA-Za-zа-яіїєґ0-9\s’" -]{1,50}$/)
    .optional();

export class ServiceValidator {
    public static create = joi.object({
        name: joi.string().trim().required(),
    });

    public static update = joi.object({
        name: joi.string().trim().required(),
    });

    public static query = joi.object({
        name: nameSchema,
        order: joi
            .string()
            .valid(
                ...Object.values(QueryOrderEnumServices),
                ...Object.values(QueryOrderEnumServices).map((v) => `-${v}`),
            )
            .optional(),
        page: joi.number().min(1).default(1),
        pageSize: joi.number().min(1).max(100).default(10),
    });
}
