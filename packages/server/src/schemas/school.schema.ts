import { z } from "zod";

export const createSchoolSchema = z.object({
    name: z.string().min(1, "School name is required"),
    address: z.string().optional(),
});
