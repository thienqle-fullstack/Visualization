
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
            let i = selectedColor;
            cell.style.backgroundColor = `rgba(${colorValue[i][0]},${colorValue[selectedColor][1]},${colorValue[i][2]},${colorValue[i][3]})`;
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
                    let i = selectedColor;
                    cell.style.backgroundColor = `rgba(${colorValue[i][0]},${colorValue[selectedColor][1]},${colorValue[i][2]},${colorValue[i][3]})`;
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
                let i = selectedColor;
                render_cell.style.backgroundColor = `rgba(${colorValue[i][0]},${colorValue[selectedColor][1]},${colorValue[i][2]},${colorValue[i][3]})`;
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
                        let i = selectedColor;
                        render_cell.style.backgroundColor = `rgba(${colorValue[i][0]},${colorValue[selectedColor][1]},${colorValue[i][2]},${colorValue[i][3]})`;
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
                    let i = selectedColor;
                    render_cell.style.backgroundColor =  `rgba(${colorValue[i][0]},${colorValue[selectedColor][1]},${colorValue[i][2]},${colorValue[i][3]})`;
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
    
    let first_cell = `<div id="${color[0]}" style="background:url(${icon_transparent}); background-size: contain;" class="cell" onclick="selectColor(${0})"></div>`
    line+=first_cell;
    for(let i=1;i<keys.length;i++) {
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
    matrixValue = `<button class="border cellButton" onclick="getMatrix()">Matrix</button>`
    grayscale = `<button class="border cellButton" onclick="getIntensityMatrix()">GrayScale</button>`
    line +=undoBtn;
    line +=reset;
    line +=svg;
    line +=bytecode;
    line +=matrixValue;
    line +=grayscale;
    line +=`</div>`
    panel.innerHTML += line
    

    for(let i=0;i<keys.length;i++) {
        cell = document.getElementById(color[i])
        cell.style.backgroundColor = `rgba(${colorValue[i][0]},${colorValue[i][1]},${colorValue[i][2]},${colorValue[i][3]})`;
    }

    selectColor(0);
    selectStyle(0);
}

setupMenu();

function resetMenu(){
    panel = document.getElementById('menu')
    let line = `<div class="menu-panel">`
    line +=`</div>`
    panel.innerHTML = line
}

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

function getMatrix(){
    const output = document.getElementById('output');
    // Convert nested array to string
    let result = matrix.map(row => `[${matrix.toString()}]`).toString();
    // Add square brackets to root array
    result = `[${result}]`;
    output.value = result;
}

function renderPixelGrid(){
    for(let r=0;r<num_rows;r++) {
        for(let c=0;c<num_cols;c++) {
            let render_cell = document.getElementById(`${r}_${c}`);
            let i = matrix[r][c]
            
            render_cell.style.backgroundColor = `rgba(${colorValue[i][0]},${colorValue[i][1]},${colorValue[i][2]},${colorValue[i][3]})`;
        }
    }
}


function undo() {
    copyMatrix(previousMatrix,matrix);
    renderPixelGrid()
    renderMatrix(matrix,num_cols,num_rows);
}

function getIntensityMatrix(){
    const intensityMatrix = []
    let intensityValue = []
    let originalColor = []
    for(let r=0;r<num_rows;r++) {
        const row=[]
        for(let c=0;c<num_cols;c++) {
            let current = colorValue[matrix[r][c]];
            let value = (current[0] + current[1] + current[2])/3
            row.push(value)
          
            if(!intensityValue.includes(value)) {
                intensityValue.push(value)
            }
            if(!originalColor.includes(current)) {
                originalColor.push(current)
            }
        }
        intensityMatrix.push(row)
    }

    intensityValue = intensityValue.sort((a, b) => a - b);
    originalColor = originalColor.sort((a,b) => (a[0]+a[1]+a[2])-(b[0]+b[1]+b[2]) )
    // intensityValue.reverse();

    for(let r=0;r<num_rows;r++) {
        for(let c=0;c<num_cols;c++) {
            intensityMatrix[r][c] = intensityValue.indexOf(intensityMatrix[r][c])
        }
    }

    const output = document.getElementById('output');
    let result = intensityMatrix.map(row => `[${intensityMatrix.toString()}]`).toString();
    result = `[${result}]`;
    output.value = result;
    return [intensityMatrix,intensityValue,originalColor];
}

