const express = require("express");
const fs = require("fs");

const app = express();

const PORT = 3000;

app.use(express.json());
app.use(express.static("public"));

const TASKS_FILE = "tasks.json";

// Отримати всі задачі
app.get("/tasks", (req, res) => {
    fs.readFile(TASKS_FILE, "utf8", (err, data) => {

        if (err) {
            return res.status(500).json({
                error: "Помилка читання файлу"
            });
        }

        res.json(JSON.parse(data));
    });
});

// Зберегти всі задачі
app.post("/tasks", (req, res) => {

    const tasks = req.body;

    fs.writeFile(
        TASKS_FILE,
        JSON.stringify(tasks, null, 2),
        err => {

            if (err) {
                return res.status(500).json({
                    error: "Помилка запису файлу"
                });
            }

            res.json({
                message: "Задачі збережено"
            });
        }
    );
});

app.listen(PORT, () => {
    console.log(
        `Server running on http://localhost:${PORT}`
    );
});