import { Center, Flexbox } from "@lobehub/ui";
import { createStaticStyles } from "antd-style";
import { Link } from "react-router";

import AgentGuideCard from "@/components/AgentGuideCard";
import Dashboard from "@/components/Dashboard";

const ICONS_DOC_URL = "https://ailogo.yldm.ai";
const REPO_URL = "https://github.com/yldm-tech/ai-logo";
const AI_AGENT_PROMPT = `Read ${ICONS_DOC_URL} and follow the instructions to use @yldm-tech/ai-logo.`;
const ICONS_INSTALL_COMMAND = "npm i @yldm-tech/ai-logo";

const meta = [
  { label: "Package", value: "@yldm-tech/ai-logo" },
  { label: "Format", value: "SVG · React" },
  { label: "License", value: "MIT" },
];

const specs = [
  {
    description:
      "Icons are designed to be lightweight, utilizing highly optimized scalable vector graphics (SVG) for the best performance and quality.",
    title: "Lightweight & scalable",
  },
  {
    description:
      "The collection is tree-shakable, ensuring that you only import the icons that you use, which helps in reducing the overall bundle size of your project.",
    title: "Tree shakable",
  },
  {
    description:
      "AI Logo is maintained in the open. Engage with us on GitHub to report a missing brand, contribute a mark, or get support.",
    title: "Maintained in the open",
  },
];

const styles = createStaticStyles(({ css }) => ({
  action: css`
    display: inline-flex;
    align-items: center;

    min-height: 2.25rem;
    padding-inline: 1rem;
    border: 1px solid var(--docs-border-default);
    border-radius: var(--docs-radius-sm);

    font-size: 0.8125rem;
    color: var(--docs-text-primary);
    text-decoration: none;

    transition: background-color 140ms ease;

    &:hover {
      background-color: var(--docs-surface-hover);
    }

    @media (prefers-reduced-motion: reduce) {
      transition-duration: 0.01ms;
    }
  `,

  actions: css`
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    margin-block-start: 1.5rem;
  `,

  description: css`
    max-width: 60ch;
    margin-block: 0.75rem 0;

    font-size: 0.9375rem;
    line-height: 1.7;
    color: var(--docs-text-secondary);
  `,

  eyebrow: css`
    margin: 0;

    font-size: 0.6875rem;
    font-weight: 650;
    color: var(--docs-text-subtle);
    text-transform: uppercase;
    letter-spacing: 0.09em;
  `,

  masthead: css`
    padding-block: 2rem 1.75rem;
    border-block-end: 1px solid var(--docs-border-default);
  `,

  meta: css`
    display: flex;
    flex-wrap: wrap;
    gap: 0 2rem;
    margin-block: 1.5rem 0;
  `,

  metaLabel: css`
    font-size: 0.6875rem;
    color: var(--docs-text-subtle);
    text-transform: uppercase;
    letter-spacing: 0.06em;
  `,

  metaValue: css`
    margin: 0;
    font-size: 0.8125rem;
    color: var(--docs-text-primary);
  `,

  spec: css`
    padding-block: 1rem;
    border-block-start: 1px solid var(--docs-border-subtle);
  `,

  specBody: css`
    margin-block: 0.375rem 0;
    font-size: 0.8125rem;
    line-height: 1.7;
    color: var(--docs-text-secondary);
  `,

  specTitle: css`
    margin: 0;

    font-size: 0.75rem;
    font-weight: 650;
    color: var(--docs-text-primary);
    text-transform: uppercase;
    letter-spacing: 0.06em;
  `,

  specs: css`
    border-block-end: 1px solid var(--docs-border-subtle);
  `,

  title: css`
    margin-block: 0.5rem 0;

    font-size: clamp(2rem, 6vw, 3rem);
    font-weight: 600;
    line-height: 1.1;
    color: var(--docs-text-primary);
    letter-spacing: -0.03em;
  `,
}));

export default () => {
  return (
    <Flexbox gap={48} paddingBlock={"32px 64px"}>
      <header className={styles.masthead}>
        <p className={styles.eyebrow}>Brand mark reference</p>
        <h1 className={styles.title}>AI Logo</h1>
        <p className={styles.description}>
          Popular AI / LLM Model Brand SVG Logo and Icon Collection
        </p>
        <dl className={styles.meta}>
          {meta.map((item) => (
            <div key={item.label}>
              <dt className={styles.metaLabel}>{item.label}</dt>
              <dd className={styles.metaValue}>{item.value}</dd>
            </div>
          ))}
        </dl>
        <div className={styles.actions}>
          <Link className={styles.action} to={"/components/lobe-hub"}>
            View all icons
          </Link>
          <a className={styles.action} href={REPO_URL} rel={"noreferrer"} target={"_blank"}>
            GitHub
          </a>
        </div>
      </header>
      <Center width="100%">
        <AgentGuideCard
          labels={{
            agent: "I'm an Agent",
            human: "I'm a Human",
          }}
          sections={{
            agent: {
              command: AI_AGENT_PROMPT,
              commandLanguage: "shell",
              description: "Send this prompt to your agent to use @yldm-tech/ai-logo",
            },
            human: {
              command: ICONS_INSTALL_COMMAND,
              commandLanguage: "shell",
              description: "Install ai-logo with npm and start using the icon set",
              linkHref: ICONS_DOC_URL,
              linkLabel: "Read docs",
            },
          }}
        />
      </Center>
      <Dashboard />
      <section className={styles.specs}>
        {specs.map((spec) => (
          <div className={styles.spec} key={spec.title}>
            <h2 className={styles.specTitle}>{spec.title}</h2>
            <p className={styles.specBody}>{spec.description}</p>
          </div>
        ))}
      </section>
    </Flexbox>
  );
};
