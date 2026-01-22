import express from "express";
import {
    customerWiseReport,
    dateWiseSalesReport
} from "../controllers/report.controller.js";
import middleware from "../middleware/auth.middleware.js";

const router = express.Router();

router.use(middleware);

router.get("/customer/:customerId", customerWiseReport);
router.get("/sales", dateWiseSalesReport);

export default router;
