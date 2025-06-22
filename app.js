// =====================
// Digital Planner App JS
// =====================

// ---- Section Navigation ----
const sidebar = document.getElementById('sidebar');
const sections = document.querySelectorAll('.page-section');
const sidebarButtons = sidebar.querySelectorAll('button[data-section]');
let currentSectionId = 'dashboard';
function showSection(id) {
  sections.forEach(sec => {
    sec.hidden = (sec.id !== id);
    if (!sec.hidden) {
      sec.classList.add('slide-in');
      setTimeout(() => sec.classList.remove('slide-in'), 400);
    }
  });
  sidebarButtons.forEach(btn => btn.classList.toggle('active', btn.dataset.section === id));
  currentSectionId = id;
}
sidebarButtons.forEach(btn => {
  btn.addEventListener('click', () => showSection(btn.dataset.section));
});
// Show default section
showSection(currentSectionId);

// ---- Theme Switcher ----
const themeSwitcher = document.getElementById('theme-switcher');
const themes = ['light', 'dark', 'pastel'];
function getCurrentTheme() {
  return localStorage.getItem('theme') || 'light';
}
function setTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);
  themeSwitcher.textContent = ({
    light: "🌞", dark: "🌙", pastel: "🧁"
  })[theme];
}
themeSwitcher.addEventListener('click', () => {
  let idx = themes.indexOf(getCurrentTheme());
  let nextTheme = themes[(idx+1) % themes.length];
  setTheme(nextTheme);
});
setTheme(getCurrentTheme());

// ---- Layout Dragger (Stub) ----
const layoutDragger = document.getElementById('layout-dragger');
layoutDragger.textContent = "🖲️";
layoutDragger.addEventListener('click', () => {
  alert('Drag-and-drop layout customization coming soon!');
});

// ---- FAB: Floating Add Button Logic ----
document.querySelectorAll('.fab').forEach(fab => {
  fab.addEventListener('click', e => {
    const section = fab.closest('.page-section');
    if (section) {
      switch (section.id) {
        case 'projects':
          openProjectModal();
          break;
        case 'tasks':
          openTaskModal();
          break;
        // Add more cases as needed for content, notes, goals, etc.
        default:
          alert(`Add new item in "${section.id}"`);
      }
    }
  });
});

// ---- Modal Example (Project/Task) ----
function openProjectModal() {
  const modal = document.getElementById('project-modal');
  if (modal) { modal.showModal(); }
}
function closeProjectModal() {
  const modal = document.getElementById('project-modal');
  if (modal) { modal.close(); }
}
// Add events for modal close if needed

// ---- Slide-in Animation ----
const style = document.createElement('style');
style.textContent = `
.slide-in {
  animation: slideInFade 0.4s;
}
@keyframes slideInFade {
  from { opacity:0; transform: translateY(20px);}
  to { opacity:1; transform: translateY(0);}
}`;
document.head.appendChild(style);

// ---- Collapsible Sections (if used) ----
document.querySelectorAll('.collapsible > .collapsible-header').forEach(header => {
  header.addEventListener('click', () => {
    const parent = header.parentElement;
    const expanded = parent.getAttribute('aria-expanded') === "true";
    parent.setAttribute('aria-expanded', !expanded);
  });
});

// ---- Responsive Sidebar (mobile) ----
function adjustSidebarMobile() {
  if (window.innerWidth <= 600) {
    // Move sidebar to bottom, handled by CSS
    sidebar.setAttribute('aria-label', 'Bottom Navigation');
  } else {
    sidebar.setAttribute('aria-label', 'Main Navigation');
  }
}
window.addEventListener('resize', adjustSidebarMobile);
adjustSidebarMobile();

// ---- Calendar View Toggle ----
const calendarSection = document.getElementById('calendar');
if (calendarSection) {
  const viewSwitch = calendarSection.querySelector('.calendar-view-switch');
  if (viewSwitch) {
    viewSwitch.querySelectorAll('button').forEach(btn => {
      btn.addEventListener('click', () => {
        viewSwitch.querySelectorAll('button').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        // Replace with actual calendar rendering logic!
        calendarSection.querySelector('.calendar-container').textContent =
          `Viewing: ${btn.dataset.view}`;
      });
    });
    // Set default view
    viewSwitch.querySelector('button[data-view="week"]').click();
  }
}

// ---- Simple Drag-and-drop for Cards (Tasks Example) ----
const taskBoard = document.querySelector('.task-board');
if (taskBoard) {
  taskBoard.addEventListener('dragstart', e => {
    if (e.target.classList.contains('card')) {
      e.target.classList.add('dragging');
      e.dataTransfer.effectAllowed = 'move';
    }
  });
  taskBoard.addEventListener('dragend', e => {
    if (e.target.classList.contains('card')) {
      e.target.classList.remove('dragging');
    }
  });
  taskBoard.addEventListener('dragover', e => {
    e.preventDefault();
    const dragging = taskBoard.querySelector('.card.dragging');
    if (dragging) {
      // Find where to insert
      const after = Array.from(taskBoard.children).find(child =>
        child !== dragging &&
        child.getBoundingClientRect().top > e.clientY
      );
      taskBoard.insertBefore(dragging, after || null);
    }
  });
  // Make all cards draggable
  taskBoard.querySelectorAll('.card').forEach(card => card.setAttribute('draggable', true));
}

