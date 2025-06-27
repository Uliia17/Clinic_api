import { Types } from "mongoose";

export interface IClinic {
    _id?: Types.ObjectId;
    name: string;
    doctors: Types.ObjectId[];
    services: Types.ObjectId[];
    createdAt?: Date;
    updatedAt?: Date;
}

export interface IClinicDTO {
    name: string;
    doctors?: string[];
    services?: string[];
}

export interface IClinicResponse extends IClinic {
    doctorNames: string[];
    serviceIds: string[];
}
