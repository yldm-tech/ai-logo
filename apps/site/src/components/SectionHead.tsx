/**
 * A heading and its standfirst.
 *
 * The measure matters more than it looks. Running text wants 65-75 Latin characters a line, which is roughly 42rem — but in a 72rem section with nothing beside it, a paragraph that stops two-fifths short reads as a line break nobody asked for rather than as a measure. `split` is the answer where there is nothing else on the row: title on the left, standfirst on the right, both filling the width. `center` is for a head that introduces a grid below it.
 */
export const SectionHead = ({
  center = false,
  eyebrow,
  split = false,
  sub,
  title,
}: {
  center?: boolean;
  eyebrow: string;
  split?: boolean;
  sub?: React.ReactNode;
  title: string;
}) => {
  const label = (
    <p className="font-mono text-[11px] tracking-[0.18em] text-accent uppercase">{eyebrow}</p>
  );

  const heading = (
    <h2 className="text-balance-tight mt-3 text-[clamp(1.6rem,3.4vw,2.1rem)] leading-tight font-semibold text-ink">
      {title}
    </h2>
  );

  const standfirst = sub && <p className="text-[14.5px] leading-relaxed text-dim">{sub}</p>;

  if (split) {
    return (
      <div className="grid gap-x-12 gap-y-4 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:items-end">
        <div>
          {label}
          {heading}
        </div>
        {standfirst}
      </div>
    );
  }

  return (
    <div className={center ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}>
      {label}
      {heading}
      {standfirst && <div className="mt-3">{standfirst}</div>}
    </div>
  );
};
