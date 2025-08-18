// src/repositories/service.repository.ts
import { FilterQuery, Types } from "mongoose";
import { Service } from "../models/service.model";
import {
    IService,
    IServiceDTO,
    IServiceQuery,
} from "../interfaces/service.interface";
import { IPaginatedResponse } from "../interfaces/paginated-response.interface";

export class ServiceRepository {
    public async findByName(name: string): Promise<IService | null> {
        return await Service.findOne({
            name: { $regex: `^${name}$`, $options: "i" },
        })
            .lean<IService>()
            .exec();
    }

    public async create(dto: IServiceDTO): Promise<IService> {
        const created = await Service.create(dto);
        return created.toObject() as IService;
    }

    public async findManyByIds(ids: Types.ObjectId[]): Promise<IService[]> {
        return await Service.find({ _id: { $in: ids } })
            .lean<IService[]>()
            .exec();
    }

    public async findAll(): Promise<IService[]> {
        return await Service.find().lean<IService[]>().exec();
    }

    public async search(
        query: IServiceQuery,
    ): Promise<IPaginatedResponse<IService>> {
        const { name, order, page = 1, pageSize = 10 } = query;
        const filter: FilterQuery<IService> = {};

        if (name) {
            filter.name = { $regex: name, $options: "i" } as any;
        }

        let sortField = "name";
        let sortOrder: 1 | -1 = 1;
        if (order) {
            sortOrder = order.startsWith("-") ? -1 : 1;
            sortField = order.replace(/^-/, "");
        }

        const skip = (page - 1) * pageSize;
        const totalItems = await Service.countDocuments(filter);

        const docs: IService[] = await Service.find(filter)
            .sort({ [sortField]: sortOrder })
            .skip(skip)
            .limit(pageSize)
            .lean()
            .exec();

        const totalPages = Math.ceil(totalItems / pageSize);

        return {
            data: docs,
            totalItems,
            totalPages,
            prevPage: page > 1,
            nextPage: page < totalPages,
        } as IPaginatedResponse<IService>;
    }

    public async getById(id: string): Promise<IService | null> {
        if (!Types.ObjectId.isValid(id)) return null;
        return await Service.findById(new Types.ObjectId(id))
            .lean<IService>()
            .exec();
    }

    /**
     * Масове отримання сервісів за масивом ObjectId
     */
    public async findByIds(ids: Types.ObjectId[]): Promise<IService[]> {
        return await Service.find({ _id: { $in: ids } })
            // тут можна додати populate, якщо потрібно
            // наприклад: .populate("clinics")
            .lean<IService[]>()
            .exec();
    }

    public async updateById(
        id: string,
        dto: IServiceDTO,
    ): Promise<IService | null> {
        if (!Types.ObjectId.isValid(id)) return null;
        return await Service.findByIdAndUpdate(new Types.ObjectId(id), dto, {
            new: true,
        })
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
