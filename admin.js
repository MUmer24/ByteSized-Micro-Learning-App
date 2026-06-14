// Variables and DOM Elements

const API_BASE_URL = "http://localhost:3000/"; // Base URL for JSON Server

const tableBody = document.getElementById("table-body");

// Global state to store fetched questions so we can edit them
let allQuestions = [];

const addNewBtn = document.getElementById("add-new-btn");
const questionFormContainer = document.getElementById(
  "question-form-container",
);
const questionForm = document.getElementById("question-form");
const cancelFormBtn = document.getElementById("cancel-form-btn");
const formTitle = document.getElementById("form-title");
const editQuestionIdInput = document.getElementById("edit-question-id");
const adminFormError = document.getElementById("admin-form-error");

// Handle "Delete" Operations
const deleteModal = document.getElementById("delete-modal");
const cancelDeleteBtn = document.getElementById("cancel-delete-btn");
const confirmDeleteBtn = document.getElementById("confirm-delete-btn");
let deleteTargetId = null; // Store the ID of the item to be deleted

// Statistics and Chart
let chartInstance = null;

// ----------------------------------------------------

// Theme setup
document.addEventListener("DOMContentLoaded", async () => {
  const themeToggleBtn = document.getElementById("theme-toggle");
  const htmlElement = document.documentElement;
  // Check saved theme on page load
  const savedTheme = localStorage.getItem("theme") || "light";
  htmlElement.setAttribute("data-theme", savedTheme);
  updateThemeButton(savedTheme);

  themeToggleBtn.addEventListener("click", () => {
    const currentTheme = htmlElement.getAttribute("data-theme");
    const newTheme = currentTheme === "light" ? "dark" : "light";
    htmlElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);
    updateThemeButton(newTheme);
  });

  function updateThemeButton(theme) {
    const iconSpan = document.getElementById("theme-icon");
    iconSpan.textContent = theme === "light" ? "dark_mode" : "light_mode";
  }

  // Trigger initial fetch when page loads
  await fetchAllQuestions();
  await fetchDashboardStats();
});

// Data fetching and rendering (GET operation)

