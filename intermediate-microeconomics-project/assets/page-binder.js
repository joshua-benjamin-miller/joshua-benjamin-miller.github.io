<script>
document.addEventListener("DOMContentLoaded", () => {
  const root = document.querySelector(".container[data-graph-id]");
  if (!root) return;

  const id = root.dataset.graphId;
  const title = root.dataset.graphTitle || id;

  // Title + subtitle
  const titleEl = root.querySelector('[data-fill="title"]');
  if (titleEl) titleEl.textContent = title;

  const subtitleEl = root.querySelector('[data-fill="subtitle"]');
  if (subtitleEl) subtitleEl.textContent = `📘 ${title}`;

  // Explanations
  const introEl = root.querySelector('[data-fill="intro"]');
  if (introEl) {
    const introKey = `${id}-header`;
    if (window.EXPLANATIONS?.[introKey]) introEl.innerHTML = EXPLANATIONS[introKey];
    else console.warn("Missing explanation for id:", introKey);
  }

  const fullEl = root.querySelector('[data-fill="full"]');
  if (fullEl) {
    if (window.EXPLANATIONS?.[id]) fullEl.innerHTML = EXPLANATIONS[id];
    else console.warn("Missing explanation for id:", id);
  }

  // Desmos link
  const desmosA = root.querySelector('[data-fill="desmos-link"]');
  if (desmosA) {
    const entry = window.DESMOS_LINKS?.[id];
    if (entry?.url) {
      desmosA.href = entry.url;
      desmosA.textContent = entry.title || "Open in Desmos";
    } else {
      console.warn("Missing Desmos link for:", id);
    }
  }

  // Video
  const videoEl = root.querySelector('[data-fill="video"]');
  if (videoEl) {
    const v = window.VIDEOS?.[id];
    if (v?.src) {
      videoEl.innerHTML = `
        <iframe
          src="${v.src}"
          title="${v.title || ""}"
          allowfullscreen
        ></iframe>
      `;
    } else {
      console.warn("Missing video for:", id);
    }
  }
});
</script>
