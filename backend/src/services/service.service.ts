import { ApiError } from "../errors/api.error";
import { serviceRepository } from "../repositories/service.repository";
import { StatusCodesEnum } from "../enums/status.codes.enum";
import {
    IServiceDTO,
    IServiceQuery,
    IServiceResponse,
    IService,
} from "../interfaces/service.interface";
import { Types } from "mongoose";
import { IPaginatedResponse } from "../interfaces/paginated-response.interface";

export class ServiceService {
    public async getServices(
        query: IServiceQuery,
    ): Promise<IPaginatedResponse<IServiceResponse>> {
        const paginated = await serviceRepository.search(query);

        const data = (paginated.data || []).map((svc: IService) =>
            this.toResponse(svc),
        );

        return {
            ...paginated,
            data,
        };
    }

    public async create(service: IServiceDTO): Promise<IServiceResponse> {
        const existing = await serviceRepository.findByName(service.name);
        if (existing) {
            throw new ApiError(
                "Service with this name already exists",
                StatusCodesEnum.CONFLICT,
            );
        }

        const created: IService = await serviceRepository.create(service);
        return this.toResponse(created);
    }

    public async getById(id: string): Promise<IServiceResponse> {
        const svc = await serviceRepository.getById(id);
        if (!svc)
            throw new ApiError("Service not found", StatusCodesEnum.NOT_FOUND);
        return this.toResponse(svc);
    }

    public async getByIds(ids: string[]): Promise<IServiceResponse[]> {
        if (!ids || ids.length === 0) return [];

        const objectIds = ids
            .filter((id) => Types.ObjectId.isValid(id))
            .map((id) => new Types.ObjectId(id));
        if (objectIds.length === 0) return [];

        const services = await serviceRepository.findByIds(objectIds);

        return services.map((svc) => ({
            _id: svc._id.toString(),
            name: svc.name,
            createdAt: svc.createdAt ? svc.createdAt.toISOString() : undefined,
            updatedAt: svc.updatedAt ? svc.updatedAt.toISOString() : undefined,
        }));
    }

    public async updateById(
        id: string,
        service: IServiceDTO,
    ): Promise<IServiceResponse> {
        const existing = await serviceRepository.getById(id);
        if (!existing)
            throw new ApiError("Service not found", StatusCodesEnum.NOT_FOUND);

        const duplicate = await service_repository_findByName_safe(
            service.name,
        );
        if (duplicate && duplicate._id.toString() !== id) {
            throw new ApiError(
                "Another service with this name already exists",
                StatusCodesEnum.CONFLICT,
            );
        }

        const updated = await serviceRepository.updateById(id, service);
        if (!updated)
            throw new ApiError(
                "Failed to update service",
                StatusCodesEnum.INTERNAL_SERVER_ERROR,
            );

        return this.toResponse(updated);
    }

    public async deleteById(id: string): Promise<void> {
        const existing = await serviceRepository.getById(id);
        if (!existing)
            throw new ApiError("Service not found", StatusCodesEnum.NOT_FOUND);

        const deleted = await serviceRepository.deleteById(id);
        if (!deleted)
            throw new ApiError(
                "Failed to delete service",
                StatusCodesEnum.INTERNAL_SERVER_ERROR,
            );
    }

    private toResponse(svc: IService): IServiceResponse {
        return {
            _id: svc._id.toString(),
            name: svc.name,
            createdAt: svc.createdAt
                ? svc.createdAt.toISOString()
                : new Date().toISOString(),
            updatedAt: svc.updatedAt
                ? svc.updatedAt.toISOString()
                : new Date().toISOString(),
        };
    }
}

export const serviceService = new ServiceService();

async function service_repository_findByName_safe(name: string) {
    return await serviceRepository.findByName(name);
}
