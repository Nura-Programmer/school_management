import z from "zod";

export const createSubjectSchema = z.object({
    name: z.string().min(1, "Subject name is required.").max(100, "Subject nqame must not exceed 100 characters."),
    classId: z.number()
});

export const deleteSubjectSchema = z.object({
    subjectId: z.number()
});

export const getSubjectsSchema = z.object({
    classId: z.number(),
    page: z.number().optional(),
    limit: z.number().optional()
});