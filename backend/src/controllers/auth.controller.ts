import { NextFunction, Request, Response } from "express";

import { IAuth } from "../interfaces/auth.interface";
import { ITokenPayload } from "../interfaces/token.interface";
import { tokenRepository } from "../repositories/token.repository";
import { authService } from "../services/auth.service";
import { tokenService } from "../services/token.service";
import { StatusCodesEnum } from "../enums/status.codes.enum";
import { doctorService } from "../services/doctor.service";
import { DoctorValidator } from "../validators/doctor.validator";

class AuthController {
    public async signUp(
        req: Request,
        res: Response,
        next: NextFunction,
    ): Promise<void> {
        try {
            const { error, value } = DoctorValidator.create.validate(req.body);

            if (error) {
                res.status(400).json({
                    status: 400,
                    message: error.details[0].message,
                });
                return;
            }

            const data = await authService.signUp(value);
            res.status(StatusCodesEnum.CREATED).json(data);
        } catch (e) {
            next(e);
        }
    }

    public async signIn(req: Request, res: Response, next: NextFunction) {
        try {
            const dto = req.body as IAuth;
            const data = await authService.signIn(dto);
            res.status(StatusCodesEnum.OK).json(data);
        } catch (e) {
            next(e);
        }
    }

    public async me(req: Request, res: Response, next: NextFunction) {
        try {
            const tokenPayload = res.locals.tokenPayload as ITokenPayload;
            const { doctorId } = tokenPayload;
            const doctor = await doctorService.getById(doctorId);
            res.status(StatusCodesEnum.OK).json(doctor);
        } catch (e) {
            next(e);
        }
    }

    public async refresh(req: Request, res: Response, next: NextFunction) {
        try {
            const { role, doctorId } = res.locals.tokenPayload as ITokenPayload;

            const tokens = tokenService.generateTokens({ role, doctorId });
            await tokenRepository.create({ ...tokens, _doctorId: doctorId });

            res.status(StatusCodesEnum.OK).json(tokens);
        } catch (e) {
            next(e);
        }
    }

    public async registerAdmin(
        req: Request,
        res: Response,
        next: NextFunction,
    ) {
        try {
            const { email, password } = req.body;
            const admin = await authService.registerAdmin(email, password);
            res.status(StatusCodesEnum.CREATED).json({
                message: "Admin created. Activation email sent.",
                admin,
            });
        } catch (e) {
            next(e);
        }
    }

    public async activate(req: Request, res: Response, next: NextFunction) {
        try {
            const { token } = req.params;
            const doctor = await authService.activate(token);
            res.status(StatusCodesEnum.OK).json(doctor);
        } catch (e) {
            next(e);
        }
    }

    public async passwordRecoveryRequest(
        req: Request,
        res: Response,
        next: NextFunction,
    ) {
        try {
            const { email } = req.body;
            const doctor = await doctorService.getByEmail(email);

            if (doctor) {
                await authService.recoveryPasswordRequest(doctor);
            }

            res.status(StatusCodesEnum.OK).json({
                details: "Check your email",
            });
        } catch (e) {
            next(e);
        }
    }

    public async recoveryPassword(
        req: Request,
        res: Response,
        next: NextFunction,
    ) {
        try {
            const { token } = req.params as { token: string };
            const { password } = req.body;

            const doctor = await authService.recoveryPassword(token, password);

            res.status(StatusCodesEnum.OK).json(doctor);
        } catch (e) {
            next(e);
        }
    }
}

export const authController = new AuthController();
