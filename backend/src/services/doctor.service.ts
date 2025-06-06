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
    public create(doctor: IDoctorCreateDTO): Promise<IDoctor> {
        return doctorRepository.create(doctor);
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
        const updatedDoctor = await doctorRepository.updateById(
            doctorId,
            doctor,
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

    public async blockDoctor(doctor_id: string): Promise<IDoctor> {
        const doctor = await doctorRepository.blockDoctor(doctor_id);
        if (!doctor) {
            throw new ApiError(
                "Doctor is not found",
                StatusCodesEnum.NOT_FOUND,
            );
        }
        return doctor;
    }

    public async unblockDoctor(doctor_id: string): Promise<IDoctor> {
        const doctor = await doctorRepository.unblockDoctor(doctor_id);
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
