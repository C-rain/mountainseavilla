import fs from "node:fs/promises";
import path from "node:path";

const cwd = process.cwd();
const HTML_EXT = ".html";

const walk = async (dirPath) => {
  const entries = await fs.readdir(dirPath, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    if (entry.name.startsWith(".")) {
      continue;
    }

    const fullPath = path.join(dirPath, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await walk(fullPath)));
      continue;
    }

    if (entry.isFile() && entry.name.endsWith(HTML_EXT)) {
      files.push(fullPath);
    }
  }

  return files;
};

const extractJsonBlocks = (html) => {
  const matches = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)];
  return matches.map((match) => match[1].trim());
};

const flattenNodes = (json) => {
  if (json["@graph"]) {
    return json["@graph"];
  }

  return [json];
};

const extractCanonical = (html) => {
  const match = html.match(/<link rel="canonical" href="([^"]+)"/i);
  return match?.[1] || null;
};

const extractVisibleBreadcrumbLabels = (html) => {
  const navMatch = html.match(/<nav class="breadcrumb"[\s\S]*?>([\s\S]*?)<\/nav>/i);
  if (!navMatch) {
    return [];
  }

  return [...navMatch[1].matchAll(/>([^<>]+)</g)]
    .map((match) => match[1].trim())
    .filter(Boolean)
    .filter((label) => label !== "/");
};

const errors = [];

const htmlFiles = await walk(cwd);

for (const filePath of htmlFiles) {
  const html = await fs.readFile(filePath, "utf8");
  const canonical = extractCanonical(html);
  const visibleBreadcrumbLabels = extractVisibleBreadcrumbLabels(html);
  const jsonBlocks = extractJsonBlocks(html);
  const nodes = [];

  for (const block of jsonBlocks) {
    try {
      nodes.push(...flattenNodes(JSON.parse(block)));
    } catch (error) {
      errors.push(`${filePath}: JSON-LD parse error: ${error.message}`);
    }
  }

  const pageLikeNodes = nodes.filter((node) =>
    ["WebPage", "CollectionPage", "ImageGallery"].includes(node["@type"])
  );

  for (const node of pageLikeNodes) {
    if (canonical && node.url && node.url !== canonical) {
      errors.push(`${filePath}: canonical mismatch for ${node["@type"]} (${node.url} !== ${canonical})`);
    }
  }

  const breadcrumbNode = nodes.find((node) => node["@type"] === "BreadcrumbList");
  if (breadcrumbNode) {
    const schemaLabels = (breadcrumbNode.itemListElement || []).map((item) => item.name);
    if (visibleBreadcrumbLabels.length && schemaLabels.join(" > ") !== visibleBreadcrumbLabels.join(" > ")) {
      errors.push(`${filePath}: breadcrumb label mismatch (${schemaLabels.join(" > ")} !== ${visibleBreadcrumbLabels.join(" > ")})`);
    }

    const lastItem = breadcrumbNode.itemListElement?.[breadcrumbNode.itemListElement.length - 1];
    if (canonical && lastItem?.item && lastItem.item !== canonical) {
      errors.push(`${filePath}: breadcrumb last item mismatch (${lastItem.item} !== ${canonical})`);
    }
  }

  const faqNode = nodes.find((node) => node["@type"] === "FAQPage");
  if (faqNode) {
    for (const item of faqNode.mainEntity || []) {
      if (!html.includes(item.name)) {
        errors.push(`${filePath}: FAQ question not found in visible HTML (${item.name})`);
      }
      if (!html.includes(item.acceptedAnswer?.text || "")) {
        errors.push(`${filePath}: FAQ answer not found in visible HTML (${item.name})`);
      }
    }
  }
}

if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}

console.log(`Validated ${htmlFiles.length} HTML files with no schema mismatches.`);
