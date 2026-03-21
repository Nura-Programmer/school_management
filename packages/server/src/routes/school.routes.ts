import { Router } from "express";
import { createSchool, deleteSchool, listSchools, updateSchool } from "../controllers/school.controller";
import { createClass, listClasses } from "../controllers/class.controller";
import { createTeacher, deleteTeacher, listTeachers, updateTeacher } from "../controllers/teacher.controller";
import { createSubject, getSubjects } from "../controllers/subject.controller";
import { createStudent, getAllStudents } from "../controllers/student.controller";
import { createMark } from "../controllers/mark.controller";

const router = Router();

router.get("/", listSchools);
router.post("/", createSchool);
router.put("/:schoolId", updateSchool);
router.delete("/:schoolId", deleteSchool);

router.get("/:schoolId/teachers", listTeachers)
router.post("/:schoolId/teachers", createTeacher);
router.put("/:schoolId/teachers/:teacherId", updateTeacher);
router.delete("/:schoolId/teachers/:teacherId", deleteTeacher);

router.get("/:schoolId/classes", listClasses);
router.post("/:schoolId/classes", createClass);

router.get("/:schoolId/classes/:classId/subjects", getSubjects);
router.post("/:schoolId/classes/:classId/subjects", createSubject);

router.get("/:schoolId/classes/:classId/students", getAllStudents);
router.post("/:schoolId/classes/:classId/students", createStudent);

router.post("/:schoolId/classes/:classId/marks", createMark);

export default router;