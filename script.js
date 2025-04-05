const filterDropdown = document.getElementById("filter-dropdown")
const dropdownArrow = document.getElementById("dropdown-arrow")

function toggleFilterDropdown() {
    if (filterDropdown.style.display == "none") {
        filterDropdown.style.display = "flex"
        dropdownArrow.style.rotate = "0deg"
    } else {
        filterDropdown.style.display = "none"
        dropdownArrow.style.rotate = "180deg"
    }
}