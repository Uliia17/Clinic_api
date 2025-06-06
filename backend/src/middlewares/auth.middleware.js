import { ApiError } from "../errors/api.error";
import { tokenService } from "../services/token.service";
import { StatusCodesEnum } from "../enums/status.codes.enum";
import { RoleEnum } from "../enums/role.enum";
import { doctorService } from "../services/doctor.service";
class AuthMiddleware {
    async checkAccessToken(req, res, next) {
        try {
            const authorizationHeader = req.headers.authorization;
            if (!authorizationHeader) {
                throw new ApiError("No token provided", StatusCodesEnum.UNAUTHORIZED);
            }
            const accessToken = authorizationHeader.split(" ")[1];
            if (!accessToken) {
                throw new ApiError("No token provided", StatusCodesEnum.UNAUTHORIZED);
            }
            const tokenPayload = tokenService.verifyToken(accessToken, "access");
            const isTokenExists = await tokenService.isTokenExists(accessToken, "accessToken");
            if (!isTokenExists) {
                throw new ApiError("Invalid token", StatusCodesEnum.UNAUTHORIZED);
            }
            res.locals.tokenPayload = tokenPayload;
            next();
        }
        catch (e) {
            next(e);
        }
    }
    async checkRefreshToken(req, res, next) {
        try {
            const { refreshToken } = req.body;
            if (!refreshToken) {
                throw new ApiError("No refresh token provided", StatusCodesEnum.FORBIDDEN);
            }
            const tokenPayload = tokenService.verifyToken(refreshToken, "refresh");
            const isTokenExists = await tokenService.isTokenExists(refreshToken, "refreshToken");
            if (!isTokenExists) {
                throw new ApiError("Invalid token", StatusCodesEnum.FORBIDDEN);
            }
            const isActive = await doctorService.isActive(tokenPayload.doctorId);
            if (!isActive) {
                throw new ApiError("Account is not active", StatusCodesEnum.FORBIDDEN);
            }
            res.locals.tokenPayload = tokenPayload;
            next();
        }
        catch (e) {
            next(e);
        }
    }
    isAdmin(req, res, next) {
        try {
            const { role } = res.locals.tokenPayload;
            if (role !== RoleEnum.ADMIN) {
                throw new ApiError("No has permissions", StatusCodesEnum.FORBIDDEN);
            }
            next();
        }
        catch (e) {
            next(e);
        }
    }
}
export const authMiddleware = new AuthMiddleware();
