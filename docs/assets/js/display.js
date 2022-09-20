function hideshow(id){
    let elem = document.getElementById(id);
    if (elem.style.display === "none") {
        elem.style.display = "block";
    } else {
        elem.style.display = "none";
    }
}

function removeItem(id) {
    const element = document.getElementById(id);
    element.remove();
}