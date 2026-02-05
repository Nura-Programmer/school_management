import { Router } from "express";
import { createSchool, listSchools } from "../controllers/school.controller";

const router = Router();

router.get("/", listSchools);
router.post("/", createSchool);

export default router;