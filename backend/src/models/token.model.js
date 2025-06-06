import { model, Schema } from "mongoose";
import { Doctor } from "./doctor.model";
const tokenSchema = new Schema({
    accessToken: { type: String, required: true },
    refreshToken: { type: String, required: true },
    _doctorId: { type: Schema.Types.ObjectId, required: true, ref: Doctor },
}, { timestamps: true, versionKey: false });
export const Token = model("Tokens", tokenSchema);
