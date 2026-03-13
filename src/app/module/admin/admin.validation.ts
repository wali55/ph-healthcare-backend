import z from "zod";

export const updateAdminZodSchema = z.object({
  name: z
    .string("Name must be string")
    .min(3, "Name must be at least 3 characters long")
    .max(30, "Name must be at most 30 characters long")
    .optional(),
  profilePhoto: z
    .string("Profile photo must be string")
    .min(3, "Profile photo must be at least 3 characters long")
    .max(30, "Profile photo must be at most 30 characters long")
    .optional(),
  contactNumber: z
    .string("Contact number must be string")
    .min(11, "Contact number must be at least 11 characters long")
    .max(14, "Contact number must be at most 14 characters long")
    .optional(),
  address: z
    .string("Address must be string")
    .min(10, "Address must be at least 10 characters long")
    .max(100, "Address must be at most 100 characters long")
    .optional(),
});
