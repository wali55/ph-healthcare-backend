import { Role } from "../../generated/prisma/enums";

export type RequestUser = {
  id: string;
  role: Role;
  email: string;
};
