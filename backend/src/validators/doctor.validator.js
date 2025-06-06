var _a;
import joi from "joi";
export class DoctorValidator {
}
_a = DoctorValidator;
DoctorValidator.nameSchema = joi.string().regex(/^[A-Z][a-z]{1,14}$/);
DoctorValidator.surname = joi.string().regex(/^[A-Z][a-z]{1,14}$/);
DoctorValidator.phone = joi.string().pattern(/^\+380\d{9}$/);
DoctorValidator.email = joi.string().email({ tlds: { allow: false } });
DoctorValidator.create = joi.object({
    name: _a.nameSchema.required(),
    surname: _a.surname.required(),
    phone: _a.phone.required(),
    email: _a.email.required(),
});
DoctorValidator.update = joi.object({
    name: _a.nameSchema.required(),
    surname: _a.surname.required(),
    phone: _a.phone.required(),
    email: _a.email.required(),
});
