import { Clinic } from "../models/clinic.model";
import { IClinic, IClinicDTO } from "../interfaces/clinic.interface";

class ClinicRepository {
    public async searchByName(partialName: string): Promise<IClinic[]> {
        const regex = new RegExp(partialName, "i");
        return await Clinic.find({ name: { $regex: regex } })
            .sort({ name: 1 })
            .lean();
    }

    public async create(clinic: IClinicDTO): Promise<IClinic> {
        return await Clinic.create(clinic);
    }

    public async getById(clinicId: string): Promise<IClinic | null> {
        return await Clinic.findById(clinicId);
    }

    public async updateById(
        clinicId: string,
        clinic: IClinicDTO,
    ): Promise<IClinic | null> {
        return await Clinic.findByIdAndUpdate(clinicId, clinic, { new: true });
    }

    public async deleteById(clinicId: string): Promise<IClinic | null> {
        return await Clinic.findByIdAndDelete(clinicId);
    }

    public async getAll(): Promise<IClinic[]> {
        return await Clinic.find().sort({ name: 1 }).lean();
    }
}

export const clinicRepository = new ClinicRepository();
