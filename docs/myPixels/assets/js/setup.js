
let num_cols = 16;
let num_rows = 16;
let matrix  = []
let previousMatrix = []
let selected_cell = []
let draft_render = []

let state = {
    color: 1, 
    style: style.PEN
}


function setup(num_rows,num_cols) {
    grid = document.getElementById('pixel_grid')


    for(let r=0;r<num_rows;r++) {
        row = []
        for(let c=0;c<num_cols;c++) {
            row.push(0)
        }
        matrix.push(row)
    }

    for(let r=0;r<num_rows;r++) {
        row = []
        for(let c=0;c<num_cols;c++) {
            row.push(0)
        }
        previousMatrix.push(row)
    }


    for(let r=0;r<num_rows;r++) {
        row = `<div id="r${r}" class="line">`
        for(let c=0;c<num_cols;c++) {
            col = `<div id="${r}_${c}" class="border cell" onclick="updateCell(${r},${c})" onmouseover="adjustCell(${r},${c})"></div>`
            row += col
        }
        row +=`</div>`
        grid.innerHTML += row
    }
}


//Truely draw to the canvas
function updateCell(r,c){

    switch(state.style) {
        case style.PEN: 
            cell = document.getElementById(`${r}_${c}`);
            cell.style.backgroundColor = color[selectedColor];
            matrix[r][c] = selectedColor;
            renderMatrix(matrix,num_cols,num_rows)
        break;
        case style.LINE: 
            selected_cell.push([r,c,matrix[r][c]])         
            if(selected_cell.length >= 2) {
                let points = bresenhams_line(selected_cell[0][0],selected_cell[0][1],selected_cell[1][0],selected_cell[1][1])
                points.forEach(p => {
                    const row = p[0]
                    const col = p[1]
                    let render_cell = document.getElementById(`${row}_${col}`);
                    render_cell.style.backgroundColor = color[selectedColor];
                    matrix[row][col] = selectedColor;
                    renderMatrix(matrix,num_cols,num_rows)
                })
                
                selected_cell = []
                draft_render = []
            }
        break;
        case style.BRUSH: 
            selected_cell.push([r,c])
            
            if(selected_cell.length >= 2) {
   
                selected_cell = []
                draft_render = []
            }
           
        break;
        case style.PAINT: 
            floodfill(c,r,num_cols-1,num_rows-1,selectedColor,matrix[r][c]);
            renderPixelGrid();
            renderMatrix(matrix,num_cols,num_rows)
        break;
        case style.SQUARE: 
        selected_cell.push([r,c,matrix[r][c]])         
        if(selected_cell.length >= 2) {
            let points = square(selected_cell[0][0],selected_cell[0][1],selected_cell[1][0],selected_cell[1][1])
            points.forEach(p => {
                const row = p[0]
                const col = p[1]
                let render_cell = document.getElementById(`${row}_${col}`);
                render_cell.style.backgroundColor = color[selectedColor];
                matrix[row][col] = selectedColor;
                renderMatrix(matrix,num_cols,num_rows)
            })
            
            selected_cell = []
            draft_render = []
        }
         break;

         case style.CIRCLE: 
            selected_cell.push([r,c,matrix[r][c]])         
            if(selected_cell.length >= 2) {
                let a = selected_cell[1][0]-selected_cell[0][0]
                let b = selected_cell[1][1]-selected_cell[0][1]
                let radius = Math.round(Math.sqrt(a*a + b*b));
                points = []
                points = bresenhams_circle(selected_cell[0][0],selected_cell[0][1],radius)
                reset_temporay_render();
         
                points.forEach(p => {
                    const row = p[0]
                    const col = p[1]
                    let render_cell = document.getElementById(`${row}_${col}`);
                    if(render_cell!==null) 
                    {
                        render_cell.style.backgroundColor = color[selectedColor];
                        matrix[row][col] = selectedColor;
                    }
                    renderMatrix(matrix,num_cols,num_rows)
                })
                
                selected_cell = []

            }
            break;

        default:
        break;

    }
 

}

