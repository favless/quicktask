// for transitions and animations
const filterDropdown = document.getElementById("filter-dropdown")
const dropdownArrow = document.getElementById("dropdown-arrow")

const addButton = document.querySelector(".add-button")
const addButtonLabel = document.getElementById("add-button-label")

// general element vars

const sortLabel = document.getElementById("sort-label")

const adminWrapper = document.querySelector(".admin-menu-wrapper")

// for height initializing or whatever

const filterHeight = filterDropdown.offsetHeight
filterDropdown.style.height = "0px";

const addButtonLabelWidth = addButtonLabel.offsetWidth
addButtonLabel.style.maxWidth = "0px"

// general variables

let filterMode = "all"

let darkmode = localStorage.getItem("darkmode")
if (darkmode == null) {
    localStorage.setItem("darkmode", "off")
    darkmode = "off"
}

// COSMETIC FUNCTIONS -------------------------------

window.addEventListener("DOMContentLoaded", () => {
    setTimeout(() => {
      document.body.classList.remove("preload");
    }, 10);
  });


// animations for add button
addButton.addEventListener("mouseenter", () => {
    addButtonLabel.style.maxWidth = addButtonLabelWidth + "px"
})

addButton.addEventListener("mouseleave", () => {
    addButtonLabel.style.maxWidth = "0px"
})

function toggleFilterDropdown() {
    if (filterDropdown.style.height == "0px") {
        filterDropdown.style.height = filterHeight + "px"
        dropdownArrow.style.rotate = "0deg"
    } else {
        filterDropdown.style.height = "0px"
        dropdownArrow.style.rotate = "180deg"
    }
}

function toggleDarkMode() {
    document.body.classList.toggle("dark");
    if (darkmode == "off") {
        darkmode = "on"
        localStorage.setItem("darkmode", "on")
    } else {
        darkmode = "off"
        localStorage.setItem("darkmode", "off")
    }
}

// apply dark mode on page load
if (darkmode == "on") {
    document.body.classList.add("dark");
} else {
    document.body.classList.remove("dark");
}

function toggleAdminPanel() {
    if (adminWrapper.style.opacity == 0) {
        adminWrapper.style.opacity = "1";
        adminWrapper.style.pointerEvents = "auto";
    } else {
        adminWrapper.style.opacity = "0";
        adminWrapper.style.pointerEvents = "none";
    }
}

// DATA HANDLING FUNCTIONS ------------------------------

// template for the data structure:

// [
//     id,         // number
//     name,       // string
//     description,// string
//     status,     // string or number ("completed", "pending", or progress value)
// ]

function getTasks(status = null) {
    const raw = localStorage.getItem("tasks")
    const tasks = raw ? JSON.parse(raw) : []
  
    // returns all if theres no param
    if (!status) return tasks;
  
    if (status === "completed") {
      return tasks.filter(task => task[4] === "completed")
    }
  
    if (status === "pending") {
      return tasks.filter(task => 
        task[4] === "pending" || (typeof task[4] === "number" && task[4] < task[5])
      );
    }
  
    // error handler
    alert("UNKNOWN STATUS!")
}

function getTaskById(id) {
    const raw = localStorage.getItem("tasks")
    const tasks = raw ? JSON.parse(raw) : []

    if (!/^\d+$/.test(id)) {
        alert("INVALID OR MISSING ID!")
        return
    }
    
    return tasks.find(task => task[0] == id)
}

function completeTask(location) {
    const taskDiv = location.parentElement;
    const id = taskDiv.getAttribute("data-id")

    const task = getTaskById(id)
    editTask(null, id, task[1], task[2], "completed")
}

function populateTasks() {
    const taskList = document.querySelector(".task-list")
    const taskTemplate = document.getElementById("task-template");

    taskList.querySelectorAll("#task").forEach(element => {
        element.remove()
    });

    const tasks = getTasks()

    for (i=0; i < tasks.length; i++) {
        let id = tasks[i][0]
        let name = tasks[i][1]
        let desc = tasks[i][2]
        let status = tasks[i][3]

        if (filterMode == "all" || status == filterMode) {
             // cloning, parenting and id changing
            let newTask = taskTemplate.cloneNode(true);
            newTask.setAttribute( 'id', "task" );
            newTask.setAttribute("data-id", id);
            taskList.appendChild(newTask)
        
            newTask.style.display = "flex"
            newTask.querySelector("#task-label").textContent = name;
        }
    }

    document.querySelectorAll("#task").forEach(task => {
        task.addEventListener("click", (e) => {
            if (e.target.classList.contains("check-btn")) return;

            const prevSelected = taskList.querySelector(".selected")
            if (prevSelected) {
                prevSelected.classList.remove("selected")
            }
            task.classList.add("selected")

            const taskid = task.getAttribute("data-id");
            const detailsTitle = document.getElementById("details-task-name")
            const detailsDesc = document.getElementById("details-task-desc")
            const taskData = getTaskById(taskid)
            
            detailsTitle.textContent = taskData[1]
            detailsDesc.textContent = taskData[2]
        })
    });
}

