const { SlashCommandBuilder } = require('discord.js');
var isUserSignedIn = true; // This is a placeholder. Replace with actual logic to check if the user is signed in.
module.exports = {
	data: new SlashCommandBuilder()
		.setName('balance')
		.setDescription('Provides information about the user.'),
	async execute(interaction) {
		// interaction.user is the object representing the User who ran the command
		// interaction.member is the GuildMember object, which represents the user in the specific guild

        if (!isUserSignedIn === false) {
            await interaction.reply('❌ You need to sign in first. Use the `/connect` command.');
            return;
        }
        else if (isUserSignedIn === true) {
            await interaction.reply('✅ You are signed in.');
        }
		await interaction.reply(`This command was run by ${interaction.user.username}, who joined on ${interaction.member.joinedAt}.`);
	},
};