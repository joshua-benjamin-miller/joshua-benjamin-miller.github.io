// =====================
// 1) Load Desmos JSON
// =====================
document.addEventListener("DOMContentLoaded", function () {
  let filename = window.location.pathname.split("/").pop() || "";
  filename = filename.replace(/\.html$/i, "");
  const jsonPath = `${filename}.json`;

  const elt = document.getElementById("calculator");
  if (!elt) {
    console.warn("No #calculator element found. Skipping Desmos init.");
    return;
  }

  window.Calc = Desmos.GraphingCalculator(elt, {
    expressionsCollapsed: true,
    keypad: false,
  });

  fetch(jsonPath)
    .then((response) => {
      if (!response.ok) throw new Error(`Failed to load JSON: ${jsonPath}`);
      return response.json();
    })
    .then((state) => {
      window.Calc.setState(state);
      window.Calc.resize();
    })
    .catch((err) => {
      console.error("Error loading Desmos JSON:", err);
    });
});


// =====================
// 2) Resize shell (wrapper) + tell Desmos to resize
// =====================
document.addEventListener("DOMContentLoaded", () => {
  const shell = document.getElementById("graphShell");
  if (!shell) return;

  const handle = shell.querySelector(".resize-handle");
  if (!handle) return;

  let startX = 0, startY = 0;
  let startW = 0, startH = 0;

  const MIN_W = 900;
  const MIN_H = 320;

  // throttle Desmos resize using RAF
  let raf = 0;
  const desmosResize = () => {
    if (!window.Calc || typeof window.Calc.resize !== "function") return;
    if (raf) return;
    raf = requestAnimationFrame(() => {
      raf = 0;
      window.Calc.resize();
    });
  };

  const onMove = (e) => {
    const dx = e.clientX - startX;
    const dy = e.clientY - startY;

    const nextW = Math.max(MIN_W, startW + dx);
    const MAX_H = Math.round(window.innerHeight * 0.85);
    const nextH = Math.min(MAX_H, Math.max(MIN_H, startH + dy));

    shell.style.setProperty("--box-w", `${nextW}px`);
    shell.style.setProperty("--box-h", `${nextH}px`);
    shell.classList.add("user-sized");
    shell.classList.add("resizing");

    desmosResize();
  };

  const onUp = () => {
    shell.classList.remove("resizing");
    window.removeEventListener("pointermove", onMove);
    window.removeEventListener("pointerup", onUp);
    desmosResize();
  };

  handle.addEventListener("pointerdown", (e) => {
    e.preventDefault();

    const rect = shell.getBoundingClientRect();
    startX = e.clientX;
    startY = e.clientY;
    startW = Math.round(rect.width);
    startH = Math.round(rect.height);

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
  });
});
