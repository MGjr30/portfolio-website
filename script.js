// ===== Utilities =====
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

// ===== 1) DOM manipulation: set year automatically =====
$("#year").textContent = new Date().getFullYear();

// ===== Mobile nav toggle (event listener + class toggle) =====
const navToggle = $("#navToggle");
const navMenu = $("#navMenu");

navToggle.addEventListener("click", () => {
  const isOpen = navMenu.classList.toggle("open");
  navToggle.setAttribute("aria-expanded", String(isOpen));
});

// Close menu after clicking a link (better UX on mobile)
$$(".nav-link").forEach((link) => {
  link.addEventListener("click", () => {
    navMenu.classList.remove("open");
    navToggle.setAttribute("aria-expanded", "false");
  });
});

// ===== 2) Theme toggle (event listener + DOM manipulation) =====
const themeBtn = $("#themeBtn");

function setTheme(isLight) {
  document.body.classList.toggle("theme-light", isLight);
  themeBtn.setAttribute("aria-pressed", String(isLight));
  localStorage.setItem("theme", isLight ? "light" : "dark");
}

const savedTheme = localStorage.getItem("theme");
setTheme(savedTheme === "light");

themeBtn.addEventListener("click", () => {
  const isLight = !document.body.classList.contains("theme-light");
  setTheme(isLight);
});

// ===== Status button: content change (DOM manipulation) =====
const statusText = $("#statusText");
const statusBtn = $("#statusBtn");

const statuses = [
  "Available for opportunities",
  "Open to internships",
  "Currently building new projects",
  "Busy this month — still open to messages"
];

let statusIndex = 0;

statusBtn.addEventListener("click", () => {
  statusIndex = (statusIndex + 1) % statuses.length;
  statusText.textContent = statuses[statusIndex];
});

// ===== Projects filtering + search (DOM manipulation + events) =====
const projects = $$(".project");
const resultsText = $("#resultsText");
const projectSearch = $("#projectSearch");
const filterButtons = $$(".filter-btn");

let activeFilter = "all";

function matchesFilter(projectEl) {
  if (activeFilter === "all") return true;
  const tags = projectEl.dataset.tags || "";
  return tags.split(" ").includes(activeFilter);
}

function matchesSearch(projectEl) {
  const q = projectSearch.value.trim().toLowerCase();
  if (!q) return true;
  const text = projectEl.textContent.toLowerCase();
  return text.includes(q);
}

function updateProjects() {
  let shown = 0;
  projects.forEach((p) => {
    const show = matchesFilter(p) && matchesSearch(p);
    p.hidden = !show;
    if (show) shown += 1;
  });
  resultsText.textContent = `Showing ${shown} project${shown === 1 ? "" : "s"}.`;
}

projectSearch.addEventListener("input", updateProjects);

filterButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    activeFilter = btn.dataset.filter;
    // Visual feedback: mark active filter button
    filterButtons.forEach((b) => b.classList.remove("is-active"));
    btn.classList.add("is-active");
    updateProjects();
  });
});

// initial render
updateProjects();

// ===== Contact form: char counter + simple validation (events + DOM manipulation) =====
const contactForm = $("#contactForm");
const nameInput = $("#nameInput");
const msgInput = $("#msgInput");
const charCount = $("#charCount");
const formStatus = $("#formStatus");

const MAX_CHARS = 240;

function updateCharCount() {
  const len = msgInput.value.length;
  if (len > MAX_CHARS) {
    msgInput.value = msgInput.value.slice(0, MAX_CHARS);
  }
  charCount.textContent = `${msgInput.value.length} / ${MAX_CHARS}`;
}

msgInput.addEventListener("input", updateCharCount);
updateCharCount();

contactForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const nameOk = nameInput.value.trim().length >= 2;
  const msgOk = msgInput.value.trim().length >= 10;

  if (!nameOk || !msgOk) {
    formStatus.textContent = "Please enter a valid name (2+ chars) and a message (10+ chars).";
    formStatus.style.opacity = "1";
    return;
  }

  formStatus.textContent = "Looks good — copy/paste this message into an email and send it!";
  nameInput.value = "";
  msgInput.value = "";
  updateCharCount();
});