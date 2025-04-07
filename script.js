// for transitions and animations
const filterDropdown = document.getElementById("filter-dropdown")
const dropdownArrow = document.getElementById("dropdown-arrow")

const addButton = document.querySelector(".add-button")
const addButtonLabel = document.getElementById("add-button-label")

// general element vars

const sortLabel = document.getElementById("sort-label")


// for height initializing or whatever
const filterHeight = filterDropdown.offsetHeight
filterDropdown.style.height = "0px";

const addButtonLabelWidth = addButtonLabel.offsetWidth
addButtonLabel.style.maxWidth = "0px"


let filterMode = "all"

// COSMETIC FUNCTIONS -------------------------------

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

// DATA HANDLING FUNCTIONS ------------------------------



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

function addTask(taskArray) {
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks.push(taskArray);
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function removeTask(id) {
    if (id === "all") {
      localStorage.removeItem("tasks");
      return;
    }
  
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    const filtered = tasks.filter(task => task[0] !== id);
    localStorage.setItem("tasks", JSON.stringify(filtered));
}

function editTask(id, updatedTaskArray) {
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    const updated = tasks.map(task => task[0] === id ? updatedTaskArray : task);
    localStorage.setItem("tasks", JSON.stringify(updated));
}

function getTasks(status = null) {
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  
    if (!status) return tasks;
  
    if (status === "completed") {
      return tasks.filter(task => task[4] === "completed");
    }
  
    if (status === "pending") {
      return tasks.filter(task => 
        task[4] === "pending" || (typeof task[4] === "number" && task[4] < task[5])
      );
    }
  
    return []; // fallback if status is unknown
}
