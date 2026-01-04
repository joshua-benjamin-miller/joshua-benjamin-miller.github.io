function initNavbarSearch() {
  const input = document.getElementById("nav-search-input");
  const box = document.getElementById("nav-search-results");

  if (!input || !box) return;


function normalize(s) {
  return (s || "")
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}
  
function tokenMatch(text, qTokens) {
  return qTokens.every(t => text.includes(t));
}

function subsequenceMatch(text, pattern) {
  let i = 0;
  for (let c of text) {
    if (c === pattern[i]) i++;
    if (i === pattern.length) return true;
  }
  return pattern.length > 0;
}

  
  
  
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

      const qNorm = normalize(q);
const qTokens = qNorm.split(" ").filter(Boolean);

const matches = index
  .map(item => {
    const title = normalize(item.title);
    const kws = normalize((item.keywords || []).join(" "));
    const hay = (title + " " + kws).trim();

    let score = 999;

    if (hay.includes(qNorm)) score = 0;

    else if (tokenMatch(hay, qTokens)) score = 1;

    else if (subsequenceMatch(hay.replace(/\s+/g, ""), qNorm.replace(/\s+/g, ""))) score = 2;

    return { item, score };
  })
  .filter(x => x.score < 999)
  .sort((a, b) => a.score - b.score)
  .slice(0, 8)
  .map(x => x.item);


        if (!matches.length) {
          box.classList.remove("active");
          return;
        }

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
  fetch("/intermediate-microeconomics-project/assets/navbarH.html")
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



