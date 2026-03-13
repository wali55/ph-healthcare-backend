import status from "http-status";
import { Role, Specialty } from "../../../generated/prisma/client";
import AppError from "../../errorHelpers/AppError";
import { auth } from "../../lib/auth";
import { prisma } from "../../lib/prisma";
import { CreateAdmin, CreateDoctor, CreateSuperAdmin } from "./user.type";

const createDoctor = async (payload: CreateDoctor) => {
  const specialties: Specialty[] = [];

  for (const specialtyId of payload.specialties) {
    const specialty = await prisma.specialty.findUnique({
      where: {
        id: specialtyId,
      },
    });

    if (!specialty) {
      throw new AppError(status.NOT_FOUND, `Specialty with id ${specialtyId} not found`);
    }
    specialties.push(specialty);
  }

  const userExists = await prisma.user.findUnique({
    where: {
      email: payload.doctor.email,
    },
  });

  if (userExists) {
    throw new AppError(status.CONFLICT, "User with this email already exists");
  }

  const userData = await auth.api.signUpEmail({
    body: {
      name: payload.doctor.name,
      email: payload.doctor.email,
      password: payload.password,
      role: Role.DOCTOR,
      needPasswordChange: true,
    },
  });

  try {
    const result = await prisma.$transaction(async (tx) => {
      const doctorData = await tx.doctor.create({
        data: {
          userId: userData.user.id,
          ...payload.doctor,
        },
      });

      const doctorSpecialtyData = specialties.map((specialty) => ({
        doctorId: doctorData.id,
        specialtyId: specialty.id,
      }));

      await tx.doctorSpecialty.createMany({
        data: doctorSpecialtyData,
      });

      const doctor = await tx.doctor.findUnique({
        where: {
          id: doctorData.id,
        },
        select: {
          id: true,
          userId: true,
          name: true,
          email: true,
          profilePhoto: true,
          contactNumber: true,
          address: true,
          registrationNumber: true,
          experience: true,
          gender: true,
          appointmentFee: true,
          qualification: true,
          currentWorkingPlace: true,
          designation: true,
          createdAt: true,
          updatedAt: true,
          user: {
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                status: true,
                emailVerified: true,
                image: true,
                isDeleted: true,
                createdAt: true,
                updatedAt: true,
            }
          },
          specialties: {
            select: {
              specialty: {
                select: {
                  id: true,
                  title: true,
                },
              },
            },
          },
        },
      });

      return doctor;
    });
    return result;
  } catch (error) {
    console.log("Transaction error", error);
    await prisma.user.delete({
      where: {
        id: userData.user.id,
      },
    });
    throw error;
  }
};

const createAdmin = async (payload: CreateAdmin) => {
 const userExists = await prisma.user.findUnique({
    where: {
      email: payload.admin.email,
    },
  });

  if (userExists) {
    throw new AppError(status.CONFLICT, "User with this email already exists");
  }

  const userData = await auth.api.signUpEmail({
    body: {
      name: payload.admin.name,
      email: payload.admin.email,
      password: payload.password,
      role: Role.ADMIN,
      needPasswordChange: true,
    },
  });

  try {
    const result = await prisma.$transaction(async (tx) => {
      const adminData = await tx.admin.create({
        data: {
          userId: userData.user.id,
          ...payload.admin,
        },
        select: {
          id: true,
          userId: true,
          name: true,
          email: true,
          profilePhoto: true,
          contactNumber: true,
          address: true,
          gender: true,
          createdAt: true,
          updatedAt: true,
          user: {
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                status: true,
                emailVerified: true,
                image: true,
                isDeleted: true,
                createdAt: true,
                updatedAt: true,
            }
          },
        },
      });

      return adminData;
    });
    return result;
  } catch (error) {
    console.log("Transaction error", error);
    await prisma.user.delete({
      where: {
        id: userData.user.id,
      },
    });
    throw error;
  }
};

const createSuperAdmin = async (payload: CreateSuperAdmin) => {
 const userExists = await prisma.user.findUnique({
    where: {
      email: payload.superAdmin.email,
    },
  });

  if (userExists) {
    throw new AppError(status.CONFLICT, "User with this email already exists");
  }

  const userData = await auth.api.signUpEmail({
    body: {
      name: payload.superAdmin.name,
      email: payload.superAdmin.email,
      password: payload.password,
      role: Role.SUPER_ADMIN,
      needPasswordChange: true,
    },
  });

  try {
    const result = await prisma.$transaction(async (tx) => {
      const superAdminData = await tx.superAdmin.create({
        data: {
          userId: userData.user.id,
          ...payload.superAdmin,
        },
        select: {
          id: true,
          userId: true,
          name: true,
          email: true,
          profilePhoto: true,
          contactNumber: true,
          address: true,
          gender: true,
          createdAt: true,
          updatedAt: true,
          user: {
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                status: true,
                emailVerified: true,
                image: true,
                isDeleted: true,
                createdAt: true,
                updatedAt: true,
            }
          },
        },
      });
      
      return superAdminData;
    });
    return result;
  } catch (error) {
    console.log("Transaction error", error);
    await prisma.user.delete({
      where: {
        id: userData.user.id,
      },
    });
    throw error;
  }
};

export const userService = {
  createDoctor,
  createAdmin,
  createSuperAdmin
};
