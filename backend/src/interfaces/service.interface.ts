import { Types } from "mongoose";

export interface IService {
    _id?: Types.ObjectId;
    name: string;
    clinics?: (Types.ObjectId | string)[];
    doctors?: (Types.ObjectId | string)[];

    createdAt?: Date;
    updatedAt?: Date;
}

export interface IServiceDTO {
    name: string;
    clinics?: (Types.ObjectId | string)[];
    doctors?: (Types.ObjectId | string)[];
}

export interface IServiceUpdateDTO {
    name?: string;
    clinics?: (Types.ObjectId | string)[];
    doctors?: (Types.ObjectId | string)[];
}

export interface IServiceQuery {
    name?: string;
    order?: string;
    page?: number;
    pageSize?: number;
}

export interface IServiceClinic {
    _id: string;
    name: string;
    address?: string;
    phone?: string;
}

export interface IServiceDoctor {
    _id: string;
    name: string;
    surname?: string;
    phone?: string;
    clinics?: string[];
    services?: string[];
}

export interface IServiceResponse {
    _id: string;
    name: string;
    clinics: IServiceClinic[];
    doctors: IServiceDoctor[];
    createdAt?: string;
    updatedAt?: string;
}
