const NAVBAR_HTML=`
<nav class="navbar">
 <!--adding navbar inner-->
   <div class="navbar-inner"> 
  <div class="nav-left">
    <a href="/intermediate-microeconomics-project/index.html">Home</a>
     <!--Search bar-->
      <div class="nav-search">
      <input
        id="nav-search-input"
        type="text"
        placeholder="Search graphs…"
        autocomplete="off"
      />
      <div id="nav-search-results" class="nav-search-results"></div>
    </div>
  </div>

  <div class="nav-menu">
    <button id="export-desmos-btn" class="export-btn">
      Export graph
    </button>
  
    <div class="dropdown">
      <span class="dropdown-btn">Weeks ▾</span>
      <div class="dropdown-content">
        <a href="/intermediate-microeconomics-project/week1/concepts.html">Week 1</a>
        <a href="/intermediate-microeconomics-project/week2/concepts.html">Week 2</a>
        <a href="/intermediate-microeconomics-project/week3/concepts.html">Week 3</a>
        <a href="/intermediate-microeconomics-project/week4/concepts.html">Week 4</a>
        <a href="/intermediate-microeconomics-project/week5/concepts.html">Week 5</a>
        <a href="/intermediate-microeconomics-project/week6/concepts.html">Week 6</a>
        <a href="/intermediate-microeconomics-project/week7/concepts.html">Week 7</a>
        <a href="/intermediate-microeconomics-project/week8/concepts.html">Week 8</a>
        <a href="/intermediate-microeconomics-project/week9/concepts.html">Week 9</a>
        <a href="/intermediate-microeconomics-project/week10/concepts.html">Week 10</a>
        <a href="/intermediate-microeconomics-project/week11/concepts.html">Week 11</a>
        <a href="/intermediate-microeconomics-project/week12/concepts.html">Week 12</a>
        <!-- Add later -->
      </div>
    </div>

    <div class="dropdown">
      <span class="dropdown-btn">Exercises ▾</span>
      <div class="dropdown-content">
        <a href="/intermediate-microeconomics-project/week1/exercise.html">Exercises Wk1</a>
        <a href="/intermediate-microeconomics-project/week2/exercise.html">Exercises Wk2</a>
        <a href="/intermediate-microeconomics-project/week3/exercise.html">Exercises Wk3</a>
        <a href="/intermediate-microeconomics-project/week4/exercise.html">Exercises Wk4</a>
        <a href="/intermediate-microeconomics-project/week5/exercise.html">Exercises Wk5</a>
        <a href="/intermediate-microeconomics-project/week6/exercise.html">Exercises Wk6</a>
        <a href="/intermediate-microeconomics-project/week7/exercise.html">Exercises Wk7</a>
        <a href="/intermediate-microeconomics-project/week8/exercise.html">Exercises Wk8</a>
        <a href="/intermediate-microeconomics-project/week9/exercise.html">Exercises Wk9</a>
        <a href="/intermediate-microeconomics-project/week10/exercise.html">Exercises Wk10</a>
        <a href="/intermediate-microeconomics-project/week11/exercise.html">Exercises Wk11</a>
        <a href="/intermediate-microeconomics-project/week12/exercise.html">Exercises Wk12</a>
      </div>
    </div>

    <div class="nav-menu">
    <div class="dropdown dropdown-right">
      <span class="dropdown-btn">Concepts ▾</span>
      <div class="dropdown-content">
        <a href="/intermediate-microeconomics-project/Instructor-Page/Foundations-of-Consumer-Behavior.html">Foundations of Consumer Behavior</a>
        <a href="/intermediate-microeconomics-project/Instructor-Page/Market-Equilibrium-Welfare-Supply-Demand.html">Market Equilibrium Welfare Supply & Demand</a>
        <a href="/intermediate-microeconomics-project/Instructor-Page/Consumer-Choice-Extensions.html">Consumer Choice Extensions</a>
        <a href="/intermediate-microeconomics-project/Instructor-Page/Production-Cost-Decision-Making.html">Production, Cost, Decision Making</a>
        <a href="/intermediate-microeconomics-project/Instructor-Page/Monopoly.html">Monopoly</a>
        <a href="/intermediate-microeconomics-project/Instructor-Page/Oligopoly.html">Oligopoly</a>
      </div>
    </div>
    
  </div>
</nav>`;


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

// Count missing, extra, incorrect, or adjacent swapped letters.
function editDistance(a, b) {
  const d = Array.from(
    { length: a.length + 1 },
    () => Array(b.length + 1).fill(0)
  );

  for (let i = 0; i <= a.length; i++) d[i][0] = i;
  for (let j = 0; j <= b.length; j++) d[0][j] = j;

  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;

      d[i][j] = Math.min(
        d[i - 1][j] + 1,
        d[i][j - 1] + 1,
        d[i - 1][j - 1] + cost
      );

      // An adjacent swap counts as one typo.
      if (
        i > 1 &&
        j > 1 &&
        a[i - 1] === b[j - 2] &&
        a[i - 2] === b[j - 1]
      ) {
        d[i][j] = Math.min(
          d[i][j],
          d[i - 2][j - 2] + 1
        );
      }
    }
  }

  return d[a.length][b.length];
}

// Cache words so we don't split the same content on every keystroke.
const searchWordCache = new Map();

function fuzzyTokens(text, tokens) {
  if (!text) return false;

  let words = searchWordCache.get(text);

  if (!words) {
    words = [...new Set(text.split(" ").filter(Boolean))];
    searchWordCache.set(text, words);
  }

  return tokens.every(token => {
    // Preserve normal partial-word matching.
    if (text.includes(token)) return true;

    // Avoid fuzzy matching short terms and numbers.
    if (token.length < 4 || /\d/.test(token)) return false;

    const tolerance = token.length >= 6 ? 2 : 1;

    return words.some(word => {
      if (/\d/.test(word)) return false;
      if (Math.abs(word.length - token.length) > tolerance) {
        return false;
      }

      return editDistance(token, word) <= tolerance;
    });
  });
}

function score(item, query, tokens) {
  // Normal matches always come first.
  if (item.titleText === query) return 0;
  if (item.titleText.includes(query)) return 1;
  if (allTokens(item.titleText, tokens)) return 2;

  if (allTokens(item.keywordText, tokens)) return 3;

  if (item.contentText.includes(query)) return 4;
  if (allTokens(item.contentText, tokens)) return 5;
  if (allTokens(item.allText, tokens)) return 6;

  // Typo matches: title, then keywords, then content.
  if (fuzzyTokens(item.titleText, tokens)) return 7;
  if (fuzzyTokens(item.keywordText, tokens)) return 8;
  if (fuzzyTokens(item.contentText, tokens)) return 9;
  if (fuzzyTokens(item.allText, tokens)) return 10;

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

(function loadNavbar() {
  const container = document.getElementById("navbar-container");
  if (!container) return;

  container.innerHTML = NAVBAR_HTML;

  initNavbarSearch();

  document.dispatchEvent(new Event("navbar-loaded"));
})();

