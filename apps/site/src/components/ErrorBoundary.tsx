import { Component, type ReactNode } from "react";

/**
 * The last thing between a thrown render and a blank page.
 *
 * The gallery and the string-lookup card arrive as separate chunks over the network, so a failed request — a stale index after a deploy, a proxy that mangles a response, a reader who lost their connection halfway down the page — rejects inside React rather than at a call site anyone can catch. Without this the whole document unmounts and the reader is left looking at nothing, with the real page sitting in the HTML they were already reading.
 *
 * It renders a plain element with no hooks and no imports of its own, because whatever took the tree down may be the thing this would otherwise depend on.
 */
export class ErrorBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error: unknown) {
    console.error("ai-logo site:", error);
  }

  render() {
    if (!this.state.failed) return this.props.children;

    return (
      <div className="mx-auto grid min-h-[60vh] max-w-lg place-items-center px-5 text-center">
        <div>
          <h1 className="text-[17px] font-semibold text-ink">Something went wrong</h1>
          <p className="mt-3 text-[13.5px] leading-relaxed text-dim">
            Part of this page failed to load. Reloading usually fixes it. The icons themselves are
            files, and they are still there:{" "}
            <a className="text-accent" href="https://ailogo.yldm.ai/svg/openai.svg">
              /svg/openai.svg
            </a>
            .
          </p>
          <button
            className="mt-5 cursor-pointer rounded-xl bg-accent-solid px-5 py-2.5 text-sm font-medium text-white transition hover:brightness-110"
            onClick={() => window.location.reload()}
            type="button"
          >
            Reload
          </button>
        </div>
      </div>
    );
  }
}
