
let ratio = 1;
let src;
let img = addImage();

function addImage(){
  let img = document.createElement('img');
  img.classList.add('camera')
  img.width = "100px"
  img.height = "100px"
  document.body.appendChild(img);
  return img;
}

function startWebcam(event){
   
    const file = event.target.files[0];

      // Check if file is a video
      if (file && file.type.includes('image/')) {
        // img.classList.add('hide');
        // canvas.classList.remove('hide');
        const videoURL =  (window.URL || window.webkitURL || window || {}).createObjectURL(file);
        if (videoURL!==null) {

            var xhr = new XMLHttpRequest();
            xhr.open('GET', videoURL, true);
            xhr.responseType = 'blob';
            xhr.onreadystatechange = function() {
                if (xhr.readyState === 4 && xhr.status == 200) {
                    var url = (window.URL || window.webkitURL || window || {}).createObjectURL(xhr.response);

                    img.src = url;
            
                    img.onload = function() {
                      src = cv.imread(img)
                    }
                }
            };
            xhr.send();

           
          } else {
            alert('Failed to create object URL for the video file.');
          }
        } else {
          console.error('Selected file is not a image.');
        }
        
      }

  function startImageViewer(event){
   
        const file = event.target.files[0];
    
          // Check if file is a video
          if (file && file.type.includes('image/')) {
            // img.classList.add('hide');
            // canvas.classList.remove('hide');
            const videoURL =  (window.URL || window.webkitURL || window || {}).createObjectURL(file);
            if (videoURL!==null) {
    
              var reader = new FileReader();
              reader.onload = function(event) {

                img.src = event.target.result;
                img.onload = function() {
                  src = cv.imread(img)
                }
              };
              reader.readAsDataURL(file);
    
               
              } else {
                alert('Failed to create object URL for the video file.');
              }
            } else {
              console.error('Selected file is not a image.');
            }
            
          }
    

function processImage(){

    // let src = cv.imread(img);
    img.remove();
    img = addImage();
    switch(filter) {
       
        case FILTERSTYLE.NOTE: 
        scan(src)
        break;
        case FILTERSTYLE.NOTE2: 
        note(src)
        break;
    }

    // requestAnimationFrame(processVideo);
}


function note(data){
  let edited = new cv.Mat(data.rows,data.cols, cv.CV_8UC4);


  //Make Light backgroudn black
  edited = cleanBlackBoard(data)

  //TO GRAY SCALE
  cv.cvtColor(edited,edited, cv.COLOR_RGBA2GRAY)

  //THEN SWAP CHANGE TO LIGHT MODE
  cv.bitwise_not(edited,edited);

  // edited = cleanWhiteBoard(edited);


  let canvas = document.createElement('canvas');
  cv.imshow(canvas, edited);
  let base64data= canvas.toDataURL()
  img.src = base64data;
  
  edited.delete();
  canvas.remove();

}

function cleanWhiteBoard(data) {

  const edited = new cv.Mat(data.rows,data.cols, cv.CV_8UC1);
  console.log(data.rows,data.cols)
  console.log(data)
  for (let y = 0; y < data.rows; y++) {
    for (let x = 0; x < data.cols; x++) {
        let pixelValue = data.ucharPtr(y, x)[0]; // Grayscale value at (x, y)
        if(pixelValue >= 250) {
          edited.ucharPtr(y, x)[0] = 133;
        } else {
          edited.ucharPtr(y, x)[0] = pixelValue;
        }
    }
  }
  return edited;

}

