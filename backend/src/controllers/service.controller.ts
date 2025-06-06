import { NextFunction, Request, Response } from "express";
import { IServiceDTO } from "../interfaces/service.interface";
import { StatusCodesEnum } from "../enums/status.codes.enum";
import { serviceService } from "../services/service.service";

class ServiceController {
    public async getServices(req: Request, res: Response, next: NextFunction) {
        try {
            const { name } = req.query;
            const services = await serviceService.getServices({
                name: typeof name === "string" ? name : undefined,
            });
            res.status(StatusCodesEnum.OK).json(services);
        } catch (e) {
            next(e);
        }
    }

    public async create(req: Request, res: Response, next: NextFunction) {
        const service = req.body as IServiceDTO;
        const data = await serviceService.create(service);
        res.status(StatusCodesEnum.CREATED).json(data);
    }

    public async getById(req: Request, res: Response) {
        const { id } = req.params;
        const data = await serviceService.getById(id);
        res.status(StatusCodesEnum.OK).json(data);
    }

    public async updateById(req: Request, res: Response) {
        const { id } = req.params;
        const service = req.body as IServiceDTO;
        const data = await serviceService.updateById(id, service);
        res.status(StatusCodesEnum.OK).json(data);
    }

    public async deleteById(req: Request, res: Response) {
        const { id } = req.params;
        await serviceService.deleteById(id);
        res.status(StatusCodesEnum.NO_CONTENT).end();
    }
}

export const serviceController = new ServiceController();
