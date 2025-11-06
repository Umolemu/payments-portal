import express from "express";
import { body, param } from "express-validator";
import {
  createPaymentController,
  getPaymentController,
  getUserPaymentsController,
  sendPaymentSwiftController,
  meController,
} from "../controllers/paymentController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { validateRequest } from "../middleware/validateRequest.js";
import { createPaymentValidators } from "../validations/paymentValidations.js";

const router = express.Router();

router.get("/payments", authMiddleware, getUserPaymentsController);
router.post(
  "/payments",
  authMiddleware,
  ...createPaymentValidators,
  validateRequest,
  createPaymentController
);
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
