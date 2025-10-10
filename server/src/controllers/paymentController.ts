import type { Request, Response } from "express";
import { addPayment, getPayment, sendPaymentSwift } from "../services/paymentService.js";
import type { AuthRequest } from "../middleware/authMiddleware.js";

export async function createPaymentController(req: Request, res: Response) {
  try {
    const userId = (req as any).user?.id; // from authMiddleware
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { amount, currency, provider, recipientName, recipientAccount, recipientSwift } = req.body;

    const payment = addPayment({
      userId,
      amount,
      currency,
      provider,
      recipientName,
      recipientAccount,
      recipientSwift,
    });

    res.status(201).json(payment);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
}

export async function getPaymentController(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    const payment = getPayment(id);
    res.status(200).json(payment);
  } catch (err: any) {
    res.status(404).json({ error: err.message });
  }
}

export async function sendPaymentSwiftController(req: AuthRequest, res: Response) {
  try {
    const userId = (req.user as any)?.id;
    if (!userId) return res.status(401).json({ error: "Unauthorized" });
    const id = Number(req.params.id);
    const result = sendPaymentSwift(id, Number(userId));
    res.status(200).json(result);
  } catch (err: any) {
    const msg = err?.message || "Failed to send payment";
    const code = msg === "Forbidden" ? 403 : msg.includes("not found") ? 404 : 400;
    res.status(code).json({ error: msg });
  }
}

export async function meController(req: AuthRequest, res: Response) {
  const user = req.user as any;
  if (!user) return res.status(401).json({ error: "Unauthorized" });
  res.json({ id: user.id, email: user.email, role: user.role });
}
