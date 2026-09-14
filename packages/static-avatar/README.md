# @yldm-tech/ai-logo-static-avatar

`Static Avatar`

Popular AI / LLM model brand logos as static Avatar files. Browse them all at [ailogo.yldm.ai](https://ailogo.yldm.ai).

This package carries only the rendered assets — one directory, no code. For the React components see [`@yldm-tech/ai-logo`](https://www.npmjs.com/package/@yldm-tech/ai-logo); the assets here are generated from the same sources and published at the same version.

## Layout

`avatars/` — one file per icon variant, named by lowercased brand slug with no separator: `openai`, `openai-text`, `claudecode`. Multi-word brands are not hyphenated.

## CDN usage

Both hosts serve this package straight from npm, so pin `@latest` or an exact version:

```html
<!-- unpkg -->
<img height="64" src="https://unpkg.com/@yldm-tech/ai-logo-static-avatar@latest/avatars/openai.webp" />

<!-- npmmirror (aliyun) -->
<img height="64" src="https://registry.npmmirror.com/@yldm-tech/ai-logo-static-avatar/latest/files/avatars/openai.webp" />
```

The same files are also readable from GitHub, which is what `getLobeIconCDN(id, { cdn: "github" })` in `@yldm-tech/ai-logo` returns.

## License

MIT. Originally forked from [lobehub/lobe-icons](https://github.com/lobehub/lobe-icons).

Brand logos are the property of their respective owners. They are included here for identification purposes; inclusion is not affiliation or endorsement.
