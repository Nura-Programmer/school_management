import { Router } from "express";
import { createSchool, listSchools } from "../controllers/school.controller";
import { createClass } from "../controllers/classs.controller";

const router = Router();

router.get("/", listSchools);
router.post("/", createSchool);
router.post("/:schoolId/classes", createClass);

export default router;