// src/services/auth.service.ts
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

/**
 * AuthService
 *
 * - використовує doctorService для створення/отримання лікаря
 * - використовує clinicRepository / serviceRepository для резолвингу назв -> ObjectId
 * - зберігає токени через tokenRepository.create
 */
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

        // --- Resolve clinics: приймаємо або ObjectId або назву
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

        // --- Resolve services: аналогічно
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

        // Побудова DTO для створення: покладем тільки ObjectId-імплементацію
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

        // Викликаємо doctorService.create — там паролі хешуються та повертається IDoctorResponse (populated)
        const createdDoctor = await doctorService.create(createDto);

        // Генеруємо токени (передаємо doctorId як рядок)
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

    /**
     * signIn: отримує "raw" лікаря (з паролем) і повертає IDoctorResponse + токени
     */
    public async signIn(
        dto: IAuth,
    ): Promise<{ doctor: IDoctorResponse; tokens: ITokenPair }> {
        // Отримуємо "raw" (документ з password). Використовуємо doctorService.getRawByEmail
        const rawDoctor = await doctorService.getRawByEmail(dto.email);
        if (!rawDoctor) {
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
                "Invalid email or password",
                StatusCodesEnum.UNAUTHORIZED,
            );
        }

        // Отримуємо відформатований response-об'єкт лікаря (IDoctorResponse)
        // Використовуємо getByEmail, тому що він робить populate + lean і повертає потрібний тип
        const doctor = await doctorService.getByEmail(dto.email);

        const tokens = tokenService.generateTokens({
            doctorId: doctor._id.toString(),
            role: doctor.role,
        });

        // збереження токенів
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

    /**
     * Активувати акаунт — використовує validateActionToken з конкретним типом
     */
    public async activate(token: string): Promise<IDoctorResponse> {
        const payload = tokenService.validateActionToken(
            token,
            ActionTokenTypeEnum.ACTIVATE,
        );

        // Оновлюємо користувача через сервіс (updateById хендлить валідацію/мапінг)
        const updated = await doctorService.updateById(payload.doctorId, {
            isActive: true,
            isVerified: true,
        } as any);

        return updated;
    }

    /**
     * Ініціювати запит на відновлення пароля — очікує об'єкт лікаря або мінімум _id + email + role
     */
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
