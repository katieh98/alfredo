import type { Metadata } from "next";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { UpcomingPanel } from "@/components/dashboard/UpcomingPanel";

export const metadata: Metadata = {
  title: "Alfredo · Upcoming",
  description: "Future reservations, grouped by day.",
};

export default function UpcomingPage() {
  return (
    <div className="flex h-screen w-full gap-3 overflow-hidden bg-[var(--color-bg-alt)] p-3">
      <Sidebar activePage="upcoming" />
      <UpcomingPanel />
    </div>
  );
}
