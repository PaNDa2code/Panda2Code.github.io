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

async function fetchPinnedProjects() {
  try {
    const response = await fetch("/pins.json");
    if (!response.ok) {
      throw new Error(`Failed to fetch pinned projects: ${response.statusText}`);
    }
    const projects = await response.json();

    const projectCards = document.getElementById("project-cards");
    if (!projectCards) {
      console.error("Element with id 'project-cards' not found.");
      return;
    }

    for (const project of projects) {
      const card = document.createElement("a");
      card.href = project.url;
      card.target = "_blank";
      card.className = "project-card";

      const title = document.createElement("h3");
      title.innerText = project.name;
      card.appendChild(title);

      const description = document.createElement("p");
      description.innerText = project.description || "No description provided.";
      card.appendChild(description);

      // Optional: Add language and star count
      if (project.language) {
        const lang = document.createElement("span");
        lang.innerText = `Language: ${project.language.name}`;
        lang.style.color = project.language.color;
        card.appendChild(lang);
      }
      if (project.stars !== undefined) {
        const stars = document.createElement("span");
        stars.innerText = ` ⭐ ${project.stars}`;
        card.appendChild(stars);
      }

      projectCards.appendChild(card);
    }
  } catch (error) {
    console.error("Error loading pinned projects:", error);
    const projectCards = document.getElementById("project-cards");
    if (projectCards) {
      projectCards.innerHTML = "<p>Could not load pinned projects. Please try again later.</p>";
    }
  }
}

window.addEventListener("load", fetchPinnedProjects);
