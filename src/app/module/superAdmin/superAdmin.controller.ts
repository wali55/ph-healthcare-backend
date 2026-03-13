import { Request, Response } from "express";
import { catchAsync } from "../../shared/catchAsync";
import { superAdminService } from "./superAdmin.service";
import { sendResponse } from "../../shared/sendResponse";
import status from "http-status";

const getAllSuperAdmins = catchAsync(async (req: Request, res: Response) => {
  const result = await superAdminService.getAllSuperAdmins();
  return sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Super Admins fetched successfully!",
    data: result,
  });
});

const getSuperAdminById = catchAsync(async (req: Request, res: Response) => {
  const {id} = req.params;
  const result = await superAdminService.getSuperAdminById(id as string);
  return sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Super Admin fetched successfully!",
    data: result,
  });
});

const updateSuperAdmin = catchAsync(async (req: Request, res: Response) => {
  const {id} = req.params;
  const result = await superAdminService.updateSuperAdmin(id as string, req.body);
  return sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Super Admin updated successfully!",
    data: result,
  });
});

const deleteSuperAdmin = catchAsync(async (req: Request, res: Response) => {
  const {id} = req.params;
  const result = await superAdminService.deleteSuperAdmin(id as string);
  return sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Super Admin deleted successfully!",
    data: result,
  });
});

export const superAdminController = {
    getAllSuperAdmins,
    getSuperAdminById,
    updateSuperAdmin,
    deleteSuperAdmin
}