const imageUpload = document.getElementById('imageUpload');
const imagePreview = document.getElementById('imagePreview');
const resizeButton = document.getElementById('resizeButton');
const downloadButton = document.getElementById('downloadButton');
const pencilButton = document.getElementById('pencilButton');
const resizePopup = document.getElementById('resizePopup');
const newWidthInput = document.getElementById('newWidth');
const newHeightInput = document.getElementById('newHeight');
const okButton = document.getElementById('okButton');
const cancelButton = document.getElementById('cancelButton');

let uploadedImage = null;
let imageRotation = 0;
let zoomLevel = 1;
let drawing = false;
let lastX = 0;
let lastY = 0;
const ctx = imagePreview.getContext('2d');

// ---- Initial blank canvas with transparent background ---- //
function initializeBlankCanvas() {
    imagePreview.width = 1920;
    imagePreview.height = 1080;
    ctx.clearRect(0, 0, imagePreview.width, imagePreview.height); // Clears any previous drawing
}

// ---- Draw uploaded image with transformations ---- //
function drawImageOnCanvas() {
    if (!uploadedImage) return;

    const width = imagePreview.width;
    const height = imagePreview.height;

    ctx.clearRect(0, 0, width, height);
    ctx.save();
    ctx.translate(width / 2, height / 2);
    ctx.rotate((imageRotation * Math.PI) / 180);
    ctx.scale(zoomLevel, zoomLevel);
    ctx.drawImage(uploadedImage, -uploadedImage.width / 2, -uploadedImage.height / 2);
    ctx.restore();
}

// ---- On window load ---- //
window.onload = () => {
    initializeBlankCanvas();
    window.addEventListener('resize', () => {
        if (uploadedImage) drawImageOnCanvas();
    });
};

// ---- When an image is uploaded ---- //
imageUpload.addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = () => {
            uploadedImage = new Image();
            uploadedImage.src = reader.result;
            uploadedImage.onload = () => {
                // Resize canvas to image resolution
                imagePreview.width = uploadedImage.width;
                imagePreview.height = uploadedImage.height;

                // Enable controls
                downloadButton.disabled = false;

                drawImageOnCanvas();
            };
        };
        reader.readAsDataURL(file);
    }
});

// ---- Resize Button Click ---- //
resizeButton.addEventListener('click', () => {
    // Show the resize popup with the current width and height values
    newWidthInput.value = imagePreview.width;
    newHeightInput.value = imagePreview.height;
    resizePopup.style.display = 'flex';
});

// ---- OK Button in Resize Popup ---- //
okButton.addEventListener('click', () => {
    const newWidth = parseInt(newWidthInput.value);
    const newHeight = parseInt(newHeightInput.value);

    // Only proceed with the update if both values are positive numbers
    if (newWidth > 0 && newHeight > 0) {
        const confirmation = confirm(`Are you sure you want to resize the image to ${newWidth}px by ${newHeight}px?`);
        if (confirmation) {
            // Save current canvas content
            const oldCanvas = document.createElement('canvas');
            oldCanvas.width = imagePreview.width;
            oldCanvas.height = imagePreview.height;
            const oldCtx = oldCanvas.getContext('2d');
            oldCtx.drawImage(imagePreview, 0, 0);

            // Resize and restore content
            imagePreview.width = newWidth;
            imagePreview.height = newHeight;
            ctx.drawImage(oldCanvas, 0, 0);

            resizePopup.style.display = 'none';
        }
    } else {
        alert("Please enter valid dimensions.");
    }
});

// ---- Cancel Button in Resize Popup ---- //
cancelButton.addEventListener('click', () => {
    resizePopup.style.display = 'none'; // Close the popup
});

// ---- Pencil Tool ---- //
pencilButton.addEventListener('click', () => {
    drawing = !drawing;
    pencilButton.textContent = drawing ? "Stop Drawing" : "Pencil Tool";
});

imagePreview.addEventListener('mousedown', (e) => {
    if (!drawing) return;
    
    // Get the exact position of the cursor relative to the canvas
    const rect = imagePreview.getBoundingClientRect();
    lastX = e.clientX - rect.left;
    lastY = e.clientY - rect.top;
    
    ctx.beginPath();
    ctx.moveTo(lastX, lastY);

    imagePreview.addEventListener('mousemove', draw);
});

imagePreview.addEventListener('mouseup', () => {
    imagePreview.removeEventListener('mousemove', draw);
});

function draw(e) {
    if (!drawing) return;

    // Get the new cursor position
    const rect = imagePreview.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Draw from the last position to the current position
    ctx.lineTo(x, y);
    ctx.stroke();

    // Update the last position
    lastX = x;
    lastY = y;
}

// ---- Download Button ---- //
downloadButton.addEventListener('click', () => {
    const selectedFileType = document.getElementById('fileTypeSelect').value; // Get selected file type
    
    // Ensure only PNG or JPEG is allowed
    if (selectedFileType !== 'image/png' && selectedFileType !== 'image/jpeg') {
        alert('Only PNG or JPEG formats are supported.');
        return;
    }

    // Backup the current canvas content (this includes any drawings)
    const originalCanvasData = ctx.getImageData(0, 0, imagePreview.width, imagePreview.height);

    // If JPEG is selected, fill the canvas with a white background
    if (selectedFileType === 'image/jpeg') {
        // Fill the entire canvas with a white background
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, imagePreview.width, imagePreview.height);
    }

    // Now draw the original content (drawing) on top of the white background (if JPEG)
    ctx.putImageData(originalCanvasData, 0, 0);

    // Generate the data URL for the canvas content based on the selected file type
    let dataUrl;
    
    if (selectedFileType === 'image/png') {
        dataUrl = imagePreview.toDataURL('image/png');
    } else if (selectedFileType === 'image/jpeg') {
        dataUrl = imagePreview.toDataURL('image/jpeg', 0.9); // Optional quality parameter for JPEG
    }

    // Create a link element to trigger the download
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = `canvas-image.${selectedFileType.split('/')[1]}`; // Use file extension based on selected type
    link.click();
});
