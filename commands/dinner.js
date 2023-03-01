const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	global:true,
	data: new SlashCommandBuilder()
		.setName('dinner')
		.setDescription('Suggests a meal for dinner'),
	async execute(interaction) {
		const meals = [
			'Spaghetti',
			'Chicken Parmesan',
			'Beef Stir-Fry',
			'Vegetable Curry',
			'Pork Chops',
			'Grilled Cheese Sandwich',
			'Lasagna',
			'Pizza',
			'Taco Salad',
			'Baked Salmon',
			'Stuffed Peppers',
			'Roast Beef',
			'Quiche',
			'Pad Thai',
			'Nachos',
			'Mushroom Risotto',
			'Lamb Chops',
			'Kung Pao Chicken',
			'Jambalaya',
			'Irish Stew',
			'Hamburgers',
			'Gazpacho',
            'Falafel',
			'Eggplant Parmesan',
			'Dumplings',
			'Crab Cakes',
			'Borscht',
			'Artichoke Dip',
			'Ziti',
			'Yaki Soba',
			'Xacutti',
			'Wonton Soup',
			'Veal Marsala',
			'Udon Noodles',
			'Tandoori Chicken',
			'Split Pea Soup',
			'Roasted Turkey',
			'Quesadillas',
			'Paella',
			'Omelette',
			'Noodle Soup',
			'Minestrone',
			'Lentil Soup',
			'Kale Salad',
			'Jambon Beurre',
			'Irish Stew',
			'Huevos Rancheros',
			'Goulash',
			'Fried Rice',
			'Eggplant Rollatini',
			'Dal',
			'Cabbage Rolls',
			'Bouillabaisse',
			'Artichoke Salad'
		];
		const firstLetter = interaction.user.tag[0].toLowerCase();
		const matchingMeals = meals.filter(meal => meal[0].toLowerCase() === firstLetter);
		const suggestion = matchingMeals[Math.floor(Math.random() * matchingMeals.length)];
		await interaction.reply(`How about having ${suggestion} for dinner tonight?`);
	},
};
