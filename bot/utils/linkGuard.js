const isAuthenticated = require('../middleware/auth.js');
const { generateSecureToken } = require('../utils/tokens.js');

module.exports = async function requireLink(interaction) {
  // 1) check if they’re already linked
  const linked = await isAuthenticated(interaction.user.id);
  if (linked) return true;

  // 2) not linked → generate a new one-time token + URL
  const token = await generateSecureToken(interaction.user.id);
  const url = `https://stellar-exchange.com/auth/discord?token=${token}`;

  // 3) reply with an ephemeral connect button
  await interaction.reply({
    content: `🔗 You need to connect your Stellar account first!`,
    components: [
      {
        type: 1,
        components: [
          {
            type: 2,
            style: 5,          // Link button
            label: 'Connect Account',
            url
          }
        ]
      }
    ],
    ephemeral: true
  });

  return false;
};
