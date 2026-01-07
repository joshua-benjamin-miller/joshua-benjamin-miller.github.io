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

<script defer src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js"></script>



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

  // ---- Load registry JSON ----
  // NOTE: adjust this path if your HTML files are not exactly one folder below /assets/
  // NOTE 2: iterate to a new version if json updates
  const DATA_URL = "/intermediate-microeconomics-project/assets/graphs-data.json?v=7";


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

 
  // Re-typeset math after injecting HTML
  if (window.MathJax?.startup?.promise && window.MathJax?.typesetPromise) {
    window.MathJax.startup.promise
      .then(() => {
        if (window.MathJax.typesetClear) window.MathJax.typesetClear([root]);
        return window.MathJax.typesetPromise([root]);
      })
      .catch(e => console.warn("MathJax typeset failed:", e));
  }





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
