/** One capability, stated at the top and demonstrated at the bottom. The demo sits in its own band so the four cards share a baseline however long their copy runs. */
export const Card = ({
  children,
  note,
  title,
}: {
  children: React.ReactNode;
  note: React.ReactNode;
  title: string;
}) => (
  <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-surface transition hover:border-line-strong">
    <div className="p-5">
      <h3 className="text-[15px] font-semibold text-ink">{title}</h3>
      <p className="mt-2 text-[13.5px] leading-relaxed text-dim">{note}</p>
    </div>
    <div className="mt-auto border-t border-line bg-elevated/60 p-5">{children}</div>
  </div>
);

/** Identifiers inside a translated sentence are marked up as `<c>` in the JSON; this is the element they become. */
export const INLINE_CODE = { c: <code /> };
