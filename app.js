// Theme switcher
document.addEventListener("DOMContentLoaded", () => {
  // Get theme elements
  const themeToggleBtn = document.getElementById("theme-toggle");
  const htmlElement = document.documentElement;

  // Check saved theme on page load
  const savedTheme = localStorage.getItem("theme") || "light";
  htmlElement.setAttribute("data-theme", savedTheme);
  updateThemeButton(savedTheme);

  themeToggleBtn.addEventListener("click", () => {
    const currentTheme = htmlElement.getAttribute("data-theme");
    const newTheme = currentTheme === "light" ? "dark" : "light";

    // Update theme
    htmlElement.setAttribute("data-theme", newTheme);
    // Save to local Storage
    localStorage.setItem("theme", newTheme);
    // Update Button
    updateThemeButton(newTheme);
  });

  function updateThemeButton(theme) {
    const iconSpan = document.getElementById("theme-icon");

    if (theme === "light") {
      iconSpan.textContent = "dark_mode";
    } else {
      iconSpan.textContent = "light_mode";
    }
  }
});
