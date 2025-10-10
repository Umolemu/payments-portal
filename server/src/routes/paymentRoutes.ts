import express from "express";
import { body, param } from "express-validator";
import {
  createPaymentController,
  getPaymentController,
  sendPaymentSwiftController,
  meController,
} from "../controllers/paymentController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { validateRequest } from "../middleware/validateRequest.js";

const router = express.Router();

router.post("/payments", authMiddleware, createPaymentController);
router.get("/payments/:id", authMiddleware, getPaymentController);
router.post(
  "/paymments/send-payment/:id",
  authMiddleware,
  param("id").isInt({ min: 1 }),
  validateRequest,
  sendPaymentSwiftController
);

// Optional: session info
router.get("/me", authMiddleware, meController);

export default router;
