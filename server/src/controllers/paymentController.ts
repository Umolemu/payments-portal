import type { Request, Response } from "express";
import {
  addPayment,
  getPayment,
  getUserPayments,
  sendPaymentSwift,
} from "../services/paymentService.js";
import type { AuthRequest } from "../middleware/authMiddleware.js";
import type { Types } from "mongoose";

export async function createPaymentController(req: Request, res: Response) {
  try {
    const userId = (req as any).user?.id; // from authMiddleware
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const {
      amount,
      currency,
      recipientName,
      recipientAccount,
      recipientSwift,
      reference,
    } = req.body;

    const payment = await addPayment({
      userId,
      amount: parseFloat(amount),
      currency: currency.toUpperCase(),
      provider: "SWIFT",
      recipientName,
      recipientAccount: recipientAccount.toUpperCase(),
      recipientSwift: recipientSwift.toUpperCase(),
    });

    const paymentObj: any = payment.toObject();
    res.status(201).json({
      ...paymentObj,
      id: paymentObj._id.toString(), // Add id field for frontend compatibility
      reference, // Include the reference in response
      message: "Payment created successfully",
    });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
}

export async function getPaymentController(req: Request, res: Response) {
  try {
    const id = req.params.id;
    if (!id) return res.status(400).json({ error: "Payment ID required" });
    const payment = await getPayment(id);
    const paymentObj: any = payment.toObject();
    res.status(200).json({
      ...paymentObj,
      id: paymentObj._id.toString(),
    });
  } catch (err: any) {
    res.status(404).json({ error: err.message });
  }
}

export async function getUserPaymentsController(
  req: AuthRequest,
  res: Response
) {
  try {
    const userId = (req.user as any)?.id;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const payments = await getUserPayments(userId);
    // Transform MongoDB documents to include id field
    const transformedPayments = payments.map((p) => {
      const obj: any = p.toObject();
      return {
        ...obj,
        id: obj._id.toString(),
      };
    });
    res.status(200).json(transformedPayments);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}

export async function sendPaymentSwiftController(
  req: AuthRequest,
  res: Response
) {
  try {
    const userId = (req.user as any)?.id;
    if (!userId) return res.status(401).json({ error: "Unauthorized" });
    const id = req.params.id;
    if (!id) return res.status(400).json({ error: "Payment ID required" });
    const result = await sendPaymentSwift(id, String(userId));
    res.status(200).json(result);
  } catch (err: any) {
    const msg = err?.message || "Failed to send payment";
    const code =
      msg === "Forbidden" ? 403 : msg.includes("not found") ? 404 : 400;
    res.status(code).json({ error: msg });
  }
}

export async function meController(req: AuthRequest, res: Response) {
  const user = req.user as any;
  if (!user) return res.status(401).json({ error: "Unauthorized" });
  res.json({ id: user.id, email: user.email, role: user.role });
}
