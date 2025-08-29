import { Types } from "mongoose";
import { Service, ServiceDocument } from "../models/service.model";
import {
    IService,
    IServiceDTO,
    IServiceQuery,
    IServiceUpdateDTO,
} from "../interfaces/service.interface";
import { IPaginatedResponse } from "../interfaces/paginated-response.interface";

export class ServiceRepository {
    public async create(dto: IServiceDTO): Promise<ServiceDocument> {
        const created = await Service.create(dto as any);
        return created as ServiceDocument;
    }

    public async findByName(name: string): Promise<IService | null> {
        return await Service.findOne({
            name: { $regex: `^${name}$`, $options: "i" },
        })
            .lean<IService>()
            .exec();
    }

    public async search(
        query: IServiceQuery,
    ): Promise<IPaginatedResponse<IService>> {
        const { name, order, page = 1, pageSize = 10 } = query;
        const filter: any = {};

        if (name) filter.name = { $regex: name, $options: "i" };

        let sortField = "name";
        let sortOrder: 1 | -1 = 1;
        if (order) {
            sortOrder = order.startsWith("-") ? -1 : 1;
            sortField = order.replace(/^-/, "");
        }

        const skip = (page - 1) * pageSize;
        const totalItems = await Service.countDocuments(filter);

        const docs = await Service.find(filter)
            .sort({ [sortField]: sortOrder })
            .skip(skip)
            .limit(pageSize)
            .lean<IService[]>()
            .exec();

        const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

        return {
            data: docs,
            totalItems,
            totalPages,
            prevPage: page > 1,
            nextPage: page < totalPages,
            page,
            pageSize,
        };
    }

    public async getById(id: string): Promise<IService | null> {
        if (!Types.ObjectId.isValid(id)) return null;
        return await Service.findById(new Types.ObjectId(id))
            .lean<IService>()
            .exec();
    }

    public async updateById(
        id: string,
        dto: Partial<IServiceUpdateDTO>,
    ): Promise<IService | null> {
        return await Service.findByIdAndUpdate(id, dto, { new: true })
            .lean<IService>()
            .exec();
    }

    public async deleteById(id: string): Promise<boolean> {
        if (!Types.ObjectId.isValid(id)) return false;
        const doc = await Service.findByIdAndDelete(new Types.ObjectId(id))
            .lean<IService>()
            .exec();
        return doc != null;
    }
}

export const serviceRepository = new ServiceRepository();
