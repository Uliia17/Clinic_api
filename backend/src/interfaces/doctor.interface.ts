import { Types } from "mongoose";
import { IBase } from "./base.interface";
import { RoleEnum } from "../enums/role.enum";

export interface IDoctor extends IBase {
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
}

export interface IDoctorCreateDTO {
    name: string;
    surname: string;
    phone: string;
    email: string;
    password: string;
    role?: RoleEnum;
    clinics: (string | Types.ObjectId)[];
    services: (string | Types.ObjectId)[];
    avatar?: string;
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
    name?: string;
    surname?: string;
    phone?: string;
    email?: string;
    search?: string;
    order?: string;
    page?: number;
    pageSize?: number;
}
