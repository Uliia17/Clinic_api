import { Types } from "mongoose";
import bcrypt from "bcryptjs";

import { Doctor, DoctorDocument } from "../models/doctor.model";
import { doctorRepository } from "../repositories/doctor.repository";
import { clinicRepository } from "../repositories/clinic.repository";
import { serviceRepository } from "../repositories/service.repository";

import {
    IDoctor,
    IDoctorCreateDTO,
    IDoctorQuery,
    IDoctorUpdateDTO,
    IDoctorResponse,
} from "../interfaces/doctor.interface";

import { ApiError } from "../errors/api.error";
import { StatusCodesEnum } from "../enums/status.codes.enum";
import { IPaginatedResponse } from "../interfaces/paginated-response.interface";

async function findClinicByNameSafe(name: string) {
    return await clinicRepository.findByName(name);
}

async function createClinicSafe(dto: { name: string }) {
    return await clinicRepository.create({
        name: dto.name,
        address: "",
    });
}

async function findServiceByNameSafe(name: string) {
    return await serviceRepository.findByName(name);
}

async function createServiceSafe(dto: { name: string }) {
    return await serviceRepository.create({ name: dto.name });
}

export class DoctorService {
    private SALT_ROUNDS = 10;

    private toResponseFromPlain(doc: any): IDoctorResponse {
        const clinics = Array.isArray(doc.clinics)
            ? doc.clinics.map((c: any) => String(c.name ?? c)).filter(Boolean)
            : [];

        const services = Array.isArray(doc.services)
            ? doc.services.map((s: any) => String(s.name ?? s)).filter(Boolean)
            : [];

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
        };
    }

    public async getByClinicIdFull(
        clinicId: string,
    ): Promise<IDoctorResponse[]> {
        const doctors = await doctorRepository.findByClinicId(clinicId);
        return await Promise.all(
            doctors.map(async (doc) => {
                const populated = await Doctor.findById(doc._id)
                    .populate("services")
                    .lean()
                    .exec();
                return this.toResponseFromPlain(populated || doc);
            }),
        );
    }

    public async getAll(
        query: IDoctorQuery,
    ): Promise<IPaginatedResponse<IDoctorResponse>> {
        const pageResult = await doctorRepository.findAll(query);
        const docs: IDoctor[] = pageResult.data;

        const data: IDoctorResponse[] = await Promise.all(
            docs.map(async (d: any) => {
                const docPopulated = await Doctor.findById(d._id)
                    .populate("clinics")
                    .populate("services")
                    .lean()
                    .exec();
                return this.toResponseFromPlain(docPopulated || d);
            }),
        );

        return { ...pageResult, data };
    }

    public async getById(id: string): Promise<IDoctorResponse> {
        const doc = await Doctor.findById(id)
            .populate("clinics")
            .populate("services")
            .lean()
            .exec();
        if (!doc)
            throw new ApiError("Doctor not found", StatusCodesEnum.NOT_FOUND);
        return this.toResponseFromPlain(doc);
    }

    public async getRawByEmail(email: string): Promise<DoctorDocument | null> {
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

    public async isEmailUnique(email: string): Promise<void> {
        const doc = await Doctor.findOne({ email }).lean().exec();
        if (doc)
            throw new ApiError(
                "Email already in use",
                StatusCodesEnum.CONFLICT,
            );
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
                if (Types.ObjectId.isValid(value))
                    return new Types.ObjectId(value);

                const clinic =
                    (await findClinicByNameSafe(value)) ||
                    (await createClinicSafe({ name: value }));
                if (!clinic?._id)
                    throw new ApiError(
                        "Clinic creation failed",
                        StatusCodesEnum.INTERNAL_SERVER_ERROR,
                    );
                return new Types.ObjectId(clinic._id);
            }),
        );

        const servicesResolved = await Promise.all(
            (dto.services || []).map(async (s) => {
                const value = String(s).trim();
                if (Types.ObjectId.isValid(value))
                    return new Types.ObjectId(value);

                const service =
                    (await findServiceByNameSafe(value)) ||
                    (await createServiceSafe({ name: value }));
                if (!service?._id)
                    throw new ApiError(
                        "Service creation failed",
                        StatusCodesEnum.INTERNAL_SERVER_ERROR,
                    );
                return new Types.ObjectId(service._id);
            }),
        );

        const hashed = await bcrypt.hash(dto.password, this.SALT_ROUNDS);
        const createDto: any = {
            ...dto,
            password: hashed,
            clinics: Array.from(new Set(clinicsResolved.map(String))).map(
                (x) => new Types.ObjectId(x),
            ),
            services: Array.from(new Set(servicesResolved.map(String))).map(
                (x) => new Types.ObjectId(x),
            ),
        };

        const createdDoc = await doctorRepository.create(createDto);
        const populatedDoc = await Doctor.findById(createdDoc._id)
            .populate("clinics")
            .populate("services")
            .lean()
            .exec();
        if (!populatedDoc)
            throw new ApiError(
                "Doctor not found after creation",
                StatusCodesEnum.INTERNAL_SERVER_ERROR,
            );

        return this.toResponseFromPlain(populatedDoc);
    }

    public async updateById(
        id: string,
        dto: IDoctorUpdateDTO,
    ): Promise<IDoctorResponse> {
        const updateDto: any = { ...dto };

        if (dto.clinics) {
            const resolved = await Promise.all(
                dto.clinics.map(async (c) => {
                    const value = String(c).trim();
                    if (Types.ObjectId.isValid(value))
                        return new Types.ObjectId(value);

                    const clinic =
                        (await findClinicByNameSafe(value)) ||
                        (await createClinicSafe({ name: value }));
                    if (!clinic?._id)
                        throw new ApiError(
                            "Clinic creation failed",
                            StatusCodesEnum.INTERNAL_SERVER_ERROR,
                        );
                    return new Types.ObjectId(clinic._id);
                }),
            );
            updateDto.clinics = Array.from(new Set(resolved.map(String))).map(
                (x) => new Types.ObjectId(x),
            );
        }

        if (dto.services) {
            const resolved = await Promise.all(
                dto.services.map(async (s) => {
                    const value = String(s).trim();
                    if (Types.ObjectId.isValid(value))
                        return new Types.ObjectId(value);

                    const service =
                        (await findServiceByNameSafe(value)) ||
                        (await createServiceSafe({ name: value }));
                    if (!service?._id)
                        throw new ApiError(
                            "Service creation failed",
                            StatusCodesEnum.INTERNAL_SERVER_ERROR,
                        );
                    return new Types.ObjectId(service._id);
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

        return this.toResponseFromPlain(populated!);
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
        return this.toResponseFromPlain(populated!);
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
        return this.toResponseFromPlain(populated!);
    }

    public async updateAvatar(
        id: string,
        avatarPath: string,
    ): Promise<IDoctorResponse> {
        const updated = await doctorRepository.updateById(id, {
            avatar: avatarPath,
        });
        if (!updated)
            throw new ApiError("Doctor not found", StatusCodesEnum.NOT_FOUND);

        const populated = await Doctor.findById(updated._id)
            .populate("clinics")
            .populate("services")
            .lean()
            .exec();
        return this.toResponseFromPlain(populated!);
    }
}

export const doctorService = new DoctorService();
