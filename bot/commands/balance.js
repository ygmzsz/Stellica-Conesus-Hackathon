// example: bot/commands/balance.js
const { SlashCommandBuilder } = require('discord.js');
const requireLink = require('../utils/linkGuard.js');
const { fetchStellarBalanceForDiscordUser } = require('../services/stellar.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('balance')
    .setDescription('Show your Stellar balance.'),
  async execute(interaction) {
    // ← GUARD HERE
    if (!await requireLink(interaction)) return;

    // If they are linked, do the real work:
    const bal = await fetchStellarBalanceForDiscordUser(interaction.user.id);
    return interaction.reply({ content: `💰 Balance: ${bal} XLM`, ephemeral: true });
  }
};
