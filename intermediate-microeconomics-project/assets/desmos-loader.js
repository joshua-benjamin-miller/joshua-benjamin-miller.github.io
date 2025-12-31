JS:document.addEventListener("DOMContentLoaded", function () {
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
  const container = document.querySelector("body.graph-page .container");
  const graphBox = document.getElementById("graphBox");
  const handle = graphBox?.querySelector(".resize-handle");

  if (!container || !graphBox || !handle) return;

  let startX = 0;
  let startW = 0;

  const onMove = (e) => {
    const dx = e.clientX - startX;
    const nextW = Math.max(900, startW + dx);

    // ✅ 改整个 container
    container.style.width = nextW + "px";

    // ✅ Desmos 跟着 resize（不然会糊 / 画面不更新）
    if (window.Calc && typeof window.Calc.resize === "function") {
      window.Calc.resize();
    }
  };

  const onUp = () => {
    window.removeEventListener("pointermove", onMove);
    window.removeEventListener("pointerup", onUp);
  };

  handle.addEventListener("pointerdown", (e) => {
    e.preventDef
