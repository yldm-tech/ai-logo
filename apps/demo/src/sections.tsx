import { toc } from "@yldm-tech/ai-logo";

const PKG = "@yldm-tech/ai-logo";
const ALIAS = "ai-logo";
const CDN = "https://ailogo.yldm.ai";

const INSTALL = [
  ["npm", `npm i ${PKG}`],
  ["pnpm", `pnpm add ${PKG}`],
  ["yarn", `yarn add ${PKG}`],
  ["bun", `bun add ${PKG}`],
] as const;

const CDN_ROWS = [
  ["SVG", `${CDN}/svg/openai.svg`],
  ["PNG", `${CDN}/png/light/openai.png`],
  ["WebP", `${CDN}/webp/dark/openai.webp`],
  ["Avatar", `${CDN}/avatar/openai.webp`],
] as const;

export const Hero = () => (
  <section className="hero">
    <h1 className="hero-title">AI Logo</h1>
    <p className="hero-sub">
      Brand marks for {toc.length} AI companies, models and applications — as React components, and
      as static SVG, PNG and WebP over a CDN.
    </p>
    <div className="hero-actions">
      <a className="btn btn--primary" href="#icons">
        Browse icons
      </a>
      <a
        className="btn"
        href="https://github.com/yldm-tech/ai-logo"
        rel="noreferrer"
        target="_blank"
      >
        GitHub
      </a>
      <a
        className="btn"
        href={`https://www.npmjs.com/package/${PKG}`}
        rel="noreferrer"
        target="_blank"
      >
        npm
      </a>
    </div>
  </section>
);

export const Install = () => (
  <section className="panel" id="install">
    <h2 className="panel-title">Install</h2>
    <table className="table">
      <tbody>
        {INSTALL.map(([manager, command]) => (
          <tr key={manager}>
            <th>{manager}</th>
            <td>
              <code>{command}</code>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
    <p className="panel-note">
      Published under <code>{ALIAS}</code> as well — the same build at the same version. Pick one,
      not both. <code>react</code>, <code>react-dom</code> and <code>antd</code> are peer
      dependencies.
    </p>

    <pre className="block">{`import { OpenAI, ProviderIcon } from "${PKG}";

<OpenAI size={32} />
<OpenAI.Color size={32} />
<ProviderIcon provider="openai" size={32} />`}</pre>
  </section>
);

export const Cdn = () => (
  <section className="panel" id="cdn">
    <h2 className="panel-title">CDN</h2>
    <p className="panel-note">
      Every mark is also a static file. No install, no build step — just an <code>&lt;img&gt;</code>{" "}
      tag.
    </p>
    <table className="table">
      <tbody>
        {CDN_ROWS.map(([format, url]) => (
          <tr key={format}>
            <th>{format}</th>
            <td>
              <code>{url}</code>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
    <p className="panel-note">
      PNG and WebP ship <code>light</code> and <code>dark</code> variants, so a{" "}
      <code>&lt;picture&gt;</code> element can follow the reader&rsquo;s colour scheme. The slug is
      the component name in kebab-case; a colour variant carries a <code>-color</code> suffix.
    </p>
  </section>
);
