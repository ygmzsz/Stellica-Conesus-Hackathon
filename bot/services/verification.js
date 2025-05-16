// bot/services/verification.js
const { consumeToken } = require('../utils/tokens.js');
async function storeVerificationRequest() { /* no-op, tokens.js already stores */ }
async function getVerificationRequest(token) {
  const discordUserId = await consumeToken(token);
  return discordUserId ? { discordUserId } : null;
}
module.exports = { storeVerificationRequest, getVerificationRequest };
