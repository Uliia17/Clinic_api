import { RoleEnum } from "../enums/role.enum";
import { IBase } from "./base.interface";
import { Types } from "mongoose";

interface IToken extends IBase {
    _id?: Types.ObjectId;
    accessToken: string;
    refreshToken: string;
    _doctorId: Types.ObjectId;
}

type ITokenModel = Pick<IToken, "accessToken" | "refreshToken" | "_doctorId">;

interface ITokenPayload {
    doctorId: string;
    role: RoleEnum;
}

type ITokenPair = Pick<IToken, "accessToken" | "refreshToken">;
type IRefresh = Pick<IToken, "refreshToken">;

export { IRefresh, IToken, ITokenPair, ITokenPayload, ITokenModel };
