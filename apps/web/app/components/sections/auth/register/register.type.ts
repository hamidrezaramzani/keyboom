import z from "zod";
import { registerSchema } from "./register.schema";

export type RegisterFormData = z.infer<typeof registerSchema>;
