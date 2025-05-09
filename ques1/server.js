
const express = require('express');
const app = express();
const PORT = 3000;

app.get('/home', (req, res) => {
  res.status(200).send('<h1>Welcome to Home Page</h1>');
});

app.get('/aboutus', (req, res) => {
  res.status(200).json({ message: 'Welcome to About Us' });
});

app.get('/contactus', (req, res) => {
  res.status(200).json({
    name: 'Masai School',
    email: 'contact@masai.com',
    phone: '+91-9999999999'
  });
});

app.use((req, res) => {
  res.status(404).send('404 Not Found');
});


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
