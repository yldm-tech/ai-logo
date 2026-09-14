import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { FileConverter } from "./utils/file-converter";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const converter = new FileConverter();

interface IconInfo {
  name: string;
  rnPath: string;
  webPath: string;
}

// 获取所有图标列表
function getAllIcons(): IconInfo[] {
  // 计算项目根目录路径，无论脚本从哪里调用
  const scriptDir = __dirname;
  const projectRoot = join(scriptDir, "../../");
  const srcDir = join(projectRoot, "src");

  const iconNames = readdirSync(srcDir).filter((name) =>
    existsSync(join(srcDir, name, "components")),
  );

  return iconNames.map((name) => ({
    name,
    rnPath: join(projectRoot, "packages/react-native/src/icons", name),
    webPath: join(srcDir, name),
  }));
}

// 创建图标目录结构
function createIconDirectory(iconPath: string): void {
  const componentsDir = join(iconPath, "components");
  if (!existsSync(componentsDir)) {
    mkdirSync(componentsDir, { recursive: true });
  }
}

// 转换并复制style.ts文件
function copyStyleFile(webPath: string, rnPath: string): boolean {
  const webStylePath = join(webPath, "style.ts");
  const rnStylePath = join(rnPath, "style.ts");

  if (existsSync(webStylePath)) {
    const webContent = readFileSync(webStylePath, "utf8");
    const result = converter.convertStyleFile(webContent);

    if (result.success && result.content) {
      writeFileSync(rnStylePath, result.content);
      return true;
    } else {
      console.error(`❌ style.ts 转换失败: ${result.error}`);
      return false;
    }
  }
  return false;
}

// 生成index.ts文件
function generateIndexFile(iconName: string, rnPath: string): void {
  const scriptDir = __dirname;
  const projectRoot = join(scriptDir, "../../");
  const webIndexPath = join(projectRoot, `src/${iconName}/index.ts`);
  const rnIndexPath = join(rnPath, "index.ts");

  if (existsSync(webIndexPath)) {
    // 简单复制，RN版本的index.ts结构与Web版本相同
    const content = readFileSync(webIndexPath, "utf8");
    writeFileSync(rnIndexPath, content);
  }
}

// 判断是否为SVG组件
function isSvgComponent(content: string): boolean {
  return content.includes("<svg") || content.includes('fill="currentColor"');
}

// 判断是否为重导出组件
function isReExportComponent(content: string): boolean {
  return content.trim().startsWith("export { default }");
}

// 转换单个组件
function convertComponent(
  webPath: string,
  rnPath: string,
  componentType: string,
  iconName: string,
): boolean {
  const webFilePath = join(webPath, "components", `${componentType}.tsx`);
  const rnFilePath = join(rnPath, "components", `${componentType}.tsx`);

  if (!existsSync(webFilePath)) {
    return false; // 组件不存在，跳过
  }

  try {
    const webContent = readFileSync(webFilePath, "utf8");

    // 处理重导出组件
    if (isReExportComponent(webContent)) {
      const result = converter.convertReExportFile(webContent);
      if (result.success && result.content) {
        writeFileSync(rnFilePath, result.content);
        return true;
      } else {
        console.error(`❌ ${iconName}/${componentType} (重导出): ${result.error}`);
        return false;
      }
    }

    let result;
    // 智能判断组件类型
    if (isSvgComponent(webContent)) {
      result = converter.convertSvgComponentFile(webContent, componentType as any, iconName);
    } else {
      result = converter.convertNonSvgComponentFile(webContent, componentType as any);
    }

    if (result.success && result.content) {
      writeFileSync(rnFilePath, result.content);
      return true;
    } else {
      console.error(`❌ ${iconName}/${componentType}: ${result.error}`);
      return false;
    }
  } catch (error) {
    console.error(`❌ ${iconName}/${componentType}: ${error}`);
    return false;
  }
}

