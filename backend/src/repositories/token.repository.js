import { Token } from "../models/token.model";
class TokenRepository {
    create(dto) {
        return Token.create(dto);
    }
    async findByParams(params) {
        const token = await Token.findOne(params).exec();
        if (!token) {
            throw new Error("Token not found");
        }
        return token;
    }
}
export const tokenRepository = new TokenRepository();
