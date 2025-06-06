import joi from "joi";
import { QueryOrderEnumDoctors } from "../enums/query-order.enum";

export class DoctorValidator {
    private static nameSchema = joi.string().regex(/^[A-Z][a-z]{1,14}$/);
    private static surname = joi.string().regex(/^[A-Z][a-z]{1,14}$/);
    private static phone = joi.string().pattern(/^\+380\d{9}$/);
    private static email = joi.string().email({ tlds: { allow: false } });
    private static password = joi.string().min(6).required();
    private static clinics = joi.array().items(joi.string()).required();
    private static services = joi.array().items(joi.string()).required();

    public static create = joi.object({
        name: this.nameSchema.required(),
        surname: this.surname.required(),
        phone: this.phone.required(),
        email: this.email.required(),
        password: this.password.required(),
        clinics: this.clinics.required(),
        services: this.services.required(),
    });

    public static update = joi.object({
        name: this.nameSchema.required(),
        surname: this.surname.required(),
        phone: this.phone.required(),
        email: this.email.required(),
        clinics: this.clinics.required(),
        services: this.services.required(),
    });
    public static query = joi.object({
        pageSize: joi.number().min(1).max(100).default(10),
        page: joi.number().min(1).default(1),
        search: joi.string().trim(),
        order: joi
            .string()
            .valid(
                ...[
                    ...Object.values(QueryOrderEnumDoctors),
                    ...Object.values(QueryOrderEnumDoctors).map(
                        (item) => `-${item}`,
                    ),
                ],
            ),
        name: this.nameSchema.optional(),
        surname: this.surname.optional(),
        phone: this.phone.optional(),
        email: this.email.optional(),
    });
}
