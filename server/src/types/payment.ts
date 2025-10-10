export interface Payment {
  id: number;
  userId: number;
  amount: number;
  currency: string;
  provider: "SWIFT";
  recipientName: string;
  recipientAccount: string;
  recipientSwift: string;
  createdAt: Date;
}
