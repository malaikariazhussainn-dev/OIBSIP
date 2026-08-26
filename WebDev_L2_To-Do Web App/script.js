/* =========================================================
   TASKFLOW — TODO APPLICATION
   STEPS 1–9
========================================================= */


/* =========================================================
   1. APPLICATION STATE
========================================================= */

let tasks = [];

const STORAGE_KEY = "taskflow_tasks";


/* =========================================================
   2. DOM ELEMENTS
========================================================= */

const taskForm =
    document.getElementById("taskForm");

const taskInput =
    document.getElementById("taskInput");

const pendingTasksContainer =
    document.getElementById("pendingTasks");

const completedTasksContainer =
    document.getElementById("completedTasks");

const pendingCount =
    document.getElementById("pendingCount");

const completedCount =
    document.getElementById("completedCount");

const pendingEmpty =
    document.getElementById("pendingEmpty");

const completedEmpty =
    document.getElementById("completedEmpty");


const progressBar =
    document.getElementById("progressBar");

const progressPercentage =
    document.getElementById("progressPercentage");

const progressMessage =
    document.getElementById("progressMessage");

/* =========================================================
   3. ADD TASK
========================================================= */

function addTask(taskText) {

    const cleanText =
        taskText.trim();


    /* Prevent empty tasks */

    if (!cleanText) {

        taskInput.focus();

        return;
    }


    /* Create new task */

    const newTask = {

        id:
            generateTaskId(),

        text:
            cleanText,

        completed:
            false,

        createdAt:
            new Date(),

        completedAt:
            null
    };


    /* Add newest task to beginning */

    tasks.unshift(newTask);


    /* Save changes */

    saveTasks();


    /* Update interface */

    renderTasks();


    /* Clear input */

    taskInput.value = "";


    /* Return focus to input */

    taskInput.focus();
}


/* =========================================================
   4. GENERATE UNIQUE TASK ID
========================================================= */

function generateTaskId() {

    return (
        Date.now().toString(36) +
        Math.random()
            .toString(36)
            .substring(2, 8)
    );
}


/* =========================================================
   5. SAVE TASKS TO LOCAL STORAGE
========================================================= */

function saveTasks() {

    try {

        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(tasks)
        );

    } catch (error) {

        console.error(
            "Unable to save tasks:",
            error
        );
    }
}


/* =========================================================
   6. LOAD TASKS FROM LOCAL STORAGE
========================================================= */

function loadTasks() {

    const savedTasks =
        localStorage.getItem(
            STORAGE_KEY
        );


    /* Nothing saved yet */

    if (!savedTasks) {

        tasks = [];

        return;
    }


    try {

        const parsedTasks =
            JSON.parse(savedTasks);


        /* Make sure stored data is an array */

        if (
            Array.isArray(parsedTasks)
        ) {

            tasks =
                parsedTasks;

        } else {

            tasks = [];

        }

    } catch (error) {

        console.error(
            "Unable to load saved tasks:",
            error
        );

        tasks = [];
    }
}


/* =========================================================
   7. RENDER ALL TASKS
========================================================= */

function renderTasks() {

    /* Separate pending and completed tasks */

    const pendingTasks =
        tasks.filter(
            task => !task.completed
        );


    const completedTasks =
        tasks.filter(
            task => task.completed
        );


    /* Clear existing containers */

    pendingTasksContainer.innerHTML = "";

    completedTasksContainer.innerHTML = "";


    /* Render pending tasks */

    pendingTasks.forEach(
        task => {

            const taskElement =
                createTaskElement(task);

            pendingTasksContainer.appendChild(
                taskElement
            );

        }
    );


    /* Render completed tasks */

    completedTasks.forEach(
        task => {

            const taskElement =
                createTaskElement(task);

            completedTasksContainer.appendChild(
                taskElement
            );

        }
    );

updateTaskCounts();

updateEmptyStates();

updateProgress();
    
}


/* =========================================================
   8. UPDATE TASK COUNTS
========================================================= */

function updateTaskCounts() {

    const pendingTotal =
        tasks.filter(
            task => !task.completed
        ).length;


    const completedTotal =
        tasks.filter(
            task => task.completed
        ).length;


    pendingCount.textContent =
        `${pendingTotal} pending`;


    completedCount.textContent =
        `${completedTotal} completed`;
}


/* =========================================================
   STEP 12 — UPDATE PRODUCTIVITY PROGRESS
========================================================= */

