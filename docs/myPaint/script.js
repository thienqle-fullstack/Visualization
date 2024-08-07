// script.js
document.addEventListener("DOMContentLoaded", () => {
    const canvas = document.getElementById("drawCanvas");
    const ctx = canvas.getContext("2d");
    const exportBtn = document.getElementById("exportBtn");
    const bytecodeArea = document.getElementById("bytecode");
    const colorPicker = document.getElementById("colorPicker");
    const fillBtn = document.getElementById("fillBtn");
    const pasteBtn = document.getElementById("pasteBtn");
    const transparentBtn = document.getElementById("transparentBtn");

    let transparentMode = false;

    let isDrawing = false;
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    let drawingMode = 'draw'; // Variable to switch between draw and fill mode
    let startX, startY; // Start coordinates for flood fill

    // Set initial color
    let currentColor = colorPicker.value;
    ctx.strokeStyle = currentColor;
    ctx.lineWidth = 2; // Set initial line width

    transparentBtn.addEventListener("click", () => {
        transparentMode=!transparentMode;
        if(transparentMode) {
            transparentBtn.innerText = "Stop Transparent Mode";
            colorPicker.disabled = true;
        } else {
            transparentBtn.innerText = "Select Transparent Mode";
            colorPicker.disabled = false;
        }
    });

    // Update the brush color when the color picker changes
    colorPicker.addEventListener("input", (e) => {
        currentColor = e.target.value;
    });

    // Update drawing mode to 'fill'
    fillBtn.addEventListener("click", () => {
        drawingMode = 'fill';
        canvas.style.cursor = 'crosshair'; // Change cursor to indicate fill mode
    });


    function updateBoundingBox() {
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
    
        let minX = Infinity;
        let minY = Infinity;
        let maxX = -Infinity;
        let maxY = -Infinity;
    
        // Loop through all pixels to find the non-transparent bounds
        for (let y = 0; y < canvas.height; y++) {
            for (let x = 0; x < canvas.width; x++) {
                const index = (y * canvas.width + x) * 4;
                if (data[index + 3] > 0) { // Check if the pixel is not fully transparent
                    minX = Math.min(minX, x);
                    minY = Math.min(minY, y);
                    maxX = Math.max(maxX, x);
                    maxY = Math.max(maxY, y);
                }
            }
        }
    
        // Ensure the bounding box is valid
        if (minX === Infinity || minY === Infinity || maxX === -Infinity || maxY === -Infinity) {
            minX = 0;
            minY = 0;
            maxX = canvas.width;
            maxY = canvas.height;
        }
    
        return { minX, minY, maxX, maxY };
    }

    // Handle canvas mousedown event
    canvas.addEventListener("mousedown", (e) => {
        if (drawingMode === 'draw') {
            isDrawing = true;
            ctx.beginPath(); // Start a new path
            ctx.moveTo(e.offsetX, e.offsetY);

            // Initialize bounding box
            minX = e.offsetX;
            minY = e.offsetY;
            maxX = e.offsetX;
            maxY = e.offsetY;
        } else if (drawingMode === 'fill') {
            startX = e.offsetX;
            startY = e.offsetY;
            fillArea(startX, startY); // Perform the flood fill
            drawingMode = 'draw'; // Reset to draw mode
            canvas.style.cursor = 'auto'; // Reset cursor
        }
    });

    // Draw on canvas
    canvas.addEventListener("mousemove", (e) => {
        if (isDrawing) {
            ctx.strokeStyle = currentColor; // Use the current color for new strokes
            ctx.lineTo(e.offsetX, e.offsetY);
            ctx.stroke();

            // Update bounding box
            minX = Math.min(minX, e.offsetX);
            minY = Math.min(minY, e.offsetY);
            maxX = Math.max(maxX, e.offsetX);
            maxY = Math.max(maxY, e.offsetY);
        }
    });

    // Stop drawing
    canvas.addEventListener("mouseup", () => {
        if (isDrawing) {
            isDrawing = false;
        }
    });

    // Flood fill algorithm
    function fillArea(x, y) {
        
        const fillColor = hexToRgb(currentColor); // Convert hex color to RGB
        const startColor = getColorAt(x, y);
        if(transparentMode) fillColor[3] = 0;
        if (colorsMatch(fillColor, startColor)) return; // No fill needed if the colors are the same
        
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        const stack = [[x, y]];

        while (stack.length > 0) {
            const [cx, cy] = stack.pop();
            const index = (cy | 0) * canvas.width * 4 + (cx | 0) * 4;
            if (data[index] === startColor[0] && data[index + 1] === startColor[1] && data[index + 2] === startColor[2] && data[index + 3] === startColor[3]) {
                // Set color
                data[index] = fillColor[0];
                data[index + 1] = fillColor[1];
                data[index + 2] = fillColor[2];
                data[index + 3] = transparentMode ? 0 : 255;

                // Add neighbors to the stack
                stack.push([cx + 1, cy]);
                stack.push([cx - 1, cy]);
                stack.push([cx, cy + 1]);
                stack.push([cx, cy - 1]);
            }
        }

        ctx.putImageData(imageData, 0, 0);
    }

    // Convert hex color to RGB
    function hexToRgb(hex) {
        let r = 0, g = 0, b = 0;
        if (hex.length === 7) {
            r = parseInt(hex[1] + hex[2], 16);
            g = parseInt(hex[3] + hex[4], 16);
            b = parseInt(hex[5] + hex[6], 16);
        }
        return [r, g, b,255];
    }

    // Get color of a pixel at (x, y)
    function getColorAt(x, y) {
        const index = (y | 0) * canvas.width * 4 + (x | 0) * 4;
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
        console.log([imageData[index], imageData[index + 1], imageData[index + 2],imageData[index + 3]])
        return [imageData[index], imageData[index + 1], imageData[index + 2],imageData[index + 3]];
    }

    // Check if two colors match
    function colorsMatch(color1, color2) {
        return color1[0] === color2[0] && color1[1] === color2[1] && color1[2] === color2[2] && color1[3] === color2[3];
    }

    // Handle paste event with Clipboard API
    async function handlePaste(event) {
        const items = (event.clipboardData || event.originalEvent.clipboardData).items;
        for (let i = 0; i < items.length; i++) {
            const item = items[i];
            if (item.kind === 'file' && item.type.startsWith('image/')) {
                const file = item.getAsFile();
                const image = document.createElement('img');
                const reader = new FileReader();

                reader.onload = function(event) {
                    image.src = event.target.result;
                };

                image.onload = function() {
                    // Ensure the image is drawn before allowing any other operations
                    ctx.drawImage(image, 0, 0);
                    // Update the bounding box to include the newly pasted image
                    updateBoundingBox();
                };

                reader.readAsDataURL(file);
                return;
            }
        }
    }

    // Add paste event listener
    document.addEventListener('paste', handlePaste);

    // Handle paste button click
    pasteBtn.addEventListener("click", () => {
        // Prompt user to paste image into the canvas
        alert("Please paste an image into the canvas using Ctrl+V (Cmd+V on macOS).");
    });

    // Export the cropped drawing
    exportBtn.addEventListener("click", () => {
        const ctx = canvas.getContext("2d");
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;

        // Find the bounding box of non-transparent pixels
        let minX = canvas.width, minY = canvas.height, maxX = 0, maxY = 0;

        for (let y = 0; y < canvas.height; y++) {
            for (let x = 0; x < canvas.width; x++) {
                const index = (y * canvas.width + x) * 4;
                const alpha = data[index + 3];

                if (alpha > 0) { // Non-transparent pixel
                    if (x < minX) minX = x;
                    if (x > maxX) maxX = x;
                    if (y < minY) minY = y;
                    if (y > maxY) maxY = y;
                }
            }
        }

        // Adjust dimensions and cropping if necessary
        const width = maxX - minX + 1;
        const height = maxY - minY + 1;

        if (width <= 0 || height <= 0) {
            alert("No non-transparent content to export.");
            return;
        }

        // Create a new canvas for cropped image
        const croppedCanvas = document.createElement('canvas');
        croppedCanvas.width = width;
        croppedCanvas.height = height;
        const croppedCtx = croppedCanvas.getContext('2d');

        // Draw the cropped image
        croppedCtx.drawImage(
            canvas,
            minX, minY, width, height, // Source rectangle
            0, 0, width, height // Destination rectangle
        );

        // Export the cropped canvas content
        const dataURL = croppedCanvas.toDataURL("image/png");
        const link = document.createElement("a");
        // link.href = dataURL;
        // link.download = "cropped-drawing.png";
        // link.click();
        bytecodeArea.value = dataURL;
    
    });
});