// ---- Local Storage Save/Load for MVP ----
function saveData(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch {}
}
function loadData(key, fallback=[]) {
  try {
    return JSON.parse(localStorage.getItem(key)) || fallback;
  } catch { return fallback; }
}

// --- TOP BAR LOGIC ---

// 1. Greeting logic
function getGreeting() {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return { text: "Good morning", emoji: "☀️" };
  if (hour >= 12 && hour < 17) return { text: "Good afternoon", emoji: "🌤" };
  if (hour >= 17 && hour < 21) return { text: "Good evening", emoji: "🌙" };
  return { text: "Good night", emoji: "🌌" };
}
function getUserName() {
  return localStorage.getItem('name') || "sunshine";
}
function setGreeting() {
  const greetingDiv = document.getElementById('greeting');
  if (!greetingDiv) return;
  const {text, emoji} = getGreeting();
  const name = getUserName();
  greetingDiv.textContent = `${text}, ${name} ${emoji}`;
}
setGreeting();
setInterval(setGreeting, 60 * 1000); // update every minute

// 2. Prompt animation logic
function animatePrompt() {
  const promptDiv = document.getElementById('prompt');
  if (!promptDiv) return;
  setTimeout(() => {
    promptDiv.classList.add('fade-out');
  }, 5000);
}
animatePrompt();

// 3. Today's date logic
function setTodayDate() {
  const now = new Date();
  const options = { weekday: 'long', month: 'long', day: 'numeric' };
  const dateStr = now.toLocaleDateString(undefined, options);
  const dateDiv = document.getElementById('today-date');
  if (dateDiv) dateDiv.textContent = dateStr;
}
setTodayDate();

// 4. Weather logic
async function setWeather() {
  const widget = document.getElementById('weather-widget');
  const iconSpan = document.getElementById('weather-icon');
  const tempSpan = document.getElementById('weather-temp');
  const descSpan = document.getElementById('weather-desc');
  if (!widget) return;
  if (!navigator.geolocation) {
    widget.textContent = "🌦 Weather unavailable";
    return;
  }
  widget.textContent = "Fetching weather...";
  navigator.geolocation.getCurrentPosition(async pos => {
    const {latitude, longitude} = pos.coords;
    try {
      // OpenWeatherMap API call
      const apiKey = "5a52a7229e08b03ecf70533c7716aaf4";
      const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;
      const res = await fetch(url);
      if (!res.ok) throw new Error("Weather fetch failed");
      const data = await res.json();
      // Emoji mapping
      const weatherId = data.weather[0].id;
      const emoji = getWeatherEmoji(weatherId, data.weather[0].icon);
      const temp = Math.round(data.main.temp);
      const desc = data.weather[0].main;
      iconSpan.textContent = emoji;
      tempSpan.textContent = `${temp}°C`;
      descSpan.textContent = desc;
    } catch (e) {
      widget.textContent = "🌦 Weather unavailable";
    }
  }, err => {
    widget.textContent = "Location required";
  });
}
function getWeatherEmoji(id, icon) {
  // Basic mapping for main weather codes
  if (id >= 200 && id < 300) return "⛈️";
  if (id >= 300 && id < 400) return "🌦";
  if (id >= 500 && id < 600) return (icon.includes("d") ? "🌦" : "🌧");
  if (id >= 600 && id < 700) return "❄️";
  if (id >= 700 && id < 800) return "🌫️";
  if (id === 800) return (icon.includes("d") ? "☀️" : "🌕");
  if (id === 801 || id === 802) return "🌤";
  if (id === 803 || id === 804) return "☁️";
  return "🌦";
}
setWeather();
// Example (for projects):
// saveData('projects', [{id:1, name:'My Project'}]);
// const projects = loadData('projects');

// ---- Reminders/Upcoming Deadlines Logic (stub) ----
// === Reminders & Deadlines Split Layout Logic ===

// --- Task Data Model (mock/localStorage) ---
const mockTasks = [
  {
    id: "1",
    title: "Finish UI wireframe",
    dueDate: "2025-06-20",
    status: "pending",
    project: "Work",
    importance: "high",
    createdAt: "2025-06-15T10:00:00"
  },
  {
    id: "2",
    title: "Email marketing copy",
    dueDate: "2025-06-19",
    status: "completed",
    project: "Marketing",
    importance: "medium",
    createdAt: "2025-06-13T09:32:00"
  },
  {
    id: "3",
    title: "Social media graphics",
    dueDate: "2025-06-17",
    status: "pending",
    project: "Personal",
    importance: "low",
    createdAt: "2025-06-10T09:00:00"
  },
  {
    id: "4",
    title: "Client meeting prep",
    dueDate: "2025-06-21",
    status: "pending",
    project: "Work",
    importance: "high",
    createdAt: "2025-06-16T08:00:00"
  },
  {
    id: "5",
    title: "Submit portfolio case",
    dueDate: "2025-06-15",
    status: "completed",
    project: "Personal",
    importance: "medium",
    createdAt: "2025-06-07T10:00:00"
  }
  // ... more sample tasks
];

