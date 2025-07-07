const ShopifyAPI = require('./shopify-api');
require('dotenv').config();

async function testShopifyConnection() {
  console.log('🔍 Testing Shopify API connection...');
  
  // Check environment variables
  if (!process.env.SHOPIFY_STORE_URL || !process.env.SHOPIFY_ACCESS_TOKEN) {
    console.error('❌ Missing required environment variables');
    console.log('Please create a .env file with:');
    console.log('SHOPIFY_STORE_URL=thegivenget.myshopify.com');
    console.log('SHOPIFY_ACCESS_TOKEN=your_access_token_here');
    process.exit(1);
  }

  const shopify = new ShopifyAPI();
  
  try {
    // Test basic connection
    const isConnected = await shopify.testConnection();
    if (!isConnected) {
      process.exit(1);
    }

    // Test various endpoints
    console.log('\n📊 Testing API endpoints...');
    
    // Test products
    try {
      const products = await shopify.getProducts({ limit: 5 });
      console.log(`✅ Products: Found ${products.products.length} products`);
    } catch (error) {
      console.log('⚠️  Products: Limited access or no products');
    }

    // Test orders
    try {
      const orders = await shopify.getOrders({ limit: 5 });
      console.log(`✅ Orders: Found ${orders.orders.length} orders`);
    } catch (error) {
      console.log('⚠️  Orders: Limited access or no orders');
    }

    // Test customers
    try {
      const customers = await shopify.getCustomers({ limit: 5 });
      console.log(`✅ Customers: Found ${customers.customers.length} customers`);
    } catch (error) {
      console.log('⚠️  Customers: Limited access or no customers');
    }

    // Test shop info
    try {
      const shop = await shopify.getShop();
      console.log(`✅ Shop: ${shop.shop.name} (${shop.shop.domain})`);
    } catch (error) {
      console.log('⚠️  Shop: Limited access to shop info');
    }

    console.log('\n🎉 Connection test completed successfully!');
    
  } catch (error) {
    console.error('❌ Connection test failed:', error.message);
    process.exit(1);
  }
}

testShopifyConnection();