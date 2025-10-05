// Course data remains the same
const courses = [
  {
    id: 1,
    title: "Introduction to JavaScript",
    description: "Learn the basics of JavaScript, the most popular programming language for web development.",
  },
  {
    id: 2,
    title: "HTML & CSS Fundamentals",
    description: "Understand the building blocks of the web: HTML for structure and CSS for styling.",
  },
  {
    id: 3,
    title: "Frontend Frameworks Overview",
    description: "Get introduced to popular frontend frameworks like React, Vue, and Angular.",
  }
];

// DOM Elements
const authSection = document.getElementById('auth-section');
const authForm = document.getElementById('auth-form');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const authMessage = document.getElementById('auth-message');

const courseListSection = document.getElementById("course-list");
const courseListEl = courseListSection.querySelector("ul");
const logoutBtn = document.getElementById("logout-btn");

const courseDetailsSection = document.getElementById("course-details");
const courseTitleEl = document.getElementById("course-title");
const courseDescriptionEl = document.getElementById("course-description");
const completeBtn = document.getElementById("complete-btn");
const backBtn = document.getElementById("back-btn");

let currentUser = null;
let currentCourse = null;

// Utility functions to handle localStorage users and sessions
function getUsers() {
  return JSON.parse(localStorage.getItem('users') || '{}');
}

function saveUsers(users) {
  localStorage.setItem('users', JSON.stringify(users));
}

function getCurrentUser() {
  return JSON.parse(localStorage.getItem('currentUser'));
}

function setCurrentUser(user) {
  localStorage.setItem('currentUser', JSON.stringify(user));
}

function clearCurrentUser() {
  localStorage.removeItem('currentUser');
}

// On page load, check if user is logged in
window.onload = () => {
  currentUser = getCurrentUser();
  if (currentUser) {
    showCourseList();
  } else {
    showAuth();
  }
};

function showAuth(message = '') {
  authSection.classList.remove('hidden');
  courseListSection.classList.add('hidden');
  courseDetailsSection.classList.add('hidden');
  authMessage.textContent = message;
}

function showCourseList() {
  authSection.classList.add('hidden');
  courseDetailsSection.classList.add('hidden');
  courseListSection.classList.remove('hidden');
  renderCourseList();
}

function renderCourseList() {
  courseListEl.innerHTML = "";
  const userProgress = currentUser.completedCourses || {};

  courses.forEach(course => {
    const li = document.createElement("li");
    li.textContent = course.title;
    li.dataset.id = course.id;
    if (userProgress[course.id]) {
      li.classList.add("completed");
    }
    li.addEventListener("click", () => showCourseDetails(course.id));
    courseListEl.appendChild(li);
  });
}

function showCourseDetails(id) {
  currentCourse = courses.find(c => c.id === id);
  courseTitleEl.textContent = currentCourse.title;
  courseDescriptionEl.textContent = currentCourse.description;

  const userProgress = currentUser.completedCourses || {};
  const completed = !!userProgress[currentCourse.id];

  completeBtn.textContent = completed ? "Completed ✓" : "Mark as Completed";
  completeBtn.disabled = completed;

  courseListSection.classList.add("hidden");
  courseDetailsSection.classList.remove("hidden");
}

// Handle marking course as completed
completeBtn.addEventListener("click", () => {
  if (!currentCourse) return;

  currentUser.completedCourses = currentUser.completedCourses || {};
  currentUser.completedCourses[currentCourse.id] = true;

  // Save updated user progress
  const users = getUsers();
  users[currentUser.username] = currentUser;
  saveUsers(users);
  setCurrentUser(currentUser);

  completeBtn.textContent = "Completed ✓";
  completeBtn.disabled = true;
  renderCourseList();
});

// Back to course list
backBtn.addEventListener("click", () => {
  courseDetailsSection.classList.add("hidden");
  courseListSection.classList.remove("hidden");
});

// Logout button
logoutBtn.addEventListener("click", () => {
  clearCurrentUser();
  currentUser = null;
  showAuth();
});

// Login/Signup form submission
authForm.addEventListener("submit", e => {
  e.preventDefault();
  const username = usernameInput.value.trim();
  const password = passwordInput.value;

  if (!username || !password) {
    authMessage.textContent = "Please enter username and password.";
    return;
  }

  const users = getUsers();

  if (users[username]) {
    // User exists, verify password
    if (users[username].password === password) {
      currentUser = users[username];
      setCurrentUser(currentUser);
      showCourseList();
    } else {
      authMessage.textContent = "Incorrect password.";
    }
  } else {
    // Create new user
    users[username] = { username, password, completedCourses: {} };
    saveUsers(users);
    currentUser = users[username];
    setCurrentUser(currentUser);
    showCourseList();
  }

  authForm.reset();
});
