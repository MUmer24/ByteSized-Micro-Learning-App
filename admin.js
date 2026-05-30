
// Theme setup
document.addEventListener("DOMContentLoaded", () => {
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
  fetchAllQuestions();
});


// Data fetching and rendering (GET operation)
const tableBody = document.getElementById("table-body");

async function fetchAllQuestions() {
  try {
    const response = await fetch("http://localhost:3000/questions");

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    const questions = await response.json();
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
