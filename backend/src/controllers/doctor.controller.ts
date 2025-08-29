import { Request, Response, NextFunction } from "express";
import { doctorService } from "../services/doctor.service";
import {
    IDoctorCreateDTO,
    IDoctorUpdateDTO,
    IDoctorQuery,
} from "../interfaces/doctor.interface";
import { StatusCodesEnum } from "../enums/status.codes.enum";
import { ApiError } from "../errors/api.error";
import { ITokenPayload } from "../interfaces/token.interface";

class DoctorController {
    public async getAll(req: Request, res: Response, next: NextFunction) {
        try {
            const query = req.query as unknown as IDoctorQuery;
            const result = await doctorService.getAll(query);
            res.status(StatusCodesEnum.OK).json(result);
        } catch (err) {
            next(err);
        }
    }

    public async create(req: Request, res: Response, next: NextFunction) {
        try {
            const dto = req.body as IDoctorCreateDTO;
            const doctor = await doctorService.create(dto);
            res.status(StatusCodesEnum.CREATED).json(doctor);
        } catch (err) {
            next(err);
        }
    }

    public async getById(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const doctor = await doctorService.getById(id);
            res.status(StatusCodesEnum.OK).json(doctor);
        } catch (err) {
            next(err);
        }
    }

    public async updateById(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const dto = req.body as IDoctorUpdateDTO;
            const updated = await doctorService.updateById(id, dto);
            res.status(StatusCodesEnum.OK).json(updated);
        } catch (err) {
            next(err);
        }
    }

    public async deleteById(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            await doctorService.deleteById(id);
            res.status(StatusCodesEnum.NO_CONTENT).end();
        } catch (err) {
            next(err);
        }
    }

    public async blockDoctor(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const token = res.locals.tokenPayload as ITokenPayload;
            if (token.doctorId === id) {
                throw new ApiError(
                    "Cannot block yourself",
                    StatusCodesEnum.FORBIDDEN,
                );
            }
            const blocked = await doctorService.blockDoctor(id);
            res.status(StatusCodesEnum.OK).json(blocked);
        } catch (err) {
            next(err);
        }
    }

    public async unblockDoctor(
        req: Request,
        res: Response,
        next: NextFunction,
    ) {
        try {
            const { id } = req.params;
            const token = res.locals.tokenPayload as ITokenPayload;
            if (token.doctorId === id) {
                throw new ApiError(
                    "Cannot unblock yourself",
                    StatusCodesEnum.FORBIDDEN,
                );
            }
            const unblocked = await doctorService.unblockDoctor(id);
            res.status(StatusCodesEnum.OK).json(unblocked);
        } catch (err) {
            next(err);
        }
    }

    public async uploadAvatar(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            if (!req.file) {
                throw new ApiError(
                    "File is required",
                    StatusCodesEnum.BAD_REQUEST,
                );
            }
            const updated = await doctorService.updateAvatar(id, req.file.path);
            res.status(StatusCodesEnum.OK).json(updated);
        } catch (err) {
            next(err);
        }
    }
}

export const doctorController = new DoctorController();
