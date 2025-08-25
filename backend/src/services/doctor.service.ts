import { Types } from "mongoose";
import bcrypt from "bcryptjs";

import { Doctor, DoctorDocument } from "../models/doctor.model";
import { Clinic } from "../models/clinic.model";
import { Service } from "../models/service.model";

import { doctorRepository } from "../repositories/doctor.repository";

import {
    IDoctor,
    IDoctorCreateDTO,
    IDoctorQuery,
    IDoctorUpdateDTO,
    IDoctorResponse,
    ClinicSummary,
    ServiceSummary,
} from "../interfaces/doctor.interface";

import { ApiError } from "../errors/api.error";
import { StatusCodesEnum } from "../enums/status.codes.enum";
import { clinicRepository } from "../repositories/clinic.repository";
import { serviceRepository } from "../repositories/service.repository";
import { IPaginatedResponse } from "../interfaces/paginated-response.interface";

export class DoctorService {
    private SALT_ROUNDS = 10;

    private mapClinicFromDoc(c: any): ClinicSummary {
        return {
            _id: String(c._id ?? c),
            name: String(c.name ?? ""),
        };
    }

    private mapServiceFromDoc(s: any): ServiceSummary {
        return {
            _id: String(s._id ?? s),
            name: String(s.name ?? ""),
        };
    }

    private toResponseFromPlain(doc: any): IDoctorResponse {
        const clinicsRaw = Array.isArray(doc.clinics) ? doc.clinics : [];
        const servicesRaw = Array.isArray(doc.services) ? doc.services : [];

        const clinics = clinicsRaw
            .map((c) => this.mapClinicFromDoc(c))
            .filter(
                (v, i, a) => !a.find((x, idx) => idx < i && x._id === v._id),
            );

        const services = servicesRaw
            .map((s) => this.mapServiceFromDoc(s))
            .filter(
                (v, i, a) => !a.find((x, idx) => idx < i && x._id === v._id),
            );

        return {
            _id: String(doc._id),
            name: String(doc.name),
            surname: String(doc.surname),
            phone: String(doc.phone),
            email: String(doc.email),
            avatar: doc.avatar ?? "",
            clinics,
            services,
            role: doc.role,
            isVerified: !!doc.isVerified,
            isActive: !!doc.isActive,
            createdAt: doc.createdAt
                ? new Date(doc.createdAt).toISOString()
                : new Date().toISOString(),
            updatedAt: doc.updatedAt
                ? new Date(doc.updatedAt).toISOString()
                : new Date().toISOString(),
        };
    }

    public async getAll(
        query: IDoctorQuery,
    ): Promise<IPaginatedResponse<IDoctorResponse>> {
        const pageResult = await doctorRepository.findAll(query);
        const docs: IDoctor[] = pageResult.data;
        const clinicIdSet = new Set<string>();
        const serviceIdSet = new Set<string>();

        docs.forEach((d: any) => {
            const clinicsArr = Array.isArray(d.clinics) ? d.clinics : [];
            const servicesArr = Array.isArray(d.services) ? d.services : [];

            clinicsArr.forEach((cid: any) => clinicIdSet.add(String(cid)));
            servicesArr.forEach((sid: any) => serviceIdSet.add(String(sid)));
        });

        const clinicIds = Array.from(clinicIdSet)
            .filter(Boolean)
            .map((id) => new Types.ObjectId(id));
        const serviceIds = Array.from(serviceIdSet)
            .filter(Boolean)
            .map((id) => new Types.ObjectId(id));

        const [clinicDocs, serviceDocs] = await Promise.all([
            clinicIds.length
                ? Clinic.find({ _id: { $in: clinicIds } })
                      .lean()
                      .exec()
                : Promise.resolve([] as any[]),
            serviceIds.length
                ? Service.find({ _id: { $in: serviceIds } })
                      .lean()
                      .exec()
                : Promise.resolve([] as any[]),
        ]);

        const clinicMap = new Map<string, any>();
        clinicDocs.forEach((c) => clinicMap.set(String(c._id), c));
        const serviceMap = new Map<string, any>();
        serviceDocs.forEach((s) => serviceMap.set(String(s._id), s));

        const data: IDoctorResponse[] = docs.map((d: any) => {
            const clinics = (Array.isArray(d.clinics) ? d.clinics : [])
                .map((cid: any) => {
                    const id = String(cid);
                    const c = clinicMap.get(id);
                    return {
                        _id: id,
                        name: c ? String(c.name ?? "") : "",
                    } as ClinicSummary;
                })
                .filter(
                    (v, i, a) =>
                        !a.find((x, idx) => idx < i && x._id === v._id),
                );

            const services = (Array.isArray(d.services) ? d.services : [])
                .map((sid: any) => {
                    const id = String(sid);
                    const s = serviceMap.get(id);
                    return {
                        _id: id,
                        name: s ? String(s.name ?? "") : "",
                    } as ServiceSummary;
                })
                .filter(
                    (v, i, a) =>
                        !a.find((x, idx) => idx < i && x._id === v._id),
                );

            return {
                _id: String(d._id),
                name: String(d.name),
                surname: String(d.surname),
                phone: String(d.phone),
                email: String(d.email),
                avatar: d.avatar ?? "",
                clinics,
                services,
                role: d.role,
                isVerified: !!d.isVerified,
                isActive: !!d.isActive,
                createdAt: d.createdAt
                    ? new Date(d.createdAt).toISOString()
                    : new Date().toISOString(),
                updatedAt: d.updatedAt
                    ? new Date(d.updatedAt).toISOString()
                    : new Date().toISOString(),
            } as IDoctorResponse;
        });

        const result: IPaginatedResponse<IDoctorResponse> = {
            data,
            totalItems: pageResult.totalItems,
            totalPages: pageResult.totalPages,
            prevPage: pageResult.prevPage,
            nextPage: pageResult.nextPage,
            page: pageResult.page,
            pageSize: pageResult.pageSize,
        };

        return result;
    }

