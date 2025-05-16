// index.js
require('dotenv').config({ path: __dirname + '/.env' });
console.log('🔑 DISCORD_TOKEN:', process.env.DISCORD_TOKEN);
console.log('🔑 DISCORD_CLIENT_ID:', process.env.DISCORD_CLIENT_ID);
console.log('🔑 DISCORD_GUILD_ID:', process.env.DISCORD_GUILD_ID);
const { Client, GatewayIntentBits, Collection } = require('discord.js')
const fs = require('fs')
const path = require('path')

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMessages
    ]
});

// 2) Dynamically load all command modules
const commandsPath = path.join(__dirname, 'commands')
for (const file of fs.readdirSync(commandsPath).filter(f => f.endsWith('.js'))) {
  const command = require(path.join(commandsPath, file))
  // each command file should export { data: SlashCommandBuilder, execute(interaction) }
  client.commands.set(command.data.name, command)
}
console.log('Loaded commands:', [...client.commands.keys()])

// 3) When bot is ready
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
