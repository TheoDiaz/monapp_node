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
      `fields name,genres.name,summary,cover.url,first_release_date,platforms.name; search "${query}"; limit 10;`,
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
    
    // Format the response data
    const formattedGames = response.data.map(game => ({
      name: game.name,
      summary: game.summary,
      cover: game.cover ? game.cover.url.replace('t_thumb', 't_cover_big') : null,
      releaseDate: game.first_release_date ? new Date(game.first_release_date * 1000).toISOString().split('T')[0] : null,
      platforms: game.platforms ? game.platforms.map(p => p.name) : [],
      genres: game.genres ? game.genres.map(g => g.name) : []
    }));

    return formattedGames;
  } catch (error) {
    console.error('Error searching games:', error.response ? error.response.data : error.message);
    throw error;
  }
}

module.exports = { initializeIGDB, searchGames };