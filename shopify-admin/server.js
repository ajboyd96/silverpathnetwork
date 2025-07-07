const express = require('express');
const cors = require('cors');
const ShopifyAPI = require('./shopify-api');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Initialize Shopify API
const shopify = new ShopifyAPI();

// Routes
app.get('/', (req, res) => {
  res.send(`
    <h1>Shopify Admin Dashboard</h1>
    <p>Connected to: ${process.env.SHOPIFY_STORE_URL}</p>
    <ul>
      <li><a href="/api/test">Test Connection</a></li>
      <li><a href="/api/products">Products</a></li>
      <li><a href="/api/orders">Orders</a></li>
      <li><a href="/api/customers">Customers</a></li>
      <li><a href="/api/shop">Shop Info</a></li>
      <li><a href="/dashboard">Dashboard</a></li>
    </ul>
  `);
});

// API Routes
app.get('/api/test', async (req, res) => {
  try {
    const isConnected = await shopify.testConnection();
    res.json({ connected: isConnected });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/products', async (req, res) => {
  try {
    const products = await shopify.getProducts(req.query);
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/products/:id', async (req, res) => {
  try {
    const product = await shopify.getProduct(req.params.id);
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/products', async (req, res) => {
  try {
    const product = await shopify.createProduct(req.body);
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/products/:id', async (req, res) => {
  try {
    const product = await shopify.updateProduct(req.params.id, req.body);
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/products/:id', async (req, res) => {
  try {
    await shopify.deleteProduct(req.params.id);
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/orders', async (req, res) => {
  try {
    const orders = await shopify.getOrders(req.query);
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/orders/:id', async (req, res) => {
  try {
    const order = await shopify.getOrder(req.params.id);
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/customers', async (req, res) => {
  try {
    const customers = await shopify.getCustomers(req.query);
    res.json(customers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/customers/:id', async (req, res) => {
  try {
    const customer = await shopify.getCustomer(req.params.id);
    res.json(customer);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/shop', async (req, res) => {
  try {
    const shop = await shopify.getShop();
    res.json(shop);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/inventory', async (req, res) => {
  try {
    const inventory = await shopify.getInventoryLevels(req.query);
    res.json(inventory);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`🚀 Shopify Admin Dashboard running on http://localhost:${port}`);
  console.log(`📱 Store: ${process.env.SHOPIFY_STORE_URL}`);
});

module.exports = app;