import fs from "node:fs/promises";
import path from "node:path";
import {
  buildArticleNode,
  buildBreadcrumbNode,
  buildFaqNode,
  buildHowToNode,
  buildLodgingBusinessNode,
  buildOrganizationNode,
  buildServiceNode,
  buildWebPageNode,
  buildWebSiteNode,
  renderJsonLdGraph,
  toAbsoluteUrl
} from "./schema-utils.mjs";

const cwd = process.cwd();
const DATA_PATH = path.join(cwd, "data", "programmatic-seo-pages.json");
const CACHE_BUST = "coastal-map";
const ROOT_PAGES = [
  { loc: "/", priority: "1.0" },
  { loc: "/rooms.html", priority: "0.9" },
  { loc: "/booking.html", priority: "0.9" },
  { loc: "/access.html", priority: "0.9" },
  { loc: "/xiju-travel.html", priority: "0.8" },
  { loc: "/faq.html", priority: "0.8" },
  { loc: "/gallery.html", priority: "0.7" }
];

const escapeHtml = (value = "") =>
  String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");

const routeForEntry = (entry) => `/${entry.baseRoute}/${entry.slug}/`;
const routeForCollection = (collection) => `/${collection.baseRoute}/`;

const relativeRootPrefix = (routePath) => {
  const trimmed = routePath.replace(/^\/|\/$/g, "");

  if (!trimmed) {
    return "";
  }

  const depth = trimmed.split("/").length;
  return "../".repeat(depth);
};


const renderBreadcrumbNav = (crumbs) => `
      <nav class="breadcrumb" aria-label="Breadcrumb">
        ${crumbs
          .map((crumb, index) => {
            const isLast = index === crumbs.length - 1;
            if (isLast) {
              return `<span aria-current="page">${escapeHtml(crumb.name)}</span>`;
            }

            return `<a href="${crumb.href}">${escapeHtml(crumb.name)}</a><span aria-hidden="true">/</span>`;
          })
          .join("")}
      </nav>`;

const renderHeader = (relativeRoot) => `
      <header class="site-header">
        <a class="brand" href="/" aria-label="山海一家會館首頁">
          <img class="brand-logo" src="${relativeRoot}assets/images/logo.jpg" alt="山海一家會館 Mountain Sea Villa Logo" />
        </a>
        <button class="menu-toggle" type="button" aria-expanded="false" aria-controls="site-nav">選單</button>
        <nav class="site-nav" id="site-nav" aria-label="主選單">
          <a href="/#about">關於會館</a>
          <a href="/rooms.html">房型資訊</a>
          <a href="/booking.html">訂房方式</a>
          <a href="/access.html">交通位置</a>
          <a href="/travel-guides/">旅行指南</a>
          <a href="/faq.html">常見問題</a>
        </nav>
      </header>`;

const renderFooter = (site) => `
      <footer class="site-footer">
        <div class="footer-grid">
          <section>
            <h2>${escapeHtml(site.brandName)}</h2>
            <p>位於馬祖西莒青帆村高點，提供住宿、訂房、交通與周邊旅遊資訊。</p>
          </section>
          <nav class="footer-links" aria-label="主要頁面">
            <h2>主要頁面</h2>
            <a href="/rooms.html">房型資訊</a>
            <a href="/booking.html">訂房方式</a>
            <a href="/access.html">交通位置</a>
            <a href="/xiju-travel.html">西莒旅行</a>
            <a href="/travel-guides/">旅行指南</a>
            <a href="/stays/">房型深度頁</a>
            <a href="/compare/">住宿比較頁</a>
          </nav>
          <nav class="footer-links" aria-label="聯絡方式">
            <h2>聯絡方式</h2>
            <a href="${site.phoneHref}">訂房專線 ${escapeHtml(site.phone)}</a>
            <a href="tel:+886972098380">手機 ${escapeHtml(site.mobile)}</a>
            <a href="${site.lineUrl}" target="_blank" rel="noreferrer">Line 洽詢</a>
            <a href="${site.mapUrl}" target="_blank" rel="noreferrer">Google 地圖</a>
          </nav>
        </div>
        <p>地址：${escapeHtml(site.address)}</p>
      </footer>`;

const renderMetaList = (items = []) =>
  items.length
    ? `<ul class="meta-list">${items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>`
    : "";

const renderParagraphs = (paragraphs = []) =>
  paragraphs.map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join("");

