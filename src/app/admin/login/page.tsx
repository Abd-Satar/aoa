import { LoginForm } from "@/components/admin/LoginForm";

export default function LoginPage() {
  return (
    <div className="mx-auto flex min-h-screen max-w-[440px] flex-col justify-center px-6 py-16">
      <span className="mb-3 block text-[13px] tracking-[0.08em] text-ink-70 uppercase">
        A.O.A Admin
      </span>
      <h1 className="m-0 font-heading text-[clamp(28px,4vw,38px)] leading-[1.1] font-semibold tracking-[-0.024em]">
        Sign in.
      </h1>
      <p className="mt-4 mb-8 text-[15.5px] leading-7 text-ink-78">
        For the academy&rsquo;s own staff. Everything you change here appears on
        the public site straight away.
      </p>
      <LoginForm />
    </div>
  );
}
