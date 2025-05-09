const express = require('express');
const fs = require('fs');
const app = express();
const PORT = 3000;

app.use(express.json());

const dbPath = './db.json';


const readDB = () => {
  const data = fs.readFileSync(dbPath, 'utf-8');
  return JSON.parse(data);
};


const writeDB = (data) => {
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
};


app.post('/dishes', (req, res) => {
  const { name, price, category } = req.body;
  if (!name || !price || !category) {
    return res.status(400).json({ error: 'Missing fields in request' });
  }

  const db = readDB();
  const newDish = {
    id: db.dishes.length ? db.dishes[db.dishes.length - 1].id + 1 : 1,
    name,
    price,
    category
  };

  db.dishes.push(newDish);
  writeDB(db);

  res.status(201).json(newDish);
});


app.get('/dishes', (req, res) => {
  const db = readDB();
  res.status(200).json(db.dishes);
});

app.get('/dishes/:id', (req, res) => {
  const db = readDB();
  const dish = db.dishes.find(d => d.id === parseInt(req.params.id));
  if (!dish) return res.status(404).json({ error: 'Dish not found' });

  res.status(200).json(dish);
});


app.put('/dishes/:id', (req, res) => {
  const db = readDB();
  const index = db.dishes.findIndex(d => d.id === parseInt(req.params.id));
  if (index === -1) return res.status(404).json({ error: 'Dish not found' });

  const { name, price, category } = req.body;
  if (!name || !price || !category) {
    return res.status(400).json({ error: 'Missing fields in request' });
  }

  db.dishes[index] = { id: db.dishes[index].id, name, price, category };
  writeDB(db);
  res.status(200).json(db.dishes[index]);
});


app.delete('/dishes/:id', (req, res) => {
  const db = readDB();
  const index = db.dishes.findIndex(d => d.id === parseInt(req.params.id));
  if (index === -1) return res.status(404).json({ error: 'Dish not found' });

  const deleted = db.dishes.splice(index, 1)[0];
  writeDB(db);
  res.status(200).json({ message: 'Dish deleted', dish: deleted });
});

app.get('/dishes/get', (req, res) => {
  const { name } = req.query;
  if (!name) return res.status(400).json({ error: 'Dish name required' });

  const db = readDB();
  const result = db.dishes.filter(d =>
    d.name.toLowerCase().includes(name.toLowerCase())
  );

  if (result.length === 0) {
    return res.status(404).json({ message: 'No dishes found' });
  }

  res.status(200).json(result);
});


app.use((req, res) => {
  res.status(404).json({ error: '404 Not Found' });
});


app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
