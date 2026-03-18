import { Router } from "express";
import { createSchool, listSchools } from "../controllers/school.controller";
import { createClass, listClasses } from "../controllers/class.controller";
import { createTeacher, listTeachers } from "../controllers/teacher.controller";
import { createSubject, getSubjects } from "../controllers/subject.controller";

const router = Router();

router.get("/", listSchools);
router.post("/", createSchool);

router.get("/:schoolId/teachers", listTeachers)
router.post("/:schoolId/teachers", createTeacher);

router.get("/:schoolId/classes", listClasses);
router.post("/:schoolId/classes", createClass);

router.get("/:schoolId/classes/:classId/subjects", getSubjects);
router.post("/:schoolId/classes/:classId/subjects", createSubject);

export default router;