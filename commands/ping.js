const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	global:true,
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Replies with Pong!'),
	async execute(interaction) {
		await interaction.reply('Pong!');
	},
};