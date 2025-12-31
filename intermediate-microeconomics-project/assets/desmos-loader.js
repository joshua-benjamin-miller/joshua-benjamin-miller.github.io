// =====================
// 1) Load Desmos JSON
// =====================
document.addEventListener("DOMContentLoaded", function () {
  // get the json file name
  let filename = window.location.pathname.split("/").pop() || "";
  filename = filename.replace(/\.html$/i, "");
  const jsonPath = `${filename}.json`;

  // get calculator element
  const elt = document.getElementById("calculator");
  if (!elt) {
    console.warn("No #calculator element found. Skipping Desmos init.");
    return;
  }

  // create Desmos calculator
  window.Calc = Desmos.GraphingCalculator(elt, {
    expressionsCollapsed: true,
    keypad: false,
  });

  // load json state
  fetch(jsonPath)
    .then((response) => {
      if (!response.ok) throw new Error(`Failed to load JSON: ${jsonPath}`);
      return response.json();
    })
    .then((state) => {
      Calc.setState(state);
    })
    .catch((err) => {
      console.error("Error loading Desmos JSON:", err);
    });
});


// =====================
// 2) Resize graphBox
// =====================
document.addEventListener("DOMContentLoaded", () => {
  const graphBox = document.getElementById("graphBox");
  if (!graphBox) return;

  const handle = graphBox.querySelector(".resize-handle");
  if (!handle) return;

  let startX = 0, startY = 0;
  let startW = 0, startH = 0;

  const MIN_W = 900;
  const MIN_H = 320;

  const onMove = (e) => {
    const dx = e.clientX - startX;
    const dy = e.clientY - startY;

    const nextW = Math.max(MIN_W, startW + dx);

    // 每次 move 动态算 MAX_H，避免你拖完再 resize 窗口高度后不一致
    const MAX_H = Math.round(window.innerHeight * 0.85);
    const nextH = Math.min(MAX_H, Math.max(MIN_H, startH + dy));

    graphBox.style.setProperty("--box-w", `${nextW}px`);
    graphBox.style.setProperty("--box-h", `${nextH}px`);
    graphBox.classList.add("user-sized");
    graphBox.classList.add("resizing");
  };

  const onUp = () => {
    graphBox.classList.remove("resizing");
    window.removeEventListener("pointermove", onMove);
    window.removeEventListener("pointerup", onUp);
  };

  handle.addEventListener("pointerdown", (e) => {
    e.preventDefault();
    const rect = graphBox.getBoundingClientRect();
    startX = e.clientX;
    startY = e.clientY;
    startW = Math.round(rect.width);
    startH = Math.round(rect.height);

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
  });
});
