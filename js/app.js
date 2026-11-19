(function () {
  "use strict";

  const {
    MASS_SCHEDULES,
    DAILY_READINGS,
    SACRAMENTS,
    CONCERTS,
    EVENTS,
    FAQS,
    FUNDS
  } = window.CathedralData;

  /* --------------------------------------------------------------------------
     Utilities
  -------------------------------------------------------------------------- */
  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  let toastTimer = null;
  function showToast(message) {
    const toast = document.getElementById("toast");
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add("is-visible");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toast.classList.remove("is-visible");
    }, 3600);
  }

  /* --------------------------------------------------------------------------
     Dynamic Next Mass Status in Utility Bar
  -------------------------------------------------------------------------- */
  function updateNextMassStatus() {
    const el = document.getElementById("next-mass-status");
    if (!el) return;

    const now = new Date();
    const day = now.getDay(); // 0 = Sun, 6 = Sat
    const minsNow = now.getHours() * 60 + now.getMinutes();

    const sundayTimes = [
      { m: 7 * 60, label: "7:00 AM Mass" },
      { m: 8 * 60, label: "8:00 AM Mass" },
      { m: 9 * 60, label: "9:00 AM Family Mass" },
      { m: 10 * 60 + 15, label: "10:15 AM Solemn Mass" },
      { m: 12 * 60, label: "12:00 PM Mass" },
      { m: 13 * 60, label: "1:00 PM Mass" },
      { m: 16 * 60, label: "4:00 PM Misa en Español" },
      { m: 17 * 60 + 30, label: "5:30 PM Evening Mass" }
    ];

    const weekdayTimes = [
      { m: 7 * 60, label: "7:00 AM Mass" },
      { m: 7 * 60 + 30, label: "7:30 AM Mass" },
      { m: 8 * 60, label: "8:00 AM Mass" },
      { m: 12 * 60, label: "12:00 PM Midday Mass" },
      { m: 13 * 60, label: "1:00 PM Mass" },
      { m: 17 * 60 + 30, label: "5:30 PM Evening Mass" }
    ];

    const satTimes = [
      { m: 7 * 60, label: "7:00 AM Mass" },
      { m: 8 * 60, label: "8:00 AM Mass" },
      { m: 12 * 60, label: "12:00 PM Mass" },
      { m: 17 * 60 + 30, label: "5:30 PM Sunday Vigil Mass" }
    ];

    const list = day === 0 ? sundayTimes : day === 6 ? satTimes : weekdayTimes;
    const next = list.find((item) => item.m > minsNow);

    el.textContent = next
      ? `Next Mass Today: ${next.label}`
      : "Next Mass: Tomorrow at 7:00 AM (Main Altar)";
  }

  /* --------------------------------------------------------------------------
     Sticky Header & Mobile Drawer
  -------------------------------------------------------------------------- */
  function initHeader() {
    const header = document.getElementById("site-header");
    const mobileBtn = document.getElementById("mobile-menu-btn");
    const mobileDrawer = document.getElementById("mobile-drawer");

    window.addEventListener("scroll", () => {
      if (!header) return;
      header.classList.toggle("is-scrolled", window.scrollY > 24);
    });

    if (mobileBtn && mobileDrawer) {
      mobileBtn.addEventListener("click", () => {
        const isOpen = mobileDrawer.classList.toggle("is-open");
        mobileBtn.setAttribute("aria-expanded", String(isOpen));
      });

      mobileDrawer.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", () => {
          mobileDrawer.classList.remove("is-open");
          mobileBtn.setAttribute("aria-expanded", "false");
        });
      });
    }
  }

  /* --------------------------------------------------------------------------
     Mass & Confession Schedule Tabs + Daily Readings
  -------------------------------------------------------------------------- */
  function initSchedules() {
    const tabsContainer = document.getElementById("schedule-tabs");
    const panel = document.getElementById("schedule-panel");
    const readingsEl = document.getElementById("daily-readings-card");

    function renderSchedule(key) {
      const data = MASS_SCHEDULES[key];
      if (!data || !panel) return;

      panel.innerHTML = `
        <h3 class="schedule-panel__title">${escapeHtml(data.title)}</h3>
        <p class="schedule-panel__sub">${escapeHtml(data.subtitle)}</p>
        <ul class="schedule-list">
          ${data.items
            .map(
              (item) => `
            <li class="schedule-row">
              <span class="schedule-row__time">${escapeHtml(item.time)}</span>
              <div>
                <span class="schedule-row__name">${escapeHtml(item.name)}</span>
                <span class="schedule-row__note">${escapeHtml(item.note)}</span>
              </div>
              <span></span>
            </li>
          `
            )
            .join("")}
        </ul>
      `;

      panel.querySelectorAll("[data-open-modal]").forEach((btn) => {
        btn.addEventListener("click", () => openModal(btn.getAttribute("data-open-modal")));
      });
    }

    if (tabsContainer) {
      tabsContainer.querySelectorAll(".tab-btn").forEach((btn) => {
        btn.addEventListener("click", () => {
          tabsContainer.querySelectorAll(".tab-btn").forEach((b) => b.classList.remove("is-active"));
          btn.classList.add("is-active");
          renderSchedule(btn.getAttribute("data-schedule"));
        });
      });
    }

    renderSchedule("sunday");

    if (readingsEl) {
      readingsEl.innerHTML = `
        <span class="eyebrow eyebrow--light">Today's Liturgy · ${escapeHtml(DAILY_READINGS.color)}</span>
        <h3 class="readings-card__day">${escapeHtml(DAILY_READINGS.liturgicalDay)}</h3>
        <div class="readings-list">
          <div>
            <span class="reading-item__label">First Reading</span>
            <span class="reading-item__ref">${escapeHtml(DAILY_READINGS.firstReading)}</span>
          </div>
          <div>
            <span class="reading-item__label">Responsorial Psalm</span>
            <span class="reading-item__ref">${escapeHtml(DAILY_READINGS.psalm)}</span>
          </div>
          <div>
            <span class="reading-item__label">Holy Gospel</span>
            <span class="reading-item__ref">${escapeHtml(DAILY_READINGS.gospel)}</span>
          </div>
        </div>
        <blockquote class="readings-card__quote">${escapeHtml(DAILY_READINGS.reflection)}</blockquote>
        <a href="#sacraments" class="btn btn--gold btn--sm">
          Explore Sacraments &amp; Mass Cards
        </a>
      `;
    }
  }

  /* --------------------------------------------------------------------------
     Sacraments Cards & Detail Modal
  -------------------------------------------------------------------------- */
  function initSacraments() {
    const grid = document.getElementById("sacraments-grid");
    const modalBody = document.getElementById("sacrament-modal-body");
    if (!grid) return;

    grid.innerHTML = SACRAMENTS.map(
      (s) => `
      <article class="card">
        <div>
          <span class="eyebrow">${escapeHtml(s.eyebrow)}</span>
          <h3 class="card__title">${escapeHtml(s.title)}</h3>
          <p class="card__body">${escapeHtml(s.summary)}</p>
        </div>
        <button type="button" class="card__link" data-sacrament-id="${escapeHtml(s.id)}">
          Learn More &amp; Guidelines →
        </button>
      </article>
    `
    ).join("");

    grid.querySelectorAll("[data-sacrament-id]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const item = SACRAMENTS.find((s) => s.id === btn.getAttribute("data-sacrament-id"));
        if (!item || !modalBody) return;

        modalBody.innerHTML = `
          <span class="eyebrow">${escapeHtml(item.eyebrow)}</span>
          <h2 class="section-heading" style="font-size: 2.1rem;">${escapeHtml(item.title)}</h2>
          <div class="gold-rule"></div>
          <p style="color: var(--ink-muted); font-size: 1rem;">${escapeHtml(item.details)}</p>
          <div style="margin: 22px 0; padding: 14px 16px; background: var(--limestone); border: 1px solid var(--border); border-radius: var(--radius-sm); font-size: 0.9rem;">
            <strong>Pastoral Contact:</strong> ${escapeHtml(item.contact)}
          </div>
          <div style="display:flex; gap:10px; flex-wrap:wrap;">
            <button type="button" class="btn btn--navy" id="sacrament-request-btn">${escapeHtml(item.actionLabel)}</button>
            <button type="button" class="btn btn--outline-dark" data-close-modal>Close</button>
          </div>
        `;

        modalBody.querySelector("#sacrament-request-btn")?.addEventListener("click", () => {
          closeAllModals();
          showToast(`Inquiry opened for ${item.title}. Our Parish House team will respond within 1 business day.`);
        });

        modalBody.querySelector("[data-close-modal]")?.addEventListener("click", closeAllModals);
        openModal("sacrament-modal");
      });
    });
  }

  /* --------------------------------------------------------------------------
     Music & Concerts
  -------------------------------------------------------------------------- */
  function initConcerts() {
    const container = document.getElementById("concert-list");
    if (!container) return;

    container.innerHTML = CONCERTS.map((c) => {
      const [month, day] = c.date.split(" ");
      return `
        <article class="concert-item">
          <div class="concert-date">
            <span class="concert-date__month">${escapeHtml(month)}</span>
            <span class="concert-date__day">${escapeHtml(day)}</span>
          </div>
          <div>
            <span class="eyebrow">${escapeHtml(c.series)}</span>
            <h3 class="concert-item__title">${escapeHtml(c.title)}</h3>
            <div class="concert-item__meta">${escapeHtml(c.dayTime)} · ${escapeHtml(c.performer)}</div>
            <div class="concert-item__meta" style="margin-top:4px;">${escapeHtml(c.location)}</div>
          </div>
        </article>
      `;
    }).join("");
  }

  /* --------------------------------------------------------------------------
     Upcoming Events + Filter + ICS Download
  -------------------------------------------------------------------------- */
  function downloadEventIcs(evt) {
    const icsContent = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//Cathedral Parish//Website//EN",
      "BEGIN:VEVENT",
      `SUMMARY:${evt.title}`,
      `LOCATION:${evt.location} - 5th Ave & 50th St`,
      `DESCRIPTION:${evt.description}`,
      "DTSTART:20261201T151500Z",
      "DTEND:20261201T163000Z",
      "END:VEVENT",
      "END:VCALENDAR"
    ].join("\r\n");

    const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${evt.id}.ics`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast(`Calendar invite downloaded for "${evt.title}".`);
  }

  function initEvents() {
    const filterContainer = document.getElementById("event-filters");
    const listEl = document.getElementById("events-list");
    if (!listEl) return;

    function renderEvents(category) {
      const items =
        category === "all" ? EVENTS : EVENTS.filter((e) => e.category === category);

      listEl.innerHTML = items
        .map(
          (evt) => `
        <article class="event-card">
          <div class="event-card__date">
            <span class="event-card__month">${escapeHtml(evt.dateMonth)}</span>
            <span class="event-card__day">${escapeHtml(evt.dateDay)}</span>
          </div>
          <div>
            <h3 class="event-card__title">${escapeHtml(evt.title)}</h3>
            <div class="event-card__meta">${escapeHtml(evt.time)} · ${escapeHtml(evt.location)}</div>
            <p class="event-card__desc">${escapeHtml(evt.description)}</p>
            <button type="button" class="card__link" data-ics-id="${escapeHtml(evt.id)}">
              + Add to Calendar (.ics)
            </button>
          </div>
        </article>
      `
        )
        .join("");

      listEl.querySelectorAll("[data-ics-id]").forEach((btn) => {
        btn.addEventListener("click", () => {
          const evt = EVENTS.find((e) => e.id === btn.getAttribute("data-ics-id"));
          if (evt) downloadEventIcs(evt);
        });
      });
    }

    if (filterContainer) {
      filterContainer.querySelectorAll(".tab-btn").forEach((btn) => {
        btn.addEventListener("click", () => {
          filterContainer.querySelectorAll(".tab-btn").forEach((b) => b.classList.remove("is-active"));
          btn.classList.add("is-active");
          renderEvents(btn.getAttribute("data-filter"));
        });
      });
    }

    renderEvents("all");
  }

  /* --------------------------------------------------------------------------
     Stewardship & Giving Widget
  -------------------------------------------------------------------------- */
  function initGiving() {
    const fundSelect = document.getElementById("give-fund");
    const fundDesc = document.getElementById("give-fund-desc");
    const amountBtns = document.querySelectorAll(".amount-btn");
    const customInput = document.getElementById("give-custom-amount");
    const freqBtns = document.querySelectorAll("[data-freq]");
    const form = document.getElementById("give-form");

    let selectedAmount = 50;
    let frequency = "One-Time Gift";

    if (fundSelect) {
      fundSelect.innerHTML = FUNDS.map(
        (f) => `<option value="${escapeHtml(f.id)}">${escapeHtml(f.label)}</option>`
      ).join("");

      const updateDesc = () => {
        const found = FUNDS.find((f) => f.id === fundSelect.value);
        if (found && fundDesc) fundDesc.textContent = found.desc;
      };
      fundSelect.addEventListener("change", updateDesc);
      updateDesc();
    }

    amountBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        amountBtns.forEach((b) => b.classList.remove("is-active"));
        btn.classList.add("is-active");
        selectedAmount = Number(btn.getAttribute("data-amount"));
        if (customInput) customInput.value = "";
      });
    });

    if (customInput) {
      customInput.addEventListener("input", () => {
        if (customInput.value.trim()) {
          amountBtns.forEach((b) => b.classList.remove("is-active"));
          selectedAmount = Number(customInput.value);
        }
      });
    }

    freqBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        freqBtns.forEach((b) => b.classList.remove("is-active"));
        btn.classList.add("is-active");
        frequency = btn.getAttribute("data-freq");
      });
    });

    if (form) {
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        const finalAmt = Number(customInput?.value || selectedAmount);
        if (!finalAmt || finalAmt <= 0) {
          showToast("Please select or enter a valid gift amount.");
          return;
        }
        const fundName = FUNDS.find((f) => f.id === fundSelect?.value)?.label || "Cathedral Fund";
        showToast(`Thank you for your $${finalAmt.toLocaleString()} ${frequency.toLowerCase()} to ${fundName}.`);
      });
    }
  }

  /* --------------------------------------------------------------------------
     FAQ Accordion & Newsletter
  -------------------------------------------------------------------------- */
  function initFaqs() {
    const faqList = document.getElementById("faq-list");
    if (!faqList) return;

    faqList.innerHTML = FAQS.map(
      (item, idx) => `
      <div class="faq-item ${idx === 0 ? "is-open" : ""}">
        <button type="button" class="faq-btn" aria-expanded="${idx === 0}">
          <span>${escapeHtml(item.q)}</span>
          <span class="faq-icon" aria-hidden="true">+</span>
        </button>
        <div class="faq-answer">${escapeHtml(item.a)}</div>
      </div>
    `
    ).join("");

    faqList.querySelectorAll(".faq-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const parent = btn.closest(".faq-item");
        if (!parent) return;
        const isOpen = parent.classList.toggle("is-open");
        btn.setAttribute("aria-expanded", String(isOpen));
      });
    });
  }

  function initNewsletter() {
    const form = document.getElementById("newsletter-form");
    if (!form) return;
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const emailInput = form.querySelector("input[type='email']");
      if (!emailInput?.value.trim()) return;
      showToast(`Subscribed ${emailInput.value.trim()} to weekly Cathedral Parish notes.`);
      form.reset();
    });
  }

  /* --------------------------------------------------------------------------
     Modals & Global Search
  -------------------------------------------------------------------------- */
  function openModal(id) {
    closeAllModals();
    const modal = document.getElementById(id);
    if (modal) {
      modal.classList.add("is-open");
      document.body.style.overflow = "hidden";
      const focusTarget = modal.querySelector("input, button");
      focusTarget?.focus();
    }
  }

  function closeAllModals() {
    document.querySelectorAll(".modal-backdrop").forEach((m) => m.classList.remove("is-open"));
    document.body.style.overflow = "";
  }

  function initModalsAndSearch() {
    document.querySelectorAll("[data-open-modal]").forEach((trigger) => {
      trigger.addEventListener("click", () => {
        openModal(trigger.getAttribute("data-open-modal"));
      });
    });

    document.querySelectorAll(".modal-backdrop").forEach((backdrop) => {
      backdrop.addEventListener("click", (e) => {
        if (e.target === backdrop) closeAllModals();
      });
    });

    document.querySelectorAll("[data-close-modal]").forEach((btn) => {
      btn.addEventListener("click", closeAllModals);
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeAllModals();
    });

    // Search Modal Logic
    const searchInput = document.getElementById("site-search-input");
    const searchResults = document.getElementById("site-search-results");

    if (searchInput && searchResults) {
      const corpus = [
        ...SACRAMENTS.map((s) => ({ title: s.title, desc: s.summary, href: "#sacraments" })),
        ...EVENTS.map((e) => ({ title: e.title, desc: `${e.dateMonth} ${e.dateDay} · ${e.time}`, href: "#events" })),
        ...CONCERTS.map((c) => ({ title: c.title, desc: `${c.series} · ${c.dayTime}`, href: "#music" })),
        ...FAQS.map((f) => ({ title: f.q, desc: f.a, href: "#visit" }))
      ];

      const renderResults = (query) => {
        const q = query.trim().toLowerCase();
        const matches = q
          ? corpus.filter(
              (item) =>
                item.title.toLowerCase().includes(q) || item.desc.toLowerCase().includes(q)
            )
          : corpus.slice(0, 5);

        if (!matches.length) {
          searchResults.innerHTML = `<p style="color:var(--ink-muted);font-size:0.9rem;">No matching parish resources found for "${escapeHtml(query)}".</p>`;
          return;
        }

        searchResults.innerHTML = matches
          .slice(0, 6)
          .map(
            (m) => `
          <a href="${escapeHtml(m.href)}" class="info-item" data-search-link style="display:block; margin-bottom:10px;">
            <div class="info-item__title">${escapeHtml(m.title)}</div>
            <p class="info-item__text">${escapeHtml(m.desc)}</p>
          </a>
        `
          )
          .join("");

        searchResults.querySelectorAll("[data-search-link]").forEach((link) => {
          link.addEventListener("click", closeAllModals);
        });
      };

      searchInput.addEventListener("input", () => renderResults(searchInput.value));
      renderResults("");
    }
  }

  /* --------------------------------------------------------------------------
     Initialize Application
  -------------------------------------------------------------------------- */
  document.addEventListener("DOMContentLoaded", () => {
    updateNextMassStatus();
    initHeader();
    initSchedules();
    initSacraments();
    initConcerts();
    initEvents();
    initGiving();
    initFaqs();
    initNewsletter();
    initModalsAndSearch();
  });
})();
