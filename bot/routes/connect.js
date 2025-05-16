// routes/connect.js
const express = require('express');
const router = express.Router();
const { getVerificationRequest } = require('../services/verification.js');
const { linkAccount }            = require('../services/linkStore.js');

/**
 * Step 1: User clicks the link from Discord
 *   https://your-app.com/auth/discord?token=XYZ
 */
router.get('/auth/discord', async (req, res) => {
  const { token } = req.query;
  if (!token) return res.status(400).send('Missing token');

  // Fetch & validate the token
  const verification = await getVerificationRequest(token);
  if (!verification) {
    return res.status(400).render('error', { message: 'Invalid or expired link.' });
  }

  // Save to session so we can use it after login
  req.session.discordVerificationToken = token;
  req.session.discordUserId          = verification.discordUserId;

  // If they're not logged in, redirect to your normal login
  if (!req.user) {
    // After login, you should redirect back here
    return res.redirect(`/login?redirect=/auth/discord/callback`);
  }

  // Already logged in → finish the callback
  res.redirect('/auth/discord/callback');
});

/**
 * Step 2: Callback after they log in
 */
router.get('/auth/discord/callback', async (req, res) => {
  const { discordVerificationToken, discordUserId } = req.session;
  const stellarUser = req.user && req.user.id;

  if (!discordVerificationToken || !discordUserId || !stellarUser) {
    return res.status(401).render('error', { message: 'Unauthorized or session expired.' });
  }

  try {
    // Link the accounts in our in-memory store (or DB)
    await linkAccount(discordUserId, stellarUser);
  } catch (err) {
    console.error('Error linking accounts:', err);
    return res.status(500).render('error', { message: 'Linking failed. Try again later.' });
  }

  // Clean up session
  delete req.session.discordVerificationToken;
  delete req.session.discordUserId;

  // Render a success page (or just send JSON)
  res.render('auth-success', {
    title: 'Account Linked',
    message: 'Your Discord has been successfully linked to your Stellar account!'
  });

  // Optionally notify them on Discord via your bot:
  // const discordClient = require('../bot'); // or however you import it
  // const user = await discordClient.users.fetch(discordUserId);
  // user.send('✅ Your accounts are now linked! You can run /balance, /transfer, etc.');
});

module.exports = router;
// This code handles the linking of Discord and Stellar accounts.