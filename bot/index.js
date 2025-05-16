const { Client, GatewayIntentBits } = require('discord.js');
require('dotenv').config();
const setupCommands = require('./utils/commandRouter');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMessages
    ]
});

client.once('ready', () => {
    console.log(`🟢 Bot logged in as ${client.user.tag}`);
});

client.on('messageCreate', async (message) => {
    if (message.author.bot || !message.content.startsWith('!')) return;
    try {
        await setupCommands(message);
    } catch (err) {
        console.error("⚠️ Command Error:", err);
        message.reply("❌ Something went wrong while processing your command.");
    }
});

client.login(process.env.DISCORD_TOKEN);