function setupViewEditor(){
    
    const content = document.getElementById('content')
    const modal = document.getElementById('modal')
    const canvas16 = `<canvas id="view16" width="16px" height="16px"></canvas>`
    const canvas32 = `<canvas id="view32" width="80px" height="80px"></canvas>`
    const canvas64 = `<canvas id="view64" width="160px" height="160px"></canvas>`
    const btnClose = `<button onclick="hideModal()">Close</button>`
    content.innerHTML = '';
    content.innerHTML+= btnClose;
    content.innerHTML+= canvas16;
    content.innerHTML+= canvas32;
    content.innerHTML+= canvas64;

    const intensityMatrix = getIntensityMatrix() 
    matrixGS = intensityMatrix[0];
    const intensityValue = intensityMatrix[1];
    originalColor = intensityMatrix[2];
    viewPalette = originalColor

    grayScaleValue = []
    if(intensityValue.length<2) {
        grayScaleValue.push([128,128,128,255])
    } else {
        const distance = 255/(intensityValue.length-1);
    
        for(let i=0;i<intensityValue.length;i++) {
            const intensity = Math.round(i*distance);
            grayScaleValue.push([intensity,intensity,intensity,255])
        }
    }

    content.innerHTML+= `<div><label>Select Color Mode</label>`;

    content.innerHTML+= `<select id="selectColorMode"  onchange='onSelectColorMode()'>
                            <option value=${COLORMODE.GRAYSCALE}>Grayscale</option>
                            <option value=${COLORMODE.COLOR}>Color</option>
                        </select>`;

    content.innerHTML+= `</div>`;

    content.innerHTML+= `<div><label>Color</label>`;
    for(let i=0;i<originalColor.length;i++) {
      
        const btnColor = `<input type="color" id="origin${i}" value="${setBtnColor(originalColor[i])}" onchange="getBtnColor(viewPalette,${i})">`
        content.innerHTML+= btnColor;
      
    }
    const refresh = `<button onclick="onRefreshview()">Refresh</button>`
    content.innerHTML+= refresh;
    content.innerHTML+= `</div>`;

    content.innerHTML+= `<div><label>Grayscale</label>`;
    for(let i=0;i<grayScaleValue.length;i++) {
      
        const btnColor = `<input type="color" id="origin${i}" value="${setBtnColor(grayScaleValue[i])}" onchange="getBtnColor(viewPalette,origin${i})">`
        content.innerHTML+= btnColor;
      
    }
    content.innerHTML+= `</div>`;



    let imageData;

    imageData  = generateImageDataWithPallete(matrixGS,num_rows,num_cols,grayScaleValue)
        
   
    const view16 = document.getElementById ('view16'); //get first canvas tag
    const view32 = document.getElementById ('view32'); //get first canvas tag
    const view64 = document.getElementById ('view64'); //get first canvas tag
    const c2Dview16 = view16.getContext('2d'); //get context to draw
    const c2Dview32 = view32.getContext('2d'); //get context to draw
    const c2Dview64 = view64.getContext('2d'); //get context to draw

    cleanFill(c2Dview16,"whitesmoke")
    cleanFill(c2Dview32,"whitesmoke")
    cleanFill(c2Dview64,"whitesmoke")
    c2Dview16.putImageData(imageData, 0,0);
    let scaledImage5 =scaleImageData(c2Dview16,imageData,5,5);
    c2Dview32.putImageData(scaledImage5,0,0);
    let scaledImage10 =scaleImageData(c2Dview16,imageData,10,10);
    c2Dview64.putImageData(scaledImage10,0,0);

    modal.classList.remove('hide');

   
}

