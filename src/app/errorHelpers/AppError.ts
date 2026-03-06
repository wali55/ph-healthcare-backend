// when we are creating a error we want to send status code along with message, so we are creating custom error class

class AppError extends Error {
    public statusCode: number;
    constructor(statusCode: number, message: string, stack = "") {
        super(message);
        this.statusCode = statusCode;

        if (stack) {
            this.stack = stack;
        } else {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}

export default AppError;