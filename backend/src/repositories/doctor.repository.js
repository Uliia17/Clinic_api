import { Doctor } from "../models/doctor.model";
class DoctorRepository {
    getAll() {
        return Doctor.find();
    }
    create(doctor) {
        return Doctor.create(doctor);
    }
    getById(doctorId) {
        return Doctor.findById(doctorId);
    }
    getByEmail(email) {
        return Doctor.findOne({ email });
    }
    updateById(doctorId, doctor) {
        return Doctor.findByIdAndUpdate(doctorId, doctor, { new: true });
    }
    deleteById(doctorId) {
        return Doctor.findByIdAndDelete(doctorId);
    }
    blockDoctor(doctorId) {
        return Doctor.findByIdAndUpdate(doctorId, { isActive: false }, { new: true });
    }
    unblockDoctor(doctorId) {
        return Doctor.findByIdAndUpdate(doctorId, { isActive: true }, { new: true });
    }
}
export const doctorRepository = new DoctorRepository();
