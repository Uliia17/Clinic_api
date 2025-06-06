import { IToken, ITokenModel } from "../interfaces/token.interface";
import { Token } from "../models/token.model";

class TokenRepository {
    public create(dto: ITokenModel): Promise<IToken> {
        return Token.create(dto);
    }

    public async findByParams(params: Partial<IToken>): Promise<IToken> {
        const token = await Token.findOne(params).exec();
        if (!token) {
            throw new Error("Token not found");
        }
        return token;
    }
}

export const tokenRepository = new TokenRepository();
