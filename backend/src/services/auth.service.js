import { ApiError } from "../errors/api.error";
import { tokenRepository } from "../repositories/token.repository";
import { passwordService } from "./password.service";
import { tokenService } from "./token.service";
import { StatusCodesEnum } from "../enums/status.codes.enum";
import { doctorService } from "./doctor.service";
import { doctorRepository } from "../repositories/doctor.repository";
import { RoleEnum } from "../enums/role.enum";
import { emailService } from "./email.service";
import { templatesConstants } from "../constants/templates.constants";
class AuthService {
    async signUp(doctor) {
        if (doctor.role && doctor.role === RoleEnum.ADMIN) {
            throw new ApiError("Cannot register admin this way", StatusCodesEnum.FORBIDDEN);
        }
        await doctorService.isEmailUnique(doctor.email);
        const password = await passwordService.hashPassword(doctor.password);
        const newDoctor = await doctorRepository.create({
            ...doctor,
            password,
            isVerified: true, // ← тимчасово для тестів без підтвердження пошти
        });
        const tokens = tokenService.generateTokens({
            doctorId: newDoctor._id,
            role: newDoctor.role,
        });
        await tokenRepository.create({ ...tokens, _doctorId: newDoctor._id });
        await emailService.sendEmail(newDoctor.email, "Welcome", templatesConstants.WELCOME, { name: newDoctor.name });
        await emailService.sendEmail(newDoctor.email, "Welcome", templatesConstants.WELCOME, { name: newDoctor.name });
        return { doctor: newDoctor, tokens };
    }
    async signIn(dto) {
        const doctor = await doctorRepository.getByEmail(dto.email);
        if (!doctor) {
            throw new ApiError("Invalid email or password", StatusCodesEnum.UNAUTHORIZED);
        }
        const isValidPassword = await passwordService.comparePassword(dto.password, doctor.password);
        if (!isValidPassword) {
            throw new ApiError("Invalid email or password", StatusCodesEnum.UNAUTHORIZED);
        }
        const tokens = tokenService.generateTokens({
            doctorId: doctor._id,
            role: doctor.role,
        });
        await tokenRepository.create({ ...tokens, _doctorId: doctor._id });
        return { doctor, tokens };
    }
}
export const authService = new AuthService();
