import jwt, { JwtPayload, SignOptions } from "jsonwebtoken";

const createToken = (
  payload: JwtPayload,
  secret: string,
  { expiresIn }: SignOptions,
) => {
  const token = jwt.sign(payload, secret, { expiresIn: expiresIn! });
  return token;
};
const verifyToken = (token: string, secret: string) => {
  try {
    const decoded = jwt.verify(token, secret) as JwtPayload;
    // verify either return JwtPayload or give an error as string
    return {
      success: true,
      data: decoded,
    };
  } catch (error: any) {
    // very important to handle the error or else our server will crash
    return {
      success: false,
      message: error.message,
      error: error,
    };
  }
};
const decodeToken = (token: string) => {
    const decoded = jwt.decode(token);
    return decoded;
  };

export const jwtUtils = {
  createToken,
  verifyToken,
  decodeToken
};
