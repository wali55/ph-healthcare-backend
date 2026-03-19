import { UserStatus } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";
import { UpdateSuperAdminPayload } from "./superAdmin.type";

const getAllSuperAdmins = async () => {
  const result = await prisma.superAdmin.findMany({
    where: {
      isDeleted: false,
    },
    include: {
      user: true,
    },
  });
  return result;
};

const getSuperAdminById = async (id: string) => {
  const result = await prisma.superAdmin.findUnique({
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

const updateSuperAdmin = async (id: string, payload: UpdateSuperAdminPayload) => {
  const result = await prisma.$transaction(async (tx) => {
    const superAdminData = await tx.superAdmin.update({
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
        id: superAdminData.user.id,
      },
      data: {
        name: payload.name!,
      },
    });

    const superAdmin = await tx.superAdmin.findUnique({
      where: {
        id: superAdminData.id,
      },
      include: {
        user: true,
      },
    });
    return superAdmin;
  });

  return result;
};

const deleteSuperAdmin = async (id: string) => {
  const result = await prisma.$transaction(async (tx) => {
    const superAdminData = await tx.superAdmin.update({
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
        id: superAdminData.user.id,
      },
      data: {
        isDeleted: true,
        deletedAt: new Date(),
        status: UserStatus.DELETED
      },
    });

    await tx.session.deleteMany({
      where: {
        userId: superAdminData.user.id,
      },
    });

    const superAdmin = await tx.superAdmin.findUnique({
      where: {
        id: superAdminData.id,
      },
      include: {
        user: true,
      },
    });
    return superAdmin;
  });

  return result;
};

export const superAdminService = {
  getAllSuperAdmins,
  getSuperAdminById,
  updateSuperAdmin,
  deleteSuperAdmin
};
