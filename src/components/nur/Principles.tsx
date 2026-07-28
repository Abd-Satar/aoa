import {
  CalendarCheck,
  LinkSimple,
  UsersThree,
} from "@phosphor-icons/react/ssr";
import { Reveal } from "./Reveal";
import { principles } from "@/lib/nur-content";

const icons = {
  link: LinkSimple,
  users: UsersThree,
  calendar: CalendarCheck,
};

export function Principles() {
  return (
    <section className="mx-auto max-w-[1200px] px-[clamp(20px,5vw,72px)] pt-[clamp(52px,8vw,92px)]">
      <Reveal>
        <span className="mb-[14px] block text-[13px] tracking-[0.08em] text-ink-70 uppercase">
          What makes an A.O.A class
        </span>
        <div className="grid gap-x-[clamp(28px,4vw,64px)] gap-y-[28px] sm:gap-y-[42px] [grid-template-columns:repeat(auto-fit,minmax(260px,1fr))]">
          {principles.map((item) => {
            const Icon = icons[item.icon];
            return (
              <div key={item.title}>
                <Icon size={26} weight="duotone" className="text-accent" />
                <h3 className="mt-3 mb-0 text-2xl leading-7">{item.title}</h3>
                <p className="mt-[14px] mb-0 text-[15.5px] leading-7 text-ink-78 sm:text-justify sm:hyphens-auto">
                  {item.body}
                </p>
              </div>
            );
          })}
        </div>
      </Reveal>
    </section>
  );
}
