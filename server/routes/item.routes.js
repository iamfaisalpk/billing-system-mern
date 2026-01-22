import express from "express";
import {
    createItem,
    getItems,
    getItem,
    updateItem,
    deleteItem
} from "../controllers/item.controller.js";
import middleware from "../middleware/auth.middleware.js";

const router = express.Router();

router.use(middleware);

router.post("/", createItem);
router.get("/", getItems);
router.get("/:id", getItem);
router.put("/:id", updateItem);
router.delete("/:id", deleteItem);

export default router;
