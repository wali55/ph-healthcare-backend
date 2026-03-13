import { Gender } from "../../../generated/prisma/enums";

export type CreateDoctor = {
    password: string;
    doctor: {
        name: string;
        email: string;
        profilePhoto?: string;
        contactNumber?: string;
        address?: string;
        registrationNumber: string;
        experience?: number;
        gender: Gender;
        appointmentFee: number;
        qualification: string;
        currentWorkingPlace: string;
        designation: string;
    },
    specialties: string[]
}

export type CreateAdmin = {
    password: string;
    admin: {
        name: string;
        email: string;
        profilePhoto?: string;
        contactNumber?: string;
        address?: string;
        gender: Gender;
    },
}

export type CreateSuperAdmin = {
    password: string;
    superAdmin: {
        name: string;
        email: string;
        profilePhoto?: string;
        contactNumber?: string;
        address?: string;
        gender: Gender;
    },
}