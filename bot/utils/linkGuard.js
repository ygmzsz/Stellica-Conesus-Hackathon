// bot/utils/linkGuard.js
const isAuthenticated     = require('../middleware/auth.js');
const { generateSecureToken } = require('./tokens.js');

module.exports = async function requireLink(interaction) {
  // 1) If they’re already linked, let them through
  if (await isAuthenticated(interaction.user.id)) return true;

  // 2) Otherwise—generate a fresh one-time token and URL
  const token = await generateSecureToken(interaction.user.id);
  const url   = `https://your-domain.com/auth/discord?token=${token}`;

  // 3) Send them the same “Connect Account” button
  const { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require('discord.js');
  const embed = new EmbedBuilder()
    .setTitle('🔗 Link Your Stellar Account')
    .setDescription('You need to connect your Stellar account first. Click below:')
    .setColor(0x9c59b6);
  const button = new ButtonBuilder()
    .setLabel('Connect Account')
    .setStyle(ButtonStyle.Link)
    .setURL(url);
  const row = new ActionRowBuilder().addComponents(button);

  await interaction.reply({ embeds: [embed], components: [row], ephemeral: true });
  return false;
};
