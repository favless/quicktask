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


// Data handling
// still trying to wrap my head around this
// im taking a break today, i dont feel well. ill try to deliver on saturday. sorry.

function addDataRow() {
    let rowData = [document.getElementById("task-name-input").value, document.getElementById("task-desc-input").value, "pending"]
    console.log("Got: " + rowData)
    
    const rawData = localStorage.getItem("tasks") || "";
    const newRow = rowData.join("|");
    localStorage.setItem("tasks", rawData ? rawData + "\n" + newRow : newRow);
}

function getAllData() {
    const rawData = localStorage.getItem("tasks");
    if (!rawData) return [];
    
    return rawData.split("\n").map(row => row.split("|"));
}

function getTablesByStatus(status) {
    const rawData = localStorage.getItem("tables");
    if (!rawData) return [];
    
    return rawData
        .split("\n")                        // Split into rows
        .map(row => row.split("|"))         // Convert each row into an array
        .filter(row => row[3] === status);  // Filter by status (4th column)
}

console.log(getAllData())