import joi from "joi";

export class AuthValidator {
    private static email = joi.string().email().required();
    private static password = joi.string().min(6).required();
    private static refresh = joi.string().trim();

    public static refreshToken = joi.object({
        refreshToken: this.refresh.required(),
    });

    public static registerAdmin = joi.object({
        email: this.email,
        password: this.password,
    });

    public static validatePassword = joi.object({
        password: this.password.required(),
    });
}
