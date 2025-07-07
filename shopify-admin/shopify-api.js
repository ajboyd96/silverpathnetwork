const axios = require('axios');
require('dotenv').config();

class ShopifyAPI {
  constructor() {
    this.storeUrl = process.env.SHOPIFY_STORE_URL;
    this.accessToken = process.env.SHOPIFY_ACCESS_TOKEN;
    this.apiVersion = process.env.SHOPIFY_API_VERSION || '2023-10';
    this.baseUrl = `https://${this.storeUrl}/admin/api/${this.apiVersion}`;
    
    this.headers = {
      'X-Shopify-Access-Token': this.accessToken,
      'Content-Type': 'application/json'
    };
  }

  async request(endpoint, method = 'GET', data = null) {
    try {
      const config = {
        method,
        url: `${this.baseUrl}${endpoint}`,
        headers: this.headers
      };

      if (data) {
        config.data = data;
      }

      const response = await axios(config);
      return response.data;
    } catch (error) {
      console.error('Shopify API Error:', error.response?.data || error.message);
      throw error;
    }
  }

  // Products
  async getProducts(params = {}) {
    const queryParams = new URLSearchParams(params).toString();
    return await this.request(`/products.json?${queryParams}`);
  }

  async getProduct(productId) {
    return await this.request(`/products/${productId}.json`);
  }

  async createProduct(productData) {
    return await this.request('/products.json', 'POST', { product: productData });
  }

  async updateProduct(productId, productData) {
    return await this.request(`/products/${productId}.json`, 'PUT', { product: productData });
  }

  async deleteProduct(productId) {
    return await this.request(`/products/${productId}.json`, 'DELETE');
  }

  // Inventory
  async getInventoryLevels(params = {}) {
    const queryParams = new URLSearchParams(params).toString();
    return await this.request(`/inventory_levels.json?${queryParams}`);
  }

  async updateInventoryLevel(inventoryItemId, locationId, available) {
    return await this.request('/inventory_levels/set.json', 'POST', {
      inventory_item_id: inventoryItemId,
      location_id: locationId,
      available: available
    });
  }

  // Orders
  async getOrders(params = {}) {
    const queryParams = new URLSearchParams(params).toString();
    return await this.request(`/orders.json?${queryParams}`);
  }

  async getOrder(orderId) {
    return await this.request(`/orders/${orderId}.json`);
  }

  async updateOrder(orderId, orderData) {
    return await this.request(`/orders/${orderId}.json`, 'PUT', { order: orderData });
  }

  // Customers
  async getCustomers(params = {}) {
    const queryParams = new URLSearchParams(params).toString();
    return await this.request(`/customers.json?${queryParams}`);
  }

  async getCustomer(customerId) {
    return await this.request(`/customers/${customerId}.json`);
  }

  async createCustomer(customerData) {
    return await this.request('/customers.json', 'POST', { customer: customerData });
  }

  async updateCustomer(customerId, customerData) {
    return await this.request(`/customers/${customerId}.json`, 'PUT', { customer: customerData });
  }

  // Shop Settings
  async getShop() {
    return await this.request('/shop.json');
  }

  // Analytics
  async getAnalytics(params = {}) {
    const queryParams = new URLSearchParams(params).toString();
    return await this.request(`/analytics/reports.json?${queryParams}`);
  }

  async getOrderAnalytics(startDate, endDate) {
    return await this.request(`/analytics/reports/orders.json?start_date=${startDate}&end_date=${endDate}`);
  }

  // Test connection
  async testConnection() {
    try {
      const shop = await this.getShop();
      console.log('✅ Connection successful!');
      console.log(`Connected to: ${shop.shop.name}`);
      return true;
    } catch (error) {
      console.error('❌ Connection failed:', error.message);
      return false;
    }
  }
}

module.exports = ShopifyAPI;