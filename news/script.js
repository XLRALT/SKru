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
    await uploadArticle(article);

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

// Replace "localhost" with your backend's domain or IP
const BACKEND_URL = 'https://rte567.fwh.is/news_articles';

// Load articles on page load
window.addEventListener('DOMContentLoaded', loadArticles);

async function loadArticles() {
    const res = await fetch('http://rte567.fwh.is/news_articles/get_articles.php');
    const articles = await res.json();
    articles.forEach(article => displayArticle(article));
}

// Update uploadImage to use PHP backend
async function uploadImage(file) {
    const formData = new FormData();
    formData.append('image', file);

    const res = await fetch('http://rte567.fwh.is/news_articles/save_article.php', {
        method: 'POST',
        body: formData
    });

    const data = await res.json();
    return data.imageUrl;
}

// Update the submit handler to send article data
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
        imageUrl = await uploadImage(imageFile);
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    formData.append('image', imageFile || '');

    await fetch('http://rte567.fwh.is/news_articles/save_article.php', {
        method: 'POST',
        body: formData
    });

    displayArticle({ title, content, imageUrl });
    clearEditor();
});