const renderSections = (sections = []) => {
  if (!sections.length) {
    return "";
  }

  const gridClass = sections.length >= 3 ? "seo-grid" : "two-column-grid";
  return `
          <div class="${gridClass}">
            ${sections
              .map(
                (section) => `
            <article class="detail-card">
              <h2>${escapeHtml(section.title)}</h2>
              ${renderParagraphs(section.paragraphs)}
              ${renderMetaList(section.bullets)}
            </article>`
              )
              .join("")}
          </div>`;
};

const renderSteps = (steps) => {
  if (!steps?.items?.length) {
    return "";
  }

  return `
          <div class="content-band">
            <h2>${escapeHtml(steps.title)}</h2>
          </div>
          <div class="booking-grid">
            ${steps.items
              .map(
                (item, index) => `
            <article class="step-card">
              <span>${String(index + 1).padStart(2, "0")}</span>
              <h3>${escapeHtml(item.title)}</h3>
              <p>${escapeHtml(item.description)}</p>
            </article>`
              )
              .join("")}
          </div>`;
};

const renderComparison = (comparison) => {
  if (!comparison?.rows?.length) {
    return "";
  }

  return `
          <div class="content-band">
            <h2>${escapeHtml(comparison.title)}</h2>
            <p>${escapeHtml(comparison.intro)}</p>
            <table class="info-table">
              <tbody>
                <tr>
                  <th>比較項目</th>
                  <td>${escapeHtml(comparison.headers[0])}</td>
                  <td>${escapeHtml(comparison.headers[1])}</td>
                </tr>
                ${comparison.rows
                  .map(
                    (row) => `
                <tr>
                  <th>${escapeHtml(row.label)}</th>
                  <td>${escapeHtml(row.left)}</td>
                  <td>${escapeHtml(row.right)}</td>
                </tr>`
                  )
                  .join("")}
              </tbody>
            </table>
          </div>`;
};

const renderFaq = (faq = []) => {
  if (!faq.length) {
    return "";
  }

  return `
          <div class="faq-grid">
            ${faq
              .map(
                (item) => `
            <article class="faq-item">
              <h3>${escapeHtml(item.question)}</h3>
              <p>${escapeHtml(item.answer)}</p>
            </article>`
              )
              .join("")}
          </div>`;
};

const renderRelatedLinks = (relatedPages = [], lookup = {}) => {
  if (!relatedPages.length) {
    return "";
  }

  return `
          <nav class="related-links" aria-label="相關頁面">
            <span>延伸閱讀</span>
            ${relatedPages
              .map((routePath) => {
                const label = lookup[routePath] ?? routePath;
                return `<a href="${routePath}">${escapeHtml(label)}</a>`;
              })
              .join("")}
          </nav>`;
};

const renderCta = (cta) => {
  if (!cta?.label || !cta?.url) {
    return "";
  }

  return `
          <div class="content-band">
            <h2>下一步</h2>
            <p>${escapeHtml(cta.text)}</p>
            <div class="hero-actions">
              <a class="button button-primary" href="${cta.url}">${escapeHtml(cta.label)}</a>
            </div>
          </div>`;
};

const renderSummaryCards = (entry) => `
          <div class="two-column-grid">
            <article class="detail-card">
              <h2>這頁在說什麼</h2>
              <ul class="meta-list">
                <li>${escapeHtml(entry.summary.whatThisPage)}</li>
                <li>${escapeHtml(entry.summary.problemsSolved)}</li>
              </ul>
            </article>
            <article class="detail-card">
              <h2>適合誰閱讀</h2>
              <ul class="meta-list">
                <li>${escapeHtml(entry.summary.whoFor)}</li>
                <li>${escapeHtml(entry.summary.nextStep)}</li>
              </ul>
            </article>
          </div>`;

