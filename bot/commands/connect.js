// commands/connect-stellar.js

const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require('discord.js');
const { generateSecureToken } = require('../utils/tokens.js');
const { storeVerificationRequest } = require('../services/verification.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('connect-stellar')
    .setDescription('Link your Discord account to your Stellar Exchange account.'),

  async execute(interaction) {
    try {
      // 1️⃣ Generate a secure, one-time token (expires in 1 hour)
      const token = await generateSecureToken(interaction.user.id);
      const expiresAt = Date.now() + 60 * 60 * 1000; // 1 hour from now

      // 2️⃣ Store it in your DB
      await storeVerificationRequest(interaction.user.id, token, expiresAt);

      // 3️⃣ Build the verification URL
      const verificationUrl = `https://stellar-exchange.com/auth/discord?token=${token}`;

      // 4️⃣ Send an ephemeral reply with a “Connect Account” button
      const embed = new EmbedBuilder()
        .setTitle('🔗 Connect Your Stellar Account')
        .setDescription('Click the button below to securely link your Discord account to Stellar. This link will expire in 1 hour.')
        .setColor(0x9c59b6);

      const button = new ButtonBuilder()
        .setLabel('Connect Account')
        .setStyle(ButtonStyle.Link)
        .setURL(verificationUrl);

      const row = new ActionRowBuilder().addComponents(button);

      await interaction.reply({
        embeds: [embed],
        components: [row],
        ephemeral: true
      });
    } catch (err) {
      console.error('Error in /connect-stellar:', err);
      await interaction.reply({
        content: '❌ Oops—something went wrong while generating your link. Please try again later.',
        ephemeral: true
      });
    }
  }
};
// This command allows users to link their Discord account to their Stellar account.