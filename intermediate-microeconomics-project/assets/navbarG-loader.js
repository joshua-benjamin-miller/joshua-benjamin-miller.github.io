const NAVBAR_HTML=`
<nav class="navbar">
  <div class="nav-left">
    <a href="/intermediate-microeconomics-project/index.html">Home</a>
  </div>

  <div class="nav-menu">
    <button id="export-desmos-btn" class="export-btn">
      Export graph
    </button>
  
    <div class="dropdown">
      <span class="dropdown-btn">Weeks ▾</span>
      <div class="dropdown-content">
        <a href="/intermediate-microeconomics-project/week1/concepts.html">Concepts Wk1</a>
        <a href="/intermediate-microeconomics-project/week2/concepts.html">Concepts Wk2</a>
        <a href="/intermediate-microeconomics-project/week3/concepts.html">Concepts Wk3</a>
        <a href="/intermediate-microeconomics-project/week4/concepts.html">Concepts Wk4</a>
        <a href="/intermediate-microeconomics-project/week5/concepts.html">Concepts Wk5</a>
        <a href="/intermediate-microeconomics-project/week6/concepts.html">Concepts Wk6</a>
        <a href="/intermediate-microeconomics-project/week7/concepts.html">Concepts Wk7</a>
        <a href="/intermediate-microeconomics-project/week8/concepts.html">Concepts Wk8</a>
        <a href="/intermediate-microeconomics-project/week9/concepts.html">Concepts Wk9</a>
        <a href="/intermediate-microeconomics-project/week10/concepts.html">Concepts Wk10</a>
        <a href="/intermediate-microeconomics-project/week11/concepts.html">Concepts Wk11</a>
        <a href="/intermediate-microeconomics-project/week12/concepts.html">Concepts Wk12</a>
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


(function loadNavbar() {
  const container = document.getElementById("navbar-container");
  if (!container) return;

  container.innerHTML = NAVBAR_HTML;

  document.dispatchEvent(new Event("navbar-loaded"));
})();
