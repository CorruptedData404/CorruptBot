const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	global:true,
	data: new SlashCommandBuilder()
		.setName('server')
		.setDescription('Server info'),
	async execute(interaction) {
		await interaction.reply(`Server name: ${interaction.guild.name}\nTotal members: ${interaction.guild.memberCount}`);
	},
};