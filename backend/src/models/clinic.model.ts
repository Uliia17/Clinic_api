import { Schema, model } from "mongoose";
import { IClinic } from "../interfaces/clinic.interface";

const clinicSchema = new Schema(
    {
        name: { type: String, required: true },
    },
    { timestamps: true, versionKey: false },
);

export const Clinic = model<IClinic>("Clinics", clinicSchema);
