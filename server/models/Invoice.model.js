import mongoose from "mongoose";

const invoiceItemSchema = new mongoose.Schema(
    {
        item: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Item",
            required: true
        },
        name: String,
        price: Number,
        quantity: Number,
        total: Number
    },
    { _id: false }
);

const invoiceSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        customer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Customer",
            required: true
        },
        invoiceNumber: {
            type: String,
            required: true,
            unique: true
        },
        items: [invoiceItemSchema],
        subTotal: {
            type: Number,
            required: true
        },
        grandTotal: {
            type: Number,
            required: true
        },
        invoiceDate: {
            type: Date,
            default: Date.now
        }
    },
    { timestamps: true }
);

export default mongoose.model("Invoice", invoiceSchema);
