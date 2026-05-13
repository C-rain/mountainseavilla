const DEFAULT_FACEBOOK_URL =
  "https://www.facebook.com/%E8%A5%BF%E8%8E%92%E5%B1%B1%E6%B5%B7%E4%B8%80%E5%AE%B6%E6%9C%83%E9%A4%A8-1983491898558309/";

const normalizeBaseUrl = (baseUrl) => String(baseUrl || "").replace(/\/+$/, "");

const toAbsoluteUrl = (baseUrl, routePath = "/") => {
  const normalizedBase = normalizeBaseUrl(baseUrl);
  if (!routePath) {
    return `${normalizedBase}/`;
  }

  if (/^https?:\/\//.test(routePath)) {
    return routePath;
  }

  if (!routePath.startsWith("/")) {
    return `${normalizedBase}/${routePath}`;
  }

  return `${normalizedBase}${routePath}`;
};

const resolvePhone = (site) => site.internationalPhone || "+886-836-88295";

const buildPostalAddress = (site) => ({
  "@type": "PostalAddress",
  addressCountry: "TW",
  addressRegion: "連江縣",
  addressLocality: "莒光鄉",
  postalCode: "211",
  streetAddress: site.streetAddress || "青帆村96-3號"
});

export const buildOrganizationNode = (site) => ({
  "@type": "Organization",
  "@id": `${normalizeBaseUrl(site.baseUrl)}/#organization`,
  name: site.brandName,
  alternateName: [site.alternateBrandName, "Mountain Sea Villa"].filter(Boolean),
  url: `${normalizeBaseUrl(site.baseUrl)}/`,
  logo: toAbsoluteUrl(site.baseUrl, "/assets/images/logo.jpg"),
  telephone: resolvePhone(site),
  email: site.email,
  sameAs: [site.mapUrl, site.facebookUrl || DEFAULT_FACEBOOK_URL].filter(Boolean),
  contactPoint: [
    {
      "@type": "ContactPoint",
      contactType: "customer service",
      telephone: resolvePhone(site),
      availableLanguage: ["zh-Hant", "zh-TW"]
    }
  ]
});

export const buildWebSiteNode = (site) => ({
  "@type": "WebSite",
  "@id": `${normalizeBaseUrl(site.baseUrl)}/#website`,
  url: `${normalizeBaseUrl(site.baseUrl)}/`,
  name: site.brandName,
  alternateName: [site.alternateBrandName, "Mountain Sea Villa"].filter(Boolean),
  publisher: {
    "@id": `${normalizeBaseUrl(site.baseUrl)}/#organization`
  },
  inLanguage: "zh-Hant-TW"
});

export const buildLodgingBusinessNode = (site, overrides = {}) => ({
  "@type": "LodgingBusiness",
  "@id": `${normalizeBaseUrl(site.baseUrl)}/#lodging`,
  name: site.alternateBrandName || site.brandName,
  alternateName: site.brandName,
  url: `${normalizeBaseUrl(site.baseUrl)}/`,
  logo: toAbsoluteUrl(site.baseUrl, "/assets/images/logo.jpg"),
  image: overrides.image || [
    toAbsoluteUrl(site.baseUrl, "/assets/images/banner-1.jpg"),
    toAbsoluteUrl(site.baseUrl, "/assets/images/exterior.jpg"),
    toAbsoluteUrl(site.baseUrl, "/assets/images/room-sea-new.jpg")
  ],
  description:
    overrides.description ||
    "位於馬祖西莒青帆村高點、可遠眺港口與海景的住宿會館，提供房型、訂房、交通與周邊旅遊資訊。",
  telephone: resolvePhone(site),
  email: site.email,
  address: buildPostalAddress(site),
  hasMap: site.mapUrl,
  areaServed: overrides.areaServed || "連江縣莒光鄉西莒",
  sameAs: [site.mapUrl, site.facebookUrl || DEFAULT_FACEBOOK_URL].filter(Boolean),
  parentOrganization: {
    "@id": `${normalizeBaseUrl(site.baseUrl)}/#organization`
  },
  ...overrides
});

export const buildWebPageNode = ({
  site,
  absoluteUrl,
  title,
  description,
  pageType = "WebPage",
  aboutId = `${normalizeBaseUrl(site.baseUrl)}/#lodging`,
  image
}) => {
  const node = {
    "@type": pageType,
    "@id": `${absoluteUrl}#webpage`,
    url: absoluteUrl,
    name: title,
    description,
    isPartOf: {
      "@id": `${normalizeBaseUrl(site.baseUrl)}/#website`
    },
    about: {
      "@id": aboutId
    },
    inLanguage: "zh-Hant-TW"
  };

  if (image) {
    node.primaryImageOfPage = {
      "@type": "ImageObject",
      url: image
    };
  }

  return node;
};

export const buildBreadcrumbNode = (crumbs) => ({
  "@type": "BreadcrumbList",
  itemListElement: crumbs.map((crumb, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: crumb.name,
    item: crumb.item
  }))
});

export const buildFaqNode = (faq = []) =>
  faq.length
    ? {
        "@type": "FAQPage",
        mainEntity: faq.map((item) => ({
          "@type": "Question",
          name: item.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: item.answer
          }
        }))
      }
    : null;

export const buildServiceNode = ({
  site,
  absoluteUrl,
  name,
  description,
  serviceType,
  audience = [],
  areaServed = "連江縣莒光鄉西莒",
  image
}) => {
  const node = {
    "@type": "Service",
    "@id": `${absoluteUrl}#service`,
    name,
    serviceType,
    description,
    provider: {
      "@id": `${normalizeBaseUrl(site.baseUrl)}/#lodging`
    },
    url: absoluteUrl,
    areaServed,
    inLanguage: "zh-Hant-TW"
  };

  if (image) {
    node.image = image;
  }

  if (audience.length) {
    node.audience = audience.map((item) => ({
      "@type": "Audience",
      audienceType: item
    }));
  }

  return node;
};

export const buildArticleNode = ({
  site,
  absoluteUrl,
  headline,
  description,
  image
}) => ({
  "@type": "Article",
  "@id": `${absoluteUrl}#article`,
  headline,
  description,
  image: image ? [image] : undefined,
  publisher: {
    "@id": `${normalizeBaseUrl(site.baseUrl)}/#organization`
  },
  mainEntityOfPage: {
    "@id": `${absoluteUrl}#webpage`
  },
  about: {
    "@id": `${normalizeBaseUrl(site.baseUrl)}/#lodging`
  },
  inLanguage: "zh-Hant-TW"
});

export const buildHowToNode = ({
  absoluteUrl,
  name,
  description,
  steps = [],
  image
}) => {
  if (!steps.length) {
    return null;
  }

  const node = {
    "@type": "HowTo",
    "@id": `${absoluteUrl}#howto`,
    name,
    description,
    step: steps.map((item, index) => ({
      "@type": "HowToStep",
      position: index + 1,
      name: item.title,
      text: item.description
    })),
    inLanguage: "zh-Hant-TW"
  };

  if (image) {
    node.image = image;
  }

  return node;
};

export const renderJsonLdGraph = (nodes = []) => `
    <script type="application/ld+json">
      ${JSON.stringify(
        {
          "@context": "https://schema.org",
          "@graph": nodes.filter(Boolean)
        },
        null,
        2
      )}
    </script>`;

export { toAbsoluteUrl };
