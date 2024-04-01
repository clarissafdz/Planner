
let classes = JSON.parse(localStorage.getItem('classes')) || [];
let assignments = JSON.parse(localStorage.getItem('assignments')) || [];
function formatDate(dateString) {
    const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    const date = new Date(dateString);
    const dayOfWeek = daysOfWeek[date.getDay()];
    const monthName = months[date.getMonth()];
    const dayOfMonth = date.getDate();
    const year = date.getFullYear();

    // Convert 24-hour time to 12-hour format
    let hours = date.getHours();
    
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'

    return `${dayOfWeek}, ${monthName} ${dayOfMonth}, ${year} at ${hours}:${minutes} ${ampm}`;
}

function updateClassSelect() {
    const select = document.getElementById('classSelect');
    const editSelect = document.getElementById('editClassSelect'); // New: Get edit form select element
    select.innerHTML = classes.map(c => `<option value="${c.name}" style="color: ${c.color};">${c.name}</option>`).join('');
    editSelect.innerHTML = classes.map(c => `<option value="${c.name}" style="color: ${c.color};">${c.name}</option>`).join(''); // New: Populate edit form select
}

function updateClassesList() {
    const list = document.getElementById('classesList');
    list.innerHTML = classes.map((c, index) => `<div class="class-entry" style="text-decoration: underline;
    text-decoration-color: ${c.color}; 
    text-decoration-thickness: 2px;
    text-underline-offset: 3px;">${c.name}
        <img src="icons/edit_icon_white.png" class="edit-icon" onclick="editClass(${index})">
        <img src="icons/delete_icon_white.png" class="delete-icon" onclick="deleteClass(${index})">
    </div>`).join('');
    updateClassSelect();
}

function hexToRGBA(hex, opacity) {
    let r = 0, g = 0, b = 0;
    // 3 digits
    if (hex.length == 4) {
        r = parseInt(hex[1] + hex[1], 16);
        g = parseInt(hex[2] + hex[2], 16);
        b = parseInt(hex[3] + hex[3], 16);
    }
    // 6 digits
    else if (hex.length == 7) {
        r = parseInt(hex[1] + hex[2], 16);
        g = parseInt(hex[3] + hex[4], 16);
        b = parseInt(hex[5] + hex[6], 16);
    }
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}
function deleteAssignment(index) {
    if (confirm("Are you sure you want to delete this assignment?")) {
        assignments.splice(index, 1);
        localStorage.setItem('assignments', JSON.stringify(assignments));
        updateAssignmentsTable();
    }
}
function updateAssignmentsTable() {
    const table = document.getElementById('assignmentsTable');
    if (assignments.length > 0) {
        table.style.display = '';
        table.innerHTML = '<tr><th>Assignment</th><th>Due Date</th><th>Class</th><th>Actions</th></tr>' +
            assignments.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
            .map((a, index) => `<tr>
    <td><span class="text-style" style="text-decoration: underline;
    text-decoration-color: ${a.color}; 
    text-decoration-thickness: 2px;
    text-underline-offset: 3px; "">${a.name}</span></td>
    <td><span class="text-style" style="text-decoration: underline;
    text-decoration-color: ${a.color}; 
    text-decoration-thickness: 2px;
    text-underline-offset: 3px; " ">${formatDate(a.dueDate)}</span></td>
    <td><span class="text-style" style="background-color: ${hexToRGBA(a.color, 0.6)};
         border-radius: 15px;padding: 5px;border= 2px solid ${a.color};padding-left: 10px; 
             padding-right: 10px;">${a.className}</span></td>
    <td>
        <img src="icons/edit_icon_white.png" class="edit-icon" onclick="editAssignment(${index})">
        <img src="icons/delete_icon_white.png" class="delete-icon" onclick="deleteAssignment(${index})">
    </td>
</tr>`).join('');
    } else {
        table.style.display = 'none';
    }
}

function editClass(index) {
    const className = prompt("Edit class name:", classes[index].name);
    const classColor = prompt("Edit class color (hex format):", classes[index].color);
    if (className !== null && classColor !== null) {
        classes[index] = { name: className, color: classColor };
        localStorage.setItem('classes', JSON.stringify(classes));
        updateClassesList();
        updateAssignmentsTable();
    }
}

function deleteClass(index) {
    if (confirm("Are you sure you want to delete this class?")) {
        classes.splice(index, 1);
        localStorage.setItem('classes', JSON.stringify(classes));
        updateClassesList();
        updateAssignmentsTable();
    }
}

function populateEditForm(index) {
    const assignment = assignments[index];
    document.getElementById('editAssignmentName').value = assignment.name;
    const [dueDate, dueTime] = assignment.dueDate.split('T');
    document.getElementById('editDueDate').value = dueDate;
    document.getElementById('editDueTime').value = dueTime;
    document.getElementById('editClassSelect').value = assignment.className;
}

function editAssignment(index) {
    populateEditForm(index);
    document.getElementById('editAssignmentForm').setAttribute('data-index', index);
    document.getElementById('editAssignmentForm').style.display = ''; // Show the edit form
}

