import { Router } from "express";
import { createSchool, listSchools } from "../controllers/school.controller";
import { createClass, listClasses } from "../controllers/class.controller";
import { createTeacher, listTeachers } from "../controllers/teacher.controller";

const router = Router();

router.get("/", listSchools);
router.post("/", createSchool);

router.get("/:schoolId/teachers", listTeachers)
router.post("/:schoolId/teachers", createTeacher);

router.get("/:schoolsId/classes", listClasses);
router.post("/:schoolId/classes", createClass);

export default router;