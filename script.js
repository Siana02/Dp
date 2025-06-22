// === script.js ===
document.addEventListener('DOMContentLoaded', () => {
  const currentDate = document.getElementById('current-date');
  const taskForm = document.getElementById('task-form');
  const taskInput = document.getElementById('task-input');
  const taskList = document.getElementById('task-list');
  const notesArea = document.getElementById('notes');

  // Set current date
  const today = new Date();
  currentDate.textContent = today.toDateString();

  // Load saved tasks
  const savedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
  savedTasks.forEach(task => addTask(task.text, task.completed));

  // Load saved notes
  notesArea.value = localStorage.getItem('dailyNotes') || '';

  // Save notes on input
  notesArea.addEventListener('input', () => {
    localStorage.setItem('dailyNotes', notesArea.value);
  });

  // Add task handler
  taskForm.addEventListener('submit', (e) => {
    e.preventDefault();
    addTask(taskInput.value);
    taskInput.value = '';
  });

  function addTask(text, completed = false) {
    const li = document.createElement('li');
    li.textContent = text;
    if (completed) li.classList.add('completed');

    li.addEventListener('click', () => {
      li.classList.toggle('completed');
      saveTasks();
    });

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = '✕';
    deleteBtn.style.background = 'transparent';
    deleteBtn.style.border = 'none';
    deleteBtn.style.fontSize = '1rem';
    deleteBtn.style.cursor = 'pointer';
    deleteBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      li.remove();
      saveTasks();
    });

    li.appendChild(deleteBtn);
    taskList.appendChild(li);
    saveTasks();
  }

  function saveTasks() {
    const tasks = [];
    taskList.querySelectorAll('li').forEach(li => {
      tasks.push({
        text: li.childNodes[0].textContent.trim(),
        completed: li.classList.contains('completed')
      });
    });
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }
});
