var _a;
import joi from "joi";
export class ClinicValidator {
}
_a = ClinicValidator;
ClinicValidator.nameSchema = joi
    .string()
    .regex(/^[А-ЯA-Z][а-яa-z0-9\s’" -]{1,24}$/);
ClinicValidator.create = joi.object({
    name: _a.nameSchema.required(),
});
ClinicValidator.update = joi.object({
    name: _a.nameSchema.required(),
});
