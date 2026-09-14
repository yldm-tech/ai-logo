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
  const [copied, setCopied] = useState(false);
  const { t } = useTranslation();
  const idle = label ?? t("copy.copy");
  const done = t("copy.copied");
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => () => clearTimeout(timer.current), []);

  const copy = () => {
    void navigator.clipboard?.writeText(value);
    setCopied(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setCopied(false), 1400);
  };

  return (
    <button
      aria-label={t("copy.label", { value })}
      className={`group/copy relative flex-none cursor-pointer rounded-lg border border-line px-2.5 py-1.5 text-[11px] font-medium text-dim transition hover:border-line-strong hover:bg-elevated hover:text-ink ${className}`}
      onClick={copy}
      type="button"
    >
      {/* The wider of the two labels holds the width open while the visible one is absolutely positioned over it, so confirming a copy does not reflow the row. Which one is wider depends on the language. */}
      <span aria-hidden className="invisible">
        {idle.length >= done.length ? idle : done}
      </span>
      <AnimatePresence initial={false} mode="wait">
        <motion.span
          animate={{ opacity: 1, y: 0 }}
          className="absolute inset-0 grid place-items-center"
          exit={{ opacity: 0, y: -6 }}
          initial={{ opacity: 0, y: 6 }}
          key={copied ? "copied" : "idle"}
          transition={{ duration: 0.14 }}
        >
          {copied ? <span className="text-accent">{done}</span> : idle}
        </motion.span>
      </AnimatePresence>
    </button>
  );
};
