// import { FilterQuery, Types } from "mongoose";
// import { Clinic, ClinicDocument } from "../models/clinic.model";
// import {
//     IClinic,
//     IClinicDTO,
//     IClinicQuery,
// } from "../interfaces/clinic.interface";
// import { IPaginatedResponse } from "../interfaces/paginated-response.interface";
//
// export class ClinicRepository {
//     public async findByName(name: string): Promise<IClinic | null> {
//         return await Clinic.findOne({
//             name: { $regex: `^${name}$`, $options: "i" },
//         })
//             .lean<IClinic>()
//             .exec();
//     }
//
//     public async create(dto: IClinicDTO): Promise<IClinic> {
//         const created: ClinicDocument = await Clinic.create(dto);
//         return created.toObject() as IClinic;
//     }
//
//     public async findManyByIds(ids: Types.ObjectId[]): Promise<IClinic[]> {
//         return await Clinic.find({ _id: { $in: ids } })
//             .lean<IClinic[]>()
//             .exec();
//     }
//
//     public async findAll(): Promise<IClinic[]> {
//         return await Clinic.find().lean<IClinic[]>().exec();
//     }
//
//     public async search(
//         query: IClinicQuery,
//     ): Promise<IPaginatedResponse<IClinic>> {
//         const { name, order, page = 1, pageSize = 10 } = query;
//         const filter: FilterQuery<IClinic> = {};
//
//         if (name) {
//             filter.name = { $regex: name, $options: "i" } as any;
//         }
//
//         let sortField = "name";
//         let sortOrder: 1 | -1 = 1;
//         if (order) {
//             sortOrder = order.startsWith("-") ? -1 : 1;
//             sortField = order.replace(/^-/, "");
//         }
//
//         const skip = (page - 1) * pageSize;
//         const totalItems = await Clinic.countDocuments(filter);
//
//         const docs = await Clinic.find(filter)
//             .sort({ [sortField]: sortOrder })
//             .skip(skip)
//             .limit(pageSize)
//             .lean<IClinic[]>()
//             .exec();
//
//         const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
//
//         const result: IPaginatedResponse<IClinic> = {
//             data: docs,
//             totalItems,
//             totalPages,
//             prevPage: page > 1,
//             nextPage: page < totalPages,
//             page,
//             pageSize,
//         };
//
//         return result;
//     }
//
//     public async getById(id: string): Promise<IClinic | null> {
//         if (!Types.ObjectId.isValid(id)) return null;
//         return await Clinic.findById(new Types.ObjectId(id))
//             .lean<IClinic>()
//             .exec();
//     }
//
//     public async updateById(
//         id: string,
//         dto: IClinicDTO,
//     ): Promise<IClinic | null> {
//         if (!Types.ObjectId.isValid(id)) return null;
//         return await Clinic.findByIdAndUpdate(new Types.ObjectId(id), dto, {
//             new: true,
//         })
//             .lean<IClinic>()
//             .exec();
//     }
//
//     public async deleteById(id: string): Promise<boolean> {
//         if (!Types.ObjectId.isValid(id)) return false;
//         const doc = await Clinic.findByIdAndDelete(new Types.ObjectId(id))
//             .lean<IClinic>()
//             .exec();
//         return doc != null;
//     }
// }
//
// export const clinicRepository = new ClinicRepository();

import { FilterQuery, Types } from "mongoose";
import { Clinic, ClinicDocument } from "../models/clinic.model";
import {
    IClinic,
    IClinicDTO,
    IClinicQuery,
} from "../interfaces/clinic.interface";
import { IPaginatedResponse } from "../interfaces/paginated-response.interface";

export class ClinicRepository {
    public async findByName(name: string): Promise<IClinic | null> {
        return await Clinic.findOne({
            name: { $regex: `^${name}$`, $options: "i" },
        })
            .lean<IClinic>()
            .exec();
    }

    public async create(dto: IClinicDTO): Promise<ClinicDocument> {
        const created = await Clinic.create(dto);
        return created as ClinicDocument;
    }

    // пагінований пошук клінік
    public async search(
        query: IClinicQuery,
    ): Promise<IPaginatedResponse<IClinic>> {
        const { name, order, page = 1, pageSize = 10 } = query;
        const filter: FilterQuery<IClinic> = {};

        if (name) filter.name = { $regex: name, $options: "i" } as any;

        let sortField = "name";
        let sortOrder: 1 | -1 = 1;
        if (order) {
            sortOrder = order.startsWith("-") ? -1 : 1;
            sortField = order.replace(/^-/, "");
        }

        const skip = (page - 1) * pageSize;
        const totalItems = await Clinic.countDocuments(filter);

        const docs = await Clinic.find(filter)
            .sort({ [sortField]: sortOrder })
            .skip(skip)
            .limit(pageSize)
            .lean<IClinic[]>()
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

    public async findAll(): Promise<IClinic[]> {
        return await Clinic.find().lean<IClinic[]>().exec();
    }

    public async findByIds(
        ids: (string | Types.ObjectId)[],
    ): Promise<IClinic[]> {
        const objectIds = (ids || [])
            .map((id) =>
                Types.ObjectId.isValid(String(id))
                    ? new Types.ObjectId(String(id))
                    : null,
            )
            .filter((x): x is Types.ObjectId => x !== null);

        if (objectIds.length === 0) return [];

        return await Clinic.find({ _id: { $in: objectIds } })
            .lean<IClinic[]>()
            .exec();
    }

    public async getById(id: string): Promise<IClinic | null> {
        if (!Types.ObjectId.isValid(id)) return null;
        return await Clinic.findById(new Types.ObjectId(id))
            .lean<IClinic>()
            .exec();
    }

    public async updateById(
        id: string,
        dto: IClinicDTO,
    ): Promise<IClinic | null> {
        if (!Types.ObjectId.isValid(id)) return null;
        return await Clinic.findByIdAndUpdate(new Types.ObjectId(id), dto, {
            new: true,
        })
            .lean<IClinic>()
            .exec();
    }

    public async deleteById(id: string): Promise<boolean> {
        if (!Types.ObjectId.isValid(id)) return false;
        const doc = await Clinic.findByIdAndDelete(new Types.ObjectId(id))
            .lean<IClinic>()
            .exec();
        return doc != null;
    }
}

export const clinicRepository = new ClinicRepository();
