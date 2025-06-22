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

// Example (for projects):
// saveData('projects', [{id:1, name:'My Project'}]);
// const projects = loadData('projects');

// ---- Reminders/Upcoming Deadlines Logic (stub) ----
function updateReminders() {
  const remindersList = document.querySelector('.reminders-list');
  if (remindersList) {
    const reminders = loadData('reminders', [
      {text: "Finish UI redesign", due: "Today"},
      {text: "Review team tasks", due: "Tomorrow"}
    ]);
    remindersList.innerHTML = reminders.map(r =>
      `<li><strong>${r.text}</strong> <em>(${r.due})</em></li>`
    ).join('');
  }
}
updateReminders();

// ---- PWA Essentials: Service Worker Registration ----
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(reg => console.log('Service worker registered', reg.scope))
      .catch(err => console.error('Service worker error', err));
  });
}
