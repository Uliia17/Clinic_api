import bcrypt from "bcrypt";
class PasswordService {
    hashPassword(password) {
        return bcrypt.hash(password, 10);
    }
    comparePassword(password, hashedPassword) {
        return bcrypt.compare(password, hashedPassword);
    }
}
export const passwordService = new PasswordService();
