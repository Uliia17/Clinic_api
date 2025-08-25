import { Schema, model, Document, Types } from "mongoose";
import { IDoctor } from "../interfaces/doctor.interface";
import { RoleEnum } from "../enums/role.enum";
import { formatAvatarPath } from "../utils/formatAvatar";

export type DoctorDocument = IDoctor & Document;

const doctorSchema = new Schema<DoctorDocument>(
    {
        name: { type: String, required: true, index: true },
        surname: { type: String, required: true, index: true },
        phone: { type: String, required: true, unique: true, index: true },
        email: { type: String, required: true, unique: true, index: true },
        password: { type: String, required: true, select: false },
        avatar: { type: String, default: "" },
        clinics: [{ type: Types.ObjectId, ref: "Clinic" }],
        services: [{ type: Types.ObjectId, ref: "Service" }],
        role: {
            type: String,
            enum: Object.values(RoleEnum),
            required: true,
            default: RoleEnum.USER,
        },
        isDeleted: { type: Boolean, default: false },
        isVerified: { type: Boolean, default: false },
        isActive: { type: Boolean, default: false },
    },
    {
        timestamps: true,
        versionKey: false,
        toJSON: {
            transform: (doc, ret) => {
                delete (ret as any).password;
                ret.avatar = formatAvatarPath(ret.avatar);
                return ret;
            },
        },
    },
);

doctorSchema.index({
    name: "text",
    surname: "text",
    email: "text",
    phone: "text",
});

export const Doctor = model<DoctorDocument>("Doctor", doctorSchema);
