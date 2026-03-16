import z from "zod";

export const createClassSchema = z.object({
    name: z.string().min(1, "Class name is required").max(100, "Class name cannot exist 100 characters."),
});