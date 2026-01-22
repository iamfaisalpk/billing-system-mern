import { HTTP_STATUS } from "../constants/httpStatus.js";

const errorHandler = (err, req, res, next) => {
    console.error(" ERROR:", err.message);

    const statusCode =
        res.statusCode === HTTP_STATUS.OK
            ? HTTP_STATUS.INTERNAL_SERVER_ERROR
            : res.statusCode;

    res.status(statusCode).json({
        success: false,
        message: err.message || "Internal Server Error",
        stack: process.env.NODE_ENV === "production" ? null : err.stack
    });
};

export default errorHandler;
