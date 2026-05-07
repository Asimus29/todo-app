const taskInput = document.getElementById("taskInput");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");

let tasks = [];

// Завантаження задач із сервера
async function loadTasks() {

    const response = await fetch("/tasks");

    tasks = await response.json();

    renderTasks();
}

// Збереження задач на сервер
async function saveTasks() {

    await fetch("/tasks", {
        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify(tasks)
    });
}

// Додавання задачі
addTaskBtn.addEventListener("click", async () => {

    const taskText = taskInput.value.trim();

    if (taskText === "") {
        alert("Введіть завдання!");
        return;
    }

    const task = {
        id: Date.now(),
        text: taskText,
        completed: false
    };

    tasks.push(task);

    await saveTasks();

    renderTasks();

    taskInput.value = "";
});

// Відображення задач
function renderTasks() {

    taskList.innerHTML = "";

    tasks.forEach(task => {

        const li = document.createElement("li");

        if (task.completed) {
            li.classList.add("completed");
        }

        li.innerHTML = `
            <span class="task-text">
                ${task.text}
            </span>

            <div class="task-buttons">

                <button class="complete-btn">
                    ${task.completed
                        ? "Скасувати"
                        : "Виконано"}
                </button>

                <button class="delete-btn">
                    Видалити
                </button>

            </div>
        `;

        // Виконано
        li.querySelector(".complete-btn")
            .addEventListener("click", async () => {

                task.completed = !task.completed;

                await saveTasks();

                renderTasks();
            });

        // Видалити
        li.querySelector(".delete-btn")
            .addEventListener("click", async () => {

                tasks = tasks.filter(
                    t => t.id !== task.id
                );

                await saveTasks();

                renderTasks();
            });

        taskList.appendChild(li);
    });
}

// Старт
loadTasks();