import { Schema, model, Document, Types } from "mongoose";
import { IService } from "../interfaces/service.interface";

export type ServiceDocument = IService & Document;

const serviceSchema = new Schema<ServiceDocument>(
    {
        name: { type: String, required: true, unique: true },

        clinics: [
            {
                type: Types.ObjectId,
                ref: "Clinic",
            },
        ],

        doctors: [
            {
                type: Types.ObjectId,
                ref: "Doctor",
            },
        ],
    },
    {
        timestamps: true,
        versionKey: false,
    },
);

serviceSchema.index({ name: "text" });

export const Service = model<ServiceDocument>("Service", serviceSchema);
