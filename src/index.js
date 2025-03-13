import './styles.css';

let themeToggle = document.getElementById("theme-toggle");

if (!localStorage.getItem("theme")) {
  setTheme("dark");
} else {
  let savedTheme = localStorage.getItem("theme").replace("_mode", "");
  setTheme(savedTheme);
}

function setTheme(theme) {
  let nextTheme = theme === "light" ? "dark" : "light";

  themeToggle.innerText = nextTheme + "_mode";
  themeToggle.title = "Switch to " + nextTheme.charAt(0).toUpperCase() + nextTheme.slice(1) + " Mode";

  localStorage.setItem("theme", theme + "_mode");
  document.documentElement.setAttribute("data-theme", theme);
}

themeToggle.addEventListener("click", () => {
  let currentTheme = document.documentElement.getAttribute("data-theme");
  let newTheme = currentTheme === "light" ? "dark" : "light";
  setTheme(newTheme);
});
