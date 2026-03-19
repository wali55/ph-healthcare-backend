import { NextFunction, Request, Response } from "express";
import { Role } from "../../generated/prisma/enums";
import { cookieUtils } from "../utils/cookie";
import AppError from "../errorHelpers/AppError";
import status from "http-status";
import { prisma } from "../lib/prisma";
import { jwtUtils } from "../utils/jwt";
import { envVars } from "../../config/env";

export const checkAuth =
  (...authRoles: Role[]) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Session token verification
      const sessionToken = cookieUtils.getCookie(
        req,
        "better-auth.session_token",
      );

      if (!sessionToken) {
        throw new AppError(
          status.UNAUTHORIZED,
          "Unauthorized access, please login first",
        );
      }

      if (sessionToken) {
        const sessionExists = await prisma.session.findFirst({
          where: {
            token: sessionToken,
            expiresAt: {
              gt: new Date(),
            },
          },
          include: {
            user: true,
          },
        });

        if (!sessionExists) {
          throw new AppError(
            status.UNAUTHORIZED,
            "Unauthorized access, invalid session token",
          );
        }

        if (sessionExists && sessionExists.user) {
          const user = sessionExists.user;

          const now = new Date();
          const expiresAt = new Date(sessionExists.expiresAt);
          const createdAt = new Date(sessionExists.createdAt);

          const sessionLifetime = expiresAt.getTime() - now.getTime();
          const timeRemaining = now.getTime() - createdAt.getTime();
          const percentRemaining = (timeRemaining / sessionLifetime) * 100;

          if (percentRemaining < 20) {
            res.setHeader("X-Session-Refresh", "true");
            res.setHeader("X-Session-Expires-At", expiresAt.toISOString());
            res.setHeader("X-Session-Time-Remaining", timeRemaining.toString());

            console.log("Session expiring soon");
          }

          req.user = {
            id: user.id,
            email: user.email,
            role: user.role,
          };

          if (user.status === "BLOCKED" || user.status === "DELETED") {
            throw new AppError(
              status.UNAUTHORIZED,
              "Unauthorized access, user is blocked or deleted",
            );
          }

          if (user.isDeleted) {
            throw new AppError(
              status.UNAUTHORIZED,
              "Unauthorized access, user is deleted",
            );
          }

          if (authRoles.length > 0 && !authRoles.includes(user.role)) {
            throw new AppError(
              status.FORBIDDEN,
              "Forbidden access, user is not authorized to access this route",
            );
          }

          // Access token verification
          const accessToken = cookieUtils.getCookie(req, "accessToken");
          if (!accessToken) {
            throw new AppError(
              status.UNAUTHORIZED,
              "Unauthorized access, please login first",
            );
          }

          const verifiedToken = jwtUtils.verifyToken(
            accessToken,
            envVars.ACCESS_TOKEN_SECRET,
          );

          if (!verifiedToken.success) {
            throw new AppError(
              status.UNAUTHORIZED,
              "Unauthorized access, invalid access token",
            );
          }

          if (
            authRoles.length > 0 &&
            !authRoles.includes(verifiedToken.data!.role)
          ) {
            throw new AppError(
              status.UNAUTHORIZED,
              "Unauthorized access, only admin can access this route",
            );
          }

          next();
        }
      }
    } catch (error) {
      next(error);
    }
  };
