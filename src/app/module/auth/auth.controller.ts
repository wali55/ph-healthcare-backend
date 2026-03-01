import { Request, Response } from "express";
import { catchAsync } from "../../shared/catchAsync";
import { authService } from "./auth.service";
import { sendResponse } from "../../shared/sendResponse";
import { UserStatus } from "../../../generated/prisma/enums";
import status from "http-status";

const registerPatient = catchAsync(async (req: Request, res: Response) => {
  const {data, result} = await authService.registerPatient(req.body);

  const setCookie = data.headers.get("set-cookie");
  res.setHeader("Set-Cookie", setCookie as string);

  return sendResponse(res, {
    httpStatusCode: status.CREATED,
    success: true,
    message: "Patient created successfully",
    data: result,
  });
});

const loginPatient = catchAsync(async (req: Request, res: Response) => {
  const response = await authService.loginPatient(req.body);

  const setCookie = response.headers.get("set-cookie");
  res.setHeader("Set-Cookie", setCookie as string);

  const result = await response.json();

  if (result?.user?.status === UserStatus.BLOCKED) {
    return sendResponse(res, {
      httpStatusCode: status.UNAUTHORIZED,
      success: false,
      message: "Patient is blocked",
      data: null,
    });
  }

  if (result?.user?.isDeleted ||  result?.user?.status === UserStatus.DELETED) {
    return sendResponse(res, {
      httpStatusCode: status.UNAUTHORIZED,
      success: false,
      message: "Patient is deleted",
      data: null,
    });
  }

  return sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Patient logged in successfully",
    data: result,
  });
});

export const authController = {
  registerPatient,
  loginPatient,
};
