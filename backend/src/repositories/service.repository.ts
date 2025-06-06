import { IService, IServiceDTO } from "../interfaces/service.interface";
import { Service } from "../models/service.model";

class ServiceRepository {
    public async getAllStandalone(): Promise<IService[]> {
        return await Service.find();
    }

    public async create(service: IServiceDTO): Promise<IService> {
        return await Service.create(service);
    }

    public async getById(serviceId: string): Promise<IService | null> {
        return await Service.findById(serviceId);
    }

    public async updateById(
        serviceId: string,
        service: IServiceDTO,
    ): Promise<IService | null> {
        return await Service.findByIdAndUpdate(serviceId, service, {
            new: true,
        });
    }

    public async deleteById(serviceId: string): Promise<IService | null> {
        return await Service.findByIdAndDelete(serviceId);
    }
}

export const serviceRepository = new ServiceRepository();
