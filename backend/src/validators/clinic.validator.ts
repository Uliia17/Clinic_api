import joi from "joi";
import { QueryOrderEnumClinics } from "../enums/query-order.enum";
import { Types } from "mongoose";

export class ClinicValidator {
    private static nameSchema = joi
        .string()
        .pattern(/^[А-ЯA-ZІЇЄҐ][А-ЯA-Za-zа-яіїєґ0-9\s .-]{1,24}$/)
        .required();

    private static objectId = joi.string().custom((value, helpers) => {
        if (!Types.ObjectId.isValid(value)) {
            return helpers.error("any.invalid");
        }
        return value;
    }, "ObjectId validation");

    public static create = joi.object({
        name: this.nameSchema,
        address: joi.string().max(100).optional(),
        doctors: joi.array().items(this.objectId).optional(),
        services: joi.array().items(this.objectId).optional(),
    });

    public static update = joi.object({
        name: this.nameSchema.optional(),
        address: joi.string().trim().min(3).max(200).optional(),
    });

    public static query = joi.object({
        name: joi.string().trim().optional(),
        doctorId: this.objectId.optional(),
        serviceId: this.objectId.optional(),
        order: joi
            .string()
            .valid(
                ...Object.values(QueryOrderEnumClinics),
                ...Object.values(QueryOrderEnumClinics).map((v) => `-${v}`),
            )
            .optional(),
    });
}
