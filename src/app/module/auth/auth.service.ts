import status from "http-status";
import AppError from "../../errorHelpers/AppError";
import { auth } from "../../lib/auth";
import { prisma } from "../../lib/prisma";
import { tokenUtils } from "../../utils/token";
import { LoginPatient, RegisterPatient } from "./auth.type";
import { RequestUser } from "../../types/requestUserType";

const registerPatient = async (payload: RegisterPatient) => {
  const { name, email, password } = payload;
  const data = await auth.api.signUpEmail({
    body: {
      name,
      email,
      password,
    },
  });

  if (!data.user) {
    throw new AppError(status.INTERNAL_SERVER_ERROR, "Failed to register patient");
  }

  try {
    const patient = await prisma.$transaction(async (tx) => {
      const patientTx = await tx.patient.create({
        data: {
          userId: data.user.id,
          name: payload.name,
          email: payload.email,
        },
      });
      return patientTx;
    });

    const accessToken = tokenUtils.getAccessToken({
      userId: data?.user?.id,
      role: data?.user?.role,
      status: data?.user?.status,
      email: data?.user?.email,
      isDeleted: data?.user?.isDeleted,
      emailVerified: data?.user?.emailVerified,
      name: data?.user?.name,
    });
  
    const refreshToken = tokenUtils.getRefreshToken({
      userId: data?.user?.id,
      role: data?.user?.role,
      status: data?.user?.status,
      email: data?.user?.email,
      isDeleted: data?.user?.isDeleted,
      emailVerified: data?.user?.emailVerified,
      name: data?.user?.name,
    });

    return { ...data, patient, accessToken, refreshToken };
  } catch (error) {
    console.log(error);
    await prisma.user.delete({
        where: {
            id: data.user.id           // manually delete user if user is created but patient not created
        }
    })
    throw error; // global error handler will catch it
  }
};

const loginPatient = async (payload: LoginPatient) => {
  const { email, password } = payload;

  const data = await auth.api.signInEmail({
    body: {
      email,
      password,
    },
  });

  if (!data.user) {
    throw new AppError(status.INTERNAL_SERVER_ERROR, "Failed to login patient");
  }

  const accessToken = tokenUtils.getAccessToken({
      userId: data?.user?.id,
      role: data?.user?.role,
      status: data?.user?.status,
      email: data?.user?.email,
      isDeleted: data?.user?.isDeleted,
      emailVerified: data?.user?.emailVerified,
      name: data?.user?.name,
    });
  
    const refreshToken = tokenUtils.getRefreshToken({
      userId: data?.user?.id,
      role: data?.user?.role,
      status: data?.user?.status,
      email: data?.user?.email,
      isDeleted: data?.user?.isDeleted,
      emailVerified: data?.user?.emailVerified,
      name: data?.user?.name,
    });

  return {accessToken, refreshToken, ...data};
};

const getMe = async (user: RequestUser) => {
  const isUserExists = await prisma.user.findUnique({
    where: {
      id: user.id,
    },
    include: {
      patient: {
        include: {
          appointments: true,
          reviews: true,
          prescriptions: true,
          medicalReports: true,
          patientHealthData: true 
        }
      },
      admin: true,
      doctor: {
        include: {
          specialties: true,
          appointments: true,
          reviews: true,
          prescriptions: true,
        }
      },
    },
  });

  if (!isUserExists) {
    throw new AppError(status.NOT_FOUND, "User not found");
  }

  return isUserExists;
}

export const authService = {
  registerPatient,
  loginPatient,
  getMe
};
