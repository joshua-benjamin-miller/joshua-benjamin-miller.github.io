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

  let startX, startY, startWidth, startHeight;

  const onMove = (e) => {
    const dx = e.clientX - startX;
    const dy = e.clientY - startY;
    const nextW = startWidth + dx;
    const nextH = startHeight + dy;

    const finalW = Math.max(600, nextW); 
    const finalH = Math.max(400, nextH);
    
    container.style.setProperty('width', finalW + 'px', 'important'); 
    graphBox.style.height = finalH + "px";
    
    graphBox.style.aspectRatio = "auto";

    if (window.Calc && typeof window.Calc.resize === "function") {
      window.Calc.resize();
    }
  };

  const onUp = () => {
    window.removeEventListener("pointermove", onMove);
    window.removeEventListener("pointerup", onUp);
    document.body.style.cursor = "default";
  };

  handle.addEventListener("pointerdown", (e) => {
    e.preventDefault();
    
    if (handle.setPointerCapture) handle.setPointerCapture(e.pointerId);

    startX = e.clientX;
    startY = e.clientY;
    
    const rectCont = container.getBoundingClientRect();
    const rectBox = graphBox.getBoundingClientRect();
    
    startWidth = rectCont.width;
    startHeight = rectBox.height;

    document.body.style.cursor = "nwse-resize";
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
  });
});
