var _a;
import joi from "joi";
export class ServiceValidator {
}
_a = ServiceValidator;
ServiceValidator.nameSchema = joi.string().regex(/^[A-Z][a-z]{1,14}$/);
ServiceValidator.create = joi.object({
    name: _a.nameSchema.required(),
});
ServiceValidator.update = joi.object({
    name: _a.nameSchema.required(),
});
