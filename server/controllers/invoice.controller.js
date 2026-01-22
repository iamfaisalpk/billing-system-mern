import Invoice from "../models/Invoice.model.js";
import Item from "../models/Item.model.js";
import Customer from "../models/Customer.model.js";
import { v4 as uuidv4 } from "uuid";
import generateInvoicePdf from "../utils/generateInvoicePdf.js";

export const createInvoice = async (req, res, next) => {
    try {
        const { customerId, items } = req.body;

        if (!customerId || !Array.isArray(items) || items.length === 0) {
            return res.status(400).json({ message: "Customer and at least one item are required" });
        }

        const customer = await Customer.findOne({
            _id: customerId,
            user: req.user._id,
        });

        if (!customer) {
            return res.status(404).json({ message: "Customer not found or not owned by you" });
        }

        let invoiceItems = [];
        let subTotal = 0;

        for (const i of items) {
            const quantity = Number(i.quantity);

            if (isNaN(quantity) || quantity < 1 || !Number.isInteger(quantity)) {
                return res.status(400).json({
                    message: `Invalid quantity for item ${i.itemId}: must be positive integer`,
                });
            }

            const item = await Item.findOne({
                _id: i.itemId,
                user: req.user._id,
            });

            if (!item) {
                return res.status(404).json({ message: `Item not found: ${i.itemId}` });
            }

            if (item.stock < quantity) {
                return res.status(400).json({
                    message: `Insufficient stock for ${item.name}. Available: ${item.stock}, Requested: ${quantity}`,
                });
            }

            const itemTotal = item.price * quantity;

            item.stock -= quantity;
            await item.save();

            subTotal += itemTotal;

            invoiceItems.push({
                item: item._id,
                name: item.name,
                price: item.price,
                quantity: quantity,
                total: itemTotal,
            });
        }

        const invoice = await Invoice.create({
            user: req.user._id,
            customer: customer._id,
            invoiceNumber: `INV-${uuidv4().slice(0, 8)}`,
            items: invoiceItems,
            subTotal,
            grandTotal: subTotal,
        });

        res.status(201).json({
            success: true,
            data: invoice,
        });
    } catch (error) {
        console.error("Create invoice error:", error);
        next(error);
    }
};

export const downloadInvoicePdf = async (req, res, next) => {
    try {
        const invoice = await Invoice.findOne({
            _id: req.params.id,
            user: req.user._id
        });

        if (!invoice) {
            res.status(404);
            throw new Error("Invoice not found");
        }

        const customer = await Customer.findById(invoice.customer);

        generateInvoicePdf(invoice, customer, res);
    } catch (error) {
        next(error);
    }
};

export const getAllInvoices = async (req, res, next) => {
    try {
        const invoices = await Invoice.find({ user: req.user._id })
            .sort({ createdAt: -1 })
            .populate({
                path: 'customer',
                select: 'name phone email',
                options: { lean: true } // returns plain JS objects
            })
            .populate({
                path: 'items.item',
                select: 'name price',
                options: { lean: true }
            });

        // Map invoices to add safe customer info
        const safeInvoices = invoices.map((inv) => {
            const customerData = inv.customer
                ? inv.customer
                : { name: "Unknown Customer", phone: "", email: "", isCustomerMissing: true };

            return {
                ...inv.toObject(),
                customer: customerData
            };
        });

        res.status(200).json({
            success: true,
            count: invoices.length,
            data: safeInvoices
        });
    } catch (error) {
        console.error('Populate error:', error);
        next(error);
    }
};

export const getInvoiceById = async (req, res, next) => {
    try {
        const invoice = await Invoice.findOne({
            _id: req.params.id,
            user: req.user._id,
        })
            .populate({
                path: 'customer',
                select: 'name phone email address gstin',
                options: { lean: true }
            })
            .populate({
                path: 'items.item',
                select: 'name unit price',
                options: { lean: true }
            });

        if (!invoice) {
            return res.status(404).json({ message: "Invoice not found" });
        }

        const safeCustomer = invoice.customer
            ? invoice.customer
            : { name: "Unknown Customer", phone: "", email: "", isCustomerMissing: true };

        res.status(200).json({
            success: true,
            data: {
                ...invoice.toObject(),
                customer: safeCustomer
            }
        });
    } catch (error) {
        next(error);
    }
};



export const updateInvoice = async (req, res, next) => {
    try {
        const { customerId, items } = req.body;

        let invoice = await Invoice.findOne({
            _id: req.params.id,
            user: req.user._id
        });

        if (!invoice) {
            res.status(404);
            throw new Error("Invoice not found");
        }

        const customer = await Customer.findOne({
            _id: customerId,
            user: req.user._id
        });

        if (!customer) {
            res.status(404);
            throw new Error("Customer not found");
        }

        for (const oldItem of invoice.items) {
            await Item.findByIdAndUpdate(oldItem.item, {
                $inc: { stock: oldItem.quantity }
            });
        }

        let invoiceItems = [];
        let subTotal = 0;

        for (const i of items) {
            const item = await Item.findOne({
                _id: i.itemId,
                user: req.user._id
            });

            if (!item) {
                res.status(404);
                throw new Error("Item not found");
            }

            if (item.stock < i.quantity) {
                res.status(400);
                throw new Error(`Insufficient stock for ${item.name}`);
            }

            const itemTotal = item.price * i.quantity;

            item.stock -= i.quantity;
            await item.save();

            subTotal += itemTotal;

            invoiceItems.push({
                item: item._id,
                name: item.name,
                price: item.price,
                quantity: i.quantity,
                total: itemTotal
            });
        }

        invoice = await Invoice.findByIdAndUpdate(
            req.params.id,
            {
                customer: customer._id,
                items: invoiceItems,
                subTotal,
                grandTotal: subTotal
            },
            { new: true, runValidators: true }
        );

        res.status(200).json({
            success: true,
            data: invoice
        });
    } catch (error) {
        next(error);
    }
};