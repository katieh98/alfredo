import type { Metadata } from "next";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { ReportsPanel } from "@/components/dashboard/ReportsPanel";

export const metadata: Metadata = {
  title: "Alfredo · Reports",
  description: "Covers, fill rate, and source mix for your restaurant.",
};

export default function ReportsPage() {
  return (
    <div className="flex h-screen w-full gap-3 overflow-hidden bg-[var(--color-bg-alt)] p-3">
      <Sidebar activePage="reports" />
      <ReportsPanel />
    </div>
  );
}
