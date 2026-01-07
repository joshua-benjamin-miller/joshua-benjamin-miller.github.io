// page-binder.js
// Populates title/subtitle, intro/full explanations, Desmos link, and video iframe
// from a single JSON registry (graphs-data.json).
//
// HTML requirements:
// - A .container element (optionally with data-graph-id and data-graph-title)
// - Elements with:
//   [data-fill="title"], [data-fill="subtitle"], [data-fill="intro"], [data-fill="full"],
//   [data-fill="desmos-link"], [data-fill="video"]
//
// Data file expected (JSON):
// {
//   "<graph-id>": {
//     "desmos_url": "...",
//     "video_src": "...",
//     "intro_html": "...",
//     "full_html": "..."
//   }
// }

function loadMathJaxOnce() {
  if (window.mathjaxLoaded) return;
  window.mathjaxLoaded = true;

  const mj = document.createElement("script");
  mj.id = "MathJax-script";
  mj.src = "https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js";
  mj.async = true;

  mj.onerror = () => {
    console.error("MathJax failed to load — retrying...");
    setTimeout(loadMathJaxOnce, 1000);
  };

  document.head.appendChild(mj);
}

async function typesetMath(rootEl) {
  // Wait briefly for MathJax to be ready, then typeset inserted content
  if (!window.MathJax) return;

  try {
    // Prefer v3 API
    if (typeof window.MathJax.typesetPromise === "function") {
      await window.MathJax.typesetPromise([rootEl]);
    } else if (typeof window.MathJax.typeset === "function") {
      window.MathJax.typeset([rootEl]);
    }
  } catch (e) {
    console.warn("MathJax typeset failed:", e);
  }
}


async function bindPage() {
  const root = document.querySelector(".container");
  if (!root) {
    console.warn("page-binder.js: Missing .container on this page.");
    return;
  }

  // --- Determine graph id ---
  // Prefer explicit data-graph-id, else infer from filename
  let id = root.dataset.graphId;
  if (!id) {
    const file = location.pathname.split("/").pop() || "";
    id = file.replace(/\.html$/i, "");
    root.dataset.graphId = id;
  }

  // --- Determine display title ---
  // Prefer explicit data-graph-title, else derive from id
  const title = root.dataset.graphTitle || id.replace(/-/g, " ");
  root.dataset.graphTitle = title;

  // Set browser tab title
  document.title = `${title} | MicroEconGraphs`;

  loadMathJaxOnce();
  // ---- Load registry JSON ----
  // NOTE: adjust this path if your HTML files are not exactly one folder below /assets/
  // NOTE 2: iterate to a new version if json updates
  const DATA_URL = "/intermediate-microeconomics-project/assets/graphs-data.json?v=3";


  let registry;
  try {
    const res = await fetch(DATA_URL, { cache: "no-store" });
    if (!res.ok) {
      console.warn("page-binder.js: Failed to load graphs-data.json:", res.status, res.statusText);
      return;
    }
    registry = await res.json();
  } catch (err) {
    console.warn("page-binder.js: Error fetching graphs-data.json:", err);
    return;
  }

  const entry = registry[id];
  if (!entry) {
    console.warn("page-binder.js: No entry for graph-id in graphs-data.json:", id);
    return;
  }

  // -----------------------
  // Title + subtitle
  // -----------------------
  const titleEl = root.querySelector('[data-fill="title"]');
  if (titleEl) titleEl.textContent = title;

  const subtitleEl = root.querySelector('[data-fill="subtitle"]');
  if (subtitleEl) subtitleEl.textContent = `📘 ${title}`;

  // -----------------------
  // Explanations (HTML from JSON)
  // -----------------------
  const introEl = root.querySelector('[data-fill="intro"]');
  if (introEl) introEl.innerHTML = entry.intro_html || "";

  const fullEl = root.querySelector('[data-fill="full"]');
  if (fullEl) fullEl.innerHTML = entry.full_html || "";

  // Re-render math after dynamic insertion
  // (Give MathJax a moment to load if it was just injected)
  setTimeout(() => { typesetMath(root); }, 0);

  // -----------------------
  // Desmos link
  // -----------------------
  const desmosA = root.querySelector('[data-fill="desmos-link"]');
  if (desmosA) {
    if (entry.desmos_url) {
      desmosA.href = entry.desmos_url;
      desmosA.textContent = "Open in Desmos";
    } else {
      console.warn("page-binder.js: Missing desmos_url for:", id);
    }
  }

  // -----------------------
  // Video
  // -----------------------
  const videoEl = root.querySelector('[data-fill="video"]');
  if (videoEl) {
    if (entry.video_src) {
      videoEl.innerHTML = `
        <iframe
          src="${entry.video_src}"
          title=""
          allowfullscreen
          loading="lazy"
        ></iframe>
      `;
    } else {
      console.warn("page-binder.js: Missing video_src for:", id);
    }
  }
}

// Run whether the script loads before or after DOMContentLoaded
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => void bindPage());
} else {
  void bindPage();
}
