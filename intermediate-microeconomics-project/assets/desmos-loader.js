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
    const box = document.getElementById("graphBox");
    if (!box) return;

    const ro = new ResizeObserver(entries => {
      for (const entry of entries) {
        if (!box.classList.contains("user-sized")) {
          box.classList.add("user-sized");
        }
        const h = Math.round(entry.contentRect.height);
        box.style.setProperty("--box-h", h + "px");
      }
    });

    ro.observe(box);
  });
