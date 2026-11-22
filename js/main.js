const menuButton = document.getElementById("hamburger");
const navMenu = document.getElementById("navMenu");
const mobileLayout = window.matchMedia("(max-width: 900px)");

function setMenuOpen(open, returnFocus = false) {
  menuButton.setAttribute("aria-expanded", String(open));
  menuButton.setAttribute("aria-label", open ? "Close navigation" : "Open navigation");
  navMenu.classList.toggle("active", open);
  document.body.classList.toggle("menu-open", open);
  if (returnFocus) menuButton.focus();
}

menuButton.addEventListener("click", () => {
  setMenuOpen(menuButton.getAttribute("aria-expanded") !== "true");
});

navMenu.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => setMenuOpen(false));
});

document.addEventListener("keydown", (event) => {
  if (menuButton.getAttribute("aria-expanded") !== "true") return;
  if (event.key === "Escape") setMenuOpen(false, true);
  if (event.key === "Tab") {
    const lastLink = navMenu.querySelector("a:last-child");
    if (event.shiftKey && document.activeElement === menuButton) {
      event.preventDefault();
      lastLink.focus();
    } else if (!event.shiftKey && document.activeElement === lastLink) {
      event.preventDefault();
      menuButton.focus();
    }
  }
});

document.addEventListener("click", (event) => {
  if (!event.target.closest(".navbar") && menuButton.getAttribute("aria-expanded") === "true")
    setMenuOpen(false);
});
mobileLayout.addEventListener("change", () => setMenuOpen(false));

// All projects remain visible without JavaScript.
const filterGroup = document.querySelector(".project-filters");
const filters = Array.from(document.querySelectorAll("[data-filter]"));
const projects = Array.from(document.querySelectorAll(".project-card"));
const projectCount = document.getElementById("project-count");
const expandControl = document.querySelector(".project-expand");
const expandButton = document.getElementById("projects-toggle");
const previewCount = 4;
let activeCategory = "all";
let projectsExpanded = false;

function renderProjects() {
  const matching = projects.filter(
    (project) => activeCategory === "all" || project.dataset.category === activeCategory,
  );
  const visible = new Set(projectsExpanded ? matching : matching.slice(0, previewCount));
  projects.forEach((project) => {
    project.hidden = !visible.has(project);
  });
  filters.forEach((filter) => {
    const selected = filter.dataset.filter === activeCategory;
    filter.classList.toggle("active", selected);
    filter.setAttribute("aria-pressed", String(selected));
  });
  const categoryLabel =
    activeCategory === "ai"
      ? "AI & machine learning "
      : activeCategory === "mobile"
        ? "mobile "
        : "";
  projectCount.textContent = `Showing ${visible.size} of ${matching.length} ${categoryLabel}projects`;
  expandControl.hidden = matching.length <= previewCount;
  expandButton.setAttribute("aria-expanded", String(projectsExpanded));
  expandButton.replaceChildren(
    document.createTextNode(projectsExpanded ? "See less" : "See more projects"),
  );
  if (!projectsExpanded) {
    const remaining = document.createElement("span");
    remaining.className = "more-count";
    remaining.textContent = String(Math.max(0, matching.length - previewCount));
    expandButton.append(remaining);
  }
}

filters.forEach((button) => {
  const category = button.dataset.filter;
  button.querySelector("span").textContent = projects.filter(
    (project) => category === "all" || project.dataset.category === category,
  ).length;
  button.addEventListener("click", () => {
    activeCategory = category;
    projectsExpanded = false;
    renderProjects();
  });
});
expandButton.addEventListener("click", () => {
  projectsExpanded = !projectsExpanded;
  renderProjects();
  if (!projectsExpanded) expandButton.scrollIntoView({ block: "nearest", behavior: "instant" });
});
filterGroup.hidden = false;
renderProjects();

// Track the reading position even within sections taller than the viewport.
const navigationLinks = Array.from(document.querySelectorAll('.nav-link[href^="#"]'));
const sections = Array.from(document.querySelectorAll("main > section[id]"));
const backToTop = document.getElementById("back-to-top");
backToTop.addEventListener("click", () => {
  const heading = document.getElementById("hero-title");
  heading.setAttribute("tabindex", "-1");
  heading.focus({ preventScroll: true });
  window.scrollTo({
    top: 0,
    behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth",
  });
});
let framePending = false;
function updateActiveSection() {
  backToTop.hidden = window.scrollY < 400;
  const current = sections.filter((section) => section.getBoundingClientRect().top <= 150).at(-1);
  navigationLinks.forEach((link) => {
    const active = current && link.hash === `#${current.id}`;
    link.classList.toggle("active", Boolean(active));
    if (active) link.setAttribute("aria-current", "location");
    else link.removeAttribute("aria-current");
  });
  framePending = false;
}
window.addEventListener(
  "scroll",
  () => {
    if (!framePending) {
      framePending = true;
      window.requestAnimationFrame(updateActiveSection);
    }
  },
  { passive: true },
);
updateActiveSection();
document.getElementById("year").textContent = new Date().getFullYear();

