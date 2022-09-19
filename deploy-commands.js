const fs = require('node:fs');
const path = require('node:path');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord.js');
const {clientId, guildId, token} = require('./config.json');

//get arguments
const args = process.argv.slice(2);
if(args.length == 0)
{
	console.error('No argument entered. Valid arguments are guild, global, or both');
	process.exit(0);
}
else if(!((args[0] == 'guild') || (args[0] == 'global') || (args[0] == 'both')))
{
	console.log(args);
	console.error('Invalid argument entered. Valid arguments are guild, global, or both');
	process.exit(0);
}

//get js files in commands dir
const guildCommands = [];
const globalCommands = [];
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	try {
		if(command.global)
			globalCommands.push(command.data.toJSON());
		else
			guildCommands.push(command.data.toJSON());
	} catch (error) {
		console.error(error);
	}
}

const rest = new REST({ version: '10' }).setToken(token);

(async () => {
	try {
		if(args[0] == 'both' || args[0] == 'guild')
		{
			console.log(`Started refreshing ${guildCommands.length} application guild (/) commands.`);

			const data = await rest.put(
				Routes.applicationGuildCommands(clientId, guildId),
				{ body: guildCommands },
			);

			console.log(`Successfully reloaded ${data.length} application guild (/) commands.`);
		}
		if(args[0] == 'both' || args[0] == 'global')
		{
			console.log(`Started refreshing ${globalCommands.length} application global (/) commands.`);

			const data = await rest.put(
				Routes.applicationCommands(clientId),
				{ body: globalCommands },
			);

			console.log(`Successfully reloaded ${data.length} application global (/) commands.`);
		}
	} catch (error) {
		console.error(error);
	}
})();