function cleanBlackBoard(data) {

    const edited = new cv.Mat(data.rows,data.cols, cv.CV_8UC4);
  
    for (let i = 0; i < data.rows; i++) {
             for (let j = 0; j < data.cols; j++) {
  
  
               let red = data.ucharPtr(i, j)[0]
               let green = data.ucharPtr(i, j)[1]
               let blue = data.ucharPtr(i, j)[2]
               let color = [red,green,blue]
             
               if ((red + green + blue) / 3 <= 50) {
                   
                   color[0] = 0; 
                   color[1] = 0;
                   color[2] = 0; 
               } 
               
  
               edited.ucharPtr(i, j)[0] = color[0];
               edited.ucharPtr(i, j)[1] = color[1];
               edited.ucharPtr(i, j)[2] = color[2];
               edited.ucharPtr(i, j)[3] = 255;
  
             }
         }
         return edited;
}

function processImageTest(data) {
  // Read the image from the canvas
  let src = data;
  let dst = new cv.Mat();
  let gray = new cv.Mat();
  let white = new cv.Mat.zeros(src.rows, src.cols, cv.CV_8UC3);
  
  // Convert to grayscale
  cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY);

  // Apply a threshold to get light areas
  let threshValue = 200; // Adjust this value as needed
  let binary = new cv.Mat();
  cv.threshold(gray, binary, threshValue, 255, cv.THRESH_BINARY);

  // Convert the binary mask to a 3-channel image
  let mask = new cv.Mat();
  cv.cvtColor(binary, mask, cv.COLOR_GRAY2RGB);

  // Set the detected light areas to white
  let whiteMask = new cv.Mat();
  cv.bitwise_and(src, white, whiteMask, mask);

  let canvas = document.createElement('canvas');
  cv.imshow(canvas, whiteMask);
  let base64data= canvas.toDataURL()
  img.src = base64data;

  // Clean up
  src.delete();
  gray.delete();
  binary.delete();
  mask.delete();
  whiteMask.delete();
}


function scan(data) {

  let canvas = document.createElement('canvas');
    const src = data;
    const edited = new cv.Mat();

    let ksize = new cv.Size(3,3);
    let sigmaX = 0;
    let sigmaY = 0;
    cv.GaussianBlur(src, edited, ksize, sigmaX, sigmaY, cv.BORDER_DEFAULT);

    cv.cvtColor(edited, edited, cv.COLOR_RGBA2GRAY, 0);
    
    const thresholds = 5;
    const aperture = 200;
    cv.Canny(edited,edited,thresholds,aperture)


    // Find contours
    let contours = new cv.MatVector();
    let hierarchy = new cv.Mat();
    cv.findContours(edited, contours, hierarchy, cv.RETR_EXTERNAL, cv.CHAIN_APPROX_SIMPLE);
    cv.cvtColor(edited, edited, cv.COLOR_GRAY2RGB, 0);
    
    //src to display original
    findMaxContour(contours,src,edited,canvas)
    cv.imshow(canvas, src);



    //cv.imshow(canvas, src);
    let base64data= canvas.toDataURL()
    img.src = base64data;
    edited.delete();
    canvas.remove();
}