// Animate on entry without hiding content before the observer is ready.
// Each item plays once; filtering or expanding projects keeps the same behavior.
function setupScrollReveals() {
  if (!("IntersectionObserver" in window) || typeof Element.prototype.animate !== "function") return;

  const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
  const compactScreen = window.matchMedia("(max-width: 680px)");
  const targets = Array.from(document.querySelectorAll([
    ".section-heading",
    ".about-grid > div",
    ".education-card",
    ".academic-coursework",
    ".research-feature",
    ".research-bottom > div",
    ".experience-grid > div:first-child",
    ".timeline-item",
    ".recognition-grid > div",
    ".project-toolbar",
    ".project-card",
    ".skill-item",
    ".learning-note",
    ".language-card",
    ".contact-grid > div",
  ].join(",")));
  const revealed = new Set();
  const running = new Map();
  let observer;

  function stopAnimations() {
    observer?.disconnect();
    running.forEach((animation) => animation.cancel());
    running.clear();
  }

  function observeRemaining() {
    stopAnimations();
    if (motionPreference.matches) return;

    observer = new IntersectionObserver((entries) => {
      const siblingDelays = new Map();
      entries.forEach((entry) => {
        const target = entry.target;
        if (!entry.isIntersecting || target.hidden || revealed.has(target)) return;
        revealed.add(target);
        observer.unobserve(target);

        // Never animate content away from a keyboard user or after scrolling past it.
        if (motionPreference.matches || target.contains(document.activeElement) || entry.boundingClientRect.top < 0) return;
        const siblingIndex = siblingDelays.get(target.parentElement) || 0;
        siblingDelays.set(target.parentElement, siblingIndex + 1);
        const animation = target.animate([
          { opacity: 0, transform: `translate3d(0, ${compactScreen.matches ? 12 : 20}px, 0)` },
          { opacity: 1, transform: "translate3d(0, 0, 0)" },
        ], {
          duration: compactScreen.matches ? 800 : 1000,
          delay: Math.min(siblingIndex * 90, 270),
          easing: "cubic-bezier(0.22, 1, 0.36, 1)",
          fill: "backwards",
        });
        running.set(target, animation);
        animation.onfinish = animation.oncancel = () => running.delete(target);
      });
    }, { threshold: 0.08, rootMargin: "0px 0px -24px 0px" });

    targets.forEach((target) => {
      if (revealed.has(target)) return;
      const rect = target.getBoundingClientRect();
      // Leave content already on screen untouched, including restored scroll positions.
      if (!target.hidden && rect.height > 0 && rect.top < window.innerHeight && rect.bottom > 0) {
        revealed.add(target);
      } else {
        observer.observe(target);
      }
    });
  }

  document.addEventListener("focusin", (event) => {
    targets.forEach((target) => {
      if (!target.contains(event.target)) return;
      revealed.add(target);
      observer?.unobserve(target);
      running.get(target)?.cancel();
      running.delete(target);
    });
  });
  motionPreference.addEventListener("change", observeRemaining);
  observeRemaining();
}

setupScrollReveals();

function setupDocumentViewer() {
  const dialog = document.getElementById("document-viewer");
  // Direct PDF links still work if the browser does not support modal dialogs.
  if (!dialog || typeof dialog.showModal !== "function") return;

  const frame = document.getElementById("document-frame");
  const title = document.getElementById("document-viewer-title");
  const download = document.getElementById("document-download");
  const closeButton = document.getElementById("document-close");
  let opener;

  document.querySelectorAll("a[data-document-title]").forEach((link) => {
    link.addEventListener("click", (event) => {
      if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      opener = link;
      const label = link.dataset.documentTitle;
      const source = link.getAttribute("href");
      title.textContent = label;
      frame.title = `${label} PDF preview`;
      download.setAttribute("href", source);
      download.setAttribute("aria-label", `Download ${label} PDF`);
      frame.src = `${source}#view=FitH`;
      dialog.showModal();
      document.body.classList.add("document-open");
      closeButton.focus({ preventScroll: true });
    });
  });

  closeButton.addEventListener("click", () => dialog.close());
  dialog.addEventListener("click", (event) => {
    if (event.target !== dialog) return;
    const bounds = dialog.getBoundingClientRect();
    const outside = event.clientX < bounds.left || event.clientX > bounds.right ||
      event.clientY < bounds.top || event.clientY > bounds.bottom;
    if (outside) dialog.close();
  });
  // The native dialog handles Escape and keeps keyboard focus inside the viewer.
  dialog.addEventListener("close", () => {
    frame.removeAttribute("src");
    document.body.classList.remove("document-open");
    if (opener?.isConnected) opener.focus({ preventScroll: true });
  });
}