function loadTasks() {
  return JSON.parse(localStorage.getItem('tasks') || 'null') || mockTasks;
}
function saveTasks(tasks) {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

// --- Date Utilities ---
function isPast(dateStr) {
  const today = new Date();
  today.setHours(0,0,0,0);
  return new Date(dateStr) < today;
}
function isDueThisWeek(dateStr) {
  const today = new Date();
  const date = new Date(dateStr);
  // Get Monday of this week
  const monday = new Date(today);
  const day = today.getDay();
  const diff = (day === 0 ? -6 : 1) - day;
  monday.setDate(today.getDate() + diff);
  monday.setHours(0,0,0,0);
  // Get Sunday
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  sunday.setHours(23,59,59,999);
  return date >= monday && date <= sunday;
}
function getRecencyLabel(dueDate) {
  const date = new Date(dueDate);
  const now = new Date();
  const daysAgo = Math.floor((now - date) / (1000*60*60*24));
  if (daysAgo === 1) return "Yesterday";
  if (daysAgo < 7) return `${daysAgo} days ago`;
  if (daysAgo < 14) return "Last week";
  return date.toLocaleDateString();
}

// --- Render Reminders & Past Deadlines ---
let showPast = false;
let lastArchivedTask = null;
function renderRemindersAndPerformance() {
  const tasks = loadTasks();
  const overdue = tasks.filter(
    t => t.status === "pending" && isPast(t.dueDate)
  ).sort((a, b) => new Date(b.dueDate) - new Date(a.dueDate));

  const remindersList = document.getElementById('reminders-list');
  remindersList.innerHTML = '';
  if (!showPast) {
    overdue.forEach(task => {
      const li = document.createElement('li');
      li.className = 'overdue';
      li.innerHTML = `
        <span>
          ${task.title}
          <span class="recency-label" style="color:#ec407a; font-size:0.87em; margin-left:0.8em;">${getRecencyLabel(task.dueDate)}</span>
        </span>
        <span class="task-actions">
          <button class="edit-task" title="Edit Task" data-id="${task.id}">
            <i data-lucide="edit"></i>
          </button>
          <button class="resched-task" title="Reschedule" data-id="${task.id}">
            <i data-lucide="calendar"></i>
          </button>
          <button class="archive-task" title="Archive" data-id="${task.id}">
            <i data-lucide="archive"></i>
          </button>
        </span>
      `;
      // Click opens modal
      li.addEventListener('click', (e) => {
        if (!e.target.closest('.task-actions')) openTaskModal(task.id);
      });
      // Action buttons
      li.querySelector('.edit-task').onclick = (e) => { e.stopPropagation(); openTaskModal(task.id); };
      li.querySelector('.resched-task').onclick = (e) => { e.stopPropagation(); openTaskModal(task.id, 'reschedule'); };
      li.querySelector('.archive-task').onclick = (e) => { e.stopPropagation(); archiveTask(task.id, li); };
      remindersList.appendChild(li);
    });
  }

  // Past Deadlines
  const pastWidget = document.getElementById('past-deadlines');
  const pastList = document.getElementById('past-tasks-list');
  pastList.innerHTML = '';
  if (showPast) {
    pastWidget.removeAttribute('hidden');
    const archived = tasks.filter(
      t => t.status === "archived"
    ).sort((a, b) => new Date(b.dueDate) - new Date(a.dueDate));
    archived.forEach(task => {
      const li = document.createElement('li');
      li.innerHTML = `
        <span>
          ${task.title}
          <span class="recency-label" style="color:#b39ddb; font-size:0.85em; margin-left:0.8em;">${getRecencyLabel(task.dueDate)}</span>
        </span>
        <span class="task-actions">
          <button class="edit-task" title="Edit Task" data-id="${task.id}">
            <i data-lucide="edit"></i>
          </button>
          <button class="resched-task" title="Reschedule" data-id="${task.id}">
            <i data-lucide="calendar"></i>
          </button>
        </span>
      `;
      li.addEventListener('click', (e) => {
        if (!e.target.closest('.task-actions')) openTaskModal(task.id);
      });
      li.querySelector('.edit-task').onclick = (e) => { e.stopPropagation(); openTaskModal(task.id); };
      li.querySelector('.resched-task').onclick = (e) => { e.stopPropagation(); openTaskModal(task.id, 'reschedule'); };
      pastList.appendChild(li);
    });
  } else {
    pastWidget.setAttribute('hidden', 'true');
  }

  // Weekly Performance
  const weekTasks = tasks.filter(t => isDueThisWeek(t.dueDate));
  const completed = weekTasks.filter(t => t.status === "completed").length;
  const total = weekTasks.length;
  const percent = total ? Math.round(completed / total * 100) : 0;
  const bar = document.getElementById('performance-bar');
  bar.style.width = percent + "%";
  const label = document.getElementById('performance-label');
  label.textContent = `${completed} of ${total} tasks complete (${percent}%)`;

  // Animate Lucide icons
  if (window.lucide) lucide.createIcons();
}
renderRemindersAndPerformance();

// --- Past Tasks Toggle ---
const toggleBtn = document.getElementById('toggle-past-tasks');
toggleBtn.addEventListener('click', () => {
  showPast = !showPast;
  toggleBtn.classList.toggle('active', showPast);
  toggleBtn.setAttribute('aria-pressed', showPast ? 'true' : 'false');
  toggleBtn.querySelector('.toggle-label').textContent = showPast ? "Show Current Tasks" : "Show Past Tasks";
  renderRemindersAndPerformance();
});

// --- Archive Task Logic ---
function archiveTask(taskId, li) {
  const tasks = loadTasks();
  const idx = tasks.findIndex(t => t.id === taskId);
  if (idx === -1) return;
  tasks[idx].status = "archived";
  saveTasks(tasks);
  lastArchivedTask = {...tasks[idx]};
  // Animate out
  li.classList.add('archiving');
  setTimeout(() => {
    renderRemindersAndPerformance();
    showSnackbar("Task archived.", undoArchive);
  }, 500);
}
function undoArchive() {
  if (!lastArchivedTask) return;
  const tasks = loadTasks();
  const idx = tasks.findIndex(t => t.id === lastArchivedTask.id);
  if (idx !== -1) {
    tasks[idx].status = "pending";
    saveTasks(tasks);
    renderRemindersAndPerformance();
    lastArchivedTask = null;
  }
}

// --- Snackbar Logic ---
function showSnackbar(msg, undoFn) {
  const snackbar = document.getElementById('snackbar');
  snackbar.innerHTML = `${msg} <button id="undo-archive">Undo</button>`;
  snackbar.classList.add('show');
  snackbar.removeAttribute('hidden');
  const undoBtn = snackbar.querySelector('#undo-archive');
  const hide = () => {
    snackbar.classList.remove('show');
    setTimeout(() => snackbar.setAttribute('hidden', ''), 400);
  };
  let timer = setTimeout(hide, 5000);
  undoBtn.onclick = () => {
    if (undoFn) undoFn();
    clearTimeout(timer);
    hide();
  };
}

// --- Modal Overlay for Editing/Rescheduling ---
function openTaskModal(taskId, focusField) {
  const tasks = loadTasks();
  const task = tasks.find(t => t.id === taskId);
  if (!task) return;
  let modal = document.getElementById('edit-task-modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = "edit-task-modal";
    modal.className = "custom-modal-overlay";
    modal.innerHTML = `
      <div class="custom-modal">
        <button class="close-modal" aria-label="Close">&times;</button>
        <h3>Edit Task</h3>
        <form>
          <label>Title
            <input type="text" name="title" required />
          </label>
          <label>Due Date
            <input type="date" name="dueDate" required />
          </label>
          <label>Importance
            <select name="importance">
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </label>
          <label>Project
            <input type="text" name="project" />
          </label>
          <div class="modal-actions">
            <button type="submit" class="save-btn">Save</button>
            <button type="button" class="archive-btn">Archive</button>
          </div>
        </form>
      </div>
    `;
    document.body.appendChild(modal);
  }
  // Fill form
  const form = modal.querySelector('form');
  form.title.value = task.title;
  form.dueDate.value = task.dueDate;
  form.importance.value = task.importance;
  form.project.value = task.project;
  // Show modal
  modal.style.display = "flex";
  setTimeout(() => modal.classList.add("active"), 10);
  // Focus
  if (focusField === 'reschedule') { form.dueDate.focus(); }
  else { form.title.focus(); }
  // Save
  form.onsubmit = (e) => {
    e.preventDefault();
    task.title = form.title.value;
    task.dueDate = form.dueDate.value;
    task.importance = form.importance.value;
    task.project = form.project.value;
    saveTasks(tasks);
    closeTaskModal();
    renderRemindersAndPerformance();
  };
  // Archive
  form.querySelector('.archive-btn').onclick = (e) => {
    e.preventDefault();
    closeTaskModal();
    archiveTask(task.id, null);
  };
  // Close
  modal.querySelector('.close-modal').onclick = closeTaskModal;
  modal.onclick = (e) => {
    if (e.target === modal) closeTaskModal();
  };
}
function closeTaskModal() {
  const modal = document.getElementById('edit-task-modal');
  if (modal) {
    modal.classList.remove("active");
    setTimeout(() => { modal.style.display = "none"; }, 200);
  }
}

// --- Modal CSS (inject if not present) ---
(function injectModalCSS() {
  if (document.getElementById('custom-modal-css')) return;
  const style = document.createElement('style');
  style.id = "custom-modal-css";
  style.textContent = `
.custom-modal-overlay {
  position: fixed; z-index: 120;
  left: 0; top: 0; width: 100vw; height: 100vh;
  background: rgba(255,182,182,0.18);
  backdrop-filter: blur(8px);
  display: none; align-items: center; justify-content: center;
  transition: background 0.3s;
}
.custom-modal-overlay.active { animation: fadeZoomIn 0.3s; }
@keyframes fadeZoomIn {
  from { opacity:0; transform: scale(0.96);}
  to { opacity:1; transform: scale(1);}
}
.custom-modal {
  background: #fff8fd;
  border-radius: 22px;
  box-shadow: 0 8px 36px #fcb6b655, 0 1px 10px #b39ddb22;
  padding: 2.2em 1.7em 1.3em 1.7em;
  min-width: 310px;
  max-width: 95vw;
  font-family: 'Quicksand', 'Playfair Display', Arial, sans-serif;
  position: relative;
  animation: fadeZoomIn 0.3s;
}
.custom-modal h3 { margin-top: 0; margin-bottom: 1.2em; color: #ec407a;}
.custom-modal label { display: block; margin-top: 0.7em; font-size:1.08em;}
.custom-modal input, .custom-modal select {
  width: 100%; margin-top: 0.15em; margin-bottom: 0.6em;
  padding: 0.6em 0.8em; border-radius: 10px; border: 1px solid #fcb6b6;
  background: #fff; font-size:1em;
}
.custom-modal .modal-actions {
  display: flex; gap: 1em; justify-content: flex-end; margin-top: 1.2em;
}
.custom-modal .save-btn {
  background: #a5d6a7; color: #222; border: none; padding:0.7em 1.5em; border-radius: 1em;
  font-weight: 600; cursor: pointer;
}
.custom-modal .archive-btn {
  background: #f8bbd0; color: #ec407a; border: none; padding:0.7em 1.5em; border-radius: 1em;
  font-weight: 600; cursor: pointer;
}
.custom-modal .close-modal {
  position: absolute; top: 1.1em; right: 1em;
  background: none; border: none; font-size: 2em; color: #ec407a; cursor: pointer;
  opacity: 0.7; transition: opacity 0.18s;
}
.custom-modal .close-modal:hover { opacity: 1;}
@media (max-width:600px) {
  .custom-modal { min-width: 90vw; padding: 1.2em 0.5em 0.7em 0.5em; }
}
@media (prefers-reduced-motion: reduce) {
  .custom-modal-overlay, .custom-modal { animation: none !important;}
}
`;
  document.head.appendChild(style);
})();

// --- Lucide Icons Init (run after DOMContentLoaded) ---
if (window.lucide) lucide.createIcons();
else {
  const lucideScript = document.createElement('script');
  lucideScript.src = "https://unpkg.com/lucide@latest";
  lucideScript.onload = () => lucide.createIcons();
  document.head.appendChild(lucideScript);
}
// === Today’s Tasks Section Logic ===

// --- Utility Functions ---
function isToday(dateStr) {
  const today = new Date();
  const date = new Date(dateStr);
  return date.getFullYear() === today.getFullYear() &&
    date.getMonth() === today.getMonth() &&
    date.getDate() === today.getDate();
}
function importanceToOrder(importance) {
  return { high: 0, medium: 1, low: 2 }[importance] ?? 3;
}
function importanceToColor(importance) {
  return importance === "high" ? "red"
       : importance === "medium" ? "blue"
       : "green";
}
function projectColor(project) {
  return {
    Work: "#9575cd",
    School: "#00bcd4",
    Personal: "#f48fb1",
    Other: "#90a4ae"
  }[project] || "#bdbdbd";
}

// --- State ---
let activeProjectFilter = null;
let lastDeletedTask = null;

// --- Rendering ---
function renderTodaysTasks() {
  const allTasks = loadTasks().filter(t => t.status !== "archived");
  const todayTasks = allTasks.filter(t => isToday(t.dueDate));
  let filtered = todayTasks;
  if (activeProjectFilter) {
    filtered = filtered.filter(t => t.project === activeProjectFilter);
    document.getElementById('project-filter-bar').hidden = false;
    document.getElementById('active-project-tag').textContent = activeProjectFilter;
    document.getElementById('active-project-tag').style.background = projectColor(activeProjectFilter);
  } else {
    document.getElementById('project-filter-bar').hidden = true;
  }
  // Sort: importance (high>med>low), then by createdAt desc
  filtered.sort((a, b) => {
    const imp = importanceToOrder(a.importance) - importanceToOrder(b.importance);
    if (imp !== 0) return imp;
    return new Date(b.createdAt) - new Date(a.createdAt);
  });
  const completed = filtered.filter(t => t.status === "completed");
  const pending = filtered.filter(t => t.status !== "completed");
  const list = document.getElementById('todays-tasks-list');
  list.innerHTML = "";
  let tasksRendered = 0;

  // Helper to render a task card
  function renderCard(task) {
    const li = document.createElement('li');
    li.className = "todays-tasks-card" + (task.status === "completed" ? " completed" : "");
    li.tabIndex = 0;
    // Bookmark
    const color = importanceToColor(task.importance);
    const importanceLabel =
      task.importance === "high" ? "High importance"
      : task.importance === "medium" ? "Medium importance"
      : "Easy importance";
    li.innerHTML = `
      <div class="bookmark ${color}" title="${importanceLabel}" aria-label="${importanceLabel} task"></div>
      <div class="todays-tasks-checkbox${task.status === "completed" ? " checked" : ""}" tabindex="0" role="checkbox" aria-checked="${task.status === "completed" ? "true" : "false"}" aria-label="Mark task ${
        task.status === "completed" ? "incomplete" : "complete"
      }">
        <span class="checkmark"><i data-lucide="check"></i></span>
      </div>
      <div class="card-content">
        <div class="todays-tasks-title">${task.title}</div>
        <div class="todays-tasks-tags">
          <span class="todays-tasks-tag" tabindex="0" aria-label="Filter by project ${task.project}" style="background:${projectColor(task.project)};color:#fff;">${task.project}</span>
        </div>
      </div>
      <div class="todays-tasks-actions">
        <button class="todays-tasks-trash" aria-label="Delete task"><i data-lucide="trash-2"></i></button>
      </div>
    `;
    // Checkbox
    const checkbox = li.querySelector('.todays-tasks-checkbox');
    function toggleComplete(ev) {
      ev.stopPropagation();
      const tasks = loadTasks();
      const idx = tasks.findIndex(t => t.id === task.id);
      if (idx >= 0) {
        tasks[idx].status = tasks[idx].status === "completed" ? "pending" : "completed";
        saveTasks(tasks);
        renderTodaysTasks();
        renderRemindersAndPerformance?.();
      }
    }
    checkbox.addEventListener('click', toggleComplete);
    checkbox.addEventListener('keypress', e => { if (e.key === "Enter" || e.key === " ") toggleComplete(e); });
    // Tooltip for completed
    if (task.status === "completed") {
      checkbox.title = "Mark as incomplete";
    }
    // Trash
    li.querySelector('.todays-tasks-trash').onclick = ev => {
      ev.stopPropagation();
      deleteTask(task.id, li);
    };
    // Card click for edit
    li.addEventListener('click', (e) => {
      if (
        !e.target.classList.contains('todays-tasks-checkbox') &&
        !e.target.closest('.todays-tasks-checkbox') &&
        !e.target.classList.contains('todays-tasks-trash') &&
        !e.target.closest('.todays-tasks-trash')
      ) {
        openTaskModal(task.id);
      }
    });
    // Project tag filter
    const tag = li.querySelector('.todays-tasks-tag');
    tag.onclick = e => {
      e.stopPropagation();
      setProjectFilter(task.project);
    };
    tag.onkeypress = e => { if (e.key === "Enter" || e.key === " ") setProjectFilter(task.project); };
    list.appendChild(li);
    tasksRendered++;
  }

  pending.forEach(renderCard);
  completed.forEach(renderCard);

  // Empty state
  document.getElementById('todays-tasks-empty').hidden = tasksRendered > 0;
  if (window.lucide) lucide.createIcons();
}

// --- Project Filter Logic ---
function setProjectFilter(proj) {
  activeProjectFilter = proj;
  renderTodaysTasks();
}
const clearBtn = document.getElementById('clear-project-filter');
if (clearBtn) clearBtn.onclick = () => {
  activeProjectFilter = null;
  renderTodaysTasks();
};

// --- Delete (Soft-delete with Snackbar Undo) ---
function deleteTask(taskId, li) {
  const tasks = loadTasks();
  const idx = tasks.findIndex(t => t.id === taskId);
  if (idx === -1) return;
  lastDeletedTask = { ...tasks[idx] };
  tasks[idx].status = "archived";
  saveTasks(tasks);
  li.classList.add('archiving');
  setTimeout(() => {
    renderTodaysTasks();
    showSnackbar("Task deleted.", undoDeleteTask);
  }, 500);
}
function undoDeleteTask() {
  if (!lastDeletedTask) return;
  const tasks = loadTasks();
  const idx = tasks.findIndex(t => t.id === lastDeletedTask.id);
  if (idx !== -1) {
    tasks[idx].status = "pending";
    saveTasks(tasks);
    renderTodaysTasks();
    lastDeletedTask = null;
  }
}

// --- Add Task FAB ---
const fab = document.getElementById('fab-add-task');
if (fab) {
  fab.onclick = () => {
    openTaskModal(null, null, { dueDate: (new Date()).toISOString().slice(0,10), project: "Personal", importance: "medium" });
  };
}

// --- Hide FAB when modal open ---
const observer = new MutationObserver(() => {
  const modal = document.getElementById('edit-task-modal');
  if (fab) fab.hidden = modal && modal.style.display === "flex";
});
observer.observe(document.body, { childList: true, subtree: true });

// --- Extend openTaskModal for new tasks ---
const origOpenTaskModal = window.openTaskModal;
window.openTaskModal = function(taskId, focusField, defaults) {
  if (taskId == null && defaults) {
    let modal = document.getElementById('edit-task-modal');
    if (!modal) origOpenTaskModal();
    modal = document.getElementById('edit-task-modal');
    const form = modal.querySelector('form');
    form.title.value = "";
    form.dueDate.value = defaults.dueDate || "";
    form.importance.value = defaults.importance || "medium";
    form.project.value = defaults.project || "Personal";
    // Show modal
    modal.style.display = "flex";
    setTimeout(() => modal.classList.add("active"), 10);
    form.title.focus();
    form.onsubmit = (e) => {
      e.preventDefault();
      const tasks = loadTasks();
      tasks.push({
        id: crypto.randomUUID(),
        title: form.title.value,
        dueDate: form.dueDate.value,
        importance: form.importance.value,
        project: form.project.value,
        status: "pending",
        createdAt: new Date().toISOString()
      });
      saveTasks(tasks);
      closeTaskModal();
      renderTodaysTasks();
      renderRemindersAndPerformance?.();
    };
    form.querySelector('.archive-btn').onclick = (e) => {
      e.preventDefault();
      closeTaskModal();
    };
    modal.querySelector('.close-modal').onclick = closeTaskModal;
    modal.onclick = (e) => { if (e.target === modal) closeTaskModal(); };
    return;
  } else {
    origOpenTaskModal(taskId, focusField);
    // Re-render when editing existing
    const modal = document.getElementById('edit-task-modal');
    if (modal) {
      const form = modal.querySelector('form');
      form.onsubmit = (e) => {
        e.preventDefault();
        const tasks = loadTasks();
        const task = tasks.find(t => t.id === taskId);
        if (task) {
          task.title = form.title.value;
          task.dueDate = form.dueDate.value;
          task.importance = form.importance.value;
          task.project = form.project.value;
          saveTasks(tasks);
          closeTaskModal();
          renderTodaysTasks();
          renderRemindersAndPerformance?.();
        }
      };
    }
  }
};

// --- Initial Render ---
renderTodaysTasks();

// === Projects: Track Your Goals Section ===

const PROJECTS = [
  { name: "Work", color: "#b39ddb", emoji: "🟣" },
  { name: "School", color: "#64b5f6", emoji: "💙" },
  { name: "Personal", color: "#f48fb1", emoji: "💖" },
  { name: "Other", color: "#81c784", emoji: "🍃" }
];

function loadGoals() {
  return JSON.parse(localStorage.getItem('goals') || '[]');
}
function saveGoals(goals) {
  localStorage.setItem('goals', JSON.stringify(goals));
}
// --- Meter Drawing ---
function drawDonutMeter(canvas, percent, color) {
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const w = canvas.width = canvas.offsetWidth || 54;
  const h = canvas.height = canvas.offsetHeight || 54;
  ctx.clearRect(0, 0, w, h);
  const r = w/2 - 7;
  ctx.lineWidth = 8;
  ctx.strokeStyle = "#f3f3f3";
  ctx.beginPath();
  ctx.arc(w/2, h/2, r, 0, 2 * Math.PI);
  ctx.stroke();
  ctx.strokeStyle = color;
  ctx.shadowColor = color+"88";
  ctx.shadowBlur = 4;
  ctx.beginPath();
  ctx.arc(w/2, h/2, r, -Math.PI/2, -Math.PI/2 + 2*Math.PI*(percent/100), false);
  ctx.stroke();
  ctx.shadowBlur = 0;
}
// --- Helper ---
function getCurrentMonthYear() {
  const now = new Date();
  return { month: now.getMonth() + 1, year: now.getFullYear() };
}
function getMonthName(month) {
  return new Date(2000, month-1, 1).toLocaleString(undefined, { month: 'long' });
}
// --- Calculate Progress ---
function getGoalProgress(goal, tasks) {
  if (goal.target && goal.target > 0) {
    // Numeric target
    const completed = tasks.filter(t =>
      t.status === "completed" &&
      t.project === goal.project &&
      new Date(t.dueDate).getFullYear() === goal.year &&
      new Date(t.dueDate).getMonth()+1 === goal.month
    ).length;
    return { percent: Math.min(100, Math.round(completed / goal.target * 100)), count: completed };
  } else {
    // Non-numeric: checklist
    const completed = tasks.filter(t =>
      t.status === "completed" &&
      t.project === goal.project &&
      new Date(t.dueDate).getFullYear() === goal.year &&
      new Date(t.dueDate).getMonth()+1 === goal.month
    );
    return { percent: completed.length ? 100 : 0, count: completed.length, checklist: completed };
  }
}
// --- Widget State ---
let pgwOpen = { Work: false, School: false, Personal: false, Other: false };
let pgwHistory = {
  Work: { month: getCurrentMonthYear().month, year: getCurrentMonthYear().year },
  School: { month: getCurrentMonthYear().month, year: getCurrentMonthYear().year },
  Personal: { month: getCurrentMonthYear().month, year: getCurrentMonthYear().year },
  Other: { month: getCurrentMonthYear().month, year: getCurrentMonthYear().year }
};
// --- Render All Widgets ---
function renderProjectsOverview() {
  const goals = loadGoals();
  const tasks = loadTasks ? loadTasks() : [];
  PROJECTS.forEach(proj => {
    const widget = document.querySelector(`.project-goal-widget[data-project="${proj.name}"]`);
    if (!widget) return;
    // Main meter: aggregate current month's numeric goals
    const { month, year } = getCurrentMonthYear();
    const monthGoals = goals.filter(g => g.project === proj.name && g.month === month && g.year === year);
    let bestPercent = 0;
    let meterGoal = null;
    monthGoals.forEach(goal => {
      const prog = getGoalProgress(goal, tasks);
      if (prog.percent > bestPercent) {
        bestPercent = prog.percent;
        meterGoal = goal;
      }
    });
    // Draw donut meter (desktop)
    const meter = widget.querySelector('.pgw-meter');
    const canvas = meter.querySelector('canvas');
    drawDonutMeter(canvas, bestPercent, proj.color);
    meter.setAttribute('aria-valuenow', bestPercent);
    meter.setAttribute('aria-valuemax', 100);
    meter.setAttribute('aria-label', `${proj.name} project progress: ${bestPercent}% complete`);
    meter.querySelector('.pgw-percent').textContent = bestPercent + "%";
    // Dropdown
    const dropdown = widget.querySelector('.pgw-dropdown');
    dropdown.hidden = !pgwOpen[proj.name];
    // Month/year label for dropdown history
    const hist = pgwHistory[proj.name];
    dropdown.querySelector('.pgw-history-label').textContent =
      getMonthName(hist.month) + " " + hist.year;
    // Goals for dropdown month
    const monthGoalsDrop = goals.filter(g => g.project === proj.name && g.month === hist.month && g.year === hist.year);
    const goalsList = dropdown.querySelector('.pgw-goals-list');
    goalsList.innerHTML = "";
    if (monthGoalsDrop.length === 0) {
      dropdown.querySelector('.pgw-no-goal-msg .pgw-month').textContent = getMonthName(hist.month);
      dropdown.querySelector('.pgw-no-goal-msg').hidden = false;
    } else {
      dropdown.querySelector('.pgw-no-goal-msg').hidden = true;
      monthGoalsDrop.forEach(goal => {
        const prog = getGoalProgress(goal, tasks);
        const row = document.createElement('div');
        row.className = "pgw-goal-row";
        row.innerHTML = `
          <span class="pgw-goal-desc">${goal.description}</span>
          ${goal.target ?
            `<span class="pgw-goal-progressbar"><span class="pgw-goal-progress" style="background:${proj.color};width:${prog.percent}%;"></span></span>
            <span class="pgw-goal-target">${prog.count}/${goal.target}</span>
            <span style="color:${proj.color};font-weight:600;">${prog.percent}%</span>`
            :
            `<span class="pgw-goal-checklist" title="Checklist of completed tasks for this goal">
              <i data-lucide="check-circle" style="color:${proj.color};"></i> ${prog.count} task${prog.count===1?"":"s"} completed
            </span>`
          }
          ${hist.month !== month || hist.year !== year ? `<span class="pgw-goal-history-tip" title="Goal history — cannot edit">History</span>` : ""}
        `;
        goalsList.appendChild(row);
      });
    }
    // Add goal button: pulse if no goals for current month
    const addGoalBtn = dropdown.querySelector('.pgw-add-goal');
    if (monthGoalsDrop.length === 0 && hist.month === month && hist.year === year)
      addGoalBtn.classList.add('pulse-btn');
    else addGoalBtn.classList.remove('pulse-btn');
    // Lucide icons
    if (window.lucide) lucide.createIcons({icons: ["plus","chevron-left","chevron-right","check-circle"]});
  });
}
// --- Dropdown Expand ---
document.querySelectorAll('.pgw-expand').forEach(btn => {
  btn.addEventListener('click', () => {
    const proj = btn.closest('.project-goal-widget').getAttribute('data-project');
    pgwOpen[proj] = !pgwOpen[proj];
    renderProjectsOverview();
  });
  btn.addEventListener('keypress', e => {
    if (e.key === "Enter" || e.key === " ") btn.click();
  });
});
// --- Month/Year History ---
document.querySelectorAll('.pgw-history-prev').forEach(btn => {
  btn.onclick = () => {
    const proj = btn.closest('.project-goal-widget').getAttribute('data-project');
    const hist = pgwHistory[proj];
    if (hist.month > 1) hist.month--;
    else { hist.month = 12; hist.year--; }
    renderProjectsOverview();
  };
});
document.querySelectorAll('.pgw-history-next').forEach(btn => {
  btn.onclick = () => {
    const proj = btn.closest('.project-goal-widget').getAttribute('data-project');
    const hist = pgwHistory[proj];
    const now = getCurrentMonthYear();
    if (hist.month < 12 && (hist.year < now.year || (hist.year === now.year && hist.month < now.month))) hist.month++;
    else if (hist.year < now.year) { hist.month = 1; hist.year++; }
    renderProjectsOverview();
  };
});
// --- Add Goal Modal ---
let addGoalContext = null;
document.querySelectorAll('.pgw-add-goal').forEach(btn => {
  btn.onclick = () => {
    const proj = btn.closest('.project-goal-widget').getAttribute('data-project');
    openAddGoalModal(proj);
  };
  btn.addEventListener('keypress', e => { if (e.key === "Enter" || e.key === " ") btn.click();});
});
function openAddGoalModal(project) {
  const modal = document.getElementById('add-goal-modal');
  const form = modal.querySelector('form');
  form.reset();
  form.project.value = project;
  const now = new Date();
  form.monthyear.value = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,"0")}`;
  modal.hidden = false;
  setTimeout(() => modal.querySelector('input[name="description"]').focus(), 50);
  addGoalContext = project;
}
document.querySelector('.agm-close').onclick = () => {
  document.getElementById('add-goal-modal').hidden = true;
};
// Modal submit
document.querySelector('#add-goal-modal form').onsubmit = function(e) {
  e.preventDefault();
  const form = this;
  const desc = form.description.value.trim();
  const target = form.target.value ? Number(form.target.value) : null;
  const [yr, mo] = form.monthyear.value.split('-');
  const project = form.project.value;
  if (!desc || !yr || !mo || !project) return;
  const goal = {
    id: crypto.randomUUID(),
    project,
    description: desc,
    target,
    month: Number(mo),
    year: Number(yr),
    createdAt: new Date().toISOString()
  };
  const goals = loadGoals();
  goals.push(goal);
  saveGoals(goals);
  document.getElementById('add-goal-modal').hidden = true;
  pgwHistory[project] = { month: goal.month, year: goal.year };
  pgwOpen[project] = true;
  renderProjectsOverview();
};
// Keyboard nav: escape closes modal
document.getElementById('add-goal-modal').addEventListener('keydown', e => {
  if (e.key === "Escape") document.getElementById('add-goal-modal').hidden = true;
});
// --- Initial Render ---
renderProjectsOverview();
// Re-render after tasks/goals update
window.renderProjectsOverview = renderProjectsOverview;
// ---- PWA Essentials: Service Worker Registration ----
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(reg => console.log('Service worker registered', reg.scope))
      .catch(err => console.error('Service worker error', err));
  });
}
