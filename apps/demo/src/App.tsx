import { ModelTag, ProviderCombine, ProviderIcon } from "ai-logo";

import { SAMPLE } from "./icons";

const card: React.CSSProperties = {
  alignItems: "center",
  border: "1px solid #e5e5e5",
  borderRadius: 8,
  display: "flex",
  flexDirection: "column",
  gap: 8,
  padding: 16,
};

export default function App() {
  return (
    <main
      style={{ fontFamily: "system-ui, sans-serif", margin: "0 auto", maxWidth: 880, padding: 32 }}
    >
      <h1>ai-logo demo</h1>
      <p style={{ color: "#666" }}>
        Imported as a dependency, so what renders here is the built bundle rather than the source.
      </p>

      <h2>Icons</h2>
      <div
        style={{
          display: "grid",
          gap: 12,
          gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))",
        }}
      >
        {SAMPLE.map(({ Icon, name }) => {
          // Monochrome brands such as OpenAI have no Color variant, and the published
          // types say so per brand, so this has to be narrowed rather than assumed.
          const Mark = "Color" in Icon ? Icon.Color : Icon;
          return (
            <div key={name} style={card}>
              <Mark size={40} />
              <code style={{ fontSize: 12 }}>{name}</code>
            </div>
          );
        })}
      </div>

      <h2>Resolved by string</h2>
      <div style={{ alignItems: "center", display: "flex", gap: 16 }}>
        <ProviderIcon provider="openai" size={32} />
        <ProviderIcon provider="anthropic" size={32} />
        <ProviderIcon provider="everyapi" size={32} />
        <ModelTag model="gpt-4o" />
      </div>

      <h2>Combined lockups</h2>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <ProviderCombine provider="openai" size={28} />
        <ProviderCombine provider="everyapi" size={28} />
      </div>
    </main>
  );
}
