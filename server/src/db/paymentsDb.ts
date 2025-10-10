import type { Payment } from "../types/payment.ts";

export const payments: Payment[] = [];
let nextId = 1;

export function createPayment(paymentData: Omit<Payment, "id" | "createdAt">): Payment {
  const payment: Payment = {
    id: nextId++,
    ...paymentData,
    createdAt: new Date(),
  };
  payments.push(payment);
  return payment;
}

export function findPaymentById(id: number): Payment | undefined {
  return payments.find(p => p.id === id);
}

export function resetPayments() {
  payments.splice(0, payments.length);
  nextId = 1;
}
