const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 5000;

// Allow frontend to call backend
app.use(cors());
app.use(express.json());

let articles = []; // In-memory store

// GET all articles
app.get('/articles', (req, res) => {
    res.json(articles);
});

// POST a new article
app.post('/articles', (req, res) => {
    const { title, content, imageUrl } = req.body;
    if (!title || !content) {
        return res.status(400).json({ error: 'Title and content are required' });
    }
    const article = { id: Date.now(), title, content, imageUrl };
    articles.unshift(article); // Add to start
    res.status(201).json(article);
});

app.get('/', (req, res) => {
    res.send('News API is running');
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