const buildDetailSchemaGraph = ({ entry, site, absoluteUrl, ogImage, crumbs }) => {
  const nodes = [
    buildOrganizationNode(site),
    buildWebSiteNode(site),
    buildLodgingBusinessNode(site),
    buildWebPageNode({
      site,
      absoluteUrl,
      title: entry.title,
      description: entry.description,
      image: ogImage
    }),
    buildBreadcrumbNode(crumbs),
    buildFaqNode(entry.faq)
  ];

  if (entry.baseRoute === "stays") {
    nodes.push(
      buildServiceNode({
        site,
        absoluteUrl,
        name: entry.h1,
        description: entry.introDefinition,
        serviceType: "西莒住宿房型與入住規劃",
        audience: entry.audience,
        image: ogImage
      })
    );
  }

  if (entry.baseRoute === "travel-guides") {
    nodes.push(
      buildArticleNode({
        site,
        absoluteUrl,
        headline: entry.h1,
        description: entry.description,
        image: ogImage
      }),
      buildHowToNode({
        absoluteUrl,
        name: entry.steps?.title || entry.h1,
        description: entry.heroLead || entry.description,
        steps: entry.steps?.items || [],
        image: ogImage
      }),
      buildServiceNode({
        site,
        absoluteUrl,
        name: `${entry.h1}｜住宿與行程規劃`,
        description: entry.introDefinition,
        serviceType: "西莒住宿與行程規劃",
        audience: entry.audience,
        image: ogImage
      })
    );
  }

  return renderJsonLdGraph(nodes);
};

const buildCollectionSchemaGraph = ({ collection, pages, site, absoluteUrl, ogImage, crumbs }) => {
  const pageNode = buildWebPageNode({
    site,
    absoluteUrl,
    title: collection.title,
    description: collection.description,
    pageType: "CollectionPage",
    image: ogImage
  });

  pageNode.mainEntity = {
    "@type": "ItemList",
    itemListElement: pages.map((entry, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: entry.h1,
      url: toAbsoluteUrl(site.baseUrl, routeForEntry(entry))
    }))
  };

  return renderJsonLdGraph([
    buildOrganizationNode(site),
    buildWebSiteNode(site),
    buildLodgingBusinessNode(site),
    pageNode,
    buildBreadcrumbNode(crumbs)
  ]);
};

const renderDetailPage = ({ entry, site, routePath, lookup, collectionLookup }) => {
  const relativeRoot = relativeRootPrefix(routePath);
  const absoluteUrl = toAbsoluteUrl(site.baseUrl, routePath);
  const ogImage = toAbsoluteUrl(site.baseUrl, `/${entry.heroImage}`.replace("//", "/"));
  const robotsContent = entry.indexable ? "index, follow, max-image-preview:large" : "noindex, follow, max-image-preview:large";
  const collection = collectionLookup[entry.baseRoute];
  const crumbs = [
    { name: "首頁", item: toAbsoluteUrl(site.baseUrl, "/"), href: "/" },
    { name: collection.h1, item: toAbsoluteUrl(site.baseUrl, routeForCollection(collection)), href: routeForCollection(collection) },
    { name: entry.h1, item: absoluteUrl, href: routePath }
  ];

  return `<!DOCTYPE html>
<html lang="zh-Hant">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${escapeHtml(entry.title)}</title>
    <meta name="description" content="${escapeHtml(entry.description)}" />
    <meta name="robots" content="${robotsContent}" />
    <meta name="author" content="${escapeHtml(site.brandName)}" />
    <meta name="theme-color" content="#0c3b46" />
    <link rel="canonical" href="${absoluteUrl}" />
    <link rel="icon" href="/favicon.ico" sizes="any" />
    <link rel="icon" href="/assets/images/favicon-48.png" type="image/png" sizes="48x48" />
    <link rel="apple-touch-icon" href="/assets/images/apple-touch-icon.png" />
    <link rel="manifest" href="/site.webmanifest" />
    <meta property="og:title" content="${escapeHtml(entry.title)}" />
    <meta property="og:description" content="${escapeHtml(entry.description)}" />
    <meta property="og:type" content="article" />
    <meta property="og:locale" content="zh_TW" />
    <meta property="og:site_name" content="${escapeHtml(site.brandName)}" />
    <meta property="og:url" content="${absoluteUrl}" />
    <meta property="og:image" content="${ogImage}" />
    <meta property="og:image:alt" content="${escapeHtml(entry.heroImageAlt)}" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escapeHtml(entry.title)}" />
    <meta name="twitter:description" content="${escapeHtml(entry.description)}" />
    <meta name="twitter:image" content="${ogImage}" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@400;500;700;800&family=Noto+Serif+TC:wght@500;700&display=swap" rel="stylesheet" />
    <link rel="stylesheet" href="${relativeRoot}styles.css?v=${CACHE_BUST}" />
${buildDetailSchemaGraph({ entry, site, absoluteUrl, ogImage, crumbs })}
  </head>
  <body>
    <div class="page-shell">
${renderHeader(relativeRoot)}
${renderBreadcrumbNav(crumbs)}
      <main>
        <section class="section page-hero">
          <img src="${relativeRoot}${entry.heroImage}" alt="${escapeHtml(entry.heroImageAlt)}" />
          <div class="page-hero-copy">
            <p class="eyebrow">${escapeHtml(entry.heroEyebrow)}</p>
            <h1>${escapeHtml(entry.h1)}</h1>
            <p>${escapeHtml(entry.heroLead)}</p>
          </div>
        </section>

        <section class="section">
          <div class="content-band">
            <p class="eyebrow">Definition</p>
            <h2>${escapeHtml(entry.targetKeyword)}是什麼？</h2>
            <p>${escapeHtml(entry.introDefinition)}</p>
          </div>

${renderSummaryCards(entry)}
${renderSections(entry.sections)}
${renderSteps(entry.steps)}
${renderComparison(entry.comparison)}
${renderFaq(entry.faq)}
${renderCta(entry.cta)}
${renderRelatedLinks(entry.relatedPages, lookup)}
        </section>
      </main>
${renderFooter(site)}
    </div>
    <script src="${relativeRoot}script.js"></script>
  </body>
</html>`;
};

