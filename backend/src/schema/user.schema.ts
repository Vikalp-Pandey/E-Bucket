import * as z from "zod";

export const userSchema = z.object({
    name: z.string("Name is Required").nonempty(),
    email: z.email("Email is Required").nonempty(),
    password:z.string("Password is Required").min(6,"Password must be at least 8 characters"),
    confirmPassword: z.string(),
    picture:z.url().optional()
}).superRefine((data, ctx )=> {
    if (data.confirmPassword !== data.password) {
    ctx.addIssue({
      code: "custom",
      message: "The passwords did not match",
      path: ["passwordConfirmation"],
    });
  }
})