import { ApiError } from "../errors/api.error";
import { StatusCodesEnum } from "../enums/status.codes.enum";
import {
    IClinic,
    IClinicDTO,
    IClinicResponse,
    IClinicDoctor,
    IClinicUpdateDTO,
} from "../interfaces/clinic.interface";
import { clinicRepository } from "../repositories/clinic.repository";
import { doctorService } from "./doctor.service";
import { Types } from "mongoose";

export class ClinicService {
    public async getAll(): Promise<IClinicResponse[]> {
        const clinics: IClinic[] = await clinicRepository.findAll();

        return await Promise.all(
            clinics.map((clinic) => this.toResponse(clinic)),
        );
    }

    public async create(clinicDto: IClinicDTO): Promise<IClinicResponse> {
        const created: IClinic = await clinicRepository.create(clinicDto);
        return await this.toResponse(created);
    }

    public async getById(id: string): Promise<IClinicResponse> {
        const clinic = await clinicRepository.getById(id);
        if (!clinic) {
            throw new ApiError("Clinic not found", StatusCodesEnum.NOT_FOUND);
        }
        return await this.toResponse(clinic);
    }

    public async updateById(
        id: string,
        dto: IClinicUpdateDTO,
    ): Promise<IClinicResponse> {
        if (!Types.ObjectId.isValid(id)) {
            throw new ApiError("Invalid ID", StatusCodesEnum.BAD_REQUEST);
        }

        const updated = await clinicRepository.updateById(id, dto);
        if (!updated) {
            throw new ApiError("Clinic not found", StatusCodesEnum.NOT_FOUND);
        }

        const clinicWithAddress: IClinic = {
            ...updated,
            address:
                dto.address && dto.address.trim() !== ""
                    ? dto.address
                    : updated.address || "-",
        } as IClinic;

        return await this.toResponse(clinicWithAddress);
    }

    public async deleteById(id: string): Promise<void> {
        const ok = await clinicRepository.deleteById(id);
        if (!ok) {
            throw new ApiError("Clinic not found", StatusCodesEnum.NOT_FOUND);
        }
    }
    private async toResponse(clinic: IClinic): Promise<IClinicResponse> {
        const doctorDocs = await doctorService.getByClinicIdFull(
            String(clinic._id),
        );

        const doctors: IClinicDoctor[] = (doctorDocs || []).map((d) => ({
            name: d.name,
            surname: d.surname,
            phone: d.phone && d.phone.trim() !== "" ? d.phone : "-",
            services: Array.isArray(d.services)
                ? d.services.map((s: any) =>
                      typeof s === "string" ? s : s.name,
                  )
                : [],
        }));

        const allServicesSet = new Set<string>();
        doctors.forEach((doc) => {
            (doc.services || []).forEach((svc) => {
                if (svc) allServicesSet.add(svc);
            });
        });

        return {
            _id: String(clinic._id),
            name: clinic.name,
            address:
                clinic.address && clinic.address.trim() !== ""
                    ? clinic.address
                    : "-",
            phone: doctors.length > 0 ? doctors[0].phone : "-",
            doctors,
            services: Array.from(allServicesSet),
        };
    }
}

export const clinicService = new ClinicService();
