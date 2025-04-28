const API_URL = 'https://your-render-app.onrender.com'; // Replace after deploying

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
        imageUrl = await uploadImage(imageFile);
    }

    const article = { title, content, imageUrl };

    await uploadArticle(article);

    clearEditor();
    await loadArticles();
});

async function uploadArticle(article) {
    const response = await fetch(`${API_URL}/articles`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(article)
    });
    const data = await response.json();
    console.log('Uploaded article:', data);
}

function clearEditor() {
    document.getElementById('title').value = '';
    document.getElementById('content').value = '';
    document.getElementById('imageUpload').value = '';
}

// Load articles when page loads
async function loadArticles() {
    const response = await fetch(`${API_URL}/articles`);
    const articles = await response.json();
    articlesDiv.innerHTML = '';
    articles.forEach(displayArticle);
}

function displayArticle(article) {
    const articleEl = document.createElement('div');
    articleEl.className = 'article';
    articleEl.innerHTML = `
        <h3>${article.title}</h3>
        <p>${article.content}</p>
        ${article.imageUrl ? `<img src="${article.imageUrl}" alt="Article Image">` : ''}
    `;
    articlesDiv.appendChild(articleEl);
}

async function uploadImage(file) {
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = function(e) {
            resolve(e.target.result); // Base64 (simulate image upload)
        }
        reader.readAsDataURL(file);
    });
}

// Initial load
loadArticles();
