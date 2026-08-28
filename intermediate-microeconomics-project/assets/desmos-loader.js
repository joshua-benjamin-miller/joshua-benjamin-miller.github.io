document.addEventListener("DOMContentLoaded", async function () {
  const elt = document.getElementById("calculator");

  if (!elt) {
    console.warn("No #calculator element found. Skipping Desmos init.");
    return;
  }

  // Keep window.Calc so export-desmos.js can access it.
  window.Calc = Desmos.GraphingCalculator(elt, {
    expressionsCollapsed: true,
    keypad: false
  });

  try {
    // page-binder.js fills this link from graphs-data.json.
    const link = document.querySelector('[data-fill="desmos-link"]');

    if (!link) {
      throw new Error("Desmos link element not found.");
    }

    const desmosUrl = await waitForDesmosLink(link);

    const response = await fetch(desmosUrl, {
      headers: {
        Accept: "application/json"
      }
    });

    if (!response.ok) {
      throw new Error(
        `Failed to load Desmos graph: ${response.status}`
      );
    }

    const graphData = await response.json();

    if (!graphData.state) {
      throw new Error("Desmos response does not contain graph state.");
    }

    const state =
      typeof graphData.state === "string"
        ? JSON.parse(graphData.state)
        : graphData.state;

    window.Calc.setState(state);

    console.log("[DESMOS] Graph loaded from:", desmosUrl);
  } catch (error) {
    console.error("[DESMOS] Error loading graph:", error);
  }
});


function waitForDesmosLink(link, timeout = 10000) {
  const existingUrl = link.getAttribute("href");

  if (existingUrl) {
    return Promise.resolve(existingUrl);
  }

  return new Promise((resolve, reject) => {
    const observer = new MutationObserver(() => {
      const url = link.getAttribute("href");

      if (url) {
        observer.disconnect();
        clearTimeout(timer);
        resolve(url);
      }
    });

    observer.observe(link, {
      attributes: true,
      attributeFilter: ["href"]
    });

    const timer = setTimeout(() => {
      observer.disconnect();
      reject(
        new Error("Timed out waiting for page-binder.js to provide the Desmos URL.")
      );
    }, timeout);
  });
}





document.addEventListener("DOMContentLoaded", () => {
  const container = document.querySelector("body.graph-page .container");
  const graphBox = document.getElementById("graphBox");
  const handle = graphBox?.querySelector(".resize-handle");

  if (!container || !graphBox || !handle) return;

  let startX, startY, startWidth, startHeight;
const onMove = (e) => {
    const dx = e.clientX - startX;
    const dy = e.clientY - startY;
    
    const finalW = Math.max(600, startWidth + dx); 
    const finalH = Math.max(400, startHeight + dy);
    
    container.style.maxWidth = "none"; 
    container.style.width = finalW + 'px'; 
    graphBox.style.height = finalH + "px";
    requestAnimationFrame(() => {
        if (window.calc3d) {
            window.calc3d.resize();
        } else if (window.Calc) {
            window.Calc.resize();
        }
    });
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
