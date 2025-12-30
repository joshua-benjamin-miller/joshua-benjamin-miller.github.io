function loadNavbar() {
  fetch("/intermediate-microeconomics-project/assets/navbar.html")
    .then(response => response.text())
    .then(data => {
      document.getElementById("navbar-container").innerHTML = data;
    });
}

document.addEventListener("DOMContentLoaded", loadNavbar);
