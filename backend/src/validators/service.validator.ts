import joi from "joi";
import { QueryOrderEnumServices } from "../enums/query-order.enum";

const nameSchema = joi
    .string()
    .pattern(/^[А-ЯA-ZІЇЄҐ][А-ЯA-Za-zа-яіїєґ0-9\s’" -]{1,50}$/)
    .required();

export class ServiceValidator {
    public static create = joi.object({
        name: nameSchema,
    });

    public static update = joi.object({
        name: nameSchema,
    });

    public static query = joi.object({
        name: joi.string().trim().optional(),
        order: joi
            .string()
            .valid(
                ...Object.values(QueryOrderEnumServices),
                ...Object.values(QueryOrderEnumServices).map((v) => `-${v}`),
            )
            .optional(),
    });
}
