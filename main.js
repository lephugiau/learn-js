const STORAGE_KEY = "todos_v1";

const input = document.getElementById("todoInput");
const addBtn = document.getElementById("addBtn");
const listEl = document.getElementById("todoList");
const counterEl = document.getElementById("counter");
const clearAllBtn = document.getElementById("clearAllBtn");
const clearDoneBtn = document.getElementById("clearDoneBtn");

// State
let todos = loadTodos();

// Init
render();

// Events
addBtn.addEventListener("click", onAdd);
input.addEventListener("keydown", (e) => {
  if (e.key === "Enter") onAdd();
});

clearAllBtn.addEventListener("click", () => {
  if (!confirm("Xóa tất cả công việc?")) return;
  todos = [];
  saveTodos();
  render();
});

clearDoneBtn.addEventListener("click", () => {
  todos = todos.filter(t => !t.done);
  saveTodos();
  render();
});

// Functions
function onAdd() {
  const text = input.value.trim();
  if (text === "") {
    alert("Vui lòng nhập công việc!");
    return;
  }

  const newTodo = {
    id: Date.now().toString(), // id đơn giản
    text,
    done: false,
    createdAt: Date.now()
  };

  todos.unshift(newTodo); // thêm lên đầu
  input.value = "";
  saveTodos();
  render();
}

function toggleDone(id, checked) {
  const todo = todos.find(t => t.id === id);
  if (!todo) return;
  todo.done = checked;
  saveTodos();
  render();
}

function deleteTodo(id) {
  todos = todos.filter(t => t.id !== id);
  saveTodos();
  render();
}

function render() {
  listEl.innerHTML = "";

  // Render list
  for (const t of todos) {
    const li = document.createElement("li");

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = t.done;
    checkbox.addEventListener("change", () => toggleDone(t.id, checkbox.checked));

    const span = document.createElement("span");
    span.className = "text" + (t.done ? " done" : "");
    span.textContent = t.text;

    const delBtn = document.createElement("button");
    delBtn.textContent = "Xóa";
    delBtn.addEventListener("click", () => deleteTodo(t.id));

    li.appendChild(checkbox);
    li.appendChild(span);
    li.appendChild(delBtn);

    listEl.appendChild(li);
  }

  // Counter
  const doneCount = todos.filter(t => t.done).length;
  counterEl.textContent = `Done: ${doneCount} / ${todos.length}`;
}

function saveTodos() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
}

function loadTodos() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    // sanitize nhẹ
    return parsed.map(t => ({
      id: String(t.id),
      text: String(t.text ?? ""),
      done: Boolean(t.done),
      createdAt: Number(t.createdAt ?? Date.now())
    }));
  } catch {
    return [];
  }
}
