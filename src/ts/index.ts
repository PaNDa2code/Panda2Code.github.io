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

  // Safe because we already checked themeToggle
  themeToggle.innerText = `${nextTheme}_mode`;
  themeToggle.title = `Switch to ${nextTheme.charAt(0).toUpperCase()}${nextTheme.slice(1)} Mode`;

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

// Function to fetch and display pinned projects
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

    projectCards.innerHTML = ""; // Clear previous cards

    for (const project of projects) {
      const card = document.createElement("a");
      card.href = project.url;
      card.target = "_blank";
      card.className = "project-card";

      // Create card body
      const cardBody = document.createElement("div");
      cardBody.className = "project-card-body";

      // Project title
      const title = document.createElement("h3");
      title.innerText = project.name;
      cardBody.appendChild(title);

      // Project description
      const description = document.createElement("p");
      description.innerText = project.description ?? "No description provided.";
      cardBody.appendChild(description);

      card.appendChild(cardBody);

      // Create card footer
      const cardFooter = document.createElement("div");
      cardFooter.className = "project-card-footer";

      // Stars
      if (project.stars !== undefined) {
        const stars = document.createElement("span");
        stars.innerText = ` ⭐ ${project.stars}`;
        cardFooter.appendChild(stars);
      }

      // Language icon
      if (project.language) {
        const langContainer = document.createElement("div");
        langContainer.style.display = "flex";
        langContainer.style.alignItems = "center";
        langContainer.style.gap = "4px";

        // Logo
        const langLogo = document.createElement("img");
        langLogo.src = `https://cdn.simpleicons.org/${project.language.name.toLowerCase()}`;
        langLogo.alt = project.language.name;
        langLogo.title = project.language.name;
        langLogo.style.width = "16px";
        langLogo.style.height = "16px";
        langLogo.style.display = "inline-block";
        langLogo.style.verticalAlign = "middle";
        langContainer.appendChild(langLogo);

        // Optional colored dot (GitHub-style)
        const langDot = document.createElement("span");
        langDot.style.width = "10px";
        langDot.style.height = "10px";
        langDot.style.borderRadius = "50%";
        langDot.style.backgroundColor = project.language.color;
        langContainer.appendChild(langDot);

        cardFooter.appendChild(langContainer);
      }

      card.appendChild(cardFooter);

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
