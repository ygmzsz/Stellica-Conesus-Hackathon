// bot/services/linkStore.js

// In-memory map: discordUserId → stellarUserId
const linkMap = new Map();

/**
 * Returns the linked Stellar user ID for this Discord ID, or null.
 */
async function getAccountLink(discordUserId) {
  return linkMap.get(discordUserId) || null;
}

/**
 * Records that this Discord ID is linked to this Stellar user ID.
 */
async function linkAccount(discordUserId, stellarUserId) {
  linkMap.set(discordUserId, stellarUserId);
}

module.exports = { getAccountLink, linkAccount };
