// List of video folders (each folder corresponds to a video ID)
const videoFolders = ['1', '2']; 

// Fetch video metadata and create video cards dynamically
videoFolders.forEach(folder => {
  // Fetch the metadata from the specific video folder
  fetch(`${folder}/metadata.json`)
    .then(response => response.json())
    .then(video => {
      // Get the video gallery container
      const gallery = document.getElementById('video-gallery');

      // Create the video card div
      const videoCard = document.createElement('div');
      videoCard.classList.add('video-card');

      // Create the link that will redirect to the video player, now linking to metadata.json
      const link = document.createElement('a');
      link.href = `watch/index.html?video=../${folder}/metadata.json`;  // Now pointing to metadata.json

      // Create the thumbnail image
      const img = document.createElement('img');
      img.src = `${folder}/${video.thumbnail}`;
      img.alt = `${video.title} Thumbnail`;

      // Create the title and description
      const title = document.createElement('p');
      title.textContent = video.title;

      const description = document.createElement('p');
      description.textContent = video.description;

      // Append elements to the video card
      link.appendChild(img);
      videoCard.appendChild(link);
      videoCard.appendChild(title);
      videoCard.appendChild(description);

      // Append the video card to the gallery
      gallery.appendChild(videoCard);
    })
    .catch(error => {
      console.error(`Error loading metadata for video ${folder}:`, error);
    });
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