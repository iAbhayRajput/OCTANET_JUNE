document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('new-task-input');
    const deadlineInput = document.getElementById('deadline-input');
    const categoryInput = document.getElementById('category-input');
    const addTaskButton = document.getElementById('add-task-button');
    const taskList = document.getElementById('task-list');

    addTaskButton.addEventListener('click', addTask);
    taskInput.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            addTask();
        }
    });

    loadTasks(); // Load tasks initially

    function showError(message) {
        const errorMessage = document.getElementById('error-message');
        if (!errorMessage) {
            const errorDiv = document.createElement('div');
            errorDiv.id = 'error-message';
            errorDiv.textContent = message;
            taskInput.parentElement.insertBefore(errorDiv, taskInput);
        } else {
            errorMessage.textContent = message;
            errorMessage.style.display = 'block';
        }
    }

    function hideError() {
        const errorMessage = document.getElementById('error-message');
        if (errorMessage) {
            errorMessage.style.display = 'none';
        }
    }

    function addTask() {
        const taskText = taskInput.value.trim();
        const deadline = deadlineInput.value;
        const category = categoryInput.value;

        if (taskText === '') {
            showError('Please enter a task.');
            return;
        }

        if (deadline === '') {
            showError('Please select a deadline.');
            return;
        }

        if (!category || category === '') {
            showError('Please select a category.');
            return;
        }

        hideError();

        const taskItem = {
            text: taskText,
            deadline: deadline,
            category: category,
            complete: false
        };

        saveTask(taskItem);
        displayTask(taskItem);

        taskInput.value = '';
        deadlineInput.value = '';
        categoryInput.value = 'Personal'; // Reset category to default after adding task
    }

    function saveTask(task) {
        let tasks = getTasks();
        tasks.push(task);
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    function getTasks() {
        const tasks = localStorage.getItem('tasks');
        return tasks ? JSON.parse(tasks) : [];
    }

    function loadTasks() {
        const tasks = getTasks();
        tasks.forEach(displayTask);
    }

    function displayTask(task) {
        const taskItem = document.createElement('li');
        taskItem.classList.add('task', task.category.toLowerCase());
        if (task.complete) taskItem.classList.add('complete');
        if (new Date(task.deadline) < new Date()) taskItem.classList.add('past-due');

        taskItem.innerHTML = `
            <input type="checkbox" class="complete-checkbox" ${task.complete ? 'checked' : ''}>
            <span class="category">${task.category}</span>
            <span class="task-text">${task.text}</span>
            <span class="deadline">Due: ${task.deadline}</span>
            <button class="delete-button">Delete</button>
        `;

        taskItem.querySelector('.complete-checkbox').addEventListener('change', function() {
            task.complete = this.checked;
            taskItem.classList.toggle('complete', task.complete);
            updateTasks();
        });

        taskItem.querySelector('.delete-button').addEventListener('click', function() {
            deleteTask(taskItem, task);
        });

        taskList.appendChild(taskItem);
    }

    function updateTasks() {
        const tasks = Array.from(taskList.children).map(taskItem => {
            return {
                text: taskItem.querySelector('.task-text').textContent,
                deadline: taskItem.querySelector('.deadline').textContent.replace('Due: ', ''),
                category: taskItem.querySelector('.category').textContent,
                complete: taskItem.querySelector('.complete-checkbox').checked
            };
        });
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    function deleteTask(taskItem, task) {
        taskItem.remove();
        let tasks = getTasks();
        tasks = tasks.filter(t => t.text !== task.text || t.deadline !== task.deadline || t.category !== task.category);
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    setInterval(updateDeadlines, 60000); // Check deadlines every minute

    function updateDeadlines() {
        const tasks = Array.from(taskList.children);
        tasks.forEach(taskItem => {
            const deadlineText = taskItem.querySelector('.deadline').textContent.replace('Due: ', '');
            const taskDeadline = new Date(deadlineText);
            if (taskDeadline < new Date()) {
                taskItem.classList.add('past-due');
            } else {
                taskItem.classList.remove('past-due');
            }
        });
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('new-task-input');
    const deadlineInput = document.getElementById('deadline-input');
    const addTaskButton = document.getElementById('add-task-button');
    const taskList = document.getElementById('task-list');

    addTaskButton.addEventListener('click', addTask);
    taskInput.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            addTask();
        }
    });

    function addTask() {
        const taskText = taskInput.value.trim();
        const deadline = deadlineInput.value;
        if (taskText === '' || deadline === '') return;

        const taskItem = document.createElement('li');
        taskItem.classList.add('task');
        taskItem.innerHTML = `
            <span>${taskText}</span>
            <span class="deadline">Due: ${deadline}</span>
            <button onclick="deleteTask(this)">Delete</button>
        `;

        taskItem.addEventListener('click', function() {
            taskItem.classList.toggle('complete');
        });

        checkDeadline(taskItem, deadline);

        taskList.appendChild(taskItem);
        taskInput.value = '';
        deadlineInput.value = '';
    }

    function checkDeadline(taskItem, deadline) {
        const currentDate = new Date();
        const taskDeadline = new Date(deadline);

        if (taskDeadline < currentDate) {
            taskItem.classList.add('past-due');
        }
    }
});

function deleteTask(button) {
    const taskItem = button.parentElement;
    taskItem.remove();
}
