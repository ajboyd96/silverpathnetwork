const ShopifyAPI = require('./shopify-api');
require('dotenv').config();

async function getYesterdayOrders() {
  const shopify = new ShopifyAPI();
  
  // Get yesterday's date range
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  yesterday.setHours(0, 0, 0, 0);
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const yesterdayStart = yesterday.toISOString();
  const yesterdayEnd = today.toISOString();
  
  try {
    const orders = await shopify.getOrders({
      created_at_min: yesterdayStart,
      created_at_max: yesterdayEnd,
      limit: 250
    });
    
    console.log('📊 Yesterday Orders Report:');
    console.log('Date:', yesterday.toLocaleDateString());
    console.log('Total Orders:', orders.orders.length);
    
    if (orders.orders.length > 0) {
      const totalRevenue = orders.orders.reduce((sum, order) => sum + parseFloat(order.total_price), 0);
      console.log('Total Revenue: $' + totalRevenue.toFixed(2));
      
      console.log('\nOrder Details:');
      orders.orders.forEach((order, index) => {
        console.log(`${index + 1}. Order #${order.order_number} - $${order.total_price} - ${order.financial_status}`);
      });
    }
    
  } catch (error) {
    console.error('Error:', error.message);
  }
}

getYesterdayOrders();