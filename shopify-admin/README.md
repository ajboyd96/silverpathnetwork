# Shopify Admin Dashboard

A Node.js application for managing your Shopify store via the Admin API.

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Create Environment File
Copy `.env.template` to `.env` and add your Shopify credentials:

```bash
cp .env.template .env
```

Edit `.env` with your details:
```
SHOPIFY_STORE_URL=thegivenget.myshopify.com
SHOPIFY_ACCESS_TOKEN=your_access_token_here
SHOPIFY_API_VERSION=2023-10
PORT=3000
NODE_ENV=development
```

### 3. Get Shopify Access Token

To get your Shopify Admin API access token:

1. **Login to your Shopify admin**: https://thegivenget.myshopify.com/admin
2. **Go to Settings > Apps and sales channels**
3. **Click "Develop apps"** (at the bottom)
4. **Click "Create an app"**
5. **Name your app** (e.g., "Admin Dashboard")
6. **Click "Configure Admin API scopes"**
7. **Select the permissions you need:**
   - `read_products` and `write_products`
   - `read_orders` and `write_orders`
   - `read_customers` and `write_customers`
   - `read_inventory` and `write_inventory`
   - `read_analytics`
   - `read_reports`
8. **Save the configuration**
9. **Install the app**
10. **Reveal the Admin API access token** and copy it to your `.env` file

### 4. Test Connection
```bash
npm test
```

### 5. Start the Server
```bash
npm start
# or for development with auto-restart
npm run dev
```

## Features

### API Endpoints
- `GET /api/test` - Test connection
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get specific product
- `POST /api/products` - Create product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product
- `GET /api/orders` - Get all orders
- `GET /api/orders/:id` - Get specific order
- `GET /api/customers` - Get all customers
- `GET /api/customers/:id` - Get specific customer
- `GET /api/shop` - Get shop information
- `GET /api/inventory` - Get inventory levels

### Dashboard
Access the web dashboard at: `http://localhost:3000/dashboard`

The dashboard provides:
- Store overview and metrics
- Product management
- Order tracking
- Customer insights
- Real-time data updates

## Usage Examples

### Get Products
```javascript
const ShopifyAPI = require('./shopify-api');
const shopify = new ShopifyAPI();

// Get all products
const products = await shopify.getProducts();

// Get products with filters
const filteredProducts = await shopify.getProducts({
  limit: 10,
  status: 'active'
});
```

### Update Inventory
```javascript
// Update inventory level
await shopify.updateInventoryLevel(
  inventoryItemId, 
  locationId, 
  newQuantity
);
```

### Create Customer
```javascript
const customer = await shopify.createCustomer({
  first_name: 'John',
  last_name: 'Doe',
  email: 'john@example.com',
  phone: '+1234567890'
});
```

## Security Notes

- Never commit your `.env` file to version control
- Keep your access token secure
- Use environment variables for sensitive data
- Regularly rotate your access tokens
- Monitor API usage in your Shopify admin

## Troubleshooting

### Common Issues

1. **401 Unauthorized**: Check your access token and store URL
2. **403 Forbidden**: Verify your app has the required permissions
3. **404 Not Found**: Confirm the API endpoint and store URL are correct
4. **Rate Limiting**: Shopify has API rate limits (40 requests/second)

### Debug Mode
Set `NODE_ENV=development` in your `.env` file for detailed error logs.

## API Rate Limits

Shopify Admin API has the following limits:
- 40 requests per second per app
- 1000 requests per minute per app
- Use the `X-Shopify-Shop-Api-Call-Limit` header to monitor usage

## Support

For issues with:
- **Shopify API**: Check [Shopify Admin API documentation](https://shopify.dev/docs/admin-api)
- **This application**: Review the logs and error messages
- **Authentication**: Verify your app permissions in Shopify admin