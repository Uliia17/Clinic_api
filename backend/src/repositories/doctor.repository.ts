import { FilterQuery, Types } from "mongoose";
import { Doctor } from "../models/doctor.model";
import {
    IDoctor,
    IDoctorCreateDTO,
    IDoctorUpdateDTO,
    IDoctorQuery,
} from "../interfaces/doctor.interface";
import { IPaginatedResponse } from "../interfaces/paginated-response.interface";

export class DoctorRepository {
    public async create(dto: IDoctorCreateDTO): Promise<IDoctor> {
        const created = await Doctor.create(dto as any);
        return (created.toObject ? created.toObject() : created) as IDoctor;
    }

    public async findAll(
        query: IDoctorQuery,
    ): Promise<IPaginatedResponse<IDoctor>> {
        const { page = 1, pageSize = 10, order, search } = query;
        const filter: FilterQuery<IDoctor> = { isDeleted: false } as any;

        if ((query as any).name)
            filter.name = { $regex: (query as any).name, $options: "i" } as any;
        if ((query as any).surname)
            filter.surname = {
                $regex: (query as any).surname,
                $options: "i",
            } as any;
        if ((query as any).email)
            filter.email = {
                $regex: (query as any).email,
                $options: "i",
            } as any;
        if ((query as any).phone)
            filter.phone = {
                $regex: (query as any).phone,
                $options: "i",
            } as any;
        if (typeof (query as any).isActive === "boolean")
            (filter as any).isActive = (query as any).isActive;
        if (typeof (query as any).isVerified === "boolean")
            (filter as any).isVerified = (query as any).isVerified;

        if (search && String(search).trim() !== "") {
            const s = String(search).trim();
            filter.$or = [
                { name: { $regex: s, $options: "i" } },
                { surname: { $regex: s, $options: "i" } },
                { email: { $regex: s, $options: "i" } },
                { phone: { $regex: s, $options: "i" } },
            ] as any;
        }

        // сортування
        const sort: Record<string, 1 | -1> = {};
        if (order) {
            const dir = order.startsWith("-") ? -1 : 1;
            const field = order.replace(/^-/, "");
            sort[field] = dir;
        } else {
            sort["createdAt"] = -1;
        }

        const skip = (page - 1) * pageSize;
        const totalItems = await Doctor.countDocuments(filter);
        const docs = await Doctor.find(filter)
            .sort(sort)
            .skip(skip)
            .limit(pageSize)
            .lean<IDoctor[]>()
            .exec();

        const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

        const result: IPaginatedResponse<IDoctor> = {
            data: docs,
            totalItems,
            totalPages,
            prevPage: page > 1,
            nextPage: page < totalPages,
            page,
            pageSize,
        };

        return result;
    }

    public async getById(id: string): Promise<IDoctor | null> {
        if (!Types.ObjectId.isValid(id)) return null;
        return await Doctor.findById(new Types.ObjectId(id))
            .lean<IDoctor>()
            .exec();
    }

    public async findByIds(
        ids: string[] | Types.ObjectId[],
    ): Promise<IDoctor[]> {
        const objectIds = (ids || [])
            .map((id) => {
                const s = String(id);
                return Types.ObjectId.isValid(s) ? new Types.ObjectId(s) : null;
            })
            .filter((x): x is Types.ObjectId => x !== null);

        if (objectIds.length === 0) return [];

        return await Doctor.find({ _id: { $in: objectIds } })
            .populate("clinics")
            .populate("services")
            .lean<IDoctor[]>()
            .exec();
    }

    public async findByEmail(email: string): Promise<IDoctor | null> {
        return await Doctor.findOne({ email }).lean<IDoctor>().exec();
    }

    public async updateById(
        id: string,
        dto: IDoctorUpdateDTO,
    ): Promise<IDoctor | null> {
        if (!Types.ObjectId.isValid(id)) return null;
        return await Doctor.findByIdAndUpdate(new Types.ObjectId(id), dto, {
            new: true,
        })
            .lean<IDoctor>()
            .exec();
    }

    public async deleteById(id: string): Promise<IDoctor | null> {
        if (!Types.ObjectId.isValid(id)) return null;
        return await Doctor.findByIdAndDelete(new Types.ObjectId(id))
            .lean<IDoctor>()
            .exec();
    }

    public async setActiveStatus(
        id: string,
        isActive: boolean,
    ): Promise<IDoctor | null> {
        if (!Types.ObjectId.isValid(id)) return null;
        return await Doctor.findByIdAndUpdate(
            new Types.ObjectId(id),
            { isActive },
            { new: true },
        )
            .lean<IDoctor>()
            .exec();
    }
}

export const doctorRepository = new DoctorRepository();
