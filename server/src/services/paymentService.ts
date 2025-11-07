import { PaymentModel } from "../models/paymentmodel.js";
import type { IPayment } from "../models/paymentmodel.js";

// Validation regex (as before)
const SAFE_TEXT = /^[a-zA-Z0-9\s.,'-]{1,100}$/;

export function validatePaymentInput(input: {
  amount?: number;
  currency?: string;
  provider?: string;
  recipientName?: string;
  recipientAccount?: string;
  recipientSwift?: string;
}) {
  if (typeof input.amount !== "number" || input.amount <= 0) {
    throw new Error("Invalid amount");
  }
  if (!SAFE_TEXT.test(input.currency || "")) {
    throw new Error("Invalid currency format");
  }
  if (input.provider !== "SWIFT") {
    throw new Error("Provider must be SWIFT");
  }
  if (!SAFE_TEXT.test(input.recipientName || "")) {
    throw new Error("Invalid recipient name");
  }
  if (!SAFE_TEXT.test(input.recipientAccount || "")) {
    throw new Error("Invalid recipient account");
  }
  if (!SAFE_TEXT.test(input.recipientSwift || "")) {
    throw new Error("Invalid recipient SWIFT code");
  }
}

// --- MongoDB operations ---

export async function addPayment(data: {
  userId: string;
  amount: number;
  currency: string;
  provider: "SWIFT";
  recipientName: string;
  recipientAccount: string;
  recipientSwift: string;
}) {
  validatePaymentInput(data);
  const payment = new PaymentModel(data);
  await payment.save();
  return payment;
}

export async function getPayment(id: string) {
  const payment = await PaymentModel.findById(id);
  if (!payment) throw new Error("Payment not found");
  return payment;
}

export async function getUserPayments(userId: string) {
  return await PaymentModel.find({ userId });
}

export async function sendPaymentSwift(id: string, userId: string) {
  const payment = await PaymentModel.findById(id);
  if (!payment) throw new Error("Payment not found");
  if (payment.userId.toString() !== userId.toString())
    throw new Error("Forbidden");
  if (payment.provider !== "SWIFT") throw new Error("Unsupported provider");

  const reference = `SWIFT-${payment._id}-${Date.now()}`;
  return {
    id: payment._id,
    provider: payment.provider,
    status: "sent" as const,
    reference,
    sentAt: new Date(),
  };
}
