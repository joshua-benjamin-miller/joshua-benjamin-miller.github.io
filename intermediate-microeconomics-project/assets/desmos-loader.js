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
  const container = document.querySelector(".container");
  const graphBox = document.getElementById("graphBox");
  if (!container || !graphBox) return;

  const handle = graphBox.querySelector(".resize-handle");
  if (!handle) return;

  let startX = 0;
  let startW = 0;

  const onMove = (e) => {
    const dx = e.clientX - startX;
    const nextW = Math.max(900, startW + dx); // 给个下限，别拖太小

    container.style.width = nextW + "px";     // ✅ 改的是容器宽度
  };

  const onUp = () => {
    window.removeEventListener("pointermove", onMove);
    window.removeEventListener("pointerup", onUp);
  };

 handle.addEventListener("pointerdown", (e) => {
  e.preventDefault();
  e.stopPropagation();

  const rect = container.getBoundingClientRect();
  startX = e.clientX;
  startW = Math.round(rect.width);

  handle.setPointerCapture?.(e.pointerId);

  window.addEventListener("pointermove", onMove);
  window.addEventListener("pointerup", onUp);
});
