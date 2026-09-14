import { Fragment, useEffect, useRef, useState } from "react";

import { type IconEntry } from "../registry";
import { useStore } from "../store";
import { featuredMark } from "./featured";

/** The spacing lives on the tile rather than as a `gap` on the track, so each half of the loop measures exactly N × (tile + gap). A gap between the two halves would make -50% land half a gap short of the seam. */
const Tile = ({ entry }: { entry: IconEntry }) => {
  const Icon = featuredMark(entry);
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
 * How many times the row has to appear in each half of the loop.
 *
 * The animation travels exactly -50%, so one half must be at least as wide as the viewport — otherwise the end of the row clears the right edge before the duplicate arrives and the track shows a gap once per cycle. Twenty-six tiles measure about 2030px, which is fine on a laptop and visibly broken on a 2560px monitor, so the count is measured rather than guessed. Copies are only ever added: dividing by the current count gives the width of a single copy, which does not move as the total grows.
 */
const useCopies = (ref: React.RefObject<HTMLSpanElement | null>) => {
  const [copies, setCopies] = useState(1);

  useEffect(() => {
    const update = () =>
      setCopies((current) => {
        const half = ref.current?.offsetWidth ?? 0;
        if (!half) return current;
        return Math.max(current, Math.ceil(window.innerWidth / (half / current)));
      });

    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [ref]);

  return copies;
};

/**
 * One track of brands sliding past. Each half of the track holds the same tiles, and the animation travels exactly half the track, so the loop lands on an identical frame instead of snapping back. The second half is hidden from assistive technology — it is the same brands again, and a screen reader should hear each one once.
 */
export const Marquee = ({
  duration,
  reverse = false,
  row,
}: {
  duration: number;
  reverse?: boolean;
  row: IconEntry[];
}) => {
  const half = useRef<HTMLSpanElement>(null);
  const copies = useCopies(half);
  const tiles = Array.from({ length: copies }, (_, copy) => (
    <Fragment key={copy}>
      {row.map((entry) => (
        <Tile entry={entry} key={entry.id} />
      ))}
    </Fragment>
  ));

  return (
    <div className="group edge-fade overflow-hidden py-2">
      <div
        className="flex w-max animate-marquee group-hover:[animation-play-state:paused]"
        style={{
          animationDirection: reverse ? "reverse" : "normal",
          // Scaled by the copy count: the animation covers half the track whatever its length, so a wider track has to take proportionally longer to travel at the same speed.
          ["--marquee-duration" as string]: `${duration * copies}s`,
        }}
      >
        <span className="flex" ref={half}>
          {tiles}
        </span>
        <span aria-hidden className="flex">
          {tiles}
        </span>
      </div>
    </div>
  );
};
