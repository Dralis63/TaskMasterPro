document.addEventListener('DOMContentLoaded', function() {

    const users = [
        {
            username: "admin",
            password: "admin123",
            tasks: []
        },
        {
            username: "user1",
            password: "password1",
            tasks: []
        }
    ];

    function saveUsersToLocalStorage(users) {
        localStorage.setItem('users', JSON.stringify(users));
    }

    function loadUsersFromLocalStorage() {
        return JSON.parse(localStorage.getItem('users')) || users;
    }

    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;

            const users = loadUsersFromLocalStorage();
            const user = users.find(user => user.username === username && user.password === password);

            if (user) {
                localStorage.setItem('loggedInUser', JSON.stringify(user));
                window.location.href = 'screens/dashboard.html';
            } else {
                alert('Nom d\'utilisateur ou mot de passe incorrect');
            }
        });
    }

    window.onload = function() {
        if (window.location.pathname.endsWith('screens/dashboard.html')) {
            const user = JSON.parse(localStorage.getItem('loggedInUser'));
            const taskList = document.getElementById('taskList');
            const completedTasksCount = document.querySelector('.card.bg-success .card-title');
            const inProgressTasksCount = document.querySelector('.card.bg-warning .card-title');
            const upcomingTasksCount = document.querySelector('.card.bg-danger .card-title');

            let completedTasks = 0;
            let inProgressTasks = 0;
            let upcomingTasks = 0;

            if (user && taskList) {
                user.tasks.forEach((task, index) => {
                    // Update task status counters
                    if (task.status === "Complétée") {
                        completedTasks++;
                    } else if (task.status === "En Cours") {
                        inProgressTasks++;
                    } else if (task.status === "À Venir") {
                        upcomingTasks++;
                    }

                    let taskClass = '';
                    if (task.status === "À Venir") {
                        taskClass = 'task-border-avenir';
                    } else if (task.status === "En Cours") {
                        taskClass = 'task-border-encours';
                    } else if (task.status === "Complétée") {
                        taskClass = 'task-border-completee';
                    }

                    const taskItem = document.createElement('div');
                    taskItem.className = `list-group-item d-flex justify-content-between align-items-center ${taskClass}`;
                    taskItem.innerHTML = `
                        <div>
                            <h5>${task.title}</h5>
                            <p>${task.description}</p>
                            <p>Date d'échéance: ${task.date}</p>
                            <p>Priorité: ${task.priority}</p>
                            <p>Status: ${task.status}</p>
                        </div>
                        <div class="task-actions d-flex align-items-center">
                        <div class="status-dropdown">
                        <button class="status-btn btn btn-secondary dropdown-toggle" type="button" id="statusDropdown${index}" data-bs-toggle="dropdown" aria-expanded="false">
                        Statut
                        </button>
        <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="statusDropdown${index}">
            <li><a class="dropdown-item change-status" data-index="${index}" data-status="À Venir" href="#">À Venir</a></li>
            <li><a class="dropdown-item change-status" data-index="${index}" data-status="En Cours" href="#">En Cours</a></li>
            <li><a class="dropdown-item change-status" data-index="${index}" data-status="Complétée" href="#">Complétée</a></li>
        </ul>
    </div>
</div>
    <div class="task-actions1 d-flex align-items-center">
    <button class="btn-action edit-task btn" data-index="${index}" data-bs-toggle="modal" data-bs-target="#editTaskModal">
        <i class="fas fa-edit"></i>
    </button>
    <button class="btn-action delete-task btn" data-index="${index}">
        <i class="fas fa-trash"></i>
    </button>
</div>

                    `;
                    taskList.appendChild(taskItem);
                });

                // Update dashboard counters
                completedTasksCount.textContent = completedTasks;
                inProgressTasksCount.textContent = inProgressTasks;
                upcomingTasksCount.textContent = upcomingTasks;

                // Event listener for deleting tasks
                document.querySelectorAll('.delete-task').forEach(button => {
                    button.addEventListener('click', function() {
                        const index = this.getAttribute('data-index');
                        user.tasks.splice(index, 1);
                        localStorage.setItem('loggedInUser', JSON.stringify(user));
                        saveUsersToLocalStorage(users);
                        location.reload();
                    });
                });

                // Event listener for changing task status via dropdown
                document.querySelectorAll('.change-status').forEach(link => {
                    link.addEventListener('click', function(e) {
                        e.preventDefault();
                        const index = this.getAttribute('data-index');
                        const newStatus = this.getAttribute('data-status');
                        user.tasks[index].status = newStatus;
                        localStorage.setItem('loggedInUser', JSON.stringify(user));
                        saveUsersToLocalStorage(users);
                        location.reload();
                    });
                });

                // Event listener for editing tasks
                document.querySelectorAll('.edit-task').forEach(button => {
                    button.addEventListener('click', function() {
                        const index = this.getAttribute('data-index');
                        const task = user.tasks[index];
                        document.getElementById('editTaskTitle').value = task.title;
                        document.getElementById('editTaskDescription').value = task.description;
                        document.getElementById('editTaskDate').value = task.date;
                        document.getElementById('editTaskPriority').value = task.priority;
                        document.getElementById('editTaskIndex').value = index;
                    });
                });

                document.getElementById('saveTaskChanges').addEventListener('click', function() {
                    const index = document.getElementById('editTaskIndex').value;
                    const newTitle = document.getElementById('editTaskTitle').value;
                    const newDescription = document.getElementById('editTaskDescription').value;
                    const newDate = document.getElementById('editTaskDate').value;
                    const newPriority = document.getElementById('editTaskPriority').value;

                    if (newTitle && newDescription && newDate && newPriority) {
                        user.tasks[index].title = newTitle;
                        user.tasks[index].description = newDescription;
                        user.tasks[index].date = newDate;
                        user.tasks[index].priority = newPriority;
                        localStorage.setItem('loggedInUser', JSON.stringify(user));
                        saveUsersToLocalStorage(users);
                        location.reload();
                    }
                });
            }
        }
    };

    const taskForm = document.getElementById('taskForm');
    if (taskForm) {
        taskForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const title = document.getElementById('taskTitle').value;
            const description = document.getElementById('taskDescription').value;
            const date = document.getElementById('taskDate').value;
            const priority = document.getElementById('taskPriority').value;

            let user = JSON.parse(localStorage.getItem('loggedInUser'));
            user.tasks.push({ title, description, date, priority, status: "À Venir" });
            localStorage.setItem('loggedInUser', JSON.stringify(user));

            const users = loadUsersFromLocalStorage();
            const loggedInUserIndex = users.findIndex(u => u.username === user.username);
            users[loggedInUserIndex] = user;
            saveUsersToLocalStorage(users);

            window.location.href = 'dashboard.html';
        });
    }

});
