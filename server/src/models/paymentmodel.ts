import mongoose, { Schema, Document, Types } from "mongoose";

export interface IPayment extends Document {
  userId: Types.ObjectId; // Reference to User document
  amount: number;
  currency: string;
  provider: "SWIFT";
  recipientName: string;
  recipientAccount: string;
  recipientSwift: string;
  createdAt: Date;
}

const PaymentSchema = new Schema<IPayment>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    amount: { type: Number, required: true },
    currency: { type: String, required: true },
    provider: {
      type: String,
      enum: ["SWIFT"],
      required: true,
    },
    recipientName: { type: String, required: true },
    recipientAccount: { type: String, required: true },
    recipientSwift: { type: String, required: true },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

export const PaymentModel = mongoose.model<IPayment>(
  "Payment",
  PaymentSchema
);
