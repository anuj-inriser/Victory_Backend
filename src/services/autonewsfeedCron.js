// jobs/autonewsfeedCron.js
const cron = require('node-cron');
const { fetchAndSaveNews } = require('../controllers/autonewsfeedController'); // Assuming this path is correct

// Cron job to run every 5 minutes
cron.schedule('*/5 * * * *', async () => {
  try {
    // Call the function to fetch and save news
    const response = await fetchAndSaveNews();
  } catch (error) {
    console.error('💥 Error in autonewsfeed job:', error);
  }
});