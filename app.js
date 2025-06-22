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
