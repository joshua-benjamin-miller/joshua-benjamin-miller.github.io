// page-binder.js
// Fills title/subtitle, explanation textboxes, Desmos link, and video iframe
// based on the page's .container[data-graph-id] attributes.
//
// Requirements:
// - Your HTML has: .container data-graph-id="..." (and optional data-graph-title="...")
// - Your HTML contains elements with:
//   [data-fill="title"], [data-fill="subtitle"], [data-fill="intro"], [data-fill="full"],
//   [data-fill="desmos-link"], [data-fill="video"]
// - These scripts load BEFORE this file (recommended with defer, and in this order):
//   explanations.js (defines EXPLANATIONS)
//   desmos-links.js (defines DESMOS_LINKS)
//   video.js (defines VIDEOS)

document.addEventListener("DOMContentLoaded", () => {
  const root = document.querySelector(".container[data-graph-id]");
  if (!root) {
    console.warn("page-binder.js: Missing .container[data-graph-id] on this page.");
    return;
  }

  const id = root.dataset.graphId;
  const title = root.dataset.graphTitle || id;

  // Safely access globals whether they were defined with const/let or var
  const EXPL = (typeof EXPLANATIONS !== "undefined") ? EXPLANATIONS : null;
  const LINKS = (typeof DESMOS_LINKS !== "undefined") ? DESMOS_LINKS : null;
  const VIDS = (typeof VIDEOS !== "undefined") ? VIDEOS : null;

  if (!EXPL) console.warn("page-binder.js: EXPLANATIONS not loaded (check script src/path).");
  if (!LINKS) console.warn("page-binder.js: DESMOS_LINKS not loaded (check script src/path).");
  if (!VIDS) console.warn("page-binder.js: VIDEOS not loaded (check script src/path).");

  // -----------------------
  // Title + subtitle
  // -----------------------
  const titleEl = root.querySelector('[data-fill="title"]');
  if (titleEl) titleEl.textContent = title;

  const subtitleEl = root.querySelector('[data-fill="subtitle"]');
  if (subtitleEl) subtitleEl.textContent = `📘 ${title}`;

  // -----------------------
  // Explanations
  // -----------------------
  const introEl = root.querySelector('[data-fill="intro"]');
  if (introEl) {
    const introKey = `${id}-header`;
    if (EXPL && EXPL[introKey]) {
      introEl.innerHTML = EXPL[introKey];
    } else {
      console.warn("page-binder.js: Missing explanation for id:", introKey);
    }
  }

  const fullEl = root.querySelector('[data-fill="full"]');
  if (fullEl) {
    if (EXPL && EXPL[id]) {
      fullEl.innerHTML = EXPL[id];
    } else {
      console.warn("page-binder.js: Missing explanation for id:", id);
    }
  }

  // -----------------------
  // Desmos link
  // -----------------------
  const desmosA = root.querySelector('[data-fill="desmos-link"]');
  if (desmosA) {
    const entry = LINKS ? LINKS[id] : null;
    if (entry && entry.url) {
      desmosA.href = entry.url;
      desmosA.textContent = entry.title || "Open in Desmos";
    } else {
      console.warn("page-binder.js: Missing Desmos link for:", id);
    }
  }

  // -----------------------
  // Video
  // -----------------------
  const videoEl = root.querySelector('[data-fill="video"]');
  if (videoEl) {
    const v = VIDS ? VIDS[id] : null;
    if (v && v.src) {
      // Optional: you can add loading="lazy" for performance
      videoEl.innerHTML = `
        <iframe
          src="${v.src}"
          title="${v.title || ""}"
          allowfullscreen
          loading="lazy"
        ></iframe>
      `;
    } else {
      console.warn("page-binder.js: Missing video for:", id);
    }
  }
});
