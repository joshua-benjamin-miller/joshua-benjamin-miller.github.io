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
//     "answer_html": "..."   // optional (exercise)
//   }
// }

// ---- MathJax loader (JS only) + ready promise ----
function ensureMathJax() {
  // If already initialized, return the startup promise
  if (window.MathJax?.startup?.promise) return window.MathJax.startup.promise;

  // Reuse a single promise so multiple pages/components don't double-load
  if (window._mathJaxReadyPromise) return window._mathJaxReadyPromise;

  window._mathJaxReadyPromise = new Promise((resolve, reject) => {
    // If script tag already exists, just wait for MathJax to show up
    const existing = document.getElementById("MathJax-script");
    if (existing) {
      waitForMathJax(resolve, reject);
      return;
    }

    // Try primary CDN first, fallback to another if it errors
    const cdn1 = "https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js";
    const cdn2 = "https://cdnjs.cloudflare.com/ajax/libs/mathjax/3.2.2/es5/tex-mml-chtml.js";

    const mj = document.createElement("script");
    mj.id = "MathJax-script";
    mj.async = true;
    mj.src = cdn1;

    mj.onerror = () => {
      console.warn("MathJax failed to load from jsDelivr; trying Cloudflare...");
      const mj2 = document.createElement("script");
      mj2.id = "MathJax-script-fallback";
      mj2.async = true;
      mj2.src = cdn2;
      mj2.onerror = () => reject(new Error("MathJax failed to load from both CDNs."));
      document.head.appendChild(mj2);
      waitForMathJax(resolve, reject);
    };

    document.head.appendChild(mj);
    waitForMathJax(resolve, reject);
  });

  return window._mathJaxReadyPromise;
}

function waitForMathJax(resolve, reject) {
  let tries = 0;
  const maxTries = 200; // 200 * 50ms = 10 seconds
  const timer = setInterval(() => {
    tries++;

    if (window.MathJax?.startup?.promise) {
      clearInterval(timer);
      window.MathJax.startup.promise.then(resolve).catch(reject);
      return;
    }

    if (tries >= maxTries) {
      clearInterval(timer);
      reject(new Error("MathJax did not initialize in time."));
    }
  }, 50);
}

async function typesetMath(rootEl) {
  try {
    await ensureMathJax();
    if (window.MathJax?.typesetClear) window.MathJax.typesetClear([rootEl]);
    if (window.MathJax?.typesetPromise) await window.MathJax.typesetPromise([rootEl]);
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

  // ---- Load registry JSON ----
  // NOTE: adjust this path if your HTML files are not exactly one folder below /assets/
  // NOTE 2: iterate to a new version if json updates
  const DATA_URL = "/intermediate-microeconomics-project/assets/graphs-data.json?v=15";


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
 const introEl  = root.querySelector('[data-fill="intro"]');
const fullEl   = root.querySelector('[data-fill="full"]');
const promptEl = root.querySelector('[data-fill="prompt"]'); 
const answerEl = root.querySelector('[data-fill="answer"]'); // exercise Answer

if (introEl)  introEl.innerHTML  = entry.intro_html  || "";
if (fullEl)   fullEl.innerHTML   = entry.full_html   || "";

if (promptEl) promptEl.innerHTML = entry.prompt_html || "";
if (answerEl) answerEl.innerHTML = entry.answer_html || "";

 
 // ✅ Now typeset the newly injected math
  await typesetMath(root);





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
