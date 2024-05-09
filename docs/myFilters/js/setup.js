
let ratio = 1;
let src;

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

    switch(filter) {
        case FILTERSTYLE.EARTH: 
            originalColor(src)
        break;
        case FILTERSTYLE.ALIEN: 
          swapcolor(src)
        break;
        case FILTERSTYLE.EARTHLIKE: 
          swapcolor1(src)
        break;
        case FILTERSTYLE.BLUE: 
          swapcolorBlue(src)
        break;
        case FILTERSTYLE.YELLOW: 
          swapcolorYellow(src)
        break;
        case FILTERSTYLE.MANGA: 
          manga(src)
        break;
    }

    // requestAnimationFrame(processVideo);
}

function swapcolor(data){
     const edited = new cv.Mat(data.rows,data.cols, cv.CV_8UC4);

    for (let i = 0; i <data.rows; i++) {
                for (let j = 0; j < data.cols; j++) {


                    edited.ucharPtr(i, j)[0] = data.ucharPtr(i, j)[1];
                    edited.ucharPtr(i, j)[1] = data.ucharPtr(i, j)[0];
                    edited.ucharPtr(i, j)[2] = data.ucharPtr(i, j)[2];
                    edited.ucharPtr(i, j)[3] = 255;

                }
            }
            
    // cv.imshow('canvas', edited);
    let canvas1 = document.createElement('canvas');
    cv.imshow(canvas1, edited);
    let base64data= canvas1.toDataURL()
    img.src = base64data;

    edited.delete();
    canvas1.remove();
}

function swapcolor1(data){
    const edited = new cv.Mat(data.rows,data.cols, cv.CV_8UC4);

  for (let i = 0; i < data.rows; i++) {
              for (let j = 0; j < data.cols; j++) {


                let red = data.ucharPtr(i, j)[0]
                let green = data.ucharPtr(i, j)[1]
                let blue = data.ucharPtr(i, j)[2]
                let color = [red,green,blue]
              
                if (red > green && red > blue) {
                    
                    // Change red to green
                    color[0] = green; 
                    color[1] = red;
                    color[2] = blue; 
                } 

                edited.ucharPtr(i, j)[0] = color[0];
                edited.ucharPtr(i, j)[1] = color[1];
                edited.ucharPtr(i, j)[2] = color[2];
                edited.ucharPtr(i, j)[3] = 255;

              }
          }
          
          let canvas1 = document.createElement('canvas');
          cv.imshow(canvas1, edited);
          let base64data= canvas1.toDataURL()
          img.src = base64data;
        edited.delete();
        canvas1.remove();
}

function swapcolorBlue(data){
     const edited = new cv.Mat(data.rows,data.cols, cv.CV_8UC4);

  for (let i = 0; i < data.rows; i++) {
              for (let j = 0; j < data.cols; j++) {


                let red = data.ucharPtr(i, j)[0]
                let green = data.ucharPtr(i, j)[1]
                let blue = data.ucharPtr(i, j)[2]
                let color = [red,green,blue]
              
                if (red > green && red > blue) {
                    
                    // Change red to green
                    color[0] = blue; 
                    color[1] = green;
                    color[2] = red; 
                } 
                if (green > red && green > blue) {
                    
                  // Change red to green
                  color[0] = red; 
                  color[1] = blue;
                  color[2] = green; 
              } 

                edited.ucharPtr(i, j)[0] = color[0];
                edited.ucharPtr(i, j)[1] = color[1];
                edited.ucharPtr(i, j)[2] = color[2];
                edited.ucharPtr(i, j)[3] = 255;

              }
          }
          
          let canvas1 = document.createElement('canvas');
          cv.imshow(canvas1, edited);
          let base64data= canvas1.toDataURL()
          img.src = base64data;
        edited.delete();
        canvas1.remove();
}

function swapcolorYellow(data){
  const edited = new cv.Mat(data.rows,data.cols, cv.CV_8UC4);

for (let i = 0; i < data.rows; i++) {
           for (let j = 0; j < data.cols; j++) {


             let red = data.ucharPtr(i, j)[0]
             let green = data.ucharPtr(i, j)[1]
             let blue = data.ucharPtr(i, j)[2]
             let color = [red,green,blue]
           
             if (red > green && red > blue) {
                 
                 // Change red to green
                 color[0] = red; 
                 color[1] = red;
                 color[2] = blue; 
             } 
             if (green > red && green > blue) {
                 
               // Change red to green
               color[0] = green; 
               color[1] = green;
               color[2] = blue; 
           } 

             edited.ucharPtr(i, j)[0] = color[0];
             edited.ucharPtr(i, j)[1] = color[1];
             edited.ucharPtr(i, j)[2] = color[2];
             edited.ucharPtr(i, j)[3] = 255;

           }
       }
       
       let canvas1 = document.createElement('canvas');
       cv.imshow(canvas1, edited);
       let base64data= canvas1.toDataURL()
       img.src = base64data;
     edited.delete();
     canvas1.remove();
}

function originalColor(data){
  const edited = new cv.Mat(data.rows,data.cols, cv.CV_8UC4);

  for (let i = 0; i < data.rows; i++) {
              for (let j = 0; j < data.cols; j++) {


                let red = data.ucharPtr(i, j)[0]
                let green = data.ucharPtr(i, j)[1]
                let blue = data.ucharPtr(i, j)[2]
                let color = [red,green,blue]
              
                edited.ucharPtr(i, j)[0] = color[0];
                edited.ucharPtr(i, j)[1] = color[1];
                edited.ucharPtr(i, j)[2] = color[2];
                edited.ucharPtr(i, j)[3] = 255;

              }
          }
          
          let canvas1 = document.createElement('canvas');
          cv.imshow(canvas1, edited);
          let base64data= canvas1.toDataURL()
          img.src = base64data;
        edited.delete();
        canvas1.remove();
}

function manga(data){
  const edited = new cv.Mat(data.rows,data.cols, cv.CV_8UC4);

  const thresholds =5;
  const aperture = 130;
  cv.Canny(data,edited,thresholds,aperture)
  cv.bitwise_not(edited,edited);

  let canvas = document.createElement('canvas');
  cv.imshow(canvas, edited);
  let base64data= canvas.toDataURL()
  img.src = base64data;
  
  edited.delete();
  canvas.remove();

}