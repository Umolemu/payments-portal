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
import { createPayment } from "@/api";

export function Dashboard() {
  const [formData, setFormData] = useState({
    recipientName: "",
    recipientSwift: "",
    recipientAccount: "",
    amount: "",
    currency: "",
    reference: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Basic validation (currency must be selected)
    if (!formData.currency) {
      setError("Please select a currency");
      return;
    }

    setIsLoading(true);

    try {
      const paymentData = {
        recipientName: formData.recipientName,
        recipientSwift: formData.recipientSwift.toUpperCase(),
        recipientAccount: formData.recipientAccount.toUpperCase(),
        amount: parseFloat(formData.amount),
        currency: formData.currency,
        reference: formData.reference,
      };

      const response = await createPayment(paymentData);
      console.log("Payment created:", response);
      
      setSuccess(`Payment #${response.id} created successfully!`);
      
      // Reset form
      setFormData({
        recipientName: "",
        recipientSwift: "",
        recipientAccount: "",
        amount: "",
        currency: "",
        reference: "",
      });

      // Navigate to employee/transactions review page after a short delay
      setTimeout(() => {
        navigate("/employee");
      }, 1500);
    } catch (err) {
      console.error("Payment error:", err);
      setError(err.message || "Failed to create payment. Please check your input.");
    } finally {
      setIsLoading(false);
    }
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
          {error && (
            <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
              {error}
            </div>
          )}
          {success && (
            <div className="p-3 text-sm text-green-600 bg-green-50 border border-green-200 rounded-md">
              {success}
            </div>
          )}
          <div className="space-y-2">
            <Label
              htmlFor="recipientName"
              className="text-sm font-medium text-foreground"
            >
              Beneficiary Name
            </Label>
            <Input
              id="recipientName"
              type="text"
              placeholder="Enter beneficiary name"
              value={formData.recipientName}
              onChange={(e) => handleChange("recipientName", e.target.value)}
              required
              className="h-11 bg-background border-input"
            />
            <p className="text-xs text-muted-foreground">
              Letters, spaces, periods, commas, apostrophes, and hyphens only.
            </p>
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="recipientSwift"
              className="text-sm font-medium text-foreground"
            >
              Beneficiary Bank SWIFT/BIC
            </Label>
            <Input
              id="recipientSwift"
              type="text"
              placeholder="e.g., DEUTDEFF"
              value={formData.recipientSwift}
              onChange={(e) => handleChange("recipientSwift", e.target.value.toUpperCase())}
              required
              maxLength={11}
              className="h-11 bg-background border-input"
            />
            <p className="text-xs text-muted-foreground">
              8 or 11 characters. Example: DEUTDEFF or DEUTDEFFXXX
            </p>
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="recipientAccount"
              className="text-sm font-medium text-foreground"
            >
              Beneficiary Account (IBAN)
            </Label>
            <Input
              id="recipientAccount"
              type="text"
              placeholder="e.g., DE89370400440532013000"
              value={formData.recipientAccount}
              onChange={(e) => handleChange("recipientAccount", e.target.value.toUpperCase())}
              required
              maxLength={34}
              className="h-11 bg-background border-input"
            />
            <p className="text-xs text-muted-foreground">
              2 letter country code + 2 digits + up to 30 alphanumeric characters.
            </p>
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
              <p className="text-xs text-muted-foreground">
                Minimum: 0.01
              </p>
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
            <p className="text-xs text-muted-foreground">
              Letters, numbers, spaces, and common punctuation. Max 100 characters.
            </p>
          </div>

          <Button 
            type="submit" 
            className="w-full h-11 text-base font-medium"
            disabled={isLoading}
          >
            {isLoading ? "Creating Payment..." : "Submit Payment"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
