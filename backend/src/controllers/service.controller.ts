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
    /**
     * Повертає пагінований список послуг із фільтрацією та сортуванням
     */
    public async getServices(req: Request, res: Response, next: NextFunction) {
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

    /**
     * Створює нову послугу
     */
    public async create(req: Request, res: Response, next: NextFunction) {
        try {
            const dto = req.body as IServiceDTO;
            const data: IServiceResponse = await serviceService.create(dto);
            res.status(StatusCodesEnum.CREATED).json(data);
        } catch (e) {
            next(e);
        }
    }

    /**
     * Отримує послугу за ID
     */
    public async getById(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const data: IServiceResponse = await serviceService.getById(id);
            res.status(StatusCodesEnum.OK).json(data);
        } catch (e) {
            next(e);
        }
    }

    /**
     * Оновлює послугу за ID
     */
    public async updateById(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const dto = req.body as IServiceDTO;
            const data: IServiceResponse = await serviceService.updateById(
                id,
                dto,
            );
            res.status(StatusCodesEnum.OK).json(data);
        } catch (e) {
            next(e);
        }
    }

    /**
     * Видаляє послугу за ID
     */
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
