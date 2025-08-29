import { Types } from "mongoose";

export interface IClinic {
    _id: Types.ObjectId;
    name: string;
    address: string;
    doctors: Types.ObjectId[];
    services: Types.ObjectId[];
    createdAt?: Date;
    updatedAt?: Date;
}

export interface IClinicDTO {
    name: string;
    address: string;
    doctors?: Types.ObjectId[] | string[];
    services?: Types.ObjectId[] | string[];
}

export interface IClinicUpdateDTO {
    name?: string;
    address?: string;
}

export interface IClinicDoctor {
    name: string;
    surname: string;
    phone: string;
    services: string[];
}

export interface IClinicResponse {
    _id: string;
    name: string;
    address?: string;
    phone: string;
    doctors: IClinicDoctor[];
    services: string[];
}

export interface IClinicQuery {
    name?: string;
    doctorId?: Types.ObjectId | string;
    serviceId?: Types.ObjectId | string;
    order?: string;
    page?: number;
    pageSize?: number;
}
