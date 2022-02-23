
let clicks = document.getElementById("clicks");

let i=0;
function counter() {
    i+=1;
    clicks.innerHTML = "Number of clicks: " + i;
}