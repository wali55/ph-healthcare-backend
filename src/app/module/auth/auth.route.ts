import express from "express";
import { authController } from "./auth.controller";
import { checkAuth } from "../../middleware/checkAuth";
import { Role } from "../../../generated/prisma/enums";

const router = express.Router();

router.post("/register", authController.registerPatient);
router.post("/login", authController.loginPatient);
router.get("/me", checkAuth(Role.PATIENT, Role.DOCTOR, Role.ADMIN, Role.SUPER_ADMIN), authController.getMe);

export const authRoutes = router;