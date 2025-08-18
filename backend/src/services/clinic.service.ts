// import { ApiError } from "../errors/api.error";
// import { StatusCodesEnum } from "../enums/status.codes.enum";
// import {
//     IClinic,
//     IClinicDTO,
//     IClinicResponse,
//     IClinicQuery,
// } from "../interfaces/clinic.interface";
// import { clinicRepository } from "../repositories/clinic.repository";
// import { doctorService } from "./doctor.service";
// import { serviceService } from "./service.service";
//
// /**
//  * ClinicService — конвертує DB IClinic -> IClinicResponse
//  * І викликає doctorService.getByIds / serviceService.getByIds
//  */
// export class ClinicService {
//     public async searchClinics(query: {
//         name?: string;
//         doctorId?: string;
//         serviceId?: string;
//         order?: string;
//         page?: number;
//         pageSize?: number;
//     }): Promise<IClinicResponse[]> {
//         const q: IClinicQuery = {
//             name: query.name?.trim() || undefined,
//             doctorId: query.doctorId ? query.doctorId : undefined,
//             serviceId: query.serviceId ? query.serviceId : undefined,
//             order: query.order,
//             page: query.page,
//             pageSize: query.pageSize,
//         };
//
//         const repoResult: any = await clinicRepository.search(q);
//
//         // clinicRepository.search повертає paginated object (має .data). Якщо ж у вас реалізація повертає plain array — цей код теж працює.
//         const clinics: IClinic[] = Array.isArray(repoResult)
//             ? repoResult
//             : (repoResult.data ?? []);
//
//         return await Promise.all(clinics.map((c) => this.toResponse(c)));
//     }
//
//     public async getAll(): Promise<IClinicResponse[]> {
//         const repoRes: any = await clinicRepository.findAll();
//         const clinics: IClinic[] = Array.isArray(repoRes)
//             ? repoRes
//             : (repoRes.data ?? []);
//         return await Promise.all(clinics.map((c) => this.toResponse(c)));
//     }
//
//     public async create(clinicDto: IClinicDTO): Promise<IClinicResponse> {
//         const created = await clinicRepository.create(clinicDto);
//         return await this.toResponse(created);
//     }
//
//     public async getById(id: string): Promise<IClinicResponse> {
//         const clinic = await clinicRepository.getById(id);
//         if (!clinic)
//             throw new ApiError("Clinic not found", StatusCodesEnum.NOT_FOUND);
//         return await this.toResponse(clinic);
//     }
//
//     public async updateById(
//         id: string,
//         clinicDto: IClinicDTO,
//     ): Promise<IClinicResponse> {
//         const updated = await clinicRepository.updateById(id, clinicDto);
//         if (!updated)
//             throw new ApiError("Clinic not found", StatusCodesEnum.NOT_FOUND);
//         return await this.toResponse(updated);
//     }
//
//     public async deleteById(id: string): Promise<void> {
//         const deleted = await clinicRepository.deleteById(id);
//         if (!deleted)
//             throw new ApiError("Clinic not found", StatusCodesEnum.NOT_FOUND);
//     }
//
//     private async toResponse(clinic: IClinic): Promise<IClinicResponse> {
//         // Отримуємо doctors як IDoctorResponse[] (через doctorService.getByIds)
//         const doctors =
//             clinic.doctors && clinic.doctors.length
//                 ? await doctorService.getByIds(
//                       clinic.doctors.map((id) => id.toString()),
//                   )
//                 : [];
//
//         // Отримуємо services як IServiceResponse[]
//         const services =
//             clinic.services && clinic.services.length
//                 ? await serviceService.getByIds(
//                       clinic.services.map((id) => id.toString()),
//                   )
//                 : [];
//
//         return {
//             _id: clinic._id.toString(),
//             name: clinic.name,
//             doctors,
//             services,
//             createdAt: clinic.createdAt
//                 ? clinic.createdAt.toISOString()
//                 : new Date().toISOString(),
//             updatedAt: clinic.updatedAt
//                 ? clinic.updatedAt.toISOString()
//                 : new Date().toISOString(),
//         };
//     }
// }
//
// export const clinicService = new ClinicService();
// src/services/clinic.service.ts

