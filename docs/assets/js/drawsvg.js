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

function addLineConnect(startId,endId,from,to) {
    
    let line = '';
    let startX,startY,endX,endY ;
    startX = startY = endX = endY = 0;
    let start = document.getElementById(startId);
    let end = document.getElementById(endId);


    if(end && start) {
        startX = start.offsetLeft + start.offsetWidth/2;
        startY = start.offsetTop + start.offsetHeight/2;
        endX = end.offsetLeft + end.offsetWidth;
        endY = end.offsetTop + end.offsetHeight;

        if(from=="bottom") {
            startY = start.offsetTop + start.offsetHeight/2;
        } else if(to=="top") {
            startY = start.offsetTop;
        } else {
            startY = start.offsetTop + start.offsetHeight/2;
        }

        if(to=="bottom") {
            endY = end.offsetTop  + end.offsetHeight;
        } else if(to=="top") {
            endY = end.offsetTop;
        } else {
            endY = end.offsetTop + end.offsetHeight/2;
        }


        if(from=="left") {
            startX = start.offsetLeft;
        } else if(from=="right") {
            startX = start.offsetLeft + start.offsetWidth - 6;
        } else {
            startX = start.offsetLeft + start.offsetWidth/2;
        }
        
        if(to=="left") {
            endX = end.offsetLeft;
        } else if(to=="right") {
            endX = end.offsetLeft + end.offsetWidth + 6;
        } else {
            endX = end.offsetLeft + end.offsetWidth/2;
        }  
    }
    line += `<svg id=${startId}_${endId}
                width="100%" 
                height="100%">
                <line x1="${startX}" 
                        y1="${startY}"
                        x2="${endX}" 
                        y2="${endY}" 
                stroke="black"
                stroke-width="6px"/></svg>`
    
    document.getElementById("content").innerHTML += line;
}
