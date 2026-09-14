/**
 * Whether an animation should be played at all.
 *
 * False during the build-time prerender, where there is no browser to animate anything and no reader to see it. This matters more than it sounds: an entrance animation's initial state is an inline style, so `initial={{ opacity: 0 }}` rendered in Node ships `style="opacity:0"` in the HTML. That made the prerendered page — the whole point of which is to put the copy where something that does not run JavaScript can read it — arrive with sixteen elements hidden, which is exactly what a crawler treats as hidden text and exactly what a reader without scripting sees as a blank page.
 *
 * Components spread `entrance(...)` instead of writing motion props inline, so the server renders the finished state and the client animates to it.
 */
export const animated = typeof window !== "undefined";

/**
 * Motion props for an entrance, or nothing at all when there is nobody to play it for.
 *
 * `prefers-reduced-motion` is handled separately, by the MotionConfig in App: it has to stay a runtime decision because a reader can change the setting without reloading, and because the same switch has to reach the animations that are not entrances.
 */
export const entrance = (
  from: Record<string, number>,
  to: Record<string, number>,
  transition?: object,
) => (animated ? { animate: to, initial: from, transition } : {});

/**
 * The same, for an animation that plays when the element scrolls into view.
 *
 * `reduced` skips it outright rather than shortening it. MotionConfig's `reducedMotion="user"` drops the transform but keeps the opacity, which for an entrance is the half that matters: the section starts invisible and only becomes visible when an observer fires. That makes seeing the page conditional on an animation running, for exactly the reader who asked for no animations — so they get the finished state from the first frame instead.
 */
export const reveal = (
  from: Record<string, number>,
  to: Record<string, number>,
  transition?: object,
  reduced?: boolean,
) =>
  animated && !reduced
    ? { initial: from, transition, viewport: { margin: "-60px", once: true }, whileInView: to }
    : {};
