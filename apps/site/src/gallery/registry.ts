import * as AiLogo from "@yldm-tech/ai-logo";

import type { CompoundIcon } from "../registry";

/**
 * Every icon is a named export, so the toc doubles as an index into the module. A real app would import the handful it needs — see treeshake/entry.tsx and landing/featured.ts — but a gallery wants all of them, and driving it off the toc proves the metadata and the exports line up for all 300-odd brands rather than the six the test samples.
 *
 * The whole namespace is roughly 3 MB, which is why this module is reached only through the lazily loaded gallery: a reader who never opens it never downloads it.
 */
export const galleryRegistry = AiLogo as unknown as Record<string, CompoundIcon | undefined>;
