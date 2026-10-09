"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, TrendingUp, BarChart3, User } from "lucide-react";

const navItems = [
  { href: "/today", label: "Today", icon: Home },
  { href: "/leaderboard", label: "Leaderboard", icon: TrendingUp },
  { href: "/progress", label: "Progress", icon: BarChart3 },
  { href: "/profile", label: "Profile", icon: User },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 border-t border-white/12 bg-[#0B0F17]/95 backdrop-blur-md"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="flex items-center justify-around px-2 py-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex flex-col items-center justify-center gap-1 min-w-[60px] min-h-[56px] rounded-lg px-3 py-2 transition-colors duration-200"
              style={{
                color: isActive ? "#8B7BE3" : "rgba(255,255,255,0.45)",
              }}
            >
              <Icon className="h-5 w-5" strokeWidth={1.5} />
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
