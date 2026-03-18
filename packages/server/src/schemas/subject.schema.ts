import z from "zod";

export const createSubjectSchema = z.object({
    name: z.string().min(1, "Subject name is required.").max(100, "Subject nqame must not exceed 100 characters."),
    classId: z.number()
});