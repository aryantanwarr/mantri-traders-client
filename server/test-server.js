const express = require('express');
const app = express();

app.use(express.json());

// Test routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK' });
});

app.get('/api/products', (req, res) => {
  res.json({ products: [] });
});

app.get('/api/products/categories/list', (req, res) => {
  res.json({ categories: [] });
});

app.get('/api/products/:id', (req, res) => {
  res.json({ product: { id: req.params.id } });
});

app.get('/api/enquiries', (req, res) => {
  res.json({ enquiries: [] });
});

app.get('/api/enquiries/stats/overview', (req, res) => {
  res.json({ stats: {} });
});

app.get('/api/enquiries/:id', (req, res) => {
  res.json({ enquiry: { id: req.params.id } });
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Test server running on port ${PORT}`);
}); 