import { Types } from "mongoose";
import { RoleEnum } from "../enums/role.enum";

export interface IDoctor {
    _id: Types.ObjectId;
    name: string;
    surname: string;
    phone: string;
    email: string;
    password: string;
    avatar?: string;
    clinics: Types.ObjectId[];
    services: Types.ObjectId[];
    role: RoleEnum;
    isDeleted: boolean;
    isVerified: boolean;
    isActive: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}

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

export interface IDoctorQuery {
    page?: number;
    pageSize?: number;
    search?: string;
    order?: string;
    name?: string;
    surname?: string;
    phone?: string;
    email?: string;
    isVerified?: boolean;
    isActive?: boolean;
}

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
}
