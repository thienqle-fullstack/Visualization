function show(id){
    let elem = document.getElementById(id);
        elem.style.display = "block";
  
    
}

function hide(id) {
    let elem = document.getElementById(id);
    elem.style.display = "none";
}

function hideAll(className){
    let elems = document.querySelectorAll('.'+className);
    // let elems = document.getElementsByClassName(className);
    if(elems)
    elems.forEach(elem => {
        elem.style.display = "none";
    });
}

function showAll(className){
    // let elems = document.getElementsByClassName(className);
    let elems = document.querySelectorAll('.'+className);
    if(elems) 
    elems.forEach(elem => {
        elem.style.display = "inline-block";
    });
}

function popup(modal,modalcontent){
    let mymodal = document.getElementById(modal);
    let mycontent = document.getElementById(modalcontent);
    mymodal.className += " " + "my-modal";
    mycontent.className += " " + "my-modal-content";
}

function popdown(modal,modalcontent){
    let mymodal = document.getElementById(modal);
    let mycontent = document.getElementById(modalcontent);
    if(mymodal.className.includes("my-modal")) {
        mymodal.className = mymodal.className.replace("my-modal","")
    }
    if(mycontent.className.includes("my-modal-content")) {
        mycontent.className = mycontent.className.replace("my-modal-content","")
    }
}