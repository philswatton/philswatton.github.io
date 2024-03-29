// Global variables
let listIndex = 0;
let boxIndex = 0;

// Selecting list to display
function showList(n) {
    // Update list index
    listIndex = n;

    // Close current boxes
    closeBoxes();

    // Get array of interest lists
    let lists = document.getElementsByClassName("interest-list");

    // Hide all lists
    for (let i=0; i<lists.length; i++) {
        lists[i].style.display = "none";
    }

    // Display list n
    lists[n].style.display = "flex";

    // Get array of buttons
    let buttons = document.getElementsByClassName("list-button");

    // Set all to default style
    for (let i=0; i<buttons.length; i++) {
        buttons[i].className = "list-button";
    }

    // Change nth button to grey
    buttons[n].className += " grey-button";

    // Display first box
    showBox(0);
}

// Function to close open boxes
function closeBoxes() {

        // Get array of interest boxes in current interest lists
        let lists = document.getElementsByClassName("interest-list");
        let boxes = lists[listIndex].getElementsByClassName("interest-box");
    
        // Hide all boxes
        for (let i=0; i< boxes.length; i++) {
            boxes[i].style.display = "none";
        }

}

// Selecting box to display
function showBox(n) {

    // Get array of interest boxes in current interest lists
    let lists = document.getElementsByClassName("interest-list");
    let boxes = lists[listIndex].getElementsByClassName("interest-box");
    let nbox = boxes.length;

    // Validate input
    if (n < 0) {
        n = nbox - 1;
    } else if (n >= nbox) {
        n = 0;
    }

    // Update box index
    boxIndex = n;

    // Hide all boxes
    closeBoxes();

    // Display box n
    boxes[n].style.display = "block";

    // Get array of buttons
    let buttons = lists[listIndex].getElementsByClassName("interest-button");

    // Set all to default style
    for (let i=0; i<buttons.length; i++) {
        buttons[i].className = "interest-button";
    }

    // Change nth button to grey
    buttons[n].className += " grey-button";
}

// Next and previous buttons
function changeBox(n) {
    showBox(boxIndex + n);
}


// Show first list
window.onload = function() {
    showList(listIndex);
}