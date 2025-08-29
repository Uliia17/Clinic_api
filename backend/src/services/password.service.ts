import bcrypt from "bcryptjs";

class PasswordService {
    public comparePassword(
        password: string,
        hashedPassword: string,
    ): Promise<boolean> {
        return bcrypt.compare(password, hashedPassword);
    }
}

export const passwordService = new PasswordService();
