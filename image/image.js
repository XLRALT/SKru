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

// ---- Initialize blank canvas with transparent background ---- //
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

    ctx.clearRect(0, 0, width, height); // Clear previous image
    ctx.save();
    ctx.translate(width / 2, height / 2);
    ctx.rotate(imageRotation * Math.PI / 180);
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
    newWidthInput.value = imagePreview.width;
    newHeightInput.value = imagePreview.height;
    resizePopup.style.display = 'flex';
});

// ---- OK Button in Resize Popup ---- //
okButton.addEventListener('click', () => {
    const newWidth = parseInt(newWidthInput.value);
    const newHeight = parseInt(newHeightInput.value);

    if (newWidth > 0 && newHeight > 0) {
        const confirmation = confirm(`Resize to ${newWidth}px by ${newHeight}px?`);
        if (confirmation) {
            // Create a temporary canvas to store the image data
            const oldCanvas = document.createElement('canvas');
            oldCanvas.width = imagePreview.width;
            oldCanvas.height = imagePreview.height;
            const oldCtx = oldCanvas.getContext('2d');
            oldCtx.drawImage(imagePreview, 0, 0);

            // Resize canvas and restore image data
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

// ---- Handle mouse events for drawing ---- //
function startDrawing(e) {
    if (!drawing) return;

    const mousePos = getMousePosition(e);
    lastX = mousePos.x;
    lastY = mousePos.y;

    ctx.beginPath();
    ctx.moveTo(lastX, lastY);

    imagePreview.addEventListener('mousemove', draw);
}

function stopDrawing() {
    imagePreview.removeEventListener('mousemove', draw);
}

function draw(e) {
    if (!drawing) return;

    const mousePos = getMousePosition(e);

    ctx.lineTo(mousePos.x, mousePos.y);
    ctx.stroke();

    lastX = mousePos.x;
    lastY = mousePos.y;
}

function getMousePosition(e) {
    const rect = imagePreview.getBoundingClientRect();
    const scaleX = imagePreview.width / rect.width;
    const scaleY = imagePreview.height / rect.height;

    const mouseX = (e.clientX - rect.left) * scaleX;
    const mouseY = (e.clientY - rect.top) * scaleY;

    // Apply inverse rotation and scaling
    const angle = -imageRotation * Math.PI / 180;
    const cosAngle = Math.cos(angle);
    const sinAngle = Math.sin(angle);

    const finalX = (mouseX - imagePreview.width / 2) / zoomLevel;
    const finalY = (mouseY - imagePreview.height / 2) / zoomLevel;

    const rotatedX = finalX * cosAngle - finalY * sinAngle;
    const rotatedY = finalX * sinAngle + finalY * cosAngle;

    return {
        x: rotatedX * zoomLevel + imagePreview.width / 2,
        y: rotatedY * zoomLevel + imagePreview.height / 2
    };
}

// ---- Mouse Down Event for Drawing ---- //
imagePreview.addEventListener('mousedown', startDrawing);

// ---- Mouse Up Event for Drawing ---- //
imagePreview.addEventListener('mouseup', stopDrawing);

// ---- Download Button ---- //
downloadButton.addEventListener('click', () => {
    const selectedFileType = document.getElementById('fileTypeSelect').value;

    if (!['image/png', 'image/jpeg'].includes(selectedFileType)) {
        alert('Only PNG or JPEG formats are supported.');
        return;
    }

    // Backup canvas content
    const originalCanvasData = ctx.getImageData(0, 0, imagePreview.width, imagePreview.height);

    if (selectedFileType === 'image/jpeg') {
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, imagePreview.width, imagePreview.height); // Fill background
    }

    ctx.putImageData(originalCanvasData, 0, 0);

    const dataUrl = imagePreview.toDataURL(selectedFileType, selectedFileType === 'image/jpeg' ? 0.9 : 1);
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = `canvas-image.${selectedFileType.split('/')[1]}`;
    link.click();
});
