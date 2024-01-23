const canvas = document.getElementById ('myCanvas'); //get first canvas tag
const c2D = canvas.getContext('2d'); //get context to draw

function clean(context){
    context.setTransform(1, 0, 0, 1, 0, 0);
    context.clearRect(0, 0, canvas.width, canvas.height);
}

function cleanFill(context,bgcolor){
    context.setTransform(1, 0, 0, 1, 0, 0);
    context.fillStyle =bgcolor;
    context.fillRect(0, 0, canvas.width, canvas.height);
}

function generateImageData(matrix,num_cols,num_rows){
    const imageData  = c2D.createImageData(num_rows,num_cols)
    
    for(let r=0;r<num_rows;r++) {
        for(let c=0;c<num_cols;c++) {
            const i = (c+ r*num_cols)*4;
            let  colorCode = colorValue[matrix[r][c]];
              
                imageData.data[i + 0] = colorCode[0];    // R value
                imageData.data[i + 1] = colorCode[1];  // G value
                imageData.data[i + 2] = colorCode[2];    // B value
                imageData.data[i + 3] = colorCode[3];  // A value               
          
            
        }      
    }
    return imageData;
}


function renderMatrix(matrix,num_cols,num_rows){
    
      const imageData  = generateImageData(matrix,num_rows,num_cols)
   

      cleanFill(c2D,"whitesmoke")
      c2D.putImageData(imageData, 0,0);
      let scaledImage5 =scaleImageData(c2D,imageData,5,5);
      c2D.putImageData(scaledImage5,num_cols+1,0);
      let scaledImage10 =scaleImageData(c2D,imageData,10,10);
      c2D.putImageData(scaledImage10,num_cols*6+1,0);

}


function scaleImageData(context,imageData, scaleX, scaleY) {
    const newWidth = Math.floor(imageData.width * scaleX);
    const newHeight = Math.floor(imageData.height * scaleY);
    const scaledData = context.createImageData(newWidth, newHeight);

    for (let y = 0; y < newHeight; y++) {
      for (let x = 0; x < newWidth; x++) {
        const sourceX = Math.floor(x / scaleX);
        const sourceY = Math.floor(y / scaleY);

        const sourceIndex = (sourceY * imageData.width + sourceX) * 4;
        const destIndex = (y * newWidth + x) * 4;

        // Copy RGBA values
        for (let i = 0; i < 4; i++) {
          scaledData.data[destIndex + i] = imageData.data[sourceIndex + i];
        }
      }
    }

    return scaledData;
}

function generateSVG(width,height){
    const imageData  = generateImageData(matrix,width,height);
    var svg = '<svg xmlns="http://www.w3.org/2000/svg" width="' + width + '" height="' + height + '">';
    svg += '<image x="0" y="0" width="' + width + '" height="' + height + '"';

    // Loop through pixel data and create SVG rectangles
    for (var y = 0; y < height; y++) {
        for (var x = 0; x < width; x++) {
            var index = (y * width + x) * 4;
            var rgba = imageData.data.slice(index, index + 4);
            var color = 'rgb(' + rgba[0] + ',' + rgba[1] + ',' + rgba[2] + ')';
            svg += '<rect x="' + x + '" y="' + y + '" width="1" height="1" fill="' + color + '"/>';
        }
    }

    // Add image data to SVG
    // svg += ' xlink:href="' + dataUrl + '"/>';
    svg += '</svg>';
    return svg;
}

function generateSVGBase64Encode(width,height,scale){
    let whiteBgMatrix = whiteBackground();
    let imageData  = generateImageData(whiteBgMatrix,width,height);
    imageData =scaleImageData(c2D,imageData,scale,scale);
    width = width * scale;
    height = height * scale;

    var svg = '<svg xmlns="http://www.w3.org/2000/svg" width="' + width + '" height="' + height + '">';
    svg += '<image x="0" y="0" width="' + width + '" height="' + height + '"';

    // Draw the region to a temp canvas
    var tempCanvas = document.createElement('canvas');
    var tempCtx = tempCanvas.getContext('2d');

    tempCanvas.width = width;
    tempCanvas.height = height;
    tempCtx.putImageData(imageData,0,0)
    tempCtx.drawImage(tempCanvas, 0, 0, width, height, 0, 0, width, height);

    // Convert the region to base64-encoded PNG
    var dataUrl = tempCanvas.toDataURL("image/png");

    // Add image data to SVG
    svg += ' xlink:href="' + dataUrl + '"/>';
    svg += '</svg>';
    return svg;
}

