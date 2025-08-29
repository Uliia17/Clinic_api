import joi from "joi";
import { QueryOrderEnumServices } from "../enums/query-order.enum";

const nameSchema = joi
    .string()
    .pattern(/^[А-ЯA-ZІЇЄҐа-яa-zіїєґ0-9\s’" -]{1,50}$/)
    .optional();

export class ServiceValidator {
    public static create = joi.object({
        name: joi.string().trim().required(),
    });

    public static nameSchema = joi.string().trim().min(2).max(100);

    public static update = joi
        .object({
            name: this.nameSchema.optional(),

            clinics: joi
                .array()
                .items(joi.string().hex().length(24)) // тільки ObjectId
                .optional(),

            services: joi
                .array()
                .items(joi.string().hex().length(24)) // тільки ObjectId
                .optional(),

            doctors: joi
                .array()
                .items(joi.string().hex().length(24)) // тільки ObjectId
                .optional(),
        })
        .min(1);

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
