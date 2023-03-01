const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	global:true,
	data: new SlashCommandBuilder()
		.setName('oldest-pinned')
		.setDescription('Displays the oldest pinned message in the channel'),
	async execute(interaction) {
		// Get the text channel where the command was run
		const channel = interaction.channel;

		// Fetch the pinned messages in the channel
		const pinnedMessages = await channel.messages.fetchPinned();

		if (pinnedMessages.size === 0) {
			await interaction.reply('There are no pinned messages in this channel');
			return;
		}

		// Sort the pinned messages by creation date in ascending order
		const sortedPinnedMessages = pinnedMessages.sort((a, b) => a.createdTimestamp - b.createdTimestamp);

		// Get the oldest pinned message and date
		const oldestPinnedMessage = sortedPinnedMessages.first();
		const messageDate = (oldestPinnedMessage.createdTimestamp-(oldestPinnedMessage.createdTimestamp%1000))/1000;

		var reply = `**Sent by:** ${oldestPinnedMessage.author.username}\n**Created at:** <t:${messageDate}:F>`
		if(oldestPinnedMessage.content)
		{
			reply += `\n**Content:** "${oldestPinnedMessage.content}"`
		}
		await interaction.reply(reply);
	},
};