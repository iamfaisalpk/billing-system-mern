import Customer from "../models/Customer.model.js";
import { HTTP_STATUS } from "../constants/httpStatus.js";

export const createCustomer = async (req, res, next) => {
    try {
        const { name, email, phone, address } = req.body;

        const customer = await Customer.create({
            user: req.user._id,
            name,
            email,
            phone,
            address
        });

        res.status(HTTP_STATUS.CREATED).json({
            success: true,
            data: customer
        });
    } catch (error) {
        next(error);
    }
};

export const getCustomers = async (req, res, next) => {
    try {
        const customers = await Customer.find({ user: req.user._id });
        res.status(HTTP_STATUS.OK).json({
            success: true,
            data: customers
        });
    } catch (error) {
        next(error);
    }
};

export const getCustomer = async (req, res, next) => {
    try {
        const customer = await Customer.findOne({
            _id: req.params.id,
            user: req.user._id
        });

        if (!customer) {
            res.status(HTTP_STATUS.NOT_FOUND);
            throw new Error("Customer not found");
        }

        res.status(HTTP_STATUS.OK).json({
            success: true,
            data: customer
        });
    } catch (error) {
        next(error);
    }
};

export const updateCustomer = async (req, res, next) => {
    try {
        const customer = await Customer.findOneAndUpdate(
            { _id: req.params.id, user: req.user._id },
            req.body,
            { new: true, runValidators: true }
        );

        if (!customer) {
            res.status(HTTP_STATUS.NOT_FOUND);
            throw new Error("Customer not found");
        }

        res.status(HTTP_STATUS.OK).json({
            success: true,
            data: customer
        });
    } catch (error) {
        next(error);
    }
};

export const deleteCustomer = async (req, res, next) => {
    try {
        const customer = await Customer.findOneAndDelete({
            _id: req.params.id,
            user: req.user._id
        });

        if (!customer) {
            res.status(HTTP_STATUS.NOT_FOUND);
            throw new Error("Customer not found");
        }

        res.status(HTTP_STATUS.OK).json({
            success: true,
            message: "Customer deleted successfully"
        });
    } catch (error) {
        next(error);
    }
};
