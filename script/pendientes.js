let tasks = [];
let selectedTaskIndex = -1;

const taskName = document.getElementById('taskName');
const taskPriority = document.getElementById('taskPriority');
const taskDescription = document.getElementById('taskDescription');
const btnAdd = document.getElementById('btnAdd');
const btnModify = document.getElementById('btnModify');
const btnDelete = document.getElementById('btnDelete');
const taskTableBody = document.getElementById('taskTableBody');
const filterPriority = document.getElementById('filterPriority');

function clearForm() {
    taskName.value = '';
    taskPriority.value = '';
    taskDescription.value = '';
    selectedTaskIndex = -1;
    btnModify.disabled = true;
    btnDelete.disabled = true;
}

function validateFields() {
    return taskName.value.trim() !== '' &&
        taskPriority.value !== '' &&
        taskDescription.value.trim() !== '';
}

function renderTasks() {
    let filteredTasks = [...tasks];
    const filter = filterPriority.value;

    if (filter === 'alta-baja') {
        filteredTasks.sort((a, b) => {
            const priorityOrder = { 'Alta': 1, 'Media': 2, 'Baja': 3 };
            return priorityOrder[a.priority] - priorityOrder[b.priority];
        });
    } else if (filter === 'baja-alta') {
        filteredTasks.sort((a, b) => {
            const priorityOrder = { 'Alta': 1, 'Media': 2, 'Baja': 3 };
            return priorityOrder[b.priority] - priorityOrder[a.priority];
        });
    }

    taskTableBody.innerHTML = '';

    if (filteredTasks.length === 0) {
        taskTableBody.innerHTML = `
                    <tr class="empty-state">
                        <td colspan="3">No hay tareas pendientes. ¡Agrega una nueva tarea!</td>
                    </tr>
                `;
        return;
    }

    filteredTasks.forEach((task, index) => {
        const originalIndex = tasks.indexOf(task);
        const row = document.createElement('tr');
        row.innerHTML = `
                    <td>${task.name}</td>
                    <td><span class="priority-badge priority-${task.priority.toLowerCase()}">${task.priority}</span></td>
                    <td>${task.description}</td>
                `;
        row.addEventListener('click', () => selectTask(originalIndex));
        if (originalIndex === selectedTaskIndex) {
            row.classList.add('selected');
        }
        taskTableBody.appendChild(row);
    });
}

function selectTask(index) {
    selectedTaskIndex = index;
    const task = tasks[index];
    taskName.value = task.name;
    taskPriority.value = task.priority;
    taskDescription.value = task.description;
    btnModify.disabled = false;
    btnDelete.disabled = false;
    renderTasks();
}

btnAdd.addEventListener('click', () => {
    if (!validateFields()) {
        alert('Por favor, complete todos los campos antes de agregar la tarea.');
        return;
    }

    const newTask = {
        name: taskName.value.trim(),
        priority: taskPriority.value,
        description: taskDescription.value.trim()
    };

    tasks.push(newTask);
    clearForm();
    renderTasks();
});

btnModify.addEventListener('click', () => {
    if (selectedTaskIndex === -1) {
        alert('Por favor, seleccione una tarea para modificar.');
        return;
    }

    if (!validateFields()) {
        alert('Por favor, complete todos los campos antes de modificar la tarea.');
        return;
    }

    tasks[selectedTaskIndex] = {
        name: taskName.value.trim(),
        priority: taskPriority.value,
        description: taskDescription.value.trim()
    };

    clearForm();
    renderTasks();
});

btnDelete.addEventListener('click', () => {
    if (selectedTaskIndex === -1) {
        alert('Por favor, seleccione una tarea para eliminar.');
        return;
    }

    if (confirm('¿Está seguro de que desea eliminar esta tarea?')) {
        tasks.splice(selectedTaskIndex, 1);
        clearForm();
        renderTasks();
    }
});

filterPriority.addEventListener('change', () => {
    renderTasks();
});

renderTasks();