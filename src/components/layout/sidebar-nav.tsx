"use client";

import { Users } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";

const NAV_ITEMS = [{ href: "/", label: "Employees", icon: Users }];

export function SidebarNav() {
  const pathname = usePathname();

  return (
    <nav aria-label="Main" className="mt-10 space-y-1">
      {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
        const active = pathname === href;
        return (
          <Link
            key={href}
            href={href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-colors",
              active
                ? "bg-primary-light text-primary"
                : "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
            )}
          >
            <Icon aria-hidden="true" className="size-5" />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
