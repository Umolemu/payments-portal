import { createPayment, findPaymentById, findPaymentsByUserId } from "../db/paymentsDb.js";
import type { Payment } from "../types/payment.js";

//regex whitelist (etters, numbers, some punctuation)
const SAFE_TEXT = /^[a-zA-Z0-9\s.,'-]{1,100}$/;

export function validatePaymentInput(input: Partial<Payment>) {
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

export function addPayment(data: Omit<Payment, "id" | "createdAt">) {
  validatePaymentInput(data);
  return createPayment(data);
}

export function getPayment(id: number) {
  const payment = findPaymentById(id);
  if (!payment) throw new Error("Payment not found");
  return payment;
}

export function getUserPayments(userId: number) {
  return findPaymentsByUserId(userId);
}

export function sendPaymentSwift(id: number, userId: number) {
  const payment = findPaymentById(id);
  if (!payment) throw new Error("Payment not found");
  if (payment.userId !== userId) throw new Error("Forbidden");
  if (payment.provider !== "SWIFT") throw new Error("Unsupported provider");

  const reference = `SWIFT-${payment.id}-${Date.now()}`;
  return {
    id: payment.id,
    provider: payment.provider,
    status: "sent" as const,
    reference,
    sentAt: new Date(),
  };
}
