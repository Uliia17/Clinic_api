import { NextFunction, Request, Response } from "express";
import { clinicService } from "../services/clinic.service";
import { IClinicDTO } from "../interfaces/clinic.interface";
import { StatusCodesEnum } from "../enums/status.codes.enum";

class ClinicController {
    public async search(req: Request, res: Response, next: NextFunction) {
        try {
            const clinics = await clinicService.searchClinics(req.query);
            res.status(StatusCodesEnum.OK).json(clinics);
        } catch (e) {
            next(e);
        }
    }

    public async create(req: Request, res: Response, next: NextFunction) {
        try {
            const clinic = req.body as IClinicDTO;
            const data = await clinicService.create(clinic);
            res.status(StatusCodesEnum.CREATED).json(data);
        } catch (e) {
            next(e);
        }
    }

    public async getById(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const data = await clinicService.getById(id);
            res.status(StatusCodesEnum.OK).json(data);
        } catch (e) {
            next(e);
        }
    }

    public async updateById(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const clinic = req.body as IClinicDTO;
            const data = await clinicService.updateById(id, clinic);
            res.status(StatusCodesEnum.OK).json(data);
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
