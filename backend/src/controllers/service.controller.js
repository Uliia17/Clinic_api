import { serviceService } from "../services/service.service";
import { StatusCodesEnum } from "../enums/status.codes.enum";
class ServiceController {
    async getAll(req, res) {
        const data = await serviceService.getAll();
        res.status(StatusCodesEnum.OK).json(data);
    }
    async create(req, res, next) {
        const service = req.body;
        const data = await serviceService.create(service);
        res.status(StatusCodesEnum.CREATED).json(data);
    }
    async getById(req, res) {
        const { id } = req.params;
        const data = await serviceService.getById(id);
        res.status(StatusCodesEnum.OK).json(data);
    }
    async updateById(req, res) {
        const { id } = req.params;
        const service = req.body;
        const data = await serviceService.updateById(id, service);
        res.status(StatusCodesEnum.OK).json(data);
    }
    async deleteById(req, res) {
        const { id } = req.params;
        await serviceService.deleteById(id);
        res.status(StatusCodesEnum.NO_CONTENT).end();
    }
}
export const serviceController = new ServiceController();
