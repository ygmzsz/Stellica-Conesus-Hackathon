// bot/deploy-commands.js
require('dotenv').config();   // loads bot/.env
const fs   = require('fs');
const path = require('path');
const { REST, Routes } = require('discord.js');

const token    = process.env.DISCORD_TOKEN;
const clientId = process.env.DISCORD_CLIENT_ID;
const guildId  = process.env.DISCORD_GUILD_ID;
if (!token || !clientId || !guildId) {
  console.error('Missing DISCORD_* in .env'); process.exit(1);
}

// Look in ./commands (not bot/commands)
const commandsPath  = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(f => f.endsWith('.js'));

const commands = commandFiles.map(file => {
  const cmd = require(path.join(commandsPath, file));
  return cmd.data.toJSON();
});

const rest = new REST({ version: '10' }).setToken(token);
(async () => {
  console.log(`→ Registering ${commands.length} commands…`);
  console.log('→ Deploying commands to guild:', guildId);
  await rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: commands });
  console.log('✅ Commands registered!');
})();
