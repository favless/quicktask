// Data handling
// still trying to wrap my head around this
// im taking a break today, i dont feel well. ill try to deliver on saturday. sorry.

function addDataRow() {
    let rowData = [document.getElementById("task-name-input").value, document.getElementById("task-desc-input").value, "completed"]
    console.log("Got: " + rowData)
    
    const rawData = localStorage.getItem("tasks") || "";
    const newRow = rowData.join("|");
    localStorage.setItem("tasks", rawData ? rawData + "\n" + newRow : newRow);
}

function resetAllData() {
    localStorage.setItem("tasks", [])
}

function getAllData() {
    const rawData = localStorage.getItem("tasks");
    if (!rawData) return [];
    
    return rawData.split("\n").map(row => row.split("|"));
}

function getTablesByStatus(status) {
    const rawData = localStorage.getItem("tasks");
    if (!rawData) return [];
    
    return rawData
        .split("\n")                        // Split into rows
        .map(row => row.split("|"))         // Convert each row into an array
        .filter(row => row[2] == status);  // Filter by status (4th column)
}

function updateTableStatus(name, newStatus) {
    let rawData = localStorage.getItem("tasks");
    if (!rawData) return;

    let updatedData = rawData
        .split("\n") // Split into rows
        .map(row => {
            let columns = row.split("|"); // Split columns
            if (columns[0] === name) { // Check if name matches
                columns[2] = newStatus; // Update status
            }
            return columns.join("|"); // Rebuild row
        })
        .join("\n"); // Join rows back

    localStorage.setItem("tasks", updatedData);
}

// everything else

function toggleFilterDropdown() {
    const dropdown = document.getElementById("filterDropdown")
    const arrow = document.getElementById("filterArrow")
    if (dropdown.style.display == "flex") {
        dropdown.style.display = "none"
        arrow.style.rotate = "180deg"
    } else {
        dropdown.style.display = "flex"
        arrow.style.rotate = "0deg"
    }
}

function toggleAddMenu() {
    const menu = document.getElementById("add-menu")

    if (menu.style.display == "flex") {
        menu.style.display = "none"
    } else {
        menu.style.display = "flex"
    }
}

function completeTask(task) {
    console.log(task)
    let taskName = task.querySelector("#task-label").textContent

    updateTableStatus(taskName, "completed")
    showTasks("pending")
    console.log(getTablesByStatus("pending"))
}

function showTasks(filter) {

    document.querySelectorAll("#generatedTask").forEach(element => element.remove())

    let tasks
    if (filter == null) {
        tasks = getAllData()
    } else {
        tasks = getTablesByStatus(filter)
    }
    
    for (i=0; i < tasks.length; i++) {

        let newTask = document.getElementById("task").cloneNode(true);
        newTask.id = "generatedTask"
        newTask.style.display = "flex"
        document.getElementById("task-list").appendChild(newTask)
        newTask.querySelector("#task-label").textContent = tasks[i][0]
        
    }
}

showTasks()
resetAllData()