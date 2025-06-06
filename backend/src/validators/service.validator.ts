import joi from "joi";
import { QueryOrderEnumServices } from "../enums/query-order.enum";

export class ServiceValidator {
    private static nameSchema = joi.string().regex(/^[A-Z][a-z]{1,14}$/);

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
                    ...Object.values(QueryOrderEnumServices),
                    ...Object.values(QueryOrderEnumServices).map(
                        (item) => `-${item}`,
                    ),
                ],
            ),
    });
}
