import { motion } from "motion/react";

/** Sections arrive as the reader reaches them, once. The transform is small on purpose: it should read as the page settling, not as something sliding in from off-screen. `prefers-reduced-motion` is honoured globally in styles.css, which collapses the duration to nothing. */
export const Reveal = ({
  as = "div",
  children,
  className = "",
  delay = 0,
  id,
}: {
  as?: "div" | "section";
  children: React.ReactNode;
  className?: string;
  delay?: number;
  id?: string;
}) => {
  const Tag = as === "section" ? motion.section : motion.div;
  return (
    <Tag
      className={className}
      id={id}
      initial={{ opacity: 0, y: 18 }}
      transition={{ delay, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      viewport={{ margin: "-60px", once: true }}
      whileInView={{ opacity: 1, y: 0 }}
    >
      {children}
    </Tag>
  );
};
