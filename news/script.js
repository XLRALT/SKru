const submitBtn = document.getElementById('submitBtn');
const articlesDiv = document.getElementById('articles');

submitBtn.addEventListener('click', async () => {
    const title = document.getElementById('title').value.trim();
    const content = document.getElementById('content').value.trim();
    const imageFile = document.getElementById('imageUpload').files[0];

    if (!title || !content) {
        alert('Please fill out title and content!');
        return;
    }

    let imageUrl = '';

    if (imageFile) {
        // Simulate uploading image to external server
        imageUrl = await uploadImage(imageFile);
    }

    const article = {
        title,
        content,
        imageUrl
    };

    displayArticle(article);

    // Optionally send article to server
    // await uploadArticle(article);

    clearEditor();
});

function displayArticle(article) {
    const articleEl = document.createElement('div');
    articleEl.className = 'article';
    articleEl.innerHTML = `
        <h3>${article.title}</h3>
        <p>${article.content}</p>
        ${article.imageUrl ? `<img src="${article.imageUrl}" alt="Article Image">` : ''}
    `;
    articlesDiv.prepend(articleEl); // newest on top
}

function clearEditor() {
    document.getElementById('title').value = '';
    document.getElementById('content').value = '';
    document.getElementById('imageUpload').value = '';
}

// Fake image upload function
async function uploadImage(file) {
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = function(e) {
            resolve(e.target.result); // base64 data URL (simulate server URL)
        }
        reader.readAsDataURL(file);
    });
}

// Example real upload function (you would connect to real server API)
/*
async function uploadArticle(article) {
    const response = await fetch('https://yourserver.com/api/articles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(article)
    });
    const data = await response.json();
    console.log('Uploaded article:', data);
}
*/
