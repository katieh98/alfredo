import type { Metadata } from "next";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { GuestsPanel } from "@/components/dashboard/GuestsPanel";

export const metadata: Metadata = {
  title: "Alfredo · Guestbook",
  description: "Every guest who has booked with your restaurant.",
};

export default function GuestsPage() {
  return (
    <div className="flex h-screen w-full gap-3 overflow-hidden bg-[var(--color-bg-alt)] p-3">
      <Sidebar activePage="guests" />
      <GuestsPanel />
    </div>
  );
}