function setupColorEditor(){

    const content = document.getElementById('content')
    const modal = document.getElementById('modal')
    const btnClose = `<button onclick="hideModal()">Close</button>`
    content.innerHTML = '<br/><br/>';
    content.innerHTML+= btnClose;
    content.innerHTML+= '<br/><br/>';
    let keys = Object.keys(colorValue)
    let line = ''
    for(let i=1;i<keys.length;i++) {
        const btnColor = `<input type="color" id="edit_color_${i}" value="${setBtnColor(colorValue[i])}" onchange="getMenuBtnColor(colorValue,${i})">`
        content.innerHTML+= btnColor;
       
    }
   
    for(let i=1;i<keys.length;i++) {
        cell = document.getElementById(`edit_color_${i}`)
        cell.style.backgroundColor = color[i];
    }

    modal.classList.remove('hide');

}

function hideModal(){
    const modal = document.getElementById('modal')
    modal.classList.add('hide');
    resetMenu();
    setupMenu();
    renderPixelGrid()
    renderMatrix(matrix,num_cols,num_rows)
}

function setBtnColor(color) {
    let rgb = [color[0],color[1],color[2]];
   
    
    let hex_color = '#'
    for(c in rgb) {
        let hex = rgb[c].toString(16);
        
        hex =  hex.length === 1 ? '0' + hex : hex;
        hex_color+=hex;
    }

    return hex_color;
}

function getMenuBtnColor(pallete,id) {
    hex_color = document.getElementById(`edit_color_${id}`).value
    pallete[id][0] = parseInt(hex_color.substring(1,3),16)
    pallete[id][1] = parseInt(hex_color.substring(3,5),16)
    pallete[id][2] = parseInt(hex_color.substring(5,7),16)
    pallete[id][3] = 255;
}

function getBtnColor(pallete,id) {
    hex_color = document.getElementById(`origin${id}`).value
    pallete[id][0] = parseInt(hex_color.substring(1,3),16)
    pallete[id][1] = parseInt(hex_color.substring(3,5),16)
    pallete[id][2] = parseInt(hex_color.substring(5,7),16)
    pallete[id][3] = 255;
}

function getBtnColor(pallete,id) {
    hex_color = document.getElementById(`origin${id}`).value
    pallete[id][0] = parseInt(hex_color.substring(1,3),16)
    pallete[id][1] = parseInt(hex_color.substring(3,5),16)
    pallete[id][2] = parseInt(hex_color.substring(5,7),16)
    pallete[id][3] = 255;
}

function onSelectColorMode(){
    viewStatus = parseInt(document.getElementById("selectColorMode").value);
    onRefreshview();
}

function onRefreshview(){
    let imageData;

    switch(viewStatus){
        case COLORMODE.GRAYSCALE:
            imageData  = generateImageDataWithPallete(matrixGS,num_rows,num_cols,grayScaleValue)
            break;
        case COLORMODE.COLOR:
            imageData  = generateImageDataWithPallete(matrixGS,num_rows,num_cols,viewPalette)
            break;
        default:
            imageData  = generateImageDataWithPallete(matrixGS,num_rows,num_cols,grayScaleValue)
            break;
    }
        
  
      const view16 = document.getElementById ('view16'); //get first canvas tag
    const view32 = document.getElementById ('view32'); //get first canvas tag
    const view64 = document.getElementById ('view64'); //get first canvas tag
    const c2Dview16 = view16.getContext('2d'); //get context to draw
    const c2Dview32 = view32.getContext('2d'); //get context to draw
    const c2Dview64 = view64.getContext('2d'); //get context to draw

    cleanFill(c2Dview16,"whitesmoke")
    cleanFill(c2Dview32,"whitesmoke")
    cleanFill(c2Dview64,"whitesmoke")
    c2Dview16.putImageData(imageData, 0,0);
    let scaledImage5 =scaleImageData(c2Dview16,imageData,5,5);
    c2Dview32.putImageData(scaledImage5,0,0);
    let scaledImage10 =scaleImageData(c2Dview16,imageData,10,10);
    c2Dview64.putImageData(scaledImage10,0,0);

}