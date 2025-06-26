import { Types } from "mongoose";
import { ApiError } from "../errors/api.error";
import { ITokenPair } from "../interfaces/token.interface";
import { tokenRepository } from "../repositories/token.repository";
import { passwordService } from "./password.service";
import { tokenService } from "./token.service";
import { IAuth } from "../interfaces/auth.interface";
import { StatusCodesEnum } from "../enums/status.codes.enum";
import { IDoctor, IDoctorCreateDTO } from "../interfaces/doctor.interface";
import { RoleEnum } from "../enums/role.enum";
import { emailService } from "./email.service";
import { ActionTokenTypeEnum } from "../enums/action.token.type.enum";
import { doctorService } from "./doctor.service";
import { doctorRepository } from "../repositories/doctor.repository";
import { EmailEnum } from "../enums/email.enum";
import { config } from "../configs/config";
import { emailConstants } from "../constants/email.constants";

class AuthService {
    public async signUp(
        doctorDTO: IDoctorCreateDTO,
    ): Promise<{ doctor: IDoctor; tokens: ITokenPair }> {
        if (doctorDTO.role === RoleEnum.ADMIN) {
            throw new ApiError(
                "Cannot register admin this way",
                StatusCodesEnum.FORBIDDEN,
            );
        }

        await doctorService.isEmailUnique(doctorDTO.email);

        const clinics = doctorDTO.clinics.map((id) => new Types.ObjectId(id));
        const services = doctorDTO.services.map((id) => new Types.ObjectId(id));
        const hashedPassword = await passwordService.hashPassword(
            doctorDTO.password,
        );
        const newDoctor = await doctorRepository.create({
            ...doctorDTO,
            password: hashedPassword,
            clinics,
            services,
        });

        const tokens = tokenService.generateTokens({
            doctorId: newDoctor._id.toString(),
            role: newDoctor.role,
        });

        await tokenRepository.create({
            ...tokens,
            _doctorId: newDoctor._id,
        });

        const actionToken = tokenService.generateActionToken(
            {
                doctorId: newDoctor._id.toString(),
                role: newDoctor.role,
            },
            ActionTokenTypeEnum.ACTIVATE,
        );

        await emailService.sendEmail(
            newDoctor.email,
            emailConstants[EmailEnum.ACTIVATE],
            {
                name: newDoctor.name,
                url: `${config.FRONTEND_URL}/activate/${actionToken}`,
            },
        );

        return { doctor: newDoctor, tokens };
    }

    public async signIn(
        dto: IAuth,
    ): Promise<{ doctor: IDoctor; tokens: ITokenPair }> {
        const doctor = await doctorRepository.getByEmail(dto.email);

        if (!doctor) {
            throw new ApiError(
                "Email or password invalid",
                StatusCodesEnum.UNAUTHORIZED,
            );
        }

        if (!doctor.isActive) {
            throw new ApiError(
                "Account is not active",
                StatusCodesEnum.FORBIDDEN,
            );
        }

        const isValidPassword = await passwordService.comparePassword(
            dto.password,
            doctor.password,
        );

        if (!isValidPassword) {
            throw new ApiError(
                "Invalid email or password",
                StatusCodesEnum.UNAUTHORIZED,
            );
        }

        const tokens = tokenService.generateTokens({
            doctorId: doctor._id.toString(),
            role: doctor.role,
        });

        await tokenRepository.create({
            ...tokens,
            _doctorId: doctor._id,
        });

        return { doctor, tokens };
    }

    public async activate(token: string): Promise<IDoctor> {
        const { doctorId } = tokenService.verifyToken(
            token,
            ActionTokenTypeEnum.ACTIVATE,
        );

        const doctor = await doctorService.updateById(doctorId, {
            isActive: true,
            isVerified: true,
        });

        return doctor;
    }

    public async recoveryPasswordRequest(doctor: IDoctor): Promise<void> {
        const token = tokenService.generateActionToken(
            {
                doctorId: doctor._id.toString(),
                role: doctor.role,
            },
            ActionTokenTypeEnum.RECOVERY,
        );

        const url = `${config.FRONTEND_URL}/recovery/${token}`;

        await emailService.sendEmail(
            doctor.email,
            emailConstants[EmailEnum.RECOVERY],
            { url },
        );
    }

    public async recoveryPassword(
        token: string,
        password: string,
    ): Promise<IDoctor> {
        const { doctorId } = tokenService.verifyToken(
            token,
            ActionTokenTypeEnum.RECOVERY,
        );

        const hashedPassword = await passwordService.hashPassword(password);
        const doctor = await doctorService.updateById(doctorId, {
            password: hashedPassword,
        });

        return doctor;
    }

    public async registerAdmin(
        email: string,
        password: string,
    ): Promise<IDoctor> {
        const existing = await doctorRepository.getByEmail(email);
        if (existing) {
            throw new ApiError(
                "Admin already exists",
                StatusCodesEnum.BAD_REQUEST,
            );
        }

        const hashed = await passwordService.hashPassword(password);

        const admin = await doctorRepository.create({
            email,
            password: hashed,
            name: "Admin",
            surname: "Superuser",
            phone: "+380000000000",
            role: RoleEnum.ADMIN,
            clinics: [],
            services: [],
        });

        const token = tokenService.generateActionToken(
            {
                doctorId: admin._id.toString(),
                role: admin.role,
            },
            ActionTokenTypeEnum.ACTIVATE,
        );

        await emailService.sendEmail(
            email,
            emailConstants[EmailEnum.ACTIVATE],
            {
                name: admin.name,
                url: `${config.FRONTEND_URL}/activate/${token}`,
            },
        );

        return admin;
    }
}

export const authService = new AuthService();