document.getElementById('classForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const name = document.getElementById('className').value;
    const color = document.getElementById('classColor').value;
    classes.push({name, color});
    localStorage.setItem('classes', JSON.stringify(classes));
    updateClassSelect();
    updateClassesList();
    document.getElementById('assignmentForm').style.display = '';
    this.reset();
});
document.getElementById('assignmentForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const name = document.getElementById('assignmentName').value;
    const dueDate = document.getElementById('dueDate').value;
    const dueTime = document.getElementById('dueTime').value;
    const className = document.getElementById('classSelect').value;
    const classColor = classes.find(c => c.name === className).color;

    const dueDateTimeLocal = dueDate + 'T' + dueTime;

    assignments.push({ name, dueDate: dueDateTimeLocal, className, color: classColor });
    localStorage.setItem('assignments', JSON.stringify(assignments));
    updateAssignmentsTable();
    populateAssignmentDropdowns();
    this.reset();
});



document.getElementById('editAssignmentForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const index = this.getAttribute('data-index');
    const name = document.getElementById('editAssignmentName').value;
    const dueDate = document.getElementById('editDueDate').value;
    const dueTime = document.getElementById('editDueTime').value;
    const className = document.getElementById('editClassSelect').value;
    const classColor = classes.find(c => c.name === className).color;
    const startDateTime = `${dueDate}T${dueTime}`;
        assignments[index] = { name, dueDate: startDateTime, className, color: classColor };
    localStorage.setItem('assignments', JSON.stringify(assignments));
    updateAssignmentsTable();
    this.reset();
    this.style.display = 'none'; 
});
function populateAssignmentDropdowns() {
    const dropdowns = document.querySelectorAll('.assignmentDropdown');
    console.log("Populating dropdowns with assignments", assignments);
    dropdowns.forEach(dropdown => {
        dropdown.innerHTML = '<option value="">Select</option>';
        assignments.forEach(assignment => {
            const option = document.createElement('option');
            option.value = assignment.name;
            option.textContent = assignment.name;
            dropdown.appendChild(option);
        });
    });
}

window.onload = function() {
    if (classes.length > 0) {
        document.getElementById('assignmentForm').style.display = '';
        updateClassSelect();
        updateClassesList();
    }
    updateAssignmentsTable();
    populateAssignmentDropdowns();
    renderTasks();
};
function addTaskToDay(dayId) {
    const dropdown = document.getElementById(`${dayId}Dropdown`);
    const customTaskInput = document.querySelector(`#${dayId} .customTaskInput`);
    const tasksList = document.querySelector(`#${dayId} .tasksList`);

    const selectedAssignment = dropdown.value;
    const customTask = customTaskInput.value.trim();
    let taskText = selectedAssignment || customTask;

    if (!taskText) {
        alert("Please select an assignment or enter a custom task.");
        return;
    }

    // Assume tasks are stored as an array of objects { text: String, completed: Boolean, day: String }
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.push({ text: taskText, completed: false, day: dayId });

    localStorage.setItem('tasks', JSON.stringify(tasks));
    renderTasks(); // Call a function to update the UI with all tasks
}

function renderTasks() {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    // Clear existing tasks UI
    document.querySelectorAll('.tasksList').forEach(list => list.innerHTML = '');

    tasks.forEach((task, index) => {
        const tasksList = document.querySelector(`#${task.day} .tasksList`);
        if (!tasksList) return;

        const taskContainer = document.createElement('div');
        taskContainer.classList.add('taskContainer');

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = task.completed;
        checkbox.onchange = (e) => {
            task.completed = e.target.checked;
            localStorage.setItem('tasks', JSON.stringify(tasks));
            taskContainer.style.textDecoration = task.completed ? "line-through" : "none";
        };

        const label = document.createElement('label');
        label.textContent = task.text;
        label.style.fontSize= '16px';
        label.style.textDecoration = task.completed ? "line-through" : "none";

        const deleteButton = document.createElement('button');
        deleteButton.innerHTML = '<img src="icons/delete_icon_white.png" class="delete-icon" alt="Delete">';
        deleteButton.classList.add('delete-icon');
        deleteButton.onclick = function() { deleteTask(index, task.day); };

        taskContainer.appendChild(checkbox);
        taskContainer.appendChild(label);
        taskContainer.appendChild(deleteButton);
        tasksList.appendChild(taskContainer);
    });
}
function deleteTask(taskIndex, day) {
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    // Filter out the task to be deleted
    tasks = tasks.filter((task, index) => index !== taskIndex);
    localStorage.setItem('tasks', JSON.stringify(tasks));
    renderTasks(); // Re-render tasks
}


function toggleStrikeThrough(checkbox, taskElement) {
    if (checkbox.checked) {
        taskElement.style.textDecoration = "line-through";
    } else {
        taskElement.style.textDecoration = "none";
    }
}
function showAddTaskForm(day) {
    document.getElementById(`showAddTaskForm${day}`).addEventListener('click', function() {
        document.getElementById(`addTaskContainer${day}`).style.display = 'block';
        this.style.display = 'none'; // Optionally hide the "Add Task" button
    });
}

function hideAddTaskForm(day) {
    const addTaskContainer = document.getElementById(`addTaskContainer${day}`);
    const showAddTaskButton = document.getElementById(`showAddTaskForm${day}`);

    // Hide the add task container and show the "Add Task" button again
    addTaskContainer.style.display = 'none';
    showAddTaskButton.style.display = 'inline-block'; // Adjust display value as needed
}

// Initialize show/hide functionality for each day
const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
days.forEach(day => {
    showAddTaskForm(day);
    // No need to bind hide function here since it's directly called by onclick event handler
});

