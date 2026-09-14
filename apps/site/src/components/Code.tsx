import { CopyButton } from "./Copy";

/**
 * Enough of a highlighter for the handful of fixed snippets on this page — comments, strings, a few keywords, JSX punctuation and capitalised identifiers. A real highlighter is a few hundred kilobytes and this page ships six snippets it wrote itself, none of which contain anything the rules below get wrong.
 */
const PATTERN =
  /(\/\/[^\n]*)|("[^"]*")|\b(import|from|export|const|default|function|return)\b|(<\/?|\/?>)|([A-Z][\dA-Za-z]*)|(\{|\}|;|=)/g;

const CLASS = [
  "text-[var(--tok-punct)] italic",
  "text-[var(--tok-string)]",
  "text-[var(--tok-keyword)]",
  "text-[var(--tok-punct)]",
  "text-[var(--tok-ident)]",
  "text-[var(--tok-punct)]",
];

const highlight = (source: string) => {
  const out: React.ReactNode[] = [];
  let last = 0;

  for (const match of source.matchAll(PATTERN)) {
    const index = match.index;
    if (index > last) out.push(source.slice(last, index));

    // Group 1 is the first capture, so the matching class sits at the same offset in CLASS.
    const group = match.slice(1).findIndex(Boolean);
    out.push(
      <span className={CLASS[group]} key={`${index}-${match[0]}`}>
        {match[0]}
      </span>,
    );
    last = index + match[0].length;
  }

  out.push(source.slice(last));
  return out;
};

export const Code = ({
  className = "",
  code,
  copy = true,
}: {
  className?: string;
  code: string;
  copy?: boolean;
}) => (
  <div
    className={`group relative overflow-hidden rounded-xl border border-line bg-surface ${className}`}
  >
    {/* Source code reads left to right in every language. */}
    <pre className="overflow-x-auto p-4 font-mono text-[12.5px] leading-[1.75] text-ink" dir="ltr">
      <code>{highlight(code)}</code>
    </pre>
    {/* The button positions itself relatively so its own label can sit on top of the width spacer, so the offset goes on a wrapper rather than fighting it for the `position` property. */}
    {copy && (
      <span className="absolute top-2.5 end-2.5 opacity-0 transition group-hover:opacity-100 focus-within:opacity-100">
        <CopyButton className="bg-surface/80 backdrop-blur" value={code} />
      </span>
    )}
  </div>
);

/** A shell command reads as something to run, so it gets a prompt marker and sits on one line with the copy affordance always visible. */
export const Command = ({ command }: { command: string }) => (
  <div
    className="flex items-center gap-3 rounded-xl border border-line bg-surface px-4 py-3"
    dir="ltr"
  >
    <span aria-hidden className="font-mono text-sm text-faint select-none">
      $
    </span>
    <code className="flex-1 overflow-x-auto font-mono text-[13px] whitespace-nowrap text-ink">
      {command}
    </code>
    <CopyButton value={command} />
  </div>
);
