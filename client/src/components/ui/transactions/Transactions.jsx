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

export function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [sendingId, setSendingId] = useState(null);

  useEffect(() => {
    // Load transactions from localStorage
    const stored = localStorage.getItem("transactions");
    if (stored) {
      setTransactions(JSON.parse(stored));
    }
  }, []);

  const handleSendToSwift = async (id) => {
    setSendingId(id);

    // Simulate SWIFT API call
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Update transaction status
    const updatedTransactions = transactions.map((t) =>
      t.id === id ? { ...t, status: "sent" } : t
    );

    setTransactions(updatedTransactions);
    localStorage.setItem("transactions", JSON.stringify(updatedTransactions));
    setSendingId(null);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "sent":
        return "bg-green-100 text-green-800 border-green-200";
      case "failed":
        return "bg-red-100 text-red-800 border-red-200";
    }
  };

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
      {transactions.map((transaction) => (
        <Card key={transaction.id} className="shadow-lg border-border/50">
          <CardHeader className="pb-4">
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-xl font-serif tracking-tight text-balance">
                  {transaction.beneficiaryName}
                </CardTitle>
                <CardDescription className="text-sm text-muted-foreground mt-1">
                  {new Date(transaction.createdAt).toLocaleString()}
                </CardDescription>
              </div>
              <Badge
                variant="outline"
                className={getStatusColor(transaction.status)}
              >
                {transaction.status.toUpperCase()}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground mb-1">SWIFT/BIC</p>
                <p className="font-medium text-foreground">
                  {transaction.swiftBic}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground mb-1">IBAN</p>
                <p className="font-medium text-foreground font-mono text-xs">
                  {transaction.iban}
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
                  {transaction.reference}
                </p>
              </div>
            </div>

            {transaction.status === "pending" && (
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
                <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-center">
                  <p className="text-sm font-medium text-green-800">
                    Successfully sent to SWIFT network
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
