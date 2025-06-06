import { Clinic } from "../models/clinic.model";
class ClinicRepository {
    async getAll() {
        return await Clinic.find();
    }
    async create(clinic) {
        return await Clinic.create(clinic);
    }
    async getById(clinicId) {
        return await Clinic.findById(clinicId);
    }
    async updateById(clinicId, clinic) {
        return await Clinic.findByIdAndUpdate(clinicId, clinic, { new: true });
    }
    async deleteById(clinicId) {
        return await Clinic.findByIdAndDelete(clinicId);
    }
}
export const clinicRepository = new ClinicRepository();
