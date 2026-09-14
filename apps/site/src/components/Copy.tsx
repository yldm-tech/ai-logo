import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

/**
 * A copy button that confirms in place. The label swaps rather than the button moving, so a row of them does not reflow when one is pressed, and the timer is cleared on unmount — the gallery unmounts these as the reader changes selection.
 */
export const CopyButton = ({
  className = "",
  label,
  value,
}: {
  className?: string;
  label?: string;
  value: string;
}) => {
  const [state, setState] = useState<"copied" | "failed" | "idle">("idle");
  const { t } = useTranslation();
  const idle = label ?? t("copy.copy");
  const done = t("copy.copied");
  const failed = t("copy.failed");
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => () => clearTimeout(timer.current), []);

  // The clipboard is a permission, not a function call. It is missing outside a secure context, it rejects when the document is not focused, and a browser may simply refuse — so the confirmation waits for the write to actually resolve, and a refusal says so instead of claiming success.
  const copy = async () => {
    clearTimeout(timer.current);
    try {
      await navigator.clipboard.writeText(value);
      setState("copied");
    } catch {
      setState("failed");
    }
    timer.current = setTimeout(() => setState("idle"), 1400);
  };

  return (
    <button
      aria-label={t("copy.label", { value })}
      className={`group/copy relative flex-none cursor-pointer rounded-lg border border-line px-2.5 py-1.5 text-[11px] font-medium text-dim transition hover:border-line-strong hover:bg-elevated hover:text-ink ${className}`}
      onClick={() => void copy()}
      type="button"
    >
      {/* The widest label holds the width open while the visible one is absolutely positioned over it, so confirming a copy does not reflow the row. Which one is widest depends on the language. */}
      <span aria-hidden className="invisible">
        {[idle, done, failed].reduce((a, b) => (a.length >= b.length ? a : b))}
      </span>
      <AnimatePresence initial={false} mode="wait">
        <motion.span
          animate={{ opacity: 1, y: 0 }}
          className="absolute inset-0 grid place-items-center"
          exit={{ opacity: 0, y: -6 }}
          initial={{ opacity: 0, y: 6 }}
          key={state}
          transition={{ duration: 0.14 }}
        >
          {state === "copied" && <span className="text-accent">{done}</span>}
          {state === "failed" && <span className="text-dim">{failed}</span>}
          {state === "idle" && idle}
        </motion.span>
      </AnimatePresence>
    </button>
  );
};
