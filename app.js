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

const viewWelcome = document.getElementById("welcome-section");
const viewQuizRules = document.getElementById("quiz-rules-container");
const viewQuiz = document.getElementById("quiz-container");
const viewResults = document.getElementById("view-results");
const viewTopicSelection = document.getElementById("topic-selection-container");

const topicCards = document.querySelectorAll(".topic-card");
const startQuizBtn = document.getElementById("start-quiz-btn");
const quizCategoryBadge = document.getElementById("quiz-category-badge");

let selectedCategory = "";

topicCards.forEach((card) => {
  card.addEventListener("click", () => {
    // Remove 'selected' class from all cards
    topicCards.forEach((c) => c.classList.remove("selected"));

    // Add 'selected' class to clicked card
    card.classList.add("selected");
    console.log("Selected category: ", card);

    // Save the selected category
    selectedCategory = card.getAttribute("data-category");

    // Update quiz category Button
    startQuizBtn.removeAttribute("disabled");
  });
});

startQuizBtn.addEventListener("click", ()=>{
  if(!selectedCategory) return;

  viewWelcome.classList.add("hidden");
  viewQuizRules.classList.add("hidden");
  viewTopicSelection.classList.add("hidden");
  quizCategoryBadge.textContent = selectedCategory;

  // Show Quiz 
  viewQuiz.classList.remove("hidden");

  console.log("Starting quiz for category: ", selectedCategory);
});