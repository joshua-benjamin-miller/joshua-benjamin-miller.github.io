function initNavbarSearch() {
  const input = document.getElementById("nav-search-input");
  const box = document.getElementById("nav-search-results");

  if (!input || !box || input.dataset.searchReady) return;
  input.dataset.searchReady = "true";

  const base = "/intermediate-microeconomics-project";

  function normalize(value) {
    return String(value || "")
      .toLowerCase()
      .replace(/[’']/g, "")
      .replace(/&/g, " and ")
      .replace(/[^a-z0-9]+/g, " ")
      .trim();
  }

  // Read searchable text without including HTML tags or attributes.
  function plainText(html) {
    const template = document.createElement("template");
    template.innerHTML = String(html || "")
      .replace(/<[^>]*>/g, " ");
    return template.content.textContent || "";
  }

  function allTokens(text, tokens) {
    return tokens.every(token => text.includes(token));
  }

  function score(item, query, tokens) {
    if (item.titleText === query) return 0;
    if (item.titleText.includes(query)) return 1;
    if (allTokens(item.titleText, tokens)) return 2;

    if (allTokens(item.keywordText, tokens)) return 3;

    if (item.contentText.includes(query)) return 4;
    if (allTokens(item.contentText, tokens)) return 5;

    // Allow search words to be spread across different fields.
    if (allTokens(item.allText, tokens)) return 6;

    return Infinity;
  }

  function closeResults() {
    box.classList.remove("active");
  }

  fetch(`${base}/assets/graphs-data.json`, { cache: "no-cache" })
    .then(response => {
      if (!response.ok) {
        throw new Error(`Graph data: HTTP ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      const index = Object.entries(data)
        .filter(([, graph]) =>
          graph && /^\d+$/.test(String(graph.week))
        )
        .map(([id, graph]) => {
          const title = graph.display_title || id;
          const keywords = Array.isArray(graph.keywords)
            ? graph.keywords.join(" ")
            : graph.keywords || "";

          const titleText = normalize(title);
          const keywordText = normalize(keywords);

          const contentText = normalize(
            [
              graph.card_intro,
              graph.card_prompt,
              graph.intro_html,
              graph.full_html,
              graph.answer_html
            ]
              .map(plainText)
              .join(" ")
          );

          return {
            title,
            week: String(graph.week),
            url: `${base}/week${graph.week}/${encodeURIComponent(id)}.html`,
            titleText,
            keywordText,
            contentText,
            allText: [
              titleText,
              keywordText,
              contentText,
              normalize(id),
              `week ${graph.week}`
            ].join(" ")
          };
        });

      function renderResults() {
        const query = normalize(input.value);
        box.replaceChildren();

        if (!query) {
          closeResults();
          return;
        }

        const tokens = query.split(" ").filter(Boolean);

        const matches = index
          .map(item => ({
            item,
            score: score(item, query, tokens)
          }))
          .filter(result => Number.isFinite(result.score))
          .sort((a, b) =>
            a.score - b.score ||
            Number(a.item.week) - Number(b.item.week) ||
            a.item.title.localeCompare(b.item.title)
          )
          .slice(0, 8);

        for (const { item } of matches) {
          const row = document.createElement("div");
          row.className = "nav-search-item";
          row.tabIndex = 0;
          row.setAttribute("role", "link");

          const title = document.createElement("div");
          title.className = "nav-search-title";
          title.textContent = item.title;

          const meta = document.createElement("div");
          meta.className = "nav-search-meta";
          meta.textContent = `Week ${item.week}`;

          row.append(title, meta);

          row.addEventListener("click", () => {
            window.location.href = item.url;
          });

          row.addEventListener("keydown", event => {
            if (event.key === "Enter") {
              window.location.href = item.url;
            }
          });

          box.appendChild(row);
        }

        box.classList.toggle("active", matches.length > 0);
      }

      input.addEventListener("input", renderResults);
      input.addEventListener("focus", renderResults);

      input.addEventListener("keydown", event => {
        if (event.key === "Escape") closeResults();
      });

      document.addEventListener("click", event => {
        if (!box.contains(event.target) && event.target !== input) {
          closeResults();
        }
      });

      // Handle a query typed while the data was loading.
      if (document.activeElement === input) renderResults();
    })
    .catch(error => {
      delete input.dataset.searchReady;
      closeResults();
      console.warn("Graph search failed to load:", error);
    });
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



