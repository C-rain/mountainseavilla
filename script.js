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
