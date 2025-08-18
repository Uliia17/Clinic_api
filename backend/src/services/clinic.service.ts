import { ApiError } from "../errors/api.error";
import { StatusCodesEnum } from "../enums/status.codes.enum";
import {
    IClinic,
    IClinicDTO,
    IClinicResponse,
    IClinicQuery,
} from "../interfaces/clinic.interface";
import { clinicRepository } from "../repositories/clinic.repository";
import { doctorService } from "./doctor.service";
import { serviceService } from "./service.service";
import { IPaginatedResponse } from "../interfaces/paginated-response.interface";

export class ClinicService {
    public async searchClinics(
        query: Partial<IClinicQuery> = {},
    ): Promise<IPaginatedResponse<IClinicResponse>> {
        const paginated = await clinicRepository.search(query as any);

        const data = await Promise.all(
            (paginated.data || []).map((c) => this.toResponse(c)),
        );

        return {
            ...paginated,
            data,
        } as IPaginatedResponse<IClinicResponse>;
    }

    public async getAll(): Promise<IClinicResponse[]> {
        const clinics: IClinic[] = await clinicRepository.findAll();
        return await Promise.all(clinics.map((c) => this.toResponse(c)));
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
        clinicDto: IClinicDTO,
    ): Promise<IClinicResponse> {
        const updated = await clinicRepository.updateById(id, clinicDto);
        if (!updated) {
            throw new ApiError("Clinic not found", StatusCodesEnum.NOT_FOUND);
        }
        return await this.toResponse(updated);
    }

    public async deleteById(id: string): Promise<void> {
        const ok = await clinicRepository.deleteById(id);
        if (!ok) {
            throw new ApiError("Clinic not found", StatusCodesEnum.NOT_FOUND);
        }
    }

    private async toResponse(clinic: IClinic): Promise<IClinicResponse> {
        const doctorIds: string[] =
            clinic.doctors && clinic.doctors.length
                ? clinic.doctors.map((id: any) => String(id))
                : [];

        const serviceIds: string[] =
            clinic.services && clinic.services.length
                ? clinic.services.map((id: any) => String(id))
                : [];

        const doctors =
            doctorIds.length > 0 ? await doctorService.getByIds(doctorIds) : [];

        const services =
            serviceIds.length > 0
                ? await serviceService.getByIds(serviceIds)
                : [];

        return {
            _id: clinic._id ? String(clinic._id) : "",
            name: clinic.name,
            doctors,
            services,
            createdAt: clinic.createdAt
                ? new Date(clinic.createdAt).toISOString()
                : undefined,
            updatedAt: clinic.updatedAt
                ? new Date(clinic.updatedAt).toISOString()
                : undefined,
        };
    }
}

export const clinicService = new ClinicService();
