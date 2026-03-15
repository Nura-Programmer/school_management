import { Router } from "express";
import { createTeacher, listTeachers } from "../controllers/teacher.controller";

const router = Router();

router.get("/", listTeachers);
router.post("/", createTeacher);

export default router;
