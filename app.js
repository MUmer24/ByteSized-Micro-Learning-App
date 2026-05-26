// Variables and DOM Elements
const viewWelcome = document.getElementById("welcome-section");
const viewQuizRules = document.getElementById("quiz-rules-container");
const viewQuiz = document.getElementById("quiz-container");
const viewResults = document.getElementById("view-results");
const viewTopicSelection = document.getElementById("topic-selection-container");

const topicCards = document.querySelectorAll(".topic-card");
const startQuizBtn = document.getElementById("start-quiz-btn");
const quizCategoryBadge = document.getElementById("quiz-category-badge");

let selectedCategory = "";

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

// Topic selection logic
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

// Start Quiz Button Logic
startQuizBtn.addEventListener("click", () => {
  if (!selectedCategory) return;

  viewWelcome.classList.add("hidden");
  viewQuizRules.classList.add("hidden");
  viewTopicSelection.classList.add("hidden");
  quizCategoryBadge.textContent = selectedCategory;

  // Show Quiz
  viewQuiz.classList.remove("hidden");

  console.log("Starting quiz for category: ", selectedCategory);

  fetchQuestions(selectedCategory);
});

// Quiz logic (fetching questions, handling answers, showing results, etc.)

// Quiz variables and DOM Elemnts
let currentQuestions = [];
let currentQuestionIndex = 0;
let score = 0;

const questionText = document.getElementById("question-text");
const optionContainer = document.getElementById("options-container");
const quizProgress = document.getElementById("quiz-progress");
const nextQuestionBtn = document.getElementById("next-question-btn");

// Fetch questions from the JSON Server
async function fetchQuestions(category) {
  try {
    questionText.textContent = "Loading questions...";

    // Fetch questions for the selected category
    const response = await fetch(
      `http://localhost:3000/questions?category=${category.toUpperCase()}`,
    );

    if (!response.ok) {
      throw new Error("HTTP error! status: " + response.status);
    }

    currentQuestions = await response.json();
    console.log("Fetched questions: ", currentQuestions);

    if (currentQuestions.length > 0) {
      currentQuestionIndex = 0;
      score = 0;
      loadQuestion();
    } else {
      questionText.textContent = "No questions available for this category.";
    }
  } catch (error) {
    console.error("Error fetching questions: ", error);
    questionText.textContent =
      "Failed to load questions. Please try again later.";
  }
}

// Render Question to DOM
function loadQuestion() {
  nextQuestionBtn.setAttribute("disabled", "true");
  optionContainer.innerHTML = "";

  const currentQ = currentQuestions[currentQuestionIndex];

  // Update Progress text
  quizProgress.textContent = `Question ${currentQuestionIndex + 1} of ${currentQuestions.length}`;

  // Update question text
  questionText.textContent = currentQ.text;

  // Create Option Buttons (A, B, C)
  const options = [
    {
      key: "A",
      text: currentQ.optionA,
    },
    {
      key: "B",
      text: currentQ.optionB,
    },
    {
      key: "C",
      text: currentQ.optionC,
    },
  ];

  options.forEach((opt) => {
    const btn = document.createElement("button");
    btn.classList.add("option-btn");
    btn.textContent = `${opt.key} ${opt.text}`;

    // Handel option selection
    btn.addEventListener("click", () => {
      selectOption(btn, opt.key);
    });

    optionContainer.appendChild(btn);
  });
}

function selectOption(selectedBtn, selectedKey) {
  const allOptions = optionContainer.querySelectorAll(".option-btn");

  // remove 'selected class from all buttons
  allOptions.forEach((btn) => btn.classList.remove("selected"));

  // Highlight clicked button
  selectedBtn.classList.add("selected");

  // Save the answer to custom property on button
  selectedBtn.setAttribute("data-answer", selectedKey);

  // Enable Next Question button
  nextQuestionBtn.removeAttribute("disabled");
}
