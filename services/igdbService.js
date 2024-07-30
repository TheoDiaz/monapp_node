// services/igdbService.js
const axios = require('axios');
const { getAccessToken } = require('./twitchAuthService');

let accessToken;

async function initializeIGDB() {
  accessToken = await getAccessToken();
  console.log('IGDB Service initialized with access token:', accessToken);
}

async function searchGames(query) {
  if (!accessToken) {
    console.log('Access token not initialized, initializing now...');
    await initializeIGDB();
  }

  try {
    const response = await axios.post(
      'https://api.igdb.com/v4/games',
      `fields name,genres.name,summary,cover.url; search "${query}"; limit 10;`,
      {
        headers: {
          'Client-ID': process.env.TWITCH_CLIENT_ID,
          'Authorization': `Bearer ${accessToken}`,
          'Accept': 'application/json',
          'Content-Type': 'text/plain'
        }
      }
    );
    console.log('IGDB API request successful');
    return response.data;
  } catch (error) {
    console.error('Error searching games:', error.response ? error.response.data : error.message);
    throw error;
  }
}

module.exports = { initializeIGDB, searchGames };