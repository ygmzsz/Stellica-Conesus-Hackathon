// bot/utils/tokens.js
const crypto = require('crypto');
const store  = new Map();

async function generateSecureToken(discordUserId) {
  const token = crypto.randomBytes(32).toString('hex');
  store.set(token, { discordUserId, expiresAt: Date.now() + 3600000 });
  return token;
}

async function consumeToken(token) {
  const entry = store.get(token);
  if (!entry || entry.expiresAt < Date.now()) return null;
  store.delete(token);
  return entry.discordUserId;
}

module.exports = { generateSecureToken, consumeToken };
