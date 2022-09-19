module.exports = {
	name: 'messageCreate',
	execute(message) {
		console.log(`${message.author.tag} said ${message.content}`);
	},
};