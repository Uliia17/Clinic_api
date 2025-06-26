import { model, Schema } from "mongoose";

import { IToken } from "../interfaces/token.interface";

const tokenSchema = new Schema(
    {
        accessToken: { type: String, required: true },
        refreshToken: { type: String, required: true },
        _doctorId: {
            type: Schema.Types.ObjectId,
            ref: "Doctor",
            required: true,
        },
    },
    { timestamps: true, versionKey: false },
);

export const Token = model<IToken>("Tokens", tokenSchema);
