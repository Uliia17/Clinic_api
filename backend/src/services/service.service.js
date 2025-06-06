import { serviceRepository } from "../repositories/service.repository";
import { ApiError } from "../errors/api.error";
import { StatusCodesEnum } from "../enums/status.codes.enum";
class ServiceService {
    async getAll() {
        return await serviceRepository.getAll();
    }
    async create(service) {
        return await serviceRepository.create(service);
    }
    async getById(serviceId) {
        const service = await serviceRepository.getById(serviceId);
        if (!service) {
            throw new ApiError("Service is not found", StatusCodesEnum.NOT_FOUND);
        }
        return service;
    }
    async updateById(serviceId, service) {
        const existing = await serviceRepository.getById(serviceId);
        if (!existing) {
            throw new ApiError("Service is not found", StatusCodesEnum.NOT_FOUND);
        }
        return (await serviceRepository.updateById(serviceId, service));
    }
    async deleteById(serviceId) {
        const service = await serviceRepository.getById(serviceId);
        if (!service) {
            throw new ApiError("Service is not found", StatusCodesEnum.NOT_FOUND);
        }
        await serviceRepository.deleteById(serviceId);
    }
}
export const serviceService = new ServiceService();
