import joi from "joi";

export class AuthValidator {
    private static email = joi.string().email().required();

    private static password = joi
        .string()
        .min(6)
        .max(32)
        .pattern(/^(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[^\w\s:]).+$/)
        .message(
            "Password must include uppercase, lowercase, number and special character",
        )
        .required();

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
