// Global list variable
let listIndex = 0;

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
    lists[n].style.display = "block";

    // Display first box
    showInterest(0);
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
function showInterest(n) {

    // Get array of interest boxes in current interest lists
    let lists = document.getElementsByClassName("interest-list");
    let boxes = lists[listIndex].getElementsByClassName("interest-box");

    // Hide all boxes
    closeBoxes();

    // Display box n
    boxes[n].style.display = "block";
}











// let interestIndex = 1;
// showInterest(interestIndex);

// // Next/previous controls
// function plusInterest(n) {
//   showInterest(interestIndex += n);
//   console.log(interestIndex);
// }

// // Thumbnail image controls
// function currentInterest(n) {
//   showInterest(interestIndex = n);
// }

// function showInterest(n) {
//   let i;
//   let slides = document.getElementsByClassName("mySlides");
//   let dots = document.getElementsByClassName("dot");
//   if (n > slides.length) {slideIndex = 1}
//   if (n < 1) {slideIndex = slides.length}
//   for (i = 0; i < slides.length; i++) {
//     slides[i].style.display = "none";
//   }
//   for (i = 0; i < dots.length; i++) {
//     dots[i].className = dots[i].className.replace(" active", "");
//   }
//   slides[slideIndex-1].style.display = "block";
//   dots[slideIndex-1].className += " active";
// }