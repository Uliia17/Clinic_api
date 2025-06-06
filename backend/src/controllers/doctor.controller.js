import { doctorService } from "../services/doctor.service";
import { StatusCodesEnum } from "../enums/status.codes.enum";
import { ApiError } from "../errors/api.error";
class DoctorController {
    async getAll(req, res) {
        const data = await doctorService.getAll();
        res.status(StatusCodesEnum.OK).json(data);
    }
    async create(req, res, next) {
        const doctor = req.body;
        const data = await doctorService.create(doctor);
        res.status(StatusCodesEnum.CREATED).json(data);
    }
    async getById(req, res) {
        const { id } = req.params;
        const data = await doctorService.getById(id);
        res.status(StatusCodesEnum.OK).json(data);
    }
    async updateById(req, res) {
        const { id } = req.params;
        const doctor = req.body;
        const data = await doctorService.updateById(id, doctor);
        res.status(StatusCodesEnum.OK).json(data);
    }
    async deleteById(req, res) {
        const { id } = req.params;
        await doctorService.deleteById(id);
        res.status(StatusCodesEnum.NO_CONTENT).end();
    }
    async blockDoctor(req, res, next) {
        try {
            const { id: doctorId } = req.params;
            const { doctorId: myId } = res.locals.tokenPayload;
            if (doctorId === myId) {
                throw new ApiError("Not permitted", StatusCodesEnum.FORBIDDEN);
            }
            const data = await doctorService.blockDoctor(doctorId);
            res.status(StatusCodesEnum.OK).json(data);
        }
        catch (e) {
            next(e);
        }
    }
    async unblockDoctor(req, res, next) {
        try {
            const { id: doctorId } = req.params;
            const { doctorId: myId } = res.locals.tokenPayload;
            if (doctorId === myId) {
                throw new ApiError("Not permitted", StatusCodesEnum.FORBIDDEN);
            }
            const data = await doctorService.unblockDoctor(doctorId);
            res.status(StatusCodesEnum.OK).json(data);
        }
        catch (e) {
            next(e);
        }
    }
}
export const doctorController = new DoctorController();