// 获取图标的所有组件
function getIconComponents(webPath: string): string[] {
  const componentsDir = join(webPath, "components");
  if (!existsSync(componentsDir)) {
    return [];
  }

  return readdirSync(componentsDir)
    .filter((file) => file.endsWith(".tsx"))
    .map((file) => file.replace(".tsx", ""));
}

// 转换单个图标
function convertIcon(iconInfo: IconInfo): boolean {
  console.log(`🔄 转换 ${iconInfo.name}...`);

  // 创建目录
  createIconDirectory(iconInfo.rnPath);

  // 获取所有组件
  const components = getIconComponents(iconInfo.webPath);
  const failed: string[] = [];
  let successCount = 0;

  for (const component of components) {
    if (convertComponent(iconInfo.webPath, iconInfo.rnPath, component, iconInfo.name)) {
      successCount++;
    } else {
      failed.push(component);
    }
  }

  // 复制style.ts
  if (copyStyleFile(iconInfo.webPath, iconInfo.rnPath)) {
    successCount++;
  }

  // 生成index.ts
  generateIndexFile(iconInfo.name, iconInfo.rnPath);
  successCount++;

  // Report what actually happened. This used to `return true` regardless, so a run in which every
  // single component failed to convert still printed 成功: 323/323 and exited 0.
  if (failed.length > 0) {
    console.error(`❌ ${iconInfo.name} 有 ${failed.length} 个组件未转换: ${failed.join(", ")}`);
    return false;
  }

  console.log(`✅ ${iconInfo.name} 完成 (${successCount}个文件)`);
  return true;
}

// 主函数
async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0 || args[0] === "--test") {
    // 批量转换所有图标或测试模式
    const isTestMode = args[0] === "--test";

    console.log(isTestMode ? "🧪 测试模式：转换前5个图标...\n" : "🚀 开始批量转换所有图标...\n");

    const icons = getAllIcons();
    const targetIcons = isTestMode ? icons.slice(0, 5) : icons;

    console.log(`📊 ${isTestMode ? "测试" : "发现"} ${targetIcons.length} 个图标\n`);

    let successCount = 0;
    for (const icon of targetIcons) {
      if (convertIcon(icon)) {
        successCount++;
      }
    }

    console.log(`\n🎉 ${isTestMode ? "测试" : "批量转换"}完成!`);
    console.log(`✅ 成功: ${successCount}/${targetIcons.length}`);
  } else {
    // 转换指定图标（支持多个）
    const targetIcons = args;
    console.log(`🎯 转换指定图标: ${targetIcons.join(", ")}\n`);

    const allIcons = getAllIcons();
    const foundIcons: IconInfo[] = [];
    const notFoundIcons: string[] = [];

    // 查找所有指定的图标
    for (const targetIcon of targetIcons) {
      const icon = allIcons.find((i) => i.name === targetIcon);
      if (icon) {
        foundIcons.push(icon);
      } else {
        notFoundIcons.push(targetIcon);
      }
    }

    // 检查是否有找不到的图标
    if (notFoundIcons.length > 0) {
      console.error(`❌ 找不到以下图标: ${notFoundIcons.join(", ")}`);
      console.log(
        `💡 可用图标示例: ${allIcons
          .slice(0, 5)
          .map((i) => i.name)
          .join(", ")}...`,
      );
      throw new Error(`找不到图标: ${notFoundIcons.join(", ")}`);
    }

    // 转换找到的图标
    let successCount = 0;
    for (const icon of foundIcons) {
      if (convertIcon(icon)) {
        successCount++;
      }
    }

    console.log(`\n🎉 转换完成!`);
    console.log(`✅ 成功: ${successCount}/${foundIcons.length}`);

    if (successCount < foundIcons.length) {
      throw new Error(`部分图标转换失败: ${foundIcons.length - successCount} 个失败`);
    }
  }
}

// eslint-disable-next-line unicorn/prefer-top-level-await
main().catch((error) => {
  console.error(error instanceof Error ? error.message : "Unknown error");
  throw error;
});
