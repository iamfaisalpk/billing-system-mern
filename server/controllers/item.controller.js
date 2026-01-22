import Item from "../models/Item.model.js";
import { HTTP_STATUS } from "../constants/httpStatus.js";

export const createItem = async (req, res, next) => {
    try {
        const { name, price, stock } = req.body;

        const item = await Item.create({
            user: req.user._id,
            name,
            price,
            stock
        });

        res.status(HTTP_STATUS.CREATED).json({
            success: true,
            data: item
        });
    } catch (error) {
        next(error);
    }
};

export const getItems = async (req, res, next) => {
    try {
        const items = await Item.find({ user: req.user._id });
        res.status(HTTP_STATUS.OK).json({
            success: true,
            data: items
        });
    } catch (error) {
        next(error);
    }
};

export const getItem = async (req, res, next) => {
    try {
        const item = await Item.findOne({
            _id: req.params.id,
            user: req.user._id
        });

        if (!item) {
            res.status(HTTP_STATUS.NOT_FOUND);
            throw new Error("Item not found");
        }

        res.status(HTTP_STATUS.OK).json({
            success: true,
            data: item
        });
    } catch (error) {
        next(error);
    }
};

export const updateItem = async (req, res, next) => {
    try {
        const item = await Item.findOneAndUpdate(
            { _id: req.params.id, user: req.user._id },
            req.body,
            { new: true, runValidators: true }
        );

        if (!item) {
            res.status(HTTP_STATUS.NOT_FOUND);
            throw new Error("Item not found");
        }

        res.status(HTTP_STATUS.OK).json({
            success: true,
            data: item
        });
    } catch (error) {
        next(error);
    }
};

export const deleteItem = async (req, res, next) => {
    try {
        const item = await Item.findOneAndDelete({
            _id: req.params.id,
            user: req.user._id
        });

        if (!item) {
            res.status(HTTP_STATUS.NOT_FOUND);
            throw new Error("Item not found");
        }

        res.status(HTTP_STATUS.OK).json({
            success: true,
            message: "Item deleted successfully"
        });
    } catch (error) {
        next(error);
    }
};
