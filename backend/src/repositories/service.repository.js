import { Service } from "../models/service.model";
class ServiceRepository {
    async getAll() {
        return await Service.find();
    }
    async create(service) {
        return await Service.create(service);
    }
    async getById(serviceId) {
        return await Service.findById(serviceId);
    }
    async updateById(serviceId, service) {
        return await Service.findByIdAndUpdate(serviceId, service, {
            new: true,
        });
    }
    async deleteById(serviceId) {
        return await Service.findByIdAndDelete(serviceId);
    }
}
export const serviceRepository = new ServiceRepository();