// import { ApiError } from "../errors/api.error";
// import { StatusCodesEnum } from "../enums/status.codes.enum";
// import {
//     IClinic,
//     IClinicDTO,
//     IClinicResponse,
// } from "../interfaces/clinic.interface";
// import { clinicRepository } from "../repositories/clinic.repository";
// import { doctorService } from "./doctor.service";
// import { serviceService } from "./service.service";
//
// export class ClinicService {
//     // Отримати всі клініки (повертає масив IClinicResponse з докторами/сервісами)
//     public async getAll(): Promise<IClinicResponse[]> {
//         const clinics: IClinic[] = await clinicRepository.findAll();
//         return await Promise.all(clinics.map((c) => this.toResponse(c)));
//     }
//
//     // Пошук / пагінація клінік (якщо тобі потрібен search з page/pageSize, тримай)
//     public async search(query: {
//         name?: string;
//         order?: string;
//         page?: number;
//         pageSize?: number;
//     }): Promise<{
//         data: IClinicResponse[];
//         totalItems: number;
//         totalPages: number;
//         page?: number;
//         pageSize?: number;
//     }> {
//         const paginated = await clinicRepository.search(query as any); // припускаємо сигнатуру repo
//         const data = await Promise.all(
//             paginated.data.map((c) => this.toResponse(c)),
//         );
//         return {
//             data,
//             totalItems: paginated.totalItems,
//             totalPages: paginated.totalPages,
//             page: (paginated as any).page,
//             pageSize: (paginated as any).pageSize,
//         };
//     }
//
//     public async create(clinicDto: IClinicDTO): Promise<IClinicResponse> {
//         const created = await clinicRepository.create(clinicDto);
//         return await this.toResponse(created);
//     }
//
//     public async getById(id: string): Promise<IClinicResponse> {
//         const clinic = await clinicRepository.getById(id);
//         if (!clinic)
//             throw new ApiError("Clinic not found", StatusCodesEnum.NOT_FOUND);
//         return await this.toResponse(clinic);
//     }
//
//     public async updateById(
//         id: string,
//         dto: IClinicDTO,
//     ): Promise<IClinicResponse> {
//         const updated = await clinicRepository.updateById(id, dto);
//         if (!updated)
//             throw new ApiError("Clinic not found", StatusCodesEnum.NOT_FOUND);
//         return await this.toResponse(updated);
//     }
//
//     public async deleteById(id: string): Promise<void> {
//         const ok = await clinicRepository.deleteById(id);
//         if (!ok)
//             throw new ApiError("Clinic not found", StatusCodesEnum.NOT_FOUND);
//     }
//
//     // Перетворює IClinic -> IClinicResponse, підтягує дані лікарів і сервісів
//     private async toResponse(clinic: IClinic): Promise<IClinicResponse> {
//         // доктори у форматі IDoctorResponse[]
//         const doctors =
//             clinic.doctors && clinic.doctors.length
//                 ? await doctorService.getByIds(
//                       clinic.doctors.map((id) => id.toString()),
//                   )
//                 : [];
//
//         // сервіси у форматі IServiceResponse[]
//         const services =
//             clinic.services && clinic.services.length
//                 ? await serviceService.getByIds(
//                       clinic.services.map((id) => id.toString()),
//                   )
//                 : [];
//
//         return {
//             _id: clinic._id.toString(),
//             name: clinic.name,
//             doctors,
//             services,
//             createdAt: clinic.createdAt
//                 ? clinic.createdAt.toISOString()
//                 : undefined,
//             updatedAt: clinic.updatedAt
//                 ? clinic.updatedAt.toISOString()
//                 : undefined,
//         };
//     }
// }
//
// export const clinicService = new ClinicService();
// src/services/clinic.service.ts

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
    /**
     * Пошук клінік з фільтром, сортуванням і пагінацією.
     * Повертає пагінований об'єкт, де data — масив IClinicResponse.
     */
    public async searchClinics(
        query: Partial<IClinicQuery> = {},
    ): Promise<IPaginatedResponse<IClinicResponse>> {
        // Передаємо query "as any", щоб репозиторій сам обробив поля (doctorId/serviceId можуть бути ObjectId)
        const paginated = await clinicRepository.search(query as any);

        // Мапимо кожну clinic у IClinicResponse (паралельно)
        const data = await Promise.all(
            (paginated.data || []).map((c) => this.toResponse(c)),
        );

        // Повертаємо з тими самими полями пагінації, замінивши data на сформовані responses
        return {
            ...paginated,
            data,
        } as IPaginatedResponse<IClinicResponse>;
    }

    /**
     * Повертає усі клініки (без пагінації) як масив IClinicResponse.
     * Викликає clinicRepository.findAll() (повинен повертати IClinic[]).
     */
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

    /**
     * Перетворює DB-об'єкт IClinic (де doctors/services — ObjectId[] або populated)
     * у IClinicResponse — з масивами повних об'єктів лікарів і сервісів.
     */
    private async toResponse(clinic: IClinic): Promise<IClinicResponse> {
        // Отримуємо ID-рядки з можливих ObjectId-ів або рядків
        const doctorIds: string[] =
            clinic.doctors && clinic.doctors.length
                ? clinic.doctors.map((id: any) => String(id))
                : [];

        const serviceIds: string[] =
            clinic.services && clinic.services.length
                ? clinic.services.map((id: any) => String(id))
                : [];

        // Якщо є лікарі — підтягаємо через doctorService.getByIds (повинен повертати IDoctorResponse[])
        const doctors =
            doctorIds.length > 0 ? await doctorService.getByIds(doctorIds) : [];

        // Якщо є сервіси — підтягаємо через serviceService.getByIds (повинен повертати IServiceResponse[])
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
