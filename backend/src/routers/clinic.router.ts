import { Router } from "express";
import { clinicController } from "../controllers/clinic.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { commonMiddleware } from "../middlewares/common.middleware";
import { ClinicValidator } from "../validators/clinic.validator";

const router = Router();

router.get("/", clinicController.search.bind(clinicController));

router.get(
    "/all",
    authMiddleware.checkAccessToken,
    authMiddleware.isAdmin,
    clinicController.getAll.bind(clinicController),
);

router.post(
    "/",
    authMiddleware.checkAccessToken,
    authMiddleware.isAdmin,
    commonMiddleware.validateBody(ClinicValidator.create),
    clinicController.create.bind(clinicController),
);

router.get(
    "/:id",
    authMiddleware.checkAccessToken,
    commonMiddleware.isIdValidate("id"),
    clinicController.getById.bind(clinicController),
);

router.put(
    "/:id",
    authMiddleware.checkAccessToken,
    authMiddleware.isAdmin,
    commonMiddleware.isIdValidate("id"),
    commonMiddleware.validateBody(ClinicValidator.update),
    clinicController.updateById.bind(clinicController),
);

router.delete(
    "/:id",
    authMiddleware.checkAccessToken,
    authMiddleware.isAdmin,
    commonMiddleware.isIdValidate("id"),
    clinicController.deleteById.bind(clinicController),
);

export const clinicRouter = router;
