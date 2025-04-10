// Get DOM elements
const imageUpload = document.getElementById('imageUpload');
const imagePreview = document.getElementById('imagePreview');
const resizeWidth = document.getElementById('resizeWidth');
const resizeHeight = document.getElementById('resizeHeight');
const rotateSlider = document.getElementById('rotate');
const zoomSlider = document.getElementById('zoom');
const downloadButton = document.getElementById('downloadButton');
const pencilButton = document.getElementById('pencilButton');

// Set initial variables
let uploadedImage = null;
let imageRotation = 0;
let zoomLevel = 1;
let drawing = false;
let lastX = 0;
let lastY = 0;
const ctx = imagePreview.getContext('2d');
const canvasWidth = imagePreview.width;
const canvasHeight = imagePreview.height;

// Initialize a transparent 1920x1080 canvas on page load
function createTransparentCanvas() {
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    ctx.fillStyle = "rgba(0, 0, 0, 0)";
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
}

// Call on page load
window.onload = createTransparentCanvas;

// Handle image upload
imageUpload.addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = () => {
            uploadedImage = new Image();
            uploadedImage.src = reader.result;
            uploadedImage.onload = () => {
                // Clear the canvas and draw the uploaded image
                createTransparentCanvas();
                ctx.drawImage(uploadedImage, 0, 0, canvasWidth, canvasHeight);

                // Enable the controls
                resizeWidth.disabled = false;
                resizeHeight.disabled = false;
                rotateSlider.disabled = false;
                zoomSlider.disabled = false;
                downloadButton.disabled = false;

                // Set initial width and height
                resizeWidth.value = uploadedImage.width;
                resizeHeight.value = uploadedImage.height;
            };
        };
        reader.readAsDataURL(file);
    }
});

// Resize the image based on input width and height
resizeWidth.addEventListener('input', updateImageSize);
resizeHeight.addEventListener('input', updateImageSize);

function updateImageSize() {
    if (uploadedImage) {
        const width = parseInt(resizeWidth.value) || uploadedImage.width;
        const height = parseInt(resizeHeight.value) || uploadedImage.height;
        imagePreview.width = width;
        imagePreview.height = height;

        // Redraw image with the new size
        createTransparentCanvas();
        ctx.drawImage(uploadedImage, 0, 0, width, height);
    }
}

// Rotate the image based on slider input
rotateSlider.addEventListener('input', (event) => {
    imageRotation = event.target.value;

    // Redraw image with rotation
    createTransparentCanvas();
    ctx.save();
    ctx.translate(imagePreview.width / 2, imagePreview.height / 2);
    ctx.rotate((imageRotation * Math.PI) / 180);
    ctx.drawImage(uploadedImage, -imagePreview.width / 2, -imagePreview.height / 2, imagePreview.width, imagePreview.height);
    ctx.restore();
});

// Zoom the image based on slider input
zoomSlider.addEventListener('input', (event) => {
    zoomLevel = event.target.value;
    // Redraw image with zoom
    createTransparentCanvas();
    ctx.save();
    ctx.translate(imagePreview.width / 2, imagePreview.height / 2);
    ctx.scale(zoomLevel, zoomLevel);
    ctx.drawImage(uploadedImage, -imagePreview.width / 2, -imagePreview.height / 2, imagePreview.width, imagePreview.height);
    ctx.restore();
});

// Pencil tool functionality
pencilButton.addEventListener('click', () => {
    drawing = !drawing;
    if (drawing) {
        pencilButton.textContent = "Stop Drawing";
    } else {
        pencilButton.textContent = "Pencil Tool";
    }
});

imagePreview.addEventListener('mousedown', (e) => {
    if (drawing) {
        lastX = e.offsetX;
        lastY = e.offsetY;
        ctx.beginPath();
        ctx.moveTo(lastX, lastY);
        imagePreview.addEventListener('mousemove', draw);
    }
});

imagePreview.addEventListener('mouseup', () => {
    imagePreview.removeEventListener('mousemove', draw);
});

function draw(e) {
    if (drawing) {
        const currentX = e.offsetX;
        const currentY = e.offsetY;
        ctx.lineTo(currentX, currentY);
        ctx.stroke();
        lastX = currentX;
        lastY = currentY;
    }
}

// Download the edited image as a file
downloadButton.addEventListener('click', () => {
    const link = document.createElement('a');
    link.href = imagePreview.toDataURL('image/png');
    link.download = 'edited-image.png';
    link.click();
});
