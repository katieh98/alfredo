import type { Metadata } from "next";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { BoostPanel } from "@/components/dashboard/BoostPanel";

export const metadata: Metadata = {
  title: "Alfredo · Boost panel",
  description:
    "Promote your restaurant on Alfredo. Move up the candidate list, waive booking fees, and choose a billing cadence.",
};

export default function BoostPage() {
  return (
    <div className="flex h-screen w-full gap-3 overflow-hidden bg-[var(--color-bg-alt)] p-3">
      <Sidebar activePage="boost" />
      <BoostPanel />
    </div>
  );
}
