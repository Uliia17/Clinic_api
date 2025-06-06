import { Schema, model } from "mongoose";
const serviceSchema = new Schema({
    name: { type: String, required: true },
}, { timestamps: true, versionKey: false });
export const Service = model("Service", serviceSchema);
