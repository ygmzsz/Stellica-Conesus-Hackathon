// index.js
require('dotenv').config({ path: __dirname + '/.env' });
console.log('🔑 DISCORD_TOKEN:', process.env.DISCORD_TOKEN);
console.log('🔑 DISCORD_CLIENT_ID:', process.env.DISCORD_CLIENT_ID);
console.log('🔑 DISCORD_GUILD_ID:', process.env.DISCORD_GUILD_ID);
const { Client, GatewayIntentBits, Collection } = require('discord.js')
const fs = require('fs')
const path = require('path')

// 1) Create bot client
const client = new Client({ intents: [GatewayIntentBits.Guilds] })
client.commands = new Collection()

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
  console.log(`✅ Logged in as ${client.user.tag}`)
})

// 4) Handle slash‑commands
client.on('interactionCreate', async interaction => {
  if (!interaction.isCommand()) return

  const cmd = client.commands.get(interaction.commandName)
  if (!cmd) return

  try {
    await cmd.execute(interaction)
  } catch (err) {
    console.error(`Error executing ${interaction.commandName}:`, err)
    await interaction.reply({ content: '❌ Something went wrong.', ephemeral: true })
  }
})

// 5) Login using token from .env
client.login(process.env.DISCORD_TOKEN)
    .then(() => {
        console.log('✅ Bot is online')
    })
    .catch(err => {
        console.error('❌ Failed to login:', err)
    })