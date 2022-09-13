var startX = -1;
var startY = -1;
var endX = -1;
var endY = -1;
var firstClick = true;
var line_id = 0;
var lines = []

//Get mouse position
function getCurrentPoint(event) {
    if(firstClick) {
        console.log("here",event.clientX,event.clientY)
        startX = event.clientX;
        startY = event.clientY;
        firstClick = false;
    } else {
        endX = event.clientX;
        endY = event.clientY;
        drawSvgLine();
    }
}


//Start drawing
function startDrawing() {
    document.addEventListener('click', getCurrentPoint, true); 
}

function stopDrawing() {
    document.removeEventListener("click", getCurrentPoint,true);
    startX = -1;
    startY = -1;
    endX = -1;
    endY = -1;
}

function drawSvgLine() {
    line_id +=1;
    console.log(line_id);
    let id = 'line' + line_id;
    let line = `<svg id="${id}" width="100%" height="100%"><line x1="${startX}" y1="${startY}" x2="${endX}" y2="${endY}" stroke="black"/></svg>`
    document.getElementById("content").innerHTML += line;
    firstClick=true;
    lines.push(id)
    stopDrawing();
}

function undoSvgLine() {
    if(line_id>0) {
        const element = document.getElementById('line' + line_id);
        line_id-=1;
        element.remove()
    }
}