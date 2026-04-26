const menuToggle = document.querySelector(".menu-toggle");
const siteNav = document.querySelector(".site-nav");
const navLinks = document.querySelectorAll(".site-nav a");
const revealItems = document.querySelectorAll("[data-reveal]");
const sections = document.querySelectorAll("main section[id]");
const yearNode = document.getElementById("year");

const heroImage = document.getElementById("heroImage");
const heroKicker = document.getElementById("heroKicker");
const heroTitle = document.getElementById("heroTitle");
const heroDots = document.querySelectorAll(".hero-dot");

const galleryItems = Array.from(document.querySelectorAll("[data-gallery]"));
const lightbox = document.getElementById("lightbox");
const lightboxImage = document.getElementById("lightboxImage");
const lightboxCaption = document.getElementById("lightboxCaption");
const lightboxClose = document.querySelector(".lightbox-close");
const lightboxPrev = document.querySelector(".lightbox-prev");
const lightboxNext = document.querySelector(".lightbox-next");

const filterButtons = document.querySelectorAll(".filter-button");
const roomCards = document.querySelectorAll(".room-card");

const roomSelect = document.getElementById("roomSelect");
const nightInput = document.getElementById("nightInput");
const guestInput = document.getElementById("guestInput");
const estimateOutput = document.getElementById("estimateOutput");

const ensureFloatingActions = () => {
  if (document.querySelector(".floating-actions")) {
    return;
  }

  document.querySelector(".page-shell")?.insertAdjacentHTML(
    "beforeend",
    `
      <div class="floating-actions" aria-label="快速聯絡">
        <a class="floating-action floating-call" href="tel:+88683688295" aria-label="撥打訂房專線">
          <svg aria-hidden="true" viewBox="0 0 24 24">
            <path d="M6.6 10.8c1.7 3.4 3.2 4.9 6.6 6.6l2.2-2.2c.3-.3.8-.4 1.2-.3 1.3.4 2.7.6 4.1.6.7 0 1.3.6 1.3 1.3v3.5c0 .7-.6 1.3-1.3 1.3C10.4 22 2 13.6 2 3.3 2 2.6 2.6 2 3.3 2h3.5c.7 0 1.3.6 1.3 1.3 0 1.4.2 2.8.6 4.1.1.4 0 .9-.3 1.2l-1.8 2.2z" />
          </svg>
          <span class="sr-only">電話</span>
        </a>
        <a class="floating-action floating-facebook" href="https://www.facebook.com/%E8%A5%BF%E8%8E%92%E5%B1%B1%E6%B5%B7%E4%B8%80%E5%AE%B6%E6%9C%83%E9%A4%A8-1983491898558309/" target="_blank" rel="noreferrer" aria-label="前往山海一家 Facebook">
          <svg aria-hidden="true" viewBox="0 0 24 24">
            <path d="M14.3 8.1V6.6c0-.7.5-.9.9-.9h2.2V2h-3.1c-3.4 0-4.8 2.1-4.8 4.7v1.4H6.8v3.8h2.7V22h4.8V11.9h3.2l.5-3.8h-3.7z" />
          </svg>
          <span class="sr-only">Facebook</span>
        </a>
        <a class="floating-action floating-line" href="https://line.me/ti/p/~0972098380" target="_blank" rel="noreferrer" aria-label="加入山海一家 Line">
          <svg aria-hidden="true" viewBox="0 0 24 24">
            <path d="M20.6 10.4c0-4.1-4.1-7.4-9.1-7.4s-9.1 3.3-9.1 7.4c0 3.7 3.3 6.8 7.8 7.3.3.1.7.2.8.5.1.3.1.6 0 .9l-.1.8c-.1.3-.2 1.1.8.6s5.4-3.2 7.4-5.4c1-1.2 1.5-2.9 1.5-4.7zM8.2 12.8H6.4c-.2 0-.4-.2-.4-.4V8.6c0-.2.2-.4.4-.4s.4.2.4.4V12h1.4c.2 0 .4.2.4.4s-.2.4-.4.4zm1.6-.4c0 .2-.2.4-.4.4s-.4-.2-.4-.4V8.6c0-.2.2-.4.4-.4s.4.2.4.4v3.8zm4.4 0c0 .2-.1.3-.3.4h-.1c-.1 0-.2-.1-.3-.2l-1.9-2.6v2.4c0 .2-.2.4-.4.4s-.4-.2-.4-.4V8.6c0-.2.1-.3.3-.4.2-.1.4 0 .5.2l1.9 2.6V8.6c0-.2.2-.4.4-.4s.4.2.4.4v3.8zm3.2-2.3c.2 0 .4.2.4.4s-.2.4-.4.4h-1.4V12h1.4c.2 0 .4.2.4.4s-.2.4-.4.4h-1.8c-.2 0-.4-.2-.4-.4V8.6c0-.2.2-.4.4-.4h1.8c.2 0 .4.2.4.4s-.2.4-.4.4h-1.4v1.1h1.4z" />
          </svg>
          <span class="sr-only">Line</span>
        </a>
        <a class="floating-action floating-map" href="https://share.google/b4YWjxrqz31nvUyzh" target="_blank" rel="noreferrer" aria-label="開啟 Google 地圖導航">
          <svg aria-hidden="true" viewBox="0 0 24 24">
            <path d="M12 2a7.5 7.5 0 0 0-7.5 7.5c0 5.2 6.5 11.8 6.8 12.1.4.4 1 .4 1.4 0 .3-.3 6.8-6.9 6.8-12.1A7.5 7.5 0 0 0 12 2zm0 10.2a2.7 2.7 0 1 1 0-5.4 2.7 2.7 0 0 1 0 5.4z" />
          </svg>
          <span class="sr-only">Google 地圖</span>
        </a>
      </div>
    `
  );
};

