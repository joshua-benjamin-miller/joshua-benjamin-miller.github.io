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
  const container = document.querySelector(".container");
  const graphBox = document.querySelector(".graph-resizable");
  const handle = graphBox?.querySelector(".resize-handle");

  if (!container || !graphBox || !handle) return;

  let startX = 0;
  let startW = 0;

  const onMove = (e) => {
    const dx = e.clientX - startX;
    const nextW = Math.max(900, startW + dx);

    container.style.width = nextW + "px";
  };

  const onUp = () => {
    window.removeEventListener("pointermove", onMove);
    window.removeEventListener("pointerup", onUp);
  };

  handle.addEventListener("pointerdown", (e) => {
    e.preventDefault();
    handle.setPointerCapture(e.pointerId); // 🔑 很关键

    const rect = container.getBoundingClientRect();
    startX = e.clientX;
    startW = rect.width;

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
  });
});
