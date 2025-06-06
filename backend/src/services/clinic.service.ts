import { IClinic, IClinicDTO } from "../interfaces/clinic.interface";
import { Clinic } from "../models/clinic.model";
import { Doctor } from "../models/doctor.model";
import { ApiError } from "../errors/api.error";
import { StatusCodesEnum } from "../enums/status.codes.enum";

type ClinicResult = IClinic & {
    _id: string | null;
    doctors?: string[];
    services?: string[];
};

class ClinicService {
    public async searchClinics(query: {
        name?: string;
    }): Promise<ClinicResult[]> {
        const nameFilter = query.name?.trim().toLowerCase() || "";

        const clinicsFromCollection = nameFilter
            ? await Clinic.find({
                  name: { $regex: nameFilter, $options: "i" },
              }).lean()
            : await Clinic.find().lean();

        const doctors = await Doctor.find({ isDeleted: false }).lean();

        const clinicNamesFromDoctorsSet = new Set<string>();
        for (const doc of doctors) {
            if (Array.isArray(doc.clinics)) {
                for (const clinicName of doc.clinics) {
                    if (clinicName.toLowerCase().includes(nameFilter)) {
                        clinicNamesFromDoctorsSet.add(clinicName);
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

        const clinicsFromDoctorsWithoutFullData: ClinicResult[] =
            clinicsOnlyFromDoctors.map((name) => ({
                _id: null,
                name,
                address: null,
                phone: null,
                doctors: [],
                services: [],
                createdAt: new Date(0),
                updatedAt: new Date(0),
            }));

        const allClinics: ClinicResult[] = [
            ...clinicsFromCollection,
            ...clinicsFromDoctorsWithoutFullData,
        ];

        for (const clinic of allClinics) {
            // Лікарі, які працюють у цій клініці (порівняння по назві)
            const clinicDoctors = doctors.filter(
                (doc) =>
                    Array.isArray(doc.clinics) &&
                    doc.clinics.some(
                        (cn) => cn.toLowerCase() === clinic.name.toLowerCase(),
                    ),
            );

            clinic.doctors = clinicDoctors.map(
                (doc) => `${doc.name} ${doc.surname}`,
            );

            const servicesSet = new Set<string>();
            for (const doc of clinicDoctors) {
                if (Array.isArray(doc.services)) {
                    doc.services.forEach((s) => servicesSet.add(s));
                }
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
