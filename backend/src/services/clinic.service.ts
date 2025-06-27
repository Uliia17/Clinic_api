import { Clinic } from "../models/clinic.model";
import { Doctor } from "../models/doctor.model";
import { ApiError } from "../errors/api.error";
import { StatusCodesEnum } from "../enums/status.codes.enum";
import {
    IClinic,
    IClinicDTO,
    IClinicResponse,
} from "../interfaces/clinic.interface";

class ClinicService {
    public async searchClinics(query: {
        name?: string;
        doctorId?: string;
        serviceId?: string;
        order?: string;
    }): Promise<IClinicResponse[]> {
        const nameFilter = query.name?.trim().toLowerCase() || "";
        const doctorId = query.doctorId;
        const serviceId = query.serviceId;
        const order = query.order;

        const clinicsFromCollection = await Clinic.find().lean();
        const doctors = await Doctor.find({ isDeleted: false }).lean();

        const filteredDoctors = doctors.filter((doc) => {
            const matchDoctor = !doctorId || doc._id.toString() === doctorId;
            const matchService =
                !serviceId ||
                doc.services.some((s) => s.toString() === serviceId);
            return matchDoctor && matchService;
        });

        const clinicIds = new Set<string>();
        for (const doc of filteredDoctors) {
            doc.clinics.forEach((id) => clinicIds.add(id.toString()));
        }

        let resultClinics = clinicsFromCollection.filter(
            (clinic) =>
                clinicIds.has(clinic._id.toString()) &&
                clinic.name.toLowerCase().includes(nameFilter),
        );

        const enrichedClinics: IClinicResponse[] = resultClinics.map(
            (clinic) => {
                const clinicDoctors = filteredDoctors.filter((doc) =>
                    doc.clinics.some(
                        (id) => id.toString() === clinic._id.toString(),
                    ),
                );

                const doctorNames = clinicDoctors.map(
                    (doc) => `${doc.name} ${doc.surname}`,
                );
                const serviceSet = new Set<string>();
                for (const doc of clinicDoctors) {
                    doc.services.forEach((s) => serviceSet.add(s.toString()));
                }

                return {
                    ...clinic,
                    doctorNames,
                    serviceIds: Array.from(serviceSet),
                };
            },
        );

        if (order) {
            const direction = order.startsWith("-") ? -1 : 1;
            const field = order.replace("-", "");
            if (field === "name") {
                enrichedClinics.sort((a, b) =>
                    direction === 1
                        ? a.name.localeCompare(b.name)
                        : b.name.localeCompare(a.name),
                );
            }
        }

        return enrichedClinics;
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
