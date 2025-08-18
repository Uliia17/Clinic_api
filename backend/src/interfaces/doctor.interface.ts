// src/interfaces/doctor.interface.ts
import { Types } from "mongoose";
import { RoleEnum } from "../enums/role.enum";

/**
 * Внутрішня (DB) модель лікаря — для репозиторіїв/моделей.
 * Використовує Types.ObjectId і Date.
 */
export interface IDoctor {
    _id: Types.ObjectId;
    name: string;
    surname: string;
    phone: string;
    email: string;
    password: string;
    avatar?: string;
    clinics: Types.ObjectId[]; // зберігаємо посилання на клініки
    services: Types.ObjectId[]; // посилання на сервіси
    role: RoleEnum;
    isDeleted: boolean;
    isVerified: boolean;
    isActive: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}

/**
 * DTO для створення лікаря (вхідні дані)
 * clinic/service можуть бути рядком (name) або ObjectId string
 */
export interface IDoctorCreateDTO {
    name: string;
    surname: string;
    phone: string;
    email: string;
    password: string;
    clinics?: (string | Types.ObjectId)[];
    services?: (string | Types.ObjectId)[];
    role?: RoleEnum;
    avatar?: string;
    isActive?: boolean;
}

/**
 * DTO для оновлення лікаря
 */
export interface IDoctorUpdateDTO {
    name?: string;
    surname?: string;
    phone?: string;
    email?: string;
    password?: string;
    avatar?: string;
    clinics?: (string | Types.ObjectId)[];
    services?: (string | Types.ObjectId)[];
    role?: RoleEnum;
    isDeleted?: boolean;
    isVerified?: boolean;
    isActive?: boolean;
}

/**
 * Параметри запиту для списків лікарів (фільтрація/пагінація)
 */
export interface IDoctorQuery {
    page?: number;
    pageSize?: number;
    search?: string; // універсальний пошук по name/surname/email/phone
    order?: string; // наприклад "name" або "-surname"
    name?: string;
    surname?: string;
    phone?: string;
    email?: string;
}

/**
 * DTO відповіді API для лікаря — у відповіді використовуємо прості типи:
 * id як string, дати як ISO-рядки. Це уникне помилок TS при віддачі в контролер.
 */
export interface ClinicSummary {
    _id: string;
    name: string;
}
export interface ServiceSummary {
    _id: string;
    name: string;
}

export interface IDoctorResponse {
    _id: string;
    name: string;
    surname: string;
    phone: string;
    email: string;
    avatar?: string;
    clinics: ClinicSummary[];
    services: ServiceSummary[];
    role: RoleEnum;
    isVerified: boolean;
    isActive: boolean;
    createdAt: string; // ISO
    updatedAt: string; // ISO
}

/**
 * Уніфікована структура пагінації для відповідей API
 */
// export interface IPaginatedResponse<T> {
//     data: T[];
//     totalItems: number;
//     totalPages: number;
//     page?: number;
//     pageSize?: number;
//     prevPage?: boolean;
//     nextPage?: boolean;
// }

export interface IPaginatedResult<T> {
    data: T[];
    totalItems: number;
    totalPages: number;
    prevPage: number | null;
    nextPage: number | null;
}
