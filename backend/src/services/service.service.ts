import { ApiError } from "../errors/api.error";
import { serviceRepository } from "../repositories/service.repository";
import { StatusCodesEnum } from "../enums/status.codes.enum";
import { IService, IServiceDTO } from "../interfaces/service.interface";
import { Doctor } from "../models/doctor.model";

interface IServiceQuery {
    name?: string;
    order?: string;
}

export class ServiceService {
    public async getServices(query: IServiceQuery): Promise<IService[]> {
        const nameFilter = query.name?.trim().toLowerCase() || "";
        const rawOrder = query.order || "name";

        const isDescending = rawOrder.startsWith("-");
        const sortField = rawOrder.replace("-", "").toLowerCase();

        let standalone = await serviceRepository.getAllStandalone();
        const doctors = await Doctor.find({ isDeleted: false }).lean();

        const doctorSet = new Set<string>();
        for (const doc of doctors) {
            for (const svc of doc.services || []) {
                doctorSet.add(svc.toString().toLowerCase());
            }
        }

        const map = new Map<string, IService>();
        for (const svc of standalone) {
            map.set(svc.name.toLowerCase(), svc);
        }
        for (const name of doctorSet) {
            if (!map.has(name)) {
                map.set(name, {
                    _id: null,
                    name,
                    createdAt: new Date(0),
                    updatedAt: new Date(0),
                } as IService);
            }
        }

        let arr = Array.from(map.values());

        if (nameFilter) {
            arr = arr.filter((s) => s.name.toLowerCase().includes(nameFilter));
        }

        arr.sort((a, b) => {
            const aVal = (a as any)[sortField];
            const bVal = (b as any)[sortField];

            if (typeof aVal === "string" && typeof bVal === "string") {
                return isDescending
                    ? bVal.localeCompare(aVal)
                    : aVal.localeCompare(bVal);
            }

            if (aVal instanceof Date && bVal instanceof Date) {
                return isDescending
                    ? bVal.getTime() - aVal.getTime()
                    : aVal.getTime() - bVal.getTime();
            }

            return 0;
        });

        return arr;
    }

    public async create(service: IServiceDTO): Promise<IService> {
        return await serviceRepository.create(service);
    }

    public async getById(serviceId: string): Promise<IService> {
        const svc = await serviceRepository.getById(serviceId);
        if (!svc) {
            throw new ApiError("Service not found", StatusCodesEnum.NOT_FOUND);
        }
        return svc;
    }

    public async updateById(
        serviceId: string,
        service: IServiceDTO,
    ): Promise<IService> {
        const existing = await serviceRepository.getById(serviceId);
        if (!existing) {
            throw new ApiError("Service not found", StatusCodesEnum.NOT_FOUND);
        }
        return (await serviceRepository.updateById(
            serviceId,
            service,
        )) as IService;
    }

    public async deleteById(serviceId: string): Promise<void> {
        const existing = await serviceRepository.getById(serviceId);
        if (!existing) {
            throw new ApiError("Service not found", StatusCodesEnum.NOT_FOUND);
        }
        await serviceRepository.deleteById(serviceId);
    }
}

export const serviceService = new ServiceService();
