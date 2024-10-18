const taskForm = document.getElementById('taskForm');
const taskList = document.getElementById('taskList');

// Fetch tasks from the server
function fetchTasks() {
    fetch('/tasks')
        .then(response => response.json())
        .then(tasks => {
            taskList.innerHTML = ''; // Clear existing tasks
            tasks.forEach(task => {
                const li = document.createElement('li');
                li.textContent = `${task.title} - ${task.description} - ${task.completed ? '✅' : '❌'}`;
                li.appendChild(createButton('Delete', () => deleteTask(task.id)));
                li.appendChild(createButton('Edit', () => editTask(task)));
                taskList.appendChild(li);
            });
        });
}

// Helper function to create buttons
function createButton(text, onClick) {
    const button = document.createElement('button');
    button.textContent = text;
    button.onclick = onClick;
    return button;
}

// Add a new task
taskForm.onsubmit = (e) => {
    e.preventDefault();
    const title = document.getElementById('title').value;
    const description = document.getElementById('description').value;
    const completed = document.getElementById('completed').checked;

    fetch('/tasks', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, description, completed }),
    })
    .then(() => {
        fetchTasks(); // Refresh the task list
        taskForm.reset(); // Clear the form
    });
};

// Delete a task
function deleteTask(id) {
    fetch(`/tasks/${id}`, {
        method: 'DELETE',
    }).then(fetchTasks); // Refresh the task list
}

// Edit a task
function editTask(task) {
    document.getElementById('title').value = task.title;
    document.getElementById('description').value = task.description;
    document.getElementById('completed').checked = task.completed;

    taskForm.onsubmit = (e) => {
        e.preventDefault();
        fetch(`/tasks/${task.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                title: document.getElementById('title').value,
                description: document.getElementById('description').value,
                completed: document.getElementById('completed').checked,
            }),
        })
        .then(() => {
            fetchTasks(); // Refresh the task list
            taskForm.reset(); // Clear the form
        });
    };
}

// Initial fetch of tasks
fetchTasks();
