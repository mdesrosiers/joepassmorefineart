const btn = document.getElementById("theme-toggle");
const root = document.documentElement;

function syncLabel() {
  const isDark = root.classList.contains("dark");
  btn?.setAttribute("aria-label", isDark ? "Switch to light mode" : "Switch to dark mode");
}

syncLabel();

btn?.addEventListener("click", () => {
  const isDark = root.classList.toggle("dark");
  localStorage.setItem("theme", isDark ? "dark" : "light");
  syncLabel();
});
