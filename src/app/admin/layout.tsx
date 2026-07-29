import type { Metadata } from "next";
import Link from "next/link";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { isServiceRoleConfigured } from "@/lib/supabase/admin";
import {
  authConfigProblem,
  getAdminSession,
  isAuthConfigured,
} from "@/lib/auth";
import { RESOURCES } from "@/lib/admin/resources";
import { signOut } from "@/lib/admin/actions";
import { SetupNotice } from "@/components/admin/SetupNotice";
import { AdminNav } from "@/components/admin/AdminNav";

export const metadata: Metadata = {
  title: "Admin | A.O.A",
  // Belt and braces alongside the proxy guard: never let this be indexed.
  robots: { index: false, follow: false },
};

export default async function AdminLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  // Not fully configured: name exactly what is missing rather than showing a
  // login box that could never succeed.
  if (!isServiceRoleConfigured || !isAuthConfigured()) {
    const missing: string[] = [];
    if (!isSupabaseConfigured) {
      missing.push("NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY");
    } else if (!isServiceRoleConfigured) {
      missing.push("SUPABASE_SERVICE_ROLE_KEY");
    }
    const authProblem = authConfigProblem();
    if (authProblem) missing.push(authProblem);

    return (
      <div className="min-h-screen bg-bg">
        <SetupNotice missing={missing} />
      </div>
    );
  }

  const admin = await getAdminSession();

  // The login page renders inside this layout, so it cannot require a user.
  // Everything else does, and checks for itself.
  if (!admin) {
    return <div className="min-h-screen bg-bg">{children}</div>;
  }

  return (
    <div className="min-h-screen bg-bg">
      <header className="border-b-2 border-text">
        <div className="mx-auto flex max-w-[1400px] flex-wrap items-center gap-x-6 gap-y-3 px-[clamp(16px,3vw,32px)] py-4">
          <Link
            href="/admin"
            className="flex items-baseline gap-2.5 text-text no-underline hover:text-text"
          >
            <span className="font-heading text-[18px] font-semibold tracking-[0.06em]">
              A.O.A
            </span>
            <span className="text-[10.5px] tracking-[0.16em] text-accent-700 uppercase">
              Admin
            </span>
          </Link>

          <div className="ml-auto flex flex-wrap items-center gap-x-4 gap-y-2">
            <Link
              href="/"
              className="text-[13.5px] text-ink-70 no-underline hover:text-accent-700"
            >
              View site ↗
            </Link>
            <span className="hidden text-[13px] text-ink-55 sm:inline">
              {admin.email}
            </span>
            <form action={signOut}>
              <button
                type="submit"
                className="btn btn-secondary px-4 py-1.5 text-[13.5px]"
              >
                Sign out
              </button>
            </form>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-[1400px] gap-x-10 gap-y-6 px-[clamp(16px,3vw,32px)] py-8 lg:grid-cols-[220px_1fr]">
        <AdminNav resources={RESOURCES} />
        <main className="min-w-0">{children}</main>
      </div>
    </div>
  );
}