    public async create(dto: IDoctorCreateDTO): Promise<IDoctorResponse> {
        const existing = await doctorRepository.findByEmail(dto.email);
        if (existing)
            throw new ApiError(
                "Email already in use",
                StatusCodesEnum.CONFLICT,
            );

        const clinicsResolved = await Promise.all(
            (dto.clinics || []).map(async (c) => {
                const value = String(c).trim();
                if (Types.ObjectId.isValid(value) && value.length === 24)
                    return new Types.ObjectId(value);
                let clinic = await clinic_repository_findByName_safe(value);
                if (!clinic)
                    clinic = await clinic_repository_create_safe({
                        name: value,
                    } as any);
                return clinic._id;
            }),
        );

        const servicesResolved = await Promise.all(
            (dto.services || []).map(async (s) => {
                const value = String(s).trim();
                if (Types.ObjectId.isValid(value) && value.length === 24)
                    return new Types.ObjectId(value);
                let service = await service_repository_findByName_safe(value);
                if (!service)
                    service = await service_repository_create_safe({
                        name: value,
                    } as any);
                return service._id;
            }),
        );

        const clinicsUnique = Array.from(
            new Set(clinicsResolved.map(String)),
        ).map((x) => new Types.ObjectId(x));
        const servicesUnique = Array.from(
            new Set(servicesResolved.map(String)),
        ).map((x) => new Types.ObjectId(x));

        const hashed = await bcrypt.hash(dto.password, this.SALT_ROUNDS);

        const createDto: any = {
            ...dto,
            password: hashed,
            clinics: clinicsUnique,
            services: servicesUnique,
        };

        const createdDoc = await doctorRepository.create(createDto);

        const populatedDoc = await Doctor.findById(createdDoc._id)
            .populate("clinics")
            .populate("services")
            .lean()
            .exec();

        if (!populatedDoc) {
            throw new ApiError(
                "Doctor not found after creation",
                StatusCodesEnum.INTERNAL_SERVER_ERROR,
            );
        }

        return this.toResponseFromPlain(populatedDoc);
    }

    public async getById(id: string): Promise<IDoctor> {
        const doctor = await doctorRepository.getById(id);
        if (!doctor)
            throw new ApiError("Doctor not found", StatusCodesEnum.NOT_FOUND);
        return doctor;
    }

    public async getByIds(ids: string[]): Promise<IDoctorResponse[]> {
        const doctors = await doctorRepository.findByIds(ids);

        return doctors.map((doc: any) => {
            const clinicsRaw = Array.isArray(doc.clinics) ? doc.clinics : [];
            const servicesRaw = Array.isArray(doc.services) ? doc.services : [];

            const clinics = clinicsRaw
                .map((c: any) => this.mapClinicFromDoc(c))
                .filter(
                    (v, i, a) =>
                        !a.find((x, idx) => idx < i && x._id === v._id),
                );

            const services = servicesRaw
                .map((s: any) => this.mapServiceFromDoc(s))
                .filter(
                    (v, i, a) =>
                        !a.find((x, idx) => idx < i && x._id === v._id),
                );

            return {
                _id: String(doc._id),
                name: String(doc.name),
                surname: String(doc.surname),
                phone: String(doc.phone),
                email: String(doc.email),
                avatar: doc.avatar ?? "",
                clinics,
                services,
                role: doc.role,
                isVerified: !!doc.isVerified,
                isActive: !!doc.isActive,
                createdAt: doc.createdAt
                    ? new Date(doc.createdAt).toISOString()
                    : new Date().toISOString(),
                updatedAt: doc.updatedAt
                    ? new Date(doc.updatedAt).toISOString()
                    : new Date().toISOString(),
            } as IDoctorResponse;
        });
    }

    public async getRawByEmail(email: string): Promise<DoctorDocument | null> {
        // передаємо true, щоб підхопити password
        return await doctorRepository.findByEmail(email, true);
    }

