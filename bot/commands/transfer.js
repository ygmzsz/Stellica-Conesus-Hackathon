// bot/commands/transfer.js
const { SlashCommandBuilder, AttachmentBuilder, EmbedBuilder } = require('discord.js');
const requireLink  = require('../utils/linkGuard.js');
const { fetchStellarBalanceForDiscordUser, transferXLM } = require('../services/stellar.js');
const speakeasy    = require('speakeasy');
const QRCode       = require('qrcode');
// Reuse the same stores from otp.js
const { secretStore, emailCodeStore } = require('./otp');
const { sendEmailOTP } = require('../services/email.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('transfer')
    .setDescription('Transfer XLM to another user, protected by OTP.')
    .addUserOption(opt => 
      opt.setName('user')
         .setDescription('Recipient of the XLM')
         .setRequired(true))
    .addNumberOption(opt => 
      opt.setName('amount')
         .setDescription('Amount of XLM to send')
         .setRequired(true))
    .addStringOption(opt => 
      opt.setName('code')
         .setDescription('6-digit TOTP or email code')
         .setRequired(false))
    .addStringOption(opt => 
      opt.setName('email')
         .setDescription('Email to receive a one-time code if no TOTP')
         .setRequired(false)),

  async execute(interaction) {
    // 1️⃣ Ensure Discord–Stellar link exists
    if (!await requireLink(interaction)) return;

    const userId    = interaction.user.id;
    const recipient = interaction.options.getUser('user');
    const amount    = interaction.options.getNumber('amount');
    const code      = interaction.options.getString('code');
    const email     = interaction.options.getString('email');

    // 2️⃣ Prevent self-transfer
    if (recipient.id === userId) {
      return interaction.reply({ content: '🚫 You can’t send XLM to yourself!', ephemeral: true });
    }

    // 3️⃣ First‐time OTP setup: if no TOTP secret, generate QR
    if (!secretStore.has(userId)) {
      // Create a new TOTP secret
      const secret = speakeasy.generateSecret({
        length: 20,
        name: `Stellica:${interaction.user.username}`,
        issuer: 'StellicaBot'
      });
      // Store the base32 for later
      secretStore.set(userId, secret.base32);

      // Render QR code
      const qrBuffer = await QRCode.toBuffer(secret.otpauth_url);
      const attachment = new AttachmentBuilder(qrBuffer, { name: 'otp.png' });

      // Send embed with QR
      const embed = new EmbedBuilder()
        .setTitle('🔐 Set Up Your Authenticator')
        .setDescription(
          'Scan this QR code with your Authenticator app (Google Authenticator, FreeOTP, etc.).\n' +
          'After scanning, re-run your `/transfer` command with the `code:` option.'
        )
        .setImage('attachment://otp.png')
        .addFields({ name: 'Secret (base32)', value: `\`${secret.base32}\`` })
        .setColor(0x5865F2);

      return interaction.reply({ embeds: [embed], files: [attachment], ephemeral: true });
    }

    // 4️⃣ If user prefers email and no TOTP, send email code
    if (!secretStore.has(userId) && email) {
      const emailCode = Math.floor(100000 + Math.random() * 900000).toString();
      emailCodeStore.set(userId, emailCode);
      await sendEmailOTP(email, emailCode);
      return interaction.reply({
        content: `✉️ Sent one-time code to **${email}**. Please re-run:\n` +
                 `\`/transfer user:${recipient.username} amount:${amount} code:${emailCode}\``,
        ephemeral: true
      });
    }

    // 5️⃣ Now require a code argument
    if (!code) {
      return interaction.reply({
        content: '❗ Please provide your `code:` from your Authenticator app or email to proceed.',
        ephemeral: true
      });
    }

    // 6️⃣ Verify the code
    let valid = false;

    // TOTP path
    const secret = secretStore.get(userId);
    valid = speakeasy.totp.verify({
      secret,
      encoding: 'base32',
      token: code,
      window: 1
    });

    // Email path fallback
    if (!valid && emailCodeStore.has(userId)) {
      valid = (emailCodeStore.get(userId) === code);
      if (valid) emailCodeStore.delete(userId);
    }

    if (!valid) {
      return interaction.reply({ content: '❌ Invalid or expired code.', ephemeral: true });
    }

    // 7️⃣ Balance check
    const balance = await fetchStellarBalanceForDiscordUser(userId);
    if (amount > balance) {
      return interaction.reply({
        content: `❌ Insufficient funds (your balance: ${balance} XLM).`,
        ephemeral: true
      });
    }

    // 8️⃣ Execute the transfer
    try {
      await transferXLM(userId, recipient.id, amount);
      return interaction.reply({
        content: `✅ Successfully sent ${amount} XLM to ${recipient.username}!`,
        ephemeral: true
      });
    } catch (err) {
      console.error('Transfer error:', err);
      return interaction.reply({
        content: '❌ Transfer failed—please try again later.',
        ephemeral: true
      });
    }
  }
};
