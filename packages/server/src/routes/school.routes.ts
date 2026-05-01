import { Router } from 'express';
import {
   createSchool,
   deleteSchool,
   listSchools,
   updateSchool,
} from '../controllers/school.controller';
import {
   createClass,
   deleteClass,
   listClasses,
   updateClass,
} from '../controllers/class.controller';
import {
   createTeacher,
   deleteTeacher,
   listTeachers,
   updateTeacher,
} from '../controllers/teacher.controller';
import {
   createSubject,
   deleteSubject,
   getSubjects,
   updateSubject,
} from '../controllers/subject.controller';
import {
   createStudent,
   deleteStudent,
   getAllStudents,
   updateStudent,
} from '../controllers/student.controller';
import { createMark, updateMark } from '../controllers/mark.controller';
import { auth } from '../controllers/auth.controller';

const router = Router();

router.get('/', listSchools);
router.post('/', createSchool);
router.put('/:schoolId', updateSchool);
router.post('/:schoolId/auth', auth);
router.delete('/:schoolId', deleteSchool);

router.get('/:schoolId/teachers', listTeachers);
router.post('/:schoolId/teachers', createTeacher);
router.put('/:schoolId/teachers/:teacherId', updateTeacher);
router.delete('/:schoolId/teachers/:teacherId', deleteTeacher);

router.get('/:schoolId/classes', listClasses);
router.post('/:schoolId/classes', createClass);
router.put('/:schoolId/classes/:classId', updateClass);
router.delete('/:schoolId/classes/:classId', deleteClass);

router.get('/:schoolId/classes/:classId/subjects', getSubjects);
router.post('/:schoolId/classes/:classId/subjects', createSubject);
router.put('/:schoolId/classes/:classId/subjects/:subjectId', updateSubject);
router.delete('/:schoolId/classes/:classId/subjects/:subjectId', deleteSubject);

router.get('/:schoolId/classes/:classId/students', getAllStudents);
router.post('/:schoolId/classes/:classId/students', createStudent);
router.put('/:schoolId/classes/:classId/students/:studentId', updateStudent);
router.delete('/:schoolId/classes/:classId/students/:studentId', deleteStudent);

router.post('/:schoolId/classes/:classId/marks', createMark);
router.put('/:schoolId/classes/:classId/marks', updateMark);

export default router;
