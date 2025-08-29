import { Schema, model, Document, Types } from "mongoose";
import { IClinic } from "../interfaces/clinic.interface";

export type ClinicDocument = IClinic & Document;

const clinicSchema = new Schema<ClinicDocument>(
    {
        name: { type: String, required: true, unique: true, index: true },
        address: { type: String, required: false },
        doctors: [
            {
                type: Types.ObjectId,
                ref: "Doctor",
                required: false,
                index: true,
            },
        ],
        services: [
            {
                type: Types.ObjectId,
                ref: "Service",
                required: false,
                index: true,
            },
        ],
    },
    {
        timestamps: true,
        versionKey: false,
    },
);

clinicSchema.index({ name: "text" });

export const Clinic = model<ClinicDocument>("Clinic", clinicSchema);
