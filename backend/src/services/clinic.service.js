import { clinicRepository } from "../repositories/clinic.repository";
import { ApiError } from "../errors/api.error";
import { StatusCodesEnum } from "../enums/status.codes.enum";
class ClinicService {
    async getAll() {
        return await clinicRepository.getAll();
    }
    async create(clinic) {
        return await clinicRepository.create(clinic);
    }
    async getById(clinicId) {
        const clinic = await clinicRepository.getById(clinicId);
        if (!clinic) {
            throw new ApiError("Clinic is not found", StatusCodesEnum.NOT_FOUND);
        }
        return clinic;
    }
    async updateById(clinicId, clinic) {
        const existing = await clinicRepository.getById(clinicId);
        if (!existing) {
            throw new ApiError("Clinic is not found", StatusCodesEnum.NOT_FOUND);
        }
        return (await clinicRepository.updateById(clinicId, clinic));
    }
    async deleteById(clinicId) {
        const clinic = await clinicRepository.getById(clinicId);
        if (!clinic) {
            throw new ApiError("Clinic is not found", StatusCodesEnum.NOT_FOUND);
        }
        await clinicRepository.deleteById(clinicId);
    }
}
export const clinicService = new ClinicService();
