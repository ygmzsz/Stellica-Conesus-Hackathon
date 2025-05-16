// middleware/auth.js
module.exports = async function isAuthenticated(discordUserId) {
  // look up in your DB whether this user has linked a Stellar account
  const link = await getAccountLink(discordUserId);
  return Boolean(link);
};
