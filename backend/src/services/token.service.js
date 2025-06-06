import jwt from "jsonwebtoken";
import { ApiError } from "../errors/api.error";
import { tokenRepository } from "../repositories/token.repository";
import { StatusCodesEnum } from "../enums/status.codes.enum";
import { config } from "../configs/config";
class TokenService {
    generateTokens(payload) {
        const accessToken = jwt.sign(payload, config.JWT_ACCESS_SECRET, {
            expiresIn: config.JWT_ACCESS_LIFETIME,
        });
        const refreshToken = jwt.sign(payload, config.JWT_REFRESH_SECRET, {
            expiresIn: config.JWT_REFRESH_LIFETIME,
        });
        return {
            refreshToken,
            accessToken,
        };
    }
    verifyToken(token, type) {
        try {
            let secret;
            switch (type) {
                case "access":
                    secret = config.JWT_ACCESS_SECRET;
                    break;
                case "refresh":
                    secret = config.JWT_REFRESH_SECRET;
                    break;
                default:
                    throw new ApiError("Invalid token time", StatusCodesEnum.BAD_REQUEST);
            }
            return jwt.verify(token, secret);
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        }
        catch (e) {
            throw new ApiError("Invalid token", StatusCodesEnum.UNAUTHORIZED);
        }
    }
    async isTokenExists(token, type) {
        const iTokenPromise = await tokenRepository.findByParams({
            [type]: token,
        });
        return !!iTokenPromise;
    }
}
export const tokenService = new TokenService();
