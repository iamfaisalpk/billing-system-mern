import express from "express";
import {
    createInvoice,
    downloadInvoicePdf,
    getAllInvoices,
    getInvoiceById,
    updateInvoice
} from "../controllers/invoice.controller.js";

import middleware from "../middleware/auth.middleware.js";

const router = express.Router();

router.use(middleware);

router.get("/", getAllInvoices);
router.get("/:id", getInvoiceById);
router.post("/", createInvoice);
router.get("/:id/pdf", downloadInvoicePdf);

router.put("/:id", updateInvoice);

export default router;