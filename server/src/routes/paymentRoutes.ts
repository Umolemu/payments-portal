import express from "express";
import { createPaymentController, getPaymentController } from "../controllers/paymentController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/payments", authMiddleware, createPaymentController);
router.get("/payments/:id", authMiddleware, getPaymentController);

export default router;
