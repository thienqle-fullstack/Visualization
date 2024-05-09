let FILTERSTYLE = {
    EARTH: 0,
    EARTHLIKE: 1,
    ALIEN: 2,
    BLUE: 3,
    YELLOW: 4,
    MANGA: 5
}
let filter = 0

// document.getElementById('btnPlay').addEventListener('click', function() {
//     startWebcam();
// });

const img = document.getElementById('imageInput');
const link= document.getElementById('download');

document.getElementById('btnSwapColor').addEventListener('click', function() {
    filter = FILTERSTYLE.ALIEN; 
    processImage()
});

document.getElementById('btnOriginalColor').addEventListener('click', function() {
    filter = FILTERSTYLE.EARTH; 
    processImage()
});

document.getElementById('btnSwapColor1').addEventListener('click', function() {
    filter = FILTERSTYLE.EARTHLIKE; 
    processImage()
});

document.getElementById('btnSwapColorBlue').addEventListener('click', function() {
    filter = FILTERSTYLE.BLUE; 
    processImage()
});

document.getElementById('btnSwapColorYellow').addEventListener('click', function() {
    filter = FILTERSTYLE.YELLOW; 
    processImage()
});

document.getElementById('btnManga').addEventListener('click', function() {
    filter = FILTERSTYLE.MANGA; 
    processImage()
});

document.getElementById('download').addEventListener('click', function() {
    let canvas1 = document.createElement('canvas');
    cv.imshow(canvas1, src);

    let dataURL = canvas1.toDataURL('image/png'); 
    link.href = dataURL;
    let filename = prompt("Enter the file name", `united${(new Date()).getTime().toString()}`);
    if(!filename) return
    link.download = `${filename}.png`;
    canvas1.remove()
});

document.getElementById('imageCaptureInput').addEventListener('change', startWebcam);
document.getElementById('imageUploadInput').addEventListener('change', startImageViewer);