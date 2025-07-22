document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const taskInput = document.getElementById('taskInput');
    const addTaskBtn = document.getElementById('addTaskBtn');
    const taskList = document.getElementById('taskList');
    const allBtn = document.getElementById('allBtn');
    const activeBtn = document.getElementById('activeBtn');
    const completedBtn = document.getElementById('completedBtn');
    const clearCompletedBtn = document.getElementById('clearCompletedBtn');
    const taskCount = document.getElementById('taskCount');
    
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    let currentFilter = 'all';
    
    // Initialize the app
    function init() {
        renderTasks();
        updateTaskCount();
        addEventListeners();
    }
    
    // Add event listeners
    function addEventListeners() {
        addTaskBtn.addEventListener('click', addTask);
        taskInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') addTask();
        });
        
        allBtn.addEventListener('click', () => filterTasks('all'));
        activeBtn.addEventListener('click', () => filterTasks('active'));
        completedBtn.addEventListener('click', () => filterTasks('completed'));
        
        clearCompletedBtn.addEventListener('click', clearCompletedTasks);
    }
    
    // Add a new task
    function addTask() {
        const taskText = taskInput.value.trim();
        
        if (taskText === '') {
            alert('Please enter a task!');
            return;
        }
        
        const newTask = {
            id: Date.now(),
            text: taskText,
            completed: false
        };
        
        tasks.push(newTask);
        saveTasks();
        renderTasks();
        taskInput.value = '';
        updateTaskCount();
    }
    
    // Render tasks based on current filter
    function renderTasks() {
        taskList.innerHTML = '';
        
        let filteredTasks = [];
        
        switch (currentFilter) {
            case 'active':
                filteredTasks = tasks.filter(task => !task.completed);
                break;
            case 'completed':
                filteredTasks = tasks.filter(task => task.completed);
                break;
            default:
                filteredTasks = tasks;
        }
        
        if (filteredTasks.length === 0) {
            const emptyMessage = document.createElement('li');
            emptyMessage.textContent = currentFilter === 'all' ? 'No tasks yet!' : 
                                     currentFilter === 'active' ? 'No active tasks!' : 'No completed tasks!';
            emptyMessage.classList.add('empty-message');
            taskList.appendChild(emptyMessage);
            return;
        }
        
        filteredTasks.forEach(task => {
            const taskItem = document.createElement('li');
            taskItem.classList.add('task-item');
            taskItem.dataset.id = task.id;
            
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.classList.add('task-checkbox');
            checkbox.checked = task.completed;
            checkbox.addEventListener('change', toggleTaskCompletion);
            
            const taskText = document.createElement('span');
            taskText.classList.add('task-text');
            if (task.completed) taskText.classList.add('completed');
            taskText.textContent = task.text;
            
            const taskActions = document.createElement('div');
            taskActions.classList.add('task-actions');
            
            const editBtn = document.createElement('button');
            editBtn.classList.add('edit-btn');
            editBtn.innerHTML = '<i class="fas fa-edit"></i>';
            editBtn.addEventListener('click', () => editTask(task.id));
            
            const deleteBtn = document.createElement('button');
            deleteBtn.classList.add('delete-btn');
            deleteBtn.innerHTML = '<i class="fas fa-trash"></i>';
            deleteBtn.addEventListener('click', () => deleteTask(task.id));
            
            taskActions.appendChild(editBtn);
            taskActions.appendChild(deleteBtn);
            
            taskItem.appendChild(checkbox);
            taskItem.appendChild(taskText);
            taskItem.appendChild(taskActions);
            
            taskList.appendChild(taskItem);
        });
    }
    
    // Toggle task completion status
    function toggleTaskCompletion(e) {
        const taskId = parseInt(e.target.closest('.task-item').dataset.id);
        const taskIndex = tasks.findIndex(task => task.id === taskId);
        
        if (taskIndex !== -1) {
            tasks[taskIndex].completed = e.target.checked;
            saveTasks();
            renderTasks();
            updateTaskCount();
        }
    }
    
    // Edit task
    function editTask(taskId) {
        const taskIndex = tasks.findIndex(task => task.id === taskId);
        if (taskIndex === -1) return;
        
        const currentText = tasks[taskIndex].text;
        const newText = prompt('Edit your task:', currentText);
        
        if (newText !== null && newText.trim() !== '') {
            tasks[taskIndex].text = newText.trim();
            saveTasks();
            renderTasks();
        } else if (newText !== null && newText.trim() === '') {
            alert('Task cannot be empty!');
        }
    }
    
    // Delete task
    function deleteTask(taskId) {
        if (confirm('Are you sure you want to delete this task?')) {
            tasks = tasks.filter(task => task.id !== taskId);
            saveTasks();
            renderTasks();
            updateTaskCount();
        }
    }
    
    // Filter tasks
    function filterTasks(filter) {
        currentFilter = filter;
        
        // Update active button
        allBtn.classList.remove('active');
        activeBtn.classList.remove('active');
        completedBtn.classList.remove('active');
        
        switch (filter) {
            case 'all':
                allBtn.classList.add('active');
                break;
            case 'active':
                activeBtn.classList.add('active');
                break;
            case 'completed':
                completedBtn.classList.add('active');
                break;
        }
        
        renderTasks();
    }
    
    // Clear completed tasks
    function clearCompletedTasks() {
        if (confirm('Are you sure you want to clear all completed tasks?')) {
            tasks = tasks.filter(task => !task.completed);
            saveTasks();
            renderTasks();
            updateTaskCount();
        }
    }
    
    // Update task count
    function updateTaskCount() {
        const activeTasks = tasks.filter(task => !task.completed).length;
        taskCount.textContent = `${activeTasks} ${activeTasks === 1 ? 'task' : 'tasks'} left`;
    }
    
    // Save tasks to local storage
    function saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }
    
    // Initialize the app
    init();
});