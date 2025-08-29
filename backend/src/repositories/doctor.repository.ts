import { Types } from "mongoose";
import { Doctor, DoctorDocument } from "../models/doctor.model";
import {
    IDoctor,
    IDoctorCreateDTO,
    IDoctorUpdateDTO,
    IDoctorQuery,
} from "../interfaces/doctor.interface";
import { IPaginatedResponse } from "../interfaces/paginated-response.interface";

export class DoctorRepository {
    public async create(dto: IDoctorCreateDTO): Promise<DoctorDocument> {
        const created = await Doctor.create(dto as any);
        return created as DoctorDocument;
    }

    public async findAll(
        query: IDoctorQuery,
    ): Promise<IPaginatedResponse<IDoctor>> {
        const { page = 1, pageSize = 10, order } = query;
        const filter: any = { isDeleted: false };
        if ((query as any).name)
            filter.name = { $regex: (query as any).name, $options: "i" };
        if ((query as any).surname)
            filter.surname = { $regex: (query as any).surname, $options: "i" };
        if ((query as any).email)
            filter.email = { $regex: (query as any).email, $options: "i" };
        if ((query as any).phone)
            filter.phone = { $regex: (query as any).phone, $options: "i" };
        if (query.isActive === true || query.isActive === false) {
            filter.isActive = query.isActive;
        }
        if (query.isVerified === true || query.isVerified === false) {
            filter.isVerified = query.isVerified;
        }

        if (
            (query as any).search &&
            String((query as any).search).trim() !== ""
        ) {
            const s = String((query as any).search).trim();
            filter.$or = [
                { name: { $regex: s, $options: "i" } },
                { surname: { $regex: s, $options: "i" } },
                { email: { $regex: s, $options: "i" } },
                { phone: { $regex: s, $options: "i" } },
            ];
        }

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

    public async findByEmail(
        email: string,
        withPassword = false,
    ): Promise<DoctorDocument | null> {
        const query = Doctor.findOne({ email });
        if (withPassword) {
            query.select("+password"); // підтягуємо пароль тільки коли потрібно
        }
        return await query.lean<DoctorDocument | null>().exec();
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

    public async findByClinicId(clinicId: string) {
        return await Doctor.find({ clinics: clinicId }).lean().exec();
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