function updateProgress() {

    const totalTasks =
        tasks.length;


    const completedTasks =
        tasks.filter(
            task => task.completed
        ).length;


    /* No tasks */

    if (totalTasks === 0) {

        progressBar.style.width =
            "0%";

        progressPercentage.textContent =
            "0%";

        progressMessage.textContent =
            "Let's get started ✨";

        return;
    }


    /* Calculate percentage */

    const percentage =
        Math.round(
            (completedTasks / totalTasks) * 100
        );


    /* Update progress bar */

    progressBar.style.width =
        `${percentage}%`;


    /* Update percentage */

    progressPercentage.textContent =
        `${percentage}%`;


    /* Update motivational message */

    if (percentage === 0) {

        progressMessage.textContent =
            "Let's get started ✨";

    } else if (percentage < 25) {

        progressMessage.textContent =
            "Every task is a step forward 🌱";

    } else if (percentage < 50) {

        progressMessage.textContent =
            "Nice start — keep going! 🚀";

    } else if (percentage < 75) {

        progressMessage.textContent =
            "You're making great progress! 🔥";

    } else if (percentage < 100) {

        progressMessage.textContent =
            "Almost there — you've got this! 💪";

    } else {

        progressMessage.textContent =
            "Amazing! Everything is complete! 🎉";
    }
}


/* =========================================================
   9. UPDATE EMPTY STATES
========================================================= */

function updateEmptyStates() {

    const hasPendingTasks =
        tasks.some(
            task => !task.completed
        );


    const hasCompletedTasks =
        tasks.some(
            task => task.completed
        );


    pendingEmpty.style.display =
        hasPendingTasks
            ? "none"
            : "flex";


    completedEmpty.style.display =
        hasCompletedTasks
            ? "none"
            : "flex";
}


/* =========================================================
   10. CREATE TASK ELEMENT
========================================================= */

function createTaskElement(task) {

    const taskElement =
        document.createElement("article");


    /* Apply completed class */

    taskElement.className =
        task.completed
            ? "task-item completed"
            : "task-item";


    /* Store task ID */

    taskElement.dataset.taskId =
        task.id;


    /* Determine timestamp */

    const timeText =
        task.completed && task.completedAt
            ? `Completed ${formatTaskTime(task.completedAt)}`
            : `Added ${formatTaskTime(task.createdAt)}`;


    /* Create task HTML */

    taskElement.innerHTML = `

        <div class="task-content">

            <button
                type="button"
                class="complete-toggle"
                aria-label="${
                    task.completed
                        ? "Mark task as pending"
                        : "Mark task as complete"
                }"
                title="${
                    task.completed
                        ? "Mark as pending"
                        : "Mark as complete"
                }"
            >

                <span class="checkmark">
                    ✓
                </span>

            </button>


            <div class="task-details">

                <p class="task-text">
                    ${escapeHTML(task.text)}
                </p>

                <span class="task-time">
                    ${timeText}
                </span>

            </div>

        </div>


        <div class="task-actions">

            <button
                type="button"
                class="edit-task"
                aria-label="Edit task"
                title="Edit task"
            >
                Edit
            </button>


            <button
                type="button"
                class="delete-task"
                aria-label="Delete task"
                title="Delete task"
            >
                Delete
            </button>

        </div>

    `;


    /* =====================================================
       COMPLETE BUTTON
    ===================================================== */

    const completeButton =
        taskElement.querySelector(
            ".complete-toggle"
        );


    completeButton.addEventListener(
        "click",
        function () {

            toggleTaskCompletion(
                task.id
            );

        }
    );


    /* =====================================================
       EDIT BUTTON
    ===================================================== */

    const editButton =
        taskElement.querySelector(
            ".edit-task"
        );


    editButton.addEventListener(
        "click",
        function () {

            enableTaskEditing(
                task,
                taskElement
            );

        }
    );


    /* =====================================================
       DELETE BUTTON
    ===================================================== */

    const deleteButton =
        taskElement.querySelector(
            ".delete-task"
        );


    deleteButton.addEventListener(
        "click",
        function () {

            deleteTask(
                task.id,
                taskElement
            );

        }
    );


    return taskElement;
}


/* =========================================================
   11. TOGGLE TASK COMPLETION
========================================================= */

