"use client";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function Dashboard() {
  const [formData, setFormData] = useState({
    beneficiaryName: "",
    swiftBic: "",
    iban: "",
    amount: "",
    currency: "",
    reference: "",
  });
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Basic validation (currency must be selected)
    if (!formData.currency) {
      alert("Please select a currency");
      return;
    }
    const newTransaction = {
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      status: "pending",
      ...formData,
    };
    const existingRaw = localStorage.getItem("transactions");
    const existing = existingRaw ? JSON.parse(existingRaw) : [];
    const updated = [newTransaction, ...existing];
    localStorage.setItem("transactions", JSON.stringify(updated));
    console.log("Payment submission saved:", newTransaction);
    // Optionally reset form
    setFormData({
      beneficiaryName: "",
      swiftBic: "",
      iban: "",
      amount: "",
      currency: "",
      reference: "",
    });
    // Navigate to employee/transactions review page
    navigate("/employee");
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Card className="shadow-lg border-border/50">
      <CardHeader className="space-y-3 pb-6">
        <CardTitle className="text-2xl font-serif tracking-tight text-balance">
          Create New International Payment
        </CardTitle>
        <CardDescription className="text-base text-muted-foreground">
          Enter the payment details to process an international transfer
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label
              htmlFor="beneficiaryName"
              className="text-sm font-medium text-foreground"
            >
              Beneficiary Name
            </Label>
            <Input
              id="beneficiaryName"
              type="text"
              placeholder="Enter beneficiary name"
              value={formData.beneficiaryName}
              onChange={(e) => handleChange("beneficiaryName", e.target.value)}
              required
              className="h-11 bg-background border-input"
            />
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="swiftBic"
              className="text-sm font-medium text-foreground"
            >
              Beneficiary Bank SWIFT/BIC
            </Label>
            <Input
              id="swiftBic"
              type="text"
              placeholder="e.g., DEUTDEFF"
              value={formData.swiftBic}
              onChange={(e) => handleChange("swiftBic", e.target.value)}
              required
              className="h-11 bg-background border-input"
            />
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="iban"
              className="text-sm font-medium text-foreground"
            >
              Beneficiary Account (IBAN)
            </Label>
            <Input
              id="iban"
              type="text"
              placeholder="e.g., DE89370400440532013000"
              value={formData.iban}
              onChange={(e) => handleChange("iban", e.target.value)}
              required
              className="h-11 bg-background border-input"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label
                htmlFor="amount"
                className="text-sm font-medium text-foreground"
              >
                Amount
              </Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={formData.amount}
                onChange={(e) => handleChange("amount", e.target.value)}
                required
                className="h-11 bg-background border-input"
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="currency"
                className="text-sm font-medium text-foreground"
              >
                Currency
              </Label>
              <Select
                value={formData.currency}
                onValueChange={(value) => handleChange("currency", value)}
                required
              >
                <SelectTrigger
                  id="currency"
                  className="h-11 bg-background border-input"
                >
                  <SelectValue placeholder="Select currency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USD">USD - US Dollar</SelectItem>
                  <SelectItem value="EUR">EUR - Euro</SelectItem>
                  <SelectItem value="GBP">GBP - British Pound</SelectItem>
                  <SelectItem value="JPY">JPY - Japanese Yen</SelectItem>
                  <SelectItem value="CHF">CHF - Swiss Franc</SelectItem>
                  <SelectItem value="CAD">CAD - Canadian Dollar</SelectItem>
                  <SelectItem value="AUD">AUD - Australian Dollar</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="reference"
              className="text-sm font-medium text-foreground"
            >
              Payment Reference
            </Label>
            <Input
              id="reference"
              type="text"
              placeholder="Enter payment reference or description"
              value={formData.reference}
              onChange={(e) => handleChange("reference", e.target.value)}
              required
              className="h-11 bg-background border-input"
            />
          </div>

          <Button type="submit" className="w-full h-11 text-base font-medium">
            Submit Payment
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
