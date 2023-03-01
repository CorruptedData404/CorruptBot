const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	global:true,
	data: new SlashCommandBuilder()
		.setName('randomemoji')
		.setDescription('Posts a random emoji')
		.addBooleanOption(option =>
			option
				.setName('server')
				.setDescription('Whether to use the server emojis')
				.setRequired(false)
		),
        async execute(interaction) {

            // Define a list of emote names
            var emojis = ['🤔', '🤨', '😐', '😑', '😶', '😏', '😒', '😞', '😔', '😟', '😕', '🙁', '☹️', '😣', '😖', '😫', '😩', '😤', '😠', '😡', '🤬', '🤯', '😵', '😴', '🤢', '🤮', '🤕', '🤒'];

            // Check if the server option was provided
            if (interaction.options.getBoolean('server')) {
                // Get the list of server emotes
                emojis = interaction.guild.emojis.cache
                    .map((e) => `${e}`)
            }
        
            // Select a random emote from the list
            const emoji = emojis[Math.floor(Math.random() * emojis.length)];
        
            // Post the emote in the channel
            await interaction.reply(emoji);
        },
};