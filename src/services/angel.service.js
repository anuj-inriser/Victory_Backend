const axios = require('axios');
const { env } = require('../config/env.js');

class AngelService {
  constructor() {
    this.baseUrl = 'https://apiconnect.angelone.in';
  }

  /**
   * Fetch historical data
   * @param {Object} params
   * @param {string} params.symbol - e.g. "SBIN-EQ" (We might need to map SBIN to token)
   * @param {string} params.resolution - "ONE_MINUTE", "ONE_DAY", etc.
   * @param {string} params.from - "yyyy-mm-dd HH:MM"
   * @param {string} params.to - "yyyy-mm-dd HH:MM"
   */
  async getHistoricalData({ symbolToken, interval, fromDate, toDate, exchange = 'NSE' }) {
    try {
      // Docs: https://smartapi.angelbroking.com/docs/Historical
      // Endpoint: /rest/secure/angelbroking/historical/v1/getCandleData
      
      const config = {
        method: 'post',
        url: `${this.baseUrl}/rest/secure/angelbroking/historical/v1/getCandleData`,
        headers: { 
          'Content-Type': 'application/json', 
          'Accept': 'application/json',
          'X-UserType': 'USER',
          'X-SourceID': 'WEB',
          'X-ClientLocalIP': '127.0.0.1',
          'X-ClientPublicIP': '127.0.0.1',
          'X-MACAddress': 'mac_address',
          'X-PrivateKey': env.angel.apiKey,
          'Authorization': `Bearer ${env.angel.authToken}`,
          'X-ClientCode': env.angel.clientCode
        },
        data: JSON.stringify({
          exchange,
          symboltoken: symbolToken,
          interval,
          fromdate: fromDate,
          todate: toDate
        })
      };

      const response = await axios(config);

      if (response.data && response.data.status && response.data.data) {
        return response.data.data;
      } else {
        console.error('Angel API Error:', response.data);
        // If the token is invalid, we might get a specific error.
        // For now, just throw.
        throw new Error(response.data.message || 'Failed to fetch historical data');
      }
    } catch (error) {
      console.error('Angel API Exception:', error.response ? error.response.data : error.message);
      throw error;
    }
  }
  
  // Helper to map common symbols to Angel tokens
  getSymbolToken(symbol) {
    const map = {
      'SBIN': '3045',
      'INFY': '1594',
      'TCS': '11536',
      'RELIANCE': '2885',
      'HDFCBANK': '1333'
    };
    return map[symbol] || '3045'; // Default to SBIN
  }
}

 const angelService = new AngelService();

 module.exports = {angelService};
