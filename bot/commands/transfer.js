const { SlashCommandBuilder } = require('discord.js');
const requireLink = require('../utils/linkGuard.js');
const { fetchStellarBalanceForDiscordUser, transferXLM } = require('../services/stellar.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('transfer')
    .setDescription('Transfer XLM to another linked user.')
    .addUserOption(opt =>
      opt.setName('user')
        .setDescription('Who to send XLM to')
        .setRequired(true))
    .addNumberOption(opt =>
      opt.setName('amount')
        .setDescription('How much XLM to send')
        .setRequired(true)),
  async execute(interaction) {
    if (!await requireLink(interaction)) return;

    const senderId = interaction.user.id;
    const recipient = interaction.options.getUser('user');
    const amount    = interaction.options.getNumber('amount');

    // make sure they’re not sending to themselves
    if (recipient.id === senderId) {
      return interaction.reply({ 
        content: '🚫 You can’t send XLM to yourself!', 
        ephemeral: true 
      });
    }

    const balance = await fetchStellarBalanceForDiscordUser(senderId);
    if (amount > balance) {
      return interaction.reply({
        content: `❌ Insufficient funds—your balance is ${balance} XLM.`,
        ephemeral: true
      });
    }

    
    // perform the transfer
    await transferXLM(senderId, recipient.id, amount);

    return interaction.reply({
      content: `✅ Sent ${amount} XLM to ${recipient.username}!`,
      ephemeral: true
    });
  }
};
