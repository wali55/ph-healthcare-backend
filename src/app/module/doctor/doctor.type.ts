import { Specialty } from "../../../generated/prisma/client";
import { Gender } from "../../../generated/prisma/enums";

export type UpdateDoctorSpecialtyPayload = {
  specialtyId: string;
  shouldDelete?: boolean;
};

export type UpdateDoctorPayload = {
  doctor?: {
    name?: string;
    profilePhoto?: string;
    contactNumber?: string;
    address?: string;
    experience?: number;
    registrationNumber?: string;
    gender?: Gender;
    appointmentFee?: number;
    qualification?: string;
    currentWorkingPlace?: string;
    designation?: string;
  };
  specialties?: UpdateDoctorSpecialtyPayload[];
};
