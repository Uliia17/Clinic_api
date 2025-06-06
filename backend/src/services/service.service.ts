import { ApiError } from "../errors/api.error";
import { serviceRepository } from "../repositories/service.repository";
import { StatusCodesEnum } from "../enums/status.codes.enum";
import { IService, IServiceDTO } from "../interfaces/service.interface";
import { Doctor } from "../models/doctor.model";

class ServiceService {
    public async getServices(query: { name?: string }): Promise<IService[]> {
        const nameFilter = query.name?.trim().toLowerCase() || "";

        let standaloneServices = await serviceRepository.getAllStandalone();

        const doctors = await Doctor.find({ isDeleted: false }).lean();

        const doctorServicesSet = new Set<string>();
        for (const doc of doctors) {
            if (Array.isArray(doc.services)) {
                for (const svc of doc.services) {
                    doctorServicesSet.add(svc.toLowerCase());
                }
            }
        }

        const standaloneServicesMap = new Map<string, IService>();
        for (const svc of standaloneServices) {
            standaloneServicesMap.set(svc.name.toLowerCase(), svc);
        }

        for (const svcName of doctorServicesSet) {
            if (!standaloneServicesMap.has(svcName)) {
                standaloneServicesMap.set(svcName, {
                    _id: null,
                    name: svcName,
                    createdAt: new Date(0),
                    updatedAt: new Date(0),
                } as IService);
            }
        }

        let combinedServices = Array.from(standaloneServicesMap.values());

        if (nameFilter) {
            combinedServices = combinedServices.filter((s) =>
                s.name.toLowerCase().includes(nameFilter),
            );
        }

        combinedServices.sort((a, b) => a.name.localeCompare(b.name));

        return combinedServices;
    }

    public async create(service: IServiceDTO): Promise<IService> {
        return await serviceRepository.create(service);
    }

    public async getById(serviceId: string): Promise<IService> {
        const svc = await serviceRepository.getById(serviceId);
        if (!svc) {
            throw new ApiError(
                "Service is not found",
                StatusCodesEnum.NOT_FOUND,
            );
        }
        return svc;
    }

    public async updateById(
        serviceId: string,
        service: IServiceDTO,
    ): Promise<IService> {
        const existing = await serviceRepository.getById(serviceId);
        if (!existing) {
            throw new ApiError(
                "Service is not found",
                StatusCodesEnum.NOT_FOUND,
            );
        }
        return (await serviceRepository.updateById(
            serviceId,
            service,
        )) as IService;
    }

    public async deleteById(serviceId: string): Promise<void> {
        const existing = await serviceRepository.getById(serviceId);
        if (!existing) {
            throw new ApiError(
                "Service is not found",
                StatusCodesEnum.NOT_FOUND,
            );
        }
        await serviceRepository.deleteById(serviceId);
    }
}

export const serviceService = new ServiceService();
