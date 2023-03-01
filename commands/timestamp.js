const { SlashCommandBuilder} = require('discord.js');

module.exports = {
	global:true,
	data: new SlashCommandBuilder()
		.setName('timestamp')
		.setDescription('Converts a date/time into a discord timestamp')
		.addSubcommand(subcommand =>
			subcommand.setName('now')
				.setDescription('The current time and date')
				.addStringOption(option =>
					option.setName('style')
						.setDescription('The style of the timestamp')
						.setRequired(false)
						.addChoices(
							{ name: 'Relative', value: ':R' },
							{ name: 'Short Time', value: ':t' },
							{ name: 'Long Time', value: ':T' },
							{ name: 'Short Date', value: ':d' },
							{ name: 'Long Date', value: ':D' },
							{ name: 'Short Date/Time', value: ':f' },
							{ name: 'Long Date/Time', value: ':F' }
						)
				)
		)
		.addSubcommand(subcommand =>
			subcommand.setName('unix')
				.setDescription('Unix Timestamp')
				.addIntegerOption(option =>
					option.setName('unixtime')
					.setDescription('Unix Time in Seconds')
					.setRequired(true)
				)
				.addStringOption(option =>
					option.setName('style')
						.setDescription('The style of the timestamp')
						.setRequired(false)
						.addChoices(
							{ name: 'Relative', value: ':R' },
							{ name: 'Short Time', value: ':t' },
							{ name: 'Long Time', value: ':T' },
							{ name: 'Short Date', value: ':d' },
							{ name: 'Long Date', value: ':D' },
							{ name: 'Short Date/Time', value: ':f' },
							{ name: 'Long Date/Time', value: ':F' }
						)
				)
		)
		.addSubcommand(subcommand =>
			subcommand.setName('deltatime')
				.setDescription('The current time and date + or - an amount.')
				.addIntegerOption(option =>
					option.setName('timeoffset')
					.setDescription('Positve integers are the future. Negative in the past')
					.setRequired(true)
				)
				.addStringOption(option =>
					option.setName('timeunit')
						.setDescription('The unit of time')
						.setRequired(true)
						.addChoices(
							{ name: 'Second', value: 's' },
							{ name: 'Minute', value: 'min' },
							{ name: 'Hour', value: 'h' },
							{ name: 'Day', value: 'd' },
						)
				)
				.addStringOption(option =>
					option.setName('style')
						.setDescription('The style of the timestamp')
						.setRequired(false)
						.addChoices(
							{ name: 'Relative', value: ':R' },
							{ name: 'Short Time', value: ':t' },
							{ name: 'Long Time', value: ':T' },
							{ name: 'Short Date', value: ':d' },
							{ name: 'Long Date', value: ':D' },
							{ name: 'Short Date/Time', value: ':f' },
							{ name: 'Long Date/Time', value: ':F' }
						)
				)
		),
	async execute(interaction) {
		
		var style = '';
		const subcommand = interaction.options.getSubcommand();
		
		if(!!interaction.options.getString('style'))
			style = interaction.options.getString('style');

		if(subcommand == 'now')
			await interaction.reply('<t:' + Math.floor(Date.now()/1000) + style + '>');
		else if (subcommand == 'unix')
			await interaction.reply('<t:' + interaction.options.getInteger('unixtime') + style + '>');
		else if(subcommand == 'deltatime')
		{
			const timeOffset = interaction.options.getInteger('timeoffset');
			const timeUnit = interaction.options.getString('timeunit');
			var offsetSec;

			switch(timeUnit){
				case 's':
					offsetSec = timeOffset
					break;
				case 'min':
					offsetSec = timeOffset * 60;
					break;
				case 'h':
					offsetSec = timeOffset * 3600;
					break;
				case 'd':
					offsetSec = timeOffset * 86400;
					break;
			}

			await interaction.reply('<t:' + (offsetSec + Math.floor(Date.now()/1000)) + style + '>');
		}
	},
};