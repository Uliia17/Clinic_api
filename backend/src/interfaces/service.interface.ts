import { Types } from "mongoose";

export interface IService {
    _id: Types.ObjectId;
    name: string;
    createdAt?: Date;
    updatedAt?: Date;
}

/**
 * DTO створення/оновлення послуги
 */
export interface IServiceDTO {
    name: string;
}

/**
 * Параметри запиту для списку послуг
 */
export interface IServiceQuery {
    name?: string;
    order?: string;
    page?: number;
    pageSize?: number;
}

/**
 * DTO відповіді API для послуги — _id і дати як рядки
 */
export interface IServiceResponse {
    _id: string;
    name: string;
    createdAt: string;
    updatedAt: string;
}
