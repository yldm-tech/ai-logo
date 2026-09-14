# Security Policy

## Reporting a vulnerability

Report it privately through GitHub: **[open a draft advisory](https://github.com/yldm-tech/ai-logo/security/advisories/new)**. Only the maintainers can see it, and it gives us somewhere to discuss and fix the problem before it is public. Please do not open a regular issue or a pull request for it first — a pull request title is as public as an issue.

Include what you would want to be given: which package and version, what someone can actually do with it, and the smallest reproduction you have. A repository or a sandbox that shows the behaviour is worth more than a description of it.

## In scope

- The published packages — `@yldm-tech/ai-logo`, the unscoped `ai-logo` alias, and the four asset packages `@yldm-tech/ai-logo-static-svg`, `-static-png`, `-static-webp` and `-static-avatar`.
- The site at [ailogo.yldm.ai](https://ailogo.yldm.ai) and the asset paths served from it.
- The release pipeline in this repository: the workflows, the publish scripts, and anything else that decides what reaches npm.

Concretely, that means things like a package executing code a consumer did not ask for, markup escaping into a host page (the icons are inlined SVG, so id collisions and unescaped props are a real category here rather than a theoretical one), a change that would let a fork or a pull request reach the publishing credentials, or an asset path serving something other than the icon it names.

## Not in scope

**The brand artwork itself.** Every logo in this collection is a trademark of its owner and is included for identification only. Whether a particular use of a mark is permitted is between you and the owner of that mark, and if a logo here is wrong, outdated, or should not be in the set at all, that is an ordinary [issue](https://github.com/yldm-tech/ai-logo/issues) — handling it privately would help nobody.

Also out of scope: vulnerabilities in `react`, `antd` or any other dependency, which belong upstream (do tell us if the version range this project declares is what exposes you); reports that are a scanner's output with no impact demonstrated behind them; and `@yldm-tech/ai-logo-rn`, which is marked `private` and is not published, so problems there are ordinary issues.

## What to expect

This is a small open-source project maintained in spare time. There is no security team, no rotation and no response-time commitment — any number promised here would be one nobody had agreed to keep.

What does happen is that whoever is around picks the advisory up, asks for whatever is needed to reproduce it, and works the fix in the advisory itself. A fix ships as a normal release on the v1 line, which is the only line that is maintained: there are no backports to older versions, and the asset packages are republished at the same version so the set stays pinnable together. You will be credited when the advisory is published unless you would rather not be. If a report has had no reply at all after a couple of weeks, it is fair to nudge the maintainers on the issue tracker — without describing the problem there.
