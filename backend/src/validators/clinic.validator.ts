import joi from "joi";
import { QueryOrderEnumClinics } from "../enums/query-order.enum";

export class ClinicValidator {
    private static nameSchema = joi
        .string()
        .pattern(/^[А-ЯA-Z][А-ЯA-Za-zа-яa-z0-9\s’" -]{1,24}$/)
        .required();

    public static create = joi.object({
        name: this.nameSchema.required(),
    });

    public static update = joi.object({
        name: this.nameSchema.required(),
    });
    public static query = joi.object({
        search: joi.string().trim(),
        order: joi
            .string()
            .valid(
                ...[
                    ...Object.values(QueryOrderEnumClinics),
                    ...Object.values(QueryOrderEnumClinics).map(
                        (item) => `-${item}`,
                    ),
                ],
            ),
    });
}
