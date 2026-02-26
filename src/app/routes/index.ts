import express from "express";
import { SpecialtyRoutes } from "../module/specialty/specialty.route";

const router = express.Router();

router.use("/specialties", SpecialtyRoutes);

export const IndexRoutes = router;