ensureFloatingActions();

const heroSlides = [
  {
    image: "./assets/images/banner-1.jpg",
    alt: "山海一家會館外觀",
    kicker: "Mountain Sea Villa",
    title: "山海一家會館外觀"
  },
  {
    image: "./assets/images/banner-2.jpg",
    alt: "山海一家山海拾味豐盛套餐",
    kicker: "Local Dining",
    title: "山海拾味豐盛套餐"
  },
  {
    image: "./assets/images/banner-3.jpg",
    alt: "西莒海岸夕陽景色",
    kicker: "Sunset View",
    title: "西莒海岸夕景"
  },
  {
    image: "./assets/images/banner-4.jpg",
    alt: "青帆港夜色",
    kicker: "Qingfan Harbor",
    title: "青帆港夜色"
  }
];

let activeHeroIndex = 0;
let activeGalleryIndex = 0;
let heroTimerId;

if (yearNode) {
  yearNode.textContent = new Date().getFullYear().toString();
}

const formatCurrency = (value) =>
  new Intl.NumberFormat("zh-TW", {
    style: "currency",
    currency: "TWD",
    maximumFractionDigits: 0
  }).format(value);

const setHeroSlide = (index) => {
  const nextIndex = (index + heroSlides.length) % heroSlides.length;
  const slide = heroSlides[nextIndex];

  activeHeroIndex = nextIndex;

  if (heroImage) {
    heroImage.src = slide.image;
    heroImage.alt = slide.alt;
  }

  if (heroKicker) {
    heroKicker.textContent = slide.kicker;
  }

  if (heroTitle) {
    heroTitle.textContent = slide.title;
  }

  heroDots.forEach((dot, dotIndex) => {
    dot.classList.toggle("is-active", dotIndex === activeHeroIndex);
  });
};

const startHeroTimer = () => {
  window.clearInterval(heroTimerId);
  heroTimerId = window.setInterval(() => {
    setHeroSlide(activeHeroIndex + 1);
  }, 5200);
};

heroDots.forEach((dot) => {
  dot.addEventListener("click", () => {
    setHeroSlide(Number(dot.dataset.slide ?? 0));
    startHeroTimer();
  });
});

if (heroDots.length > 0) {
  startHeroTimer();
}

