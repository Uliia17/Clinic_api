import {
    IDoctor,
    IDoctorCreateDTO,
    IDoctorQuery,
    IDoctorUpdateDTO,
} from "../interfaces/doctor.interface";
import { doctorRepository } from "../repositories/doctor.repository";
import { ApiError } from "../errors/api.error";
import { StatusCodesEnum } from "../enums/status.codes.enum";
import { IPaginatedResponse } from "../interfaces/paginated-response.interface";
import { Types } from "mongoose";

class DoctorService {
    public async getAll(
        query: IDoctorQuery,
    ): Promise<IPaginatedResponse<IDoctor>> {
        const dataFromDB = await doctorRepository.getAll(query);

        const { data, totalItems, totalPages, prevPage, nextPage } = dataFromDB;

        return {
            totalItems,
            totalPages,
            prevPage,
            nextPage,
            data,
        };
    }

    public async create(doctor: IDoctorCreateDTO): Promise<IDoctor> {
        const clinics = doctor.clinics.map((id) => new Types.ObjectId(id));
        const services = doctor.services.map((id) => new Types.ObjectId(id));

        return await doctorRepository.create({
            ...doctor,
            clinics,
            services,
        });
    }

    public async getById(doctorId: string): Promise<IDoctor> {
        const doctor = await doctorRepository.getById(doctorId);
        if (!doctor) {
            throw new ApiError(
                "Doctor is not found",
                StatusCodesEnum.NOT_FOUND,
            );
        }
        return doctor;
    }

    public async updateById(
        doctorId: string,
        doctor: IDoctorUpdateDTO,
    ): Promise<IDoctor> {
        const updatedData: any = { ...doctor };

        if (doctor.clinics) {
            updatedData.clinics = doctor.clinics.map(
                (id) => new Types.ObjectId(id),
            );
        }

        if (doctor.services) {
            updatedData.services = doctor.services.map(
                (id) => new Types.ObjectId(id),
            );
        }

        const updatedDoctor = await doctorRepository.updateById(
            doctorId,
            updatedData,
        );

        if (!updatedDoctor) {
            throw new ApiError(
                "Doctor is not found",
                StatusCodesEnum.NOT_FOUND,
            );
        }

        return updatedDoctor;
    }

    public async deleteById(doctorId: string): Promise<void> {
        const data = await doctorRepository.getById(doctorId);
        if (!data) {
            throw new ApiError(
                "Doctor is not found",
                StatusCodesEnum.NOT_FOUND,
            );
        }
        await doctorRepository.deleteById(doctorId);
    }

    public async isEmailUnique(email: string): Promise<void> {
        const doctor = await doctorRepository.getByEmail(email);
        if (doctor) {
            throw new ApiError(
                "Doctor is not unique",
                StatusCodesEnum.BAD_REQUEST,
            );
        }
    }

    public async isActive(id: string): Promise<boolean> {
        const doctor = await this.getById(id);
        return doctor.isActive;
    }

    public async blockDoctor(doctorId: string): Promise<IDoctor> {
        const doctor = await doctorRepository.blockDoctor(doctorId);
        if (!doctor) {
            throw new ApiError(
                "Doctor is not found",
                StatusCodesEnum.NOT_FOUND,
            );
        }
        return doctor;
    }

    public async unblockDoctor(doctorId: string): Promise<IDoctor> {
        const doctor = await doctorRepository.unblockDoctor(doctorId);
        if (!doctor) {
            throw new ApiError(
                "Doctor is not found",
                StatusCodesEnum.NOT_FOUND,
            );
        }
        return doctor;
    }

    public getByEmail(email: string): Promise<IDoctor> {
        return doctorRepository.getByEmail(email);
    }
}

export const doctorService = new DoctorService();
