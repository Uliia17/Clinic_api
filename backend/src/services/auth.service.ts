import { Types } from "mongoose";
import { ApiError } from "../errors/api.error";
import { ITokenPair } from "../interfaces/token.interface";
import { tokenRepository } from "../repositories/token.repository";
import { passwordService } from "./password.service";
import { tokenService } from "./token.service";
import { IAuth } from "../interfaces/auth.interface";
import { StatusCodesEnum } from "../enums/status.codes.enum";
import {
    IDoctorCreateDTO,
    IDoctorResponse,
} from "../interfaces/doctor.interface";
import { RoleEnum } from "../enums/role.enum";
import { emailService } from "./email.service";
import { ActionTokenTypeEnum } from "../enums/action.token.type.enum";
import { EmailEnum } from "../enums/email.enum";
import { config } from "../configs/config";
import { emailConstants } from "../constants/email.constants";
import { doctorService } from "./doctor.service";
import { clinicRepository } from "../repositories/clinic.repository";
import { serviceRepository } from "../repositories/service.repository";

class AuthService {
    public async signUp(
        doctorDTO: IDoctorCreateDTO,
    ): Promise<{ doctor: IDoctorResponse; tokens: ITokenPair }> {
        // Забороняємо реєстрацію адміна через цей endpoint
        if (doctorDTO.role === RoleEnum.ADMIN) {
            throw new ApiError(
                "Cannot register admin this way",
                StatusCodesEnum.FORBIDDEN,
            );
        }

        // Переконаємось, що email унікальний (doctorService кине помилку якщо ні)
        await doctorService.isEmailUnique(doctorDTO.email);

        const clinicsResolved = await Promise.all(
            (doctorDTO.clinics || []).map(async (c) => {
                const value = String(c).trim();
                if (Types.ObjectId.isValid(value) && value.length === 24) {
                    return new Types.ObjectId(value);
                }
                // шукаємо по назві
                let clinic = await clinicRepository.findByName(value);
                if (!clinic) {
                    clinic = await clinicRepository.create({ name: value });
                }
                return clinic._id;
            }),
        );

        const servicesResolved = await Promise.all(
            (doctorDTO.services || []).map(async (s) => {
                const value = String(s).trim();
                if (Types.ObjectId.isValid(value) && value.length === 24) {
                    return new Types.ObjectId(value);
                }
                let service = await serviceRepository.findByName(value);
                if (!service) {
                    service = await serviceRepository.create({ name: value });
                }
                return service._id;
            }),
        );

        const clinicsUnique = Array.from(
            new Set(clinicsResolved.map(String)),
        ).map((x) => new Types.ObjectId(x));
        const servicesUnique = Array.from(
            new Set(servicesResolved.map(String)),
        ).map((x) => new Types.ObjectId(x));

        const createDto: IDoctorCreateDTO = {
            ...doctorDTO,
            clinics: clinicsUnique,
            services: servicesUnique,
        };

        const createdDoctor = await doctorService.create(createDto);

        const tokens = tokenService.generateTokens({
            doctorId: createdDoctor._id, // already string
            role: createdDoctor.role,
        });

        // Зберігаємо токени у репозиторії (перетворюємо _doctorId у ObjectId)
        await tokenRepository.create({
            _doctorId: new Types.ObjectId(createdDoctor._id),
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken,
        });

        return { doctor: createdDoctor, tokens };
    }

    public async signIn(
        dto: IAuth,
    ): Promise<{ doctor: IDoctorResponse; tokens: ITokenPair }> {
        // базова валідація вхідних даних
        if (!dto?.email || !dto?.password) {
            throw new ApiError(
                "Email and password are required",
                StatusCodesEnum.BAD_REQUEST,
            );
        }

        const rawDoctor = await doctorService.getRawByEmail(dto.email);

        if (!rawDoctor) {
            throw new ApiError(
                "Email or password invalid",
                StatusCodesEnum.UNAUTHORIZED,
            );
        }

        if (!rawDoctor.password) {
            console.error(
                "Auth.signIn: missing password hash for user",
                rawDoctor._id,
            );
            throw new ApiError(
                "Email or password invalid",
                StatusCodesEnum.UNAUTHORIZED,
            );
        }

        const valid = await passwordService.comparePassword(
            dto.password,
            rawDoctor.password,
        );

        if (!valid) {
            throw new ApiError(
                "Email or password invalid",
                StatusCodesEnum.UNAUTHORIZED,
            );
        }

        const doctor = await doctorService.getByEmail(dto.email);

        const tokens = tokenService.generateTokens({
            doctorId: doctor._id.toString(),
            role: doctor.role,
        });

        await tokenRepository.create({
            _doctorId: new Types.ObjectId(doctor._id),
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken,
        });

        return { doctor, tokens };
    }

    /**
     * Зареєструвати адміністратора
     */
    public async registerAdmin(
        email: string,
        password: string,
    ): Promise<IDoctorResponse> {
        await doctorService.isEmailUnique(email);

        const adminDto: IDoctorCreateDTO = {
            name: "Admin",
            surname: "Superuser",
            phone: "+380000000000",
            email,
            password,
            clinics: [],
            services: [],
            role: RoleEnum.ADMIN,
        };

        const admin = await doctorService.create(adminDto);

        const actionToken = tokenService.generateActionToken(
            { doctorId: admin._id.toString(), role: admin.role },
            ActionTokenTypeEnum.ACTIVATE,
        );

        await emailService.sendEmail(
            admin.email,
            emailConstants[EmailEnum.ACTIVATE],
            {
                name: admin.name,
                url: `${config.FRONTEND_URL}/activate/${actionToken}`,
            },
        );

        return admin;
    }

    public async activate(token: string): Promise<IDoctorResponse> {
        const payload = tokenService.validateActionToken(
            token,
            ActionTokenTypeEnum.ACTIVATE,
        );

        const updated = await doctorService.updateById(payload.doctorId, {
            isActive: true,
            isVerified: true,
        } as any);

        return updated;
    }

    public async passwordRecoveryRequest(doctor: {
        _id: any;
        email: string;
        role: any;
    }): Promise<void> {
        const actionToken = tokenService.generateActionToken(
            { doctorId: doctor._id.toString(), role: doctor.role },
            ActionTokenTypeEnum.RECOVERY,
        );

        const url = `${config.FRONTEND_URL}/recovery/${actionToken}`;

        await emailService.sendEmail(
            doctor.email,
            emailConstants[EmailEnum.RECOVERY],
            { url },
        );
    }

    /**
     * Відновлення пароля по токену
     */
    public async recoveryPassword(
        token: string,
        password: string,
    ): Promise<IDoctorResponse> {
        const payload = tokenService.validateActionToken(
            token,
            ActionTokenTypeEnum.RECOVERY,
        );

        const updated = await doctorService.updateById(payload.doctorId, {
            password, // doctorService.updateById сам захешує
        } as any);

        return updated;
    }
}

export const authService = new AuthService();
