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
    }, 10); // 10ms just to ensure it's past paint
  });

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
//     order,      // number (for sorting)
//     name,       // string
//     description,// string
//     status,     // string or number ("completed", "pending", or progress value)
//     steps       // number (0 or some total progress number)
// ]



function changeFilterMode(type) {
    filterMode = type
    sortLabel.textContent = "Sort by " + filterMode
    updateTasks()
}

function updateTasks() {
    document.querySelectorAll("#task").forEach(element => {
        element.remove()
    });

    let filteredTasks = getTasks(filterMode)
    for (i=0; i < filteredTasks.length; i++) {
        console.log(filteredTasks[i])
    }

}

function addTask(location) {
    const raw = localStorage.getItem("tasks")
    const tasks = raw ? JSON.parse(raw) : []
    const container = location.parentElement.parentElement
    let id = null;

    console.log(container)

    if (container.querySelector("#id-field").value != '') {
        id = container.querySelector("#id-field").value
    }

    let name = container.querySelector("#name-field").value
    let desc = container.querySelector("#desc-field").value
    let status = container.querySelector("#status-field").value

    if (name == '' || desc == '') {
        alert("MISSING NAME OR DESCRIPTION!")
        return
    }

    // Find the current highest ID
    const maxId = tasks.reduce((max, task) => {
      return task[0] > max ? task[0] : max
    }, 0)
    id = maxId + 1

    let taskArray = [id, name, desc, status]
  
    tasks.push(taskArray);
    localStorage.setItem("tasks", JSON.stringify(tasks))

    alert("SUCESSFULLY ADDED TASK WITH NAME " + name + " AND ID " + id + "!")
  }

function removeTask(location) {
    const container = location.parentElement.parentElement
    let id = container.querySelector("#id-field").value
    if (id === "all") {
      localStorage.removeItem("tasks")
      alert("SUCESSFULLY REMOVED ALL TASK ENTRIES!")
      return;
    }

    if (!/^\d+$/.test(id)) {
        alert("INVALID OR MISSING ID!")
        return
    }

    const raw = localStorage.getItem("tasks")
    const tasks = raw ? JSON.parse(raw) : []
    const filtered = tasks.filter(task => task[0] !== id)
    localStorage.setItem("tasks", JSON.stringify(filtered))
    alert("SUCESSFULLY REMOVED TASK ENTRY WITH ID " + id + "!")
}

function editTask(location) {
    const container = location.parentElement.parentElement
    let id = container.querySelector("#id-field").value

    if (!/^\d+$/.test(id)) {
        alert("INVALID OR MISSING ID!")
        return
    }

    let name = container.querySelector("#name-field").value
    let desc = container.querySelector("#desc-field").value
    let status = container.querySelector("#status-field").value

    let updatedTaskArray = [id, name, desc, status]

    const raw = localStorage.getItem("tasks")
    const tasks = raw ? JSON.parse(raw) : []
    const updated = tasks.map(task => task[0] === id ? updatedTaskArray : task)
    localStorage.setItem("tasks", JSON.stringify(updated))

    alert("SUCESSFULLY UPDATED TASK WITH ID " + id + "!")
}

function getTasks(status = null) {
    const raw = localStorage.getItem("tasks")
    const tasks = raw ? JSON.parse(raw) : []
  
    if (!status) return tasks;
  
    if (status === "completed") {
      return tasks.filter(task => task[4] === "completed")
    }
  
    if (status === "pending") {
      return tasks.filter(task => 
        task[4] === "pending" || (typeof task[4] === "number" && task[4] < task[5])
      );
    }
  
    alert("UNKNOWN STATUS!")
}
