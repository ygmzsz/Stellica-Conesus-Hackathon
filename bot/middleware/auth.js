// bot/middleware/auth.js
const { getAccountLink } = require('../services/linkStore.js');

module.exports = async function isAuthenticated(discordUserId) {
  // if there’s a stored link, return true
  return Boolean(await getAccountLink(discordUserId));
};
