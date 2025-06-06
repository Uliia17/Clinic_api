import { Router } from "express";

import { authController } from "../controllers/auth.controller";
import { commonMiddleware } from "../middlewares/common.middleware";
import { DoctorValidator } from "../validators/doctor.validator";
import { AuthValidator } from "../validators/auth.validator";
import { authMiddleware } from "../middlewares/auth.middleware";
import { RecoveryValidator } from "../validators/recovery.validator";

const router = Router();

router.post(
    "/sign-up",
    commonMiddleware.validateBody(DoctorValidator.create),
    authController.signUp,
);
router.post("/sign-in", authController.signIn);
router.post(
    "/refresh",
    commonMiddleware.validateBody(AuthValidator.refreshToken),
    authMiddleware.checkRefreshToken,
    authController.refresh,
);
router.get("/me", authMiddleware.checkAccessToken, authController.me);
router.patch("/activate/:token", authController.activate);
router.post(
    "/register-admin",
    commonMiddleware.validateBody(AuthValidator.registerAdmin),
    authController.registerAdmin,
);
router.post(
    "/recovery",
    commonMiddleware.validateBody(RecoveryValidator.emailSchema),
    authController.passwordRecoveryRequest,
);
router.post(
    "/recovery/:token",
    commonMiddleware.validateBody(AuthValidator.validatePassword),
    authController.recoveryPassword,
);

export const authRouter = router;
