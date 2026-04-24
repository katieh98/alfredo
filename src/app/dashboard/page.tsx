import type { Metadata } from "next";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { SessionBody } from "@/components/dashboard/SessionBody";
import { restaurants, session } from "./_data";

export const metadata: Metadata = {
  title: `Alfredo · ${session.title}`,
  description:
    "Inside Alfredo's decision: which restaurants the agent considered, how it scored them, and why it picked the one it did.",
};

export default function DashboardPage() {
  return (
    <div className="flex h-screen w-full gap-3 overflow-hidden bg-[var(--color-bg-alt)] p-3">
      <Sidebar activePage="tonight" />
      <SessionBody restaurants={restaurants} session={session} />
    </div>
  );
}
