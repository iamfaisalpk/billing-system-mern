import { z } from "zod";

export const itemSchema = z.object({
    name: z.string().min(2, { message: "Item name is " }),

    price: z
        .string({ required_error: "Price is " })
        .min(1, { message: "Price is " })
        .transform((val) => val.trim())
        .refine((val) => val !== "", { message: "Price is " })
        .transform((val) => Number(val))
        .refine((val) => !isNaN(val), { message: "Price must be a valid number" })
        .refine((val) => val > 0, { message: "Price must be greater than 0" }),

    stock: z
        .string({ required_error: "Stock is " })
        .min(1, { message: "Stock is " })
        .transform((val) => val.trim())
        .refine((val) => val !== "", { message: "Stock is " })
        .transform((val) => Number(val))
        .refine((val) => !isNaN(val), { message: "Stock must be a valid number" })
        .refine((val) => Number.isInteger(val), { message: "Stock must be a whole number" })
        .refine((val) => val >= 0, { message: "Stock cannot be negative" }),
});