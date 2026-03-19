import { UserStatus } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";
import { UpdateAdminPayload } from "./admin.type";

const getAllAdmins = async () => {
  const result = await prisma.admin.findMany({
    where: {
      isDeleted: false,
    },
    include: {
      user: true,
    },
  });
  return result;
};

const getAdminById = async (id: string) => {
  const result = await prisma.admin.findUnique({
    where: {
      id,
      isDeleted: false,
    },
    include: {
      user: true,
    },
  });
  return result;
};

const updateAdmin = async (id: string, payload: UpdateAdminPayload) => {
  const result = await prisma.$transaction(async (tx) => {
    const adminData = await tx.admin.update({
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
        id: adminData.user.id,
      },
      data: {
        name: payload.name!,
      },
    });

    const admin = await tx.admin.findUnique({
      where: {
        id: adminData.id,
      },
      include: {
        user: true,
      },
    });
    return admin;
  });

  return result;
};

const deleteAdmin = async (id: string) => {
  const result = await prisma.$transaction(async (tx) => {
    const adminData = await tx.admin.update({
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
        id: adminData.user.id,
      },
      data: {
        isDeleted: true,
        deletedAt: new Date(),
        status: UserStatus.DELETED
      },
    });

    await tx.session.deleteMany({
      where: {
        userId: adminData.user.id,
      },
    });

    const admin = await tx.admin.findUnique({
      where: {
        id: adminData.id,
      },
      include: {
        user: true,
      },
    });
    return admin;
  });

  return result;
};

export const adminService = {
  getAllAdmins,
  getAdminById,
  updateAdmin,
  deleteAdmin
};
