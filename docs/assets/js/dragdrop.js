function select(id){
    // Select elment that we can run drag function on
    dragElement(document.getElementById(id));
}


function dragElement(elem) {
  var targetX = 0, targetY = 0, curX = 0, curY = 0;
  //Set onmousedown to function dragMouseDown
  elem.onmousedown = dragMouseDown;
  
    /*
        DragMouseDown collect start Position
        Then we it calls elementDrag to know current mouse position
        Then we it calls closeDragElement to terminate drag event if use mouseup
    */
  function dragMouseDown(e) {
    e = e || window.event;
    e.preventDefault();
    // get the mouse cursor position at startup:
    curX = e.clientX;
    curY = e.clientY;
    document.onmouseup = closeDragElement;
    // call a function whenever the cursor moves:
    document.onmousemove = elementDrag;
  }

  function elementDrag(e) {
    e = e || window.event;
    e.preventDefault();
    // calculate the new cursor position:
    targetX = curX - e.clientX;
    targetY = curY - e.clientY;
    curX = e.clientX;
    curY = e.clientY;
    // set the element's new position:
    elem.style.left = (elem.offsetLeft - targetX) + "px";
      elem.style.top = (elem.offsetTop - targetY) + "px";

    //Debug
    let logging = `top: ${elem.style.top}; left:${elem.style.left} `
    document.getElementById("log").innerHTML = logging;
  }

  function closeDragElement() {
    // stop moving when mouse button is released:
    document.onmouseup = null;
    document.onmousemove = null;
  }
}