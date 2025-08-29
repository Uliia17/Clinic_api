import { ApiError } from "../errors/api.error";
import { StatusCodesEnum } from "../enums/status.codes.enum";
import { IPaginatedResponse } from "../interfaces/paginated-response.interface";
import { serviceRepository } from "../repositories/service.repository";
import {
    IServiceDTO,
    IServiceResponse,
    IServiceQuery,
    IServiceDoctor,
    IService,
    IServiceUpdateDTO,
} from "../interfaces/service.interface";
import { Doctor } from "../models/doctor.model";
import { Clinic } from "../models/clinic.model";
import { Types } from "mongoose";
import { Service } from "../models/service.model";

export class ServiceService {
    public async getServices(
        query: Partial<IServiceQuery> = {},
    ): Promise<IPaginatedResponse<IServiceResponse>> {
        if (typeof (serviceRepository as any).search === "function") {
            const pageResult = await (serviceRepository as any).search(
                query as any,
            );
            const data = await Promise.all(
                (pageResult.data || []).map((s: any) => this.toResponse(s)),
            );
            return {
                ...pageResult,
                data,
            } as IPaginatedResponse<IServiceResponse>;
        }
        const services: IService[] = await (serviceRepository as any).findAll();
        const data = await Promise.all(services.map((s) => this.toResponse(s)));

        return {
            data,
            totalItems: services.length,
            totalPages: 1,
            prevPage: false,
            nextPage: false,
            page: 1,
            pageSize: services.length,
        } as IPaginatedResponse<IServiceResponse>;
    }

    public async create(dto: IServiceDTO): Promise<IServiceResponse> {
        const created = await serviceRepository.create(dto);
        return await this.toResponse(created);
    }

    public async getById(id: string): Promise<IServiceResponse> {
        const svc = await serviceRepository.getById(id);
        if (!svc) {
            throw new ApiError("Service not found", StatusCodesEnum.NOT_FOUND);
        }
        return await this.toResponse(svc);
    }

    public async updateById(
        id: string,
        dto: Partial<IServiceUpdateDTO>,
    ): Promise<IServiceResponse> {
        if (!Types.ObjectId.isValid(id)) {
            throw new ApiError("Invalid ID", StatusCodesEnum.BAD_REQUEST);
        }

        const updated = await serviceRepository.updateById(id, dto);
        if (!updated) {
            throw new ApiError("Service not found", StatusCodesEnum.NOT_FOUND);
        }

        const populated = await Service.findById(updated._id)
            .populate("clinics")
            .populate({ path: "doctors", populate: ["clinics", "services"] })
            .lean()
            .exec();

        return await this.toResponse(populated || updated);
    }

    public async deleteById(id: string): Promise<void> {
        const ok = await serviceRepository.deleteById(id);
        if (!ok) {
            throw new ApiError("Service not found", StatusCodesEnum.NOT_FOUND);
        }
    }
    private async toResponse(serviceDoc: any): Promise<IServiceResponse> {
        const serviceId = String(serviceDoc._id);

        const clinicDocs = await Clinic.find({
            services: new Types.ObjectId(serviceId),
        })
            .lean()
            .exec();

        const clinics: {
            _id: string;
            name: string;
            address: string;
        }[] = (clinicDocs || []).map((c: any) => ({
            _id: String(c._id),
            name: String(c.name ?? ""),
            address: c.address ? String(c.address) : "",
        }));

        const doctorDocs = await Doctor.find({
            services: new Types.ObjectId(serviceId),
        })
            .populate("clinics")
            .populate("services")
            .lean()
            .exec();

        const doctors: IServiceDoctor[] = (doctorDocs || []).map((d: any) => {
            const clinicsNames = Array.isArray(d.clinics)
                ? d.clinics.map((c: any) => String(c.name ?? c)).filter(Boolean)
                : [];
            const servicesNames = Array.isArray(d.services)
                ? d.services
                      .map((s: any) => String(s.name ?? s))
                      .filter(Boolean)
                : [];

            return {
                _id: String(d._id),
                name: String(d.name ?? ""),
                surname: String(d.surname ?? ""),
                phone: String(d.phone ?? ""),
                clinics: clinicsNames,
                services: servicesNames,
            };
        });

        return {
            _id: String(serviceDoc._id),
            name: String(serviceDoc.name ?? ""),
            clinics,
            doctors,
        };
    }
}

export const serviceService = new ServiceService();
