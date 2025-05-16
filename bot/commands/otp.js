// bot/commands/otp.js
const { SlashCommandBuilder } = require('discord.js');
const speakeasy = require('speakeasy');


// Simple in-memory store for testing only
// In production, persist per-user secrets in your DB!
const secretStore = new Map();

module.exports = {
  data: new SlashCommandBuilder()
    .setName('otp')
    .setDescription('Generate or verify a TOTP code (testing only)')
    .addSubcommand(sub =>
      sub
        .setName('generate')
        .setDescription('Generate a new TOTP secret and current code'))
    .addSubcommand(sub =>
      sub
        .setName('verify')
        .setDescription('Verify a TOTP code')
        .addStringOption(opt =>
          opt
            .setName('code')
            .setDescription('The 6-digit code to verify')
            .setRequired(true)
        )
    ),

  async execute(interaction) {
    const userId = interaction.user.id;
    const sub = interaction.options.getSubcommand();

    if (sub === 'generate') {
      // 1) Create a new secret
      const secret = speakeasy.generateSecret({ length: 20 });
      // 2) Store it
      secretStore.set(userId, secret.base32);
      // 3) Generate the current code
      const token = speakeasy.totp({
        secret: secret.base32,
        encoding: 'base32'
      });

      return interaction.reply({
        content: [
          '🔐 **TOTP Secret Generated**',
          `• Secret (base32): \`${secret.base32}\``,
          `• Current code: \`${token}\``,
          '\nUse `/otp verify code:<your code>` to test validation.'
        ].join('\n'),
        ephemeral: true
      });

    } else if (sub === 'verify') {
      // 1) Look up their secret
      const userSecret = secretStore.get(userId);
      if (!userSecret) {
        return interaction.reply({
          content: '❌ You need to run `/otp generate` first!',
          ephemeral: true
        });
      }

      // 2) Get the code they provided
      const code = interaction.options.getString('code');

      // 3) Verify with a 1-step window
      const valid = speakeasy.totp.verify({
        secret: userSecret,
        encoding: 'base32',
        token: code,
        window: 1
      });

      return interaction.reply({
        content: valid
          ? '✅ Code is valid!'
          : '❌ Invalid or expired code.',
        ephemeral: true
      });
    }
  }
};
