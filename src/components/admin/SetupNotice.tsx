import Link from "next/link";

/**
 * Shown at /admin when Supabase is not connected yet.
 *
 * A misconfigured deploy should explain itself. Without this the admin would
 * either crash or render an empty shell, and neither tells you that two
 * environment variables are missing.
 */
export function SetupNotice({ missing = [] }: { missing?: string[] }) {
  const step =
    "grid grid-cols-[28px_1fr] gap-x-4 gap-y-1 border-t border-divider py-5";
  const num =
    "grid size-[26px] place-items-center rounded-full bg-accent text-[13px] font-semibold text-bg tabular-nums";

  return (
    <div className="mx-auto max-w-[820px] px-[clamp(20px,5vw,48px)] py-[clamp(48px,8vw,88px)]">
      <span className="mb-3 block text-[13px] tracking-[0.08em] text-ink-70 uppercase">
        Admin
      </span>
      <h1 className="m-0 max-w-[18ch] font-heading text-[clamp(30px,4.4vw,48px)] leading-[1.1] font-semibold tracking-[-0.026em]">
        Connect a database to switch this on.
      </h1>
      <p className="mt-6 mb-0 max-w-[56ch] text-[16.5px] leading-7 text-ink-82">
        The public site is running from the files in the repository, which is
        why it works without this. The admin needs somewhere to write to.
      </p>

      {missing.length > 0 && (
        <div className="mt-7 rounded-md border border-accent/40 bg-surface px-5 py-4">
          <p className="m-0 text-[14px] font-semibold">
            {missing.length === 1
              ? "One thing is missing:"
              : `${missing.length} things are missing:`}
          </p>
          <ul className="mt-2 mb-0 list-none p-0">
            {missing.map((m) => (
              <li
                key={m}
                className="flex items-baseline gap-2.5 py-1 text-[14.5px] leading-6"
              >
                <span aria-hidden="true" className="text-accent">
                  •
                </span>
                <code className="text-[13.5px]">{m}</code>
              </li>
            ))}
          </ul>
          <p className="mt-3 mb-0 text-[13.5px] leading-6 text-ink-70">
            Set these in <code>.env.local</code> and restart the dev server.
          </p>
        </div>
      )}

      <div className="mt-10">
        <div className={step}>
          <span className={num}>1</span>
          <div>
            <h2 className="m-0 text-[17px] leading-6">Create a Supabase project</h2>
            <p className="mt-1.5 mb-0 text-[15px] leading-6 text-ink-78">
              At{" "}
              <a href="https://supabase.com" target="_blank" rel="noopener">
                supabase.com
              </a>
              . The free tier is enough.
            </p>
          </div>
        </div>

        <div className={step}>
          <span className={num}>2</span>
          <div>
            <h2 className="m-0 text-[17px] leading-6">Run the schema</h2>
            <p className="mt-1.5 mb-0 text-[15px] leading-6 text-ink-78">
              Open <strong>SQL Editor → New query</strong>, paste in the whole
              of <code className="text-[13.5px]">supabase/schema.sql</code> from
              this repository, and run it. It creates the tables, the security
              rules and the starting values.
            </p>
          </div>
        </div>

        <div className={step}>
          <span className={num}>3</span>
          <div>
            <h2 className="m-0 text-[17px] leading-6">
              Fill in <code className="text-[14px]">.env.local</code>
            </h2>
            <p className="mt-1.5 mb-2 text-[15px] leading-6 text-ink-78">
              The two Supabase keys come from{" "}
              <strong>Project Settings → API</strong>. The last three are
              yours to choose. Restart the dev server afterwards, because
              Next.js only reads this file at startup.
            </p>
            <pre className="m-0 overflow-x-auto rounded-md border border-divider bg-surface p-4 text-[13px] leading-6">
              <code>{`NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGci...
ADMIN_EMAIL=you@example.com
ADMIN_PASSWORD=a-long-password
ADMIN_SECRET=at-least-32-random-characters`}</code>
            </pre>
            <p className="mt-2 mb-0 text-[14px] leading-6 text-ink-70">
              The bottom four have no <code>NEXT_PUBLIC_</code> prefix on
              purpose. Anything with that prefix is sent to the browser, and
              these must never leave the server.
            </p>
          </div>
        </div>

        <div className={step}>
          <span className={num}>4</span>
          <div>
            <h2 className="m-0 text-[17px] leading-6">Sign in</h2>
            <p className="mt-1.5 mb-0 text-[15px] leading-6 text-ink-78">
              Go to <code>/admin/login</code> and use the{" "}
              <code>ADMIN_EMAIL</code> and <code>ADMIN_PASSWORD</code> you just
              set. There is no user to create in Supabase and no{" "}
              <code>admins</code> row to add — the credentials are the
              environment, and the session is a signed cookie.
            </p>
          </div>
        </div>

        <hr className="m-0 h-0 border-0 border-t border-divider" />
      </div>

      <div className="mt-9 flex flex-wrap gap-3">
        <Link
          href="/"
          className="btn btn-secondary px-5 py-2.5 text-[15px] no-underline"
        >
          Back to the site
        </Link>
      </div>
    </div>
  );
}
