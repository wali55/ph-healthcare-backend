import { Request, Response } from "express";
import { catchAsync } from "../../shared/catchAsync";
import { userService } from "./user.service";
import { sendResponse } from "../../shared/sendResponse";
import status from "http-status";

const createDoctor = catchAsync(
    async (req: Request, res: Response) => {
        const result = await userService.createDoctor(req.body);
        return sendResponse(res, {
            httpStatusCode: status.CREATED,
            success: true,
            message: "Doctor registered successfully",
            data: result
        })
    }
)

const createAdmin = catchAsync(
    async (req: Request, res: Response) => {
        const result = await userService.createAdmin(req.body);
        return sendResponse(res, {
            httpStatusCode: status.CREATED,
            success: true,
            message: "Admin registered successfully",
            data: result
        })
    }
)

const createSuperAdmin = catchAsync(
    async (req: Request, res: Response) => {
        const result = await userService.createSuperAdmin(req.body);
        return sendResponse(res, {
            httpStatusCode: status.CREATED,
            success: true,
            message: "Super admin registered successfully",
            data: result
        })
    }
)

export const userController = {
    createDoctor,
    createAdmin,
    createSuperAdmin
}