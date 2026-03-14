import { UserStatus } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";
import { UpdateDoctorPayload } from "./doctor.type";

const getAllDoctors = async () => {
  const result = await prisma.doctor.findMany({
    where: {
      isDeleted: false,
    },
    include: {
      user: true,
      specialties: {
        include: {
          specialty: true,
        },
      },
    },
  });
  return result;
};

const getDoctorById = async (id: string) => {
  const result = await prisma.doctor.findUnique({
    where: {
      id,
      isDeleted: false,
    },
    include: {
      user: true,
      specialties: {
        include: {
          specialty: true,
        },
      },
    },
  });
  return result;
};

const updateDoctor = async (id: string, payload: UpdateDoctorPayload) => {
  const result = await prisma.$transaction(async (tx) => {
    const doctorData = await tx.doctor.update({
      where: {
        id,
      },
      data: payload,
      include: {
        user: true,
      },
    });

    await tx.user.update({
      where: {
        id: doctorData.user.id,
      },
      data: {
        name: payload.name!,
      },
    });

    const doctor = await tx.doctor.findUnique({
      where: {
        id: doctorData.id,
      },
      include: {
        user: true,
        specialties: {
          include: {
            specialty: true,
          },
        },
      },
    });
    return doctor;
  });

  return result;
};

const deleteDoctor = async (id: string) => {
  const result = await prisma.$transaction(async (tx) => {
    const doctorData = await tx.doctor.update({
      where: {
        id,
      },
      data: {
        isDeleted: true,
        deletedAt: new Date()
      },
      include: {
        user: true,
      },
    });

    await tx.user.update({
      where: {
        id: doctorData.user.id,
      },
      data: {
        isDeleted: true,
        deletedAt: new Date(),
        status: UserStatus.DELETED
      },
    });

    const doctor = await tx.doctor.findUnique({
      where: {
        id: doctorData.id,
      },
      include: {
        user: true,
        specialties: {
          include: {
            specialty: true,
          },
        },
      },
    });
    return doctor;
  });

  return result;
};

export const doctorService = {
  getAllDoctors,
  getDoctorById,
  updateDoctor,
  deleteDoctor
};