async function fetchAllQuestions() {
  try {
    const response = await fetch(`${API_BASE_URL}questions`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const questions = await response.json();
    allQuestions = questions; // Store questions globally for editing
    renderTable(questions);
  } catch (error) {
    console.error("Error fetching questions:", error);
    tableBody.innerHTML = `<tr><td colspan="5" class="text-center error-text-color">Error loading data. Is JSON Server running?</td></tr>`;
  }
}

function renderTable(questions) {
  tableBody.innerHTML = "";

  if (questions.length === 0) {
    tableBody.innerHTML = `<tr><td colspan="5" class="text-center">No questions found in database.</td></tr>`;
    return;
  }

  questions.forEach((q) => {
    const row = document.createElement("tr");

    row.innerHTML = `
        <td>${q.id}</td>
        <td><span class="badge">${q.category}</span></td>
        <td class="truncate-text">${q.text}</td>
        <td class="mono-bold">${q.correctOption}</td>
        <td>
        <button class="action-btn edit-btn" data-id="${q.id}" title="Edit"><span class="material-symbols-outlined">edit</span></button>
        <button class="action-btn delete-btn" data-id="${q.id}" title="Delete">
            <span class="material-symbols-outlined">delete</span>
        </button>
        </td>
        `;

    tableBody.appendChild(row);
  });
}

// Form handling (POST and PUT operations)

// Show Form for "Add New"
addNewBtn.addEventListener("click", () => {
  questionForm.reset();
  editQuestionIdInput.value = ""; // Clears ID so we know it is a POST request
  formTitle.textContent = "Add New Question";
  questionFormContainer.classList.remove("hidden");
  questionFormContainer.scrollIntoView({ behavior: "smooth" });
});

//Hide Form on "Cancel"
cancelFormBtn.addEventListener("click", () => {
  questionFormContainer.classList.add("hidden");
  questionForm.reset();
  adminFormError.classList.add("hidden");
});

// Handle "Edit" Button Clicks (Event Delegation)
tableBody.addEventListener("click", (e) => {
  // Find the closest button if clicked the icon inside it
  const editBtn = e.target.closest(".edit-btn");
  if (!editBtn) return;

  const targetId = editBtn.getAttribute("data-id");
  const questionToEdit = allQuestions.find((q) => q.id === targetId);

  if (questionToEdit) {
    // Populate the form
    document.getElementById("q-category").value = questionToEdit.category;
    document.getElementById("q-text").value = questionToEdit.text;
    document.getElementById("q-optA").value = questionToEdit.optionA;
    document.getElementById("q-optB").value = questionToEdit.optionB;
    document.getElementById("q-optC").value = questionToEdit.optionC;
    document.getElementById("q-correct").value = questionToEdit.correctOption;

    // Set hidden ID to refer to PUT mode
    editQuestionIdInput.value = questionToEdit.id;
    formTitle.textContent = `Edit Question (ID: ${questionToEdit.id})`;

    // Show form
    questionFormContainer.classList.remove("hidden");
    questionFormContainer.scrollIntoView({ behavior: "smooth" });
  }
});

// Handle Form Submission (POST or PUT)

questionForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  adminFormError.classList.add("hidden");

  // Gather payload
  const payload = {
    category: document.getElementById("q-category").value,
    text: document.getElementById("q-text").value.trim(),
    optionA: document.getElementById("q-optA").value.trim(),
    optionB: document.getElementById("q-optB").value.trim(),
    optionC: document.getElementById("q-optC").value.trim(),
    correctOption: document.getElementById("q-correct").value,
  };

  const editingId = editQuestionIdInput.value;
  const isEditing = editingId !== "";

  // Determine Method and Endpoint
  const method = isEditing ? "PUT" : "POST";
  const endpoint = isEditing
    ? `${API_BASE_URL}questions/${editingId}`
    : `${API_BASE_URL}questions`;

  try {
    const response = await fetch(endpoint, {
      method: method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

    // Success! Hide the form, clear it, and re-fetch the table
    questionFormContainer.classList.add("hidden");
    questionForm.reset();
    fetchAllQuestions(); // Re-render the updated table
  } catch (error) {
    console.error("Save failed:", error);
    adminFormError.textContent =
      "Failed to save question. Check server connection.";
    adminFormError.classList.remove("hidden");
  }
});


tableBody.addEventListener("click", (e) => {
  const deleteBtn = e.target.closest(".delete-btn");
  if (!deleteBtn) return;

  // Store id and Show confirmation modal
  deleteTargetId = deleteBtn.getAttribute("data-id");
  deleteModal.classList.remove("hidden");
  deleteModal.scrollIntoView({ behavior: "smooth", block: "center" });
});

cancelDeleteBtn.addEventListener("click", () => {
  deleteTargetId = null;
  deleteModal.classList.add("hidden");
});

// Confirm Deletion
confirmDeleteBtn.addEventListener("click", async () => {
  if (!deleteTargetId) return;

  try {
    const response = await fetch(`${API_BASE_URL}questions/${deleteTargetId}`, {
      method: "DELETE",
    });

    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

    // Hide modal and refresh the table
    deleteModal.classList.add("hidden");
    deleteTargetId = null;
    fetchAllQuestions(); // Re-render table
    fetchDashboardStats(); // Update stats since a question was removed
  } catch (error) {
    console.error("Delete failed:", error);
    alert("Failed to delete question. Check server connection.");
  }
});


async function fetchDashboardStats() {
  try {
    const response = await fetch(`${API_BASE_URL}results`);

    if (!response.ok) throw new Error("Failed to fetch results");

    const results = await response.json();

    document.getElementById("stat-total-qs").textContent = allQuestions.length;
    document.getElementById("stat-total-attempts").textContent = results.length;

    if (results.length > 0) {
      const totalDiff = results.reduce(
        (sum, res) => sum + res.difficultyRating,
        0,
      );
      const avgDiff = (totalDiff / results.length).toFixed(1);
      document.getElementById("stat-avg-diff").textContent = avgDiff;

      // Prepare data for chart
      const categoryCounts = { HTML: 0, CSS: 0, JS: 0 };
      results.forEach((res) => {
        if (categoryCounts[res.category] !== undefined) {
          categoryCounts[res.category]++;
        }
      });

      // Find top category
      const topCategory = Object.keys(categoryCounts).reduce((a, b) =>
        categoryCounts[a] > categoryCounts[b] ? a : b,
      );
      document.getElementById("stat-top-cat").textContent = topCategory;

      // Render Chart
      renderChart(categoryCounts.HTML, categoryCounts.CSS, categoryCounts.JS);
    }
  } catch (error) {
    console.error("Stats calculation failed:", error);
  }
}

function renderChart(htmlCount, cssCount, jsCount) {
  const ctx = document.getElementById("analytics-chart").getContext("2d");

  // Destroy previous chart instance if it exists to prevent overlap bugs
  if (chartInstance) {
    chartInstance.destroy();
  }

  // Fetch our CSS variables for the theme colors
  const computedStyle = getComputedStyle(document.documentElement);
  const accentColor =
    computedStyle.getPropertyValue("--accent").trim() || "#c4542f";
  // Use our light accent color for the transparent fill of the web chart
  const accentLightColor =
    computedStyle.getPropertyValue("--accent-light").trim() ||
    "rgba(196, 84, 47, 0.2)";

  chartInstance = new Chart(ctx, {
    type: "radar", // This changes it to a Web/Radar chart!
    data: {
      labels: ["HTML", "CSS", "JavaScript"],
      datasets: [
        {
          label: "Total Quiz Attempts",
          data: [htmlCount, cssCount, jsCount],
          backgroundColor: accentLightColor, // Transparent inside
          borderColor: accentColor, // Solid outer web line
          pointBackgroundColor: accentColor, // Dots on the web
          pointBorderColor: "#fff",
          pointHoverBackgroundColor: "#fff",
          pointHoverBorderColor: accentColor,
          borderWidth: 2,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        r: {
          // Radar charts use an 'r' (radial) scale instead of x/y
          beginAtZero: true,
          ticks: {
            stepSize: 1, // Keep it to whole numbers
            backdropColor: "transparent", // Hides the background behind the numbers
          },
        },
      },
    },
  });
}
