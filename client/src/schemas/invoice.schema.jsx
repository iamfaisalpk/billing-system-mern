import { z } from "zod";

export const invoiceSchema = z.object({
    customerId: z.string().min(1, "Customer is "),

    items: z
        .array(
            z.object({
                itemId: z.string().min(1, "Item is "),

                quantity: z
                    .string({ required_error: "Quantity is " })
                    .min(1, "Quantity is ")
                    .transform((val) => Number(val))
                    .refine((val) => !isNaN(val), "Quantity must be a valid number")
                    .refine((val) => Number.isInteger(val), "Quantity must be whole number")
                    .refine((val) => val >= 1, "Minimum quantity is 1"),
            })
        )
        .min(1, "At least one item is "),
});