const renderCollectionHub = ({ collection, pages, site, routePath, lookup }) => {
  const relativeRoot = relativeRootPrefix(routePath);
  const absoluteUrl = toAbsoluteUrl(site.baseUrl, routePath);
  const ogImage = toAbsoluteUrl(site.baseUrl, "/assets/images/banner-1.jpg");
  const crumbs = [
    { name: "首頁", item: toAbsoluteUrl(site.baseUrl, "/"), href: "/" },
    { name: collection.h1, item: absoluteUrl, href: routePath }
  ];

  return `<!DOCTYPE html>
<html lang="zh-Hant">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${escapeHtml(collection.title)}</title>
    <meta name="description" content="${escapeHtml(collection.description)}" />
    <meta name="robots" content="index, follow, max-image-preview:large" />
    <meta name="author" content="${escapeHtml(site.brandName)}" />
    <meta name="theme-color" content="#0c3b46" />
    <link rel="canonical" href="${absoluteUrl}" />
    <link rel="icon" href="/favicon.ico" sizes="any" />
    <link rel="icon" href="/assets/images/favicon-48.png" type="image/png" sizes="48x48" />
    <link rel="apple-touch-icon" href="/assets/images/apple-touch-icon.png" />
    <link rel="manifest" href="/site.webmanifest" />
    <meta property="og:title" content="${escapeHtml(collection.title)}" />
    <meta property="og:description" content="${escapeHtml(collection.description)}" />
    <meta property="og:type" content="website" />
    <meta property="og:locale" content="zh_TW" />
    <meta property="og:site_name" content="${escapeHtml(site.brandName)}" />
    <meta property="og:url" content="${absoluteUrl}" />
    <meta property="og:image" content="${ogImage}" />
    <meta property="og:image:alt" content="${escapeHtml(collection.h1)}" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escapeHtml(collection.title)}" />
    <meta name="twitter:description" content="${escapeHtml(collection.description)}" />
    <meta name="twitter:image" content="${ogImage}" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@400;500;700;800&family=Noto+Serif+TC:wght@500;700&display=swap" rel="stylesheet" />
    <link rel="stylesheet" href="${relativeRoot}styles.css?v=${CACHE_BUST}" />
${buildCollectionSchemaGraph({ collection, pages, site, absoluteUrl, ogImage, crumbs })}
  </head>
  <body>
    <div class="page-shell">
${renderHeader(relativeRoot)}
${renderBreadcrumbNav(crumbs)}
      <main>
        <section class="section page-hero">
          <img src="${relativeRoot}assets/images/banner-1.jpg" alt="${escapeHtml(collection.h1)}" />
          <div class="page-hero-copy">
            <p class="eyebrow">Collection</p>
            <h1>${escapeHtml(collection.h1)}</h1>
            <p>${escapeHtml(collection.description)}</p>
          </div>
        </section>

        <section class="section">
          <div class="content-band">
            <p class="eyebrow">Quick Definition</p>
            <h2>${escapeHtml(collection.targetKeyword)}是什麼？</h2>
            <p>${escapeHtml(collection.description)}</p>
          </div>

          <div class="two-column-grid">
            <article class="detail-card">
              <h2>適合誰閱讀</h2>
              ${renderMetaList(collection.audience)}
            </article>
            <article class="detail-card">
              <h2>這個集合能解決什麼問題</h2>
              ${renderMetaList(collection.painPoints)}
            </article>
          </div>

          <div class="seo-grid">
            ${pages
              .map(
                (entry) => `
            <article class="detail-card">
              <h2>${escapeHtml(entry.h1)}</h2>
              <p>${escapeHtml(entry.description)}</p>
              ${renderMetaList([`搜尋意圖：${entry.searchIntent}`, `目標關鍵字：${entry.targetKeyword}`])}
              <a class="text-link" href="${routeForEntry(entry)}">查看這頁</a>
            </article>`
              )
              .join("")}
          </div>

          <div class="content-band">
            <h2>下一步</h2>
            <p>${escapeHtml(collection.cta.text)}</p>
            <div class="hero-actions">
              <a class="button button-primary" href="${collection.cta.url}">${escapeHtml(collection.cta.label)}</a>
            </div>
          </div>

          ${renderRelatedLinks(
            pages.slice(0, 4).map((entry) => routeForEntry(entry)),
            lookup
          )}
        </section>
      </main>
${renderFooter(site)}
    </div>
    <script src="${relativeRoot}script.js"></script>
  </body>
</html>`;
};

