import joi from "joi";
import { QueryOrderEnumClinics } from "../enums/query-order.enum";

export class ClinicValidator {
    private static nameSchema = joi
        .string()
        .pattern(/^[А-ЯA-Z][А-ЯA-Za-zа-яa-z0-9\s’" -]{1,24}$/);

    private static objectId = joi.string().regex(/^[a-f\d]{24}$/i);

    public static create = joi.object({
        name: this.nameSchema.required(),
    });

    public static update = joi.object({
        name: this.nameSchema.optional(),
        doctors: joi.array().items(this.objectId).optional(),
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
