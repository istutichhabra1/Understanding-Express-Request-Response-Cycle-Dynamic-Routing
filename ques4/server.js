const express = require('express');
const fs = require('fs');
const app = express();
const PORT = 3000;

const DB_PATH = './db.json';

app.use(express.json());


const readDB = () => JSON.parse(fs.readFileSync(DB_PATH, 'utf-8'));
const writeDB = (data) => fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));


app.post('/books', (req, res) => {
  const { title, author, year } = req.body;
  if (!title || !author || !year) {
    return res.status(400).json({ error: 'Missing fields in request' });
  }

  const db = readDB();
  const newBook = {
    id: db.books.length ? db.books[db.books.length - 1].id + 1 : 1,
    title,
    author,
    year
  };

  db.books.push(newBook);
  writeDB(db);
  res.status(201).json(newBook);
});


app.get('/books', (req, res) => {
  const db = readDB();
  res.status(200).json(db.books);
});


app.get('/books/:id', (req, res) => {
  const db = readDB();
  const book = db.books.find(b => b.id === parseInt(req.params.id));
  if (!book) return res.status(404).json({ error: 'Book not found' });
  res.status(200).json(book);
});


app.put('/books/:id', (req, res) => {
  const { title, author, year } = req.body;
  const db = readDB();
  const index = db.books.findIndex(b => b.id === parseInt(req.params.id));
  if (index === -1) return res.status(404).json({ error: 'Book not found' });

  if (!title || !author || !year) {
    return res.status(400).json({ error: 'Missing fields in request' });
  }

  db.books[index] = { id: db.books[index].id, title, author, year };
  writeDB(db);
  res.status(200).json(db.books[index]);
});


app.delete('/books/:id', (req, res) => {
  const db = readDB();
  const index = db.books.findIndex(b => b.id === parseInt(req.params.id));
  if (index === -1) return res.status(404).json({ error: 'Book not found' });

  const deleted = db.books.splice(index, 1)[0];
  writeDB(db);
  res.status(200).json({ message: 'Book deleted', book: deleted });
});

app.get('/books/search', (req, res) => {
  const { author, title } = req.query;
  if (!author && !title) {
    return res.status(400).json({ error: 'Query parameter (author or title) required' });
  }

  const db = readDB();
  let results = db.books;

  if (author) {
    results = results.filter(b =>
      b.author.toLowerCase().includes(author.toLowerCase())
    );
  }

  if (title) {
    results = results.filter(b =>
      b.title.toLowerCase().includes(title.toLowerCase())
    );
  }

  if (results.length === 0) {
    return res.status(404).json({ message: 'No books found' });
  }

  res.status(200).json(results);
});


app.use((req, res) => {
  res.status(404).json({ error: '404 Not Found' });
});


app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
