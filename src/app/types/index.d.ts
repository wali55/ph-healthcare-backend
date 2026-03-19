import { RequestUser } from "./requestUserType";

declare global {
    namespace Express {
        interface Request {
            user: RequestUser
        }
    }
}