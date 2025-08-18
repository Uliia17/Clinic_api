import { Types } from "mongoose";
import { IDoctorResponse } from "./doctor.interface";
import { IServiceResponse } from "./service.interface";

/**
 * DB-представлення клініки (з ObjectId і Date)
 */
export interface IClinic {
    _id: Types.ObjectId;
    name: string;
    doctors: Types.ObjectId[];
    services: Types.ObjectId[];
    createdAt?: Date;
    updatedAt?: Date;
}

/**
 * DTO для створення/оновлення
 */
export interface IClinicDTO {
    name: string;
    doctors?: Types.ObjectId[] | string[]; // дозволимо і строки (зручніше)
    services?: Types.ObjectId[] | string[];
}

/**
 * API-відповідь для клієнта (response)
 * ТУТ використаємо response-типи лікарів/сервісів (без паролів, з id як string)
 */
export interface IClinicResponse {
    _id: string;
    name: string;
    createdAt?: string;
    updatedAt?: string;
    doctors: IDoctorResponse[]; // response-тип
    services: IServiceResponse[]; // response-тип
}

/**
 * Query для пошуку / пагінації
 */
export interface IClinicQuery {
    name?: string;
    doctorId?: Types.ObjectId | string;
    serviceId?: Types.ObjectId | string;
    order?: string;
    page?: number;
    pageSize?: number;
}
