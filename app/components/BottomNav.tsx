import type React from "react";

type BottomNavItem = {
  href: string;
  label: string;
  icon: React.ReactNode;
};

export default function BottomNav({
  items,
}: {
  items?: BottomNavItem[];
}) {
  const navItems: BottomNavItem[] =
    items ??
    [
      {
        href: "#",
        label: "หน้าแรก",
        icon: (
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
            />
          </svg>
        ),
      },
      {
        href: "#",
        label: "ฟีเจอร์",
        icon: (
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 10V3L4 14h7v7l9-11h-7z"
            />
          </svg>
        ),
      },
      {
        href: "#",
        label: "เกี่ยวกับ",
        icon: (
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        ),
      },
    ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 p-4">
      <div className="mx-auto grid h-16 w-full max-w-md grid-cols-3 rounded-2xl shadow-lg">
        {navItems.map((item) => (
          <a
            key={`${item.href}-${item.label}`}
            href={item.href}
            className="flex flex-col items-center justify-center gap-1 text-slate-600 transition hover:text-slate-900"
          >
            {item.icon}
          </a>
        ))}
      </div>
    </nav>
  );
}