function toggleTaskCompletion(taskId) {

    const task =
        tasks.find(
            task => task.id === taskId
        );


    /* Safety check */

    if (!task) {

        return;
    }


    /* Toggle completion */

    task.completed =
        !task.completed;


    /* Set completion timestamp */

    if (task.completed) {

        task.completedAt =
            new Date();

    } else {

        task.completedAt =
            null;
    }


    /* Save changes */

    saveTasks();


    /* Re-render */

    renderTasks();
}


/* =========================================================
   12. DELETE TASK
========================================================= */

function deleteTask(
    taskId,
    taskElement
) {

    /* Prevent duplicate delete clicks */

    if (
        taskElement.classList.contains(
            "removing"
        )
    ) {

        return;
    }


    /* Start removal animation */

    taskElement.classList.add(
        "removing"
    );


    /*
       Wait for the CSS animation
       before removing the task.
    */

    setTimeout(
        function () {

            tasks =
                tasks.filter(
                    task => task.id !== taskId
                );


            /* Save changes */

            saveTasks();


            /* Update interface */

            renderTasks();

        },
        350
    );
}


/* =========================================================
   13. ENABLE INLINE EDITING
========================================================= */

function enableTaskEditing(
    task,
    taskElement
) {

    const taskDetails =
        taskElement.querySelector(
            ".task-details"
        );


    const taskActions =
        taskElement.querySelector(
            ".task-actions"
        );


    /* Prevent multiple edit modes */

    if (
        taskElement.classList.contains(
            "editing"
        )
    ) {

        return;
    }


    /* Add editing class */

    taskElement.classList.add(
        "editing"
    );


    /* Store original text */

    const originalText =
        task.text;


    /* Replace task details */

    taskDetails.innerHTML = `

        <input
            type="text"
            class="edit-task-input"
            value="${escapeHTML(originalText)}"
            maxlength="200"
            autocomplete="off"
            aria-label="Edit task"
        >

    `;


    /* Replace buttons */

    taskActions.innerHTML = `

        <button
            type="button"
            class="save-task"
            title="Save task"
            aria-label="Save task"
        >
            Save
        </button>


        <button
            type="button"
            class="cancel-edit"
            title="Cancel editing"
            aria-label="Cancel editing"
        >
            Cancel
        </button>

    `;


    /* Get editing elements */

    const editInput =
        taskElement.querySelector(
            ".edit-task-input"
        );


    const saveButton =
        taskElement.querySelector(
            ".save-task"
        );


    const cancelButton =
        taskElement.querySelector(
            ".cancel-edit"
        );


    /* Focus input */

    editInput.focus();


    /* Select current text */

    editInput.select();


    /* =====================================================
       SAVE EDIT
    ===================================================== */

    function saveEdit() {

        const newText =
            editInput.value.trim();


        /* Prevent empty task */

        if (!newText) {

            editInput.focus();

            return;
        }


        /* Update task text */

        task.text =
            newText;


        /* Save changes */

        saveTasks();


        /* Re-render */

        renderTasks();
    }


    /* =====================================================
       CANCEL EDIT
    ===================================================== */

    function cancelEdit() {

        renderTasks();
    }


    /* Save button */

    saveButton.addEventListener(
        "click",
        saveEdit
    );


    /* Cancel button */

    cancelButton.addEventListener(
        "click",
        cancelEdit
    );


    /* =====================================================
       KEYBOARD CONTROLS
    ===================================================== */

    editInput.addEventListener(
        "keydown",
        function (event) {

            /* Enter = Save */

            if (
                event.key === "Enter"
            ) {

                event.preventDefault();

                saveEdit();
            }


            /* Escape = Cancel */

            if (
                event.key === "Escape"
            ) {

                event.preventDefault();

                cancelEdit();
            }

        }
    );
}


/* =========================================================
   14. FORMAT TASK TIME
========================================================= */

function formatTaskTime(date) {

    const taskDate =
        new Date(date);


    return taskDate.toLocaleTimeString(
        [],
        {
            hour: "numeric",
            minute: "2-digit"
        }
    );
}


/* =========================================================
   15. ESCAPE HTML
========================================================= */

function escapeHTML(text) {

    const div =
        document.createElement("div");


    div.textContent =
        text;


    return div.innerHTML;
}


/* =========================================================
   16. FORM SUBMISSION
========================================================= */

taskForm.addEventListener(
    "submit",
    function (event) {

        event.preventDefault();


        addTask(
            taskInput.value
        );

    }
);


/* =========================================================
   17. INITIAL APPLICATION LOAD
========================================================= */

loadTasks();

renderTasks();
