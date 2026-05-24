# **ByteSized \- Web Dev Micro-Learning App**

**Web Technologies SP26 \- Capstone Project**

**Student Name:** Muhammad Umer Khan

**Roll Number:** F24BDOCS1M01055

**Section:** 4th Semester - 2M

## **📖 Project Description**

ByteSized is a client-side web application designed to test and manage web development knowledge (HTML, CSS, JavaScript). It operates purely on Vanilla JavaScript and custom CSS, utilizing json-server as a mock REST backend.

The application is divided into two distinct panels:

1. **User Panel:** Where students can view active questions, filter them by category, and submit their quiz attempt and feedback.
2. **Admin Panel:** A management dashboard where instructors can view statistics, add new questions, edit existing ones, and delete outdated questions.

## **🚀 How to Install and Run**

1. **Install Node.js:** Ensure you have Node.js installed on your system.
2. **Install JSON Server:** Open your terminal and run the following command to install JSON Server globally (if not already installed):  
   npm install \-g json-server

3. **Start the Backend:** Navigate to the project folder in your terminal and run:  
   npx json-server \--watch db.json

   _Note: Ensure it is running on http://localhost:YOUR_RUNNING_PORT._

4. **Open the Application:** Open index.html directly in your modern web browser. Use the navigation links to switch between the User Panel and the Admin Panel.

## **✨ List of Features**

**User Panel (index.html)**

- \[x\] **GET Data:** Fetches active questions from the mock REST API using async/await.
- \[x\] **Filter:** Filter questions dynamically by Category (HTML, CSS, JS).
- \[x\] **POST Data:** Submit a Quiz Attempt via a 5-input form (Name, Roll No, Category, Difficulty, Feedback).
- \[x\] **Validation:** Strict inline form validation with custom UI error messages (No alert() boxes).
- \[x\] **Loading States:** Visual indicators while fetching data.

**Admin Panel (admin.html)**

- \[x\] **Statistics:** Calculates and displays 4 dashboard statistics (Total Questions, Total Attempts, Most Popular Category, Average Difficulty).
- \[x\] **Full CRUD Data Table:** Displays all questions in a responsive table.
- \[x\] **Create (POST):** Add a new question to the bank.
- \[x\] **Update (PUT/PATCH):** Edit an existing question inline.
- \[x\] **Delete (DELETE):** Remove a question (protected by a custom JS confirmation modal).

**Bonus Features**

- \[x\] **Mobile Responsiveness:** Custom CSS Flexbox and Grid layouts ensure the app looks perfect on desktop, tablet, and mobile phone screens.
- \[x\] **Dark Mode Toggle:** A custom dark mode theme that persists across pages and reloads using localStorage.

## **📸 Screenshots**

_(Replace these text blocks with actual image paths before submission)_

**1\. User Panel (Light Mode)**

\[Insert screenshot of index.html showing question cards and the form\]

**2\. Admin Panel (Dark Mode)**

\[Insert screenshot of admin.html showing the data table and statistics\]

**3\. Mobile View**

\[Insert screenshot demonstrating mobile responsiveness on a phone-sized viewport\]
