import Joi from "joi";
import { Types } from "mongoose";
import { QueryOrderEnumDoctors } from "../enums/query-order.enum";
import { RoleEnum } from "../enums/role.enum";

const objectIdOrName = Joi.alternatives().try(
    Joi.string().custom((value, helpers) => {
        // allow both ObjectId strings and throw otherwise here (this branch only for ObjectId)
        if (Types.ObjectId.isValid(value)) return value;
        return helpers.error("any.invalid");
    }, "ObjectId validation"),
    Joi.string().min(1), // або проста назва (наприклад "Odrex")
);

const nameSchema = Joi.string().pattern(/^[A-Z][a-z]{1,14}$/);
const surnameSchema = Joi.string().pattern(/^[A-Z][a-z]{1,14}$/);
const phoneSchema = Joi.string().pattern(/^\+380\d{9}$/);
const emailSchema = Joi.string().email({ tlds: { allow: false } });
const passwordSchema = Joi.string().min(6);

export const DoctorValidator = {
    create: Joi.object({
        name: nameSchema.required(),
        surname: surnameSchema.required(),
        phone: phoneSchema.required(),
        email: emailSchema.required(),
        password: passwordSchema.required(),
        clinics: Joi.array().items(objectIdOrName).min(1).required(),
        services: Joi.array().items(objectIdOrName).min(1).required(),
        role: Joi.string()
            .valid(...Object.values(RoleEnum))
            .optional(),
        avatar: Joi.string().uri().optional(),
    }),

    update: Joi.object({
        name: nameSchema.optional(),
        surname: surnameSchema.optional(),
        phone: phoneSchema.optional(),
        email: emailSchema.optional(),
        password: passwordSchema.optional(),
        clinics: Joi.array().items(objectIdOrName).optional(),
        services: Joi.array().items(objectIdOrName).optional(),
        avatar: Joi.string().uri().optional(),
        isVerified: Joi.boolean().optional(),
        isActive: Joi.boolean().optional(),
    }),

    query: Joi.object({
        page: Joi.number().min(1).default(1),
        pageSize: Joi.number().min(1).max(100).default(10),
        search: Joi.string().trim().optional(),
        order: Joi.string()
            .valid(
                ...Object.values(QueryOrderEnumDoctors),
                ...Object.values(QueryOrderEnumDoctors).map((f) => `-${f}`),
            )
            .optional(),
        name: nameSchema.optional(),
        surname: surnameSchema.optional(),
        phone: phoneSchema.optional(),
        email: emailSchema.optional(),
    }).default({}),
};