function whiteBackground(){
    const whiteBgMatrix = []
    for(let r=0;r<num_rows;r++) {
        row = []
        for(let c=0;c<num_cols;c++) {
            if(matrix[r][c]==0) {
                row.push(1)
            } else {
                row.push(matrix[r][c])
            }
            
        }
        whiteBgMatrix.push(row)
    }
    return whiteBgMatrix
}


function generateBase64Encode(width,height,scale){
    let whiteBgMatrix = whiteBackground();
    let imageData  = generateImageData(whiteBgMatrix,width,height);
    imageData =scaleImageData(c2D,imageData,scale,scale);
    width = width * scale;
    height = height * scale;

 
    // Draw the region to a temp canvas
    var tempCanvas = document.createElement('canvas');
    var tempCtx = tempCanvas.getContext('2d');

    tempCanvas.width = width;
    tempCanvas.height = height;
    tempCtx.putImageData(imageData,0,0)
    tempCtx.drawImage(tempCanvas, 0, 0, width, height, 0, 0, width, height);

    // Convert the region to base64-encoded PNG
    var dataUrl = tempCanvas.toDataURL("image/png");

    return `<img src="${dataUrl}"/>`;
}

function bresenhams_line(startX,startY,endX,endY){
    const dX = Math.abs(endX - startX)
    const dY = Math.abs(endY - startY)
    const sX = startX < endX ? 1 : -1; 
    const sY = startY < endY ? 1 : -1; 

    let err = dX - dY;

    let x = startX;
    let y = startY;

    line = []
    while(true) {
        line.push([x,y])

        if(x===endX && y===endY) {
            return line; //end condition
        }

        const err_double = 2*err;
        if(err_double > -dY) {
            err -= dY;
            x+=sX
        }
        if(err_double < dX) {
            err += dX;
            y+=sY;
        }
    }
}


function bresenhams_circle(centerX,centerY,radius){

    let x = radius;
    let y = 0;
    let err = 0;

    curve = []
    while(x>=y) {
        
       
            curve.push([centerX+x,centerY + y]);
            curve.push([centerX+y,centerY + x]);
            
            curve.push([centerX-x,centerY + y]);
            curve.push([centerX-y,centerY + x]);
            
            curve.push([centerX-x,centerY - y]);
            curve.push([centerX-y,centerY - x]);
        
            curve.push([centerX+x,centerY - y]);
            curve.push([centerX+y,centerY - x]);
        
        if(err <=0 ) {
            y+=1;
            err+=2*y+1;
        }
        if(err > 0) {
            x-=1
            err-=2*x+1;
        }
    }
    return curve;
}

function floodfill(x,y,width,height,fillcolor,bground){
    
    if(fillcolor==bground) return;
 
    if(x < 0|| y < 0) return;
    if(x > width || y > height) return;

    if(matrix[y][x]!=bground) return;
    
    matrix[y][x] = fillcolor;


    if (x-1>=0) floodfill(x-1,y,width,height,fillcolor,bground)
    if (x+1<=width) floodfill(x+1,y,width,height,fillcolor,bground)
    if (y-1 >=0 ) floodfill(x,y-1,width,height,fillcolor,bground)
    if (y+1<=height) floodfill(x,y+1,width,height,fillcolor,bground)
}

function square(startY,startX,endY,endX){
    let top = 0;
    let left = 0;
    let bottom = 0;
    let right = 0;

    left = startX >= endX ? endX : startX;
    right = startX >= endX ? startX : endX;
    top = startY >= endY ? endY : startY;
    bottom = startY >= endY ? startY : endY ;

    edges = []

    for(let i = top; i<=bottom; i++) {
        edges.push([i,left])
        edges.push([i,right])
    }
    for(let i = left; i<=right; i++) {
        edges.push([top,i])
        edges.push([bottom,i])
    }
    return edges;
}