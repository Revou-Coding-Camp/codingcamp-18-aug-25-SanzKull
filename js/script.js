/// Validate Form Inputs
function validateForm() {
    /// DOM Form Elements
    const taskInput = document.getElementById("taskInput");
    const dueDateInput = document.getElementById("dueDate");

    if (taskInput.value === '' || dueDateInput.value === '') {
        alert("Please enter a task.");
    } else {
        addTodo(taskInput.value, dueDateInput.value);
    }
}

document.addEventListener('DOMContentLoaded', function() {
    const todoForm = document.getElementById('todoForm');
    const taskInput = document.getElementById('taskInput');
    const dueDate = document.getElementById('dueDate');
    const priority = document.getElementById('priority');
    const taskList = document.getElementById('taskList');
    const emptyState = document.getElementById('emptyState');
    const filterPriority = document.getElementById('filterPriority');
    const filterStatus = document.getElementById('filterStatus');
    const emptyInputModal = document.getElementById('emptyInputModal');
    const closeModalBtn = document.getElementById('closeModalBtn');
    const modalConfirmBtn = document.getElementById('modalConfirmBtn');
    const changeThemeBtn = document.getElementById('changeThemeBtn');
    const taskError = document.getElementById('taskError');
    const dateError = document.getElementById('dateError');


// Theme color options
const themes = [
    { primary: '#f1851fff', secondary: '#ee6509ff' }, // Orange
    { primary: '#3b82f6', secondary: '#1100ffff' }, // Blue
    { primary: '#53e436ff', secondary: '#00ff2aff' }, // Green
    { primary: '#a53becff', secondary: '#8817f1ff' }, // Purple
    { primary: '#f85694ff', secondary: '#ff0080ff' }  // Pink
];
let currentTheme = 0;

// Load tasks from localStorage
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
            
// Initialize
renderTasks();
updateEmptyState();

    // Form submission
    todoForm.addEventListener('submit', function(e) {
        e.preventDefault();
            
        // Validate inputs
        let isValid = true;
            
        if (!taskInput.value.trim()) {
                taskError.classList.remove('hidden');
                isValid = false;
            } else {
                taskError.classList.add('hidden');
            }
            
            if (!dueDate.value) {
                dateError.classList.remove('hidden');
                isValid = false;
            } else {
                dateError.classList.add('hidden');
            }
            
            if (!isValid) {
                showModal();
                return;
            }
            
        // Create new task
        const newTask = {
            id: Date.now(),
            title: taskInput.value.trim(),
            dueDate: dueDate.value,
            priority: priority.value,
            completed: false,
            createdAt: new Date().toISOString()
            };
            
            tasks.push(newTask);
            saveTasks();
            renderTasks();
            updateEmptyState();
            
            // Reset form
            taskInput.value = '';
            dueDate.value = '';
            priority.value = 'medium';
            taskInput.focus();
        });
            
        // Render tasks
        function renderTasks() {
            const priorityFilter = filterPriority.value;
            const statusFilter = filterStatus.value;
            
            // Filter tasks
            let filteredTasks = tasks;
                
            if (priorityFilter !== 'all') {
                filteredTasks = filteredTasks.filter(task => task.priority === priorityFilter);
            }
                
            if (statusFilter !== 'all') {
                filteredTasks = filteredTasks.filter(task => 
                    statusFilter === 'completed' ? task.completed : !task.completed
                );
            }
                
            // Sort by due date (earliest first)
            filteredTasks.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
            
            // Render
            taskList.innerHTML = '';
            
            if (filteredTasks.length === 0) {
                if (tasks.length === 0) {
                    taskList.appendChild(emptyState);
                    emptyState.classList.remove('hidden');
                } else {
                    const noMatchMessage = document.createElement('div');
                    noMatchMessage.className = 'text-center py-4 text-gray-400 italic';
                    noMatchMessage.textContent = 'No tasks match your filters';
                    taskList.appendChild(noMatchMessage);
                }
                return;
            }
                
            filteredTasks.forEach(task => {
                const taskElement = document.createElement('div');
                taskElement.className = `p-4 border rounded-lg hover:shadow-md transition ${task.completed ? 'bg-gray-50' : 'bg-white'}`;
                taskElement.innerHTML = `
                    <div class="flex items-start justify-between">
                        <div class="flex items-start space-x-3 flex-1">
                            <button class="mt-1 focus:outline-none" onclick="toggleTaskCompletion(${task.id})">
                                <svg xmlns="http://www.w3.org/2000/svg" 
                                    class="h-6 w-6 ${task.completed ? 'text-green-500' : 'text-gray-300'}" 
                                    fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                                    d="${task.completed ? 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' : 'M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z'}" />
                                    </svg>
                            </button>
                            <div class="flex-1">
                                <h3 class="${task.completed ? 'line-through text-gray-400' : 'font-medium text-gray-800'}">${task.title}</h3>
                                <div class="flex items-center space-x-4 mt-1 text-sm">
                                    <span class="text-gray-500">${formatDate(task.dueDate)}</span>
                                    <span class="px-2 py-0.5 rounded-full text-xs 
                                        ${getPriorityClass(task.priority)}">
                                        ${task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                                    </span>
                                </div>
                            </div>
                            </div>
                            <button onclick="deleteTask(${task.id})" class="text-gray-400 hover:text-red-500 ml-2">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
                                </svg>
                            </button>
                        </div>
                    `;
                    taskList.appendChild(taskElement);
                });
            }
            
            // Format date
            function formatDate(dateString) {
                const options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
                return new Date(dateString).toLocaleDateString('en-US', options);
            }
            
            // Get priority class
            function getPriorityClass(priority) {
                switch (priority) {
                    case 'high': return 'bg-red-100 text-red-800';
                    case 'medium': return 'bg-yellow-100 text-yellow-800';
                    case 'low': return 'bg-green-100 text-green-800';
                    default: return 'bg-gray-100 text-gray-800';
                }
            }
            
            // Save tasks to localStorage
            function saveTasks() {
                localStorage.setItem('tasks', JSON.stringify(tasks));
            }
            
            // Update empty state
            function updateEmptyState() {
                if (tasks.length > 0) {
                    emptyState.classList.add('hidden');
                } else {
                    emptyState.classList.remove('hidden');
                }
            }
            
            // Toggle task completion status
            window.toggleTaskCompletion = function(taskId) {
                tasks = tasks.map(task => {
                    if (task.id === taskId) {
                        return { ...task, completed: !task.completed };
                    }
                    return task;
                });
                saveTasks();
                renderTasks();
            };
            
            // Delete task
            window.deleteTask = function(taskId) {
                if (confirm('Are you sure you want to delete this task?')) {
                    tasks = tasks.filter(task => task.id !== taskId);
                    saveTasks();
                    renderTasks();
                    updateEmptyState();
                }
            };
            
            // Filter tasks
            filterPriority.addEventListener('change', renderTasks);
            filterStatus.addEventListener('change', renderTasks);
            
            // Modal functions
            function showModal() {
                document.body.style.overflow = 'hidden';
                emptyInputModal.classList.remove('opacity-0', 'pointer-events-none');
                emptyInputModal.classList.add('opacity-100');
                
                setTimeout(() => {
                    const modalContent = emptyInputModal.querySelector('div');
                    modalContent.classList.remove('scale-95');
                    modalContent.classList.add('scale-100');
                }, 10);
            }
            
            function hideModal() {
                document.body.style.overflow = '';
                const modalContent = emptyInputModal.querySelector('div');
                modalContent.classList.remove('scale-100');
                modalContent.classList.add('scale-95');
                
                setTimeout(() => {
                    emptyInputModal.classList.remove('opacity-100');
                    emptyInputModal.classList.add('opacity-0', 'pointer-events-none');
                }, 300);
            }
            
            closeModalBtn.addEventListener('click', hideModal);
            modalConfirmBtn.addEventListener('click', hideModal);
            
            // Change theme
            changeThemeBtn.addEventListener('click', function() {
                currentTheme = (currentTheme + 1) % themes.length;
                const theme = themes[currentTheme];
                
                document.documentElement.style.setProperty('--primary', theme.primary);
                document.documentElement.style.setProperty('--secondary', theme.secondary);
                
                // Change button hover color
                const buttons = document.querySelectorAll('button.bg-gradient');
                buttons.forEach(button => {
                    button.style.background = `linear-gradient(135deg, ${theme.primary} 0%, ${theme.secondary} 100%)`;
                });
            });
        });