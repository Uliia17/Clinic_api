var _a;
import joi from "joi";
export class AuthValidator {
}
_a = AuthValidator;
AuthValidator.email = joi.string().email().required();
AuthValidator.password = joi.string().min(6).required();
AuthValidator.refresh = joi.string().trim();
AuthValidator.refreshToken = joi.object({
    refreshToken: _a.refresh.required(),
});
AuthValidator.registerAdmin = joi.object({
    email: _a.email,
    password: _a.password,
});