if (menuToggle && siteNav) {
  menuToggle.addEventListener("click", () => {
    const isExpanded = menuToggle.getAttribute("aria-expanded") === "true";
    menuToggle.setAttribute("aria-expanded", String(!isExpanded));
    siteNav.classList.toggle("is-open", !isExpanded);
  });

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      menuToggle.setAttribute("aria-expanded", "false");
      siteNav.classList.remove("is-open");
    });
  });

  document.addEventListener("click", (event) => {
    if (!(event.target instanceof Node)) {
      return;
    }

    if (!siteNav.contains(event.target) && !menuToggle.contains(event.target)) {
      menuToggle.setAttribute("aria-expanded", "false");
      siteNav.classList.remove("is-open");
    }
  });
}

const openLightbox = (index) => {
  const item = galleryItems[index];

  if (!item || !lightbox || !lightboxImage || !lightboxCaption) {
    return;
  }

  activeGalleryIndex = index;
  lightboxImage.src = item.dataset.gallery ?? "";
  lightboxImage.alt = item.dataset.caption ?? "";
  lightboxCaption.textContent = item.dataset.caption ?? "";
  lightbox.classList.add("is-open");
  lightbox.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
  lightboxClose?.focus();
};

const closeLightbox = () => {
  if (!lightbox) {
    return;
  }

  lightbox.classList.remove("is-open");
  lightbox.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
};

const showLightboxImage = (direction) => {
  const nextIndex = (activeGalleryIndex + direction + galleryItems.length) % galleryItems.length;
  openLightbox(nextIndex);
};

galleryItems.forEach((item, index) => {
  item.addEventListener("click", () => openLightbox(index));
  item.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openLightbox(index);
    }
  });
});

lightboxClose?.addEventListener("click", closeLightbox);
lightboxPrev?.addEventListener("click", () => showLightboxImage(-1));
lightboxNext?.addEventListener("click", () => showLightboxImage(1));
lightbox?.addEventListener("click", (event) => {
  if (event.target === lightbox) {
    closeLightbox();
  }
});

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const filter = button.dataset.filter ?? "all";

    filterButtons.forEach((item) => item.classList.toggle("is-active", item === button));
    roomCards.forEach((card) => {
      const tags = card.getAttribute("data-room") ?? "";
      card.classList.toggle("is-hidden", filter !== "all" && !tags.includes(filter));
    });
  });
});

const updateEstimate = () => {
  if (!roomSelect || !nightInput || !guestInput || !estimateOutput) {
    return;
  }

  const price = Number(roomSelect.value);
  const nights = Math.max(Number(nightInput.value), 1);
  const guests = Math.max(Number(guestInput.value), 1);
  const isBackpacker = price === 800;
  const total = price * nights * (isBackpacker ? guests : 1);
  const deposit = Math.round(total / 2);

  estimateOutput.innerHTML = `
    <span>預估住宿費</span>
    <strong>${formatCurrency(total)}</strong>
    <span>建議訂金約 ${formatCurrency(deposit)}；實際房價、床位與人數限制仍請電話確認。</span>
  `;
};

[roomSelect, nightInput, guestInput].forEach((input) => {
  input?.addEventListener("input", updateEstimate);
  input?.addEventListener("change", updateEstimate);
});

updateEstimate();

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    menuToggle?.setAttribute("aria-expanded", "false");
    siteNav?.classList.remove("is-open");
    closeLightbox();
  }

  if (!lightbox?.classList.contains("is-open")) {
    return;
  }

  if (event.key === "ArrowLeft") {
    showLightboxImage(-1);
  }

  if (event.key === "ArrowRight") {
    showLightboxImage(1);
  }
});

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    {
      threshold: 0.16,
      rootMargin: "0px 0px -40px 0px"
    }
  );

  revealItems.forEach((item) => revealObserver.observe(item));

  const navObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const targetId = entry.target.getAttribute("id");

        if (!targetId || !entry.isIntersecting) {
          return;
        }

        navLinks.forEach((link) => {
          link.classList.toggle("is-active", link.getAttribute("href") === `#${targetId}`);
        });
      });
    },
    {
      threshold: 0.3,
      rootMargin: "-25% 0px -55% 0px"
    }
  );

  sections.forEach((section) => navObserver.observe(section));
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}
