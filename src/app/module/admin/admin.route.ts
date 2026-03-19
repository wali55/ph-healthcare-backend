import { Router } from "express";
import { adminController } from "./admin.controller";
import { validateRequest } from "../../middleware/validateRequest";
import { updateAdminZodSchema } from "./admin.validation";
import { checkAuth } from "../../middleware/checkAuth";
import { Role } from "../../../generated/prisma/enums";

const router = Router();

router.get("/", checkAuth(Role.ADMIN, Role.SUPER_ADMIN), adminController.getAllAdmins);
router.get("/:id", checkAuth(Role.ADMIN, Role.SUPER_ADMIN), adminController.getAdminById);
router.patch("/:id", checkAuth(Role.SUPER_ADMIN), validateRequest(updateAdminZodSchema), adminController.updateAdmin);
router.delete("/:id", checkAuth(Role.SUPER_ADMIN), adminController.deleteAdmin);

export const adminRoutes = router;