populateTasks()

function populateDataView() {
    const dataList = document.getElementById("data-list")
    const dataTemplate = dataList.querySelector("#data-template")

    // clear all previous entries
    dataList.querySelectorAll("#data-entry").forEach(element => {
        element.remove()
    });

    const tasks = getTasks()

    // cycle through tasks and add data element
    for (i=0; i < tasks.length; i++) {
        let id = tasks[i][0]
        let name = tasks[i][1]
        let desc = tasks[i][2]
        let status = tasks[i][3]

        // cloning, parenting and id changing
        let newData = dataTemplate.cloneNode(true);
        newData.setAttribute( 'id', "data-entry" );
        dataList.appendChild(newData)
        
        newData.style.display = "grid"
        newData.querySelector("#data-id").textContent = id;
        newData.querySelector("#data-name").textContent = name;
        newData.querySelector("#data-desc").textContent = desc;
        newData.querySelector("#data-status").textContent = status;
    }

}

// populate initially on page load
populateDataView()

// for sorting
function changeFilterMode(type) {
    filterMode = type
    sortLabel.textContent = "Sort by " + filterMode
    populateTasks()
}

function addTask(location) {
    const raw = localStorage.getItem("tasks")
    const tasks = raw ? JSON.parse(raw) : []
    const container = location.parentElement.parentElement
    let id = null;

    // checks if the field is empty before assigning id value
    if (container.querySelector("#id-field").value != '') {
        id = container.querySelector("#id-field").value
    }

    let name = container.querySelector("#name-field").value
    let desc = container.querySelector("#desc-field").value
    let status = container.querySelector("#status-field").value

    // error if theres no name or desc
    if (name == '' || desc == '') {
        alert("MISSING NAME OR DESCRIPTION!")
        return
    }

    // if theres no id provided, automatically increment it
    if (id == null) {
        const maxId = parseInt(tasks.reduce((max, task) => {
            return task[0] > max ? task[0] : max
        }, 0))
        id =  maxId + 1
    }
    
    // bundle up the new array, push it to the tasks var and set it on local storage
    let taskArray = [id, name, desc, status]
  
    tasks.push(taskArray);
    localStorage.setItem("tasks", JSON.stringify(tasks))
    populateDataView()
    populateTasks()

    alert("SUCESSFULLY ADDED TASK WITH NAME " + name + " AND ID " + id + "!")
  }

function removeTask(location) {
    const container = location.parentElement.parentElement

    const id = container.querySelector("#id-field").value
    // if "all" is in the id field, remove item completely
    if (id === "all") {
      localStorage.removeItem("tasks")
      populateDataView()
      alert("SUCESSFULLY REMOVED ALL TASK ENTRIES!")
      return;
    }

    // check for non-number id provided
    if (!/^\d+$/.test(id)) {
        alert("INVALID OR MISSING ID!")
        return
    }

    // i should actually ask kai to explain this im not so sure
    const raw = localStorage.getItem("tasks")
    const tasks = raw ? JSON.parse(raw) : []
    const filtered = tasks.filter(task => task[0] !== Number(id))
    localStorage.setItem("tasks", JSON.stringify(filtered))
    populateDataView()
    populateTasks()

    alert("SUCESSFULLY REMOVED TASK ENTRY WITH ID " + id + "!")
}

// usage: editTask([object or null], id, name, desc, status) leave null to leave values as they are
function editTask(input, id, name, desc, status) {

    if (input != null) {
        const container = input.parentElement.parentElement
        id = container.querySelector("#id-field").value.trim() || null;
        name = container.querySelector("#name-field").value.trim() || null;
        desc = container.querySelector("#desc-field").value.trim() || null;
        status = container.querySelector("#status-field").value.trim() || null;
    }

    const replacementTask = [id, name, desc, status]
    const selectedTask = getTaskById(id)
    let updatedTask = selectedTask.map((val, index) => replacementTask[index] !== null ? replacementTask[index] : val);

    // also ask kai here
    const raw = localStorage.getItem("tasks")
    const tasks = raw ? JSON.parse(raw) : []
    const updated = tasks.map(task => task[0] == id ? updatedTask : task)
    localStorage.setItem("tasks", JSON.stringify(updated))
    populateDataView()
    populateTasks()

    alert("SUCESSFULLY UPDATED TASK WITH ID " + id + "!")
}