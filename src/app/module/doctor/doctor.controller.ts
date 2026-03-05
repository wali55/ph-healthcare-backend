import { Request, Response } from "express";
import { catchAsync } from "../../shared/catchAsync";
import { doctorService } from "./doctor.service";
import { sendResponse } from "../../shared/sendResponse";
import status from "http-status";

const getAllDoctors = catchAsync(async (req: Request, res: Response) => {
  const result = await doctorService.getAllDoctors();
  return sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Doctors fetched successfully!",
    data: result,
  });
});

const getDoctorById = catchAsync(async (req: Request, res: Response) => {
  const {id} = req.params;
  const result = await doctorService.getDoctorById(id as string);
  return sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Doctor fetched successfully!",
    data: result,
  });
});

const updateDoctor = catchAsync(async (req: Request, res: Response) => {
  const {id} = req.params;
  const result = await doctorService.updateDoctor(id as string, req.body);
  return sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Doctor updated successfully!",
    data: result,
  });
});

const deleteDoctor = catchAsync(async (req: Request, res: Response) => {
  const {id} = req.params;
  const result = await doctorService.deleteDoctor(id as string);
  return sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Doctor deleted successfully!",
    data: result,
  });
});

export const doctorController = {
    getAllDoctors,
    getDoctorById,
    updateDoctor,
    deleteDoctor
}