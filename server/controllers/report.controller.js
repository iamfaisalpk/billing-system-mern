import Invoice from "../models/Invoice.model.js";
import mongoose from "mongoose";

export const customerWiseReport = async (req, res, next) => {
    try {
        const userId = req.user._id;
        const { customerId } = req.params;

        const invoices = await Invoice.find({
            user: userId,
            customer: customerId
        })
            .populate({
                path: 'customer',
                select: 'name phone email'
            })
            .sort({ createdAt: -1 })
            .lean();

        const safeInvoices = invoices.map((inv) => ({
            ...inv,
            customer: inv.customer || {
                name: "Deleted Customer",
                phone: "",
                email: ""
            }
        }));

        res.status(200).json({
            success: true,
            data: safeInvoices
        });
    } catch (err) {
        next(err);
    }
};

export const dateWiseSalesReport = async (req, res, next) => {
    try {
        const userId = req.user._id;
        const { from, to } = req.query;

        const match = {
            user: new mongoose.Types.ObjectId(userId)
        };

        if (from && to) {
            match.invoiceDate = {
                $gte: new Date(from),
                $lte: new Date(to)
            };
        }


        const result = await Invoice.aggregate([
            { $match: match },
            {
                $lookup: {
                    from: "customers",
                    localField: "customer",
                    foreignField: "_id",
                    as: "customer"
                }
            },
            {
                $unwind: {
                    path: "$customer",
                    preserveNullAndEmptyArrays: true 
                }
            },
            {
                $group: {
                    _id: null,
                    totalSales: { $sum: "$grandTotal" },
                    invoices: { $push: "$$ROOT" }
                }
            }
        ]);

        const invoices = result[0]?.invoices || [];
        const safeInvoices = invoices.map((inv) => ({
            ...inv,
            customer: inv.customer || {
                name: "Deleted Customer",
                phone: "",
                email: ""
            }
        }));

        res.status(200).json({
            success: true,
            data: {
                totalSales: result[0]?.totalSales || 0,
                invoices: safeInvoices
            }
        });
    } catch (err) {
        next(err);
    }
};