// services/twitchAuthService.js
const axios = require('axios');
require('dotenv').config();

async function getAccessToken() {
  try {
    const response = await axios.post('https://id.twitch.tv/oauth2/token', null, {
      params: {
        client_id: process.env.TWITCH_CLIENT_ID,
        client_secret: process.env.TWITCH_CLIENT_SECRET,
        grant_type: 'client_credentials'
      }
    });
    console.log('Access Token:', response.data.access_token); // Log du token pour vérifier qu'il est bien généré
    return response.data.access_token;
  } catch (error) {
    console.error('Error getting access token:', error.response ? error.response.data : error.message);
    throw error;
  }
}

module.exports = { getAccessToken };