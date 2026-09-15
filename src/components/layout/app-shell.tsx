import type { ReactNode } from "react";
import { BrandLogo } from "./brand-logo";
import { SidebarNav } from "./sidebar-nav";

/** Sidebar layout on large screens; a compact top bar on small screens. */
export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-full flex-1">
      <aside className="hidden w-72 shrink-0 flex-col border-r border-slate-200/70 bg-white/60 px-5 py-7 lg:flex">
        <div className="px-3">
          <BrandLogo />
        </div>
        <SidebarNav />
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="border-b border-slate-200/70 bg-white px-4 py-3 lg:hidden">
          <BrandLogo />
        </header>
        {children}
      </div>
    </div>
  );
}
