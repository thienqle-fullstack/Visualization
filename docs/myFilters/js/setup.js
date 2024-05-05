
let ratio = 1;
let src;

function startWebcam(event){
   


    const file = event.target.files[0];

      // Check if file is a video
      if (file && file.type.includes('image/')) {
        img.classList.add('hide');
        canvas.classList.remove('hide');
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
                      // var widthToHeight = img.width / img.height;
                      // var canvasWidthToHeight = canvas.width / canvas.height;

                      //   if (widthToHeight > canvasWidthToHeight) {
                      //     canvas.height = canvas.width / widthToHeight;
                      //   } else {
                      //     canvas.width = canvas.height * widthToHeight;
                      //   }
                      // canvas.width = img.width;
                      // canvas.height = img.height;
                      // src = cv.imread(img)
                      ctx.drawImage(img, 0, 0);
                      // cv.imshow('canvas',src)
                      src = new cv.Mat(canvas.height, canvas.width, cv.CV_8UC4); 
                       src.data.set(ctx.getImageData(0, 0, canvas.width, canvas.height).data);
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
    }

    // requestAnimationFrame(processVideo);
}

function swapcolor(src){
     const edited = new cv.Mat(src.rows,src.cols, cv.CV_8UC4);

    for (let i = 0; i < src.rows; i++) {
                for (let j = 0; j < src.cols; j++) {


                    edited.ucharPtr(i, j)[0] = src.ucharPtr(i, j)[1];
                    edited.ucharPtr(i, j)[1] = src.ucharPtr(i, j)[0];
                    edited.ucharPtr(i, j)[2] = src.ucharPtr(i, j)[2];
                    edited.ucharPtr(i, j)[3] = 255;

                }
            }
            
    cv.imshow('canvas', edited);
    edited.delete();

}

function swapcolor1(src){
    const edited = new cv.Mat(src.rows,src.cols, cv.CV_8UC4);

  for (let i = 0; i < src.rows; i++) {
              for (let j = 0; j < src.cols; j++) {


                let red = src.ucharPtr(i, j)[0]
                let green = src.ucharPtr(i, j)[1]
                let blue = src.ucharPtr(i, j)[2]
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
          
  cv.imshow('canvas', edited);
  edited.delete();

}

function originalColor(src){
  cv.imshow('canvas', src);
}