// bot/services/stellar.js
async function fetchStellarBalanceForDiscordUser(discordUserId) {
  return 123.45; // stub; replace with real API call
}
async function transferXLM(fromId, toId, amount) {
  console.log(`Transferring ${amount} from ${fromId} to ${toId}`);
  return { successful: true };
}
module.exports = { fetchStellarBalanceForDiscordUser, transferXLM };
