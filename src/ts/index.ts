// Enum for theme
enum Theme {
  Light = "light",
  Dark = "dark",
}

// Grab theme toggle button
const themeToggle = document.getElementById("theme-toggle") as HTMLButtonElement | null;

// Ensure themeToggle exists
if (!themeToggle) {
  throw new Error("Element with id 'theme-toggle' not found");
}

// Initialize theme
const savedTheme = localStorage.getItem("theme");
if (!savedTheme) {
  setTheme(Theme.Dark);
} else {
  const themeString = savedTheme.replace("_mode", "") as keyof typeof Theme;
  setTheme(Theme[themeString] ?? Theme.Dark);
}

// Function to set theme
function setTheme(theme: Theme) {
  const nextTheme = theme === Theme.Light ? Theme.Dark : Theme.Light;

  if (themeToggle) {
    themeToggle.innerText = `${nextTheme}_mode`;
    themeToggle.title = `Switch to ${nextTheme.charAt(0).toUpperCase()}${nextTheme.slice(1)} Mode`;
  }

  localStorage.setItem("theme", `${theme}_mode`);
  document.documentElement.setAttribute("data-theme", theme);
}

// Theme toggle event
themeToggle.addEventListener("click", () => {
  const currentTheme = document.documentElement.getAttribute("data-theme") as Theme | null;
  const newTheme = currentTheme === Theme.Light ? Theme.Dark : Theme.Light;
  setTheme(newTheme);
});

// Type for pinned projects
interface PinnedProject {
  name: string;
  description?: string | null;
  url: string;
  stars?: number;
  forks?: number;
  language?: {
    name: string;
    color: string;
  } | null;
}

// Fetch and display pinned projects
async function fetchPinnedProjects() {
  try {
    const response = await fetch("/pins.json");
    if (!response.ok) {
      throw new Error(`Failed to fetch pinned projects: ${response.statusText}`);
    }
    const projects: PinnedProject[] = await response.json();

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
      description.innerText = project.description ?? "No description provided.";
      card.appendChild(description);

      // Optional: language
      if (project.language) {
        const lang = document.createElement("span");
        lang.innerText = `Language: ${project.language.name}`;
        lang.style.color = project.language.color;
        card.appendChild(lang);
      }

      // Optional: stars
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

// Fetch projects on window load
window.addEventListener("load", fetchPinnedProjects);
