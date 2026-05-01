import z from "zod";

export const registerSchema = z
  .object({
    fullName: z
      .string()
      .min(3, "نام و نام خانوادگی باید حداقل ۳ کاراکتر باشد")
      .max(50, "نام و نام خانوادگی نمی‌تواند بیشتر از ۵۰ کاراکتر باشد")
      .regex(/^[آ-یa-zA-Z\s]+$/, "فقط از حروف فارسی یا انگلیسی استفاده کنید"),

    email: z.string().email("ایمیل معتبر وارد کنید").min(1, "ایمیل الزامی است"),

    password: z.string().min(8, "رمز عبور باید حداقل ۸ کاراکتر باشد"),

    confirmPassword: z.string().min(1, "تکرار رمز عبور الزامی است"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "رمز عبور و تکرار آن مطابقت ندارند",
    path: ["confirmPassword"],
  });
