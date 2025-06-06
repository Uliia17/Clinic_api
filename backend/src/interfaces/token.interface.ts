import { RoleEnum } from "../enums/role.enum";
import { IBase } from "./base.interface";

interface IToken extends IBase {
    _id: string;
    accessToken: string;
    refreshToken: string;
    _doctorId: string;
}

type ITokenModel = Pick<IToken, "accessToken" | "refreshToken" | "_doctorId">;

interface ITokenPayload {
    doctorId: string;
    role: RoleEnum;
}

type ITokenPair = Pick<IToken, "accessToken" | "refreshToken">;
type IRefresh = Pick<IToken, "refreshToken">;

export { IRefresh, IToken, ITokenPair, ITokenPayload, ITokenModel };
