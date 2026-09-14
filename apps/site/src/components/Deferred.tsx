import { useInView } from "motion/react";
import { Suspense, useRef } from "react";

/**
 * Holds a block's height open and mounts its children only once the reader is within a screen of it.
 *
 * `React.lazy` on its own does not defer much here: a lazy component that is in the initial tree starts fetching on the first render, so the chunk still lands on the critical path. Pairing it with an intersection check is what actually keeps it off — a reader who never scrolls past the hero never downloads the card's dependencies, and one who does gets them a screenful early, before the placeholder is visible.
 */
export const Deferred = ({
  children,
  className = "",
  minHeight,
}: {
  children: React.ReactNode;
  className?: string;
  minHeight: string;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const near = useInView(ref, { margin: "600px", once: true });

  return (
    <div className={className} ref={ref} style={{ minHeight }}>
      {near && <Suspense fallback={null}>{children}</Suspense>}
    </div>
  );
};
