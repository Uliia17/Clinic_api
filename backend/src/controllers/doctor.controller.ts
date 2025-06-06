import { Request, Response, NextFunction } from "express";

import { doctorService } from "../services/doctor.service";

import { ApiError } from "../errors/api.error";
import {
    IDoctorCreateDTO,
    IDoctorUpdateDTO,
} from "../interfaces/doctor.interface";
import { StatusCodesEnum } from "../enums/status.codes.enum";
import { Doctor } from "../models/doctor.model";
import { ITokenPayload } from "../interfaces/token.interface";

class DoctorController {
    public async getAll(req: Request, res: Response, next: NextFunction) {
        try {
            const {
                page = 1,
                pageSize = 10,
                email,
                name,
                surname,
                phone,
                search,
                order,
            } = req.query;

            const filter: any = {};

            if (email) {
                filter.email = new RegExp(`^${email}$`, "i"); // нечутливий до регістру пошук
            }

            if (name) {
                filter.name = new RegExp(`^${name}$`, "i");
            }

            if (surname) {
                filter.surname = new RegExp(`^${surname}$`, "i");
            }

            if (phone) {
                filter.phone = phone;
            }

            if (search) {
                filter.$or = [
                    { name: new RegExp(search as string, "i") },
                    { surname: new RegExp(search as string, "i") },
                    { email: new RegExp(search as string, "i") },
                ];
            }

            let sort: any = {};
            if (order) {
                const direction = (order as string).startsWith("-") ? -1 : 1;
                const field = (order as string).replace("-", "");
                sort[field] = direction;
            }

            const skip = (Number(page) - 1) * Number(pageSize);
            const limit = Number(pageSize);

            const totalItems = await Doctor.countDocuments(filter);
            const data = await Doctor.find(filter)
                .sort(sort)
                .skip(skip)
                .limit(limit);

            res.json({
                totalItems,
                totalPages: Math.ceil(totalItems / limit),
                prevPage: Number(page) > 1,
                nextPage: Number(page) < Math.ceil(totalItems / limit),
                data,
            });
        } catch (error) {
            next(error);
        }
    }

    public async create(req: Request, res: Response, next: NextFunction) {
        try {
            const doctor = req.body as IDoctorCreateDTO;
            const data = await doctorService.create(doctor);
            res.status(StatusCodesEnum.CREATED).json(data);
        } catch (e) {
            next(e);
        }
    }

    public async getById(req: Request, res: Response) {
        const { id } = req.params;
        const data = await doctorService.getById(id);
        res.status(StatusCodesEnum.OK).json(data);
    }

    public async updateById(req: Request, res: Response) {
        const { id } = req.params;
        const doctor = req.body as IDoctorUpdateDTO;
        const data = await doctorService.updateById(id, doctor);
        res.status(StatusCodesEnum.OK).json(data);
    }

    public async deleteById(req: Request, res: Response) {
        const { id } = req.params;
        await doctorService.deleteById(id);
        res.status(StatusCodesEnum.NO_CONTENT).end();
    }

    public async blockDoctor(req: Request, res: Response, next: NextFunction) {
        try {
            const { id: doctorId } = req.params;
            const { doctorId: myId } = res.locals.tokenPayload as ITokenPayload;

            if (doctorId === myId) {
                throw new ApiError("Not permitted", StatusCodesEnum.FORBIDDEN);
            }

            const data = await doctorService.blockDoctor(doctorId);
            res.status(StatusCodesEnum.OK).json(data);
        } catch (e) {
            next(e);
        }
    }

    public async unblockDoctor(
        req: Request,
        res: Response,
        next: NextFunction,
    ) {
        try {
            const { id: doctorId } = req.params;
            const { doctorId: myId } = res.locals.tokenPayload as ITokenPayload;

            if (doctorId === myId) {
                throw new ApiError("Not permitted", StatusCodesEnum.FORBIDDEN);
            }

            const data = await doctorService.unblockDoctor(doctorId);
            res.status(StatusCodesEnum.OK).json(data);
        } catch (e) {
            next(e);
        }
    }

    public async uploadAvatar(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const doctor = await doctorService.getById(id);

            if (!doctor) {
                throw new ApiError(
                    "Doctor not found",
                    StatusCodesEnum.BAD_REQUEST,
                );
            }

            if (!req.file) {
                throw new ApiError(
                    "No file uploaded",
                    StatusCodesEnum.BAD_REQUEST,
                );
            }

            const data = await doctorService.updateById(id, {
                avatar: req.file.path,
            });
            res.status(StatusCodesEnum.OK).json(data);
        } catch (e) {
            next(e);
        }
    }
}

export const doctorController = new DoctorController();
