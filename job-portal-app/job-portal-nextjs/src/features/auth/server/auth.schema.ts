import z from "zod";

export const registerUserSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters long")
    .max(255, "Name must be at most 255 characters long"),

  userName: z
    .string()
    .trim()
    .min(2, "User name must be at least 2 characters long")
    .max(255, "User name must be at most 255 characters long")
    .regex(
      /^[a-zA-Z0-9_]+$/,
      "User name can only contain letters, numbers, and underscores"
    ),

  email: z
    .email("Invalid email address")
    .trim()
    .max(255, "Email must be at most 255 characters long")
    .toLowerCase(),

  password: z
    .string()
    .trim()
    .min(8, "Password must be at least 8 characters long")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      "Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character"
    ),

  role: z
    .enum(["applicant", "employer"], {
      error: "Role must be an applicant or employer",
    })
    .default("applicant"),
});

// z.infer is a utility type that infers the type of the data that the schema can validate.
export type RegisterUserData = z.infer<typeof registerUserSchema>;

// Create a schema with password confirmation - in server we dont need confirmation password
export const registerUserWithConfirmSchema = registerUserSchema
  .extend({
    confirmPassword: z.string().trim(),
  })
  .refine((data) => data?.password === data?.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type RegisterUserWithConfirmData = z.infer<
  typeof registerUserWithConfirmSchema
>;

export const loginUserSchema = z.object({
  email: z
    .email("Invalid email address")
    .trim()
    .max(255, "Email must be at most 255 characters long")
    .toLowerCase(),

  password: z
    .string()
    .trim()
    .min(8, "Password must be at least 8 characters long"),
});

export type LoginUserData = z.infer<typeof loginUserSchema>;