    public async getByEmail(email: string): Promise<IDoctorResponse> {
        const doc = await Doctor.findOne({ email })
            .populate("clinics")
            .populate("services")
            .lean()
            .exec();
        if (!doc)
            throw new ApiError("Doctor not found", StatusCodesEnum.NOT_FOUND);
        return this.toResponseFromPlain(doc);
    }

    public async updateById(
        id: string,
        dto: IDoctorUpdateDTO,
    ): Promise<IDoctorResponse> {
        if (dto.email) {
            const existing = await doctorRepository.findByEmail(dto.email);
            if (existing && existing._id.toString() !== id)
                throw new ApiError(
                    "Email already in use",
                    StatusCodesEnum.CONFLICT,
                );
        }

        const updateDto: any = { ...dto };

        if (dto.clinics) {
            const resolved = await Promise.all(
                (dto.clinics || []).map(async (c) => {
                    const value = String(c).trim();
                    if (Types.ObjectId.isValid(value) && value.length === 24)
                        return new Types.ObjectId(value);
                    let clinic = await clinic_repository_findByName_safe(value);
                    if (!clinic)
                        clinic = await clinic_repository_create_safe({
                            name: value,
                        } as any);
                    return clinic._id;
                }),
            );
            updateDto.clinics = Array.from(new Set(resolved.map(String))).map(
                (x) => new Types.ObjectId(x),
            );
        }

        if (dto.services) {
            const resolved = await Promise.all(
                (dto.services || []).map(async (s) => {
                    const value = String(s).trim();
                    if (Types.ObjectId.isValid(value) && value.length === 24)
                        return new Types.ObjectId(value);
                    let service =
                        await service_repository_findByName_safe(value);
                    if (!service)
                        service = await service_repository_create_safe({
                            name: value,
                        } as any);
                    return service._id;
                }),
            );
            updateDto.services = Array.from(new Set(resolved.map(String))).map(
                (x) => new Types.ObjectId(x),
            );
        }

        if (dto.password) {
            updateDto.password = await bcrypt.hash(
                dto.password,
                this.SALT_ROUNDS,
            );
        }

        const updated = await doctorRepository.updateById(id, updateDto);
        if (!updated)
            throw new ApiError("Doctor not found", StatusCodesEnum.NOT_FOUND);

        const populated = await Doctor.findById(updated._id)
            .populate("clinics")
            .populate("services")
            .lean()
            .exec();
        if (!populated)
            throw new ApiError(
                "Doctor not found after update",
                StatusCodesEnum.INTERNAL_SERVER_ERROR,
            );
        return this.toResponseFromPlain(populated);
    }

    public async deleteById(id: string): Promise<void> {
        const deleted = await doctorRepository.deleteById(id);
        if (!deleted)
            throw new ApiError("Doctor not found", StatusCodesEnum.NOT_FOUND);
    }

    public async blockDoctor(id: string): Promise<IDoctorResponse> {
        const updated = await doctorRepository.setActiveStatus(id, false);
        if (!updated)
            throw new ApiError("Doctor not found", StatusCodesEnum.NOT_FOUND);
        const populated = await Doctor.findById(updated._id)
            .populate("clinics")
            .populate("services")
            .lean()
            .exec();
        return this.toResponseFromPlain(populated);
    }

    public async unblockDoctor(id: string): Promise<IDoctorResponse> {
        const updated = await doctorRepository.setActiveStatus(id, true);
        if (!updated)
            throw new ApiError("Doctor not found", StatusCodesEnum.NOT_FOUND);
        const populated = await Doctor.findById(updated._id)
            .populate("clinics")
            .populate("services")
            .lean()
            .exec();
        return this.toResponseFromPlain(populated);
    }

    public async updateAvatar(
        id: string,
        avatarPath: string,
    ): Promise<IDoctorResponse> {
        const updated = await doctorRepository.updateById(id, {
            avatar: avatarPath,
        } as any);
        if (!updated)
            throw new ApiError("Doctor not found", StatusCodesEnum.NOT_FOUND);
        const populated = await Doctor.findById(updated._id)
            .populate("clinics")
            .populate("services")
            .lean()
            .exec();
        return this.toResponseFromPlain(populated);
    }

    public async isEmailUnique(email: string): Promise<void> {
        const doc = await Doctor.findOne({ email }).lean().exec();
        if (doc)
            throw new ApiError(
                "Email already in use",
                StatusCodesEnum.CONFLICT,
            );
    }
}

export const doctorService = new DoctorService();

async function service_repository_findByName_safe(name: string) {
    return await serviceRepository.findByName(name);
}
async function service_repository_create_safe(dto: { name: string }) {
    return await serviceRepository.create(dto as any);
}
async function clinic_repository_findByName_safe(name: string) {
    return await clinicRepository.findByName(name);
}
async function clinic_repository_create_safe(dto: { name: string }) {
    return await clinicRepository.create(dto as any);
}
