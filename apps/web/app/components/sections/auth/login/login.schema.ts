import z from "zod";

export const loginSchema = z.object({
  email: z.email("ایمیل معتبر وارد کنید").min(1, "ایمیل الزامی است"),
  password: z.string().min(1, "رمز عبور الزامی است"),
});
