// bot/commands/otp.js
const { SlashCommandBuilder, AttachmentBuilder, EmbedBuilder } = require('discord.js');
const speakeasy = require('speakeasy');
const QRCode    = require('qrcode');

// In‐memory stores for demo purposes.
// Persist these in your DB in production.
const secretStore    = new Map();
const emailCodeStore = new Map();

module.exports = {
  data: new SlashCommandBuilder()
    .setName('otp')
    .setDescription('Generate or verify a TOTP code (testing only)')
    .addSubcommand(sub =>
      sub
        .setName('generate')
        .setDescription('Generate a new TOTP secret and QR code')
    )
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
    const sub    = interaction.options.getSubcommand();

    if (sub === 'generate') {
      const secret = speakeasy.generateSecret({
        length: 20,
        name: `Stellica:${interaction.user.username}`,
        issuer: 'StellicaBot'
      });
      secretStore.set(userId, secret.base32);
      const qrBuffer  = await QRCode.toBuffer(secret.otpauth_url);
      const attachment = new AttachmentBuilder(qrBuffer, { name: 'otp.png' });
      const embed = new EmbedBuilder()
        .setTitle('🔐 Your TOTP Secret & QR Code')
        .setDescription(
          'Scan this QR code with your Authenticator app (e.g., Google Authenticator, FreeOTP),\n' +
          'or copy the secret below manually.'
        )
        .addFields({ name: 'Secret (base32)', value: `\`${secret.base32}\`` })
        .setImage('attachment://otp.png')
        .setColor(0x5865F2);

      return interaction.reply({
        embeds: [embed],
        files: [attachment],
        ephemeral: true
      });

    } else if (sub === 'verify') {
      const userSecret = secretStore.get(userId);
      if (!userSecret) {
        return interaction.reply({
          content: '❌ You need to run `/otp generate` first to set up your secret!',
          ephemeral: true
        });
      }
      const code = interaction.options.getString('code');
      const valid = speakeasy.totp.verify({
        secret:   userSecret,
        encoding: 'base32',
        token:    code,
        window:   1
      });
      return interaction.reply({
        content: valid
          ? '✅ Code is valid! Your authenticator is set up correctly.'
          : '❌ Invalid or expired code. Please try again.',
        ephemeral: true
      });
    }
  },

  // Expose the stores so other commands can use them:
  secretStore,
  emailCodeStore
};
