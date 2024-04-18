const mcutil = require('../mcutil');

module.exports = {
	name: 'ready',
	once: true,
	execute(client) {
		console.log(`Ready! Logged in as ${client.user.tag}`);
		
		setInterval(() => {
			mcutil.checkMCStatus().then(({ online }) => {
			  mcutil.sendStatusDMs(client, online);
			});
		  }, 5 * 60 * 1000); // 5 minutes in milliseconds
	},
};