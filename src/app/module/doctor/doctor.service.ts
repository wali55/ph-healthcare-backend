import status from "http-status";
import { UserStatus } from "../../../generated/prisma/enums";
import AppError from "../../errorHelpers/AppError";
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
      appointments: {
        include: {
          patient: true,
          doctorSchedule: true,
          prescription: true,
        },
      },
      doctorSchedules: {
        include: {
          schedule: true,
        },
      },
    },
  });
  return result;
};

const updateDoctor = async (id: string, payload: UpdateDoctorPayload) => {
  const isDoctorExists = await prisma.doctor.findUnique({
    where: {
      id,
    },
  });

  if (!isDoctorExists) {
    throw new AppError(status.NOT_FOUND, "Doctor not found");
  }

  const {doctor: doctorPayloadData, specialties} = payload;

  const result = await prisma.$transaction(async (tx) => {
    const doctorData = await tx.doctor.update({
      where: {
        id,
      },
      data: {
        ...doctorPayloadData,
      },
      include: {
        user: true,
      },
    });

    if (specialties && specialties.length > 0) {
    for (const specialty of specialties) {
      const {specialtyId, shouldDelete} = specialty;
      if (shouldDelete) {
        await tx.doctorSpecialty.delete({
          where: {
            doctorId_specialtyId: {
              doctorId: id,
              specialtyId,
            },
          },
        });
      } else {
        await tx.doctorSpecialty.upsert({
          where: {
            doctorId_specialtyId: {
              doctorId: id,
              specialtyId,
            },
          },
          update: {},
          create: {
            doctorId: id,
            specialtyId,
          },
        });
      }
    }
    }

    await tx.user.update({
      where: {
        id: doctorData.user.id,
      },
      data: {
        name: doctorPayloadData!.name!,
      },
    });

    await tx.session.deleteMany({
      where: {
        userId: isDoctorExists.userId,
      },
    });

    await tx.doctorSpecialty.deleteMany({
      where: {
        doctorId: id,
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
        deletedAt: new Date(),
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
        status: UserStatus.DELETED,
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
  deleteDoctor,
};
