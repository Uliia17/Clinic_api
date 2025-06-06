import { Schema, model } from "mongoose";
const clinicSchema = new Schema({
    name: { type: String, required: true },
}, { timestamps: true, versionKey: false });
export const Clinic = model("Clinic", clinicSchema);
