import { clinicService } from "../services/clinic.service";
import { StatusCodesEnum } from "../enums/status.codes.enum";
class ClinicController {
    async getAll(req, res) {
        const data = await clinicService.getAll();
        res.status(StatusCodesEnum.OK).json(data);
    }
    async create(req, res, next) {
        const clinic = req.body;
        const data = await clinicService.create(clinic);
        res.status(StatusCodesEnum.CREATED).json(data);
    }
    async getById(req, res) {
        const { id } = req.params;
        const data = await clinicService.getById(id);
        res.status(StatusCodesEnum.OK).json(data);
    }
    async updateById(req, res) {
        const { id } = req.params;
        const clinic = req.body;
        const data = await clinicService.updateById(id, clinic);
        res.status(StatusCodesEnum.OK).json(data);
    }
    async deleteById(req, res) {
        const { id } = req.params;
        await clinicService.deleteById(id);
        res.status(StatusCodesEnum.NO_CONTENT).end();
    }
}
export const clinicController = new ClinicController();
