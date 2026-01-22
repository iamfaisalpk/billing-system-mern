import express from "express";
import { getDashboardStats } from "../controllers/dashboard.controller.js";
import middleware from "../middleware/auth.middleware.js";


const router = express.Router();

router.use(middleware);
router.get("/", getDashboardStats);

export default router;
