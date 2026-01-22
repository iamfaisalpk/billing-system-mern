import User from "../models/User.model.js";
import generateToken from "../utils/generateToken.js";
import { HTTP_STATUS } from "../constants/httpStatus.js";

export const registerUser = async (req, res, next) => {
    try {
        const { name, email, password } = req.body;

        const userExists = await User.findOne({ email });
        if (userExists) {
            res.status(HTTP_STATUS.BAD_REQUEST);
            throw new Error("User already exists");
        }

        const user = await User.create({ name, email, password });

        res.status(HTTP_STATUS.CREATED).json({
            success: true,
            token: generateToken(user._id)
        });
    } catch (error) {
        next(error);
    }
};

export const loginUser = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user || !(await user.matchPassword(password))) {
            res.status(HTTP_STATUS.UNAUTHORIZED);
            throw new Error("Invalid email or password");
        }

        res.status(HTTP_STATUS.OK).json({
            success: true,
            token: generateToken(user._id)
        });
    } catch (error) {
        next(error);
    }
};
