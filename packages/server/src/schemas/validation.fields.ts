import z from "zod";

const getId = (name: string) => z.cuid2(`Invalid ${name} ID.`);

const getName = (name: string = "Name") => z.string().trim()
    .min(3, `${name} must not be less than 3 characters`)
    .max(100, `${name} must not exceed 100 characters.`);

const getTestName = (name: string = "Test") => z.number(`${name} marks must be a number.`)
    .min(0, `${name} must be greater than or equal to zero.`)
    .max(20, `${name} must not exceed 20 marks.`)
    .optional();

export default {
    schoolId: getId("School"),
    classId: getId("Class"),
    teacherId: getId("Teacher"),
    studentId: getId("Student"),
    subjectId: getId("Subject"),
    markId: getId("Mark"),

    name: getName(),
    className: getName("Class name"),
    firstName: getName("First name"),
    surname: getName("Surname"),
    schoolName: getName("School name"),
    subjectName: getName("Subject name"),
    username: z.string().trim()
        .min(3, "Username must be atleast 3 characters.")
        .max(40, "Username must not exceed 40 characters."),

    password: z.string().trim()
        .min(8, "Password must be atleast 8 characters.")
        .max(50, "Password must not axceed 50 characters."), // 50 characters after hashing it, 255 characters

    code: z.string().trim().length(8, "Valid school code is required."),
    town: z.string().trim().min(3, "School town is required.").max(40),
    address: z.string().trim().optional(),
    classType: z.string().trim()
        .length(1, 'Class type must be a single character. e.g A, B, C.'),

    page: z.number('Page must be a number.').optional(),
    limit: z.number('Limit must be a number.').optional(),

    ca: getTestName("C/A"),
    test: getTestName(),
    exam: z.number('Exam marks must be a number.')
        .min(0, 'Exam must be greater than or equal to zero.')
        .max(60, 'Exam must not exceed 60 marks.')
        .optional(),
};