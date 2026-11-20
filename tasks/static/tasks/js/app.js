
const STORAGE_KEY = 'my_todo_tasks';

const form = document.getElementById('task-form');
const input = document.getElementById('task-input');
const list = document.getElementById('task-list');
const counter = document.getElementById('counter');
const emptyMessage = document.getElementById('empty-message');
const clearButton = document.getElementById('clear-done');
const filterButtons = document.querySelectorAll('.filter-btn');

function loadTasks() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (error) {
    console.log('Could not read saved tasks:', error);
  }
  return [];
}

function saveTasks() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  } catch (error) {
    console.log('Could not save tasks:', error);
  }
}

let tasks = loadTasks();
let currentFilter = 'all';

function addTask(text) {
  const task = {
    id: Date.now(),
    text: text,
    done: false
  };
  tasks.push(task);
  saveTasks();
  render();
}

function toggleTask(id) {
  tasks = tasks.map(function (task) {
    if (task.id === id) {
      return { id: task.id, text: task.text, done: !task.done };
    }
    return task;
  });
  saveTasks();
  render();
}

function deleteTask(id) {
  tasks = tasks.filter(function (task) {
    return task.id !== id;
  });
  saveTasks();
  render();
}

function clearFinished() {
  tasks = tasks.filter(function (task) {
    return !task.done;
  });
  saveTasks();
  render();
}

function getVisibleTasks() {
  if (currentFilter === 'active') {
    return tasks.filter(function (task) {
      return !task.done;
    });
  }
  if (currentFilter === 'done') {
    return tasks.filter(function (task) {
      return task.done;
    });
  }
  return tasks;
}

function render() {
  list.innerHTML = '';

  const visibleTasks = getVisibleTasks();

  visibleTasks.forEach(function (task) {
    const item = document.createElement('li');
    item.className = 'task-item';

    if (task.done) {
      item.classList.add('done');
    }

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = task.done;

    checkbox.addEventListener('change', function () {
      toggleTask(task.id);
    });

    const label = document.createElement('span');
    label.className = 'task-text';
    label.textContent = task.text;

    const deleteButton = document.createElement('button');
    deleteButton.type = 'button';
    deleteButton.className = 'delete-btn';
    deleteButton.textContent = 'Delete';

    deleteButton.addEventListener('click', function () {
      deleteTask(task.id);
    });

    item.appendChild(checkbox);
    item.appendChild(label);
    item.appendChild(deleteButton);
    list.appendChild(item);
  });

  const remaining = tasks.filter(function (task) {
    return !task.done;
  }).length;

  const word = remaining === 1 ? 'task' : 'tasks';
  counter.textContent = remaining + ' ' + word + ' left';

  emptyMessage.hidden = visibleTasks.length > 0;

  const hasFinished = tasks.some(function (task) {
    return task.done;
  });

  clearButton.hidden = !hasFinished;
}

form.addEventListener('submit', function (event) {
  event.preventDefault();

  const text = input.value.trim();

  if (text === '') {
    return;
  }

  addTask(text);
  input.value = '';
  input.focus();
});

filterButtons.forEach(function (button) {
  button.addEventListener('click', function () {
    currentFilter = button.dataset.filter;

    filterButtons.forEach(function (other) {
      other.classList.remove('active');
    });

    button.classList.add('active');
    render();
  });
});

clearButton.addEventListener('click', clearFinished);

render();
