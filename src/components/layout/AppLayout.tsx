import type { ReactNode } from "react";
import { Header } from "./Header";
import { BottomNav } from "./BottomNav";
import { Sidebar } from "./Sidebar";

export function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col md:pl-56">
      <Sidebar />
      <Header />
      <main className="flex-1 safe-bottom md:!pb-10">{children}</main>
      <BottomNav />
    </div>
  );
}
