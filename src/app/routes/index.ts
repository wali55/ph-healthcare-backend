import express from "express";
import { specialtyRoutes } from "../module/specialty/specialty.route";
import { authRoutes } from "../module/auth/auth.route";
import { userRoutes } from "../module/user/user.route";
import { doctorRoutes } from "../module/doctor/doctor.route";
import { adminRoutes } from "../module/admin/admin.route";
import { superAdminRoutes } from "../module/superAdmin/superAdmin.route";

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/specialties", specialtyRoutes);
router.use("/users", userRoutes);
router.use("/doctors", doctorRoutes);
router.use("/admins", adminRoutes);
router.use("/super-admins", superAdminRoutes);

export const IndexRoutes = router;