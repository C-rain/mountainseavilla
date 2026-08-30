import fs from "node:fs/promises";
import path from "node:path";

const cwd = process.cwd();
const DATA_PATH = path.join(cwd, "data", "programmatic-seo-pages.json");

const MAJOR_PAGES = [
  "index.html",
  "rooms.html",
  "booking.html",
  "access.html",
  "xiju-travel.html",
  "faq.html",
  "gallery.html"
];

const walkHtmlFiles = async (dirPath) => {
  const entries = await fs.readdir(dirPath, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    if (entry.name.startsWith(".")) {
      continue;
    }

    const fullPath = path.join(dirPath, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await walkHtmlFiles(fullPath)));
      continue;
    }

    if (entry.isFile() && entry.name.endsWith(".html")) {
      files.push(fullPath);
    }
  }

  return files;
};

const readText = (filePath) => fs.readFile(filePath, "utf8");

const getAttr = (html, selectorPattern) => {
  const match = html.match(selectorPattern);
  return match?.[1]?.trim() || "";
};

const getMetaContent = (html, attrName, attrValue) => {
  const escapedValue = attrValue.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const regex = new RegExp(
    `<meta[^>]*${attrName}="${escapedValue}"[^>]*content="([^"]*)"[^>]*>`,
    "is"
  );
  return getAttr(html, regex);
};

const countMatches = (html, regex) => [...html.matchAll(regex)].length;

const normalizeRoute = (route) => {
  if (!route) {
    return "/";
  }

  return route.replace(/\/index\.html$/, "/");
};

const resolveHrefToRoute = (href, currentRoute) => {
  if (!href || href.startsWith("mailto:") || href.startsWith("tel:") || href.startsWith("javascript:")) {
    return null;
  }

  if (/^https?:\/\//.test(href)) {
    const url = new URL(href);
    if (url.hostname !== "mountainseavilla.com" && url.hostname !== "www.mountainseavilla.com") {
      return null;
    }

    return normalizeRoute(`${url.pathname}${url.pathname.endsWith("/") ? "" : ""}`);
  }

  const [rawPath] = href.split("#");
  if (!rawPath || rawPath === "") {
    return normalizeRoute(currentRoute);
  }

  if (rawPath.startsWith("/")) {
    return normalizeRoute(rawPath);
  }

  const currentDir = currentRoute.endsWith("/") ? currentRoute : currentRoute.replace(/[^/]+$/, "");
  const resolved = path.posix.normalize(path.posix.join(currentDir, rawPath));
  return normalizeRoute(resolved.startsWith("/") ? resolved : `/${resolved}`);
};

const routeFromFilePath = (filePath) => {
  const relativePath = path.relative(cwd, filePath).replaceAll("\\", "/");

  if (relativePath === "index.html") {
    return "/";
  }

  if (relativePath.endsWith("/index.html")) {
    return `/${relativePath.slice(0, -"/index.html".length)}/`;
  }

  return `/${relativePath}`;
};

const errors = [];
const warnings = [];

const htmlFiles = await walkHtmlFiles(cwd);
const routeSet = new Set(htmlFiles.map((filePath) => routeFromFilePath(filePath)));

const rawData = await readText(DATA_PATH);
const seoData = JSON.parse(rawData);
const unpublishedRoutes = seoData.pages
  .filter((entry) => !entry.published)
  .map((entry) => `/${entry.baseRoute}/${entry.slug}/`);

const sitemapXml = await readText(path.join(cwd, "sitemap.xml"));
const sitemapLocs = [...sitemapXml.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => match[1]);

