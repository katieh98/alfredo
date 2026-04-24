import type { Metadata } from "next";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { SettingsPanel } from "@/components/dashboard/SettingsPanel";

export const metadata: Metadata = {
  title: "Alfredo · Settings",
  description: "Restaurant profile, notifications, and booking preferences.",
};

export default function SettingsPage() {
  return (
    <div className="flex h-screen w-full gap-3 overflow-hidden bg-[var(--color-bg-alt)] p-3">
      <Sidebar activePage="settings" />
      <SettingsPanel />
    </div>
  );
}
