import { IClinic, IClinicDTO } from "../interfaces/clinic.interface";
import { Clinic } from "../models/clinic.model";
import { Doctor } from "../models/doctor.model";
import { ApiError } from "../errors/api.error";
import { StatusCodesEnum } from "../enums/status.codes.enum";

class ClinicService {
    public async searchClinics(query: { name?: string }): Promise<IClinic[]> {
        const nameFilter = query.name?.trim().toLowerCase() || "";

        const clinicsFromCollection = await Clinic.find().lean();
        const doctors = await Doctor.find({ isDeleted: false }).lean();

        const clinicMap = new Map(
            clinicsFromCollection.map((c) => [c._id.toString(), c]),
        );

        const clinicNamesFromDoctorsSet = new Set<string>();

        for (const doc of doctors) {
            if (Array.isArray(doc.clinics)) {
                for (const id of doc.clinics) {
                    const idStr = id.toString();
                    const clinic = clinicMap.get(idStr);
                    if (
                        clinic &&
                        clinic.name.toLowerCase().includes(nameFilter)
                    ) {
                        clinicNamesFromDoctorsSet.add(clinic.name);
                    }
                }
            }
        }

        const clinicNamesFromCollectionSet = new Set(
            clinicsFromCollection.map((c) => c.name),
        );

        const clinicsOnlyFromDoctors = Array.from(
            clinicNamesFromDoctorsSet,
        ).filter((name) => !clinicNamesFromCollectionSet.has(name));

        const clinicsFromDoctorsWithoutFullData = clinicsOnlyFromDoctors.map(
            (name) => ({
                _id: null,
                name,
                address: null,
                phone: null,
                doctors: [],
                services: [],
                createdAt: new Date(0),
                updatedAt: new Date(0),
            }),
        );

        const allClinics: any[] = [
            ...clinicsFromCollection,
            ...clinicsFromDoctorsWithoutFullData,
        ];

        for (const clinic of allClinics) {
            const clinicDoctors = doctors.filter((doc) =>
                doc.clinics.some(
                    (id) => id.toString() === clinic._id?.toString(),
                ),
            );

            clinic.doctors = clinicDoctors.map(
                (doc) => `${doc.name} ${doc.surname}`,
            );

            const servicesSet = new Set<string>();
            for (const doc of clinicDoctors) {
                doc.services?.forEach((s) => servicesSet.add(s.toString()));
            }
            clinic.services = Array.from(servicesSet);
        }

        allClinics.sort((a, b) => a.name.localeCompare(b.name));

        return allClinics;
    }

    public async create(clinic: IClinicDTO): Promise<IClinic> {
        return await Clinic.create(clinic);
    }

    public async getById(id: string): Promise<IClinic | null> {
        const clinic = await Clinic.findById(id).lean();
        if (!clinic) {
            throw new ApiError("Clinic not found", StatusCodesEnum.NOT_FOUND);
        }
        return clinic;
    }

    public async updateById(
        id: string,
        clinic: IClinicDTO,
    ): Promise<IClinic | null> {
        const updated = await Clinic.findByIdAndUpdate(id, clinic, {
            new: true,
        }).lean();
        if (!updated) {
            throw new ApiError("Clinic not found", StatusCodesEnum.NOT_FOUND);
        }
        return updated;
    }

    public async deleteById(id: string): Promise<void> {
        const deleted = await Clinic.findByIdAndDelete(id).lean();
        if (!deleted) {
            throw new ApiError("Clinic not found", StatusCodesEnum.NOT_FOUND);
        }
    }
}

export const clinicService = new ClinicService();
