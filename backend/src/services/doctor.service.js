import { doctorRepository } from "../repositories/doctor.repository";
import { ApiError } from "../errors/api.error";
import { StatusCodesEnum } from "../enums/status.codes.enum";
class DoctorService {
    getAll() {
        return doctorRepository.getAll();
    }
    create(doctor) {
        return doctorRepository.create(doctor);
    }
    async getById(doctorId) {
        const doctor = await doctorRepository.getById(doctorId);
        if (!doctor) {
            throw new ApiError("Doctor is not found", StatusCodesEnum.NOT_FOUND);
        }
        return doctor;
    }
    async updateById(doctorId, doctor) {
        const updatedDoctor = await doctorRepository.updateById(doctorId, doctor);
        if (!updatedDoctor) {
            throw new ApiError("Doctor is not found", StatusCodesEnum.NOT_FOUND);
        }
        return updatedDoctor;
    }
    async deleteById(doctorId) {
        const data = await doctorRepository.getById(doctorId);
        if (!data) {
            throw new ApiError("Doctor is not found", StatusCodesEnum.NOT_FOUND);
        }
        await doctorRepository.deleteById(doctorId);
    }
    async isEmailUnique(email) {
        const doctor = await doctorRepository.getByEmail(email);
        if (doctor) {
            throw new ApiError("Doctor is not unique", StatusCodesEnum.BAD_REQUEST);
        }
    }
    async isActive(id) {
        const doctor = await this.getById(id);
        return doctor.isActive;
    }
    async blockDoctor(doctor_id) {
        const doctor = await doctorRepository.blockDoctor(doctor_id);
        if (!doctor) {
            throw new ApiError("Doctor is not found", StatusCodesEnum.NOT_FOUND);
        }
        return doctor;
    }
    async unblockDoctor(doctor_id) {
        const doctor = await doctorRepository.unblockDoctor(doctor_id);
        if (!doctor) {
            throw new ApiError("Doctor is not found", StatusCodesEnum.NOT_FOUND);
        }
        return doctor;
    }
}
export const doctorService = new DoctorService();
