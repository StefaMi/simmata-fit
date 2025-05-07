
export function toggleTheme() {
  const html = document.documentElement;
  const current = html.classList.contains("dark") ? "dark" : "light";
  const next = current === "dark" ? "light" : "dark";
  
  html.classList.remove(current);
  html.classList.add(next);
  localStorage.setItem("theme", next);
  
  // Update theme-color meta tag for mobile browsers
  updateThemeColor(next);
}

export function initializeTheme() {
  const stored = localStorage.getItem("theme");
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const theme = stored || (prefersDark ? "dark" : "light");
  
  document.documentElement.classList.remove("dark", "light");
  document.documentElement.classList.add(theme);
  
  // Update theme-color meta tag for mobile browsers
  updateThemeColor(theme);
}

// Function to update theme-color meta tag for mobile browsers
function updateThemeColor(theme: string) {
  const metaThemeColor = document.querySelector("meta[name='theme-color']");
  const color = theme === "dark" ? "#0f172a" : "#ffffff";
  
  if (metaThemeColor) {
    metaThemeColor.setAttribute("content", color);
  } else {
    const meta = document.createElement("meta");
    meta.name = "theme-color";
    meta.content = color;
    document.head.appendChild(meta);
  }
}

// Add an event listener for system preference changes
export function setupThemeListener() {
  const prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)");
  
  const handleChange = (e: MediaQueryListEvent) => {
    // Only change if user hasn't manually set a preference
    if (!localStorage.getItem("theme")) {
      const newTheme = e.matches ? "dark" : "light";
      document.documentElement.classList.remove("dark", "light");
      document.documentElement.classList.add(newTheme);
      updateThemeColor(newTheme);
    }
  };

  // Add event listener
  if (prefersDarkScheme.addEventListener) {
    prefersDarkScheme.addEventListener("change", handleChange);
  } else if ((prefersDarkScheme as any).addListener) {
    // For Safari and older browsers
    (prefersDarkScheme as any).addListener(handleChange);
  }
}
