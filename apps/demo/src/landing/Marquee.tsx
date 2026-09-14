import { type IconEntry, preferredIcon } from "../registry";
import { useStore } from "../store";

/** The spacing lives on the tile rather than as a `gap` on the track, so each half of the loop measures exactly N × (tile + gap). A gap between the two halves would make -50% land half a gap short of the seam. */
const Tile = ({ entry }: { entry: IconEntry }) => {
  const Icon = preferredIcon(entry);
  const select = useStore((state) => state.select);
  const setView = useStore((state) => state.setView);
  if (!Icon) return null;

  return (
    <button
      aria-label={entry.fullTitle || entry.id}
      className="group/tile me-3 grid size-[66px] flex-none cursor-pointer place-items-center rounded-2xl border border-line bg-surface text-ink shadow-[0_1px_2px_rgb(0_0_0/4%)] transition duration-200 hover:-translate-y-1 hover:border-accent/50 hover:shadow-[0_12px_28px_-12px_var(--accent)]"
      onClick={() => {
        select(entry.id);
        setView("icons");
      }}
      title={entry.fullTitle || entry.id}
      type="button"
    >
      <span className="transition-transform duration-200 group-hover/tile:scale-110">
        <Icon size={30} />
      </span>
    </button>
  );
};

/**
 * One track of brands sliding past. The row is rendered twice and the animation travels exactly half the track, so the loop lands on an identical frame instead of snapping back. The duplicate is hidden from assistive technology — it is the same brands a second time, and a screen reader should hear each one once.
 */
export const Marquee = ({
  duration,
  reverse = false,
  row,
}: {
  duration: number;
  reverse?: boolean;
  row: IconEntry[];
}) => (
  <div className="group edge-fade overflow-hidden py-2">
    <div
      className="flex w-max animate-marquee group-hover:[animation-play-state:paused]"
      style={{
        animationDirection: reverse ? "reverse" : "normal",
        ["--marquee-duration" as string]: `${duration}s`,
      }}
    >
      <span className="flex">
        {row.map((entry) => (
          <Tile entry={entry} key={entry.id} />
        ))}
      </span>
      <span aria-hidden className="flex">
        {row.map((entry) => (
          <Tile entry={entry} key={`${entry.id}-echo`} />
        ))}
      </span>
    </div>
  </div>
);
