export interface LobeIconCdnConfig {
  cdn?: "github" | "aliyun" | "unpkg";
  format?: "svg" | "png" | "webp" | "avatar";
  isDarkMode?: boolean;
  type?: "mono" | "color" | "text" | "text-cn" | "text-color" | "brand" | "brand-color";
}

// All three hosts serve this repository's own assets. The npm-backed two resolve `@yldm-tech/ai-logo-static-*`, which the release workflow publishes from packages/static-* at the same version as the main package; the GitHub one reads those directories straight from main.
const GITHUB_ICON_CDN = (type: LobeIconCdnConfig["format"]) =>
  `https://raw.githubusercontent.com/yldm-tech/ai-logo/refs/heads/main/packages/static-${type}`;
const ALIYUN_ICON_CDN = (type: LobeIconCdnConfig["format"]) =>
  `https://registry.npmmirror.com/@yldm-tech/ai-logo-static-${type}/latest/files`;
const UNPKG_ICON_CDN = (type: LobeIconCdnConfig["format"]) =>
  `https://unpkg.com/@yldm-tech/ai-logo-static-${type}@latest`;

export const getLobeIconCDN = (id: string, config?: LobeIconCdnConfig): string => {
  const { format = "png", isDarkMode = false, type = "color", cdn = "github" } = config || {};
  let baseUrl = "";
  switch (cdn) {
    case "github": {
      baseUrl = GITHUB_ICON_CDN(format);
      break;
    }
    case "unpkg": {
      baseUrl = UNPKG_ICON_CDN(format);
      break;
    }
    case "aliyun": {
      baseUrl = ALIYUN_ICON_CDN(format);
    }
  }

  if (format === "avatar") {
    return `${baseUrl}/avatars/${id.toLowerCase()}.webp`;
  } else {
    const addon = type === "mono" ? "" : `-${type}`;

    switch (format) {
      case "svg": {
        return `${baseUrl}/icons/${id.toLowerCase() + addon}.svg`;
      }
      case "webp": {
        return `${baseUrl}/${isDarkMode ? "dark" : "light"}/${id.toLowerCase() + addon}.webp`;
      }
      default: {
        return `${baseUrl}/${isDarkMode ? "dark" : "light"}/${id.toLowerCase() + addon}.png`;
      }
    }
  }
};
