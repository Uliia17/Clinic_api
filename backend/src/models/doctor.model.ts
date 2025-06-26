import { Schema, model, Types } from "mongoose";
import { IDoctor } from "../interfaces/doctor.interface";
import { RoleEnum } from "../enums/role.enum";
import path from "node:path";

const doctorSchema = new Schema<IDoctor>(
    {
        name: { type: String, required: true },
        surname: { type: String, required: true },
        phone: { type: String, required: true, unique: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        avatar: { type: String, default: "" },
        clinics: [{ type: Types.ObjectId, ref: "Clinic" }],
        services: [{ type: Types.ObjectId, ref: "Service" }],
        role: {
            enum: RoleEnum,
            type: String,
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
                delete ret.password;
                if (ret.avatar) {
                    ret.avatar = `/media/${path.basename(ret.avatar)}`;
                }
                return ret;
            },
        },
    },
);

export const Doctor = model<IDoctor>("Doctor", doctorSchema);
