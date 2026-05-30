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

const finalScoreDisplay = document.getElementById("final-score-display");
const quizCategorySelect = document.getElementById("quiz-category");

// Next Question Button Logic
nextQuestionBtn.addEventListener("click", () => {
  const selectedBtn = optionContainer.querySelector(".option-btn.selected");

  if (!selectedBtn) return;

  const userAnswer = selectedBtn.getAttribute("data-answer");
  const currentQ = currentQuestions[currentQuestionIndex];

  // Check if answer is correct
  if (userAnswer === currentQ.correctOption) {
    score++;
  }

  // Move to next question
  currentQuestionIndex++;

  // Check if there are more questions
  if (currentQuestionIndex < currentQuestions.length) {
    loadQuestion();
  } else {
    finishQuiz();
  }
});

// Finish Quiz and Show Results
function finishQuiz() {
  // Hide Active quiz view
  viewQuiz.classList.add("hidden");

  // Update final score
  finalScoreDisplay.textContent = score;

  // Update category in results view
  quizCategorySelect.value = selectedCategory.toUpperCase();

  quizCategorySelect.setAttribute("disabled", "true");

  // Show results view
  viewResults.classList.remove("hidden");
  viewResults.classList.add("fade-in");

  console.log(`Quiz finished. Final Score: ${score}/5`);
}

// Form validation and POST request
const feedbackForm = document.getElementById("feedback-form");
const submitResultsBtn = document.getElementById("submit-results-btn");
const formError = document.getElementById("form-error");

feedbackForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  // Clear any previous error messages
  formError.classList.add("hidden");
  formError.textContent = "";

  const studentName = document.getElementById("student-name").value.trim();
  const rollNumber = document.getElementById("roll-number").value.trim();
  const quizCategory = document.getElementById("quiz-category").value;
  const difficultyRating = document.getElementById("difficulty-rating").value;
  const feedbackNotes = document.getElementById("feedback-notes").value.trim();

  if (rollNumber.length < 5 || !rollNumber.includes("-")) {
    showError("Please enter a valid Roll Number format (e.g., SP26-BCS-001).");
    return; // Stop execution
  }

  if (feedbackNotes.length < 5) {
    showError("Please provide at least 5 characters of feedback.");
    return; // Stop execution
  }

  // Build the JSON Payload
  const payload = {
    studentName,
    rollNumber,
    category: quizCategory,
    difficultyRating: parseInt(difficultyRating, 10),
    feedback: feedbackNotes,
    score: score, // Tally from our global state
  };

  // Update UI to loading state
  const originalBtnText = submitResultsBtn.textContent;
  submitResultsBtn.setAttribute("disabled", "true");
  submitResultsBtn.textContent = "Saving...";

  // Send the POST Request
  try {
    const response = await fetch("http://localhost:3000/results", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    // check response.ok
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const savedData = await response.json();
    console.log("Result saved successfully:", savedData);

    // Success UI & App Reset
    submitResultsBtn.textContent = "Saved Successfully!";
    submitResultsBtn.style.backgroundColor = "#10b981"; // Success green
    
    // Automatically reset the app back to the welcome screen after 2 seconds
    setTimeout(() => {
      resetApp();
    }, 2000);

  } catch (error) {
    console.error("POST failed:", error);
    showError("Failed to save results. Is the JSON server running?");
    submitResultsBtn.removeAttribute("disabled");
    submitResultsBtn.textContent = originalBtnText;
  }

});


// Helper function to display errors inline
function showError(message) {
  formError.textContent = message;
  formError.classList.remove("hidden");
}

// Helper function to reset the app to the initial state
function resetApp() {
  // Clear the form
  feedbackForm.reset();
  
  // Reset the button UI
  submitResultsBtn.removeAttribute("disabled");
  submitResultsBtn.textContent = "Submit Results";
  submitResultsBtn.style.backgroundColor = ""; // Resets to CSS variable

  // Hide Results View
  viewResults.classList.add("hidden");
  viewResults.classList.remove("fade-in");
  
  // Show Initial Views
  document.getElementById("welcome-section").classList.remove("hidden");
  document.getElementById("quiz-rules-container").classList.remove("hidden");
  document.getElementById("topic-selection-container").classList.remove("hidden");
  
  // Reset Global Variables and Selection UI
  score = 0;
  currentQuestionIndex = 0;
  selectedCategory = "";
  
  document.getElementById("start-quiz-btn").setAttribute("disabled", "true");
  document.querySelectorAll(".topic-card").forEach(c => c.classList.remove("selected"));
}