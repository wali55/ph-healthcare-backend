import status from "http-status";
import AppError from "../../errorHelpers/AppError";
import { auth } from "../../lib/auth";
import { prisma } from "../../lib/prisma";

type RegisterPatient = {
  name: string;
  email: string;
  password: string;
};

type LoginPatient = {
  email: string;
  password: string;
};

const registerPatient = async (payload: RegisterPatient) => {
  const { name, email, password } = payload;
  const data = await auth.api.signUpEmail({
    body: {
      name,
      email,
      password,
    },
    asResponse: true,
  });

  if (!data.ok) {
    throw new AppError(status.INTERNAL_SERVER_ERROR, "Failed to register patient");
  }

  const result = await data.json();

  try {
    const patient = await prisma.$transaction(async (tx) => {
      const patientTx = await tx.patient.create({
        data: {
          userId: result.user.id,
          name: payload.name,
          email: payload.email,
        },
      });
      return patientTx;
    });
    return { data, patient, result };
  } catch (error) {
    console.log(error);
    await prisma.user.delete({
        where: {
            id: result.user.id           // manually delete user if user is created but patient not created
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
    asResponse: true,
  });

  if (!data.ok) {
    throw new AppError(status.INTERNAL_SERVER_ERROR, "Failed to login patient");
  }

  return data;
};

export const authService = {
  registerPatient,
  loginPatient,
};
