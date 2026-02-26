import { NextFunction, Request, RequestHandler, Response } from "express";
import { specialtyService } from "./specialty.service";
import { catchAsync } from "../../shared/catchAsync";
import { sendResponse } from "../../shared/sendResponse";

const createSpecialty = catchAsync(async (req: Request, res: Response) => {
  const result = await specialtyService.createSpecialty(req.body);
  return sendResponse(res, {
    httpStatusCode: 201,
    success: true,
    message: "Specialty created successfully!",
    data: result,
  });
});

const getAllSpecialties = catchAsync(async (req: Request, res: Response) => {
  const result = await specialtyService.getAllSpecialties();
  return sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: "Specialties fetched successfully!",
    data: result,
  });
});

const deleteSpecialty = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await specialtyService.deleteSpecialty(id as string);
  return sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: "Specialty deleted successfully!",
    data: result,
  });
});

const updateSpecialty = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await specialtyService.updateSpecialty(req.body, id as string);
  return sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: "Specialty updated successfully!",
    data: result,
  });
});

export const specialtyController = {
  createSpecialty,
  getAllSpecialties,
  deleteSpecialty,
  updateSpecialty,
};
