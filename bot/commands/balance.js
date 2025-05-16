const { SlashCommandBuilder } = require('discord.js');
const requireLink = require('../utils/linkGuard.js');
const { fetchStellarBalanceForDiscordUser } = require('../services/stellar.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('balance')
    .setDescription('Show your Stellar wallet balance.'),
  async execute(interaction) {
    // guard first
    if (!await requireLink(interaction)) return;

    // now that we know they're linked, do the real work:
    const balance = await fetchStellarBalanceForDiscordUser(interaction.user.id);
    return interaction.reply({
      content: `💰 Your current balance is ${balance} XLM.`,
      ephemeral: true
    });
  }
};
