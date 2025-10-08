import { Navbar } from "../../components/ui/navigation";
import { Dashboard } from "./DasboardPage";

export function DashboardLayout() {
  return (
    <div className="pt-16 min-h-screen">
      <Navbar />
      <main className="container mx-auto px-4 py-10 flex justify-center">
        <Dashboard />
      </main>
    </div>
  );
}
