"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getPayments, sendPaymentSwift } from "@/api";

export function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [sendingId, setSendingId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadTransactions();
  }, []);

  const loadTransactions = async () => {
    try {
      setIsLoading(true);
      const payments = await getPayments();
      setTransactions(payments);
      setError("");
    } catch (err) {
      console.error("Failed to load payments:", err);
      setError(err.message || "Failed to load payments");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendToSwift = async (id) => {
    setSendingId(id);
    setError("");

    try {
      const result = await sendPaymentSwift(id);
      console.log("Payment sent:", result);
      
      // Update transaction status in local state
      setTransactions((prev) =>
        prev.map((t) =>
          t.id === id ? { ...t, status: "sent", sentAt: result.sentAt } : t
        )
      );
    } catch (err) {
      console.error("Failed to send payment:", err);
      setError(err.message || "Failed to send payment");
    } finally {
      setSendingId(null);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "sent":
        return "bg-green-100 text-green-800 border-green-200";
      case "failed":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  if (isLoading) {
    return (
      <Card className="shadow-lg border-border/50">
        <CardContent className="py-12">
          <div className="text-center">
            <p className="text-muted-foreground text-lg">
              Loading transactions...
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="shadow-lg border-border/50">
        <CardContent className="py-12">
          <div className="text-center">
            <p className="text-red-600 text-lg mb-2">Error loading transactions</p>
            <p className="text-sm text-muted-foreground">{error}</p>
            <Button onClick={loadTransactions} className="mt-4">
              Retry
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (transactions.length === 0) {
    return (
      <Card className="shadow-lg border-border/50">
        <CardContent className="py-12">
          <div className="text-center">
            <p className="text-muted-foreground text-lg">
              No transactions to review
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Transactions created in the Dashboard will appear here
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {error && (
        <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
          {error}
        </div>
      )}
      {transactions.map((transaction) => (
        <Card key={transaction.id} className="shadow-lg border-border/50">
          <CardHeader className="pb-4">
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-xl font-serif tracking-tight text-balance">
                  {transaction.recipientName}
                </CardTitle>
                <CardDescription className="text-sm text-muted-foreground mt-1">
                  Created: {new Date(transaction.createdAt).toLocaleString()}
                </CardDescription>
              </div>
              <Badge
                variant="outline"
                className={getStatusColor(transaction.status || "pending")}
              >
                {(transaction.status || "PENDING").toUpperCase()}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground mb-1">SWIFT/BIC</p>
                <p className="font-medium text-foreground">
                  {transaction.recipientSwift}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground mb-1">IBAN</p>
                <p className="font-medium text-foreground font-mono text-xs">
                  {transaction.recipientAccount}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground mb-1">Amount</p>
                <p className="font-medium text-foreground text-lg">
                  {transaction.amount} {transaction.currency}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground mb-1">Reference</p>
                <p className="font-medium text-foreground">
                  {transaction.reference || "N/A"}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground mb-1">Payment ID</p>
                <p className="font-medium text-foreground">
                  #{transaction.id}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground mb-1">Provider</p>
                <p className="font-medium text-foreground">
                  {transaction.provider}
                </p>
              </div>
            </div>

            {(!transaction.status || transaction.status === "pending") && (
              <div className="pt-2">
                <Button
                  onClick={() => handleSendToSwift(transaction.id)}
                  disabled={sendingId === transaction.id}
                  className="w-full h-11 text-base font-medium"
                >
                  {sendingId === transaction.id
                    ? "Sending to SWIFT..."
                    : "Send to SWIFT"}
                </Button>
              </div>
            )}

            {transaction.status === "sent" && (
              <div className="pt-2">
                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                  <p className="text-sm font-medium text-green-800 text-center">
                    ✓ Successfully sent to SWIFT network
                  </p>
                  {transaction.sentAt && (
                    <p className="text-xs text-green-600 text-center mt-1">
                      Sent: {new Date(transaction.sentAt).toLocaleString()}
                    </p>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
