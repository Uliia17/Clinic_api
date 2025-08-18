import { Router } from "express";
import { serviceController } from "../controllers/service.controller";
import { commonMiddleware } from "../middlewares/common.middleware";
import { ServiceValidator } from "../validators/service.validator";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

// GET /services — валідація query (name, order, page, pageSize)
router.get(
    "/",
    commonMiddleware.query(ServiceValidator.query),
    serviceController.getServices.bind(serviceController),
);

router.post(
    "/",
    authMiddleware.checkAccessToken,
    authMiddleware.isAdmin,
    commonMiddleware.validateBody(ServiceValidator.create),
    serviceController.create.bind(serviceController),
);

router.get(
    "/:id",
    authMiddleware.checkAccessToken,
    commonMiddleware.isIdValidate("id"),
    serviceController.getById.bind(serviceController),
);

router.put(
    "/:id",
    authMiddleware.checkAccessToken,
    authMiddleware.isAdmin,
    commonMiddleware.isIdValidate("id"),
    commonMiddleware.validateBody(ServiceValidator.update),
    serviceController.updateById.bind(serviceController),
);

router.delete(
    "/:id",
    authMiddleware.checkAccessToken,
    authMiddleware.isAdmin,
    commonMiddleware.isIdValidate("id"),
    serviceController.deleteById.bind(serviceController),
);

export const serviceRouter = router;
