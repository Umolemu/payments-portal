import type { Request, Response } from "express";
import { addPayment, getPayment } from "../services/paymentService.js";

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
