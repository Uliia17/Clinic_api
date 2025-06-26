import {
    IDoctor,
    IDoctorCreateDTO,
    IDoctorQuery,
    IDoctorUpdateDTO,
} from "../interfaces/doctor.interface";
import { Doctor } from "../models/doctor.model";
import { FilterQuery, Types } from "mongoose";

class DoctorRepository {
    public async getAll(query: IDoctorQuery): Promise<any> {
        const {
            name,
            surname,
            phone,
            email,
            order,
            pageSize = 10,
            page = 1,
        } = query;

        const filterObject: FilterQuery<IDoctor> = { isDeleted: false };

        if (name) {
            filterObject.name = { $regex: name, $options: "i" };
        }
        if (surname) {
            filterObject.surname = { $regex: surname, $options: "i" };
        }
        if (phone) {
            filterObject.phone = { $regex: phone, $options: "i" };
        }
        if (email) {
            filterObject.email = { $regex: email, $options: "i" };
        }

        const sortObject: Record<string, 1 | -1> = {};
        if (order) {
            if (order.startsWith("-")) {
                sortObject[order.slice(1)] = -1;
            } else {
                sortObject[order] = 1;
            }
        }

        const skip = (Number(page) - 1) * Number(pageSize);
        const totalItems = await Doctor.countDocuments(filterObject);

        const data = await Doctor.find(filterObject)
            .sort(sortObject)
            .skip(skip)
            .limit(Number(pageSize));

        const totalPages = Math.ceil(totalItems / Number(pageSize));

        return {
            totalItems,
            totalPages,
            prevPage: page > 1,
            nextPage: page < totalPages,
            data,
        };
    }

    public create(doctor: IDoctorCreateDTO): Promise<IDoctor> {
        return Doctor.create(doctor);
    }

    public getById(doctorId: string | Types.ObjectId): Promise<IDoctor | null> {
        return Doctor.findById(doctorId);
    }

    public getByEmail(email: string): Promise<IDoctor | null> {
        return Doctor.findOne({ email });
    }

    public updateById(
        doctorId: string | Types.ObjectId,
        doctor: IDoctorUpdateDTO,
    ): Promise<IDoctor | null> {
        return Doctor.findByIdAndUpdate(doctorId, doctor, { new: true });
    }

    public deleteById(doctorId: string): Promise<IDoctor | null> {
        return Doctor.findByIdAndDelete(doctorId);
    }

    public blockDoctor(doctorId: string): Promise<IDoctor | null> {
        return Doctor.findByIdAndUpdate(
            doctorId,
            { isActive: false },
            { new: true },
        );
    }

    public unblockDoctor(doctorId: string): Promise<IDoctor | null> {
        return Doctor.findByIdAndUpdate(
            doctorId,
            { isActive: true },
            { new: true },
        );
    }
}

export const doctorRepository = new DoctorRepository();
