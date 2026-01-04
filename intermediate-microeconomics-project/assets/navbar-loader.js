function initNavbarSearch() {
  const input = document.getElementById("nav-search-input");
  const box = document.getElementById("nav-search-results");

  if (!input || !box) return;

  fetch("/intermediate-microeconomics-project/assets/search-index.json")
    .then(res => res.json())
    .then(index => {

      input.addEventListener("input", () => {
        const q = input.value.trim().toLowerCase();
        box.innerHTML = "";

        if (!q) {
          box.classList.remove("active");
          return;
        }

        const matches = index
          .filter(item =>
            item.title.toLowerCase().includes(q) ||
            (item.keywords || []).some(k =>
              k.toLowerCase().includes(q)
            )
          )
          .slice(0, 8);

        if (!matches.length) {
          box.classList.remove("active");
          return;
        }

        matches.forEach(item => {
          const div = document.createElement("div");
          div.className = "nav-search-item";
          div.innerHTML = `
            <div class="nav-search-title">${item.title}</div>
            <div class="nav-search-meta">
              Week ${item.week} · ${item.type}${item.hasVideo ? " · 🎥" : ""}
            </div>
          `;
          div.onclick = () => {
            window.location.href = item.url;
          };
          box.appendChild(div);
        });

        box.classList.add("active");
      });

      document.addEventListener("click", e => {
        if (!box.contains(e.target) && e.target !== input) {
          box.classList.remove("active");
        }
      });

    })
    .catch(err => {
      console.warn("Search index failed to load:", err);
    });
}

function loadNavbar() {
  fetch("/intermediate-microeconomics-project/assets/navbar.html")
    .then(response => response.text())
    .then(data => {
      document.getElementById("navbar-container").innerHTML = data;

      initNavbarSearch();
    })
    .catch(err => {
      console.warn("Navbar failed to load:", err);
    });
}

document.addEventListener("DOMContentLoaded", loadNavbar);




matches.forEach(item => {
  const div = document.createElement("div");
  div.className = "nav-search-item";

  const weekMatch = item.url.match(/week(\d+)/);
  const week = weekMatch ? `Week ${weekMatch[1]}` : "";

  div.innerHTML = `
    <div class="nav-search-title">${item.title}</div>
    <div class="nav-search-meta">${week}</div>
  `;

  div.onclick = () => {
    window.location.href = item.url;
  };

  box.appendChild(div);
});