//Temporary draw to the canvas
function adjustCell(r,c){

    switch(state.style) {
        case style.PEN: 
        break;
        case style.LINE: 
                if(selected_cell.length ==0) break;
               
                reset_temporay_render();
                draft_render = [selected_cell[0],[r,c,matrix[r][c]]]
                draft_render.forEach(elem => {
                    const row = elem[0]
                    const col = elem[1]
                    let render_cell = document.getElementById(`${row}_${col}`);
                    render_cell.style.backgroundColor = "#888";
                })
                            
            
        break;
        case style.SQUARE: 
                if(selected_cell.length ==0) break;
               
                reset_temporay_render();
                draft_render = [selected_cell[0],[r,c,matrix[r][c]]]
                draft_render.forEach(elem => {
                    const row = elem[0]
                    const col = elem[1]
                    let render_cell = document.getElementById(`${row}_${col}`);
                    render_cell.style.backgroundColor = "#888";
                })
                            
            
        break;
        case style.BRUSH: 
         
            if(selected_cell.length == 1) {
                draft_render.push([r,c,matrix[r][c]])    
                draft_render.forEach(elem => {
                    const row = elem[0]
                    const col = elem[1]
                    matrix[row][col] = selectedColor;
                    let render_cell = document.getElementById(`${row}_${col}`);
                    render_cell.style.backgroundColor = color[selectedColor];
                    renderMatrix(matrix,num_cols,num_rows)
                })
            }   
            
        break;
        case style.CIRCLE: 
         
            if(selected_cell.length ==0) break;
                
            reset_temporay_render();
            draft_render = [selected_cell[0],[r,c,matrix[r][c]]]
            draft_render.forEach(elem => {
                const row = elem[0]
                const col = elem[1]
                let render_cell = document.getElementById(`${row}_${col}`);
                render_cell.style.backgroundColor = "#888";
            })
                
        break;
        default:
        break;

    }

}

setup(num_rows,num_cols)

function setupMenu(){
    panel = document.getElementById('menu')
    keys = Object.keys(colorValue)
    line = `<div class="menu-panel">`
    for(let i=0;i<keys.length;i++) {
        cell = `<div id="${color[i]}" class="cell" onclick="selectColor(${i})"></div>`
        line+=cell;
    }

    styles = Object.keys(style)
    for(let i=0;i<styles.length;i++) {
        cell = `<div id="style-${i}" style="background:url(${icon[i]}); background-size: contain;" class="cell" onclick="selectStyle(${i})"></div>`
        line+=cell;
    }


    undoBtn = `<button class="border cellButton" onclick="undo()">Undo</button>`
    reset = `<button class="border cellButton" onclick="clearMatrix(0,0,${num_rows},${num_cols})">Reset</button>`
    svg = `<button class="border cellButton" onclick="getSVG()">SVG</button>`
    bytecode = `<button class="border cellButton" onclick="getImgSrc()">ByteCode</button>`
    line +=undoBtn;
    line +=reset;
    line +=svg;
    line +=bytecode;
    line +=`</div>`
    panel.innerHTML += line
    

    for(let i=0;i<keys.length;i++) {
        cell = document.getElementById(color[i])
        cell.style.backgroundColor = color[i];
    }

    selectColor(0);
    selectStyle(0);
}

setupMenu();

function selectColor(n){
    selectedColor = n;

    for(let i=0;i<Object.keys(color).length;i++){
        let cell = document.getElementById(color[i])
        cell.style.border = "None";
    }

    cell = document.getElementById(color[n])
    cell.style.border = "2px solid yellow";
    copyMatrix(matrix,previousMatrix);
}

function selectStyle(n){
    state.style = n
    reset_temporay_render();
    for(let i=0;i<Object.keys(style).length;i++){
        let cell = document.getElementById(`style-${i}`)
        cell.style.border = "None";
    }

    cell = document.getElementById(`style-${n}`)
    cell.style.border = "2px solid magenta";
    copyMatrix(matrix,previousMatrix);
}

function reset_temporay_render(){
    draft_render.forEach(elem => {
        const row = elem[0]
        const col = elem[1]
        const cell_color = color[elem[2]]
        let render_cell = document.getElementById(`${row}_${col}`);
        render_cell.style.backgroundColor = cell_color;
    })
    draft_render = []
}

function clearMatrix(startX,startY,endX,endY){
    for(let r=startY;r<endY;r++) {
        for(let c=startX;c<endX;c++) {
            matrix[r][c]=0;
            let cell = document.getElementById(`${r}_${c}`);
            cell.style.backgroundColor = color[0];
        }
    }
    selected_cell = []
    draft_render = []
    renderMatrix(matrix,num_cols,num_rows)
}

function getSVG(){
    const output = document.getElementById('output');
    const svg = generateSVGBase64Encode(num_cols,num_rows,10)
    output.value =svg;
}

function getImgSrc(){
    const output = document.getElementById('output');
    const src = generateBase64Encode(num_cols,num_rows,10)
    output.value =src;
}

function renderPixelGrid(){
    for(let r=0;r<num_rows;r++) {
        for(let c=0;c<num_cols;c++) {
            let render_cell = document.getElementById(`${r}_${c}`);
            render_cell.style.backgroundColor = color[matrix[r][c]];
        }
        
    }
}


function undo() {
    copyMatrix(previousMatrix,matrix);
    renderPixelGrid()
    renderMatrix(matrix,num_cols,num_rows);
}