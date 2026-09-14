import { AnimatePresence, MotionConfig, motion } from "motion/react";
import { lazy, Suspense, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";

import { Footer } from "./components/Footer";
import { Head } from "./components/Head";
import { Header } from "./components/Header";
import { RTL_LANGUAGES } from "./i18n";
import { Landing } from "./landing/Landing";
import { entrance } from "./motion";
import { urlFor, useStore } from "./store";

// The gallery renders all 323 brands, so it reaches for the package's whole namespace — around 3 MB, against the hundred-odd marks the landing page names one by one. Loading it on demand is what keeps that off the first visit; a reader who only reads the overview never fetches it.
const Gallery = lazy(() =>
  import("./gallery/Gallery").then((module) => ({ default: module.Gallery })),
);

/** Holds the page height while the gallery chunk arrives, so the footer does not jump up the screen and back down. */
const GalleryFallback = () => (
  <div aria-hidden className="mx-auto grid min-h-[70vh] max-w-6xl place-items-center px-5">
    <span className="size-6 animate-spin rounded-full border-2 border-line border-t-accent" />
  </div>
);

export default function App() {
  const { filter, query, selectedId, view } = useStore();
  const theme = useStore((state) => state.theme);
  const { i18n } = useTranslation();

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  // `lang` is what a screen reader picks a voice from and what the browser hyphenates by; `dir` is what puts Arabic the right way round. Both belong on <html>, which React does not own, so they are written here rather than in index.html — that copy is only ever correct for one language.
  //
  // Driven by i18next's own event rather than by a render: `resolvedLanguage` is not settled at the moment react-i18next re-renders, so reading it here wrote the previous language on every switch.
  useEffect(() => {
    const apply = (language: string) => {
      document.documentElement.lang = language;
      document.documentElement.dir = RTL_LANGUAGES.has(language) ? "rtl" : "ltr";
    };

    apply(i18n.resolvedLanguage ?? i18n.language);
    i18n.on("languageChanged", apply);
    return () => i18n.off("languageChanged", apply);
  }, [i18n]);

  // The query string carries state the reader chose, so a parameter is written only once it differs from what opening the page plainly would give. Writing all four unconditionally put `?view=overview&group=all` on every first visit, which reads as a selection nobody made.
  //
  // Debounced rather than written on every render: the search box drives `query`, so typing called replaceState once per keystroke. Safari rate-limits that to about a hundred calls in thirty seconds and throws past it, which would take down a reader who did nothing worse than type quickly.
  useEffect(() => {
    const write = setTimeout(
      () =>
        window.history.replaceState(
          null,
          "",
          urlFor({ filter, query, selectedId, view }, window.location.href),
        ),
      200,
    );
    return () => clearTimeout(write);
  }, [filter, query, selectedId, view]);

  // Switching views should land at the top of the new one — opening the gallery from a button halfway down the landing page would otherwise start the grid mid-scroll. Only on an actual change: scrolling on mount would undo a deep link to an anchor.
  const previousView = useRef(view);
  useEffect(() => {
    if (previousView.current !== view) window.scrollTo({ behavior: "auto", top: 0 });
    previousView.current = view;
  }, [view]);

  // `reducedMotion="user"` is the only switch that reaches these animations. The stylesheet collapses CSS animation and transition durations for a reader who has asked for less motion, but motion/react drives transforms from JavaScript, so no stylesheet can touch them — every entrance, layout and crossfade on this page would have played at full strength for someone who asked it not to.
  return (
    <MotionConfig reducedMotion="user">
      <Head />
      <Header />
      <main>
        <AnimatePresence mode="wait">
          <motion.div
            exit={{ opacity: 0 }}
            key={view}
            {...entrance({ opacity: 0 }, { opacity: 1 }, { duration: 0.18 })}
          >
            {view === "overview" ? (
              <Landing />
            ) : (
              <Suspense fallback={<GalleryFallback />}>
                <Gallery />
              </Suspense>
            )}
          </motion.div>
        </AnimatePresence>
      </main>
      <Footer />
    </MotionConfig>
  );
}
