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

// ---- PWA Essentials: Service Worker Registration ----
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(reg => console.log('Service worker registered', reg.scope))
      .catch(err => console.error('Service worker error', err));
  });
}
