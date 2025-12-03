const cron = require('node-cron');
const { fetchAndSaveInsider } = require('../controllers/insiderTradingController'); // Ensure the function is correct

// Cron job to run every 5 minutes
cron.schedule('*/5 * * * *', async () => {
  try {
    // Call the function to fetch and save news
    const response = await fetchAndSaveInsider();
  } catch (error) {
    console.error('💥 Error in insider trading job:', error);
  }
});
