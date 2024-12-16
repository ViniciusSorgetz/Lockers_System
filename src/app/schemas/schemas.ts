import { z } from "zod";

export const studentSchema = z.object({
        name: z.string().min(1),
        phone_number: z.string().min(9).optional()
});

export const objectIdSchema = z.string().regex(/^[0-9a-f]{24}$/);