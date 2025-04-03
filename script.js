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