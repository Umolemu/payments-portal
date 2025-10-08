import { Navbar } from "@/components/ui/navigation";
import { Transactions } from "../../components/ui/transactions/Transactions";

export function EmployeePage() {
  return (
    <div className="pt-16 min-h-screen">
      <Navbar />
      <div className="container mx-auto px-4 py-10">
        <header className="mb-8">
          <h1 className="text-3xl font-serif tracking-tight">
            Employee Portal
          </h1>
          <p className="text-muted-foreground mt-2 text-sm">
            Review and send transactions to SWIFT
          </p>
        </header>
        <div className="flex justify-center">
          <div className="w-full max-w-5xl">
            <Transactions />
          </div>
        </div>
      </div>
    </div>
  );
}
