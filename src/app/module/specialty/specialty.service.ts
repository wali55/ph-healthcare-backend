import type { Specialty } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";

const createSpecialty = async (payload: Specialty): Promise<Specialty> => {
  const specialty = await prisma.specialty.create({
    data: payload,
  });
  return specialty;
};

const getAllSpecialties = async () => {
  const result = await prisma.specialty.findMany();
  return result;
}

const deleteSpecialty = async (id: string) => {
  const result = await prisma.specialty.delete({
    where: {
      id
    }
  });
  return result;
}

const updateSpecialty = async (payload: Specialty, id: string) => {
  const result = await prisma.specialty.update({
    where: {
      id
    },
    data: payload
  });
  return result;
}

export const specialtyService = {
  createSpecialty,
  getAllSpecialties,
  deleteSpecialty,
  updateSpecialty
};
