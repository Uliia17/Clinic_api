import { NextFunction, Request, Response } from "express";
import { clinicService } from "../services/clinic.service";
import { StatusCodesEnum } from "../enums/status.codes.enum";
import { IClinicDTO, IClinicUpdateDTO } from "../interfaces/clinic.interface";

class ClinicController {
    public async getAll(req: Request, res: Response, next: NextFunction) {
        try {
            const clinics = await clinicService.getAll();
            res.status(StatusCodesEnum.OK).json(clinics);
        } catch (e) {
            next(e);
        }
    }

    public async create(req: Request, res: Response, next: NextFunction) {
        try {
            const clinicDto = req.body as IClinicDTO;
            const created = await clinicService.create(clinicDto);
            res.status(StatusCodesEnum.CREATED).json(created);
        } catch (e) {
            next(e);
        }
    }

    public async getById(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const clinic = await clinicService.getById(id);
            res.status(StatusCodesEnum.OK).json(clinic);
        } catch (e) {
            next(e);
        }
    }

    public async updateById(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const clinicDto: IClinicUpdateDTO = req.body;

            const updated = await clinicService.updateById(
                id,
                clinicDto as IClinicUpdateDTO,
            );

            res.status(StatusCodesEnum.OK).json(updated);
        } catch (e) {
            next(e);
        }
    }

    public async deleteById(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            await clinicService.deleteById(id);
            res.status(StatusCodesEnum.NO_CONTENT).end();
        } catch (e) {
            next(e);
        }
    }
}

export const clinicController = new ClinicController();
