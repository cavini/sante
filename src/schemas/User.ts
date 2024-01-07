import { z } from "zod";
import { phoneRegex } from "~/utils";

export const UserSchema = z.object({
  email: z.string().email(),
  name: z.string().min(5, "Name must contain at least 5 characters"),
  phone: z
    .string()
    .regex(phoneRegex, "Invalid phone number")
    .max(
      10,
      "Phone numbers must be 10 characters, numbers only, without spaces.",
    ),
});
