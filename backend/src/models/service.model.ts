import { Schema, model } from "mongoose";
import { IService } from "../interfaces/service.interface";

const serviceSchema = new Schema<IService>(
    {
        name: { type: String, required: true, unique: true },
    },
    {
        timestamps: true,
        versionKey: false,
    },
);

export const Service = model<IService>("Service", serviceSchema);
