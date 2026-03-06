import z from "zod";
import { Gender } from "../../../generated/prisma/enums";

export const createDoctorZodSchema = z.object({
  password: z
    .string("Password is required")
    .min(6, "Password must be at least 6 characters long"),
  doctor: z.object({
    name: z
      .string("Name is required")
      .min(3, "Name must be at least 3 characters long")
      .max(30, "Name must be at most 30 characters long"),
    email: z
      .email("Email is required")
      .min(3, "Email must be at least 3 characters long")
      .max(30, "Email must be at most 30 characters long"),
    contactNumber: z
      .string("Contact number is required")
      .min(11, "Contact number must be at least 11 characters long")
      .max(14, "Contact number must be at most 14 characters long"),
    address: z
      .string("Address must be string")
      .min(10, "Address must be at least 10 characters long")
      .max(100, "Address must be at most 100 characters long")
      .optional(),
    registrationNumber: z.string("Registration number is required"),
    experience: z
      .int("Experience must be an integer")
      .nonnegative("Experience cannot be negative"),
    gender: z.enum(
      [Gender.MALE, Gender.FEMALE],
      "Gender must be MALE or FEMALE",
    ),
    appointmentFee: z
      .number("Appointment fee must be a number")
      .nonnegative("Appointment fee cannot be negative"),
    qualification: z
      .string("Qualification is required")
      .min(3, "Qualification must be at least 3 characters long")
      .max(30, "Qualification must be at most 30 characters long"),
    currentWorkingPlace: z
      .string("Current working place is required")
      .min(3, "Current working place must be at least 3 characters long")
      .max(30, "Current working place must be at most 30 characters long"),
    designation: z
      .string("Designation is required")
      .min(3, "Designation must be at least 3 characters long")
      .max(30, "Designation must be at most 30 characters long"),
  }),
  specialties: z.array(
    z
      .uuid("Specialty must be string")
      .min(1, "At least one specialty is required."),
  ),
});