setupDocumentViewer();

// Copy only the requested public contact value; never read the clipboard.
function setupContactCopy() {
  const buttons = document.querySelectorAll("[data-copy-value]");
  const status = document.getElementById("copy-status");
  let resetTimer;

  function copyWithSelection(value) {
    const previousFocus = document.activeElement;
    const field = document.createElement("textarea");
    field.value = value;
    field.readOnly = true;
    field.style.cssText = "position:fixed;top:0;left:0;opacity:0;font-size:16px;pointer-events:none;";
    document.body.append(field);
    field.select();
    field.setSelectionRange(0, value.length);
    try {
      if (!document.execCommand("copy")) throw new Error("Copy unavailable");
    } finally {
      field.remove();
      previousFocus?.focus({ preventScroll: true });
    }
  }

  function resetButtons() {
    buttons.forEach((button) => {
      button.classList.remove("is-copied");
      button.setAttribute("aria-label", `Copy ${button.dataset.copyLabel}`);
      button.title = `Copy ${button.dataset.copyLabel}`;
    });
  }

  buttons.forEach((button) => {
    button.hidden = false;
    button.addEventListener("click", async () => {
      if (button.getAttribute("aria-busy") === "true") return;
      const value = button.dataset.copyValue;
      const label = button.dataset.copyLabel;
      window.clearTimeout(resetTimer);
      resetButtons();
      status.textContent = "";
      button.setAttribute("aria-busy", "true");
      try {
        try {
          if (!navigator.clipboard?.writeText) throw new Error("Use selection fallback");
          await navigator.clipboard.writeText(value);
        } catch {
          copyWithSelection(value);
        }
        resetButtons();
        button.classList.add("is-copied");
        button.setAttribute("aria-label", `${label} copied`);
        button.title = "Copied!";
        status.textContent = `${label === "email address" ? "Email address" : "Phone number"} copied.`;
        resetTimer = window.setTimeout(() => {
          resetButtons();
          status.textContent = "";
        }, 2500);
      } catch {
        status.textContent = `Could not copy. Select and copy the ${label} manually.`;
      } finally {
        button.removeAttribute("aria-busy");
      }
    });
  });
}

setupContactCopy();

function setupCounters() {
  const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
  if (!("IntersectionObserver" in window) || motionPreference.matches) return;

  const counters = Array.from(document.querySelectorAll("[data-count-to]")).map((element) => ({
    element,
    display: element.querySelector(".counter-value"),
    value: Number(element.dataset.countTo),
    decimals: Number(element.dataset.countDecimals || 0),
    frame: null,
    started: false,
  })).filter((counter) => counter.display && Number.isFinite(counter.value));
  const byElement = new Map(counters.map((counter) => [counter.element, counter]));
  const duration = 1700;

  function finish(counter) {
    if (counter.frame !== null) window.cancelAnimationFrame(counter.frame);
    counter.frame = null;
    counter.started = true;
    counter.display.textContent = counter.value.toFixed(counter.decimals);
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      const counter = byElement.get(entry.target);
      if (!counter || counter.started || !entry.isIntersecting || entry.intersectionRatio < 0.4) return;
      counter.started = true;
      observer.unobserve(counter.element);
      if (motionPreference.matches) {
        finish(counter);
        return;
      }
      let start;
      function tick(timestamp) {
        if (start === undefined) start = timestamp;
        const progress = Math.min((timestamp - start) / duration, 1);
        const eased = 1 - (1 - progress) ** 3;
        counter.display.textContent = (counter.value * eased).toFixed(counter.decimals);
        if (progress < 1) counter.frame = window.requestAnimationFrame(tick);
        else finish(counter);
      }
      counter.frame = window.requestAnimationFrame(tick);
    });
  }, { threshold: 0.4 });

  counters.forEach((counter) => {
    counter.display.style.setProperty("--counter-width", `${counter.value.toFixed(counter.decimals).length}ch`);
    counter.display.textContent = (0).toFixed(counter.decimals);
    observer.observe(counter.element);
  });

  motionPreference.addEventListener("change", () => {
    if (!motionPreference.matches) return;
    observer.disconnect();
    counters.forEach(finish);
  });
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) counters.filter((counter) => counter.frame !== null).forEach(finish);
  });
}

setupCounters();