for (const filePath of htmlFiles) {
  const html = await readText(filePath);
  const route = routeFromFilePath(filePath);
  const pageName = path.relative(cwd, filePath).replaceAll("\\", "/");

  const title = getAttr(html, /<title>([\s\S]*?)<\/title>/i);
  const description = getMetaContent(html, "name", "description");
  const canonical = getAttr(html, /<link rel="canonical" href="([^"]*)"/i);
  const robots = getAttr(html, /<meta name="robots" content="([^"]*)"/i);
  const ogTitle = getMetaContent(html, "property", "og:title");
  const ogDescription = getMetaContent(html, "property", "og:description");
  const ogUrl = getMetaContent(html, "property", "og:url");
  const ogImage = getMetaContent(html, "property", "og:image");
  const twitterCard = getMetaContent(html, "name", "twitter:card");
  const twitterTitle = getMetaContent(html, "name", "twitter:title");
  const twitterDescription = getMetaContent(html, "name", "twitter:description");
  const twitterImage = getMetaContent(html, "name", "twitter:image");
  const h1Count = countMatches(html, /<h1\b/gi);
  const imgTags = [...html.matchAll(/<img\b[^>]*>/gi)].map((match) => match[0]);
  const linkMatches = [...html.matchAll(/<a\b[^>]*href="([^"]+)"/gi)].map((match) => match[1]);
  const isMajorPage = MAJOR_PAGES.includes(pageName);
  const hasDefinition = /先快速了解|是什麼？/.test(html);
  const hasSummary = /先看哪些重點|適合先看|重點整理|哪些旅客|先看這裡|哪些情況/.test(html);
  const hasFaqHeading = /FAQ|常見問題/.test(html);

  if (!title) errors.push(`${pageName}: missing <title>`);
  if (!description) errors.push(`${pageName}: missing meta description`);
  if (!canonical) errors.push(`${pageName}: missing canonical`);
  if (!robots) errors.push(`${pageName}: missing robots meta`);
  if (!ogTitle || !ogDescription || !ogUrl || !ogImage) errors.push(`${pageName}: incomplete Open Graph metadata`);
  if (!twitterCard || !twitterTitle || !twitterDescription || !twitterImage) errors.push(`${pageName}: incomplete Twitter metadata`);
  if (h1Count !== 1) errors.push(`${pageName}: expected 1 H1, found ${h1Count}`);

  if (canonical) {
    const canonicalUrl = new URL(canonical);
    const canonicalRoute = normalizeRoute(canonicalUrl.pathname);
    if (canonicalRoute !== normalizeRoute(route)) {
      errors.push(`${pageName}: canonical route mismatch (${canonicalRoute} !== ${route})`);
    }
  }

  if (ogUrl && canonical && ogUrl !== canonical) {
    errors.push(`${pageName}: og:url does not match canonical`);
  }

  for (const imgTag of imgTags) {
    if (!/alt="/i.test(imgTag)) {
      errors.push(`${pageName}: image missing alt attribute`);
    }
  }

  if (isMajorPage) {
    if (!hasDefinition) errors.push(`${pageName}: missing visible definition section`);
    if (!hasSummary) errors.push(`${pageName}: missing visible summary section`);
    if (!hasFaqHeading) errors.push(`${pageName}: missing visible FAQ section`);
  }

  for (const href of linkMatches) {
    const targetRoute = resolveHrefToRoute(href, route);
    if (!targetRoute) {
      continue;
    }

    if (!routeSet.has(targetRoute)) {
      errors.push(`${pageName}: broken internal link -> ${href} (${targetRoute})`);
    }
  }
}

const robotsTxt = await readText(path.join(cwd, "robots.txt"));
if (!/Sitemap:\s+https:\/\/mountainseavilla\.com\/sitemap\.xml/i.test(robotsTxt)) {
  errors.push("robots.txt: missing or incorrect sitemap directive");
}

for (const route of unpublishedRoutes) {
  const loc = `https://mountainseavilla.com${route}`;
  if (sitemapLocs.includes(loc)) {
    errors.push(`sitemap.xml: unpublished route included ${loc}`);
  }
  if (routeSet.has(route)) {
    errors.push(`generated HTML exists for unpublished route ${route}`);
  }
}

const indexableRoutes = seoData.pages
  .filter((entry) => entry.published && entry.indexable)
  .map((entry) => `https://mountainseavilla.com/${entry.baseRoute}/${entry.slug}/`);

for (const loc of indexableRoutes) {
  if (!sitemapLocs.includes(loc)) {
    errors.push(`sitemap.xml: missing published indexable route ${loc}`);
  }
}

const titleMap = new Map();
const descriptionMap = new Map();

for (const filePath of htmlFiles) {
  const html = await readText(filePath);
  const pageName = path.relative(cwd, filePath).replaceAll("\\", "/");
  const title = getAttr(html, /<title>([\s\S]*?)<\/title>/i);
  const description = getMetaContent(html, "name", "description");

  if (title) {
    const items = titleMap.get(title) || [];
    items.push(pageName);
    titleMap.set(title, items);
  }

  if (description) {
    const items = descriptionMap.get(description) || [];
    items.push(pageName);
    descriptionMap.set(description, items);
  }
}

for (const [title, pages] of titleMap.entries()) {
  if (pages.length > 1) {
    warnings.push(`duplicate title used on ${pages.join(", ")}: ${title}`);
  }
}

for (const [description, pages] of descriptionMap.entries()) {
  if (pages.length > 1) {
    warnings.push(`duplicate description used on ${pages.join(", ")}: ${description}`);
  }
}

if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}

const summaryLines = [
  `Validated ${htmlFiles.length} HTML files.`,
  `Sitemap URLs: ${sitemapLocs.length}.`,
  warnings.length ? `Warnings:\n${warnings.join("\n")}` : "Warnings: none."
];

console.log(summaryLines.join("\n"));
