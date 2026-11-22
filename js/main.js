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
let framePending = false;
function updateActiveSection() {
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