function findMaxContour(contours,src,edited,canvas){
  let maxArea = -1;
  let maxAreaContourIndex = -1;
 
  // Iterate through contours
  for (let i = 0; i < contours.size(); ++i) {
      let contour = contours.get(i);

      // Approximate contour with polygon
      let epsilon = 0.04 * cv.arcLength(contour, true);
      let approx = new cv.Mat();
      cv.approxPolyDP(contour, approx, epsilon, true);

      console.log(approx.rows)
      // If polygon has 4 corners, draw contour
      if (approx.rows === 4 && cv.isContourConvex(approx)) {
         
          let area = cv.contourArea(contour);
          if (area > maxArea) {
            maxArea = area;
            maxAreaContourIndex = i;
          }
      }
  

      approx.delete(); // Clean up memory
  }
  if(maxAreaContourIndex===-1) {
      alert("No scan document found!")
      return;
  }
  if(contours && contours.size()>0 && maxAreaContourIndex !== -1) {
      let contourColor = new cv.Scalar(255, 0, 255, 255); // Blue color

      cv.drawContours(edited, contours, maxAreaContourIndex, contourColor, 2);

      const mainContour = contours.get(maxAreaContourIndex)

      let epslon = 0.04 * cv.arcLength(mainContour, true);
      let approx_maincontour = new cv.Mat();
      cv.approxPolyDP(mainContour, approx_maincontour, epslon, true);

      if (approx_maincontour.rows === 4) {
          // Extract the coordinates of the four corners
          let corners = [];
          for (let i = 0; i < approx_maincontour.rows; i++) {
          let x = approx_maincontour.data32S[i * 2];
          let y = approx_maincontour.data32S[i * 2 + 1];
          corners.push({ x: x, y: y });
          }
      
          corners.sort((a, b) => a.x - b.x);
      
          let topleftCorner = corners[0].y < corners[1].y ? corners[0] : corners[1];
          let bottomrightCorner = corners[2].y < corners[3].y ? corners[3] : corners[2];

          let bottomleftCorner = corners[0].y < corners[1].y ? corners[1] : corners[0];
          let toprightCorner = corners[2].y < corners[3].y ? corners[2] : corners[3];
          // cv.putText(src, `(${topleftCorner.x},${topleftCorner.y})`, new cv.Point(topleftCorner.x,topleftCorner.y), cv.FONT_HERSHEY_SIMPLEX, 0.5, new cv.Scalar(255, 0, 0, 255), 1);
          // cv.putText(src, `(${bottomrightCorner.x},${bottomrightCorner.y})`, new cv.Point(bottomrightCorner.x,bottomrightCorner.y), cv.FONT_HERSHEY_SIMPLEX, 0.5, new cv.Scalar(0, 255, 0, 255), 1);
          // cv.putText(src, `(${toprightCorner.x},${toprightCorner.y})`, new cv.Point(toprightCorner.x,toprightCorner.y), cv.FONT_HERSHEY_SIMPLEX, 0.5, new cv.Scalar(0, 0, 255, 255), 1);
          // cv.putText(src, `(${bottomleftCorner.x},${bottomleftCorner.y})`, new cv.Point(bottomleftCorner.x,bottomleftCorner.y), cv.FONT_HERSHEY_SIMPLEX, 0.5, new cv.Scalar(255, 255, 0, 255), 1);
          cv.imshow(canvas, src);
          warpPerspective(topleftCorner,bottomrightCorner,toprightCorner,bottomleftCorner,src,edited,canvas);
      }
  }
}

function warpPerspective(topleftCorner,bottomrightCorner,toprightCorner,bottomleftCorner,src,edited,canvas){
  
  let X = [topleftCorner.x,bottomleftCorner.x,toprightCorner.x,bottomrightCorner.x]
  let Y = [topleftCorner.y,bottomleftCorner.y,toprightCorner.y,bottomrightCorner.y]

  let width = Math.max(...X) - Math.min(...X); 
  let height = Math.max(...Y) - Math.min(...Y);

  console.log(width,height)

  // Define the destination points for the perspective transformation (rectangle)

  let destinationPoints = [
      0, 0,
      width - 1, height - 1,
      width - 1, 0,
      0, height - 1
  ];

  let sourcePoints = [
      topleftCorner.x, topleftCorner.y,
      bottomrightCorner.x, bottomrightCorner.y,
      toprightCorner.x, toprightCorner.y,
      bottomleftCorner.x, bottomleftCorner.y
   ];

  let sourcePointsArray = cv.matFromArray(4, 1, cv.CV_32FC2, sourcePoints);
  let destinationPointsArray = cv.matFromArray(4, 1, cv.CV_32FC2, destinationPoints);

  let matrix = cv.getPerspectiveTransform(sourcePointsArray, destinationPointsArray);

  let warpedImage = new cv.Mat();
  cv.warpPerspective(src, warpedImage, matrix, new cv.Size(width, height))

  cv.imshow(canvas, warpedImage);

  warpedImage.delete();
}
