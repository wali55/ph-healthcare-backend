import { JwtPayload, SignOptions } from "jsonwebtoken";
import { jwtUtils } from "./jwt";
import { envVars } from "../../config/env";
import { Response } from "express";
import { cookieUtils } from "./cookie";

const getAccessToken = (payload: JwtPayload) => {
  const accessToken = jwtUtils.createToken(
    payload,
    envVars.ACCESS_TOKEN_SECRET,
    { expiresIn: envVars.ACCESS_TOKEN_EXPIRES_IN } as SignOptions,
  );
  return accessToken;
};

const getRefreshToken = (payload: JwtPayload) => {
  const refreshToken = jwtUtils.createToken(
    payload,
    envVars.REFRESH_TOKEN_SECRET,
    { expiresIn: envVars.REFRESH_TOKEN_EXPIRES_IN } as SignOptions,
  );
  return refreshToken;
};

const setAccessTokenCookie = (res: Response, token: string) => {
  cookieUtils.setCookie(res, "accessToken", token, {
    httpOnly: true, // Prevents Cross-Site Scripting (XSS) attacks by making the cookie inaccessible to JavaScript
    secure: true, // Ensures the cookie is only sent over HTTPS connections
    sameSite: "none", // Allows the cookie to be sent in cross-site requests. This is necessary if your frontend and backend are on different domains
    path: "/", // Makes the cookie available across the entire domain
    maxAge: 60 * 60 * 24, // in sec
  });
};

const setRefreshTokenCookie = (res: Response, token: string) => {
  cookieUtils.setCookie(res, "refreshToken", token, {
    httpOnly: true, 
    secure: true, 
    sameSite: "none", 
    path: "/", 
    maxAge: 60 * 60 * 24 * 7,
  });
};

const setBetterAuthSessionTokenCookie = (res: Response, token: string) => {
  cookieUtils.setCookie(res, "better-auth.session_token", token, {
    httpOnly: true, 
    secure: true, 
    sameSite: "none", 
    path: "/", 
    maxAge: 60 * 60 * 24,
  });
}

export const tokenUtils = { getAccessToken, getRefreshToken, setAccessTokenCookie, setRefreshTokenCookie, setBetterAuthSessionTokenCookie };
