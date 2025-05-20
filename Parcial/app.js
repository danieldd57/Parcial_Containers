// app.js
const express = require('express');
const path = require('path');
const fetch = require('node-fetch');

const app = express();
const PORT = 3000;

// Retry helper
async function fetchWithRetry(url, options = {}, retries = 3, delay = 1000) {
  for (let i = 0; i <= retries; i++) {
    try {
      const response = await fetch(url, options);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      if (i === retries) {
        throw error;
      }
      console.log(`Reintento ${i + 1} fallido... esperando ${delay}ms`);
      await new Promise(res => setTimeout(res, delay));
    }
  }
}

// Archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Página principal
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

// Ruta con retry
app.get('/api/posts', async (req, res) => {
  try {
    const data = await fetchWithRetry('https://jsonplaceholder.typicode.com/posts');
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener los posts' });
  }
});

app.get('/api/posts/:id', async (req, res) => {
  try {
    const data = await fetchWithRetry(`https://jsonplaceholder.typicode.com/posts/${req.params.id}`);
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener el post por ID' });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
