document.addEventListener("DOMContentLoaded", function () {
  // 1. get the json file name
  let filename = window.location.pathname.split("/").pop() || "";
  filename = filename.replace(/\.html$/i, "");
  const jsonPath = `${filename}.json`;

  // 2.get calculator
  const elt = document.getElementById("calculator");
  if (!elt) {
    console.warn("No #calculator element found. Skipping Desmos init.");
    return;
  }

  // 3. create Desmos calculator
  window.Calc = Desmos.GraphingCalculator(elt, {
    expressionsCollapsed: true,
    keypad:false
  });

  // 4. load json state
  fetch(jsonPath)
    .then(response => {
      if (!response.ok) {
        throw new Error(`Failed to load JSON: ${jsonPath}`);
      }
      return response.json();
    })
    .then(state => {
      Calc.setState(state);
    })
    .catch(err => {
      console.error("Error loading Desmos JSON:", err);
    });
});





document.addEventListener("DOMContentLoaded", () => {
  const box = document.gettheElementById?.("graphBox") || document.getElementById("graphBox");
  if (!box) return;

  const handle = box.querySelector(".resize-handle");
  if (!handle) return;

  const MIN_W = 320;
  const MIN_H = 320;

  let startX = 0, startY = 0;
  let startW = 0, startH = 0;

  const clamp = (v, min, max) => Math.max(min, Math.min(max, v));

  const onMove = (e) => {
    const dx = e.clientX - startX;
    const dy = e.clientY - startY;

    const maxH = Math.round(window.innerHeight * 0.85);

    // 宽度不设上限（由 graph-scroll 提供滚动）
    const nextW = clamp(startW + dx, MIN_W, 99999);
    const nextH = clamp(startH + dy, MIN_H, maxH);

    box.classList.add("user-sized");
    box.style.setProperty("--box-w", nextW + "px");
    box.style.setProperty("--box-h", nextH + "px");
  };

  const onUp = () => {
    window.removeEventListener("pointermove", onMove);
    window.removeEventListener("pointerup", onUp);
  };

  handle.addEventListener("pointerdown", (e) => {
    e.preventDefault();
    const rect = box.getBoundingClientRect();
    startX = e.clientX;
    startY = e.clientY;
    startW = Math.round(rect.width);
    startH = Math.round(rect.height);

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
  });
});

