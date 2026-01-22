import jwt from "jsonwebtoken";
import User from "../models/User.model.js";
import { HTTP_STATUS } from "../constants/httpStatus.js";

const middleware = async (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
    ) {
        try {
            token = req.headers.authorization.split(" ")[1];

            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await User.findById(decoded.id).select("-password");

            next();
        } catch (error) {
            res.status(HTTP_STATUS.UNAUTHORIZED);
            next(new Error("Not authorized, token failed"));
        }
    } else {
        res.status(HTTP_STATUS.UNAUTHORIZED);
        next(new Error("Not authorized, no token"));
    }
};

export default middleware;