const renderSitemap = ({ site, generatedRoutes }) => {
  const today = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Taipei",
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).format(new Date());
  const urls = [
    ...ROOT_PAGES.map((page) => ({
      loc: toAbsoluteUrl(site.baseUrl, page.loc),
      priority: page.priority
    })),
    ...generatedRoutes
  ];

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (item) => `  <url>
    <loc>${item.loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>${item.priority}</priority>
  </url>`
  )
  .join("\n")}
</urlset>
`;
};

const ensureDir = async (targetPath) => {
  await fs.mkdir(targetPath, { recursive: true });
};

const main = async () => {
  const raw = await fs.readFile(DATA_PATH, "utf8");
  const data = JSON.parse(raw);
  const { site, collections, pages } = data;

  const publishedPages = pages.filter((page) => page.published);
  const collectionLookup = Object.fromEntries(collections.map((collection) => [collection.baseRoute, collection]));

  const routeLabelLookup = {
    "/": "首頁",
    "/rooms.html": "房型資訊",
    "/booking.html": "訂房方式",
    "/access.html": "交通位置",
    "/xiju-travel.html": "西莒旅行",
    "/faq.html": "常見問題",
    "/gallery.html": "山海影像"
  };

  collections.forEach((collection) => {
    routeLabelLookup[routeForCollection(collection)] = collection.h1;
  });

  publishedPages.forEach((page) => {
    routeLabelLookup[routeForEntry(page)] = page.navLabel ?? page.h1;
  });

  const generatedRoutes = [];

  for (const collection of collections) {
    const collectionPages = publishedPages.filter((page) => page.baseRoute === collection.baseRoute && page.indexable);
    const routePath = routeForCollection(collection);
    const dirPath = path.join(cwd, collection.baseRoute);
    await ensureDir(dirPath);
    const html = renderCollectionHub({
      collection,
      pages: collectionPages,
      site,
      routePath,
      lookup: routeLabelLookup
    });
    await fs.writeFile(path.join(dirPath, "index.html"), html, "utf8");
    generatedRoutes.push({
      loc: toAbsoluteUrl(site.baseUrl, routePath),
      priority: "0.85"
    });
  }

  for (const entry of publishedPages) {
    const routePath = routeForEntry(entry);
    const dirPath = path.join(cwd, entry.baseRoute, entry.slug);
    await ensureDir(dirPath);
    const html = renderDetailPage({
      entry,
      site,
      routePath,
      lookup: routeLabelLookup,
      collectionLookup
    });
    await fs.writeFile(path.join(dirPath, "index.html"), html, "utf8");

    if (entry.indexable) {
      generatedRoutes.push({
        loc: toAbsoluteUrl(site.baseUrl, routePath),
        priority: entry.category === "compare" ? "0.78" : "0.8"
      });
    }
  }

  const sitemap = renderSitemap({ site, generatedRoutes });
  await fs.writeFile(path.join(cwd, "sitemap.xml"), sitemap, "utf8");
};

await main();
