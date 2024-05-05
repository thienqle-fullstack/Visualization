let FILTERSTYLE = {
    EARTH: 0,
    EARTHLIKE: 1,
    ALIEN: 2
}
let filter = 0

// document.getElementById('btnPlay').addEventListener('click', function() {
//     startWebcam();
// });

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
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

document.getElementById('download').addEventListener('click', function() {
    let canvas1 = document.createElement('canvas');
    cv.imshow(canvas1, src);

    let dataURL = canvas1.toDataURL('image/png'); 
    link.href = dataURL;
    link.download = 'united.png';
});

document.getElementById('imageCaptureInput').addEventListener('change', startWebcam);
document.getElementById('imageCaptureInput').addEventListener('click', (event) => {
    // img.classList.remove('hide');
    // canvas.classList.add('hide');
});
