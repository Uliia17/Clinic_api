import { NextFunction, Request, Response } from "express";
import { IServiceDTO } from "../interfaces/service.interface";
import { StatusCodesEnum } from "../enums/status.codes.enum";
import { serviceService } from "../services/service.service";

class ServiceController {
    public async getServices(req: Request, res: Response, next: NextFunction) {
        try {
            const name =
                typeof req.query.name === "string" ? req.query.name : undefined;
            const order =
                typeof req.query.order === "string"
                    ? req.query.order
                    : undefined;

            const services = await serviceService.getServices({ name, order });
            res.status(StatusCodesEnum.OK).json(services);
        } catch (e) {
            next(e);
        }
    }

    public async create(req: Request, res: Response, next: NextFunction) {
        try {
            const service = req.body as IServiceDTO;
            const data = await serviceService.create(service);
            res.status(StatusCodesEnum.CREATED).json(data);
        } catch (e) {
            next(e);
        }
    }

    public async getById(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const data = await serviceService.getById(id);
            res.status(StatusCodesEnum.OK).json(data);
        } catch (e) {
            next(e);
        }
    }

    public async updateById(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const service = req.body as IServiceDTO;
            const data = await serviceService.updateById(id, service);
            res.status(StatusCodesEnum.OK).json(data);
        } catch (e) {
            next(e);
        }
    }

    public async deleteById(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            await serviceService.deleteById(id);
            res.status(StatusCodesEnum.NO_CONTENT).end();
        } catch (e) {
            next(e);
        }
    }
}

export const serviceController = new ServiceController();
