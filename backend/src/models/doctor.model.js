import { Schema, model } from "mongoose";
import { RoleEnum } from "../enums/role.enum";
const doctorSchema = new Schema({
    name: { type: String, required: true },
    surname: { type: String, required: true },
    phone: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
        enum: RoleEnum,
        type: String,
        required: true,
        default: RoleEnum.USER,
    },
    isDeleted: { type: Boolean, default: false },
    isVerified: { type: Boolean, default: false },
}, { timestamps: true, versionKey: false });
export const Doctor = model("Doctor", doctorSchema);
