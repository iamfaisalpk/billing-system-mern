import { z } from "zod";

export const customerSchema = z.object({
    name: z.string().min(2, "Customer name is "),
    phone: z
        .string()
        .min(10, "Phone number must be at least 10 digits"),
    email: z.string().email("Invalid email address"),
    address: z.string().min(5, "Address is "),
});
