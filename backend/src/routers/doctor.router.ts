import { Router } from "express";
import { doctorController } from "../controllers/doctor.controller";
import { commonMiddleware } from "../middlewares/common.middleware";
import { authMiddleware } from "../middlewares/auth.middleware";
import { DoctorValidator } from "../validators/doctor.validator";
import { upload } from "../configs/multer.config";

const router = Router();

// Валідація query-параметрів через Joi
router.get(
    "/",
    commonMiddleware.query(DoctorValidator.query),
    doctorController.getAll.bind(doctorController),
);

// Створення лікаря
router.post(
    "/",
    authMiddleware.checkAccessToken,
    authMiddleware.isAdmin,
    commonMiddleware.validateBody(DoctorValidator.create),
    doctorController.create.bind(doctorController),
);

router.put(
    "/:id",
    authMiddleware.checkAccessToken,
    authMiddleware.isAdmin,
    commonMiddleware.isIdValidate("id"),
    commonMiddleware.validateBody(DoctorValidator.update),
    doctorController.updateById,
);

router.delete(
    "/:id",
    authMiddleware.checkAccessToken,
    authMiddleware.isAdmin,
    commonMiddleware.isIdValidate("id"),
    doctorController.deleteById,
);

router.patch(
    "/:id/block",
    authMiddleware.checkAccessToken,
    authMiddleware.isAdmin,
    doctorController.blockDoctor,
);
router.patch(
    "/:id/unblock",
    authMiddleware.checkAccessToken,
    authMiddleware.isAdmin,
    doctorController.unblockDoctor,
);
router.patch(
    "/upload-avatar/:id",
    commonMiddleware.isIdValidate("id"),
    upload.single("avatar"),
    doctorController.uploadAvatar,
);

export const doctorRouter = router;
