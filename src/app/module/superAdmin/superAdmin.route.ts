import { Router } from "express";
import { superAdminController } from "./superAdmin.controller";
import { validateRequest } from "../../middleware/validateRequest";
import { updateSuperAdminZodSchema } from "./superAdmin.validation";
import { checkAuth } from "../../middleware/checkAuth";
import { Role } from "../../../generated/prisma/enums";

const router = Router();

router.get("/", checkAuth(Role.SUPER_ADMIN), superAdminController.getAllSuperAdmins);
router.get("/:id", checkAuth(Role.SUPER_ADMIN), superAdminController.getSuperAdminById);
router.patch("/:id", checkAuth(Role.SUPER_ADMIN), validateRequest(updateSuperAdminZodSchema), superAdminController.updateSuperAdmin);
router.delete("/:id", checkAuth(Role.SUPER_ADMIN), superAdminController.deleteSuperAdmin);

export const superAdminRoutes = router;