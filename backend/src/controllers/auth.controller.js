import { tokenRepository } from "../repositories/token.repository";
import { authService } from "../services/auth.service";
import { tokenService } from "../services/token.service";
import { StatusCodesEnum } from "../enums/status.codes.enum";
import { doctorService } from "../services/doctor.service";
import { doctorRepository } from "../repositories/doctor.repository";
import { ApiError } from "../errors/api.error";
import { passwordService } from "../services/password.service";
import { RoleEnum } from "../enums/role.enum";
class AuthController {
    async signUp(req, res, next) {
        try {
            const body = req.body;
            const data = await authService.signUp(body);
            res.status(StatusCodesEnum.CREATED).json(data);
        }
        catch (e) {
            next(e);
        }
    }
    async signIn(req, res, next) {
        try {
            const dto = req.body;
            const data = await authService.signIn(dto);
            res.status(StatusCodesEnum.OK).json(data);
        }
        catch (e) {
            next(e);
        }
    }
    async me(req, res, next) {
        try {
            const tokenPayload = res.locals.tokenPayload;
            const { doctorId } = tokenPayload;
            const doctor = await doctorService.getById(doctorId);
            res.status(StatusCodesEnum.OK).json(doctor);
        }
        catch (e) {
            next(e);
        }
    }
    async refresh(req, res, next) {
        try {
            const { role, doctorId } = res.locals.tokenPayload;
            const tokens = tokenService.generateTokens({ role, doctorId });
            await tokenRepository.create({ ...tokens, _doctorId: doctorId });
            res.status(StatusCodesEnum.OK).json(tokens);
        }
        catch (e) {
            next(e);
        }
    }
    async registerAdmin(req, res, next) {
        try {
            const { email, password } = req.body;
            const existing = await doctorRepository.getByEmail(email);
            if (existing) {
                throw new ApiError("Admin already exists", StatusCodesEnum.BAD_REQUEST);
            }
            const hashed = await passwordService.hashPassword(password);
            const admin = await doctorRepository.create({
                email,
                password: hashed,
                name: "Admin",
                surname: "Superuser",
                phone: "+380000000000",
                role: RoleEnum.ADMIN,
                isVerified: true,
                clinics: [],
                services: [],
            });
            res.status(StatusCodesEnum.CREATED).json({
                message: "Admin created",
                admin,
            });
        }
        catch (e) {
            next(e);
        }
    }
}
export const authController = new AuthController();
