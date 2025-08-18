import { Schema, model, Document } from "mongoose";
import { IService } from "../interfaces/service.interface";

export type ServiceDocument = IService & Document;

const serviceSchema = new Schema<ServiceDocument>(
    {
        name: { type: String, required: true, unique: true },
    },
    {
        timestamps: true,
        versionKey: false,
    },
);

serviceSchema.index({ name: "text" });

export const Service = model<ServiceDocument>("Service", serviceSchema);
