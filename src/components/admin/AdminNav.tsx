"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Resource } from "@/lib/admin/resources";

export function AdminNav({ resources }: { resources: Resource[] }) {
  const pathname = usePathname();

  const item = (href: string, label: string, exact = false) => {
    const active = exact ? pathname === href : pathname.startsWith(href);
    return (
      <Link
        key={href}
        href={href}
        aria-current={active ? "page" : undefined}
        className={`block rounded-md px-3 py-2 text-[14.5px] no-underline transition-colors ${
          active
            ? "bg-surface font-semibold text-accent-700"
            : "text-ink-78 hover:bg-fill hover:text-text"
        }`}
      >
        {label}
      </Link>
    );
  };

  return (
    <nav className="flex flex-row flex-wrap gap-1 lg:sticky lg:top-6 lg:h-fit lg:flex-col">
      {item("/admin", "Overview", true)}
      {item("/admin/registrations", "Registrations")}
      {item("/admin/counselling", "Counselling")}
      {item("/admin/enquiries", "Enquiries")}
      {resources.map((r) => item(`/admin/${r.key}`, r.label))}
      {item("/admin/settings", "Site details")}
    </nav>
  );
}
