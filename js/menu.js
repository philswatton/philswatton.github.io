/*this function adds and removes the class of 'responsive'
to menu when the icon is clicked*/

function menuFunction() {
  var x = document.getElementById("menu");
  if (x.className === "menu") {
    x.className += " responsive";
  } else {
    x.className = "menu";
  }
}
