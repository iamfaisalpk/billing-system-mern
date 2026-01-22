import { HTTP_STATUS } from "../constants/httpStatus.js";

const notFound = (req, res, next) => {
    res.status(HTTP_STATUS.NOT_FOUND);
    const error = new Error(`Not Found - ${req.originalUrl}`);
    next(error);
};

export default notFound;
