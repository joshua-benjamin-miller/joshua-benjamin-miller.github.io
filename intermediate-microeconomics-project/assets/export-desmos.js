// assets/export-desmos.js

(function initExport() {
  console.log("[EXPORT] module loaded");

  const btn = document.getElementById("export-desmos-btn");
  if (!btn) {
    console.warn("[EXPORT] export-desmos-btn not found");
    return;
  }

  // incase loaded for multiple times
  if (btn.dataset.exportBound === "true") {
    return;
  }
  btn.dataset.exportBound = "true";

  // automatically work out the download file name -> .png
  let filename = window.location.pathname.split("/").pop() || "graph";
  filename = filename.replace(/\.html$/i, "");
  const downloadName = filename + ".png";

  btn.addEventListener("click", function () {
    console.log("[EXPORT] click detected");

    if (!window.Calc || typeof window.Calc.asyncScreenshot !== "function") {
      console.error("[EXPORT] Calc is not ready or asyncScreenshot missing");
      return;
    }

    const opts = {
      format: "png",
      width: 1200,
      height: 800,
      targetPixelRatio: 2,
      showLabels: true
    };

    window.Calc.asyncScreenshot(opts, function (dataUrl) {
      const a = document.createElement("a");
      a.href = dataUrl;
      a.download = downloadName;
      document.body.appendChild(a);
      a.click();
      a.remove();
    });
  });
})();
