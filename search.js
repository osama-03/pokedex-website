const inputElement = document.querySelector("#search-input");
const search_icon = document.querySelector("#search-close-icon");
const sort_wrapper = document.querySelector(".sort-wrapper");

// Listen for input changes to show/hide close icon
inputElement.addEventListener("input", () => {
    handleInputChange(inputElement);
});

// Listen for close icon click
search_icon.addEventListener("click", handleSearchCloseOnClick);

// Listen for sort icon click to toggle filter dropdown
sort_wrapper.addEventListener("click", handleSortIconOnClick);

// Show close icon when input has value

function handleInputChange(inputElement) {
    const inputValue = inputElement.value;

    if (inputValue !== "") {
        search_icon.classList.add("search-close-icon-visible");
    }

    else {
        search_icon.classList.remove("search-close-icon-visible");

    }
}

// Clear search input and hide close icon

function handleSearchCloseOnClick() {
    document.querySelector("#search-input").value = "";
    document.querySelector("#search-close-icon").classList.remove("search-close-icon-visible");

}

// Toggle filter dropdown visibility

function handleSortIconOnClick() {
    document.querySelector(".filter-wrapper").classList.toggle("filter-wrapper-open");
    document.querySelector("body").classList.toggle("filter-wrapper-open-overlay")
}