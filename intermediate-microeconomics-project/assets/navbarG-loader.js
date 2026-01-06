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

          const weekMatch = (item.url || "").match(/week(\d+)/);
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

(function loadNavbar() {
  const container = document.getElementById("navbar-container");
  if (!container) return;

  container.innerHTML = NAVBAR_HTML;

  initNavbarSearch();

  document.dispatchEvent(new Event("navbar-loaded"));
})();

