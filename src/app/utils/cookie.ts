import { CookieOptions, Request, Response } from "express";

// we will set cookie in the response of login/register
const setCookie = (res: Response, key: string, value: string, options: CookieOptions) => {
    res.cookie(key, value, options);
}

// we will get cookie from the client request
const getCookie = (req: Request, key: string) => {
    return req.cookies[key];
}

// we will clear cookie from the response so that it will not be set in the browser
const clearCookie = (res: Response, key: string, options: CookieOptions) => {
    res.clearCookie(key, options);
}

export const cookieUtils = { setCookie, getCookie, clearCookie };