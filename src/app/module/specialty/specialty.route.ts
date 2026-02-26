import express from "express";
import { specialtyController } from "./specialty.controller";

const router = express.Router();

router.get("/", specialtyController.getAllSpecialties);
router.post("/", specialtyController.createSpecialty);
router.patch("/:id", specialtyController.updateSpecialty);
router.delete("/:id", specialtyController.deleteSpecialty);

export const SpecialtyRoutes = router;