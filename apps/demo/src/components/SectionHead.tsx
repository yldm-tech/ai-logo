export const SectionHead = ({
  center = false,
  eyebrow,
  sub,
  title,
}: {
  center?: boolean;
  eyebrow: string;
  sub?: React.ReactNode;
  title: string;
}) => (
  <div className={center ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}>
    <p className="font-mono text-[11px] tracking-[0.18em] text-accent uppercase">{eyebrow}</p>
    <h2 className="text-balance-tight mt-3 text-[clamp(1.6rem,3.4vw,2.1rem)] leading-tight font-semibold text-ink">
      {title}
    </h2>
    {sub && <p className="mt-3 text-[14.5px] leading-relaxed text-dim">{sub}</p>}
  </div>
);
