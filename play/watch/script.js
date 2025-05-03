// Get the metadata URL from the query parameter in the URL
const params = new URLSearchParams(window.location.search);
const metadataPath = params.get('video');  // e.g., '1/metadata.json'

const videoPlayer = document.getElementById('videoPlayer');
const videoTitle = document.getElementById('videoTitle');
const videoDescription = document.getElementById('videoDescription');

// Fetch the video metadata from the JSON file
fetch(metadataPath)
  .then(response => response.json())
  .then(video => {
    // Set the title and description of the video
    videoTitle.textContent = video.title;
    videoDescription.textContent = video.description;

    // Use the video_path from the metadata to load the video
    const videoPath = video.video_path;  // Assuming metadata.json has a 'video_path' field
    const source = document.createElement('source');
    source.src = videoPath;  // Use the video path directly from the metadata

    // Determine video type based on extension
    if (videoPath.endsWith('.mp4')) {
      source.type = 'video/mp4';
    } else if (videoPath.endsWith('.webm')) {
      source.type = 'video/webm';
    } else {
      source.type = 'video/*'; // Fallback if type is not recognized
    }

    // Append the source to the video player
    videoPlayer.appendChild(source);
    videoPlayer.load();
    videoPlayer.play().catch(err => {
      console.warn('Autoplay failed:', err.message);
    });
  })
  .catch(error => {
    console.error('Error loading video metadata:', error);
    document.body.innerHTML += "<p style='color:red;'>Error loading video metadata.</p>";
  });

// MENU toggle with cursor offset fix
function toggleMenu(event) {
    const menu = document.getElementById('menu');
    const button = event.target;

    // Calculate position of button for better dropdown placement
    const buttonRect = button.getBoundingClientRect();
    const menuWidth = menu.offsetWidth;
    const menuHeight = menu.offsetHeight;

    // Update menu position based on button's position
    menu.style.left = `${buttonRect.left}px`;
    menu.style.top = `${buttonRect.bottom + window.scrollY}px`; // Adjusted for better vertical placement

    // Toggle dropdown visibility
    menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
}