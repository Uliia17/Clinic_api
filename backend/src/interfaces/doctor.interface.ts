import { IBase } from "./base.interface";
import { RoleEnum } from "../enums/role.enum";

interface IDoctor extends IBase {
    _id: string;
    name: string;
    surname: string;
    phone: string;
    email: string;
    avatar?: string;
    clinics: string[];
    services: string[];
    password: string;
    role: RoleEnum;
    isDeleted: boolean;
    isVerified: boolean;
    isActive: boolean;
}

interface IDoctorQuery {
    pageSize: number;
    page: number;
    order?: string;
    name?: string;
    surname?: string;
    phone?: string;
    email?: string;
}

interface IDoctorCreateDTO {
    email: string;
    password: string;
    name: string;
    surname: string;
    phone: string;
    role: RoleEnum;
    clinics: string[];
    services: string[];
}

type IDoctorUpdateDTO = Partial<
    Pick<
        IDoctor,
        | "name"
        | "surname"
        | "phone"
        | "password"
        | "clinics"
        | "services"
        | "isVerified"
        | "isActive"
        | "avatar"
    >
>;

export type { IDoctor, IDoctorUpdateDTO, IDoctorCreateDTO, IDoctorQuery };
