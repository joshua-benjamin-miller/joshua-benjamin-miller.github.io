let allVisible = false;

function toggleAll() {
  const sections = document.querySelectorAll('.fold-target');
  const btn = document.getElementById('toggle-all-btn');

  allVisible = !allVisible;

  sections.forEach(sec => {
    if (allVisible) sec.classList.add('show');
    else sec.classList.remove('show');
  });

  btn.textContent = allVisible
    ? "Hide Answers"
    : "Show Answers";
}
