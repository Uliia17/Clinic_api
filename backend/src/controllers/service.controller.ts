import { NextFunction, Request, Response } from "express";
import {
    IServiceDTO,
    IServiceQuery,
    IServiceResponse,
} from "../interfaces/service.interface";
import { StatusCodesEnum } from "../enums/status.codes.enum";
import { serviceService } from "../services/service.service";
import { IPaginatedResponse } from "../interfaces/paginated-response.interface";

class ServiceController {
    public async getAll(req: Request, res: Response, next: NextFunction) {
        try {
            const { name, order } = req.query as any;
            const page = Number(req.query.page) || 1;
            const pageSize = Number(req.query.pageSize) || 10;

            const query: IServiceQuery = { name, order, page, pageSize };
            const result: IPaginatedResponse<IServiceResponse> =
                await serviceService.getServices(query);

            res.status(StatusCodesEnum.OK).json(result);
        } catch (e) {
            next(e);
        }
    }

    public async create(req: Request, res: Response, next: NextFunction) {
        try {
            const dto = req.body as IServiceDTO;
            const data: IServiceResponse = await serviceService.create(dto);
            res.status(StatusCodesEnum.CREATED).json(data);
        } catch (e) {
            next(e);
        }
    }

    public async getById(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const data: IServiceResponse = await serviceService.getById(id);
            res.status(StatusCodesEnum.OK).json(data);
        } catch (e) {
            next(e);
        }
    }

    public async updateById(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;

            let dto: any;
            if (typeof req.body === "string") {
                try {
                    dto = JSON.parse(req.body);
                } catch (e) {
                    next(e);
                }
            } else {
                dto = req.body;
            }

            const data = await serviceService.updateById(id, dto);
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
