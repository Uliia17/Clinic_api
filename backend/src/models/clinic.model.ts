import { Schema, model, Document, Types } from "mongoose";
import { IClinic } from "../interfaces/clinic.interface";

// Тип документа для Mongoose
export type ClinicDocument = IClinic & Document;

const clinicSchema = new Schema<ClinicDocument>(
    {
        name: { type: String, required: true, unique: true, index: true },
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
