import { z } from "zod";

export const reportSchema = z
    .object({
        from: z.string().min(1, "From date is "),
        to: z.string().min(1, "To date is "),
    })
    .refine(
        (data) => new Date(data.from) <= new Date(data.to),
        {
            message: "From date must be before To date",
            path: ["to"],
        }
    );
